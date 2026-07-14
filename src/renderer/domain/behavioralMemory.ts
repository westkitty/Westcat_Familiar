import { isEvidenceExpired } from './evidenceModel'
import type { ActionKind, BehavioralMemoryRule } from '../../shared/governance'
import type { ModeId } from '../types/mode'

export interface MemoryContext {
  workspaceId?: string
  modeId: ModeId
  actionKind: ActionKind
}

export function applicableMemoryRules(
  memories: readonly BehavioralMemoryRule[],
  context: MemoryContext,
  now = Date.now()
): BehavioralMemoryRule[] {
  return memories.filter((memory) => {
    if (!memory.enabled || isEvidenceExpired(memory.evidence, now)) return false
    if (memory.expiresAt !== undefined && Date.parse(memory.expiresAt) <= now) return false

    if (memory.scope === 'global') return true
    if (memory.scope === 'project') return memory.scopeValue === context.workspaceId
    if (memory.scope === 'mode') return memory.scopeValue === context.modeId
    return memory.scopeValue === context.actionKind
  })
}

export function canApplyDurably(memory: BehavioralMemoryRule): boolean {
  if (memory.contradictionState !== 'clear') return false
  if (memory.authority === 'inferred' && memory.lastConfirmedAt === undefined) return false
  return memory.enabled
}
