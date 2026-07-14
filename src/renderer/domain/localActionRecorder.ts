import { evaluateActionPolicy } from './policyEvaluator'
import { beginProvenance, completeProvenance } from './provenance'
import { createEvidence } from './evidenceModel'
import { activeProjectSession, useGovernanceStore } from '../state/useGovernanceStore'
import type { ActionKind } from '../../shared/governance'
import type { FamiliarStateId } from '../types/familiar'
import type { ModeId } from '../types/mode'

export function recordObservedLocalAction(
  request: string,
  modeId: ModeId,
  familiarState: FamiliarStateId,
  outputSummary: string,
  actionKind: ActionKind = 'route_command'
): string {
  const governance = useGovernanceStore.getState()
  const permission = evaluateActionPolicy({
    modeId,
    actionKind,
    inspectedBeforeModify: false,
    hasValidationPlan: false,
    userApproved: true,
    capabilities: governance.capabilities,
    applicableMemories: []
  })
  const proposed = beginProvenance({
    request,
    modeId,
    familiarState,
    routingDecision: 'Deterministic local familiar action.',
    permissionDecision: permission,
    selectedEngine: 'local_logic'
  })
  const withEvidence = {
    ...proposed,
    evidence: [...proposed.evidence, createEvidence('observed', outputSummary, 'local familiar action')]
  }
  const completed = completeProvenance(withEvidence, 'succeeded', outputSummary)
  governance.recordProvenance(completed)
  const session = activeProjectSession(governance)

  if (session !== undefined) governance.linkSessionProvenance(session.id, completed.id)
  return completed.id
}
