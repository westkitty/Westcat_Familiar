/**
 * FamiliarAnimator — hooks that turn state machine state into wearable
 * animation. This is the only place animation classes are computed
 * (via engines/animationEngine), keeping Law 3 enforceable.
 */
import { useEffect, useState } from 'react'
import { resolveAnimation, subscribeReducedMotion } from '../../engines/animationEngine'
import { FAMILIAR_STATES } from '../../domain/familiarStateMachine'
import { useFamiliarStore } from '../../state/useFamiliarStore'
import { useModeStore } from '../../state/useModeStore'
import { getMode } from '../../domain/modeManager'
import type { FamiliarStateId } from '../../types/familiar'
import type { ResolvedAnimation } from '../../engines/animationEngine'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => subscribeReducedMotion(setReduced), [])
  return reduced
}

export interface FamiliarAnimation {
  anim: ResolvedAnimation
  blinking: boolean
  reduced: boolean
}

export function useFamiliarAnimation(
  stateId: FamiliarStateId,
  poseClass: string
): FamiliarAnimation {
  const reduced = useReducedMotion()
  const [blinking, setBlinking] = useState(false)
  const anim = resolveAnimation(stateId, reduced, poseClass)

  // Blinking, scheduled from the state's spec — not decoration, a vital sign.
  useEffect(() => {
    if (anim.blinkIntervalMs === null) return
    const interval = window.setInterval(() => {
      setBlinking(true)
      window.setTimeout(() => setBlinking(false), 140)
    }, anim.blinkIntervalMs)
    return () => window.clearInterval(interval)
  }, [anim.blinkIntervalMs])

  // Auto-return transitions (reacting → idle etc.), biased by the mode:
  // a state that returns "to idle" settles into the mode's idle bias.
  useEffect(() => {
    const def = FAMILIAR_STATES[stateId]
    if (!def.autoReturn) return
    const { to, afterMs } = def.autoReturn
    const timer = window.setTimeout(() => {
      const modeId = useModeStore.getState().modeId
      const bias = getMode(modeId).familiar.idleBias
      const target = to === 'idle' && bias !== stateId ? bias : to
      const fam = useFamiliarStore.getState()
      if (!fam.requestState(target)) fam.requestState(to)
    }, afterMs)
    return () => window.clearTimeout(timer)
  }, [stateId])

  return { anim, blinking, reduced }
}
