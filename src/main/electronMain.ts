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

const SMOKE_TEST = process.env['WESTCAT_SMOKE_TEST'] === '1'

async function runSmokeTest(win: BrowserWindow): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Smoke test timed out waiting for renderer load')), 15000)
    win.webContents.once('did-finish-load', () => {
      clearTimeout(timeout)
      resolve()
    })
  })

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      const root = document.querySelector('.familiar-root')
      if (!(root instanceof HTMLElement)) throw new Error('familiar root missing')

      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      await wait(50)

      const drawer = document.querySelector('.command-drawer')
      if (!(drawer instanceof HTMLElement)) throw new Error('command drawer did not open')

      const input = drawer.querySelector('input[type="text"]')
      if (!(input instanceof HTMLInputElement)) throw new Error('router input missing')

      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )?.set
      valueSetter?.call(input, 'what mode are we in')
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await wait(20)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      await wait(80)

      const semantic = document.querySelector('[data-familiar-reaction]')
      const reaction = semantic?.getAttribute('data-familiar-reaction')
      const attention = semantic?.getAttribute('data-familiar-attention')
      const response = document.querySelector('.router-response')?.textContent?.trim() ?? ''
      const mode = document.querySelector('.status-mode')?.textContent?.trim() ?? ''

      return {
        drawerOpen: Boolean(drawer),
        reaction,
        attention,
        response,
        mode
      }
    })()
  `)

  if (!result.drawerOpen) throw new Error('drawer smoke assertion failed')
  if (!result.mode) throw new Error('mode status missing')
  if (!result.reaction) throw new Error('familiar semantic reaction missing')
  if (!result.attention) throw new Error('familiar semantic attention missing')
  if (!result.response) throw new Error('router response missing')

  console.log('[WESTCAT smoke]', JSON.stringify(result))
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

  const win = createFamiliarWindow()
  if (SMOKE_TEST) {
    void runSmokeTest(win)
      .then(() => app.quit())
      .catch((error) => {
        console.error('[WESTCAT smoke failure]', error)
        app.exit(1)
      })
  }

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
