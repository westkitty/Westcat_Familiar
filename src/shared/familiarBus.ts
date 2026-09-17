import type { FamiliarStateId } from '../renderer/types/familiar'

export type FamiliarAttention = 'idle' | 'aware' | 'focused' | 'interrupted' | 'urgent'
export type FamiliarReaction =
  | 'neutral' | 'blink' | 'curious' | 'startled' | 'pleased' | 'irritated'
  | 'sleepy' | 'dizzy' | 'celebrate' | 'warning' | 'error'
export type FamiliarTrigger = 'pointer' | 'touch' | 'audio' | 'system' | 'agent' | 'timer' | 'world'

export interface FamiliarSignal {
  entityId: string
  source: string
  attention: FamiliarAttention
  reaction?: FamiliarReaction
  intensity: number
  look?: { x: number; y: number }
  trigger: FamiliarTrigger
  priority?: number
  durationMs?: number
  timestamp: number
  sequence: number
}

export function isFamiliarSignalExpired(signal: FamiliarSignal | null, now = Date.now()): boolean {
  if (!signal) return true
  if (signal.durationMs == null) return false
  return now > signal.timestamp + signal.durationMs
}

export function resolveFamiliarSignal(
  current: FamiliarSignal | null,
  incoming: FamiliarSignal,
  now = Date.now()
): FamiliarSignal {
  if (!current || isFamiliarSignalExpired(current, now)) return incoming
  const currentPriority = current.priority ?? 10
  const incomingPriority = incoming.priority ?? 10
  if (incomingPriority !== currentPriority) return incomingPriority > currentPriority ? incoming : current
  if (incoming.sequence !== current.sequence) return incoming.sequence > current.sequence ? incoming : current
  return incoming.timestamp >= current.timestamp ? incoming : current
}

export function stateForFamiliarSignal(signal: FamiliarSignal): FamiliarStateId {
  switch (signal.reaction) {
    case 'error':
      return 'blocked'
    case 'warning':
      return 'judging'
    case 'irritated':
    case 'dizzy':
      return 'annoyed'
    case 'sleepy':
      return 'sleeping'
    case 'startled':
      return 'alert'
    case 'celebrate':
    case 'pleased':
      return 'watching'
    case 'curious':
      return 'watching'
    default:
      break
  }

  switch (signal.attention) {
    case 'urgent':
    case 'interrupted':
      return 'alert'
    case 'focused':
      return signal.trigger === 'agent' ? 'thinking' : 'working'
    case 'aware':
      return 'watching'
    case 'idle':
    default:
      return 'idle'
  }
}
