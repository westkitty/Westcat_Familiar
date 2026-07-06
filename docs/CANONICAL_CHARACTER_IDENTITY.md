# Canonical WESTCAT Familiar Character Identity

## Canonical Source
- **Source Repository:** `repos/west_cat_overlay`
- **Original Source Path:** `assets/source/transparent`
- **Audit Decision:** `FRAME_SOURCE_FOUND_HIGH_CONFIDENCE`
- **Contact Sheet Path:** `qa/frame_source_audit/west_cat_overlay_transparent_contact.png`

## Copied Assets
- **Destination Path:** `public/assets/familiar/canonical/`
- **Copied Files:**
  - `idle.png`
  - `blink.png`
  - `happy.png`
  - `happy_2.png`
  - `sad.png`
  - `sleep.png`
  - `sparkles.png`
  - `wake.png`
  - `pause.png`
  - `pause_2.png`
  - `icon_app.png`
- **File Count:** 11
- **Dimensions:** 1024x1024 px, transparent RGBA.

## State Mapping

| Familiar State | Source Frame(s) | Copied Asset | True State Frame or Fallback | Overlay Used | Notes |
|---|---|---|---|---|---|
| `idle` | `idle.png` | `assets/familiar/canonical/idle.png` | True State Frame | Aura / breath | Neutral slow breath |
| `watching` | `wake.png` | `assets/familiar/canonical/wake.png` | True State Frame | Aura / slight tilt | Attentive forward posture |
| `thinking` | `pause.png` | `assets/familiar/canonical/pause.png` | True State Frame | Aura / rotation | Processing state indicator |
| `working` | `happy.png` | `assets/familiar/canonical/happy.png` | True State Frame | Aura / glyphs | Active steady task pacing |
| `judging` | `pause_2.png` | `assets/familiar/canonical/pause_2.png` | True State Frame | Aura / stillness | High precision evaluation |
| `annoyed` | `sad.png` | `assets/familiar/canonical/sad.png` | True State Frame | Aura / twitch | Mild friction feedback |
| `alert` | `sparkles.png` | `assets/familiar/canonical/sparkles.png` | True State Frame | Aura / height | Raised status indicator |
| `blocked` | `sad.png` | `assets/familiar/canonical/sad.png` | Fallback | Aura / dimming | Unscheduled lock state |
| `sleeping` | `sleep.png` | `assets/familiar/canonical/sleep.png` | True State Frame | Dim aura / breathe | Dormant resting pose |
| `summoning` | `happy_2.png` | `assets/familiar/canonical/happy_2.png` | True State Frame | Expanded aura | Drawer summon action frame |

## Mode Effects
Modes change the ambient visual behavior (emphasis, aura ring colors, glyph active speeds, scale adjustments) of the wrapper elements without altering or swapping the base character body itself.

## Forbidden Future Changes
- Do not invent a new abstract DOM/CSS wedge body.
- Do not render the familiar creature using inline SVG or raw SVG paths.
- Do not use Playwright transient screenshots as source.
- Do not replace the canonical frame mapping without explicit human approval.

## Known Gaps
- **Missing Advanced Sequences**: Multiple frame animation loop support (V1 uses high-resolution state stills with blinking).
- **Future ZipFrameStream Integration**: Future upgrades may parse frame cluster zips if recovered from other branches.
