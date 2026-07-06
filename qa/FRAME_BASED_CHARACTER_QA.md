# Frame-Based Character QA

## Branch
- `visual/restore-existing-westcat-frame-character`

## Commit
- `ec3558d`

## Asset Source
- `repos/west_cat_overlay/assets/source/transparent/`

## Assets Copied
- `public/assets/familiar/canonical/idle.png`
- `public/assets/familiar/canonical/blink.png`
- `public/assets/familiar/canonical/happy.png`
- `public/assets/familiar/canonical/happy_2.png`
- `public/assets/familiar/canonical/sad.png`
- `public/assets/familiar/canonical/sleep.png`
- `public/assets/familiar/canonical/sparkles.png`
- `public/assets/familiar/canonical/wake.png`
- `public/assets/familiar/canonical/pause.png`
- `public/assets/familiar/canonical/pause_2.png`
- `public/assets/familiar/canonical/icon_app.png`

## Manifest Path
- `src/renderer/data/familiarFrameManifest.ts`

## Render Path
- `src/renderer/components/familiar/Familiar.tsx` -> renders inside `.familiar-character-frame-wrap` using `.familiar-character-frame`

## Verification Commands
- `npm run verify` (typechecks + Vite builds successfully)
- `node run_visual_qa.js` (Playwright verification passes with 0 failures, 21 pass, 1 warn, 0 fail self-audit)

## Guard Results
- **No Active SVG Familiar**: Passed (verified via grep/Playwright)
- **No Legacy State Strings**: Passed (verified `dormant`, `reacting`, `attentive` absent from active code)
- **Positive Frame Identity References**: Present in manifest, DOM elements, and documentation.

## Screenshots / Contact Sheets
- Audited contact sheet: `qa/frame_source_audit/west_cat_overlay_transparent_contact.png`

## Human Visual Review Checklist
- [ ] Does the rendered familiar look like the intended WESTCAT character?
- [ ] Are the copied frames from the correct source?
- [ ] Does the character remain recognizable across states?
- [ ] Are overlays secondary, not replacing the character?
- [ ] Does the app still launch familiar-first?
- [ ] Does the drawer still summon from the familiar?

## Remaining Risks
- **Animation Complexity**: Currently renders high-res state stills with blinking, rather than full sprite sheets or animations.
- **Visual Scale Sync**: High resolution 1024x1024 frames scaled down to 132x128px might lose fine details depending on display resolution.

## Merge Recommendation
- Ready for Human Visual QA and merge to main after visual verification.
- Main branch remains untouched.
