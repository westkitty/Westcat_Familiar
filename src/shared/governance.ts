import type { FamiliarStateId } from '../renderer/types/familiar'
import type { ModeId } from '../renderer/types/mode'

export const EVIDENCE_CLASSES = [
  'observed',
  'strongly_inferred',
  'weakly_inferred',
  'session_memory',
  'durable_memory',
  'mocked',
  'contradicted',
  'unavailable',
  'unknown'
] as const

export type EvidenceClass = (typeof EVIDENCE_CLASSES)[number]

export interface EvidenceClaim {
  classification: EvidenceClass
  reason: string
  sourceReference: string
  observedAt: string
  expiresAt?: string
  contradictionReferences?: string[]
  confidence?: number
}

export interface EvidenceWhisper {
  id: string
  message: string
  evidence: EvidenceClaim
  relatedActionId?: string
  relatedContradictionId?: string
  inspectionAvailable: boolean
  actionable: boolean
}

export type ActionPermissionOutcome =
  | 'allowed'
  | 'blocked'
  | 'requires_approval'
  | 'requires_additional_evidence'
  | 'requires_capability'
  | 'requires_mode_change'

export type ActionKind =
  | 'inspect'
  | 'route_command'
  | 'modify_project'
  | 'destructive'
  | 'rewrite_canon'
  | 'invoke_fable'
  | 'generate_image'
  | 'interrupt'
  | 'switch_mode'
  | 'close_project'

export interface ActionPermissionDecision {
  outcome: ActionPermissionOutcome
  reason: string
  modeId: ModeId
  actionKind: ActionKind
  evaluatedAt: string
  requiredCapabilityId?: string
  evidence: EvidenceClaim
}

export type ProvenanceStatus = 'proposed' | 'running' | 'succeeded' | 'failed' | 'blocked' | 'cancelled'

export interface ProvenanceCommand {
  command: string
  state: 'proposed' | 'executed'
  approvalId?: string
}

export interface ProvenanceRecord {
  id: string
  originalRequest: string
  normalizedRequest: string
  modeId: ModeId
  familiarState: FamiliarStateId
  routingDecision: string
  permissionDecision: ActionPermissionDecision
  evidence: EvidenceClaim[]
  capabilityIds: string[]
  selectedEngine: string
  resourcePaths: string[]
  commands: ProvenanceCommand[]
  startedAt: string
  completedAt?: string
  status: ProvenanceStatus
  outputSummary?: string
  errors: string[]
  fallbacks: string[]
  uncertainty?: string
  relatedUnfinishedIds: string[]
  appliedMemoryIds: string[]
  approvalEvents: string[]
  cancellationEvents: string[]
}

export type UnfinishedWorkType =
  | 'unanswered_question'
  | 'context_packet'
  | 'failed_command'
  | 'blocked_task'
  | 'promised_action'
  | 'unclean_session'
  | 'user_marked'

export type Recoverability = 'high' | 'medium' | 'low'
export type Urgency = 'critical' | 'high' | 'normal' | 'low'

export interface UnfinishedWorkItem {
  id: string
  type: UnfinishedWorkType
  title: string
  description: string
  createdAt: string
  lastActivityAt: string
  workspaceId?: string
  provenanceId?: string
  recoverability: Recoverability
  urgency: Urgency
  blocking: boolean
  completedAt?: string
  dismissedAt?: string
  snoozedUntil?: string
  reopenedAt?: string
  evidence: EvidenceClaim
  suggestedNextAction: string
}

export type InterruptionTrigger =
  | 'command_failure'
  | 'task_blocked'
  | 'approved_file_changed'
  | 'unfinished_after_session'
  | 'approval_required'
  | 'routine_reminder'

export interface InterruptionContract {
  id: string
  scope: 'global' | 'project'
  workspaceId?: string
  allowedTriggers: InterruptionTrigger[]
  forbiddenTriggers: InterruptionTrigger[]
  createdAt: string
  expiresAt?: string
  maximumNudges: number
  nudgeCount: number
  quietUntil?: string
  priority: number
  suppressInCrisis: boolean
  summary: string
  cancelledAt?: string
}

export type CapabilityState = 'available' | 'unavailable' | 'stale' | 'mocked' | 'unsupported' | 'unknown'

export interface CapabilityObservation {
  id: string
  workspaceId?: string
  label: string
  state: CapabilityState
  evidence: EvidenceClaim
  observationMethod: string
  lastCheckedAt: string
  expiresAt: string
  failureReason?: string
  remediationHint?: string
  environment: string
  safeToRerun: boolean
}

export interface WorkspaceAssociation {
  id: string
  workspacePath: string
  label: string
  kind: 'repository' | 'folder' | 'document' | 'url' | 'log' | 'image_folder'
  createdAt: string
  expiresAt?: string
  sessionOnly: boolean
  evidence: EvidenceClaim
  suggestedActions: string[]
  deletedAt?: string
}

export interface ProjectSession {
  id: string
  workspaceId: string
  workspacePath: string
  startedAt: string
  closedAt?: string
  interruptedAt?: string
  modeId: ModeId
  intendedOutcome: string
  stoppingPoint: string
  branch?: string
  workingTreeDirty?: boolean
  handoffFiles: string[]
  provenanceIds: string[]
  capabilityIds: string[]
  filesChanged: string[]
  validationResults: string[]
  failedApproaches: string[]
  unresolvedReasoning: string[]
  nextAction?: string
  closeoutSummary?: string
  evidence: EvidenceClaim
}

export type MemoryAuthority = 'user_authored' | 'user_approved' | 'inferred'

export interface BehavioralMemoryRule {
  id: string
  rule: string
  scope: 'global' | 'project' | 'mode' | 'action_type'
  scopeValue?: string
  source: string
  evidence: EvidenceClaim
  createdAt: string
  lastConfirmedAt?: string
  expiresAt?: string
  applicationCount: number
  contradictionState: 'clear' | 'contradicted' | 'review_required'
  authority: MemoryAuthority
  enabled: boolean
}

export type AuditSeverity = 'info' | 'warning' | 'high' | 'critical'

export interface ConstitutionalFinding {
  id: string
  law: string
  severity: AuditSeverity
  evidence: EvidenceClaim
  affectedComponent: string
  remediation: string
  automaticallyRepairable: boolean
  createdAt: string
  status: 'open' | 'resolved' | 'accepted'
  regressionTestReference?: string
  provenanceId?: string
}

export interface GovernanceState {
  schemaVersion: 1
  provenance: ProvenanceRecord[]
  unfinishedWork: UnfinishedWorkItem[]
  interruptionContracts: InterruptionContract[]
  capabilities: CapabilityObservation[]
  workspaceAssociations: WorkspaceAssociation[]
  sessions: ProjectSession[]
  memories: BehavioralMemoryRule[]
  findings: ConstitutionalFinding[]
  lastRecoveryNotice?: string
}

export interface WorkspaceInspection {
  workspacePath: string
  label: string
  checkedAt: string
  exists: boolean
  readable: boolean
  writable: boolean
  repository: boolean
  branch?: string
  workingTreeDirty?: boolean
  gitAvailable: boolean
  nodeAvailable: boolean
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun'
  packageManagerAvailable?: boolean
  dependenciesInstalled: boolean
  buildScriptAvailable: boolean
  typecheckScriptAvailable: boolean
  handoffFiles: string[]
  errors: string[]
}

export interface ProjectCloseoutInput {
  summary: string
  nextAction: string
  validationResults: string[]
  failedApproaches: string[]
  unresolvedReasoning: string[]
}

export interface HandoffWriteResult {
  path: string
  appended: boolean
  writtenAt: string
}
