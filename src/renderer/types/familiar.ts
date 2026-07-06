/** Familiar state machine vocabulary. Law 3: Motion Means State. */

export type FamiliarStateId =
  | 'idle'
  | 'watching'
  | 'thinking'
  | 'working'
  | 'judging'
  | 'annoyed'
  | 'alert'
  | 'blocked'
  | 'sleeping'
  | 'summoning'

export interface FamiliarAnimationSpec {
  /**
   * CSS class applied to the familiar shell (`state-<id>`). The class IS
   * the state — familiar.css keys every keyframe off these classes.
   */
  bodyClass: string
  /** Mean ms between blinks; null = eyes closed / held still. */
  blinkIntervalMs: number | null
  /**
   * Essential motion communicates state and survives reduced-motion
   * (as a discrete pose change). Non-essential loops are dropped.
   */
  essential: boolean
  /** What reduced-motion users see instead of the loop. */
  reducedMotionCue: string
}

export interface FamiliarStateDef {
  id: FamiliarStateId
  label: string
  description: string
  allowedTransitions: readonly FamiliarStateId[]
  animation: FamiliarAnimationSpec
  /** Some states bounce back automatically (e.g. annoyed → idle). */
  autoReturn?: { to: FamiliarStateId; afterMs: number }
}

export interface FamiliarPosition {
  x: number
  y: number
}
