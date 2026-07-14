import { useState } from 'react'
import { evaluateActionPolicy } from '../../../domain/policyEvaluator'
import { beginProvenance, completeProvenance } from '../../../domain/provenance'
import { createEvidence, createWhisper } from '../../../domain/evidenceModel'
import { activeProjectSession, useGovernanceStore } from '../../../state/useGovernanceStore'
import { useFamiliarStore } from '../../../state/useFamiliarStore'
import { useModeStore } from '../../../state/useModeStore'
import { EvidenceClassBadge } from '../../common/EvidenceClassBadge'

export function ProjectSessionSection(): JSX.Element {
  const sessions = useGovernanceStore((state) => state.sessions)
  const capabilities = useGovernanceStore((state) => state.capabilities)
  const associations = useGovernanceStore((state) => state.workspaceAssociations)
  const session = activeProjectSession({ sessions })
  const activeAssociations = associations.filter((entry) => entry.deletedAt === undefined && (entry.expiresAt === undefined || Date.parse(entry.expiresAt) > Date.now()))
  const [outcome, setOutcome] = useState('Inspect the project and complete one bounded action.')
  const [stoppingPoint, setStoppingPoint] = useState('Stop after validation or the first material blocker.')
  const [closeSummary, setCloseSummary] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [writeHandoff, setWriteHandoff] = useState(false)
  const [manualPath, setManualPath] = useState('')

  const enterSelectedPath = async (selectedPath: string): Promise<void> => {
    const bridge = window.familiarBridge

    if (bridge === undefined) {
      setStatus('Electron workspace inspection is unavailable in this renderer.')
      return
    }
    setBusy(true)

    try {
      const modeId = useModeStore.getState().modeId
      const familiarState = useFamiliarStore.getState().stateId
      const permission = evaluateActionPolicy({
        modeId,
        actionKind: 'inspect',
        inspectedBeforeModify: false,
        hasValidationPlan: false,
        userApproved: true,
        capabilities,
        applicableMemories: []
      })
      let provenance = beginProvenance({
        request: `Inspect selected project ${selectedPath}`,
        modeId,
        familiarState,
        routingDecision: 'User-selected project entry inspection.',
        permissionDecision: permission,
        selectedEngine: 'electron_workspace_inspector',
        resourcePaths: [selectedPath]
      })
      useGovernanceStore.getState().recordProvenance(provenance)
      const inspection = await bridge.inspectWorkspace(selectedPath)
      const created = useGovernanceStore.getState().startProjectSession(
        inspection,
        modeId,
        outcome,
        stoppingPoint
      )
      provenance = completeProvenance(
        provenance,
        inspection.exists && inspection.readable ? 'succeeded' : 'failed',
        `Observed project metadata: repository=${inspection.repository}, branch=${inspection.branch ?? 'unknown'}, dirty=${inspection.workingTreeDirty ?? 'unknown'}.`,
        inspection.errors.length > 0 ? inspection.errors.join('; ') : undefined
      )
      useGovernanceStore.getState().replaceProvenance(provenance)
      useGovernanceStore.getState().linkSessionProvenance(created.id, provenance.id)
      useFamiliarStore.getState().setWhisper(createWhisper(
        `session: ${inspection.label}`,
        createEvidence('observed', 'The user selected this folder and Electron checked it live.', 'project entry', { observedAt: inspection.checkedAt }),
        { actionable: true, inspectionAvailable: true, relatedActionId: provenance.id }
      ))
      setStatus(`Entered ${created.workspacePath}. Inspection is recorded as observed.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown workspace inspection error.'
      setStatus(`Project entry failed: ${message}`)
      useGovernanceStore.getState().addUnfinishedWork({
        type: 'blocked_task',
        title: 'Project entry failed',
        description: message,
        recoverability: 'high',
        urgency: 'high',
        blocking: true,
        suggestedNextAction: 'Choose the project again or inspect Electron capability truth.'
      })
    } finally {
      setBusy(false)
    }
  }

  const handleEnter = async (): Promise<void> => {
    const bridge = window.familiarBridge

    if (bridge === undefined) {
      setStatus('Electron workspace inspection is unavailable in this renderer.')
      return
    }
    setBusy(true)
    setStatus('Selecting a bounded local project folder.')

    try {
      const selectedPath = await bridge.selectWorkspace()

      if (selectedPath === null) {
        setStatus('Project entry cancelled. Nothing was recorded.')
        setBusy(false)
        return
      }
      await enterSelectedPath(selectedPath)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown workspace inspection error.'
      setStatus(`Project picker failed: ${message}`)
      setBusy(false)
    } finally {
      if (window.familiarBridge === undefined) setBusy(false)
    }
  }

  const handleClose = async (): Promise<void> => {
    if (session === undefined) return
    const governance = useGovernanceStore.getState()
    const modeId = useModeStore.getState().modeId
    const fam = useFamiliarStore.getState()
    const permission = evaluateActionPolicy({
      modeId,
      actionKind: 'close_project',
      inspectedBeforeModify: true,
      hasValidationPlan: true,
      userApproved: writeHandoff,
      capabilities: governance.capabilities,
      applicableMemories: []
    })
    let provenance = beginProvenance({
      request: `Close project session ${session.workspacePath}`,
      modeId,
      familiarState: fam.stateId,
      routingDecision: writeHandoff ? 'Local closeout plus explicitly approved append-only handoff.' : 'Local closeout without workspace handoff.',
      permissionDecision: permission,
      selectedEngine: writeHandoff ? 'electron_append_handoff' : 'local_governance_store',
      resourcePaths: writeHandoff ? [`${session.workspacePath}/WESTCAT_HANDOFF.md`] : []
    })
    governance.recordProvenance(provenance)
    governance.linkSessionProvenance(session.id, provenance.id)
    let handoffResult = 'No workspace handoff requested.'

    if (writeHandoff) {
      try {
        if (window.familiarBridge === undefined) throw new Error('Electron handoff bridge unavailable.')
        const content = [
          `Summary: ${closeSummary.trim() || 'Session closed without a detailed summary.'}`,
          `Next bounded action: ${nextAction.trim() || 'Reinspect before continuing.'}`,
          `Mode: ${modeId}`,
          `Branch observed at entry: ${session.branch ?? 'unknown'}`,
          'Automatic commit or push: none.'
        ].join('\n\n')
        const result = await window.familiarBridge.appendProjectHandoff(session.workspacePath, content)
        handoffResult = `Appended ${result.path}; prior handoff content was preserved.`
        provenance = { ...provenance, approvalEvents: [...provenance.approvalEvents, `${result.writtenAt}: user approved append-only workspace handoff`] }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown handoff write failure.'
        handoffResult = `Handoff failed: ${message}`
        provenance = completeProvenance(provenance, 'failed', undefined, message)
        governance.replaceProvenance(provenance)
        governance.addUnfinishedWork({
          type: 'failed_command',
          title: 'Project handoff write failed',
          description: message,
          workspaceId: session.workspaceId,
          provenanceId: provenance.id,
          recoverability: 'high',
          urgency: 'high',
          blocking: false,
          suggestedNextAction: 'Inspect folder writability and retry the project closeout handoff.'
        })
        setStatus(`Session closeout retained locally; handoff failed: ${message}`)
      }
    }
    useGovernanceStore.getState().closeProjectSession(session.id, {
      summary: closeSummary,
      nextAction,
      validationResults: [],
      failedApproaches: [],
      unresolvedReasoning: closeSummary.trim() === '' ? ['Session closed without a full handoff summary.'] : []
    })

    if (provenance.status !== 'failed') {
      provenance = completeProvenance(provenance, 'succeeded', `Project session closed. ${handoffResult}`)
      governance.replaceProvenance(provenance)
    }

    if (nextAction.trim() !== '') {
      useGovernanceStore.getState().addUnfinishedWork({
        type: 'promised_action',
        title: `Next action for ${session.workspacePath.split('/').pop() ?? session.workspacePath}`,
        description: nextAction.trim(),
        workspaceId: session.workspaceId,
        recoverability: 'high',
        urgency: 'normal',
        blocking: false,
        suggestedNextAction: nextAction.trim()
      })
    }
    setStatus(`Project session closed. ${handoffResult} No commit or push occurred.`)
    setCloseSummary('')
    setNextAction('')
  }

  return (
    <section className="operations-section" aria-labelledby="project-session-heading">
      <h3 id="project-session-heading">Project entry and exit</h3>
      {session === undefined ? (
        <div className="operations-form">
          <label>
            Intended outcome
            <input value={outcome} onChange={(event) => setOutcome(event.target.value)} />
          </label>
          <label>
            Intended stopping point
            <input value={stoppingPoint} onChange={(event) => setStoppingPoint(event.target.value)} />
          </label>
          <label>
            Explicit absolute path (local metadata inspection only)
            <input value={manualPath} onChange={(event) => setManualPath(event.target.value)} placeholder="/Users/name/project" />
          </label>
          <button className="btn ghost" disabled={busy || manualPath.trim() === ''} onClick={() => void enterSelectedPath(manualPath.trim())}>Inspect entered path</button>
          <button className="btn" disabled={busy} onClick={() => void handleEnter()}>
            {busy ? 'Inspecting selected project' : 'Select and enter project'}
          </button>
        </div>
      ) : (
        <div className="operations-card">
          <div className="operations-card-title">
            <strong>{session.workspacePath}</strong>
            <EvidenceClassBadge classification={session.evidence.classification} />
          </div>
          {session.interruptedAt !== undefined ? (
            <div className="operations-recovery">
              Interrupted session recovered from {new Date(session.interruptedAt).toLocaleString()}.
              <button className="btn small" onClick={() => useGovernanceStore.getState().restoreProjectSession(session.id)}>Restore active session</button>
            </div>
          ) : null}
          <dl className="compact-definition-list">
            <div><dt>branch</dt><dd>{session.branch ?? 'unknown'}</dd></div>
            <div><dt>working tree</dt><dd>{session.workingTreeDirty === undefined ? 'unknown' : session.workingTreeDirty ? 'modified' : 'clean'}</dd></div>
            <div><dt>outcome</dt><dd>{session.intendedOutcome}</dd></div>
            <div><dt>stop</dt><dd>{session.stoppingPoint}</dd></div>
            <div><dt>handoff found</dt><dd>{session.handoffFiles.join(', ') || 'none observed'}</dd></div>
          </dl>
          <label>
            Closeout summary (optional)
            <textarea value={closeSummary} onChange={(event) => setCloseSummary(event.target.value)} />
          </label>
          <label>
            Next bounded action
            <input value={nextAction} onChange={(event) => setNextAction(event.target.value)} />
          </label>
          <label className="checkbox-row"><input type="checkbox" checked={writeHandoff} onChange={(event) => setWriteHandoff(event.target.checked)} /> append a redacted closeout to WESTCAT_HANDOFF.md (explicit workspace write)</label>
          <button className="btn" onClick={() => void handleClose()}>Close project session</button>
        </div>
      )}

      {status !== null ? <p className="operations-status" role="status">{status}</p> : null}

      <h4>Workspace scent trails</h4>
      {activeAssociations.length === 0 ? <p className="muted">No scoped association.</p> : (
        <ul className="operations-list">
          {activeAssociations.map((association) => (
            <li key={association.id}>
              <div><strong>{association.label}</strong> · {association.kind}</div>
              <div className="muted">{association.suggestedActions.join(' · ')}</div>
              <button className="btn small ghost" onClick={() => useGovernanceStore.getState().deleteWorkspaceAssociation(association.id)}>Delete association</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
