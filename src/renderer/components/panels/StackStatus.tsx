/**
 * Stack Status — diagnostics panel. One LIVE section (verified: real
 * bridge versions, storage bytes, attention budget, session routes) above
 * the openly mock process table. The contrast between the two IS the
 * point (Law 5).
 */
import { useEffect, useState } from 'react'
import { MOCK_STACK_DIAGNOSTICS } from '../../data/mocks/stackDiagnostics'
import { MOCK_ATTENTION_CONDITIONS } from '../../data/mocks/attentionConditions'
import { MOCK_ROUTER_HISTORY } from '../../data/mocks/routerHistory'
import { getSessionRouteLog } from '../../domain/commandRouter'
import { useAttentionStore } from '../../state/useAttentionStore'
import { persistence, storageUsageBytes } from '../../state/persistence'
import { EvidenceBadge } from '../common/EvidenceBadge'
import { PanelShell } from '../common/PanelShell'
import { EvidenceClassBadge } from '../common/EvidenceClassBadge'
import { capabilitiesFromInspection, capabilityStateAt } from '../../domain/capabilityTruth'
import { activeProjectSession, useGovernanceStore } from '../../state/useGovernanceStore'
import { FABLE_SESSION_BUDGET, NUDGE_HOURLY_CAP } from '../../../shared/constants'
import type { BridgeInfo } from '../../../main/preload'
import type { EvidenceTier } from '../../types/evidence'

export function StackStatus({ onClose }: { onClose: () => void }): JSX.Element {
  const [info, setInfo] = useState<BridgeInfo | null>(null)
  const [bridgeTier, setBridgeTier] = useState<EvidenceTier>('unavailable')
  const fableBudget = useAttentionStore((s) => s.fableBudgetRemaining)
  const nudges = useAttentionStore((s) => s.nudgesThisHour)
  const decision = useAttentionStore((s) => s.decision)
  const capabilities = useGovernanceStore((state) => state.capabilities)
  const sessions = useGovernanceStore((state) => state.sessions)
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (window.familiarBridge) {
      window.familiarBridge
        .getInfo()
        .then((i) => {
          if (!cancelled) {
            setInfo(i)
            setBridgeTier('verified')
          }
        })
        .catch(() => {
          if (!cancelled) setBridgeTier('unavailable')
        })
    }
    return () => {
      cancelled = true
    }
  }, [])

  const sessionRoutes = getSessionRouteLog()
  const activeSession = activeProjectSession({ sessions })

  const refreshCapabilities = async (): Promise<void> => {
    if (activeSession === undefined || window.familiarBridge === undefined) {
      setRefreshStatus('No active selected project is available for a safe recheck.')
      return
    }

    try {
      setRefreshStatus('Running safe local capability checks.')
      const inspection = await window.familiarBridge.inspectWorkspace(activeSession.workspacePath)
      useGovernanceStore.getState().upsertCapabilities(capabilitiesFromInspection(inspection))
      setRefreshStatus(`Capability truth refreshed at ${new Date(inspection.checkedAt).toLocaleTimeString()}.`)
    } catch (error) {
      setRefreshStatus(error instanceof Error ? error.message : 'Capability check failed.')
    }
  }

  return (
    <PanelShell
      title="Stack Status"
      subtitle="live rows are verified; the process table is pretend"
      onClose={onClose}
      bannerText="The capability table is based on bounded live observations. The preserved process table below is explicitly mocked."
    >
      <h3 className="dexter-h">LIVE (this very process)</h3>
      <table className="data-table">
        <tbody>
          <tr>
            <td>electron / chrome / node</td>
            <td className="mono">
              {info
                ? `${info.versions.electron} / ${info.versions.chrome} / ${info.versions.node}`
                : 'bridge not reachable'}
            </td>
            <td><EvidenceBadge tier={bridgeTier} /></td>
          </tr>
          <tr>
            <td>platform</td>
            <td className="mono">{info ? info.platform : '—'}</td>
            <td><EvidenceBadge tier={bridgeTier} /></td>
          </tr>
          <tr>
            <td>local storage in use</td>
            <td className="mono">
              {storageUsageBytes()} bytes · {persistence.keys().length} keys
            </td>
            <td><EvidenceBadge tier="verified" /></td>
          </tr>
          <tr>
            <td>fable budget</td>
            <td className="mono">
              {fableBudget}/{FABLE_SESSION_BUDGET} units remaining
            </td>
            <td><EvidenceBadge tier="verified" /></td>
          </tr>
          <tr>
            <td>attention</td>
            <td className="mono">
              {decision.action} · nudges {nudges}/{NUDGE_HOURLY_CAP} this hour
            </td>
            <td><EvidenceBadge tier={decision.evidenceTier} /></td>
          </tr>
          <tr>
            <td>reduced motion (OS)</td>
            <td className="mono">
              {window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'reduce'
                : 'no-preference'}
            </td>
            <td><EvidenceBadge tier="verified" /></td>
          </tr>
        </tbody>
      </table>

      <h3 className="dexter-h">CAPABILITY TRUTH</h3>
      <button className="btn small" onClick={() => void refreshCapabilities()}>Refresh safe checks</button>
      {refreshStatus !== null ? <p className="muted" role="status">{refreshStatus}</p> : null}
      {capabilities.length === 0 ? <p className="muted">No project capability observations. Enter a project session first.</p> : (
        <table className="data-table">
          <thead><tr><th>capability</th><th>state</th><th>method / checked</th><th>evidence</th><th>remediation</th></tr></thead>
          <tbody>
            {capabilities.map((capability) => {
              const currentState = capabilityStateAt(capability)
              return (
                <tr key={capability.id}>
                  <td>{capability.label}</td>
                  <td className="mono">{currentState}</td>
                  <td>{capability.observationMethod}<br /><span className="muted">{new Date(capability.lastCheckedAt).toLocaleString()} · expires {new Date(capability.expiresAt).toLocaleTimeString()}</span></td>
                  <td><EvidenceClassBadge classification={capability.evidence.classification} /></td>
                  <td>{currentState === 'available' ? '—' : capability.remediationHint ?? capability.failureReason ?? 'Inspect manually.'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <h3 className="dexter-h">PROCESS TABLE (pretend)</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>process</th>
            <th>status</th>
            <th>version</th>
            <th>memory</th>
            <th>tier</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_STACK_DIAGNOSTICS.map((d) => (
            <tr key={d.id}>
              <td className="mono">{d.process}</td>
              <td>
                <span className={`status-dot status-${d.status}`} />
                {d.status}
              </td>
              <td className="mono">{d.version}</td>
              <td className="mono">{d.memory}</td>
              <td>
                <EvidenceBadge tier={d.evidenceTier} />
                {d.note ? <div className="muted small-note">{d.note}</div> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dexter-h">ATTENTION RULES</h3>
      <table className="data-table">
        <tbody>
          {MOCK_ATTENTION_CONDITIONS.map((c) => (
            <tr key={c.id}>
              <td>{c.rule}</td>
              <td className="muted">{c.effect}</td>
              <td><EvidenceBadge tier={c.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dexter-h">ROUTER HISTORY</h3>
      <table className="data-table">
        <tbody>
          {sessionRoutes.map((r, i) => (
            <tr key={`live-${i}`}>
              <td className="mono nowrap">{new Date(r.at).toLocaleTimeString()}</td>
              <td>“{r.input}”</td>
              <td className="mono">{r.path}</td>
              <td><EvidenceBadge tier={r.evidenceTier} /></td>
            </tr>
          ))}
          {MOCK_ROUTER_HISTORY.map((r) => (
            <tr key={r.id}>
              <td className="mono nowrap">{new Date(r.when).toLocaleDateString()}</td>
              <td>“{r.input}”</td>
              <td className="mono">{r.path}</td>
              <td><EvidenceBadge tier={r.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelShell>
  )
}
