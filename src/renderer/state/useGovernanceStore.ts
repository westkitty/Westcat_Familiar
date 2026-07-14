import { create } from 'zustand'
import { createEvidence } from '../domain/evidenceModel'
import { beginProjectSession, closeProjectSession, recoverInterruptedSessions } from '../domain/projectSessions'
import { capabilitiesFromInspection } from '../domain/capabilityTruth'
import { clearGovernanceState, EMPTY_GOVERNANCE_STATE, loadGovernanceState, saveGovernanceState } from './governancePersistence'
import type {
  BehavioralMemoryRule,
  CapabilityObservation,
  ConstitutionalFinding,
  GovernanceState,
  InterruptionContract,
  ProjectCloseoutInput,
  ProjectSession,
  ProvenanceRecord,
  Recoverability,
  UnfinishedWorkItem,
  UnfinishedWorkType,
  Urgency,
  WorkspaceAssociation,
  WorkspaceInspection
} from '../../shared/governance'
import type { ModeId } from '../types/mode'

const PROVENANCE_RETENTION = 250
const SESSION_RETENTION = 100

export interface NewUnfinishedWork {
  type: UnfinishedWorkType
  title: string
  description: string
  workspaceId?: string
  provenanceId?: string
  recoverability: Recoverability
  urgency: Urgency
  blocking: boolean
  suggestedNextAction: string
}

export interface NewMemoryRule {
  rule: string
  scope: BehavioralMemoryRule['scope']
  scopeValue?: string
  source: string
  authority: BehavioralMemoryRule['authority']
}

interface GovernanceActions {
  recordProvenance: (record: ProvenanceRecord) => void
  replaceProvenance: (record: ProvenanceRecord) => void
  clearProvenance: () => void
  addUnfinishedWork: (input: NewUnfinishedWork) => string
  completeUnfinishedWork: (id: string) => void
  dismissUnfinishedWork: (id: string) => void
  snoozeUnfinishedWork: (id: string, until: string) => void
  reopenUnfinishedWork: (id: string) => void
  upsertCapabilities: (capabilities: CapabilityObservation[]) => void
  addWorkspaceAssociation: (inspection: WorkspaceInspection) => WorkspaceAssociation
  deleteWorkspaceAssociation: (id: string) => void
  addInterruptionContract: (contract: Omit<InterruptionContract, 'id' | 'createdAt' | 'nudgeCount'>) => string
  cancelInterruptionContract: (id: string) => void
  updateInterruptionContract: (id: string, summary: string, maximumNudges: number) => void
  consumeInterruptionContract: (id: string) => void
  addMemoryRule: (input: NewMemoryRule) => string
  toggleMemoryRule: (id: string) => void
  updateMemoryRule: (id: string, rule: string) => void
  approveMemoryRule: (id: string) => void
  applyMemoryRules: (ids: string[]) => void
  deleteMemoryRule: (id: string) => void
  startProjectSession: (inspection: WorkspaceInspection, modeId: ModeId, intendedOutcome: string, stoppingPoint: string) => ProjectSession
  closeProjectSession: (id: string, input: ProjectCloseoutInput) => void
  linkSessionProvenance: (sessionId: string, provenanceId: string) => void
  restoreProjectSession: (id: string) => void
  markOpenSessionsInterrupted: () => void
  replaceFindings: (findings: ConstitutionalFinding[]) => void
  resetGovernance: () => void
}

export type GovernanceStore = GovernanceState & GovernanceActions

function updateAndPersist(
  set: (partial: Partial<GovernanceState>) => void,
  get: () => GovernanceStore,
  partial: Partial<GovernanceState>
): void {
  set(partial)
  const state = get()
  saveGovernanceState({
    schemaVersion: 1,
    provenance: state.provenance,
    unfinishedWork: state.unfinishedWork,
    interruptionContracts: state.interruptionContracts,
    capabilities: state.capabilities,
    workspaceAssociations: state.workspaceAssociations,
    sessions: state.sessions,
    memories: state.memories,
    findings: state.findings,
    lastRecoveryNotice: state.lastRecoveryNotice
  })
}

const loaded = loadGovernanceState()
const recoveredSessions = recoverInterruptedSessions(loaded.sessions)
const initial: GovernanceState = { ...loaded, sessions: recoveredSessions }

if (recoveredSessions.some((session, index) => session.interruptedAt !== loaded.sessions[index]?.interruptedAt)) {
  saveGovernanceState(initial)
}

export const useGovernanceStore = create<GovernanceStore>()((set, get) => ({
  ...initial,
  recordProvenance: (record) => {
    updateAndPersist(set, get, { provenance: [...get().provenance, record].slice(-PROVENANCE_RETENTION) })
  },
  replaceProvenance: (record) => {
    updateAndPersist(set, get, {
      provenance: get().provenance.map((entry) => entry.id === record.id ? record : entry)
    })
  },
  clearProvenance: () => {
    updateAndPersist(set, get, { provenance: [] })
  },
  addUnfinishedWork: (input) => {
    const now = new Date().toISOString()
    const item: UnfinishedWorkItem = {
      id: `unfinished-${crypto.randomUUID()}`,
      type: input.type,
      title: input.title,
      description: input.description,
      createdAt: now,
      lastActivityAt: now,
      recoverability: input.recoverability,
      urgency: input.urgency,
      blocking: input.blocking,
      evidence: createEvidence('session_memory', 'Recorded by a bounded local familiar workflow.', 'unfinished work ledger'),
      suggestedNextAction: input.suggestedNextAction
    }

    if (input.workspaceId !== undefined) item.workspaceId = input.workspaceId
    if (input.provenanceId !== undefined) item.provenanceId = input.provenanceId
    updateAndPersist(set, get, { unfinishedWork: [...get().unfinishedWork, item] })
    return item.id
  },
  completeUnfinishedWork: (id) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { unfinishedWork: get().unfinishedWork.map((item) => item.id === id ? { ...item, completedAt: now, lastActivityAt: now } : item) })
  },
  dismissUnfinishedWork: (id) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { unfinishedWork: get().unfinishedWork.map((item) => item.id === id ? { ...item, dismissedAt: now, lastActivityAt: now } : item) })
  },
  snoozeUnfinishedWork: (id, until) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { unfinishedWork: get().unfinishedWork.map((item) => item.id === id ? { ...item, snoozedUntil: until, lastActivityAt: now } : item) })
  },
  reopenUnfinishedWork: (id) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { unfinishedWork: get().unfinishedWork.map((item) => item.id === id ? { ...item, completedAt: undefined, dismissedAt: undefined, snoozedUntil: undefined, reopenedAt: now, lastActivityAt: now } : item) })
  },
  upsertCapabilities: (capabilities) => {
    const ids = new Set(capabilities.map((entry) => entry.id))
    updateAndPersist(set, get, { capabilities: [...get().capabilities.filter((entry) => !ids.has(entry.id)), ...capabilities] })
  },
  addWorkspaceAssociation: (inspection) => {
    const existing = get().workspaceAssociations.find((entry) => entry.workspacePath === inspection.workspacePath && entry.deletedAt === undefined)

    if (existing !== undefined) return existing
    const association: WorkspaceAssociation = {
      id: inspection.workspacePath,
      workspacePath: inspection.workspacePath,
      label: inspection.label,
      kind: inspection.repository ? 'repository' : 'folder',
      createdAt: inspection.checkedAt,
      sessionOnly: true,
      evidence: createEvidence('observed', 'The user selected this local folder for a project session.', 'workspace selection', { observedAt: inspection.checkedAt }),
      suggestedActions: inspection.repository
        ? ['inspect state', 'view branch', 'check uncommitted changes', 'run approved validation', 'forge handoff']
        : ['inventory selected folder', 'forge handoff']
    }
    updateAndPersist(set, get, { workspaceAssociations: [...get().workspaceAssociations, association] })
    return association
  },
  deleteWorkspaceAssociation: (id) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { workspaceAssociations: get().workspaceAssociations.map((entry) => entry.id === id ? { ...entry, deletedAt: now } : entry) })
  },
  addInterruptionContract: (input) => {
    const contract: InterruptionContract = {
      ...input,
      id: `contract-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      nudgeCount: 0
    }
    updateAndPersist(set, get, { interruptionContracts: [...get().interruptionContracts, contract] })
    return contract.id
  },
  cancelInterruptionContract: (id) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { interruptionContracts: get().interruptionContracts.map((entry) => entry.id === id ? { ...entry, cancelledAt: now } : entry) })
  },
  updateInterruptionContract: (id, summary, maximumNudges) => {
    updateAndPersist(set, get, { interruptionContracts: get().interruptionContracts.map((entry) => entry.id === id ? { ...entry, summary: summary.trim() || entry.summary, maximumNudges: Math.max(entry.nudgeCount, maximumNudges) } : entry) })
  },
  consumeInterruptionContract: (id) => {
    updateAndPersist(set, get, { interruptionContracts: get().interruptionContracts.map((entry) => entry.id === id ? { ...entry, nudgeCount: entry.nudgeCount + 1 } : entry) })
  },
  addMemoryRule: (input) => {
    const now = new Date().toISOString()
    const memory: BehavioralMemoryRule = {
      id: `memory-${crypto.randomUUID()}`,
      rule: input.rule.trim(),
      scope: input.scope,
      source: input.source,
      evidence: createEvidence(input.authority === 'inferred' ? 'weakly_inferred' : 'durable_memory', 'Stored locally with explicit scope and deletion controls.', input.source),
      createdAt: now,
      lastConfirmedAt: input.authority === 'inferred' ? undefined : now,
      applicationCount: 0,
      contradictionState: input.authority === 'inferred' ? 'review_required' : 'clear',
      authority: input.authority,
      enabled: input.authority !== 'inferred'
    }

    if (input.scopeValue !== undefined) memory.scopeValue = input.scopeValue
    updateAndPersist(set, get, { memories: [...get().memories, memory] })
    return memory.id
  },
  toggleMemoryRule: (id) => {
    updateAndPersist(set, get, { memories: get().memories.map((entry) => entry.id === id ? { ...entry, enabled: !entry.enabled } : entry) })
  },
  updateMemoryRule: (id, rule) => {
    updateAndPersist(set, get, { memories: get().memories.map((entry) => entry.id === id ? { ...entry, rule: rule.trim() || entry.rule, lastConfirmedAt: new Date().toISOString() } : entry) })
  },
  approveMemoryRule: (id) => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { memories: get().memories.map((entry) => entry.id === id ? {
      ...entry,
      authority: 'user_approved',
      enabled: true,
      contradictionState: 'clear',
      lastConfirmedAt: now,
      evidence: createEvidence('durable_memory', 'The user explicitly approved this inferred rule for durable local use.', 'behavioral memory approval', { observedAt: now })
    } : entry) })
  },
  applyMemoryRules: (ids) => {
    const applied = new Set(ids)
    updateAndPersist(set, get, { memories: get().memories.map((entry) => applied.has(entry.id) ? { ...entry, applicationCount: entry.applicationCount + 1 } : entry) })
  },
  deleteMemoryRule: (id) => {
    updateAndPersist(set, get, { memories: get().memories.filter((entry) => entry.id !== id) })
  },
  startProjectSession: (inspection, modeId, intendedOutcome, stoppingPoint) => {
    const capabilities = capabilitiesFromInspection(inspection)
    get().upsertCapabilities(capabilities)
    get().addWorkspaceAssociation(inspection)
    const session = beginProjectSession(inspection, modeId, intendedOutcome, stoppingPoint, capabilities.map((entry) => entry.id))
    updateAndPersist(set, get, { sessions: [...get().sessions, session].slice(-SESSION_RETENTION) })
    return session
  },
  closeProjectSession: (id, input) => {
    const now = new Date().toISOString()
    const session = get().sessions.find((entry) => entry.id === id)
    updateAndPersist(set, get, {
      sessions: get().sessions.map((entry) => entry.id === id ? closeProjectSession(entry, input) : entry),
      workspaceAssociations: session === undefined
        ? get().workspaceAssociations
        : get().workspaceAssociations.map((entry) => entry.workspacePath === session.workspacePath && entry.sessionOnly ? { ...entry, expiresAt: now } : entry)
    })
  },
  linkSessionProvenance: (sessionId, provenanceId) => {
    updateAndPersist(set, get, { sessions: get().sessions.map((entry) => entry.id === sessionId && !entry.provenanceIds.includes(provenanceId) ? { ...entry, provenanceIds: [...entry.provenanceIds, provenanceId] } : entry) })
  },
  restoreProjectSession: (id) => {
    updateAndPersist(set, get, { sessions: get().sessions.map((entry) => entry.id === id ? { ...entry, interruptedAt: undefined } : entry) })
  },
  markOpenSessionsInterrupted: () => {
    const now = new Date().toISOString()
    updateAndPersist(set, get, { sessions: get().sessions.map((entry) => entry.closedAt === undefined && entry.interruptedAt === undefined ? { ...entry, interruptedAt: now } : entry) })
  },
  replaceFindings: (findings) => {
    updateAndPersist(set, get, { findings })
  },
  resetGovernance: () => {
    clearGovernanceState()
    set({ ...EMPTY_GOVERNANCE_STATE })
  }
}))

export function activeProjectSession(state: Pick<GovernanceState, 'sessions'>): ProjectSession | undefined {
  return [...state.sessions].reverse().find((session) => session.closedAt === undefined)
}
