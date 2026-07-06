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
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'

const RENDERER_DEV_URL = process.env['ELECTRON_RENDERER_URL']

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
 *   - filesystem persistence in app.getPath('userData') (localStorage v1)
 *   - allowlisted shell execution (never raw child_process on user input)
 *   - launch-on-login / packaged .app bundle
 * Each of these must arrive as an interface + explicit user opt-in,
 * surfaced in the UI with tier `future_seam` until real.
 * ------------------------------------------------------------------------ */
