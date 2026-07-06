/**
 * Familiar state machine. Law 3: Motion Means State.
 * Ten explicit states; every animation class the familiar can wear is
 * declared here and rendered in familiar.css as `state-<id>`. If a
 * movement has no state, it does not exist.
 */
import type { FamiliarStateDef, FamiliarStateId } from '../types/familiar'

export const FAMILIAR_STATES: Record<FamiliarStateId, FamiliarStateDef> = {
  idle: {
    id: 'idle',
    label: 'Idle',
    description: 'Slow quiet breathing, neutral gaze. The default posture.',
    allowedTransitions: [
      'watching', 'thinking', 'working', 'judging', 'alert', 'sleeping', 'summoning', 'annoyed', 'blocked'
    ],
    animation: {
      bodyClass: 'state-idle',
      blinkIntervalMs: 4200,
      essential: false,
      reducedMotionCue: 'settled posture, neutral gaze'
    }
  },
  watching: {
    id: 'watching',
    label: 'Watching',
    description: 'Eyes narrower and brighter, slight forward tilt. It sees you.',
    allowedTransitions: [
      'idle', 'thinking', 'working', 'judging', 'alert', 'sleeping', 'summoning', 'annoyed', 'blocked'
    ],
    animation: {
      bodyClass: 'state-watching',
      blinkIntervalMs: 2800,
      essential: true,
      reducedMotionCue: 'forward tilt, narrowed bright eyes'
    }
  },
  thinking: {
    id: 'thinking',
    label: 'Thinking',
    description: 'Subtle pulse around the core, gaze lowered. Routing.',
    allowedTransitions: ['idle', 'watching', 'working', 'judging', 'blocked'],
    animation: {
      bodyClass: 'state-thinking',
      blinkIntervalMs: 5200,
      essential: true,
      reducedMotionCue: 'lowered gaze, static core ring'
    },
    autoReturn: { to: 'idle', afterMs: 6000 }
  },
  working: {
    id: 'working',
    label: 'Working',
    description: 'Steady command glyph activity, firmer posture.',
    allowedTransitions: ['idle', 'watching', 'alert'],
    animation: {
      bodyClass: 'state-working',
      blinkIntervalMs: 3800,
      essential: true,
      reducedMotionCue: 'firm posture, lit glyph row'
    },
    autoReturn: { to: 'idle', afterMs: 5000 }
  },
  judging: {
    id: 'judging',
    label: 'Judging',
    description: 'Narrowed eyes, stillness, low aura. The gate is open and it is not impressed.',
    allowedTransitions: ['idle', 'watching', 'thinking', 'annoyed', 'blocked'],
    animation: {
      bodyClass: 'state-judging',
      blinkIntervalMs: null,
      essential: true,
      reducedMotionCue: 'held stillness, slit eyes'
    },
    autoReturn: { to: 'watching', afterMs: 20_000 }
  },
  annoyed: {
    id: 'annoyed',
    label: 'Annoyed',
    description: 'Sharper tilt, tighter eyes, one short restrained twitch.',
    allowedTransitions: ['idle', 'watching'],
    animation: {
      bodyClass: 'state-annoyed',
      blinkIntervalMs: null,
      essential: true,
      reducedMotionCue: 'sharp tilt, tight eyes'
    },
    autoReturn: { to: 'idle', afterMs: 2600 }
  },
  alert: {
    id: 'alert',
    label: 'Alert',
    description: 'Stronger aura, raised fins, clear badge. Something earned this.',
    allowedTransitions: ['idle', 'watching', 'thinking', 'summoning', 'sleeping'],
    animation: {
      bodyClass: 'state-alert',
      blinkIntervalMs: 2000,
      essential: true,
      reducedMotionCue: 'raised fins, strong static aura'
    },
    autoReturn: { to: 'watching', afterMs: 8000 }
  },
  blocked: {
    id: 'blocked',
    label: 'Blocked',
    description: 'Dimmed body, locked glyph layer, reduced motion. A wall was hit.',
    allowedTransitions: ['idle', 'watching'],
    animation: {
      bodyClass: 'state-blocked',
      blinkIntervalMs: 6000,
      essential: true,
      reducedMotionCue: 'dimmed body, crossed glyph bars'
    },
    autoReturn: { to: 'idle', afterMs: 7000 }
  },
  sleeping: {
    id: 'sleeping',
    label: 'Sleeping',
    description: 'Lowered posture, dim aura, eyes closed. Will not interrupt anything.',
    allowedTransitions: ['idle', 'watching', 'summoning'],
    animation: {
      bodyClass: 'state-sleeping',
      blinkIntervalMs: null,
      essential: false,
      reducedMotionCue: 'lowered posture, closed eyes'
    }
  },
  summoning: {
    id: 'summoning',
    label: 'Summoning',
    description: 'Aura expansion linked to the drawer, command glyphs revealed.',
    allowedTransitions: ['idle', 'watching', 'thinking', 'judging', 'working', 'alert', 'sleeping'],
    animation: {
      bodyClass: 'state-summoning',
      blinkIntervalMs: 2400,
      essential: true,
      reducedMotionCue: 'expanded static aura, revealed glyphs'
    },
    autoReturn: { to: 'watching', afterMs: 2600 }
  }
}

export function canTransition(from: FamiliarStateId, to: FamiliarStateId): boolean {
  if (from === to) return false
  return FAMILIAR_STATES[from].allowedTransitions.includes(to)
}

export function listStates(): FamiliarStateDef[] {
  return Object.values(FAMILIAR_STATES)
}
