/**
 * Attention arbitration. Law 4: Attention Must Be Earned.
 * Pure function: given the current situation, decide whether the familiar
 * stays quiet, keeps ambient presence, or is allowed one nudge.
 */
import type { AttentionDecision } from '../types'
import type { AttentionProfile } from '../types/mode'

export interface AttentionInputs {
  msIdle: number
  profile: AttentionProfile
  drawerOpen: boolean
  dormant: boolean
  nudgesThisHour: number
  nudgeHourlyCap: number
  msSinceLastNudge: number
  nudgeCooldownMs: number
}

const TIER = 'inferred' as const

export function evaluateAttention(i: AttentionInputs): AttentionDecision {
  const base = { msIdle: i.msIdle, evidenceTier: TIER }
  if (i.dormant) {
    return {
      ...base,
      action: 'stay_quiet',
      reason: 'Familiar is dormant; it earns nothing by waking you.'
    }
  }
  if (i.drawerOpen) {
    return {
      ...base,
      action: 'ambient',
      reason: 'Drawer is open — you are already engaged.'
    }
  }
  if (i.profile.nudgeAfterIdleMs === null) {
    return {
      ...base,
      action: 'stay_quiet',
      reason: `Mode profile suppresses nudges (${i.profile.proactivity}).`
    }
  }
  if (i.nudgesThisHour >= i.nudgeHourlyCap) {
    return {
      ...base,
      action: 'stay_quiet',
      reason: 'Hourly nudge budget spent. Attention is earned, not farmed.'
    }
  }
  if (i.msSinceLastNudge < i.nudgeCooldownMs) {
    return {
      ...base,
      action: 'ambient',
      reason: 'Nudge cooldown active; staying ambient.'
    }
  }
  if (i.msIdle >= i.profile.nudgeAfterIdleMs) {
    return {
      ...base,
      action: 'nudge',
      reason: `Idle ${Math.round(i.msIdle / 1000)}s ≥ ${Math.round(
        i.profile.nudgeAfterIdleMs / 1000
      )}s threshold for this mode.`
    }
  }
  return {
    ...base,
    action: 'ambient',
    reason: 'Within attention thresholds; present but quiet.'
  }
}
