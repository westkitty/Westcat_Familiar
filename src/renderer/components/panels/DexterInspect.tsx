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
import type { EvidenceTier } from '../../types/evidence'

/**
 * Compiled-in snapshot of this project's own structure. Tier `inferred`,
 * not `verified`: it is baked at build time and can drift from disk.
 */
const STRUCTURE_SNAPSHOT: { path: string; role: string; evidenceTier: EvidenceTier }[] = [
  { path: 'src/main/electronMain.ts', role: 'frameless transparent window; nav denied', evidenceTier: 'inferred' },
  { path: 'src/main/preload.ts', role: 'narrow typed bridge (info, quit)', evidenceTier: 'inferred' },
  { path: 'src/renderer/domain/familiarStateMachine.ts', role: '5 states, explicit transitions', evidenceTier: 'inferred' },
  { path: 'src/renderer/domain/attentionEngine.ts', role: 'pure nudge arbitration', evidenceTier: 'inferred' },
  { path: 'src/renderer/domain/commandRouter.ts', role: 'local → mock AI → gated Fable', evidenceTier: 'inferred' },
  { path: 'src/renderer/engines/packetForge.ts', role: 'high-signal context packets', evidenceTier: 'inferred' },
  { path: 'src/renderer/engines/selfAudit.ts', role: 'constitution compliance harness', evidenceTier: 'inferred' },
  { path: 'src/renderer/engines/continuityFirewall.ts', role: 'session/long-term wall', evidenceTier: 'inferred' },
  { path: 'src/renderer/data/mocks/', role: 'ALL fake data lives here, tiered', evidenceTier: 'inferred' },
  { path: 'src/renderer/components/familiar/', role: 'the interface itself', evidenceTier: 'inferred' }
]

export function DexterInspect({ onClose }: { onClose: () => void }): JSX.Element {
  return (
    <PanelShell
      title="Dexter Inspect"
      subtitle="project necromancy lens · forensic, not decorative"
      onClose={onClose}
      clinical
      bannerText="DEXTER LENS — lineage below is a mock reconstruction of the WestCat Overlay family. Not telemetry."
    >
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
