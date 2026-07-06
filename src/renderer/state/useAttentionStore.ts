/**
 * Attention + scarcity store. Tracks real interaction times (verified),
 * runs the attention engine, and owns the Fable session budget (Law 7).
 */
import { create } from 'zustand'
import { evaluateAttention } from '../domain/attentionEngine'
import type { AttentionDecision } from '../types'
import type { AttentionProfile } from '../types/mode'
import {
  FABLE_SESSION_BUDGET,
  NUDGE_COOLDOWN_MS,
  NUDGE_HOURLY_CAP
} from '../../shared/constants'

interface AttentionStore {
  lastInteractionAt: number
  nudgesThisHour: number
  hourWindowStart: number
  lastNudgeAt: number
  fableBudgetRemaining: number
  decision: AttentionDecision
  recordInteraction: () => void
  /** Run the engine; returns the fresh decision and books nudges. */
  evaluate: (profile: AttentionProfile, drawerOpen: boolean, sleeping: boolean) => AttentionDecision
  /** Spend one Fable unit. Returns false if the budget is empty. */
  spendFable: () => boolean
}

const initialDecision: AttentionDecision = {
  action: 'ambient',
  reason: 'Session just started.',
  msIdle: 0,
  evidenceTier: 'inferred'
}

export const useAttentionStore = create<AttentionStore>()((set, get) => ({
  lastInteractionAt: Date.now(),
  nudgesThisHour: 0,
  hourWindowStart: Date.now(),
  lastNudgeAt: 0,
  fableBudgetRemaining: FABLE_SESSION_BUDGET,
  decision: initialDecision,
  recordInteraction: () => set({ lastInteractionAt: Date.now() }),
  evaluate: (profile, drawerOpen, sleeping) => {
    const s = get()
    const now = Date.now()
    // Roll the hourly nudge window.
    if (now - s.hourWindowStart > 3_600_000) {
      set({ hourWindowStart: now, nudgesThisHour: 0 })
    }
    const decision = evaluateAttention({
      msIdle: now - s.lastInteractionAt,
      profile,
      drawerOpen,
      sleeping,
      nudgesThisHour: get().nudgesThisHour,
      nudgeHourlyCap: NUDGE_HOURLY_CAP,
      msSinceLastNudge: now - s.lastNudgeAt,
      nudgeCooldownMs: NUDGE_COOLDOWN_MS
    })
    if (decision.action === 'nudge') {
      set((prev) => ({
        decision,
        nudgesThisHour: prev.nudgesThisHour + 1,
        lastNudgeAt: now
      }))
    } else {
      set({ decision })
    }
    return decision
  },
  spendFable: () => {
    const remaining = get().fableBudgetRemaining
    if (remaining <= 0) return false
    set({ fableBudgetRemaining: remaining - 1 })
    return true
  }
}))
