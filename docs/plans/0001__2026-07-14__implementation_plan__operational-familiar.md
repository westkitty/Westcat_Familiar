# Operational Familiar Implementation Plan

Status: Complete
Current Phase: 3 (Verified and committed)

## WORKFLOW STATE

Package Manager: npm (via package-lock.json)
Framework: Electron + React + Vite
Baseline: `npm run typecheck` PASS; `npm run build` PASS; no test script configured
Verification: `npm test`, `npm run typecheck`, `npm run build`, Electron smoke run

## Brainstorming Summary

- Outcome: one integrated, local-first operational governance architecture for all ten requested systems.
- User: a local WESTCAT Familiar operator who needs exact, inspectable state and bounded actions.
- Why now: the current application is visually coherent but operational behavior is primarily mock-driven.
- Success: domain tests, type checking, production build, and documented Electron smoke scenarios pass without weakening visual locks.
- Constraint: Familiar First, no hidden network or shell access, no false certainty, no unrelated visual redesign.
- Out of scope: cloud services, telemetry, arbitrary command execution, automatic commit or push, global desktop surveillance.

## Repository Map

Current authorities:

- Familiar state and whisper: `src/renderer/state/useFamiliarStore.ts`
- Mode definitions: `src/renderer/domain/modeManager.ts`
- Attention arbitration: `src/renderer/domain/attentionEngine.ts`
- Routing: `src/renderer/domain/commandRouter.ts`
- Persistence: `src/renderer/state/persistence.ts`
- Self-Audit: `src/renderer/engines/selfAudit.ts`
- Dexter Inspect: `src/renderer/components/panels/DexterInspect.tsx`
- Stack Status: `src/renderer/components/panels/StackStatus.tsx`
- Context Packet Forge: `src/renderer/engines/packetForge.ts`
- Electron boundary: `src/main/electronMain.ts`, `src/main/preload.ts`
- Mocks: `src/renderer/data/mocks/`

## Selected Architecture

Use a central governance store backed by pure domain modules and a versioned local persistence envelope. All ten systems share evidence claims, provenance identifiers, project/session scope, policy decisions, and retention/reset controls. Electron exposes only allowlisted read-only workspace inspection and folder selection. Summoned operational views manage the data; the familiar shows compact state signals and remains primary.

Alternatives rejected:

- Ten feature stores: easy initially, but duplicates evidence and policy state and makes audit chains unreliable.
- Electron-owned database: unnecessary migration and security surface for current data volume.
- Mock-only integration: fails the requested operational capability truth and project-session acceptance scenarios.

## Modules

Add:

- shared governance models and IPC contracts
- evidence, policy, provenance/redaction, prioritization, contract, capability, memory, session, and audit domain modules
- versioned governance persistence with migration and malformed-record recovery
- one governance Zustand store
- summoned Operations panel and compact familiar signals
- governance tests, architecture documentation, and manual verification guide

Modify:

- Electron main/preload for safe project selection and read-only inspection
- command routing UI to create policy decisions and provenance
- attention integration to require an active interruption contract
- Packet Forge UI to track interrupted drafts
- Dexter Inspect, Stack Status, and Self-Audit views to expose governance records
- application panel routing and CSS imports

## Boundaries

- Persistence: localStorage, schema `wcf.governance.v1`, explicit migration, safe defaults on corruption, user reset and per-record deletion.
- IPC: folder picker and bounded read-only inspection only; no renderer filesystem access, arbitrary commands, or network.
- Privacy: store paths, summaries, identifiers, and command metadata; redact secret-shaped values; never persist file contents or environment values.
- Retention: bounded provenance and session histories, explicit clear/reset controls, dismissed records preserved until deleted/reset.

## Vertical Slices

1. Models, pure evaluators, persistence, and tests.
2. Electron workspace observation and capability truth.
3. Project entry/exit, scent trails, unfinished work, and memory management.
4. Policy-aware routed actions, provenance, evidence whispers, and interruption contracts.
5. Dexter/Stack/Self-Audit integration and familiar compact signals.
6. Documentation, full validation, Electron smoke testing, and grouped commits.

## Risks

- Existing uncommitted visual repair overlaps Self-Audit and familiar CSS. Mitigation: add separate governance audit/CSS modules and do not stage unrelated files.
- Browser persistence can be malformed. Mitigation: validate each boundary and fall back to a recoverable empty v1 envelope.
- Filesystem inspection can hang or expose content. Mitigation: known read-only checks, timeouts, summarized output, and no content reads.
- A broad panel could become a dashboard. Mitigation: one dismissible summoned Operations panel plus compact familiar signals.

## Completion Evidence

- `npm run verify`: 3 test files and 10 tests passed, TypeScript passed, production build passed.
- `npm audit --omit=dev`: no production dependency vulnerability reported.
- Clean-profile Electron smoke: canonical familiar, drawer, all nine modes, five summoned panels, project entry, provenance, interruption contract, capability truth, unfinished packet lifecycle, and Self-Audit exercised.
- Clean-profile Self-Audit after the Crisis policy repair: 21 pass, 1 warning, 0 fail, with no governance finding.
- Known unproven manual claims: position change after drag, native folder-picker completion, append-only handoff write, interrupted-session relaunch restoration, and operating-system reduced-motion emulation.
- Full development dependency audit remains nonzero because breaking Electron/Vite upgrades are required; no forced upgrade was applied.
