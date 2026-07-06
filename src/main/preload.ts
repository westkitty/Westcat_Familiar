/**
 * WESTCAT Familiar — preload bridge.
 *
 * Exposes a deliberately tiny, typed surface via contextBridge.
 * No ipcRenderer leak, no Node access from the renderer.
 * Dangerous capabilities (shell, fs, network) are future seams and do
 * NOT appear here — see electronMain.ts for the seam inventory.
 */
import { contextBridge, ipcRenderer } from 'electron'

export interface BridgeInfo {
  platform: string
  versions: { electron: string; chrome: string; node: string }
}

const familiarBridge = {
  /** Live process info from the main process. Evidence tier: verified. */
  getInfo: (): Promise<BridgeInfo> =>
    ipcRenderer.invoke('familiar:info') as Promise<BridgeInfo>,
  /** Quit the app (used by the familiar's context menu). */
  quit: (): Promise<void> => ipcRenderer.invoke('familiar:quit') as Promise<void>
}

export type FamiliarBridge = typeof familiarBridge

contextBridge.exposeInMainWorld('familiarBridge', familiarBridge)
