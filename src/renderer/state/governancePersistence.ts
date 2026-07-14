import { persistence } from './persistence'
import type {
  BehavioralMemoryRule,
  CapabilityObservation,
  ConstitutionalFinding,
  GovernanceState,
  InterruptionContract,
  ProjectSession,
  ProvenanceRecord,
  UnfinishedWorkItem,
  WorkspaceAssociation
} from '../../shared/governance'

const GOVERNANCE_KEY = 'governance.v1'

export const EMPTY_GOVERNANCE_STATE: GovernanceState = {
  schemaVersion: 1,
  provenance: [],
  unfinishedWork: [],
  interruptionContracts: [],
  capabilities: [],
  workspaceAssociations: [],
  sessions: [],
  memories: [],
  findings: []
}

interface LoadResult {
  state: GovernanceState
  recoveryNotice?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasString(value: Record<string, unknown>, key: string): boolean {
  return typeof value[key] === 'string'
}

function hasId(value: unknown): value is { id: string } & Record<string, unknown> {
  return isRecord(value) && hasString(value, 'id')
}

function isProvenance(value: unknown): value is ProvenanceRecord {
  return hasId(value) && hasString(value, 'originalRequest') && hasString(value, 'status') && Array.isArray(value.evidence)
}

function isUnfinished(value: unknown): value is UnfinishedWorkItem {
  return hasId(value) && hasString(value, 'title') && hasString(value, 'type') && isRecord(value.evidence)
}

function isContract(value: unknown): value is InterruptionContract {
  return hasId(value) && Array.isArray(value.allowedTriggers) && typeof value.maximumNudges === 'number'
}

function isCapability(value: unknown): value is CapabilityObservation {
  return hasId(value) && hasString(value, 'state') && hasString(value, 'expiresAt') && isRecord(value.evidence)
}

function isAssociation(value: unknown): value is WorkspaceAssociation {
  return hasId(value) && hasString(value, 'workspacePath') && hasString(value, 'kind') && isRecord(value.evidence)
}

function isSession(value: unknown): value is ProjectSession {
  return hasId(value) && hasString(value, 'workspacePath') && hasString(value, 'startedAt') && isRecord(value.evidence)
}

function isMemory(value: unknown): value is BehavioralMemoryRule {
  return hasId(value) && hasString(value, 'rule') && hasString(value, 'scope') && isRecord(value.evidence)
}

function isFinding(value: unknown): value is ConstitutionalFinding {
  return hasId(value) && hasString(value, 'law') && hasString(value, 'severity') && isRecord(value.evidence)
}

function sanitizedArray<T>(value: unknown, guard: (entry: unknown) => entry is T): T[] {
  if (!Array.isArray(value)) return []
  return value.filter(guard)
}

export function migrateGovernanceState(raw: unknown): LoadResult {
  if (raw === null || raw === undefined) return { state: { ...EMPTY_GOVERNANCE_STATE } }

  if (!isRecord(raw)) {
    return {
      state: { ...EMPTY_GOVERNANCE_STATE },
      recoveryNotice: 'Malformed governance storage was ignored and reset to a safe empty state.'
    }
  }

  const schemaVersion = raw.schemaVersion

  if (schemaVersion !== 0 && schemaVersion !== 1) {
    return {
      state: { ...EMPTY_GOVERNANCE_STATE },
      recoveryNotice: 'Unsupported governance schema was ignored; no records were trusted.'
    }
  }

  const state: GovernanceState = {
    schemaVersion: 1,
    provenance: sanitizedArray(raw.provenance, isProvenance),
    unfinishedWork: sanitizedArray(raw.unfinishedWork, isUnfinished),
    interruptionContracts: sanitizedArray(raw.interruptionContracts, isContract),
    capabilities: sanitizedArray(raw.capabilities, isCapability),
    workspaceAssociations: sanitizedArray(raw.workspaceAssociations, isAssociation),
    sessions: sanitizedArray(raw.sessions, isSession),
    memories: sanitizedArray(raw.memories, isMemory),
    findings: sanitizedArray(raw.findings, isFinding)
  }

  const sourceCount = Object.values(raw).filter(Array.isArray).reduce((sum, value) => sum + value.length, 0)
  const acceptedCount = state.provenance.length + state.unfinishedWork.length + state.interruptionContracts.length + state.capabilities.length + state.workspaceAssociations.length + state.sessions.length + state.memories.length + state.findings.length

  if (sourceCount !== acceptedCount) {
    state.lastRecoveryNotice = `Recovered ${acceptedCount} valid governance records and discarded ${sourceCount - acceptedCount} malformed records.`
  } else if (schemaVersion === 0) {
    state.lastRecoveryNotice = 'Migrated governance storage from schema v0 to v1.'
  }
  return { state, recoveryNotice: state.lastRecoveryNotice }
}

export function loadGovernanceState(): GovernanceState {
  const result = migrateGovernanceState(persistence.get<unknown>(GOVERNANCE_KEY))
  return result.state
}

export function saveGovernanceState(state: GovernanceState): void {
  persistence.set(GOVERNANCE_KEY, state)
}

export function clearGovernanceState(): void {
  persistence.remove(GOVERNANCE_KEY)
}
