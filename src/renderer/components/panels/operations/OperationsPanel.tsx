import { useState } from 'react'
import { PanelShell } from '../../common/PanelShell'
import { ProjectSessionSection } from './ProjectSessionSection'
import { UnfinishedWorkSection } from './UnfinishedWorkSection'
import { InterruptionContractSection } from './InterruptionContractSection'
import { BehavioralMemorySection } from './BehavioralMemorySection'
import { useGovernanceStore } from '../../../state/useGovernanceStore'

type OperationsTab = 'project' | 'unfinished' | 'contracts' | 'memory'

export function OperationsPanel({ onClose }: { onClose: () => void }): JSX.Element {
  const [tab, setTab] = useState<OperationsTab>('project')
  const recoveryNotice = useGovernanceStore((state) => state.lastRecoveryNotice)

  const content: Record<OperationsTab, JSX.Element> = {
    project: <ProjectSessionSection />,
    unfinished: <UnfinishedWorkSection />,
    contracts: <InterruptionContractSection />,
    memory: <BehavioralMemorySection />
  }

  return (
    <PanelShell
      title="Operational controls"
      subtitle="sessions, pressure, consent, and bounded memory"
      onClose={onClose}
    >
      {recoveryNotice !== undefined ? <p className="operations-recovery" role="status">{recoveryNotice}</p> : null}
      <div className="operations-tabs" role="tablist" aria-label="Operational controls">
        {(['project', 'unfinished', 'contracts', 'memory'] as const).map((entry) => (
          <button
            key={entry}
            role="tab"
            aria-selected={tab === entry}
            className={tab === entry ? 'btn small active' : 'btn small ghost'}
            onClick={() => setTab(entry)}
          >
            {entry}
          </button>
        ))}
      </div>
      {content[tab]}
      <details className="danger-zone">
        <summary>Advanced local reset</summary>
        <p>Deletes governance records from this app profile. Project files are untouched.</p>
        <button className="btn small danger" onClick={() => {
          if (window.confirm('Delete all local governance records? This cannot be undone.')) {
            useGovernanceStore.getState().resetGovernance()
          }
        }}>Reset governance data</button>
      </details>
    </PanelShell>
  )
}
