# WESTCAT Familiar — Fable 5 Build Prompt (Authoritative)

You are Fable 5. Build a **runnable local-first desktop application** called **WESTCAT Familiar**.

## Product Definition

WESTCAT Familiar is a Mac-first animated desktop familiar / mascot-buddy that serves as the primary interface to a local command layer. The familiar itself is the interface. A command drawer is summoned from the familiar. The app prepares the ground for future local agentic reasoning (Fable) without depending on it.

**Target stack (non-negotiable for this build):**
- Electron (main process + window management)
- React + TypeScript + Vite (renderer)
- Local-first only (no external APIs required to run)
- Transparent mock data with explicit evidence tiers

**Do not build a web app that happens to run in Electron. Build a proper desktop familiar experience.**

## Non-Negotiable Product Laws (Familiar Constitution — enforce these ruthlessly)

1. **Familiar First** — The animated familiar must be the first and primary thing the user sees and interacts with. Panels and drawers are summoned from it, never the other way around.

2. **Presence Before Panels** — The familiar maintains continuous visual presence. Do not hide the familiar behind a traditional app window or dashboard on launch.

3. **Motion Means State** — Every animation, idle loop, transition, or micro-interaction must be driven by an explicit state in the familiar state machine. No decorative animation without state.

4. **Attention Must Be Earned** — The familiar and drawer must respect user attention. Do not auto-open drawers or flash urgent UI without justification from the attention engine.

5. **No False Certainty** — All data, suggestions, diagnostics, and AI outputs must carry visible evidence tiers: `verified | mock | inferred | stale | unavailable | future_seam`. Never present mock data as real.

6. **Mode Changes Behavior** — Different modes (e.g., Focus, Check-in, Explore, Inspect) must visibly and functionally change the familiar's appearance, available actions, animation, and drawer contents.

7. **Fable Is Scarce** — Fable (the reasoning engine) is a precious, limited resource. The UI must gate recommendations for Fable use. The router must prefer cheaper local paths first.

8. **Local First Means Local First** — The app must run completely offline with mock data. No network calls on startup or for core flows. All "future" integrations (Ollama, real Fable, shell, TTS) must be clearly marked seams with mock implementations.

9. **Dexter Is Not Cute** — "Dexter Inspect" (the project self-inspection / necromancy lens) must feel precise, diagnostic, slightly clinical, and useful — not whimsical or overly cartoonish. It surfaces real structure and history.

10. **The Project Must Be Auditable** — Every major decision, mock, route, and packet must be inspectable locally via built-in tools (self-audit harness, stack status, context packet forge, Dexter).

## Required Features for This Build (minimum shippable v0)

- **Familiar component**: Draggable, animated cat/familiar that shows state (idle, attentive, thinking, reacting, etc.). Position persists across restarts (localStorage first, future filesystem).
- **Command drawer**: Summoned by interacting with the familiar (click, hotkey, or gesture). Contains quick actions and mode switcher.
- **Modes**: At least 3–4 modes that change familiar visuals, available commands, and behavior (e.g., Focus / Check-in / Explore / Inspect).
- **Familiar state machine**: Explicit states + transitions. Motion tied to state.
- **Attention arbitration engine**: Simple rules that decide when the familiar should interrupt or stay quiet.
- **Evidence tiers**: Every piece of data in UI (tasks, projects, diagnostics, suggestions) shows its evidence tier.
- **Continuity firewall**: Clear separation between "current session" and "long-term memory" (mocked).
- **AI / Command router with Fable scarcity gate**: A router that can produce a "context packet" for Fable. The gate must actively discourage over-use of Fable. Show cost/scarce signals.
- **Context packet forge**: Button/tool that generates a structured packet from current state + selected context. Display the packet.
- **Project necromancy lens (Dexter Inspect)**: A view that lets the user inspect the "graveyard" of previous WestCat experiments, current project structure, decisions, and risks. Must work with local mock data.
- **Stack Status mock diagnostics**: A panel showing pretend process health, dependency versions, local storage usage, attention budget, etc. Clearly labeled as mock.
- **Local self-audit harness**: A runnable local audit that checks the app's own state, data integrity, evidence labeling, and law compliance. Produces a report.
- **Panels**: At minimum — Command Drawer, Modes, Dexter Inspect, Stack Status, Context Packet, Self-Audit. Panels must feel secondary to the familiar.
- **Persistence**: Position, current mode, some user preferences saved locally and restored.
- **Reduced motion support**: Respect `prefers-reduced-motion`.
- **Transparent mocks**: Every mock data file or generator must be easy to find and clearly labeled.

**Future seams (implement as clean interfaces + mocks only, do not wire real services):**
- Mac-specific packaging / launch-on-login / always-on-top
- Global shortcuts
- Real filesystem JSON storage (localStorage is acceptable v1)
- Allowlisted shell command execution
- Ollama / local Fable / Grok / Codex integration points
- TTS / audio

**Explicitly forbidden in this build:**
- Any real external API calls (Gemini, OpenAI, etc.) that would break offline use.
- Cloud accounts or auth.
- Real shell execution that could be dangerous.
- Treating Fable as always-available or cheap.
- Dashboard-first layout where the familiar is a small widget in the corner of a big control panel.
- Porting PySide code 1:1 (use only as conceptual inspiration).

## Source Lineage (use as inspiration, not implementation)

Previous work existed as a family of Python/PySide "WestCat Overlay" experiments:
- `WestCat_Overlay_MacOS`: Strongest reference for local companion philosophy, BIBLE-style scope discipline, chat bubble + cat coordination, macOS packaging intent, graceful failure, and high-quality internal docs.
- `west_cat_overlay`: Strongest reference for polling/check-in style prompts, asset import pipeline, questions with follow-ups/encouragements, simple state + activity tracking.
- `WESTCAT-OVERLAY-RELOADED`: Strongest reference for rich animation architecture (clusters, zip streams, easing, one-shots), duo-window peer patterns, question types (ack/mcq/text/final-trigger), dev menus, hotkeys, and phased UX thinking.
- `Overlay_frame_maker`: Possible future asset generation utility (React + Gemini cat visuals). Currently a standalone Vite/React studio.
- All other repos in the family were duplicates, empty placeholders, or abandoned renames. Do not treat them as primary sources.

**You are not porting these apps.** You are building a new Electron/React app that captures the soul and useful patterns while using the correct modern stack.

## Technical Requirements

- Use Electron + React + TypeScript + Vite.
- Main process in `src/main/electronMain.ts` (or equivalent).
- Preload bridge for safe IPC.
- Renderer is a proper React app.
- All data starts in transparent mock files / generators under `src/data/` or `src/mocks/`.
- Every mock must declare its evidence tier.
- Provide clear `npm` scripts:
  - `npm run dev`
  - `npm run build`
  - (ideally) `npm run typecheck` or equivalent
- The app must launch and be usable without any network or extra setup beyond `npm install && npm run dev`.

## Exact File Structure Target (follow closely)

See `FILE_STRUCTURE_SPEC.md` in this packet. At minimum deliver the core familiar, drawer, state, router, evidence, mocks, and inspect/self-audit pieces.

## Failure Conditions (if any of these are true, the build is incomplete)

- Familiar is not the primary/launch UI.
- App requires network or external keys to show core functionality.
- Mock data is presented without visible evidence tiers.
- Fable scarcity gate is missing or always recommends Fable.
- No working command drawer summoned from the familiar.
- No state machine driving animations.
- Modes do not change behavior.
- Self-audit / Dexter / packet forge are missing or non-functional.
- `npm run dev` does not produce a runnable desktop window with the familiar visible.
- README does not contain the exact commands needed to run and verify.

## Deliverables Required from You

1. A complete runnable project that passes the MUST_BUILD_CHECKLIST (see that file).
2. Clean, auditable code with good TypeScript types.
3. Excellent local documentation in the project README + inline.
4. All mocks clearly separated and labeled.
5. The app must feel like a **familiar** first — alive, present, respectful of attention — not a traditional productivity dashboard.

Start by creating the project scaffolding if needed, then implement the familiar + state + drawer + router + mocks + inspect tools.

Build it. Make it run. Make the laws visible in the experience.
