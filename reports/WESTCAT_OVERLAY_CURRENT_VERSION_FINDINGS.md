# Current Version Findings

## Most Likely Current Repo

**west_cat_overlay** (with caveats).

**Evidence:**
- Contains the packaged form (`pyproject.toml` names it "westcat-overlay", version 2025.10.21, editable install support).
- Has the most recent meaningful work in the direct polling-overlay lineage (Oct 22 packaging, import fixes, SHIP.md, pytest.ini).
- Real executable `python -m app` that launches cat + bubble + demo prompts.
- SHIP checklist present and referenced.
- Evolved from westcat-polling-overlay (added modules, __init__.py, sequence_player, prompt handling).

It is the closest to "the current maintained version of the polling cat overlay".

## Most Complete Repo

**Tie between west_cat_overlay and WESTCAT-OVERLAY-RELOADED**, with different strengths.

- west_cat_overlay: more complete "app" (full main + asset import + questions + state + packaging + tests that address import issues).
- WESTCAT-OVERLAY-RELOADED: more complete *feature set* for the polling experience (11-step Bryan demo script with ack/mcq/text/final-trigger, question editor, dev menu, rich hotkeys, peer-synced duo windows, advanced animation clusters).

Neither is 100% complete end-to-end (asset zips referenced in RELOADED clusters.json were absent from the clone; strict pinned PySide6==6.7.2 in west_cat_overlay blocked install on audit Python 3.14.6). RELOADED's looser ">=6.5,<7" range allowed successful venv install, core module imports (bryan_duo/poll_overlay/etc.), collection of 5 tests (including dedicated anim_sync tests for looping/one-shot clusters), and execution of its bootstrap `python -m app`.

## Best Working Build

**west_cat_overlay** (for a complete launchable polling app today) with important qualification from audit-time build verification.

- Has a functional entrypoint (`python -m app`) that launches cat + bubble + demo prompts (when deps resolve).
- Asset pipeline, config, and state handling are present and exercised in code paths.
- RELOADED's top-level `python -m app` is intentionally the Phase 1 bootstrap stub (prints BOOTSTRAP_OK + metadata). Real functionality lives in importable modules (bryan_duo, poll_overlay, etc.). During audit, loose-dep install + imports of bryan_duo/poll_overlay/cat_window/ui_cat succeeded, 5 tests collected (anim sync tests for cluster looping + one-shot + smoke), and bootstrap executed cleanly on Python 3.14.6/macOS arm64.
- MacOS is also runnable (packaged .app) but solves chat rather than polling.

Build friction is real but asymmetric: strict pins (west_cat_overlay) failed to install; looser ranges (RELOADED + MacOS) succeeded for import/test/bootstrap verification. Full end-to-end GUI + animation requires complete assets (zips/frames) + a display.

## Best Architecture

**WESTCAT-OVERLAY-RELOADED**.

- Sophisticated animation subsystem: `ClusterSpec`, `Animator`, `ZipFrameStream` (LRU cached PNGs from zip), easing, fps control, loop vs one-shot, hold_last_ms, probe tooling.
- Clean separation: CatWindow + PollOverlay as peer windows with callbacks.
- Question model + parser (bryan_parser) + editor (question_editor, quick).
- Dev panel, hotkeys, right-click controls, typewriter, export.
- anim-sync.md documents the frame/cluster contract.
- west_cat_overlay's animation (sequence_player + SVG states + limited PNG) is simpler and sufficient but less flexible.

If the goal is a polished, extensible polling overlay with good cat motion, RELOADED's architecture is superior.

## Best Asset Source

**west_cat_overlay** (and its .backup_svg_before_embed).

- Dozens of generated cat expression SVGs and PNGs (idle, happy, sad, sleep, wake, pause, sparkle, blink variants).
- AssetManager + import logic that processes user local images into transparent assets.
- questions.json with structured prompts + follow-ups + encouragements.

**Secondary:** Overlay_frame_maker (if Gemini-generated frames are wanted for PNG cluster animation in RELOADED style).

RELOADED's clusters.json references a large frame zip (`overlay_final/...`) that was not present; its asset value is conditional on recovering those frames.

## Best Documentation Source

**WestCat_Overlay_MacOS** (by far).

- BIBLE.md: authoritative, versioned spec with vision, design philosophy, explicit in/out of scope, boundaries.
- IMPLEMENTATION_SUMMARY.md + TTS_COMPLETION_REPORT.md + TASK_COMPLETION_STATUS.md: detailed, honest implementation records.
- Good test coverage signals and run instructions.

For polling-specific:
- WESTCAT-OVERLAY-RELOADED README (excellent phase-by-phase + hotkey + duo behavior).
- west_cat_overlay README + SHIP.md.

## Likely Demos

- **WESTCAT-OVERLAY-RELOADED**: Explicitly contains multiple demo modes (player_demo, poll_overlay, bryan_demo, bryan_duo). The Bryan 11-step conversation script is a full featured demo.
- west_cat_overlay: Has "Start Demo" button + prompt_engine flow using questions.json. Functional demo, less theatrical.
- Overlay_frame_maker: Itself is a demo of Gemini cat image gen.
- MacOS: Has test/demo paths but primarily a working app.

## Likely Archives

- All five empty repos (westcat_overlay, west_cat_overlay_demo, WestCat_Overlay_Unifier, westcat-overlay-redux, character_sheet_archive).
- westcat-polling-overlay and westcat_polling_overlay_dx (duplicates of the base that west_cat_overlay evolved from).
- Potentially Overlay_frame_maker (if asset generation not kept in canonical tree).

## Likely Utilities

- Overlay_frame_maker: clear utility for generating cat visuals/frames. Could stay separate or be referenced from tools/.
- Tools inside polling repos (vectorize in west_cat_overlay; cluster_builder + probe_anim_sync in RELOADED) are utilities worth preserving in a tools/ dir of canonical.

## Likely Duplicates or Forks

- westcat-polling-overlay == westcat_polling_overlay_dx (bit-for-bit on source).
- west_cat_overlay is the improved continuation of that code (not exact fork, but direct descendant).
- RELOADED reads as a rewrite/reload rather than a fork (different module layout, animation model, question handling).
- MacOS is a deliberate platform + feature fork (chat instead of poll).

"Unifier", "redux", "reloaded" names did not result in actual unification.

## Contradictions

- Repo names suggest consolidation happened ("Unifier", "Reloaded", "Redux") — code and history show parallel independent experiments instead.
- west_cat_overlay README still tells users to `git clone .../westcat-polling-overlay` (stale).
- MacOS is newest by 6 months but solves a non-polling problem, contradicting "polling-overlay" in many other names.
- RELOADED claims advanced animation but the referenced frame zip is absent from the public clone (may be local-only or lost).
- Several repos claim "cross platform" while code and docs repeatedly call out Wayland-specific pain and macOS/Windows drag differences.

## Final Current-Version Judgment

There is **no single current canonical WestCat Overlay** today.

**Recommended canonical base for the polling/overlay experience:** Start from `west_cat_overlay` (best packaged + working main in the core lineage) **and** selectively port the superior animation architecture + polling UX features from `WESTCAT-OVERLAY-RELOADED`.

**If the final product should be Mac-first packaged app with LLM chat + TTS:** `WestCat_Overlay_MacOS` is already the most mature in that direction and has the best documentation.

**For a unified "WestCat Overlay system":**
- Treat polling overlay (cat + questions/bubble) as the main app.
- Keep MacOS chat/TTS as an optional or separate mode/repo initially.
- Pull animation clusters + tools from RELOADED.
- Pull packaging, pyproject, SHIP discipline, asset import from west_cat_overlay.
- Pull docs quality and bundling patterns from MacOS.
- Archive the duplicates and empties after migration.

The "most current" timestamp (MacOS) does not equal the "most relevant to WestCat Overlay polling identity."
