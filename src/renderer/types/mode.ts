import type { FamiliarStateId } from './familiar'

/** Law 6 (Mode Changes Behavior): a mode changes skin, actions and attention. */

export type ModeId =
  | 'plain'
  | 'dex'
  | 'work'
  | 'canon'
  | 'build'
  | 'necromancy'
  | 'fable'
  | 'image'
  | 'crisis'

export type Proactivity = 'silent' | 'low' | 'medium' | 'high'

export interface AttentionProfile {
  /** ms of user idleness before the familiar may nudge; null = never nudge. */
  nudgeAfterIdleMs: number | null
  proactivity: Proactivity
  description: string
}

export interface ModeFamiliarSkin {
  /** CSS custom property carrying this mode's accent color. */
  accentColorVar: string
  /** Eye rendering vocabulary — visibly different per mode (data-eye attr). */
  eye: 'soft' | 'sharp' | 'wide' | 'scan'
  /** Mode class on the familiar shell (`mode-<id>`). */
  poseClass: string
  /** Which state the familiar settles back into in this mode. */
  idleBias: FamiliarStateId
}

export interface ModeDef {
  id: ModeId
  label: string
  tagline: string
  accentVar: string
  familiar: ModeFamiliarSkin
  /** Which commands the drawer offers in this mode. */
  drawerCommandIds: readonly string[]
  attention: AttentionProfile
}
