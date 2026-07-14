import { createEvidence } from './evidenceModel'
import type {
  ActionPermissionDecision,
  ProvenanceRecord,
  ProvenanceStatus
} from '../../shared/governance'
import type { FamiliarStateId } from '../types/familiar'
import type { ModeId } from '../types/mode'

const SECRET_PATTERNS = [
  /\b(api[_-]?key|token|password|passwd|secret|authorization)\b\s*[:=]\s*([^\s,;]+)/gi,
  /\b(bearer)\s+[a-z0-9._~+/-]+=*/gi,
  /\b(sk-[a-z0-9_-]{8,})\b/gi
]

export function redactSensitiveText(value: string): string {
  return SECRET_PATTERNS.reduce((redacted, pattern) => {
    pattern.lastIndex = 0
    return redacted.replace(pattern, (_match, label: string | undefined) => {
      return label === undefined ? '[REDACTED]' : `${label}=[REDACTED]`
    })
  }, value)
}

export interface BeginProvenanceInputs {
  request: string
  modeId: ModeId
  familiarState: FamiliarStateId
  routingDecision: string
  permissionDecision: ActionPermissionDecision
  selectedEngine: string
  resourcePaths?: string[]
  capabilityIds?: string[]
  appliedMemoryIds?: string[]
}

export function beginProvenance(inputs: BeginProvenanceInputs): ProvenanceRecord {
  const request = redactSensitiveText(inputs.request.trim())
  return {
    id: `action-${crypto.randomUUID()}`,
    originalRequest: request,
    normalizedRequest: request.toLowerCase().replace(/\s+/g, ' '),
    modeId: inputs.modeId,
    familiarState: inputs.familiarState,
    routingDecision: inputs.routingDecision,
    permissionDecision: inputs.permissionDecision,
    evidence: [createEvidence('session_memory', 'Action was proposed in this session.', 'command provenance')],
    capabilityIds: inputs.capabilityIds ?? [],
    selectedEngine: inputs.selectedEngine,
    resourcePaths: inputs.resourcePaths ?? [],
    commands: [],
    startedAt: new Date().toISOString(),
    status: inputs.permissionDecision.outcome === 'blocked' ? 'blocked' : 'proposed',
    errors: [],
    fallbacks: [],
    relatedUnfinishedIds: [],
    appliedMemoryIds: inputs.appliedMemoryIds ?? [],
    approvalEvents: [],
    cancellationEvents: []
  }
}

export function completeProvenance(
  record: ProvenanceRecord,
  status: Extract<ProvenanceStatus, 'succeeded' | 'failed' | 'blocked' | 'cancelled'>,
  outputSummary?: string,
  error?: string,
  fallback?: string
): ProvenanceRecord {
  const updated: ProvenanceRecord = {
    ...record,
    status,
    completedAt: new Date().toISOString(),
    outputSummary: outputSummary === undefined ? record.outputSummary : redactSensitiveText(outputSummary),
    errors: error === undefined ? record.errors : [...record.errors, redactSensitiveText(error)],
    fallbacks: fallback === undefined ? record.fallbacks : [...record.fallbacks, redactSensitiveText(fallback)]
  }
  return updated
}
