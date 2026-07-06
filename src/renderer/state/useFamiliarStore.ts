/**
 * Familiar store: state-machine position, screen position, whispers.
 * All state changes go through requestState, which enforces the
 * transition table (Law 3 — no motion without a legal state change).
 */
import { create } from 'zustand'
import { canTransition } from '../domain/familiarStateMachine'
import type { FamiliarPosition, FamiliarStateId } from '../types/familiar'
import { persistence, KEYS } from './persistence'

interface FamiliarStore {
  stateId: FamiliarStateId
  position: FamiliarPosition
  flipped: boolean
  whisper: string | null
  /** Returns false when the transition table forbids the move. */
  requestState: (to: FamiliarStateId) => boolean
  /** Live position while dragging (not persisted per-frame). */
  movePosition: (p: FamiliarPosition) => void
  /** Persist the final position (drag end). */
  commitPosition: (p: FamiliarPosition) => void
  setFlipped: (f: boolean) => void
  setWhisper: (w: string | null) => void
}

function getSavedPosition(): FamiliarPosition {
  try {
    const pos = persistence.get<unknown>(KEYS.position)
    if (pos && typeof pos === 'object' && 'x' in pos && 'y' in pos) {
      const x = Number((pos as any).x)
      const y = Number((pos as any).y)
      if (!isNaN(x) && !isNaN(y)) {
        return { x, y }
      }
    }
  } catch (e) {
    // Fail silently
  }
  return { x: 140, y: 160 }
}

function getSavedFlipped(): boolean {
  try {
    const flipped = persistence.get<unknown>(KEYS.flipped)
    if (typeof flipped === 'boolean') {
      return flipped
    }
  } catch (e) {
    // Fail silently
  }
  return false
}

export const useFamiliarStore = create<FamiliarStore>()((set, get) => ({
  stateId: 'idle',
  position: getSavedPosition(),
  flipped: getSavedFlipped(),
  whisper: null,
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
  setWhisper: (w) => set({ whisper: w })
}))
