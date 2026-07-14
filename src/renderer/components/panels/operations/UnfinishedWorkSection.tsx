import { selectMostUsefulUnfinished, totalUnfinishedPressure, unfinishedPressure } from '../../../domain/unfinishedWork'
import { useGovernanceStore } from '../../../state/useGovernanceStore'
import { EvidenceClassBadge } from '../../common/EvidenceClassBadge'

export function UnfinishedWorkSection(): JSX.Element {
  const items = useGovernanceStore((state) => state.unfinishedWork)
  const useful = selectMostUsefulUnfinished(items)
  const pressure = totalUnfinishedPressure(items)

  return (
    <section className="operations-section" aria-labelledby="unfinished-heading">
      <h3 id="unfinished-heading">Unfinished business</h3>
      <p className="operations-callout">
        Pressure {pressure}/100. {useful === undefined ? 'No actionable item.' : `Highest-value recovery: ${useful.title}. ${useful.suggestedNextAction}`}
      </p>
      {items.length === 0 ? <p className="muted">The ledger is empty.</p> : (
        <ul className="operations-list">
          {items.map((item) => {
            const active = item.completedAt === undefined && item.dismissedAt === undefined
            return (
              <li key={item.id} className={active ? '' : 'resolved-record'}>
                <div className="operations-card-title">
                  <strong>{item.title}</strong>
                  <span className="mono">pressure {unfinishedPressure(item)}</span>
                  <EvidenceClassBadge classification={item.evidence.classification} />
                </div>
                <p>{item.description}</p>
                <p className="muted">{item.type} · {item.urgency} · next: {item.suggestedNextAction}</p>
                <div className="inline-actions">
                  {active ? (
                    <>
                      <button className="btn small" onClick={() => useGovernanceStore.getState().completeUnfinishedWork(item.id)}>Complete</button>
                      <button className="btn small ghost" onClick={() => useGovernanceStore.getState().dismissUnfinishedWork(item.id)}>Dismiss with history</button>
                      <button className="btn small ghost" onClick={() => useGovernanceStore.getState().snoozeUnfinishedWork(item.id, new Date(Date.now() + 3_600_000).toISOString())}>Snooze 1 hour</button>
                    </>
                  ) : (
                    <button className="btn small ghost" onClick={() => useGovernanceStore.getState().reopenUnfinishedWork(item.id)}>Reopen</button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
