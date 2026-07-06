# Verification Checklist — WESTCAT Familiar

Use this after Fable delivers to manually (and via commands) verify the build.

## Command-Level Verification

- [ ] `npm install` completes without errors.
- [ ] `npm run dev` starts the Electron app and shows the familiar window quickly.
- [ ] `npm run build` completes and produces output (dist/ or equivalent) without fatal errors.
- [ ] (if present) `npm run typecheck` or `tsc --noEmit` passes with no new errors introduced by the build.
- [ ] The app can be quit and re-launched; familiar position is restored.

## Visual & Interaction Verification (manual)

- [ ] On launch the familiar is the most prominent element (not a sidebar or hidden behind panels).
- [ ] Familiar can be dragged around the screen.
- [ ] Clicking or otherwise interacting with the familiar summons the command drawer.
- [ ] Drawer contains mode switcher and at least basic quick actions.
- [ ] Switching modes visibly changes the familiar (different idle animation, expression, available actions, or chrome).
- [ ] Drawer can be closed while the familiar remains.
- [ ] Reduced motion OS setting (or a dev toggle) reduces non-essential motion.

## Data & Evidence Verification

- [ ] Open any data surface (tasks, projects, diagnostics, Dexter, Stack Status).
- [ ] Every data item shows a visible evidence label (verified / mock / inferred / stale / unavailable / future_seam).
- [ ] Mock data is obviously mock (labels, styling, or a global banner in inspect views).
- [ ] No data appears with confident language when it is mock.

## Core Feature Verification

- [ ] Familiar state machine is observable (trigger different states and see motion or status change).
- [ ] Attention-related behavior: familiar reacts differently after periods of activity vs inactivity (even if simple).
- [ ] Fable scarcity: attempt to trigger "deep reasoning" paths; the UI should push back or show cost/scarce signals instead of always offering Fable.
- [ ] Context Packet Forge: use the tool; a structured packet is generated and displayed. Packet should reference current mode/state + selected context.
- [ ] Dexter Inspect: opens and shows lineage references, decisions, risks, or project structure in a diagnostic tone.
- [ ] Stack Status: shows plausible diagnostics with mock labeling.
- [ ] Self-Audit: runs a local audit and surfaces results (constitution checks, data quality, etc.). Results are visible in the UI.

## No External Dependency Verification

- [ ] Disconnect network (or block in dev tools) and confirm core familiar + drawer + tools still work.
- [ ] No console errors about missing API keys or network on first run.
- [ ] No external domains are contacted for the above features.

## Documentation Verification

- [ ] Root README or QUICKSTART contains the exact commands to install, run dev, build, and perform basic verification.
- [ ] Key laws (Familiar First, Evidence, Fable Scarcity, etc.) are referenced or visible in the app or docs.
- [ ] It is obvious where the mock data lives.

## Failure Signals (if any of these happen, send back)

- Familiar only appears after opening a "main dashboard."
- Evidence badges are missing or only visible in source.
- Fable is recommended for trivial actions with no gate.
- App crashes or requires network on `npm run dev`.
- Self-audit, Dexter, packet forge, or mode switching are stubs that do nothing.
- README commands are missing or incorrect.

Run through this checklist with a fresh clone + `npm install && npm run dev` before declaring the Fable build done.
