/**
 * Animation engine. Law 3: the ONLY source of animation classes is the
 * state machine — this module translates a state (plus mode pose and the
 * reduced-motion setting) into what the familiar wears.
 */
import { FAMILIAR_STATES } from '../domain/familiarStateMachine'
import type { FamiliarStateId } from '../types/familiar'

export interface ResolvedAnimation {
  className: string
  blinkIntervalMs: number | null
  /** Text cue kept visible so state reads even with motion reduced. */
  cue: string
}

export function resolveAnimation(
  stateId: FamiliarStateId,
  reducedMotion: boolean,
  poseClass: string
): ResolvedAnimation {
  const def = FAMILIAR_STATES[stateId]
  const classes = ['familiar-shell', def.animation.bodyClass, poseClass]
  if (reducedMotion) classes.push('rm')
  return {
    className: classes.join(' '),
    // Under reduced motion, keep blinking only where it is essential to
    // reading the state; drop it as decoration elsewhere.
    blinkIntervalMs:
      reducedMotion && !def.animation.essential ? null : def.animation.blinkIntervalMs,
    cue: def.animation.reducedMotionCue
  }
}

/** Subscribe to the OS prefers-reduced-motion setting (tier: verified). */
export function subscribeReducedMotion(cb: (reduced: boolean) => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handler = (e: MediaQueryListEvent): void => cb(e.matches)
  mq.addEventListener('change', handler)
  cb(mq.matches)
  return () => mq.removeEventListener('change', handler)
}
