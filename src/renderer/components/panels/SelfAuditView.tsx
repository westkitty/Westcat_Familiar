/**
 * Self-Audit panel — run the constitution harness against the live app
 * (Law 10). A fresh run is verified; bundled samples are mock and shown
 * separately so the difference stays legible.
 */
import { useState } from 'react'
import { getLastAudit, runSelfAudit } from '../../engines/selfAudit'
import { MOCK_AUDIT_SAMPLES } from '../../data/mocks/auditResults'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { continuityFirewall } from '../../engines/continuityFirewall'
import { EvidenceBadge } from '../common/EvidenceBadge'
import { PanelShell } from '../common/PanelShell'
import type { AuditReport } from '../../types/audit'

function ReportTable({ report }: { report: AuditReport }): JSX.Element {
  return (
    <div className="audit-report">
      <div className="audit-summary">
        <span className="audit-count pass">{report.passed} pass</span>
        <span className="audit-count warn">{report.warned} warn</span>
        <span className="audit-count fail">{report.failed} fail</span>
        <span className="mono">{new Date(report.ranAt).toLocaleString()}</span>
        <EvidenceBadge tier={report.evidenceTier} />
      </div>
      <table className="data-table">
        <tbody>
          {report.checks.map((c) => (
            <tr key={c.id}>
              <td className={`mono nowrap audit-status ${c.status}`}>{c.status}</td>
              <td>
                <strong>{c.title}</strong>
                <br />
                <span className="muted">{c.law}</span>
                <br />
                <span>{c.detail}</span>
              </td>
              <td><EvidenceBadge tier={c.evidenceTier} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SelfAuditView({ onClose }: { onClose: () => void }): JSX.Element {
  const [report, setReport] = useState<AuditReport | null>(getLastAudit())
  const [showSamples, setShowSamples] = useState(false)

  const run = (): void => {
    const fam = useFamiliarStore.getState()
    if (fam.stateId === 'sleeping') fam.requestState('idle')
    fam.requestState('thinking')
    const fresh = runSelfAudit()
    setReport(fresh)
    continuityFirewall.addSessionEvent(
      `Self-audit ran: ${fresh.passed} pass / ${fresh.warned} warn / ${fresh.failed} fail.`
    )
    fam.requestState('working')
    fam.setWhisper(
      fresh.failed === 0 ? 'audit clean' : `audit found ${fresh.failed} failure(s)`
    )
  }

  return (
    <PanelShell
      title="Self-Audit"
      subtitle="the app inspecting itself against the constitution"
      onClose={onClose}
      clinical
      bannerText="A fresh run inspects live runtime state (verified). The sample reports below it are mock."
    >
      <button className="btn" onClick={run}>
        Run self-audit now
      </button>

      {report ? (
        <ReportTable report={report} />
      ) : (
        <p className="muted">No audit has run yet this install. Run one.</p>
      )}

      <button className="btn small ghost" onClick={() => setShowSamples((s) => !s)}>
        {showSamples ? 'Hide sample reports' : `Show ${MOCK_AUDIT_SAMPLES.length} sample reports (mock)`}
      </button>
      {showSamples
        ? MOCK_AUDIT_SAMPLES.map((sample) => <ReportTable key={sample.id} report={sample} />)
        : null}
    </PanelShell>
  )
}
