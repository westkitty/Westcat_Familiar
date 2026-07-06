/**
 * ScarcityGate — Law 7 as a UI moment. Appears only when the router
 * recommends Fable. Staying local is the highlighted default; spending a
 * unit is the reluctant option and shows exactly what it costs.
 */
import { FABLE_SESSION_BUDGET } from '../../../shared/constants'
import type { RouterDecision } from '../../types'
import { EvidenceBadge } from './EvidenceBadge'

export function ScarcityGate({
  decision,
  budgetRemaining,
  onConfirm,
  onCancel
}: {
  decision: RouterDecision
  budgetRemaining: number
  onConfirm: () => void
  onCancel: () => void
}): JSX.Element {
  return (
    <div className="scarcity-gate" role="alertdialog" aria-label="Fable scarcity gate">
      <h3>Fable gate</h3>
      <p className="gate-reason">{decision.reason}</p>
      <div className="gate-meter" title="Fable units left this session">
        {Array.from({ length: FABLE_SESSION_BUDGET }, (_, n) => (
          <span key={n} className={n < budgetRemaining ? 'gate-dot full' : 'gate-dot spent'} />
        ))}
        <span className="gate-meter-label">
          {budgetRemaining}/{FABLE_SESSION_BUDGET} units left
        </span>
      </div>
      <p className="gate-cost">
        estimated cost: {decision.estimatedCost} · complexity {decision.complexity.toFixed(2)}{' '}
        <EvidenceBadge tier={decision.evidenceTier} />
      </p>
      <p className="gate-warning">
        Fable is scarce. Most questions do fine on the local path — spend a unit only if this
        genuinely needs deep reasoning.
      </p>
      <div className="gate-actions">
        <button className="btn" onClick={onCancel} autoFocus>
          Stay local (recommended)
        </button>
        <button className="btn danger" onClick={onConfirm} disabled={budgetRemaining <= 0}>
          Spend 1 Fable unit
        </button>
      </div>
    </div>
  )
}
