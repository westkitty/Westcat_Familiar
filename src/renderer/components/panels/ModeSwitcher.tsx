/**
 * ModeSwitcher — Law 6. Switching here changes the familiar's skin, the
 * drawer's commands and the attention engine's thresholds, and the
 * familiar visibly acknowledges the change.
 */
import { MODE_LIST } from '../../domain/modeManager'
import { useModeStore } from '../../state/useModeStore'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { continuityFirewall } from '../../engines/continuityFirewall'
import type { ModeId } from '../../types/mode'

export function ModeSwitcher(): JSX.Element {
  const modeId = useModeStore((s) => s.modeId)

  const choose = (id: ModeId): void => {
    if (id === modeId) return
    useModeStore.getState().setMode(id)
    const fam = useFamiliarStore.getState()
    if (fam.stateId === 'dormant') fam.requestState('idle')
    fam.requestState('reacting')
    fam.setWhisper(`mode: ${id}`)
    continuityFirewall.addSessionEvent(`Mode switched to ${id}.`)
  }

  return (
    <div className="mode-switcher" role="radiogroup" aria-label="Mode">
      {MODE_LIST.map((m) => (
        <button
          key={m.id}
          role="radio"
          aria-checked={m.id === modeId}
          className={m.id === modeId ? 'mode-chip active' : 'mode-chip'}
          style={{ ['--chip-accent' as string]: `var(${m.accentVar})` }}
          onClick={() => choose(m.id)}
          title={`${m.tagline}\nAttention: ${m.attention.description}`}
        >
          <span className="mode-chip-label">{m.label}</span>
          <span className="mode-chip-tagline">{m.tagline}</span>
        </button>
      ))}
    </div>
  )
}
