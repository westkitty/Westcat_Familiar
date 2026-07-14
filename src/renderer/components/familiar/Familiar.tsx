/**
 * The WESTCAT Familiar v0 — stateful command-layer (not a pet mascot).
 * Law 1: this is the interface. The familiar appears first. Click summons
 * the drawer. Draggable. All behavior and visuals driven by state + mode.
 *
 * VISUAL IDENTITY: pure DOM + CSS layers (NO SVG, no Lottie, no external
 * images, no canvas, no old PySide assets). See docs/VISUAL_IDENTITY_LOCK.md
 *
 * REQUIRED DOM LAYERS on/inside the familiar-shell (state+mode classes here):
 *   familiar-shell
 *     familiar-aura
 *     familiar-shadow
 *     familiar-core
 *       familiar-fin-left / familiar-fin-right
 *       familiar-eye-left / familiar-eye-right
 *         familiar-gaze
 *       familiar-glyph-ring
 *         familiar-glyph
 *     familiar-tail
 *   familiar-status
 *
 * State classes (state-idle ... state-summoning) + mode classes (mode-*) are
 * applied to the shell. Data attrs (data-eyes, data-aura, data-glyphs, data-eye)
 * drive apertures/auras/glyphs per the STATE_VISUALS map.
 */
import { useRef, useState } from 'react'
import type { DragEvent as ReactDragEvent, PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { useModeStore } from '../../state/useModeStore'
import { useAttentionStore } from '../../state/useAttentionStore'
import { getMode } from '../../domain/modeManager'
import { FAMILIAR_STATES } from '../../domain/familiarStateMachine'
import { useFamiliarAnimation } from './FamiliarAnimator'
import { STATE_VISUALS } from './states'
import { continuityFirewall } from '../../engines/continuityFirewall'
import { familiarFrameManifest } from '../../data/familiarFrameManifest'
import { EvidenceClassBadge } from '../common/EvidenceClassBadge'
import { OperationalSignals } from './OperationalSignals'
import { evaluateActionPolicy } from '../../domain/policyEvaluator'
import { beginProvenance, completeProvenance } from '../../domain/provenance'
import { createEvidence, createWhisper } from '../../domain/evidenceModel'
import { useGovernanceStore } from '../../state/useGovernanceStore'
import { capabilitiesFromInspection } from '../../domain/capabilityTruth'
import type { PanelId } from '../../types'

export const SHELL_WIDTH = 132
const SHELL_HEIGHT = 150
const CLICK_SLOP_PX = 5

interface DragState {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  moved: boolean
}

export function Familiar({
  onSummon,
  onOpenPanel,
  drawerOpen
}: {
  onSummon: () => void
  onOpenPanel: (panel: PanelId) => void
  drawerOpen: boolean
}): JSX.Element {
  const stateId = useFamiliarStore((s) => s.stateId)
  const position = useFamiliarStore((s) => s.position)
  const flipped = useFamiliarStore((s) => s.flipped)
  const whisper = useFamiliarStore((s) => s.whisper)
  const modeId = useModeStore((s) => s.modeId)
  const mode = getMode(modeId)

  const { anim, blinking, reduced } = useFamiliarAnimation(stateId, mode.familiar.poseClass)
  const visual = STATE_VISUALS[stateId]
  const stateDef = FAMILIAR_STATES[stateId]
  
  let frameSrc = familiarFrameManifest.stateToFrameMapping[stateId] || familiarFrameManifest.fallbackFrame
  if (stateId !== 'sleeping' && blinking) {
    frameSrc = familiarFrameManifest.copiedAssetPaths.blink || frameSrc
  }

  const drag = useRef<DragState | null>(null)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)

  const clamp = (x: number, y: number): { x: number; y: number } => ({
    x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - SHELL_WIDTH)),
    y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - SHELL_HEIGHT - 30))
  })

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      moved: false
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>): void => {
    const d = drag.current
    if (!d || d.pointerId !== e.pointerId) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < CLICK_SLOP_PX) return
    d.moved = true
    useFamiliarStore.getState().movePosition(clamp(d.originX + dx, d.originY + dy))
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>): void => {
    const d = drag.current
    if (!d || d.pointerId !== e.pointerId) return
    drag.current = null
    const fam = useFamiliarStore.getState()
    useAttentionStore.getState().recordInteraction()
    if (d.moved) {
      fam.commitPosition(fam.position)
      // Being relocated earns the mover one restrained twitch.
      if (fam.requestState('annoyed')) fam.setWhisper('relocated.')
      return
    }
    // A plain click: summoning — aura expands, drawer follows.
    setMenu(null)
    if (stateId === 'sleeping') {
      fam.requestState('watching')
      fam.setWhisper('awake')
    } else {
      fam.requestState('summoning')
    }
    onSummon()
  }

  const onContextMenu = (e: ReactMouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
    useAttentionStore.getState().recordInteraction()
    setMenu({ x: e.clientX, y: e.clientY })
  }

  const onDrop = async (event: ReactDragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const bridge = window.familiarBridge

    if (file === undefined || bridge === undefined) return
    const path = bridge.getDroppedFilePath(file)

    if (path === null) return
    const governance = useGovernanceStore.getState()
    const permission = evaluateActionPolicy({
      modeId,
      actionKind: 'inspect',
      inspectedBeforeModify: false,
      hasValidationPlan: false,
      userApproved: true,
      capabilities: governance.capabilities,
      applicableMemories: []
    })
    let provenance = beginProvenance({
      request: `Associate dropped workspace ${path}`,
      modeId,
      familiarState: stateId,
      routingDecision: 'User dropped a bounded local filesystem item onto the familiar.',
      permissionDecision: permission,
      selectedEngine: 'electron_workspace_inspector',
      resourcePaths: [path]
    })
    governance.recordProvenance(provenance)

    try {
      const inspection = await bridge.inspectWorkspace(path)
      governance.addWorkspaceAssociation(inspection)
      governance.upsertCapabilities(capabilitiesFromInspection(inspection))
      provenance = completeProvenance(provenance, 'succeeded', `Observed and associated ${inspection.label}; no file contents were retained.`)
      governance.replaceProvenance(provenance)
      useFamiliarStore.getState().setWhisper(createWhisper(
        `associated: ${inspection.label}`,
        createEvidence('observed', 'The user dropped this item and Electron inspected bounded metadata.', 'workspace drop', { observedAt: inspection.checkedAt }),
        { actionable: true, inspectionAvailable: true, relatedActionId: provenance.id }
      ))
      onOpenPanel('operations')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dropped workspace inspection failed.'
      governance.replaceProvenance(completeProvenance(provenance, 'failed', undefined, message))
      governance.addUnfinishedWork({
        type: 'failed_command',
        title: 'Dropped workspace could not be inspected',
        description: message,
        recoverability: 'high',
        urgency: 'normal',
        blocking: false,
        suggestedNextAction: 'Use Select and enter project from Operational controls.'
      })
    }
  }

  const menuAction = (action: 'flip' | 'nap' | 'inspect' | 'quit'): void => {
    const fam = useFamiliarStore.getState()
    setMenu(null)
    switch (action) {
      case 'flip':
        fam.setFlipped(!flipped)
        break
      case 'nap':
        if (stateId === 'sleeping') {
          fam.requestState('watching')
          fam.setWhisper('awake')
        } else {
          fam.requestState('sleeping')
          fam.setWhisper('sleeping — will not interrupt')
          continuityFirewall.addSessionEvent('Familiar sent to sleep via context menu.')
        }
        break
      case 'inspect':
        onOpenPanel('dexter')
        break
      case 'quit':
        void window.familiarBridge?.quit()
        break
    }
  }

  return (
    <>
      <div
        className="familiar-root"
        style={{ left: position.x, top: position.y, width: SHELL_WIDTH }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onContextMenu={onContextMenu}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'link'
        }}
        onDrop={(event) => void onDrop(event)}
        role="button"
        tabIndex={0}
        aria-expanded={drawerOpen}
        aria-haspopup="true"
        aria-label={`Familiar — state ${stateDef.label}, mode ${mode.label}. Click to summon the command drawer.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            useAttentionStore.getState().recordInteraction()
            onSummon()
          }
        }}
        title={`${stateDef.label} — ${stateDef.description}`}
      >
        <div
          className={blinking ? `${anim.className} blinking` : anim.className}
          data-state={stateId}
          data-eye={mode.familiar.eye}
          data-eyes={visual.eyes}
          data-aura={visual.aura}
          data-glyphs={visual.glyphs}
          style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
        >
          <div className="familiar-aura" aria-hidden="true" />
          <div className="familiar-shadow" aria-hidden="true" />
          <div className="familiar-character-frame-wrap" aria-hidden="true">
            <img
              className="familiar-character-frame"
              src={frameSrc}
              alt={stateDef.label}
              draggable={false}
            />
          </div>
          <div className="familiar-glyph-ring" aria-hidden="true">
            <div className="familiar-glyph" />
            <div className="familiar-glyph" />
            <div className="familiar-glyph" />
          </div>
        </div>
        <div className="familiar-status">
          <span className="status-mode" style={{ color: `var(${mode.accentVar})` }}>
            {mode.label.toLowerCase()}
          </span>
          <span className="status-state">· {stateDef.label.toLowerCase()}</span>
          {reduced ? (
            <span
              className="status-rm"
              title={`Reduced motion active — showing pose instead of loop: ${anim.cue}`}
            >
              · rm
            </span>
          ) : null}
        </div>
        {whisper ? (
          <div
            className={`familiar-whisper whisper-${whisper.evidence.classification}`}
            role="status"
            aria-label={`${whisper.message}. Evidence: ${whisper.evidence.classification}. ${whisper.evidence.reason}`}
          >
            <span>{whisper.message}</span>
            <EvidenceClassBadge classification={whisper.evidence.classification} />
          </div>
        ) : null}
      </div>

      <div className="familiar-operational-anchor" style={{ left: position.x, top: position.y + SHELL_HEIGHT }}>
        <OperationalSignals onOpen={() => onOpenPanel('operations')} />
      </div>

      {menu ? (
        <div
          className="context-menu"
          style={{ left: menu.x, top: menu.y }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button onClick={() => menuAction('flip')}>Flip direction</button>
          <button onClick={() => menuAction('nap')}>
            {stateId === 'sleeping' ? 'Wake up' : 'Sleep (go quiet)'}
          </button>
          <button onClick={() => menuAction('inspect')}>Open Dexter Inspect</button>
          <button className="danger" onClick={() => menuAction('quit')}>
            Quit WESTCAT Familiar
          </button>
        </div>
      ) : null}
    </>
  )
}
