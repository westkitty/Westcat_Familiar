import type { EvidenceTier } from './evidence'
import type { FamiliarStateId } from './familiar'
import type { ModeId } from './mode'

/**
 * Context packets are the currency of the router: high-signal bundles of
 * current state, forged locally, destined for Fable (future seam) or the
 * local mock AI. Every section carries its own evidence tier.
 */

export interface PacketSection<T> {
  title: string
  evidenceTier: EvidenceTier
  data: T
}

export interface PacketScarcity {
  fableBudgetRemaining: number
  estimatedCost: 'low' | 'medium' | 'high'
  gatePassed: boolean
}

export interface PacketProjectRef {
  id: string
  name: string
  status: string
  lastActivity: string
  evidenceTier: EvidenceTier
}

export interface PacketTaskRef {
  id: string
  text: string
  due: string | null
  evidenceTier: EvidenceTier
}

export interface ContextPacket {
  schema: 'wcf.packet.v1'
  id: string
  createdAt: string
  destination: 'fable' | 'local_mock_ai'
  question: string | null
  scarcity: PacketScarcity
  mode: PacketSection<{ id: ModeId; label: string }>
  familiar: PacketSection<{ state: FamiliarStateId }>
  attention: PacketSection<{ action: string; reason: string; msIdle: number }>
  selection: PacketSection<{
    projects: PacketProjectRef[]
    tasks: PacketTaskRef[]
  }>
  sessionEvents: PacketSection<{ events: string[] }>
  /** Continuity firewall: null unless the user explicitly crossed the wall. */
  longTermMemory: PacketSection<{ notes: string[] }> | null
  evidenceSummary: Partial<Record<EvidenceTier, number>>
}
