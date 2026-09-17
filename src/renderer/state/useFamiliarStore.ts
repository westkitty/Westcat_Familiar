/**
 * Familiar store: state-machine position, screen position, whispers.
 * All state changes go through requestState, which enforces the
 * transition table (Law 3 — no motion without a legal state change).
 */
import { create } from 'zustand'
import { canTransition } from '../domain/familiarStateMachine'
import { resolveFamiliarSignal, stateForFamiliarSignal, type FamiliarSignal } from '../../shared/familiarBus'
import type { FamiliarPosition, FamiliarStateId } from '../types/familiar'
import { persistence, KEYS } from './persistence'

interface FamiliarStore {
  stateId: FamiliarStateId
  position: FamiliarPosition
  flipped: boolean
  whisper: string | null
  familiarSignal: FamiliarSignal | null
  publishSignal: (signal: FamiliarSignal) => FamiliarSignal
  /** Returns false when the transition table forbids the move. */
  requestState: (to: FamiliarStateId) => boolean
  /** Live position while dragging (not persisted per-frame). */
  movePosition: (p: FamiliarPosition) => void
  /** Persist the final position (drag end). */
  commitPosition: (p: FamiliarPosition) => void
  setFlipped: (f: boolean) => void
  setWhisper: (w: string | null) => void
}

const savedPosition = persistence.get<FamiliarPosition>(KEYS.position)
const savedFlipped = persistence.get<boolean>(KEYS.flipped)

export const useFamiliarStore = create<FamiliarStore>()((set, get) => ({
  stateId: 'idle',
  position: savedPosition ?? { x: 140, y: 160 },
  flipped: savedFlipped ?? false,
  whisper: null,
  familiarSignal: null,
  requestState: (to) => {
    const from = get().stateId
    if (from === to) return true
    if (!canTransition(from, to)) return false
    set({ stateId: to })
    return true
  },
  movePosition: (p) => set({ position: p }),
  commitPosition: (p) => {
    set({ position: p })
    persistence.set(KEYS.position, p)
  },
  setFlipped: (f) => {
    set({ flipped: f })
    persistence.set(KEYS.flipped, f)
  },
  setWhisper: (w) => set({ whisper: w }),
  publishSignal: (signal) => {
    const current = get().familiarSignal
    const resolved = resolveFamiliarSignal(current, signal, signal.timestamp)
    set({ familiarSignal: resolved })

    if (resolved === signal) {
      const target = stateForFamiliarSignal(resolved)
      const from = get().stateId
      if (from !== target && canTransition(from, target)) {
        set({ stateId: target })
      }
    }

    return resolved
  }
}))
