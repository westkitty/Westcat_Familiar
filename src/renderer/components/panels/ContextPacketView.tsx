/**
 * Context Packet Forge — build and display high-signal packets from
 * current state. Crossing the continuity firewall (including long-term
 * memory) is an explicit, logged, warned-about choice.
 */
import { useState } from 'react'
import { forgePacket } from '../../engines/packetForge'
import { continuityFirewall } from '../../engines/continuityFirewall'
import { useAttentionStore } from '../../state/useAttentionStore'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { useModeStore } from '../../state/useModeStore'
import { activeProjectSession, useGovernanceStore } from '../../state/useGovernanceStore'
import { EvidenceBadge } from '../common/EvidenceBadge'
import { PanelShell } from '../common/PanelShell'
import type { ContextPacket, PacketSection } from '../../types/packet'
import type { EvidenceTier } from '../../types/evidence'

function Section({
  section
}: {
  section: PacketSection<unknown>
}): JSX.Element {
  return (
    <div className="packet-section">
      <div className="packet-section-head">
        <span>{section.title}</span>
        <EvidenceBadge tier={section.evidenceTier} />
      </div>
      <pre className="packet-pre">{JSON.stringify(section.data, null, 2)}</pre>
    </div>
  )
}

export function ContextPacketView({
  onClose,
  lastPacket,
  setLastPacket
}: {
  onClose: () => void
  lastPacket: ContextPacket | null
  setLastPacket: (p: ContextPacket) => void
}): JSX.Element {
  const [question, setQuestion] = useState('')
  const [crossFirewall, setCrossFirewall] = useState(false)
  const [showRaw, setShowRaw] = useState(false)
  const [promoteDenial, setPromoteDenial] = useState<string | null>(null)
  const [unfinishedId, setUnfinishedId] = useState<string | null>(null)
  const fableBudget = useAttentionStore((s) => s.fableBudgetRemaining)

  const forge = (): void => {
    const fam = useFamiliarStore.getState()
    if (fam.stateId === 'sleeping') fam.requestState('idle')
    fam.requestState('thinking')
    const packet = forgePacket({
      question: question || null,
      destination: 'local_mock_ai',
      modeId: useModeStore.getState().modeId,
      familiarState: useFamiliarStore.getState().stateId,
      attention: useAttentionStore.getState().decision,
      includeLongTermMemory: crossFirewall,
      fableBudgetRemaining: fableBudget,
      gatePassed: false
    })
    setLastPacket(packet)
    if (unfinishedId !== null) {
      useGovernanceStore.getState().completeUnfinishedWork(unfinishedId)
      setUnfinishedId(null)
    }
  }

  const handleQuestionChange = (value: string): void => {
    setQuestion(value)

    if (value.trim() === '' || unfinishedId !== null) return
    const governance = useGovernanceStore.getState()
    const session = activeProjectSession(governance)
    const id = governance.addUnfinishedWork({
      type: 'context_packet',
      title: 'Incomplete context packet',
      description: 'A packet question was started but has not been forged.',
      workspaceId: session?.workspaceId,
      recoverability: 'high',
      urgency: 'normal',
      blocking: false,
      suggestedNextAction: 'Return to Context Packet Forge and complete or dismiss the draft.'
    })
    setUnfinishedId(id)
  }

  const sessionEvents = continuityFirewall.sessionEvents()
  const crossings = continuityFirewall.crossingLog()

  const tryPromote = (): void => {
    const first = sessionEvents[0]
    if (!first) {
      setPromoteDenial('Nothing to promote — no session events yet.')
      return
    }
    setPromoteDenial(continuityFirewall.promoteToLongTerm(first).reason)
  }

  return (
    <PanelShell
      title="Context Packet Forge"
      subtitle="high-signal bundles, not world dumps"
      onClose={onClose}
      bannerText="Packets bundle mock context with verified session state. Every section carries its tier."
    >
      <div className="forge-controls">
        <input
          type="text"
          value={question}
          placeholder="Optional question to carry in the packet…"
          onChange={(e) => handleQuestionChange(e.target.value)}
        />
        <label className="firewall-toggle" title="Reading long-term memory is logged by the continuity firewall.">
          <input
            type="checkbox"
            checked={crossFirewall}
            onChange={(e) => setCrossFirewall(e.target.checked)}
          />
          cross the continuity firewall (include long-term memory)
        </label>
        {crossFirewall ? (
          <p className="gate-warning">
            The firewall separates this session from long-term memory. Crossing it is logged and
            the included notes are <strong>mock</strong> in v1.
          </p>
        ) : null}
        <button className="btn" onClick={forge}>
          Forge packet
        </button>
      </div>

      {lastPacket ? (
        <div className="packet-view">
          <div className="packet-meta">
            <span className="mono">{lastPacket.id}</span>
            <span className="mono">{new Date(lastPacket.createdAt).toLocaleTimeString()}</span>
            <span className={`route-chip route-${lastPacket.destination === 'fable' ? 'fable' : 'local_mock_ai'}`}>
              → {lastPacket.destination}
            </span>
            <span className="mono">
              gate {lastPacket.scarcity.gatePassed ? 'passed' : 'n/a'} · budget{' '}
              {lastPacket.scarcity.fableBudgetRemaining} left
            </span>
          </div>
          <div className="packet-evidence-summary">
            {(Object.entries(lastPacket.evidenceSummary) as [EvidenceTier, number][]).map(
              ([tier, count]) => (
                <span key={tier} className="summary-chip">
                  <EvidenceBadge tier={tier} /> ×{count}
                </span>
              )
            )}
          </div>
          {lastPacket.question ? (
            <p className="packet-question">Q: “{lastPacket.question}”</p>
          ) : null}
          <Section section={lastPacket.mode} />
          <Section section={lastPacket.familiar} />
          <Section section={lastPacket.attention} />
          <Section section={lastPacket.selection} />
          <Section section={lastPacket.sessionEvents} />
          {lastPacket.longTermMemory ? <Section section={lastPacket.longTermMemory} /> : null}
          <button className="btn small ghost" onClick={() => setShowRaw((s) => !s)}>
            {showRaw ? 'Hide raw JSON' : 'Show raw JSON'}
          </button>
          {showRaw ? (
            <pre className="packet-pre raw">{JSON.stringify(lastPacket, null, 2)}</pre>
          ) : null}
        </div>
      ) : (
        <p className="muted">No packet forged yet this session.</p>
      )}

      <h3 className="dexter-h">CONTINUITY FIREWALL</h3>
      <div className="firewall-view">
        <div>
          <h4 className="drawer-section-title">
            session events (dies with this window) <EvidenceBadge tier="verified" />
          </h4>
          {sessionEvents.length === 0 ? (
            <p className="muted">Nothing yet. Interact with the familiar.</p>
          ) : (
            <ul className="event-list">
              {sessionEvents.map((e) => (
                <li key={e.id}>
                  <span className="mono nowrap">{new Date(e.createdAt).toLocaleTimeString()}</span>{' '}
                  {e.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="firewall-wall" aria-hidden="true">
          ║
        </div>
        <div>
          <h4 className="drawer-section-title">
            long-term memory (read-only) <EvidenceBadge tier="mock" />
          </h4>
          <ul className="event-list">
            {continuityFirewall.readLongTerm('packet panel display').map((n) => (
              <li key={n.id}>{n.text}</li>
            ))}
          </ul>
          <button className="btn small ghost" onClick={tryPromote}>
            Promote a session event →
          </button>
          {promoteDenial ? (
            <p className="gate-warning">
              {promoteDenial} <EvidenceBadge tier="future_seam" />
            </p>
          ) : null}
        </div>
      </div>
      <p className="muted small-note">
        firewall crossings logged this session: {crossings.length}
      </p>
    </PanelShell>
  )
}
