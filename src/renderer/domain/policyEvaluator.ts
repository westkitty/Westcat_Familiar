import { createEvidence } from './evidenceModel'
import type {
  ActionKind,
  ActionPermissionDecision,
  BehavioralMemoryRule,
  CapabilityObservation
} from '../../shared/governance'
import type { ModeId } from '../types/mode'

export interface PolicyInputs {
  modeId: ModeId
  actionKind: ActionKind
  inspectedBeforeModify: boolean
  hasValidationPlan: boolean
  userApproved: boolean
  fableJustification?: string
  requiredCapabilityId?: string
  capabilities: readonly CapabilityObservation[]
  applicableMemories: readonly BehavioralMemoryRule[]
}

function decision(
  inputs: PolicyInputs,
  outcome: ActionPermissionDecision['outcome'],
  reason: string
): ActionPermissionDecision {
  const result: ActionPermissionDecision = {
    outcome,
    reason,
    modeId: inputs.modeId,
    actionKind: inputs.actionKind,
    evaluatedAt: new Date().toISOString(),
    evidence: createEvidence(
      'strongly_inferred',
      reason,
      'central mode policy evaluator',
      { confidence: 0.98 }
    )
  }

  if (inputs.requiredCapabilityId !== undefined) result.requiredCapabilityId = inputs.requiredCapabilityId
  return result
}

export function evaluateActionPolicy(inputs: PolicyInputs): ActionPermissionDecision {
  if (inputs.modeId === 'crisis' && !['inspect', 'switch_mode', 'close_project'].includes(inputs.actionKind)) {
    return decision(inputs, 'blocked', 'Crisis mode permits only essential inspection and project closeout actions.')
  }

  if (inputs.requiredCapabilityId !== undefined) {
    const capability = inputs.capabilities.find((entry) => entry.id === inputs.requiredCapabilityId)

    if (capability === undefined || capability.state === 'unknown' || capability.state === 'stale') {
      return decision(inputs, 'requires_capability', `Capability ${inputs.requiredCapabilityId} must be checked first.`)
    }

    if (capability.state !== 'available') {
      return decision(inputs, 'blocked', `Capability ${capability.label} is ${capability.state}.`)
    }
  }

  if (inputs.actionKind === 'destructive' && !inputs.userApproved) {
    return decision(inputs, 'requires_approval', 'Destructive actions require explicit user approval in every mode.')
  }

  if (inputs.modeId === 'canon' && inputs.actionKind === 'rewrite_canon') {
    return decision(inputs, 'requires_approval', 'Canon changes remain proposed deltas until explicitly approved.')
  }

  if (inputs.modeId === 'build' && inputs.actionKind === 'modify_project') {
    if (!inputs.inspectedBeforeModify) {
      return decision(inputs, 'requires_additional_evidence', 'Build mode requires project inspection before modification.')
    }

    if (!inputs.hasValidationPlan) {
      return decision(inputs, 'requires_additional_evidence', 'Build mode requires a validation plan before modification.')
    }
  }

  if (inputs.modeId === 'necromancy' && ['modify_project', 'destructive'].includes(inputs.actionKind)) {
    return decision(inputs, 'requires_mode_change', 'Necromancy begins read-only; reconstruct project state before editing.')
  }

  if (inputs.actionKind === 'invoke_fable' && (inputs.fableJustification ?? '').trim().length < 12) {
    return decision(inputs, 'requires_additional_evidence', 'Fable requires a specific routing justification and a local fallback.')
  }

  if (inputs.modeId === 'image' && inputs.actionKind === 'generate_image' && !inputs.userApproved) {
    return decision(inputs, 'requires_approval', 'Image mode requires confirmation of locked visual invariants before generation.')
  }

  const contradictedMemory = inputs.applicableMemories.find(
    (memory) => memory.enabled && memory.contradictionState !== 'clear'
  )

  if (contradictedMemory !== undefined) {
    return decision(inputs, 'requires_additional_evidence', `Memory rule “${contradictedMemory.rule}” is contradicted and requires review.`)
  }

  return decision(inputs, 'allowed', `Mode ${inputs.modeId} permits this bounded ${inputs.actionKind} action.`)
}

export function classifyRequestedAction(request: string, routePath?: string): ActionKind {
  const normalized = request.toLowerCase()

  if (/\b(delete|erase|destroy|force|overwrite|reset)\b/.test(normalized)) return 'destructive'
  if (/\b(rewrite|change|replace)\b.*\b(canon|authoritative)\b/.test(normalized)) return 'rewrite_canon'
  if (/\b(edit|modify|patch|implement|write)\b/.test(normalized)) return 'modify_project'
  if (routePath === 'fable') return 'invoke_fable'
  return 'route_command'
}
