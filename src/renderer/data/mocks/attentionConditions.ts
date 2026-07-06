/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * The rule set the attention engine consults, written down so it can be
 * inspected (Law 10). Live values come from the attention store and are
 * shown `verified`; these rows document the rules themselves.
 */
import type { Evidenced } from '../../types/evidence'

export interface AttentionCondition extends Evidenced {
  id: string
  rule: string
  effect: string
}

export const MOCK_ATTENTION_CONDITIONS: AttentionCondition[] = [
  {
    id: 'att-sleeping',
    rule: 'Familiar is sleeping',
    effect: 'stay_quiet — a sleeping familiar never interrupts.',
    evidenceTier: 'mock'
  },
  {
    id: 'att-drawer',
    rule: 'Drawer is open',
    effect: 'ambient — the user is already engaged.',
    evidenceTier: 'mock'
  },
  {
    id: 'att-mode',
    rule: 'Mode profile (focus/inspect suppress, check-in invites)',
    effect: 'nudge threshold varies per mode; null = never.',
    evidenceTier: 'mock'
  },
  {
    id: 'att-idle',
    rule: 'User idle time exceeds the mode threshold',
    effect: 'nudge — one watching lift plus a whisper. Nothing louder.',
    evidenceTier: 'mock'
  },
  {
    id: 'att-cap',
    rule: 'Hourly nudge cap and 60s cooldown',
    effect: 'stay_quiet — attention cannot be farmed.',
    evidenceTier: 'mock'
  },
  {
    id: 'att-tod',
    rule: 'Time of day (quiet hours)',
    effect: 'Planned suppression window. Not implemented in v1.',
    evidenceTier: 'future_seam'
  }
]
