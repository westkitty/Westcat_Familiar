/**
 * WESTCAT Familiar — preload bridge.
 *
 * SECURITY CERTIFICATE:
 * - contextIsolation: true (verified in electronMain.ts)
 * - nodeIntegration: false (verified in electronMain.ts)
 * - Exposes a deliberately tiny, typed surface via contextBridge.
 * - No raw ipcRenderer leak, no Node API access from the renderer, no system command shell execution.
 * - Dangerous capabilities (shell, fs, network) are future seams and do
 *   NOT appear here — see electronMain.ts for the seam inventory.
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
