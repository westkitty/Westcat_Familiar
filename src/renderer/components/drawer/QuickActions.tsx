/**
 * QuickActions — the drawer's local commands for the current mode.
 * Each action produces a visible local effect; check-in notes become
 * verified session events behind the continuity firewall.
 */
import { useState } from 'react'
import { COMMANDS } from '../../domain/commandRouter'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { useAttentionStore } from '../../state/useAttentionStore'
import { continuityFirewall } from '../../engines/continuityFirewall'
import { recordObservedLocalAction } from '../../domain/localActionRecorder'
import { useModeStore } from '../../state/useModeStore'
import type { ModeDef } from '../../types/mode'

export function QuickActions({
  mode,
  onRunAi
}: {
  mode: ModeDef
  onRunAi: (commandId: string) => void
}): JSX.Element {
  const fableBudget = useAttentionStore((s) => s.fableBudgetRemaining)
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const runLocal = (id: string): void => {
    const fam = useFamiliarStore.getState()
    let summary = `Local action ${id} completed.`
    switch (id) {
      case 'stretch':
        if (fam.stateId === 'sleeping') fam.requestState('idle')
        fam.requestState('alert')
        fam.setWhisper('stretch!')
        summary = 'Familiar entered the alert stretch posture.'
        break
      case 'nap':
        if (fam.stateId === 'sleeping') {
          fam.requestState('idle')
          fam.setWhisper('awake')
          summary = 'Familiar left sleeping state.'
        } else {
          fam.requestState('sleeping')
          fam.setWhisper('napping — will not interrupt')
          summary = 'Familiar entered sleeping state and suppresses attention.'
        }
        break
      case 'checkin-note':
        setNoteOpen((o) => !o)
        break
      default:
        break
    }
    recordObservedLocalAction(COMMANDS[id]?.label ?? id, mode.id, fam.stateId, summary)
  }

  const saveNote = (): void => {
    const text = noteText.trim()
    if (!text) return
    continuityFirewall.addSessionEvent(`Check-in: ${text}`)
    setNoteText('')
    setNoteOpen(false)
    const fam = useFamiliarStore.getState()
    fam.requestState('alert')
    fam.setWhisper('noted — verified, session-only')
    recordObservedLocalAction('Save local check-in note', useModeStore.getState().modeId, fam.stateId, 'A user-authored note was stored in session memory; note content is not copied into provenance.')
  }

  const actions = mode.drawerCommandIds
    .map((id) => COMMANDS[id])
    .filter((c) => c !== undefined && c.kind !== 'panel')

  return (
    <div className="quick-actions">
      <h4 className="drawer-section-title">quick actions</h4>
      <div className="quick-actions-row">
        {actions.map((cmd) => {
          const isAi = cmd.kind === 'ai'
          const disabled = isAi && fableBudget === 0
          return (
            <button
              key={cmd.id}
              className="btn small"
              disabled={disabled}
              title={disabled ? "Fable budget exhausted — routed action disabled" : cmd.description}
              onClick={() => (isAi ? onRunAi(cmd.id) : runLocal(cmd.id))}
            >
              {cmd.label}
              {isAi ? <span className="ai-mark" title="Routed — may cost">◆</span> : null}
            </button>
          )
        })}
      </div>
      {noteOpen ? (
        <div className="note-form">
          <input
            type="text"
            value={noteText}
            placeholder="How is it going, really?"
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveNote()
            }}
            autoFocus
          />
          <button className="btn small" onClick={saveNote}>
            Save
          </button>
        </div>
      ) : null}
    </div>
  )
}
