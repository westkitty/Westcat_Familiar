# MUST BUILD CHECKLIST — WESTCAT Familiar (Fable 5 Output)

This is the minimum bar for the build to be considered successful. Fable must deliver a runnable app that satisfies every item.

## Launch & Core Presence

- [ ] `npm install` succeeds cleanly.
- [ ] `npm run dev` launches an Electron desktop window.
- [ ] The animated familiar appears **first** and is the dominant visual on launch.
- [ ] The familiar is draggable (at least basic drag-to-move).
- [ ] Familiar position persists across app restarts (localStorage is acceptable).

## Drawer & Interaction

- [ ] Interacting with the familiar (click / button / gesture) summons the command drawer.
- [ ] Drawer contains at least quick actions and a mode switcher.
- [ ] Drawer can be dismissed without destroying the familiar.
- [ ] At least one quick action performs a visible local action.

## Modes

- [ ] At least 3 distinct modes exist (examples: Focus, Check-in, Explore, Inspect).
- [ ] Changing mode visibly affects the familiar (appearance, idle animation, or available micro-interactions).
- [ ] Changing mode changes what appears in the drawer or available actions.
- [ ] Mode state persists or is at least clearly indicated.

## State & Animation

- [ ] Familiar has an explicit state machine (idle, attentive, reacting, thinking, etc.).
- [ ] Animation / motion is driven by state (not free-floating decorative loops).
- [ ] At least one state transition is observable (e.g., click familiar → it reacts → returns to idle).

## Attention & Scarcity

- [ ] Basic attention arbitration exists (familiar can be quiet or more active based on simple rules or user action).
- [ ] Fable scarcity gate exists: the UI does not casually recommend "use Fable" for everything.
- [ ] There is visible signaling that Fable is a limited resource.

## Evidence & Data

- [ ] Evidence tiers are visible on data surfaces (projects, tasks, diagnostics, suggestions, artifacts).
- [ ] Mock data is clearly distinguishable from any "verified" data.
- [ ] No data is presented with false certainty.

## Core Tools (must be functional)

- [ ] **Dexter Inspect** (project necromancy lens) exists and shows:
  - At least some reference to previous WestCat lineage / decisions / risks.
  - Current project structure or mock artifacts.
- [ ] **Stack Status** shows plausible mock diagnostics (processes, storage, attention budget, versions) with clear "mock" labeling.
- [ ] **Context Packet Forge** can generate and display a structured packet from current context.
- [ ] **Self-Audit Harness** runs locally and produces a report (checks data, evidence labels, basic constitution compliance, etc.).

## Polish & Constraints

- [ ] Reduced motion (`prefers-reduced-motion`) is respected — non-essential animations are reduced or removed while core state communication remains.
- [ ] The app runs completely locally with no network calls required for the above features.
- [ ] No real external API keys or services are needed to experience the familiar + drawer + tools.
- [ ] README (or a QUICKSTART in the project) contains the exact commands:
  - `npm install`
  - `npm run dev`
  - `npm run build` (and what it produces)
  - How to trigger the main verification flows

## Documentation Inside the Delivered App

- The app itself should make the laws visible (evidence badges, scarcity language, mode effects, audit button).
- Hover or inspect on key elements should reveal state or evidence information.

If any checkbox above is false after Fable finishes, the build is incomplete even if the app "looks nice."
