/**
 * QuickActions — the drawer's local commands for the current mode.
 * Each action produces a visible local effect; check-in notes become
 * verified session events behind the continuity firewall.
 */
import { useState } from 'react'
import { COMMANDS } from '../../domain/commandRouter'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { continuityFirewall } from '../../engines/continuityFirewall'
import type { ModeDef } from '../../types/mode'

export function QuickActions({
  mode,
  onRunAi
}: {
  mode: ModeDef
  onRunAi: (commandId: string) => void
}): JSX.Element {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const runLocal = (id: string): void => {
    const fam = useFamiliarStore.getState()
    switch (id) {
      case 'stretch':
        if (fam.stateId === 'dormant') fam.requestState('idle')
        fam.requestState('reacting')
        fam.setWhisper('stretch!')
        break
      case 'nap':
        if (fam.stateId === 'dormant') {
          fam.requestState('idle')
          fam.setWhisper('awake')
        } else {
          fam.requestState('dormant')
          fam.setWhisper('napping — will not interrupt')
        }
        break
      case 'checkin-note':
        setNoteOpen((o) => !o)
        break
      default:
        break
    }
  }

  const saveNote = (): void => {
    const text = noteText.trim()
    if (!text) return
    continuityFirewall.addSessionEvent(`Check-in: ${text}`)
    setNoteText('')
    setNoteOpen(false)
    const fam = useFamiliarStore.getState()
    fam.requestState('reacting')
    fam.setWhisper('noted — verified, session-only')
  }

  const actions = mode.drawerCommandIds
    .map((id) => COMMANDS[id])
    .filter((c) => c !== undefined && c.kind !== 'panel')

  return (
    <div className="quick-actions">
      <h4 className="drawer-section-title">quick actions</h4>
      <div className="quick-actions-row">
        {actions.map((cmd) => (
          <button
            key={cmd.id}
            className="btn small"
            title={cmd.description}
            onClick={() => (cmd.kind === 'ai' ? onRunAi(cmd.id) : runLocal(cmd.id))}
          >
            {cmd.label}
            {cmd.kind === 'ai' ? <span className="ai-mark" title="Routed — may cost">◆</span> : null}
          </button>
        ))}
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
