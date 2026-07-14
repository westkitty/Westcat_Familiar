import { describe, expect, it } from 'vitest'
import { createEvidence, isEvidenceExpired } from '../src/renderer/domain/evidenceModel'
import { evaluateActionPolicy } from '../src/renderer/domain/policyEvaluator'
import { resolveInterruption } from '../src/renderer/domain/interruptionContracts'
import { capabilityStateAt } from '../src/renderer/domain/capabilityTruth'
import { applicableMemoryRules, canApplyDurably } from '../src/renderer/domain/behavioralMemory'
import { selectMostUsefulUnfinished, totalUnfinishedPressure } from '../src/renderer/domain/unfinishedWork'
import { MODES } from '../src/renderer/domain/modeManager'
import type {
  BehavioralMemoryRule,
  CapabilityObservation,
  InterruptionContract,
  UnfinishedWorkItem
} from '../src/shared/governance'

describe('evidence and capability truth', () => {
  it('expires evidence and available capabilities deterministically', () => {
    const evidence = createEvidence('observed', 'checked', 'test', { expiresAt: '2026-01-01T00:00:00.000Z' })
    expect(isEvidenceExpired(evidence, Date.parse('2026-01-02T00:00:00.000Z'))).toBe(true)
    const capability: CapabilityObservation = {
      id: 'repo:read',
      label: 'Repository readable',
      state: 'available',
      evidence,
      observationMethod: 'test',
      lastCheckedAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-01-01T00:05:00.000Z',
      environment: '/tmp/repo',
      safeToRerun: true
    }
    expect(capabilityStateAt(capability, Date.parse('2026-01-01T00:06:00.000Z'))).toBe('stale')
  })
})

describe('mode policy', () => {
  const base = {
    inspectedBeforeModify: false,
    hasValidationPlan: false,
    userApproved: false,
    capabilities: [],
    applicableMemories: []
  }

  it('enforces canon, build, crisis, and Fable boundaries', () => {
    expect(evaluateActionPolicy({ ...base, modeId: 'canon', actionKind: 'rewrite_canon' }).outcome).toBe('requires_approval')
    expect(evaluateActionPolicy({ ...base, modeId: 'build', actionKind: 'modify_project' }).outcome).toBe('requires_additional_evidence')
    expect(evaluateActionPolicy({ ...base, modeId: 'crisis', actionKind: 'route_command' }).outcome).toBe('blocked')
    expect(evaluateActionPolicy({ ...base, modeId: 'crisis', actionKind: 'switch_mode' }).outcome).toBe('allowed')
    expect(MODES.crisis.drawerCommandIds).toEqual(['open-stack', 'open-audit'])
    expect(evaluateActionPolicy({ ...base, modeId: 'fable', actionKind: 'invoke_fable', fableJustification: 'vague' }).outcome).toBe('requires_additional_evidence')
  })
})

describe('interruption contracts', () => {
  const contract: InterruptionContract = {
    id: 'one-nudge',
    scope: 'global',
    allowedTriggers: ['task_blocked'],
    forbiddenTriggers: ['routine_reminder'],
    createdAt: '2026-01-01T00:00:00.000Z',
    maximumNudges: 1,
    nudgeCount: 0,
    priority: 10,
    suppressInCrisis: true,
    summary: 'One blocked-task nudge'
  }

  it('permits exactly its matching trigger and respects exhaustion and crisis', () => {
    expect(resolveInterruption([contract], 'task_blocked', 'work').allowed).toBe(true)
    expect(resolveInterruption([{ ...contract, nudgeCount: 1 }], 'task_blocked', 'work').allowed).toBe(false)
    expect(resolveInterruption([contract], 'routine_reminder', 'work').allowed).toBe(false)
    expect(resolveInterruption([contract], 'task_blocked', 'crisis').allowed).toBe(false)
  })
})

describe('memory scope and unfinished pressure', () => {
  const memory: BehavioralMemoryRule = {
    id: 'memory-1',
    rule: 'Inspect first',
    scope: 'project',
    scopeValue: '/repo/a',
    source: 'test',
    evidence: createEvidence('durable_memory', 'approved', 'test'),
    createdAt: '2026-01-01T00:00:00.000Z',
    lastConfirmedAt: '2026-01-01T00:00:00.000Z',
    applicationCount: 0,
    contradictionState: 'clear',
    authority: 'user_approved',
    enabled: true
  }

  it('applies memory only in scope and refuses unapproved inferred durability', () => {
    expect(applicableMemoryRules([memory], { workspaceId: '/repo/a', modeId: 'build', actionKind: 'inspect' })).toHaveLength(1)
    expect(applicableMemoryRules([memory], { workspaceId: '/repo/b', modeId: 'build', actionKind: 'inspect' })).toHaveLength(0)
    expect(canApplyDurably({ ...memory, authority: 'inferred', lastConfirmedAt: undefined })).toBe(false)
  })

  it('does not let trivial item count outweigh one important blocked task', () => {
    const baseItem: UnfinishedWorkItem = {
      id: 'base',
      type: 'user_marked',
      title: 'Minor',
      description: 'Minor',
      createdAt: '2026-07-14T00:00:00.000Z',
      lastActivityAt: '2026-07-14T00:00:00.000Z',
      recoverability: 'low',
      urgency: 'low',
      blocking: false,
      evidence: createEvidence('session_memory', 'test', 'test'),
      suggestedNextAction: 'Ignore'
    }
    const important: UnfinishedWorkItem = {
      ...baseItem,
      id: 'important',
      title: 'Blocked build',
      type: 'blocked_task',
      recoverability: 'high',
      urgency: 'high',
      blocking: true
    }
    const trivial = Array.from({ length: 12 }, (_, index) => ({ ...baseItem, id: `minor-${index}` }))
    expect(selectMostUsefulUnfinished([...trivial, important], Date.parse('2026-07-14T01:00:00.000Z'))?.id).toBe('important')
    expect(totalUnfinishedPressure([...trivial, important], Date.parse('2026-07-14T01:00:00.000Z'))).toBeLessThanOrEqual(100)
  })
})
