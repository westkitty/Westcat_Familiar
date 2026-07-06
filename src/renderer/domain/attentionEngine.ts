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
  sleeping: boolean
  nudgesThisHour: number
  nudgeHourlyCap: number
  msSinceLastNudge: number
  nudgeCooldownMs: number
}

const TIER = 'inferred' as const

export function evaluateAttention(i: AttentionInputs): AttentionDecision {
  // Defensive input sanitization: guard against clock drift, system time jumps, or corruption.
  const msIdle = Math.max(0, isNaN(i.msIdle) ? 0 : i.msIdle)
  const msSinceLastNudge = Math.max(0, isNaN(i.msSinceLastNudge) ? Infinity : i.msSinceLastNudge)
  const nudgesThisHour = Math.max(0, isNaN(i.nudgesThisHour) ? 0 : i.nudgesThisHour)
  const nudgeHourlyCap = Math.max(0, isNaN(i.nudgeHourlyCap) ? 0 : i.nudgeHourlyCap)
  const nudgeCooldownMs = Math.max(0, isNaN(i.nudgeCooldownMs) ? 0 : i.nudgeCooldownMs)

  const base = { msIdle, evidenceTier: TIER }
  if (i.sleeping) {
    return {
      ...base,
      action: 'stay_quiet',
      reason: 'Familiar is sleeping; it earns nothing by waking you.'
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
  if (nudgesThisHour >= nudgeHourlyCap) {
    return {
      ...base,
      action: 'stay_quiet',
      reason: 'Hourly nudge budget spent. Attention is earned, not farmed.'
    }
  }
  if (msSinceLastNudge < nudgeCooldownMs) {
    return {
      ...base,
      action: 'ambient',
      reason: 'Nudge cooldown active; staying ambient.'
    }
  }
  if (msIdle >= i.profile.nudgeAfterIdleMs) {
    return {
      ...base,
      action: 'nudge',
      reason: `Idle ${Math.round(msIdle / 1000)}s ≥ ${Math.round(
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
