/**
 * Dexter Inspect — the project necromancy lens. Law 9: not cute.
 * Clinical, monospace, exact. Surfaces lineage, decisions, risks and the
 * graveyard of previous WestCat attempts, plus a compiled-in structure
 * snapshot of this very project.
 */
import {
  MOCK_DECISIONS,
  MOCK_GRAVEYARD,
  MOCK_LINEAGE,
  MOCK_RISKS
} from '../../data/mocks/dexterExamples'
import { EvidenceBadge } from '../common/EvidenceBadge'
import { PanelShell } from '../common/PanelShell'
import { EvidenceClassBadge } from '../common/EvidenceClassBadge'
import { useGovernanceStore } from '../../state/useGovernanceStore'
import type { EvidenceTier } from '../../types/evidence'

/**
 * Compiled-in snapshot of this project's own structure. Tier `inferred`,
 * not `verified`: it is baked at build time and can drift from disk.
 */
const STRUCTURE_SNAPSHOT: { path: string; role: string; evidenceTier: EvidenceTier }[] = [
  { path: 'src/main/electronMain.ts', role: 'frameless transparent window; nav denied', evidenceTier: 'inferred' },
  { path: 'src/main/preload.ts', role: 'typed bridge for process info and bounded workspace operations', evidenceTier: 'inferred' },
  { path: 'src/renderer/domain/familiarStateMachine.ts', role: '10 states, explicit transitions', evidenceTier: 'inferred' },
  { path: 'src/renderer/domain/attentionEngine.ts', role: 'pure nudge arbitration', evidenceTier: 'inferred' },
  { path: 'src/renderer/domain/commandRouter.ts', role: 'local → mock AI → gated Fable', evidenceTier: 'inferred' },
  { path: 'src/renderer/engines/packetForge.ts', role: 'high-signal context packets', evidenceTier: 'inferred' },
  { path: 'src/renderer/engines/selfAudit.ts', role: 'constitution compliance harness', evidenceTier: 'inferred' },
  { path: 'src/renderer/engines/continuityFirewall.ts', role: 'session/long-term wall', evidenceTier: 'inferred' },
  { path: 'src/renderer/data/mocks/', role: 'ALL fake data lives here, tiered', evidenceTier: 'inferred' },
  { path: 'src/renderer/components/familiar/', role: 'the interface itself', evidenceTier: 'inferred' }
]

export function DexterInspect({ onClose }: { onClose: () => void }): JSX.Element {
  const provenance = useGovernanceStore((state) => state.provenance)

  return (
    <PanelShell
      title="Dexter Inspect"
      subtitle="project necromancy lens · forensic, not decorative"
      onClose={onClose}
      clinical
      bannerText="DEXTER LENS — lineage below is a mock reconstruction of the WestCat Overlay family. Not telemetry."
    >
      <h3 className="dexter-h">COMMAND PROVENANCE (local, structured, redacted)</h3>
      {provenance.length === 0 ? <p className="muted">No routed action has been recorded.</p> : (
        <table className="data-table">
          <thead>
            <tr><th>action</th><th>decision chain</th><th>resources / failures</th><th>evidence</th></tr>
          </thead>
          <tbody>
            {[...provenance].reverse().map((record) => (
              <tr key={record.id}>
                <td>
                  <span className="mono">{record.id.slice(0, 18)}</span><br />
                  <strong>{record.status}</strong> · {record.selectedEngine}<br />
                  <span className="muted">{new Date(record.startedAt).toLocaleString()}</span>
                </td>
                <td>
                  <strong>{record.normalizedRequest}</strong><br />
                  <span>{record.routingDecision}</span><br />
                  <span className="muted">policy: {record.permissionDecision.outcome} — {record.permissionDecision.reason}</span><br />
                  <span className="muted">mode: {record.modeId} · familiar: {record.familiarState}</span>
                </td>
                <td>
                  <div className="mono">files: {record.resourcePaths.join(', ') || 'none'}</div>
                  <div>commands: {record.commands.length === 0 ? 'none' : record.commands.map((command) => `${command.state}: ${command.command}`).join('; ')}</div>
                  {record.errors.length > 0 ? <div className="sev-high">failed: {record.errors.join('; ')}</div> : null}
                  {record.fallbacks.length > 0 ? <div>fallback: {record.fallbacks.join('; ')}</div> : null}
                  <div className="muted">approvals: {record.approvalEvents.length} · cancellations: {record.cancellationEvents.length}</div>
                </td>
                <td>{record.evidence.map((claim, index) => <EvidenceClassBadge key={`${record.id}-${index}`} classification={claim.classification} />)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="muted small-note">Retention is capped at 250 actions. Full file contents and secret-shaped values are not retained.</p>
      <button className="btn small danger" onClick={() => {
        if (window.confirm('Delete all local command provenance?')) useGovernanceStore.getState().clearProvenance()
      }}>Delete provenance history</button>

      <h3 className="dexter-h">LINEAGE</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>repo</th>
            <th>verdict</th>
            <th>extracted</th>
            <th>tier</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_LINEAGE.map((l) => (
            <tr key={l.id}>
              <td className="mono">{l.repo}</td>
              <td>{l.verdict}</td>
              <td>{l.extracted.length > 0 ? l.extracted.join('; ') : '—'}</td>
              <td><EvidenceBadge tier={l.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dexter-h">DECISIONS</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>date</th>
            <th>decision / rationale</th>
            <th>tier</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_DECISIONS.map((d) => (
            <tr key={d.id}>
              <td className="mono nowrap">{d.date}</td>
              <td>
                <strong>{d.decision}</strong>
                <br />
                <span className="muted">{d.rationale}</span>
              </td>
              <td><EvidenceBadge tier={d.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dexter-h">RISKS</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>severity</th>
            <th>risk / mitigation</th>
            <th>tier</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_RISKS.map((r) => (
            <tr key={r.id}>
              <td className={`mono nowrap sev-${r.severity}`}>{r.severity}</td>
              <td>
                <strong>{r.risk}</strong>
                <br />
                <span className="muted">mitigation: {r.mitigation}</span>
              </td>
              <td><EvidenceBadge tier={r.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dexter-h">GRAVEYARD</h3>
      <ul className="graveyard-list">
        {MOCK_GRAVEYARD.map((g) => (
          <li key={g.id}>
            <span className="mono">†</span> {g.note} <EvidenceBadge tier={g.evidenceTier} />
          </li>
        ))}
      </ul>

      <h3 className="dexter-h">CURRENT STRUCTURE (compiled-in snapshot — may drift from disk)</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>path</th>
            <th>role</th>
            <th>tier</th>
          </tr>
        </thead>
        <tbody>
          {STRUCTURE_SNAPSHOT.map((s) => (
            <tr key={s.path}>
              <td className="mono">{s.path}</td>
              <td>{s.role}</td>
              <td><EvidenceBadge tier={s.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelShell>
  )
}
