# WESTCAT Familiar

A local-first animated desktop familiar. **The familiar is the interface.**

Electron + React + TypeScript + Vite. Runs completely offline with transparent mocks.

## Familiar First

The animated familiar is always present and primary. Drawers, Dexter Inspect, Stack Status, Context Packet Forge, and Self-Audit are summoned from it.

## Visual Identity (Locked for v0)

**WESTCAT Familiar is not an invented cute mascot.**

- It is a **stateful command-layer familiar**.
- The creature body is rendered from existing canonical raster character frame assets stored in `public/assets/familiar/canonical/`.
- **No SVG familiar art in v0** (inline or asset).
- The character body frame is driven dynamically by a typed asset manifest (`familiarFrameManifest.ts`).
- Motion communicates **state** (Motion Means State). Mode modifies visual behavior and emphasis.

### Required HTML/CSS Layers
Developers must preserve the exact DOM layers inside the familiar component:
- `familiar-shell` (receives state and mode classes)
- `familiar-aura`
- `familiar-shadow`
- `familiar-character-frame-wrap`
- `familiar-character-frame`
- `familiar-glyph-ring`
- `familiar-glyph`
- `familiar-status`

See [VISUAL_IDENTITY_LOCK.md](file:///Users/andrew/Westcat_Familiar/docs/VISUAL_IDENTITY_LOCK.md) and [CANONICAL_CHARACTER_IDENTITY.md](file:///Users/andrew/Westcat_Familiar/docs/CANONICAL_CHARACTER_IDENTITY.md) for the full specs.

## Core Laws (Familiar Constitution)

See `fable_packet/FAMILIAR_CONSTITUTION.md`.

1. Familiar First
2. Presence Before Panels
3. Motion Means State
4. Attention Must Be Earned
5. No False Certainty (evidence tiers everywhere)
6. Mode Changes Behavior
7. Fable Is Scarce
8. Local First Means Local First
9. Dexter Is Not Cute
10. The Project Must Be Auditable

## Quick Start

```bash
npm install
npm run dev
```

- Drag the familiar.
- Click to summon command drawer.
- Right-click for context menu.
- Switch modes — the familiar changes.
- Run Self-Audit from drawer.

## Scripts

- `npm run dev` — run in Electron
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run preview` — preview build
- `npm run verify` — run unified static checks (typecheck + build)

## Preservation Note

The initial commit on `main` preserves the Fable-generated output before visual identity correction.

Repair work lives on `visual-identity/no-svg-familiar-v0`.

## License / Lineage

Internal WESTCAT tooling. Previous experiments lived in sibling repos under `repos/`. This is a fresh Electron/React implementation capturing the intent.

---

Built to be auditable. Everything labeled. Fable is scarce.
