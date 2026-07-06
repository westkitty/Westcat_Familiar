# VISUAL IDENTITY LOCK — WESTCAT Familiar v0

**Status:** Locked for v0. Changes require explicit approval and update to this doc + self-audit.

## Core Declaration

The cute generic black cat (or any pet-mascot rendering) produced in early Fable iterations is **rejected**.

WESTCAT Familiar v0 is a **stateful command-layer familiar**, not a pet, buddy avatar, or decorative mascot.

- The familiar is the interface (Familiar First).
- The creature body is rendered from existing canonical raster character frame assets (transparent RGBA PNG files) stored in `public/assets/familiar/canonical/`.
- **SVG is forbidden** for the familiar visual in v0 (no inline `<svg>`, no `.svg` asset files, no SVG masks/paths for the creature).
- No Lottie, no canvas (unless justified later).
- The character body frame is driven dynamically by a typed asset manifest (`familiarFrameManifest.ts`).
- No stock animal icons, emoji, generic cartoon cat silhouettes, collars, or pet-avatar design language.

## Required DOM Layer Structure (v0)

The familiar root renders these explicit layers (class names must be stable for state machine + CSS + self-audit):

- `familiar-shell` — receives all `state-*` and `mode-*` classes
- `familiar-aura`
- `familiar-shadow`
- `familiar-character-frame-wrap`
- `familiar-character-frame` (renders canonical character frame `<img>` with `draggable="false"`)
- `familiar-glyph-ring`
- `familiar-glyph`
- `familiar-status`

Additional inner accents may exist for mode color but must not evoke collars or pet features.

## State → Visual Mapping (Motion Means State)

Every state produces a distinct, observable change:

- `state-idle`: slow breathing, neutral gaze, low aura
- `state-watching`: narrower eyes, slight forward tilt, brighter gaze
- `state-thinking`: lower gaze, subtle inner pulse
- `state-working`: steady glyph activity, firmer posture
- `state-judging`: narrowed eyes, near-stillness, compressed aura
- `state-annoyed`: sharper tilt, brief restrained twitch, tighter eyes
- `state-alert`: raised fins, stronger aura, visible alert glyph/badge
- `state-blocked`: dim core, locked/crossed glyph layer, no playful motion
- `state-sleeping`: lowered posture, closed eyes, dim aura
- `state-summoning`: aura expands toward drawer, glyph ring activates

## Mode → Visual / Behavioral Modification

Modes must visibly change emphasis or behavior (not just label):

- `mode-plain`: baseline
- `mode-dex`: sharper eyes, stricter aura, diagnostic clarity
- `mode-work`: steadier glyphs, quieter motion
- `mode-canon`: higher evidence/continuity emphasis
- `mode-build`: command glyph emphasis
- `mode-necromancy`: grave/inspect bias
- `mode-fable`: scarcity/sigil emphasis, not always-on glow
- `mode-image`: visual-work restraint
- `mode-crisis`: reduced flourish, quieter palette, essential actions only

## Forbidden Patterns (v0)

- Cute mascot / pet avatar treatment
- Collar (visual or named)
- Round cartoon pet eyes
- Generic cat avatar / black cat illustration
- Decorative motion without state
- Stock animal icon / emoji
- Any SVG for the familiar creature
- "Cute" micro-interactions or sounds

## Future Art Passes Must Preserve

- Familiar First
- Motion Means State
- Dexter Is Not Cute
- No False Certainty
- Local-first transparency

## Enforcement

- Self-audit (engines/selfAudit.ts) contains explicit visual identity checks.
- This document is the reference. Code that reintroduces forbidden patterns violates the lock.
- Any proposal to introduce SVG or external art for the familiar in a later version must:
  1. Update this doc
  2. Pass updated self-audit
  3. Receive explicit approval

**v0 is DOM/CSS only. The familiar communicates state, not cuteness.**

---

Preserved from Fable output on main. Repair branch: visual-identity/no-svg-familiar-v0

## State Machine Consistency Refactoring
To align TypeScript state declarations with visual mapping and prevent state type conflicts, the following states were refactored for consistency:
- `dormant` -> refactored to `sleeping`
- `attentive` -> refactored to `watching`
- `reacting` -> refactored to `alert`

These state changes are verified typecheck-safe and matching visual CSS classes.

## Frame Character Identity Restore
Conceptual wedges and abstract bodies are rejected. The familiar has been successfully restored to a canonical asset-backed character identity using PNG frame assets from `west_cat_overlay/assets/source/transparent/`.
- All states are dynamically mapped to canonical frames via `familiarFrameManifest.ts`.
- Interaction features (blinking, breathing, auras, command glyph ring) are implemented as layers around the raster frame image.
