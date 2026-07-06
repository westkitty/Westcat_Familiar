# Repo to Feature Map — WESTCAT Familiar

This map tells Fable exactly what to mine from the old source lineage and what to ignore.

| Source | Status | Mine For | Do Not Use For | Notes |
|--------|--------|----------|----------------|-------|
| WestCat_Overlay_MacOS | Active, newest, best docs | Local companion philosophy, BIBLE-style scope discipline, cat + bubble coordination patterns, graceful degradation, macOS packaging intent (bundle, paths, Dock), high-quality internal documentation style, reactive "user initiates" model, storage patterns, TTS/audio module shape (future seam only) | PySide/Qt implementation details, hard-coded Ollama host, chat-only assumption, proactive polling (explicitly out of scope in its BIBLE) | Strongest single reference for the "familiar as living desktop buddy" soul. Use BIBLE.md as constitution inspiration. |
| west_cat_overlay | Active, best packaged polling base | Polling / check-in prompt behavior, questions.json structure (follow-ups + encouragements), asset import pipeline, prompt engine, activity/idle/sleep state tracking, simple config-driven behavior, SHIP checklist discipline, working main entrypoint pattern | Animation quality (simpler SVG/sequence), strict pinned deps, Wayland-specific hacks, old packaging | Good concrete example of "the cat asks me things to keep me focused". |
| WESTCAT-OVERLAY-RELOADED | Active, richest animation + poll UX | Animation architecture (clusters, ZipFrameStream, Animator, easing, one-shots, fps control, probes), duo window peer communication, rich question types (ack, MCQ, text, final trigger on cat), dev menu / hotkeys / controls, question editor + parser, Bryan demo script as example flow, attention to animation sync | Bootstrap-only main (intentional stub), incomplete asset zip in clone, phase-specific VS Code tasks | Best animation and interaction depth. The cluster system and peer windows are high-value concepts even if re-implemented in React. |
| Overlay_frame_maker | Active utility | Concept of AI-assisted cat frame / expression generation, modern React + Vite + TS example (already in target stack family) | Full app as part of the familiar (keep separate or as optional tool), Gemini API requirement | Treat as potential asset pipeline input, not core. Already uses Vite/React. |
| westcat-polling-overlay | Duplicate / older | Historical reference only for early polling + asset ideas | Anything — it is essentially the same as west_cat_overlay before packaging work | Near-identical tree to westcat_polling_overlay_dx. |
| westcat_polling_overlay_dx | Duplicate | Historical reference only | Code or structure | Pure duplicate of the polling-overlay base. |
| westcat_overlay (empty) | Empty placeholder | Nothing | Everything | 0 commits. |
| west_cat_overlay_demo (empty) | Empty placeholder | Nothing | Everything | 0 commits. |
| WestCat_Overlay_Unifier (empty) | Empty placeholder | Nothing | Everything | Name suggested unification intent that never happened. |
| westcat-overlay-redux (empty) | Empty placeholder | Nothing | Everything | Another abandoned rename. |
| character_sheet_archive (empty) | Empty placeholder | Nothing | Everything | No content. |

## Guidance for Fable

- Extract **concepts and constraints**, not code.
- Animation state machine ideas + "motion means state" from RELOADED.
- Evidence of what "good local companion docs" look like from MacOS BIBLE.
- Concrete prompt/check-in flow examples from west_cat_overlay.
- Never assume we are re-implementing Qt windows or PySide6 widgets.
- The new familiar can be an SVG, Lottie, CSS-animated, or canvas-based cat — whatever best serves "Familiar First" in the Electron renderer.
