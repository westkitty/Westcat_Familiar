/**
 * Modes. Law 6: Mode Changes Behavior — each mode changes the familiar's
 * skin (accent, eye grammar, mode class, idle bias), the drawer's command
 * set, AND the attention engine's thresholds. Never just chrome.
 */
import type { ModeDef, ModeId } from '../types/mode'

export const MODES: Record<ModeId, ModeDef> = {
  plain: {
    id: 'plain',
    label: 'Plain',
    tagline: 'Baseline presence. Nothing extra.',
    accentVar: '--mode-plain',
    familiar: { accentColorVar: '--mode-plain', eye: 'soft', poseClass: 'mode-plain', idleBias: 'idle' },
    drawerCommandIds: ['stretch', 'nap', 'checkin-note', 'open-packet'],
    attention: {
      nudgeAfterIdleMs: 120_000,
      proactivity: 'low',
      description: 'Nudges only after long stillness (~2 min).'
    }
  },
  dex: {
    id: 'dex',
    label: 'Dex',
    tagline: 'Diagnostic lens. Exact and unsentimental.',
    accentVar: '--mode-dex',
    familiar: { accentColorVar: '--mode-dex', eye: 'scan', poseClass: 'mode-dex', idleBias: 'watching' },
    drawerCommandIds: ['open-dexter', 'open-stack', 'open-audit', 'open-packet'],
    attention: {
      nudgeAfterIdleMs: null,
      proactivity: 'low',
      description: 'Quiet. Diagnostics speak only when asked.'
    }
  },
  work: {
    id: 'work',
    label: 'Work',
    tagline: 'Deep work guard. Interruptions suppressed.',
    accentVar: '--mode-work',
    familiar: { accentColorVar: '--mode-work', eye: 'sharp', poseClass: 'mode-work', idleBias: 'idle' },
    drawerCommandIds: ['stretch', 'nap', 'plan-next', 'open-packet'],
    attention: {
      nudgeAfterIdleMs: null,
      proactivity: 'silent',
      description: 'Never nudges. The familiar keeps watch quietly.'
    }
  },
  canon: {
    id: 'canon',
    label: 'Canon',
    tagline: 'Decisions and lore. What was ruled, and why.',
    accentVar: '--mode-canon',
    familiar: { accentColorVar: '--mode-canon', eye: 'soft', poseClass: 'mode-canon', idleBias: 'idle' },
    drawerCommandIds: ['checkin-note', 'open-dexter', 'open-packet'],
    attention: {
      nudgeAfterIdleMs: 180_000,
      proactivity: 'low',
      description: 'Very patient. Canon does not rush anyone.'
    }
  },
  build: {
    id: 'build',
    label: 'Build',
    tagline: 'Making things. Cheap questions, fast loops.',
    accentVar: '--mode-build',
    familiar: { accentColorVar: '--mode-build', eye: 'wide', poseClass: 'mode-build', idleBias: 'idle' },
    drawerCommandIds: ['plan-next', 'open-stack', 'open-packet', 'stretch'],
    attention: {
      nudgeAfterIdleMs: 120_000,
      proactivity: 'medium',
      description: 'Checks in if the loop stalls (~2 min).'
    }
  },
  necromancy: {
    id: 'necromancy',
    label: 'Necromancy',
    tagline: 'Graveyard duty. What died, and what it teaches.',
    accentVar: '--mode-necromancy',
    familiar: { accentColorVar: '--mode-necromancy', eye: 'scan', poseClass: 'mode-necromancy', idleBias: 'watching' },
    drawerCommandIds: ['open-dexter', 'open-audit', 'nap'],
    attention: {
      nudgeAfterIdleMs: null,
      proactivity: 'silent',
      description: 'Silent. The dead do not interrupt.'
    }
  },
  fable: {
    id: 'fable',
    label: 'Fable',
    tagline: 'Deep reasoning stance. The budget stays visible.',
    accentVar: '--mode-fable',
    familiar: { accentColorVar: '--mode-fable', eye: 'sharp', poseClass: 'mode-fable', idleBias: 'watching' },
    drawerCommandIds: ['plan-next', 'open-packet'],
    attention: {
      nudgeAfterIdleMs: null,
      proactivity: 'low',
      description: 'Scarce things do not beg for attention.'
    }
  },
  image: {
    id: 'image',
    label: 'Image',
    tagline: 'Visual work. Frames and assets (seams).',
    accentVar: '--mode-image',
    familiar: { accentColorVar: '--mode-image', eye: 'wide', poseClass: 'mode-image', idleBias: 'idle' },
    drawerCommandIds: ['stretch', 'open-packet', 'open-stack'],
    attention: {
      nudgeAfterIdleMs: 180_000,
      proactivity: 'low',
      description: 'Stays out of the way of visual work.'
    }
  },
  crisis: {
    id: 'crisis',
    label: 'Crisis',
    tagline: 'Essential actions only. Nonessential motion and interruptions suppressed.',
    accentVar: '--mode-crisis',
    familiar: { accentColorVar: '--mode-crisis', eye: 'sharp', poseClass: 'mode-crisis', idleBias: 'watching' },
    drawerCommandIds: ['open-stack', 'open-audit'],
    attention: {
      nudgeAfterIdleMs: null,
      proactivity: 'silent',
      description: 'Never initiates nonessential nudges; failure and approval contracts remain inspectable.'
    }
  }
}

export const DEFAULT_MODE: ModeId = 'plain'

export const MODE_LIST: ModeDef[] = Object.values(MODES)

export function getMode(id: ModeId): ModeDef {
  return MODES[id]
}

export function isModeId(v: unknown): v is ModeId {
  return typeof v === 'string' && v in MODES
}
