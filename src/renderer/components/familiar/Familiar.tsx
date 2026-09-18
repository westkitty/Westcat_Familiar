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
import type { PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { useModeStore } from '../../state/useModeStore'
import { useAttentionStore } from '../../state/useAttentionStore'
import { getMode } from '../../domain/modeManager'
import { FAMILIAR_STATES } from '../../domain/familiarStateMachine'
import { useFamiliarAnimation } from './FamiliarAnimator'
import { STATE_VISUALS } from './states'
import { continuityFirewall } from '../../engines/continuityFirewall'
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
  onOpenPanel
}: {
  onSummon: () => void
  onOpenPanel: (panel: PanelId) => void
}): JSX.Element {
  const stateId = useFamiliarStore((s) => s.stateId)
  const position = useFamiliarStore((s) => s.position)
  const flipped = useFamiliarStore((s) => s.flipped)
  const whisper = useFamiliarStore((s) => s.whisper)
  const familiarSignal = useFamiliarStore((s) => s.familiarSignal)
  const modeId = useModeStore((s) => s.modeId)
  const mode = getMode(modeId)

  const { anim, blinking, reduced } = useFamiliarAnimation(stateId, mode.familiar.poseClass)
  const visual = STATE_VISUALS[stateId]
  const stateDef = FAMILIAR_STATES[stateId]

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
        role="button"
        tabIndex={0}
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
          data-familiar-attention={familiarSignal?.attention ?? 'idle'}
          data-familiar-reaction={familiarSignal?.reaction ?? 'neutral'}
          data-familiar-trigger={familiarSignal?.trigger ?? 'system'}
          style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
        >
          <div className="familiar-aura" aria-hidden="true" />
          <div className="familiar-shadow" aria-hidden="true" />
          <div className="familiar-core" aria-hidden="true">
            <div className="familiar-fin familiar-fin-left" />
            <div className="familiar-fin familiar-fin-right" />
            <div className="familiar-eye familiar-eye-left">
              <div className="familiar-gaze" />
            </div>
            <div className="familiar-eye familiar-eye-right">
              <div className="familiar-gaze" />
            </div>
            <div className="familiar-glyph-ring">
              <div className="familiar-glyph" />
              <div className="familiar-glyph" />
              <div className="familiar-glyph" />
            </div>
            <div className="familiar-band" />
          </div>
          <div className="familiar-tail" aria-hidden="true" />
        </div>
        <div className="familiar-status">
          <span className="status-mode" style={{ color: `var(${mode.accentVar})` }}>
            {mode.label.toLowerCase()}
          </span>
          <span className="status-state">· {stateDef.label.toLowerCase()}</span>
          {familiarSignal?.reaction && familiarSignal.reaction !== 'neutral' ? (
            <span className="status-state">· {familiarSignal.reaction}</span>
          ) : null}
          {reduced ? (
            <span
              className="status-rm"
              title={`Reduced motion active — showing pose instead of loop: ${anim.cue}`}
            >
              · rm
            </span>
          ) : null}
        </div>
        {whisper ? <div className="familiar-whisper">{whisper}</div> : null}
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
