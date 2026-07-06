# Technical Target Spec — WESTCAT Familiar (Electron + React)

## Core Architecture

**Electron Main Process**
- Responsible for: creating the BrowserWindow(s), window management (frameless where appropriate, always-on-top optional in future), app lifecycle, native integration points (future), secure preload exposure.
- Must support a "familiar" window that feels like a persistent desktop citizen rather than a standard app window.
- In v1: single main window + ability to show/hide drawer content inside it or as a secondary controlled window/panel.

**Preload Bridge (src/main/preload.ts)**
- Exposes a narrow, typed API to the renderer via `contextBridge`.
- No direct `ipcRenderer` or Node access from renderer.
- v1 methods: persistence (get/set position, prefs, mock state), self-audit trigger, packet generation (local), mock diagnostics.
- All real dangerous capabilities (shell, fs beyond user data dir) are future_seam only and must be mocked/allowlisted.

**React Renderer (Vite)**
- Modern React 18/19 + TypeScript.
- Vite for fast dev and optimized production builds.
- The entire UI is React. No mixing legacy webviews.

## Storage Strategy (v1 → future)

- **v1**: `localStorage` + in-memory + JSON mock files bundled with the app. Simple, zero setup, auditable.
- **Future**: Filesystem JSON (via Electron userData path or a proper local DB like better-sqlite3 or json-file store). Clear seam.
- All persisted data must be human-readable when possible.
- Never store secrets in a way that would be hard to audit.

## No Unsafe Execution in v1

- No direct `child_process.exec` or `shell.openExternal` on arbitrary input.
- Any future shell allowlist must live behind explicit user approval + allowlist config.
- All command execution in v1 is mocked with clear labels.

## External API Policy

- v1 must run 100% offline.
- No real calls to Ollama, OpenAI, Grok, Fable, Gemini, or any cloud service are required or allowed for core functionality.
- All "AI" surfaces use transparent mocks.
- Future integration seams must be interface-only (e.g., `AIService` with `mockAIService` and `ollamaAIService` implementations).

## Mock Data Discipline

- All mock data lives under `src/data/` or `src/mocks/`.
- Every mock record or generator must expose an `evidenceTier` field or be wrapped with tier metadata.
- Mock data must be easy to swap or regenerate.

## Future Seams (implement clean interfaces + mocks now)

- Mac packaging / .app bundle + launch-on-login
- Global shortcuts (Electron globalShortcut or native module later)
- Always-on-top production behavior (currently tricky in Electron; needs research)
- Real filesystem-backed persistence
- Allowlisted shell commands
- Local model integration (Ollama / llama.cpp / Fable local)
- TTS / audio playback
- Attention budget / continuity across sessions

## Type Layer

- Strong TypeScript throughout.
- Domain types for: FamiliarState, Mode, EvidenceTier, Command, ContextPacket, AttentionDecision, AuditResult, Project, Task, StackDiagnostic, etc.
- No `any` in production paths.

## Build & Run

- `npm install`
- `npm run dev` → launches Electron dev window with HMR
- `npm run build` → produces distributable
- Optional: `npm run electron:build` or similar for packaged artifact later

## Window Behavior Goals (v1 achievable)

- Familiar window is frameless or minimally decorated.
- Draggable via custom titlebar region or whole surface (with care for interactive elements).
- Position restored on launch.
- Drawer/panels can be shown/hidden without destroying the familiar's presence.

## What "Local First" Means Here

The app must be fully usable after `npm install && npm run dev` with zero network and zero external accounts. All "intelligence" is mocked with visible tiers until real local services are deliberately connected later.
