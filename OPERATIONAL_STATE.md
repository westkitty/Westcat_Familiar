# OPERATIONAL STATE — WESTCAT Familiar

Project ID: westcat-familiar
Revision: 3
Updated: 2026-09-17

## Scope
Local-first Electron + React + TypeScript + Vite desktop familiar where the familiar is the primary interface.

## Current baseline
- Baseline branch: main @ 4a2df5b4bbe2a4e589d9056905b968a7697a920d.
- Active Familiar Bus implementation branch: feature/familiar-bus-foundation.
- Existing visual identity repair is protected.
- The familiar is DOM + CSS in v0; no sprite-sheet or SVG mascot replacement is authorized.
- Motion Means State and local-first behavior remain controlling.

## Active invariants
- INV-01: Preserve "The familiar is the interface."
- INV-02: Preserve DOM + CSS familiar implementation for v0.
- INV-03: Preserve Motion Means State and the existing legal state-transition table.
- INV-04: Familiar Bus semantics may drive state but may not define personality or product decisions.
- INV-05: No mandatory cloud/API dependency may be introduced.
- INV-06: Existing user interactions, drawer, panels, mode switching, attention rules, scarcity gate, and persistence remain available.

## Implemented on feature/familiar-bus-foundation
- IMP-01: Added renderer-neutral FamiliarSignal types, TTL arbitration, priorities, sequencing, and semantic-to-WESTCAT mapping.
- IMP-02: Integrated Familiar Bus into useFamiliarStore while retaining canTransition as final authority.
- IMP-03: Added automatic expiration of transient semantic signals.
- IMP-04: User interactions publish low-priority aware/curious signals.
- IMP-05: Attention nudges publish timer-driven semantic signals instead of bypassing the adapter.
- IMP-06: Command routing publishes focused state, scarcity gates publish warning state, successful routes publish pleased state, and failed gate spending publishes error state.
- IMP-07: Existing Familiar DOM exposes semantic attention/reaction/trigger attributes and a compact reaction status without changing its body structure.
- IMP-08: Added adapter documentation.
- IMP-09: Added branch validation workflow for typecheck and Electron-Vite build.

## Evidence state
- Source baseline: inspected.
- Branch diff against main: inspected; changes are bounded to Familiar Bus integration, docs, CI, and operational state.
- Typecheck/build: verified in GitHub Actions on current head.
- Runtime Electron interaction behavior: verified by macOS GitHub Actions smoke path: renderer load, keyboard summon, drawer visibility, routed command response, and semantic Familiar Bus attention/reaction presence.
- GitHub Actions workflow: passed for the implementation head; later state-only commits do not alter runtime code.
- Attempted disposable Linux validation: blocked because the runner cannot resolve github.com.
- MacBook-Air.local remote execution node: offline during this work.

## Pending validation
1. Manual macOS pass remains useful for drag, context menu, mode switching, every panel, and reduced-motion visual quality; these are regression-polish checks, not blockers for the Familiar Bus foundation.
2. No network dependency was introduced by the Familiar Bus implementation; the existing main-process navigation/network denial remains unchanged.

## Prohibited collateral changes
- Do not replace familiar artwork/DOM structure with page-mascot sprites.
- Do not remove drawers, Dexter Inspect, Stack Status, Context Packet Forge, Self-Audit, modes, or existing controls.
- Do not introduce remote inference or telemetry.
- Do not bypass canTransition with semantic signals.
- Do not claim runtime verification from source inspection alone.

## Revision history
- r1: Initialized continuity guard for Familiar Bus work.
- r2: Recorded source-complete Familiar Bus adapter and explicit unverified validation state.
- r3: Promoted build/typecheck and real Electron renderer smoke to verified; retained only non-blocking manual visual regression checks.
