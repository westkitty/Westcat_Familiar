# VISUAL IDENTITY LOCK — WESTCAT Familiar v0

**Status:** Locked for v0. Changes require explicit approval and update to this doc + self-audit.

## Core Declaration

The cute generic black cat (or any pet-mascot rendering) produced in early Fable iterations is **rejected**.

WESTCAT Familiar v0 is a **stateful command-layer familiar**, not a pet, buddy avatar, or decorative mascot.

- The familiar is the interface (Familiar First).
- It is implemented exclusively with React JSX + div/span + CSS (pseudo-elements, transforms, keyframes, state/mode class names, data attributes).
- **SVG is forbidden** for the familiar visual in v0 (no inline `<svg>`, no `.svg` asset files, no SVG masks/paths for the creature).
- No Lottie, no canvas (unless justified later), no external image assets for the familiar itself.
- Old PySide / WestCat Overlay art is **source lineage only** — conceptual history, not to be ported or used as visual reference for the on-screen familiar.
- No stock animal icons, emoji, generic black cat silhouettes, cute round cartoon eyes, collars, or pet-avatar design language.

## Required DOM Layer Structure (v0)

The familiar root renders these explicit layers (class names must be stable for state machine + CSS + self-audit):

- `familiar-shell` — receives all `state-*` and `mode-*` classes
- `familiar-aura`
- `familiar-shadow`
- `familiar-core`
- `familiar-fin-left` / `familiar-fin-right`
- `familiar-eye-left` / `familiar-eye-right`
- `familiar-gaze`
- `familiar-tail`
- `familiar-glyph-ring`
- `familiar-glyph`
- `familiar-status`

Additional inner accents (e.g. `familiar-band`) may exist for mode color but must not evoke collars or pet features.

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
