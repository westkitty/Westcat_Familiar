/**
 * Context Packet Forge. Law 7: packets are high-signal, not world dumps —
 * three most-recent active projects, five open tasks, current state, and
 * (only if the user crosses the firewall) long-term notes.
 */
import { MOCK_PROJECTS } from '../data/mocks/projects'
import { MOCK_TASKS } from '../data/mocks/tasks'
import { getMode } from '../domain/modeManager'
import { mergeTallies, tallyTiers } from '../domain/evidence'
import { continuityFirewall } from './continuityFirewall'
import type { AttentionDecision } from '../types'
import type { ContextPacket, PacketProjectRef, PacketTaskRef } from '../types/packet'
import type { FamiliarStateId } from '../types/familiar'
import type { ModeId } from '../types/mode'
import { PACKET_SCHEMA } from '../../shared/constants'
import { persistence, KEYS } from '../state/persistence'

export interface ForgeInputs {
  question: string | null
  destination: 'fable' | 'local_mock_ai'
  modeId: ModeId
  familiarState: FamiliarStateId
  attention: AttentionDecision
  includeLongTermMemory: boolean
  fableBudgetRemaining: number
  gatePassed: boolean
}

let forgeCounter = 0

export function forgePacket(i: ForgeInputs): ContextPacket {
  const mode = getMode(i.modeId)

  const projects: PacketProjectRef[] = [...MOCK_PROJECTS]
    .filter((p) => p.status !== 'archived')
    .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      lastActivity: p.lastActivity,
      evidenceTier: p.evidenceTier
    }))

  const tasks: PacketTaskRef[] = MOCK_TASKS.filter((t) => !t.completed)
    .slice(0, 5)
    .map((t) => ({ id: t.id, text: t.text, due: t.due, evidenceTier: t.evidenceTier }))

  const sessionEvents = continuityFirewall.sessionEvents()

  const longTermMemory = i.includeLongTermMemory
    ? {
        title: 'Long-term memory (firewall crossed — read logged)',
        evidenceTier: 'mock' as const,
        data: { notes: continuityFirewall.readLongTerm('packet forge').map((n) => n.text) }
      }
    : null

  const packet: ContextPacket = {
    schema: PACKET_SCHEMA,
    id: `pkt-${Date.now().toString(36)}-${++forgeCounter}`,
    createdAt: new Date().toISOString(),
    destination: i.destination,
    question: i.question && i.question.trim() !== '' ? i.question.trim() : null,
    scarcity: {
      fableBudgetRemaining: i.fableBudgetRemaining,
      estimatedCost: i.destination === 'fable' ? 'high' : 'low',
      gatePassed: i.gatePassed
    },
    mode: {
      title: 'Active mode',
      evidenceTier: 'verified',
      data: { id: mode.id, label: mode.label }
    },
    familiar: {
      title: 'Familiar state',
      evidenceTier: 'verified',
      data: { state: i.familiarState }
    },
    attention: {
      title: 'Attention snapshot',
      evidenceTier: i.attention.evidenceTier,
      data: {
        action: i.attention.action,
        reason: i.attention.reason,
        msIdle: i.attention.msIdle
      }
    },
    selection: {
      title: 'Selected context (top 3 projects, 5 open tasks)',
      evidenceTier: 'mock',
      data: { projects, tasks }
    },
    sessionEvents: {
      title: 'Session events (this window only)',
      evidenceTier: 'verified',
      data: { events: sessionEvents.map((e) => e.text) }
    },
    longTermMemory,
    evidenceSummary: {}
  }

  packet.evidenceSummary = mergeTallies(
    tallyTiers(projects),
    tallyTiers(tasks),
    tallyTiers([...sessionEvents]),
    { [packet.mode.evidenceTier]: 1 },
    { [packet.familiar.evidenceTier]: 1 },
    { [packet.attention.evidenceTier]: 1 },
    longTermMemory ? { [longTermMemory.evidenceTier]: 1 } : {}
  )

  persistence.set(KEYS.lastPacket, packet)
  continuityFirewall.addSessionEvent(
    `Forged packet ${packet.id} for ${packet.destination} (gate ${i.gatePassed ? 'passed' : 'not required'}).`
  )
  return packet
}

export function getLastPersistedPacket(): ContextPacket | null {
  return persistence.get<ContextPacket>(KEYS.lastPacket)
}
