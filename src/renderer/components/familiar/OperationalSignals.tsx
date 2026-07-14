import { activeProjectSession, useGovernanceStore } from '../../state/useGovernanceStore'
import { selectMostUsefulUnfinished, totalUnfinishedPressure } from '../../domain/unfinishedWork'
import { capabilityStateAt } from '../../domain/capabilityTruth'

export function OperationalSignals({ onOpen }: { onOpen: () => void }): JSX.Element {
  const unfinishedWork = useGovernanceStore((state) => state.unfinishedWork)
  const contracts = useGovernanceStore((state) => state.interruptionContracts)
  const sessions = useGovernanceStore((state) => state.sessions)
  const capabilities = useGovernanceStore((state) => state.capabilities)
  const session = activeProjectSession({ sessions })
  const pressure = totalUnfinishedPressure(unfinishedWork)
  const useful = selectMostUsefulUnfinished(unfinishedWork)
  const activeContract = contracts.find((contract) => contract.cancelledAt === undefined && contract.nudgeCount < contract.maximumNudges)
  const unavailableCapability = capabilities.find((capability) => capabilityStateAt(capability) !== 'available')

  const segments = [
    session === undefined ? 'no project' : `project ${session.workspacePath.split('/').pop() ?? session.workspacePath}`,
    activeContract === undefined ? 'silent by contract' : `contract ${activeContract.nudgeCount}/${activeContract.maximumNudges}`,
    pressure === 0 ? 'no pressure' : `pressure ${pressure}`,
    unavailableCapability === undefined ? 'capabilities current' : `${unavailableCapability.label}: ${capabilityStateAt(unavailableCapability)}`
  ]

  return (
    <button
      className={`familiar-operational-signals pressure-${pressure >= 60 ? 'high' : pressure > 0 ? 'present' : 'none'}`}
      onClick={onOpen}
      aria-label={`Operational state. ${segments.join('. ')}. Open operations inspector.`}
      title={useful === undefined ? segments.join(' · ') : `${segments.join(' · ')}\nWhy pressure: ${useful.title} — ${useful.suggestedNextAction}`}
    >
      <span className="operational-mark" aria-hidden="true">{pressure >= 60 ? '!' : pressure > 0 ? '·' : '—'}</span>
      <span>{session === undefined ? 'unbound' : 'session'}</span>
      <span>{activeContract === undefined ? 'quiet' : 'contract'}</span>
      <span>{pressure === 0 ? 'clear' : `p${pressure}`}</span>
    </button>
  )
}
