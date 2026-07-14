import { useGovernanceStore } from '../../../state/useGovernanceStore'
import type { InterruptionTrigger } from '../../../../shared/governance'

interface ContractPreset {
  label: string
  summary: string
  triggers: InterruptionTrigger[]
  maximumNudges: number
  quietUntil?: string
}

function presets(): ContractPreset[] {
  return [
    { label: 'Failures only', summary: 'Interrupt only for command failure', triggers: ['command_failure'], maximumNudges: 20 },
    { label: 'One nudge', summary: 'Allow one task-blocked nudge, then stop', triggers: ['task_blocked'], maximumNudges: 1 },
    { label: 'Approval only', summary: 'Notify only when an action requires approval', triggers: ['approval_required'], maximumNudges: 20 },
    { label: 'Silent 60 min', summary: 'Remain silent for sixty minutes', triggers: [], maximumNudges: 0, quietUntil: new Date(Date.now() + 3_600_000).toISOString() }
  ]
}

export function InterruptionContractSection(): JSX.Element {
  const contracts = useGovernanceStore((state) => state.interruptionContracts)

  const addPreset = (preset: ContractPreset): void => {
    useGovernanceStore.getState().addInterruptionContract({
      scope: 'global',
      allowedTriggers: preset.triggers,
      forbiddenTriggers: ['routine_reminder'],
      maximumNudges: preset.maximumNudges,
      quietUntil: preset.quietUntil,
      priority: 50,
      suppressInCrisis: true,
      summary: preset.summary
    })
  }

  return (
    <section className="operations-section" aria-labelledby="contract-heading">
      <h3 id="contract-heading">Interruption contracts</h3>
      <p className="muted">No matching active contract means no nudge. Retrospective justification is not accepted.</p>
      <div className="inline-actions">
        {presets().map((preset) => <button key={preset.label} className="btn small" onClick={() => addPreset(preset)}>{preset.label}</button>)}
      </div>
      <ul className="operations-list">
        {contracts.map((contract) => (
          <li key={contract.id} className={contract.cancelledAt === undefined ? '' : 'resolved-record'}>
            <strong>{contract.summary}</strong>
            <p className="muted">triggers: {contract.allowedTriggers.join(', ') || 'none'} · nudges {contract.nudgeCount}/{contract.maximumNudges} · priority {contract.priority}</p>
            {contract.cancelledAt === undefined ? <div className="inline-actions">
              <button className="btn small ghost" onClick={() => {
                const summary = window.prompt('Contract summary', contract.summary)
                const maximum = window.prompt('Maximum nudge count', String(contract.maximumNudges))

                if (summary !== null && maximum !== null && Number.isFinite(Number(maximum))) {
                  useGovernanceStore.getState().updateInterruptionContract(contract.id, summary, Number(maximum))
                }
              }}>Edit</button>
              <button className="btn small ghost" onClick={() => useGovernanceStore.getState().cancelInterruptionContract(contract.id)}>Cancel</button>
            </div> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
