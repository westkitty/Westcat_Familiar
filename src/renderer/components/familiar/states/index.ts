/**
 * Per-state visual vocabulary for the familiar, applied as data-attributes
 * on the DOM shell (data-eyes / data-aura / data-glyphs). familiar.css
 * keys shared looks off these attributes and unique motion off the
 * `state-<id>` class. Law 3: no pose without a state.
 */
import type { FamiliarStateId } from '../../../types/familiar'

export interface StateVisual {
  /** Eye aperture: open, narrowed, lowered gaze, or closed lids. */
  eyes: 'open' | 'narrow' | 'down' | 'closed'
  /** Aura ring intensity around the core. */
  aura: 'none' | 'dim' | 'low' | 'pulse' | 'high' | 'expand'
  /** Command glyph row: hidden, steady activity, reveal, or locked bars. */
  glyphs: 'off' | 'active' | 'reveal' | 'locked'
}

export const STATE_VISUALS: Record<FamiliarStateId, StateVisual> = {
  idle: { eyes: 'open', aura: 'none', glyphs: 'off' },
  watching: { eyes: 'narrow', aura: 'low', glyphs: 'off' },
  thinking: { eyes: 'down', aura: 'pulse', glyphs: 'off' },
  working: { eyes: 'open', aura: 'low', glyphs: 'active' },
  judging: { eyes: 'narrow', aura: 'dim', glyphs: 'off' },
  annoyed: { eyes: 'narrow', aura: 'dim', glyphs: 'off' },
  alert: { eyes: 'open', aura: 'high', glyphs: 'off' },
  blocked: { eyes: 'narrow', aura: 'dim', glyphs: 'locked' },
  sleeping: { eyes: 'closed', aura: 'dim', glyphs: 'off' },
  summoning: { eyes: 'open', aura: 'expand', glyphs: 'reveal' }
}
