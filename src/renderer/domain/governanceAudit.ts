import { createEvidence, isEvidenceExpired } from './evidenceModel'
import { capabilityStateAt } from './capabilityTruth'
import type {
  ConstitutionalFinding,
  EvidenceWhisper,
  GovernanceState,
  ProvenanceRecord
} from '../../shared/governance'

export interface GovernanceAuditInputs {
  state: GovernanceState
  currentWhisper: EvidenceWhisper | null
}

type AuditRule = (inputs: GovernanceAuditInputs) => ConstitutionalFinding[]

function finding(
  law: string,
  severity: ConstitutionalFinding['severity'],
  affectedComponent: string,
  remediation: string,
  reason: string,
  regressionTestReference?: string,
  provenanceId?: string
): ConstitutionalFinding {
  const result: ConstitutionalFinding = {
    id: `finding-${crypto.randomUUID()}`,
    law,
    severity,
    evidence: createEvidence('observed', reason, 'governance self-audit'),
    affectedComponent,
    remediation,
    automaticallyRepairable: false,
    createdAt: new Date().toISOString(),
    status: 'open'
  }

  if (regressionTestReference !== undefined) result.regressionTestReference = regressionTestReference
  if (provenanceId !== undefined) result.provenanceId = provenanceId
  return result
}

function auditProvenance(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  const results: ConstitutionalFinding[] = []

  for (const record of inputs.state.provenance) {
    if (record.evidence.length === 0) {
      results.push(finding('No False Certainty', 'high', 'command provenance', 'Attach at least one evidence claim.', `Action ${record.id} has no evidence.`, 'governanceAudit.test.ts', record.id))
    }

    if (record.status === 'succeeded' && record.permissionDecision.outcome !== 'allowed') {
      results.push(finding('Mode Changes Behavior', 'critical', 'policy evaluator', 'Do not execute until the policy outcome is allowed.', `Action ${record.id} succeeded after ${record.permissionDecision.outcome}.`, 'governanceAudit.test.ts', record.id))
    }

    if (record.permissionDecision.actionKind === 'destructive' && record.status === 'succeeded' && record.approvalEvents.length === 0) {
      results.push(finding('The Project Must Be Auditable', 'critical', 'approval trail', 'Require and record explicit approval.', `Destructive action ${record.id} has no approval event.`, 'governanceAudit.test.ts', record.id))
    }

    if (record.selectedEngine === 'fable' && record.routingDecision.trim().length < 12) {
      results.push(finding('Fable Is Scarce', 'high', 'command router', 'Record a specific Fable routing justification.', `Fable action ${record.id} lacks adequate justification.`, 'governanceAudit.test.ts', record.id))
    }

    if (provenanceHasMockPresentedAsReal(record)) {
      results.push(finding('No False Certainty', 'critical', 'command provenance', 'Prefix the output summary with mocked and expose the evidence class.', `Action ${record.id} contains mocked evidence but its output is presented as ordinary success.`, 'governanceAudit.test.ts', record.id))
    }
  }
  return results
}

function auditSessionLinks(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  const knownProvenance = new Set(inputs.state.provenance.map((record) => record.id))
  const results: ConstitutionalFinding[] = []

  for (const session of inputs.state.sessions) {
    for (const provenanceId of session.provenanceIds) {
      if (!knownProvenance.has(provenanceId)) {
        results.push(finding('The Project Must Be Auditable', 'high', 'project session', 'Restore or remove the broken provenance reference.', `Session ${session.id} references missing action ${provenanceId}.`, 'governanceAudit.test.ts'))
      }
    }
  }
  return results
}

function auditMemory(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  return inputs.state.memories.flatMap((memory) => {
    if (memory.authority === 'inferred' && memory.enabled && memory.lastConfirmedAt === undefined) {
      return [finding('Local First Means Local First', 'high', 'behavioral memory', 'Disable the rule until the user approves it.', `Inferred memory ${memory.id} is enabled without confirmation.`, 'governanceAudit.test.ts')]
    }
    return []
  })
}

function auditCapabilities(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  return inputs.state.capabilities.flatMap((capability) => {
    if (capabilityStateAt(capability) === 'stale' && capability.state === 'available') {
      return [finding('No False Certainty', 'warning', 'capability truth', 'Rerun the safe capability check before presenting it as current.', `Capability ${capability.id} is stale but stored as available.`, 'governanceAudit.test.ts')]
    }
    return []
  })
}

function auditWhisper(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  if (inputs.currentWhisper === null) return []
  if (isEvidenceExpired(inputs.currentWhisper.evidence)) {
    return [finding('No False Certainty', 'warning', 'familiar whisper', 'Remove or re-observe the stale whisper.', `Whisper ${inputs.currentWhisper.id} has expired evidence.`, 'governanceAudit.test.ts')]
  }
  return []
}

function auditDataIntegrity(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  const collections: Array<readonly { id: string }[]> = [
    inputs.state.provenance,
    inputs.state.unfinishedWork,
    inputs.state.interruptionContracts,
    inputs.state.capabilities,
    inputs.state.workspaceAssociations,
    inputs.state.sessions,
    inputs.state.memories,
    inputs.state.findings
  ]
  const ids = collections.flatMap((collection) => collection.map((entry) => entry.id))
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)

  if (duplicateIds.length === 0) return []
  return [finding('The Project Must Be Auditable', 'critical', 'Self-Audit data integrity', 'Regenerate duplicate identifiers and repair references.', `Duplicate governance identifiers: ${[...new Set(duplicateIds)].join(', ')}.`, 'governanceAudit.test.ts')]
}

export const GOVERNANCE_AUDIT_RULES: readonly AuditRule[] = [
  auditProvenance,
  auditSessionLinks,
  auditMemory,
  auditCapabilities,
  auditWhisper,
  auditDataIntegrity
]

export function runGovernanceAudit(inputs: GovernanceAuditInputs): ConstitutionalFinding[] {
  return GOVERNANCE_AUDIT_RULES.flatMap((rule) => rule(inputs))
}

export function provenanceHasMockPresentedAsReal(record: ProvenanceRecord): boolean {
  const mocked = record.evidence.some((entry) => entry.classification === 'mocked')
  return mocked && record.outputSummary !== undefined && !/\b(mock|mocked|pretend)\b/i.test(record.outputSummary)
}
