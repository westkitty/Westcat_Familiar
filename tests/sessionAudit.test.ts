import { describe, expect, it } from 'vitest'
import { beginProjectSession, closeProjectSession, recoverInterruptedSessions } from '../src/renderer/domain/projectSessions'
import { runGovernanceAudit } from '../src/renderer/domain/governanceAudit'
import { createEvidence } from '../src/renderer/domain/evidenceModel'
import { EMPTY_GOVERNANCE_STATE } from '../src/renderer/state/governancePersistence'
import type { GovernanceState, WorkspaceInspection } from '../src/shared/governance'

const inspection: WorkspaceInspection = {
  workspacePath: '/tmp/project',
  label: 'project',
  checkedAt: '2026-07-14T00:00:00.000Z',
  exists: true,
  readable: true,
  writable: true,
  repository: true,
  branch: 'codex/test',
  workingTreeDirty: true,
  gitAvailable: true,
  nodeAvailable: true,
  packageManager: 'npm',
  packageManagerAvailable: true,
  dependenciesInstalled: true,
  buildScriptAvailable: true,
  typecheckScriptAvailable: true,
  handoffFiles: ['HANDOFF.md'],
  errors: []
}

describe('project session lifecycle', () => {
  it('records entry evidence, recovers interruption, and closes with a bounded next action', () => {
    const session = beginProjectSession(inspection, 'build', 'Implement slice', 'Stop after tests', ['read'])
    expect(session.branch).toBe('codex/test')
    expect(session.workingTreeDirty).toBe(true)
    const interrupted = recoverInterruptedSessions([session], '2026-07-14T01:00:00.000Z')[0]
    expect(interrupted?.interruptedAt).toBe('2026-07-14T01:00:00.000Z')
    const closed = closeProjectSession(session, {
      summary: 'Implemented slice',
      nextAction: 'Run manual smoke test',
      validationResults: ['tests pass'],
      failedApproaches: [],
      unresolvedReasoning: []
    })
    expect(closed.nextAction).toBe('Run manual smoke test')
    expect(closed.closedAt).toBeDefined()
  })
})

describe('governance self-audit', () => {
  it('detects policy bypass, destructive action without approval, and unapproved inferred memory', () => {
    const state: GovernanceState = {
      ...EMPTY_GOVERNANCE_STATE,
      provenance: [{
        id: 'action-1',
        originalRequest: 'delete files',
        normalizedRequest: 'delete files',
        modeId: 'build',
        familiarState: 'working',
        routingDecision: 'unsafe test route',
        permissionDecision: {
          outcome: 'requires_approval',
          reason: 'Approval required.',
          modeId: 'build',
          actionKind: 'destructive',
          evaluatedAt: '2026-07-14T00:00:00.000Z',
          evidence: createEvidence('strongly_inferred', 'test', 'test')
        },
        evidence: [createEvidence('observed', 'test', 'test')],
        capabilityIds: [],
        selectedEngine: 'local_logic',
        resourcePaths: [],
        commands: [],
        startedAt: '2026-07-14T00:00:00.000Z',
        completedAt: '2026-07-14T00:01:00.000Z',
        status: 'succeeded',
        errors: [],
        fallbacks: [],
        relatedUnfinishedIds: [],
        appliedMemoryIds: [],
        approvalEvents: [],
        cancellationEvents: []
      }],
      memories: [{
        id: 'memory-1',
        rule: 'Assume deployment target',
        scope: 'global',
        source: 'inference',
        evidence: createEvidence('weakly_inferred', 'test', 'test'),
        createdAt: '2026-07-14T00:00:00.000Z',
        applicationCount: 0,
        contradictionState: 'clear',
        authority: 'inferred',
        enabled: true
      }]
    }
    const findings = runGovernanceAudit({ state, currentWhisper: null })
    expect(findings.some((finding) => finding.severity === 'critical' && finding.affectedComponent === 'policy evaluator')).toBe(true)
    expect(findings.some((finding) => finding.affectedComponent === 'approval trail')).toBe(true)
    expect(findings.some((finding) => finding.affectedComponent === 'behavioral memory')).toBe(true)
  })
})
