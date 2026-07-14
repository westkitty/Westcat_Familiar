import { useState } from 'react'
import { useGovernanceStore } from '../../../state/useGovernanceStore'
import { EvidenceClassBadge } from '../../common/EvidenceClassBadge'
import type { BehavioralMemoryRule } from '../../../../shared/governance'

export function BehavioralMemorySection(): JSX.Element {
  const memories = useGovernanceStore((state) => state.memories)
  const [rule, setRule] = useState('')
  const [scope, setScope] = useState<BehavioralMemoryRule['scope']>('global')
  const [scopeValue, setScopeValue] = useState('')
  const [inferred, setInferred] = useState(false)
  const [search, setSearch] = useState('')
  const visibleMemories = memories.filter((memory) => `${memory.rule} ${memory.scope} ${memory.scopeValue ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()))

  const handleAdd = (): void => {
    if (rule.trim() === '') return
    useGovernanceStore.getState().addMemoryRule({
      rule,
      scope,
      scopeValue: scope === 'global' ? undefined : scopeValue.trim(),
      source: inferred ? 'local bounded inference awaiting approval' : 'user-authored operations control',
      authority: inferred ? 'inferred' : 'user_authored'
    })
    setRule('')
  }

  return (
    <section className="operations-section" aria-labelledby="memory-heading">
      <h3 id="memory-heading">Behavioral memory</h3>
      <div className="operations-form">
        <label>Rule<input value={rule} onChange={(event) => setRule(event.target.value)} placeholder="Inspect repositories before editing" /></label>
        <label>
          Scope
          <select value={scope} onChange={(event) => {
            const value = event.target.value

            if (value === 'global' || value === 'project' || value === 'mode' || value === 'action_type') setScope(value)
          }}>
            <option value="global">global</option>
            <option value="project">project</option>
            <option value="mode">mode</option>
            <option value="action_type">action type</option>
          </select>
        </label>
        {scope !== 'global' ? <label>Scope value<input value={scopeValue} onChange={(event) => setScopeValue(event.target.value)} /></label> : null}
        <label className="checkbox-row"><input type="checkbox" checked={inferred} onChange={(event) => setInferred(event.target.checked)} /> inferred proposal (stored disabled until reviewed)</label>
        <button className="btn" onClick={handleAdd}>Add local memory</button>
      </div>
      <label className="operations-search">Search memories<input value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <ul className="operations-list">
        {visibleMemories.map((memory) => (
          <li key={memory.id}>
            <div className="operations-card-title">
              <strong>{memory.rule}</strong>
              <EvidenceClassBadge classification={memory.evidence.classification} />
            </div>
            <p className="muted">{memory.scope}{memory.scopeValue === undefined ? '' : `:${memory.scopeValue}`} · {memory.authority} · {memory.contradictionState} · applied {memory.applicationCount}</p>
            <div className="inline-actions">
              {memory.authority === 'inferred' && memory.lastConfirmedAt === undefined ? <button className="btn small" onClick={() => useGovernanceStore.getState().approveMemoryRule(memory.id)}>Approve for durable use</button> : null}
              <button className="btn small ghost" onClick={() => {
                const edited = window.prompt('Edit memory rule', memory.rule)

                if (edited !== null) useGovernanceStore.getState().updateMemoryRule(memory.id, edited)
              }}>Edit</button>
              <button className="btn small ghost" disabled={memory.authority === 'inferred' && memory.lastConfirmedAt === undefined} onClick={() => useGovernanceStore.getState().toggleMemoryRule(memory.id)}>{memory.enabled ? 'Disable' : 'Enable'}</button>
              <button className="btn small danger" onClick={() => useGovernanceStore.getState().deleteMemoryRule(memory.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
