/**
 * CommandDrawer — summoned from the familiar (Law 1), dismissible without
 * harming it (Law 2). Hosts the mode switcher, quick actions, tool
 * launchers, and the routed command line with its scarcity gate (Law 7).
 */
import { useState, useEffect, useRef } from 'react'
import {
  AI_COMMAND_PROMPTS,
  COMMANDS,
  logSessionRoute,
  routeInput,
  runFable,
  runLocalLogic,
  runMockAi
} from '../../domain/commandRouter'
import type { LocalContext } from '../../domain/commandRouter'
import { forgePacket } from '../../engines/packetForge'
import { continuityFirewall } from '../../engines/continuityFirewall'
import { useAttentionStore } from '../../state/useAttentionStore'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { MOCK_TASKS } from '../../data/mocks/tasks'
import { EvidenceBadge } from '../common/EvidenceBadge'
import { ScarcityGate } from '../common/ScarcityGate'
import { ModeSwitcher } from '../panels/ModeSwitcher'
import { QuickActions } from './QuickActions'
import { FABLE_SESSION_BUDGET } from '../../../shared/constants'
import type { ContextPacket } from '../../types/packet'
import type { ModeDef } from '../../types/mode'
import type { PanelId, RouterDecision, RouterResult } from '../../types'

const DRAWER_WIDTH = 340

export function CommandDrawer({
  mode,
  anchor,
  onClose,
  openPanel,
  setLastPacket
}: {
  mode: ModeDef
  anchor: { x: number; y: number }
  onClose: () => void
  openPanel: (p: PanelId) => void
  setLastPacket: (p: ContextPacket) => void
}): JSX.Element {
  const fableBudget = useAttentionStore((s) => s.fableBudgetRemaining)
  const [input, setInput] = useState('')
  const [pendingGate, setPendingGate] = useState<{ decision: RouterDecision; question: string } | null>(null)
  const [result, setResult] = useState<RouterResult | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const localContext = (): LocalContext => ({
    mode,
    familiarState: useFamiliarStore.getState().stateId,
    openTaskCount: MOCK_TASKS.filter((t) => !t.completed).length,
    sessionEventCount: continuityFirewall.sessionEvents().length
  })

  const execute = (question: string): void => {
    const trimmed = question.trim()
    if (!trimmed) return
    const fam = useFamiliarStore.getState()
    if (fam.stateId === 'sleeping') fam.requestState('idle')
    fam.requestState('thinking')
    const decision = routeInput(trimmed, fableBudget)
    if (decision.requiresGate) {
      setPendingGate({ decision, question: trimmed })
      setResult(null)
      return
    }
    const ctx = localContext()
    const res =
      decision.path === 'local_logic'
        ? runLocalLogic(trimmed, ctx, decision)
        : runMockAi(trimmed, ctx, decision)
    logSessionRoute(trimmed, decision.path)
    continuityFirewall.addSessionEvent(`Routed “${trimmed}” → ${decision.path}.`)
    setPendingGate(null)
    setResult(res)
  }

  const confirmGate = (): void => {
    if (!pendingGate) return
    const att = useAttentionStore.getState()
    if (!att.spendFable()) {
      setPendingGate(null)
      return
    }
    const packet = forgePacket({
      question: pendingGate.question,
      destination: 'fable',
      modeId: mode.id,
      familiarState: useFamiliarStore.getState().stateId,
      attention: att.decision,
      includeLongTermMemory: false,
      fableBudgetRemaining: useAttentionStore.getState().fableBudgetRemaining,
      gatePassed: true
    })
    setLastPacket(packet)
    logSessionRoute(pendingGate.question, 'fable')
    setResult(runFable(packet.id, pendingGate.decision))
    setPendingGate(null)
  }

  const declineGate = (): void => {
    if (!pendingGate) return
    const ctx = localContext()
    const decision: RouterDecision = {
      ...pendingGate.decision,
      path: 'local_mock_ai',
      reason: 'Gate declined — budget preserved, local seam answered instead.',
      requiresGate: false
    }
    logSessionRoute(pendingGate.question, 'local_mock_ai')
    setResult(runMockAi(pendingGate.question, ctx, decision))
    setPendingGate(null)
  }

  const panelCommands = mode.drawerCommandIds
    .map((id) => COMMANDS[id])
    .filter((c) => c !== undefined && c.kind === 'panel')

  // Anchor beside the familiar; flip to the left when near the right edge.
  const flip = anchor.x + 210 + DRAWER_WIDTH > window.innerWidth
  const left = flip ? Math.max(8, anchor.x - DRAWER_WIDTH - 18) : anchor.x + 205
  const top = Math.max(8, Math.min(anchor.y - 20, window.innerHeight - 500))

  return (
    <aside
      className="command-drawer"
      style={{ left, top, width: DRAWER_WIDTH }}
      role="dialog"
      aria-label="Command drawer"
    >
      <header className="drawer-header">
        <div>
          <h3>command drawer</h3>
          <p className="drawer-mode-line" style={{ color: `var(${mode.accentVar})` }}>
            {mode.label} — {mode.tagline}
          </p>
        </div>
        <div className="drawer-header-right">
          <span className="fable-meter" title={`Fable is scarce: ${fableBudget}/${FABLE_SESSION_BUDGET} units left this session`}>
            fable {fableBudget}/{FABLE_SESSION_BUDGET}
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close drawer" title="Close (Esc)">
            ✕
          </button>
        </div>
      </header>

      <ModeSwitcher />

      <QuickActions
        mode={mode}
        onRunAi={(commandId) => {
          const prompt = AI_COMMAND_PROMPTS[commandId] ?? COMMANDS[commandId]?.label ?? commandId
          setInput(prompt)
          execute(prompt)
        }}
      />

      {panelCommands.length > 0 ? (
        <div className="drawer-tools">
          <h4 className="drawer-section-title">tools</h4>
          <div className="quick-actions-row">
            {panelCommands.map((cmd) => (
              <button
                key={cmd.id}
                className="btn small ghost"
                title={cmd.description}
                onClick={() => cmd.panel && openPanel(cmd.panel)}
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="drawer-router">
        <h4 className="drawer-section-title">route a command</h4>
        <div className="router-input-row">
          <input
            ref={inputRef}
            type="text"
            value={input}
            placeholder="Ask something… local paths first."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') execute(input)
            }}
          />
          <button className="btn small" onClick={() => execute(input)}>
            Route
          </button>
        </div>

        {pendingGate ? (
          <ScarcityGate
            decision={pendingGate.decision}
            budgetRemaining={fableBudget}
            onConfirm={confirmGate}
            onCancel={declineGate}
          />
        ) : null}

        {result ? (
          <div className="router-result">
            <div className="router-decision">
              <span className={`route-chip route-${result.decision.path}`}>
                {result.decision.path.replace(/_/g, ' ')}
              </span>
              <EvidenceBadge tier={result.decision.evidenceTier} />
              <span className="router-reason">{result.decision.reason}</span>
            </div>
            <p className="router-response">
              {result.responseText} <EvidenceBadge tier={result.responseTier} />
            </p>
            {result.responseTier === 'future_seam' ? (
              <button className="btn small ghost" onClick={() => openPanel('packet')}>
                View forged packet
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
