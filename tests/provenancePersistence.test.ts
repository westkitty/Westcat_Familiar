import { describe, expect, it } from 'vitest'
import { createEvidence } from '../src/renderer/domain/evidenceModel'
import { beginProvenance, completeProvenance, redactSensitiveText } from '../src/renderer/domain/provenance'
import { migrateGovernanceState } from '../src/renderer/state/governancePersistence'
import type { ActionPermissionDecision } from '../src/shared/governance'

const permission: ActionPermissionDecision = {
  outcome: 'allowed',
  reason: 'Test permits action.',
  modeId: 'dex',
  actionKind: 'route_command',
  evaluatedAt: '2026-07-14T00:00:00.000Z',
  evidence: createEvidence('strongly_inferred', 'test', 'test')
}

describe('provenance and redaction', () => {
  it('redacts secret-shaped values and distinguishes failure from fallback', () => {
    expect(redactSensitiveText('token=abc123 password: swordfish Bearer abc.def')).not.toContain('abc123')
    expect(redactSensitiveText('token=abc123 password: swordfish Bearer abc.def')).not.toContain('swordfish')
    const proposed = beginProvenance({
      request: 'Use token=abc123 to plan next',
      modeId: 'dex',
      familiarState: 'thinking',
      routingDecision: 'Primary local engine first.',
      permissionDecision: permission,
      selectedEngine: 'local_logic'
    })
    const completed = completeProvenance(proposed, 'succeeded', 'mocked fallback result', 'Primary unavailable', 'Mock seam used')
    expect(completed.originalRequest).toContain('[REDACTED]')
    expect(completed.errors).toEqual(['Primary unavailable'])
    expect(completed.fallbacks).toEqual(['Mock seam used'])
  })
})

describe('persistence migration and corruption recovery', () => {
  it('returns a safe empty state for malformed data', () => {
    const result = migrateGovernanceState('not-an-object')
    expect(result.state.schemaVersion).toBe(1)
    expect(result.state.provenance).toEqual([])
    expect(result.recoveryNotice).toMatch(/Malformed/)
  })

  it('migrates v0 and drops malformed records without rejecting valid ones', () => {
    const validMemory = {
      id: 'memory-1',
      rule: 'Inspect first',
      scope: 'global',
      source: 'test',
      evidence: createEvidence('durable_memory', 'test', 'test')
    }
    const result = migrateGovernanceState({ schemaVersion: 0, memories: [validMemory, { broken: true }] })
    expect(result.state.schemaVersion).toBe(1)
    expect(result.state.memories).toHaveLength(1)
    expect(result.state.lastRecoveryNotice).toMatch(/discarded 1 malformed/)
  })
})
