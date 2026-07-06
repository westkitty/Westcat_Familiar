/** Mode store. The persisted mode is validated before trusting it. */
import { create } from 'zustand'
import { DEFAULT_MODE, isModeId } from '../domain/modeManager'
import type { ModeId } from '../types/mode'
import { persistence, KEYS } from './persistence'

interface ModeStore {
  modeId: ModeId
  setMode: (m: ModeId) => void
}

const saved = persistence.get<string>(KEYS.mode)

export const useModeStore = create<ModeStore>()((set) => ({
  modeId: isModeId(saved) ? saved : DEFAULT_MODE,
  setMode: (m) => {
    set({ modeId: m })
    persistence.set(KEYS.mode, m)
  }
}))
