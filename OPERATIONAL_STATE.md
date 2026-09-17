# OPERATIONAL STATE — WESTCAT Familiar

Project ID: westcat-familiar
Revision: 1
Updated: 2026-09-17

## Scope
Local-first Electron + React + TypeScript + Vite desktop familiar where the familiar is the primary interface.

## Current baseline
- Baseline branch: main @ 4a2df5b4bbe2a4e589d9056905b968a7697a920d.
- Existing visual identity repair is protected.
- The familiar is DOM + CSS in v0; no sprite-sheet or SVG mascot replacement is authorized.
- Motion communicates state; local-first behavior remains controlling.

## Active invariants
- INV-01: Preserve "The familiar is the interface."
- INV-02: Preserve DOM + CSS familiar implementation for v0.
- INV-03: Preserve Motion Means State.
- INV-04: Familiar Bus semantics may drive state but may not define personality or product decisions.
- INV-05: No mandatory cloud/API dependency may be introduced.
- INV-06: Existing user interactions and mode switching must remain available.

## Active work
Familiar Bus adapter foundation:
1. Add renderer-neutral shared FamiliarSignal contract.
2. Add local reducer/arbitration helpers.
3. Adapt existing familiar state to semantic attention/reaction without replacing visual identity.
4. Add a bounded demonstration path and type-safe integration.
5. Typecheck/build when execution environment is available.

## Evidence state
- Source baseline: inspected.
- Familiar Bus adapter: pending.
- Build/typecheck after changes: pending.

## Prohibited collateral changes
- Do not replace familiar artwork/DOM structure with page-mascot sprites.
- Do not remove drawers, Dexter Inspect, Stack Status, Context Packet Forge, Self-Audit, modes, or existing controls.
- Do not introduce remote inference or telemetry.
