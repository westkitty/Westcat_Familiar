import type {
  InterruptionContract,
  InterruptionTrigger
} from '../../shared/governance'
import type { ModeId } from '../types/mode'

export interface InterruptionDecision {
  allowed: boolean
  reason: string
  contractId?: string
}

function isActive(contract: InterruptionContract, now: number): boolean {
  if (contract.cancelledAt !== undefined) return false
  if (contract.expiresAt !== undefined && Date.parse(contract.expiresAt) <= now) return false
  if (contract.quietUntil !== undefined && Date.parse(contract.quietUntil) > now) return false
  return contract.nudgeCount < contract.maximumNudges
}

export function resolveInterruption(
  contracts: readonly InterruptionContract[],
  trigger: InterruptionTrigger,
  modeId: ModeId,
  workspaceId?: string,
  now = Date.now()
): InterruptionDecision {
  if (modeId === 'crisis' && trigger !== 'command_failure' && trigger !== 'approval_required') {
    return { allowed: false, reason: 'Crisis mode suppresses nonessential interruptions.' }
  }

  const candidates = contracts
    .filter((contract) => isActive(contract, now))
    .filter((contract) => contract.scope === 'global' || contract.workspaceId === workspaceId)
    .filter((contract) => !contract.forbiddenTriggers.includes(trigger))
    .filter((contract) => contract.allowedTriggers.includes(trigger))
    .sort((left, right) => {
      if (left.priority !== right.priority) return right.priority - left.priority
      return left.createdAt.localeCompare(right.createdAt)
    })

  const selected = candidates[0]

  if (selected === undefined) {
    return { allowed: false, reason: `No active interruption contract permits ${trigger}.` }
  }

  return {
    allowed: true,
    reason: `Contract “${selected.summary}” permits ${trigger}.`,
    contractId: selected.id
  }
}
