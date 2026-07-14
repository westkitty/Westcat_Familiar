import { createEvidence } from './evidenceModel'
import type {
  ProjectCloseoutInput,
  ProjectSession,
  WorkspaceInspection
} from '../../shared/governance'
import type { ModeId } from '../types/mode'

export function beginProjectSession(
  inspection: WorkspaceInspection,
  modeId: ModeId,
  intendedOutcome: string,
  stoppingPoint: string,
  capabilityIds: string[]
): ProjectSession {
  const session: ProjectSession = {
    id: `session-${crypto.randomUUID()}`,
    workspaceId: inspection.workspacePath,
    workspacePath: inspection.workspacePath,
    startedAt: new Date().toISOString(),
    modeId,
    intendedOutcome: intendedOutcome.trim() || 'Inspect and define the next bounded action.',
    stoppingPoint: stoppingPoint.trim() || 'Stop after the stated outcome or the first material blocker.',
    workingTreeDirty: inspection.workingTreeDirty,
    handoffFiles: inspection.handoffFiles,
    provenanceIds: [],
    capabilityIds,
    filesChanged: [],
    validationResults: [],
    failedApproaches: [],
    unresolvedReasoning: [],
    evidence: createEvidence(
      'observed',
      'Project entry was created from a user-selected folder and live read-only inspection.',
      'project entry ritual',
      { observedAt: inspection.checkedAt }
    )
  }

  if (inspection.branch !== undefined) session.branch = inspection.branch
  return session
}

export function closeProjectSession(
  session: ProjectSession,
  input: ProjectCloseoutInput
): ProjectSession {
  return {
    ...session,
    closedAt: new Date().toISOString(),
    closeoutSummary: input.summary.trim() || 'Session closed without a full handoff.',
    nextAction: input.nextAction.trim() || 'Reinspect the project before continuing.',
    validationResults: input.validationResults,
    failedApproaches: input.failedApproaches,
    unresolvedReasoning: input.unresolvedReasoning
  }
}

export function recoverInterruptedSessions(
  sessions: readonly ProjectSession[],
  now = new Date().toISOString()
): ProjectSession[] {
  return sessions.map((session) => {
    if (session.closedAt !== undefined || session.interruptedAt !== undefined) return session
    return { ...session, interruptedAt: now }
  })
}
