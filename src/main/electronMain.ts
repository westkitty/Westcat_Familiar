/**
 * WESTCAT Familiar — Electron main process.
 *
 * Law 1 (Familiar First): this process creates exactly one frameless,
 * transparent window whose sole tenant is the familiar. There is no
 * dashboard shell to hide it behind.
 *
 * Law 8 (Local First): nothing here touches the network. Navigation and
 * window.open are denied outright, so the renderer cannot leave disk.
 */
import { execFile } from 'node:child_process'
import { constants as fsConstants } from 'node:fs'
import { access, appendFile, readdir, readFile, realpath, stat } from 'node:fs/promises'
import { basename, isAbsolute, join } from 'node:path'
import { promisify } from 'node:util'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import type { OpenDialogOptions } from 'electron'
import type { HandoffWriteResult, WorkspaceInspection } from '../shared/governance'

const RENDERER_DEV_URL = process.env['ELECTRON_RENDERER_URL']
const execFileAsync = promisify(execFile)
const INSPECTION_TIMEOUT_MS = 2500
const HANDOFF_NAMES = new Set(['HANDOFF.md', 'PROJECT_LEDGER.md', 'DECISIONS.md', 'MEMORY.md', 'codex_handoff.md'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function pathAccessible(path: string, mode: number): Promise<boolean> {
  try {
    await access(path, mode)
    return true
  } catch {
    return false
  }
}

async function runObserved(command: string, args: string[]): Promise<string | null> {
  try {
    const result = await execFileAsync(command, args, {
      timeout: INSPECTION_TIMEOUT_MS,
      maxBuffer: 64 * 1024,
      encoding: 'utf8'
    })
    return result.stdout.trim()
  } catch {
    return null
  }
}

async function packageMetadata(workspacePath: string): Promise<{
  packageManager?: WorkspaceInspection['packageManager']
  packageManagerAvailable?: boolean
  buildScriptAvailable: boolean
  typecheckScriptAvailable: boolean
}> {
  const lockfiles: Array<{ name: string; manager: NonNullable<WorkspaceInspection['packageManager']>; command: string }> = [
    { name: 'bun.lock', manager: 'bun', command: 'bun' },
    { name: 'bun.lockb', manager: 'bun', command: 'bun' },
    { name: 'pnpm-lock.yaml', manager: 'pnpm', command: 'pnpm' },
    { name: 'yarn.lock', manager: 'yarn', command: 'yarn' },
    { name: 'package-lock.json', manager: 'npm', command: 'npm' }
  ]
  const selected = (await Promise.all(lockfiles.map(async (candidate) => ({
    ...candidate,
    present: await pathExists(join(workspacePath, candidate.name))
  })))).find((candidate) => candidate.present)

  let buildScriptAvailable = false
  let typecheckScriptAvailable = false
  const packagePath = join(workspacePath, 'package.json')

  if (await pathExists(packagePath)) {
    try {
      const parsed: unknown = JSON.parse(await readFile(packagePath, 'utf8'))

      if (isRecord(parsed) && isRecord(parsed.scripts)) {
        buildScriptAvailable = typeof parsed.scripts.build === 'string'
        typecheckScriptAvailable = typeof parsed.scripts.typecheck === 'string'
      }
    } catch {
      // Malformed package metadata is reported as absent capability, not trusted.
    }
  }

  if (selected === undefined) return { buildScriptAvailable, typecheckScriptAvailable }
  return {
    packageManager: selected.manager,
    packageManagerAvailable: (await runObserved(selected.command, ['--version'])) !== null,
    buildScriptAvailable,
    typecheckScriptAvailable
  }
}

async function inspectWorkspace(rawPath: string): Promise<WorkspaceInspection> {
  const checkedAt = new Date().toISOString()

  if (!isAbsolute(rawPath)) {
    return {
      workspacePath: rawPath,
      label: basename(rawPath) || 'invalid path',
      checkedAt,
      exists: false,
      readable: false,
      writable: false,
      repository: false,
      gitAvailable: false,
      nodeAvailable: true,
      dependenciesInstalled: false,
      buildScriptAvailable: false,
      typecheckScriptAvailable: false,
      handoffFiles: [],
      errors: ['Project inspection requires an absolute local path.']
    }
  }

  let workspacePath = rawPath
  const errors: string[] = []

  try {
    workspacePath = await realpath(rawPath)
  } catch {
    errors.push('Selected path does not exist or cannot be resolved.')
  }

  const exists = await pathExists(workspacePath)
  const readable = exists && await pathAccessible(workspacePath, fsConstants.R_OK)
  const writable = exists && await pathAccessible(workspacePath, fsConstants.W_OK)
  const gitVersion = await runObserved('git', ['--version'])
  const gitAvailable = gitVersion !== null
  const repositoryResult = exists && gitAvailable
    ? await runObserved('git', ['-C', workspacePath, 'rev-parse', '--is-inside-work-tree'])
    : null
  const repository = repositoryResult === 'true'
  const branch = repository ? await runObserved('git', ['-C', workspacePath, 'branch', '--show-current']) : null
  const statusOutput = repository ? await runObserved('git', ['-C', workspacePath, 'status', '--porcelain', '-uno']) : null
  const metadata = exists ? await packageMetadata(workspacePath) : {
    buildScriptAvailable: false,
    typecheckScriptAvailable: false
  }
  const dependenciesInstalled = exists && await pathExists(join(workspacePath, 'node_modules'))
  let handoffFiles: string[] = []

  if (readable) {
    try {
      handoffFiles = (await readdir(workspacePath))
        .filter((name) => HANDOFF_NAMES.has(name))
        .sort((left, right) => left.localeCompare(right))
    } catch {
      errors.push('Directory metadata could not be listed.')
    }
  }

  const inspection: WorkspaceInspection = {
    workspacePath,
    label: basename(workspacePath),
    checkedAt,
    exists,
    readable,
    writable,
    repository,
    workingTreeDirty: statusOutput === null ? undefined : statusOutput.length > 0,
    gitAvailable,
    nodeAvailable: true,
    packageManager: metadata.packageManager,
    packageManagerAvailable: metadata.packageManagerAvailable,
    dependenciesInstalled,
    buildScriptAvailable: metadata.buildScriptAvailable,
    typecheckScriptAvailable: metadata.typecheckScriptAvailable,
    handoffFiles,
    errors
  }

  if (branch !== null && branch !== '') inspection.branch = branch
  return inspection
}

function redactHandoffText(value: string): string {
  return value
    .replace(/\b(api[_-]?key|token|password|passwd|secret)\b\s*[:=]\s*([^\s,;]+)/gi, '$1=[REDACTED]')
    .replace(/\bBearer\s+[a-z0-9._~+/-]+=*/gi, 'Bearer [REDACTED]')
    .slice(0, 16_000)
}

async function appendProjectHandoff(
  workspacePathInput: string,
  content: string
): Promise<HandoffWriteResult> {
  if (!isAbsolute(workspacePathInput)) throw new TypeError('Handoff workspace must be an absolute path.')
  const workspacePath = await realpath(workspacePathInput)
  const workspaceStat = await stat(workspacePath)

  if (!workspaceStat.isDirectory()) throw new TypeError('Handoff workspace must be a directory.')
  const path = join(workspacePath, 'WESTCAT_HANDOFF.md')
  const writtenAt = new Date().toISOString()
  const block = `\n\n## WESTCAT Familiar closeout — ${writtenAt}\n\n${redactHandoffText(content).trim()}\n`
  await appendFile(path, block, { encoding: 'utf8', mode: 0o600 })
  return { path, appended: true, writtenAt }
}

function createFamiliarWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 760,
    minHeight: 540,
    show: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false
    }
  })

  win.once('ready-to-show', () => win.show())

  // Local First: the renderer never navigates and never opens windows.
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  win.webContents.on('will-navigate', (event) => event.preventDefault())

  if (RENDERER_DEV_URL) {
    void win.loadURL(RENDERER_DEV_URL)
  } else {
    void win.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return win
}

app.whenReady().then(() => {
  // Narrow IPC surface. Everything else the renderer needs lives locally
  // in the renderer (localStorage, mocks). Evidence tier of this data
  // where displayed: verified — it comes from the live process.
  ipcMain.handle('familiar:info', () => ({
    platform: process.platform,
    versions: {
      electron: process.versions.electron ?? 'unknown',
      chrome: process.versions.chrome ?? 'unknown',
      node: process.versions.node ?? 'unknown'
    }
  }))
  ipcMain.handle('familiar:quit', () => app.quit())
  ipcMain.handle('familiar:select-workspace', async (event) => {
    const parent = BrowserWindow.fromWebContents(event.sender)
    const options: OpenDialogOptions = {
      title: 'Select a project folder',
      properties: ['openDirectory', 'createDirectory']
    }
    const result = parent === null
      ? await dialog.showOpenDialog(options)
      : await dialog.showOpenDialog(parent, options)
    return result.canceled ? null : result.filePaths[0] ?? null
  })
  ipcMain.handle('familiar:inspect-workspace', (_event, workspacePath: unknown) => {
    if (typeof workspacePath !== 'string') {
      throw new TypeError('Workspace path must be a string.')
    }
    return inspectWorkspace(workspacePath)
  })
  ipcMain.handle('familiar:append-handoff', (_event, workspacePath: unknown, content: unknown) => {
    if (typeof workspacePath !== 'string' || typeof content !== 'string') {
      throw new TypeError('Handoff path and content must be strings.')
    }
    return appendProjectHandoff(workspacePath, content)
  })

  createFamiliarWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createFamiliarWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/* --------------------------------------------------------------------------
 * FUTURE SEAMS — declared intent, deliberately NOT implemented in v1:
 *   - alwaysOnTop toggle (needs macOS behavior research; see spec)
 *   - globalShortcut summon hotkey
 *   - filesystem persistence in app.getPath('userData') (versioned localStorage remains current)
 *   - allowlisted shell execution (never raw child_process on user input)
 *   - launch-on-login / packaged .app bundle
 * Each of these must arrive as an interface + explicit user opt-in,
 * surfaced in the UI with tier `future_seam` until real.
 * ------------------------------------------------------------------------ */
