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
import { contextBridge, ipcRenderer, webUtils } from 'electron'
import type { HandoffWriteResult, WorkspaceInspection } from '../shared/governance'

export interface BridgeInfo {
  platform: string
  versions: { electron: string; chrome: string; node: string }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseBridgeInfo(value: unknown): BridgeInfo {
  if (!isRecord(value) || typeof value.platform !== 'string' || !isRecord(value.versions)) {
    throw new TypeError('Invalid process information returned by Electron.')
  }
  const { versions } = value

  if (typeof versions.electron !== 'string' || typeof versions.chrome !== 'string' || typeof versions.node !== 'string') {
    throw new TypeError('Invalid runtime versions returned by Electron.')
  }
  return {
    platform: value.platform,
    versions: {
      electron: versions.electron,
      chrome: versions.chrome,
      node: versions.node
    }
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function parseWorkspaceInspection(value: unknown): WorkspaceInspection {
  if (
    !isRecord(value) ||
    typeof value.workspacePath !== 'string' ||
    typeof value.label !== 'string' ||
    typeof value.checkedAt !== 'string' ||
    typeof value.exists !== 'boolean' ||
    typeof value.readable !== 'boolean' ||
    typeof value.writable !== 'boolean' ||
    typeof value.repository !== 'boolean' ||
    typeof value.gitAvailable !== 'boolean' ||
    typeof value.nodeAvailable !== 'boolean' ||
    typeof value.dependenciesInstalled !== 'boolean' ||
    typeof value.buildScriptAvailable !== 'boolean' ||
    typeof value.typecheckScriptAvailable !== 'boolean' ||
    !isStringArray(value.handoffFiles) ||
    !isStringArray(value.errors)
  ) {
    throw new TypeError('Invalid workspace inspection returned by Electron.')
  }
  const result: WorkspaceInspection = {
    workspacePath: value.workspacePath,
    label: value.label,
    checkedAt: value.checkedAt,
    exists: value.exists,
    readable: value.readable,
    writable: value.writable,
    repository: value.repository,
    gitAvailable: value.gitAvailable,
    nodeAvailable: value.nodeAvailable,
    dependenciesInstalled: value.dependenciesInstalled,
    buildScriptAvailable: value.buildScriptAvailable,
    typecheckScriptAvailable: value.typecheckScriptAvailable,
    handoffFiles: value.handoffFiles,
    errors: value.errors
  }

  if (typeof value.branch === 'string') result.branch = value.branch
  if (typeof value.workingTreeDirty === 'boolean') result.workingTreeDirty = value.workingTreeDirty
  if (value.packageManager === 'npm' || value.packageManager === 'pnpm' || value.packageManager === 'yarn' || value.packageManager === 'bun') result.packageManager = value.packageManager
  if (typeof value.packageManagerAvailable === 'boolean') result.packageManagerAvailable = value.packageManagerAvailable
  return result
}

function parseHandoffWriteResult(value: unknown): HandoffWriteResult {
  if (!isRecord(value) || typeof value.path !== 'string' || typeof value.appended !== 'boolean' || typeof value.writtenAt !== 'string') {
    throw new TypeError('Invalid handoff result returned by Electron.')
  }
  return { path: value.path, appended: value.appended, writtenAt: value.writtenAt }
}

const familiarBridge = {
  /** Live process info from the main process. Evidence tier: verified. */
  getInfo: async (): Promise<BridgeInfo> => parseBridgeInfo(await ipcRenderer.invoke('familiar:info')),
  /** Quit the app (used by the familiar's context menu). */
  quit: async (): Promise<void> => {
    await ipcRenderer.invoke('familiar:quit')
  },
  selectWorkspace: async (): Promise<string | null> => {
    const result: unknown = await ipcRenderer.invoke('familiar:select-workspace')

    if (result === null || typeof result === 'string') return result
    throw new TypeError('Invalid workspace selection returned by Electron.')
  },
  inspectWorkspace: async (workspacePath: string): Promise<WorkspaceInspection> => {
    return parseWorkspaceInspection(await ipcRenderer.invoke('familiar:inspect-workspace', workspacePath))
  },
  appendProjectHandoff: async (workspacePath: string, content: string): Promise<HandoffWriteResult> => {
    return parseHandoffWriteResult(await ipcRenderer.invoke('familiar:append-handoff', workspacePath, content))
  },
  getDroppedFilePath: (file: File): string | null => {
    const path = webUtils.getPathForFile(file)
    return path === '' ? null : path
  }
}

export type FamiliarBridge = typeof familiarBridge

contextBridge.exposeInMainWorld('familiarBridge', familiarBridge)
