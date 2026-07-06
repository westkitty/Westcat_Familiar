import type { FamiliarBridge } from '../../main/preload'
import type { EvidenceTier } from './evidence'

/** Panels are secondary surfaces summoned from the familiar (Law 2). */
export type PanelId = 'dexter' | 'stack' | 'packet' | 'audit'

export type CommandKind = 'local' | 'panel' | 'ai'

export interface Command {
  id: string
  label: string
  description: string
  kind: CommandKind
  panel?: PanelId
}

/** Law 7: the router prefers cheap local paths; `fable` is gated. */
export type RoutePath = 'local_logic' | 'local_mock_ai' | 'fable'

export interface RouterDecision {
  path: RoutePath
  reason: string
  /** 0..1 heuristic complexity score. */
  complexity: number
  estimatedCost: 'low' | 'medium' | 'high'
  requiresGate: boolean
  /** True when a deep question fell back locally because the budget is spent. */
  budgetExhausted?: boolean
  evidenceTier: EvidenceTier
}

export interface RouterResult {
  decision: RouterDecision
  responseText: string
  responseTier: EvidenceTier
}

export type AttentionAction = 'stay_quiet' | 'ambient' | 'nudge'

export interface AttentionDecision {
  action: AttentionAction
  reason: string
  msIdle: number
  evidenceTier: EvidenceTier
}

declare global {
  interface Window {
    /** Absent when the renderer runs outside Electron (tier: unavailable). */
    familiarBridge?: FamiliarBridge
  }
}

export * from './evidence'
export * from './familiar'
export * from './mode'
export * from './packet'
export * from './audit'
