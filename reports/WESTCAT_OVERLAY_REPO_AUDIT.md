# WestCat Overlay Repo Audit

## Executive Summary

Eleven repositories under `westkitty` were examined for the "WestCat Overlay" family. Five are empty (zero commits, no files beyond `.git` init). The remaining six are related but non-identical attempts at a transparent desktop cat overlay companion, primarily using PySide6/Qt for frameless always-on-top windows (cat + speech bubble).

Core pattern across active repos: native desktop Python GUI overlay (not browser, not OBS browser-source, no web server). Features center on a cute cat character that accompanies the user, with varying degrees of polling/questions, animation, state, and (in one case) LLM chat + TTS.

No single repo is the obvious "everything" winner. Two strong but different polling/overlay implementations exist (west_cat_overlay lineage and WESTCAT-OVERLAY-RELOADED). One newer MacOS-specialized chat variant. One asset-generation utility. Duplicates and abandoned name experiments abound.

**Key verdict signals (evidence-based):**
- Most packaged / "ship-ready" base: `west_cat_overlay`
- Most feature-complete polling UX + animation: `WESTCAT-OVERLAY-RELOADED`
- Newest + best documentation + packaged macOS app: `WestCat_Overlay_MacOS`
- Strongest architecture for animation: RELOADED (cluster/zip PNG frame system)
- Clear duplicates: `westcat-polling-overlay` and `westcat_polling_overlay_dx` (identical trees)
- Abandoned placeholders: 5 empty repos
- Utility only: `Overlay_frame_maker` (React + Gemini cat animation studio)

## Method

- Cloned all listed repos locally into `/Users/andrew/Westcat_Familiar/repos/`.
- Inspected via git metadata (log, status, branches, tags, remotes), file trees, package manifests, source, tests, docs, assets.
- Compared near-duplicates with `diff -rq`.
- Read READMEs, SHIP/BIBLE/IMPLEMENTATION docs, pyproject/requirements, main entrypoints, key modules (ui_cat, speech/poll, anim, prompt).
- Syntax verified (py_compile + AST, 0 errors).
- Attempted local venv installs + import/pytest collect where practical (pinned old PySide6 caused some failures; looser succeeded for structure checks).
- No destructive actions, no remote changes, no overwrites of existing state.
- "Currency" judged by commits + completeness + architecture + working main + packaging quality (timestamp is one weak signal).

## Repository Audit

### westcat-polling-overlay

- **GitHub:** westkitty/westcat-polling-overlay
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/westcat-polling-overlay`
- **Access status:** Cloned successfully. Clean working tree.
- **Apparent role:** Original or early public name for the polling CLI overlay cat.
- **Tech stack:** Python 3 + PySide6 (Qt), PyYAML, Pillow, pydantic. Frameless translucent windows.
- **Build system:** requirements.txt (pinned), ruff, pytest. No pyproject. SHIP.md checklist.
- **Build/run status:** Syntax clean. Full pip install blocked by old PySide6==6.7.2 pin on current Python. Older commit base.
- **Runtime behavior:** Desktop overlay. Launches cat + speech bubble. Asset import from user dir (PNG/SVG processing to transparent). Prompts/questions via prompt engine + questions.json. State tracking, idle/sleep/wake, activity reset. Draggable on macOS/Windows; Wayland notes.
- **Important files/directories:** app/ (ui_cat.py, speech_bubble.py, prompt_engine.py, resources.py, tracker.py, sequence_player.py), assets/{cat,svg,source,questions.json}, config.yaml, data/, .backup_svg_before_embed (many generated cat SVGs/PNGs), tests/test_smoke.py, SHIP.md, README.md.
- **Overlay relevance:** High — core cat + bubble overlay.
- **Polling relevance:** High — questions/prompts for workflow/mindfulness, response handling.
- **MacOS relevance:** Cross-platform claims; macOS drag supported in code.
- **Asset value:** High — cat expression assets (idle, happy, sad, blink, etc.) + backup generated images. Import pipeline.
- **Documentation value:** Good README (multi-platform run instructions), SHIP.md.
- **Strengths:** Functional main entry, asset pipeline, config-driven, tests (smoke).
- **Weaknesses:** Older code state (pre some packaging), Wayland limitations documented, pinned deps fragile, README points users to "clone westcat-polling-overlay" even inside evolved copies.
- **Current / obsolete / experimental / archival / duplicate:** Duplicate/older base of the polling overlay. Superseded by west_cat_overlay in same lineage.
- **Preserve:** As historical reference only.
- **Archive later:** Yes.
- **Confidence:** High
- **Evidence:** Identical tree to westcat_polling_overlay_dx (diff only .git), older HEAD commit (be9477b 2025-10-12), west_cat_overlay diffs show added __init__, prompt_engine, sequence_player, packaging.

### westcat_overlay

- **GitHub:** westkitty/westcat_overlay
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/westcat_overlay`
- **Access status:** Cloned. Empty (warning during clone). 0 commits.
- **Apparent role:** Placeholder / name experiment.
- **Tech stack:** N/A
- **Build system:** N/A
- **Build/run status:** Nothing to build/run.
- **Runtime behavior:** None.
- **Important files/directories:** Only .git skeleton.
- **Overlay relevance:** None.
- **Polling relevance:** None.
- **MacOS relevance:** None.
- **Asset value:** None.
- **Documentation value:** None.
- **Strengths:** None.
- **Weaknesses:** Empty.
- **Current / obsolete / experimental / archival / duplicate:** Abandoned placeholder.
- **Preserve:** No (no content).
- **Archive later:** Yes (or delete local clone).
- **Confidence:** High
- **Evidence:** `git log` empty, ls shows only .git.

### west_cat_overlay

- **GitHub:** westkitty/west_cat_overlay
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/west_cat_overlay`
- **Access status:** Cloned successfully. Clean. Has extra branch `agent/svg-unification`. Tag `ship-20251021-1753`.
- **Apparent role:** Evolved / packaged version of the polling overlay CLI. "WestCat Overlay CLI".
- **Tech stack:** Python + PySide6 6.7.2 (pinned), PyYAML, pydantic, Pillow. Qt frameless + translucent + SVG + sequence animation.
- **Build system:** pyproject.toml (name="westcat-overlay", version 2025.10.21, editable), requirements.txt, ruff.toml, pytest.ini. SHIP.md checklist.
- **Build/run status:** Syntax clean. Full runtime venv + install failed on strict PySide6==6.7.2 pin (no matching dist for Python 3.14.6). Smoke tests exist and import path fixes were recent work. Lighter py_compile + AST checks passed. Contrast: sibling RELOADED with loose pins installed and verified imports/tests/bootstrap successfully on same host.
- **Runtime behavior:** `python -m app` launches QApplication + CatWidgetAnimated + SpeechBubble. Demo prompts from questions.json via PromptEngine. AssetManager imports/processing. Tracker for activity/idle/sleep. Config yaml. Saves state. Multi-platform intent with Wayland notes.
- **Important files/directories:** app/ (full: __main__.py with compat shim, ui_cat.py with states/FlippableSvgWidget/sequence, speech_bubble.py, prompt_engine.py, sequence_player.py, resources.py, tracker.py), assets/{cat/*.png, questions.json, svg/, source/}, .backup_*, config.yaml, pyproject.toml, SHIP.md, docs/research/, data/{state.json, log.jsonl, import-report.json}, tests/test_smoke.py, tools/vectorize/, west_cat_overlay/ (package dir for install).
- **Overlay relevance:** High — primary cat overlay + bubble.
- **Polling relevance:** High — prompt/questions system for focus/mindfulness.
- **MacOS relevance:** Supported in docs/code (drag works).
- **Asset value:** High (PNG cat states + large SVG backup set from Gemini generation).
- **Documentation value:** Solid (README with platform run instructions, SHIP.md).
- **Strengths:** Real executable main, asset import, state, packaging work (pyproject, __init__, test fixes Oct 2025), SHIP process.
- **Weaknesses:** Animation simpler (SVG states + sequence vs cluster PNGs), older than RELOADED and MacOS by commit date, pinned deps, some README copy-paste artifacts.
- **Current / obsolete / experimental / archival / duplicate:** Current packaged candidate in the polling-overlay lineage. Supersedes the plain polling-overlay repos.
- **Preserve:** Yes — strong base candidate.
- **Archive later:** No (or keep as reference post-consolidation).
- **Confidence:** High
- **Evidence:** Recent commits focused on packaging/imports/tests (a2e89ff etc 2025-10-22), pyproject present, working main + demo logic, diffs vs polling-overlay show evolution.

### westcat_polling_overlay_dx

- **GitHub:** westkitty/westcat_polling_overlay_dx
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/westcat_polling_overlay_dx`
- **Access status:** Cloned. Clean.
- **Apparent role:** "DX" (developer experience?) variant or snapshot of polling overlay.
- **Tech stack:** Same as westcat-polling-overlay.
- **Build system:** requirements.txt + ruff + pytest (no pyproject).
- **Build/run status:** Identical to polling-overlay.
- **Runtime behavior:** Same as polling-overlay.
- **Important files/directories:** Nearly identical tree to westcat-polling-overlay (app/, assets with backups, config, SHIP, README).
- **Overlay relevance:** High.
- **Polling relevance:** High.
- **MacOS relevance:** Same.
- **Asset value:** Same as polling-overlay.
- **Documentation value:** Same.
- **Strengths:** Same.
- **Weaknesses:** Duplicate.
- **Current / obsolete / experimental / archival / duplicate:** Duplicate of westcat-polling-overlay.
- **Preserve:** No unique value.
- **Archive later:** Yes.
- **Confidence:** High
- **Evidence:** `diff -rq --exclude=.git` shows only .git and pycache differences. Same HEAD commit hash.

### WestCat_Overlay_Unifier

- **GitHub:** westkitty/WestCat_Overlay_Unifier
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/WestCat_Overlay_Unifier`
- **Access status:** Cloned. Empty.
- **Apparent role:** Attempted "unifier" name experiment. Never materialized.
- **Tech stack:** N/A
- **Build system:** N/A
- **Build/run status:** N/A
- **Runtime behavior:** None.
- **Important files/directories:** .git only.
- **Overlay relevance:** None.
- **Polling relevance:** None.
- **MacOS relevance:** None.
- **Asset value:** None.
- **Documentation value:** None.
- **Strengths:** Name implies intent to consolidate.
- **Weaknesses:** Zero content.
- **Current / obsolete / experimental / archival / duplicate:** Abandoned placeholder.
- **Preserve:** No.
- **Archive later:** Yes.
- **Confidence:** High
- **Evidence:** Empty clone warning + no commits.

### west_cat_overlay_demo

- **GitHub:** westkitty/west_cat_overlay_demo
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/west_cat_overlay_demo`
- **Access status:** Empty.
- **Apparent role:** Demo name placeholder.
- **Tech stack:** N/A
- **Build/run status:** N/A
- **Runtime behavior:** None.
- **Important files/directories:** .git only.
- **Overlay relevance:** None.
- **Polling relevance:** None.
- **MacOS relevance:** None.
- **Asset value:** None.
- **Documentation value:** None.
- **Strengths/Weaknesses:** None.
- **Current / obsolete / experimental / archival / duplicate:** Abandoned.
- **Preserve:** No.
- **Archive later:** Yes.
- **Confidence:** High

### westcat-overlay-redux

- **GitHub:** westkitty/westcat-overlay-redux
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/westcat-overlay-redux`
- **Access status:** Empty.
- **Apparent role:** "Redux" rename experiment.
- **Tech stack:** N/A
- **Build/run status:** N/A
- **Runtime behavior:** None.
- **Important files/directories:** .git only.
- **Overlay relevance:** None.
- **Polling relevance:** None.
- **MacOS relevance:** None.
- **Asset value:** None.
- **Documentation value:** None.
- **Strengths/Weaknesses:** None.
- **Current / obsolete / experimental / archival / duplicate:** Abandoned.
- **Preserve:** No.
- **Archive later:** Yes.
- **Confidence:** High

### WESTCAT-OVERLAY-RELOADED

- **GitHub:** westkitty/WESTCAT-OVERLAY-RELOADED
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/WESTCAT-OVERLAY-RELOADED`
- **Access status:** Cloned successfully. Clean.
- **Apparent role:** "Reloaded" re-implementation / phased enhancement of the overlay with focus on polling UX and animation.
- **Tech stack:** Python + PySide6 (>=6.5,<7), Qt (QSettings, frameless, translucent). Advanced animation via clusters/zip PNG streams + easing.
- **Build system:** requirements.txt (minimal), .vscode/tasks.json (many "Run: WESTCAT overlay (xxx)" tasks). No pyproject. Tests present.
- **Build/run status:** Syntax clean. Successful venv + loose PySide6>=6.5,<7 + pyyaml install on Python 3.14.6 (macOS arm64). Core imports succeeded (bryan_duo, poll_overlay, cat_window, ui_cat). `python -m app` prints BOOTSTRAP_OK + env metadata (as designed for phase 1). pytest collected 5 tests (including `test_looping_cluster_wraps`, `test_one_shot_holds_last_frame` from test_anim_sync.py + smoke tests). Full interactive GUI requires assets (referenced zip not present in clone) + display. Looser pins worked where strict pins in sibling repos failed.
- **Runtime behavior:** Multiple launch modes per phase/README. Duo mode: separate CatWindow + PollOverlay (bubble) windows that peer sync. MCQ/text/acknowledge/final-click-5x flows. Results export to Desktop or data/. Dev Menu (Ctrl+D), drag, size/opacity/flip, typewriter text, hotkeys. Anim uses cluster JSON + ZipFrameStream for PNG sequences (references assets/transparent_png_frames.zip + overlay_final/... which was not fully present in clone).
- **Important files/directories:** app/ (16+ modules: __main__.py (bootstrap), bryan_duo.py, bryan_parser.py, poll_overlay.py, cat_window.py, ui_cat.py, dev_panel.py, question_editor.py, anim/{cluster_sync.py, zip_stream.py}, player_demo.py, window_main.py), assets/{cat/clusters.json (large frame lists), demo/BryanDemoConversation.txt (11-step Canadian-themed poll script), cluster_previews/}, docs/anim-sync.md, tests/, tools/{cluster_builder.py, probe_anim_sync.py, overlay/...}, requirements.txt, README (detailed phases).
- **Overlay relevance:** Very high — polished cat + bubble duo.
- **Polling relevance:** Very high — rich question types, editor, Bryan demo script, response collection + export, final cat click trigger.
- **MacOS relevance:** Cross-platform Qt code + Wayland drag retained.
- **Asset value:** Medium-high for animation (clusters + tools to build them) + demo script. Note: referenced PNG zip not present in this clone.
- **Documentation value:** Excellent phase README + anim-sync.md (detailed frame↔cluster sync rules).
- **Strengths:** Best animation architecture (clusters, fps, loop/one-shot, easing, zip streaming, probe), richest polling interaction (types, dev menu, question edit, peer windows, hotkeys, export), phase discipline.
- **Weaknesses:** Main is only bootstrap (real runs via specific modules or VS tasks), no pyproject/packaging, incomplete assets in clone (zip), fewer "ship" signals than west_cat_overlay.
- **Current / obsolete / experimental / archival / duplicate:** Experimental "reload" that advanced the polling/anim features. Not fully superseded packaging-wise.
- **Preserve:** Yes — architecture and polling UX worth folding in.
- **Archive later:** After migration of key pieces.
- **Confidence:** High
- **Evidence:** Phase commits up to 2025-10-24 (Phase 4D), detailed Bryan 11-step script, anim/ code, clusters.json with 100s of frames, dev_panel + editors, README phase coverage. Verified at audit time: loose-dep install + imports + 5 tests collected (anim sync tests present) + bootstrap run on host Python 3.14.6/macOS. Animation tests explicitly cover looping wrap and one-shot hold behavior.

### Overlay_frame_maker

- **GitHub:** westkitty/Overlay_frame_maker
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/Overlay_frame_maker`
- **Access status:** Cloned. Clean.
- **Apparent role:** Cat Animation Studio — AI tool (Gemini) to generate cat images/animations/frames. Separate from runtime overlay.
- **Tech stack:** React 19 + Vite + TypeScript + @google/genai. Vite dev/build.
- **Build system:** package.json (scripts: dev, build, preview), vite.config.ts, tsconfig.
- **Build/run status:** Node-based. Would require `npm install`, GEMINI_API_KEY in .env.local. Not attempted (different stack, no Python venv conflict).
- **Runtime behavior:** Web app (Vite dev server). UI for driving Gemini to produce cat visuals. Not a desktop overlay.
- **Important files/directories:** App.tsx, components/, hooks/, services/geminiService.ts, index.html, types.ts, metadata.json, README (AI Studio banner + local run instructions).
- **Overlay relevance:** Low direct — asset producer possibly feeding cat frames/SVGs to overlay apps.
- **Polling relevance:** None.
- **MacOS relevance:** None.
- **Asset value:** Potentially high if outputs used for cat states or frame clusters in overlays.
- **Documentation value:** Minimal (README mostly boilerplate for the generated app).
- **Strengths:** Modern frontend, direct Gemini integration for creative assets.
- **Weaknesses:** Separate concern; no evidence of direct integration into any overlay runtime in the family.
- **Current / obsolete / experimental / archival / duplicate:** Standalone utility / experiment.
- **Preserve:** As asset generation tool if unification wants to keep frame production.
- **Archive later:** Possible (or keep as sibling tool repo).
- **Confidence:** High
- **Evidence:** package.json name "cat-animation-studio", Gemini service, no PySide/Qt/overlay code, recent init commit.

### character_sheet_archive

- **GitHub:** westkitty/character_sheet_archive
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/character_sheet_archive`
- **Access status:** Empty.
- **Apparent role:** Archive name for character sheets (perhaps related to cat persona or game sheets). No content.
- **Tech stack:** N/A
- **Build/run status:** N/A
- **Runtime behavior:** None.
- **Important files/directories:** .git only.
- **Overlay relevance:** None observed.
- **Polling relevance:** None.
- **MacOS relevance:** None.
- **Asset value:** None.
- **Documentation value:** None.
- **Strengths/Weaknesses:** None.
- **Current / obsolete / experimental / archival / duplicate:** Abandoned placeholder. Name suggests possible future asset/persona archive.
- **Preserve:** No.
- **Archive later:** Yes.
- **Confidence:** High

### WestCat_Overlay_MacOS

- **GitHub:** westkitty/WestCat_Overlay_MacOS
- **Local path:** `/Users/andrew/Westcat_Familiar/repos/WestCat_Overlay_MacOS`
- **Access status:** Cloned. Clean. Additional branches (e.g., codex/ollama-failover-and-tts-fixes).
- **Apparent role:** macOS-first packaged desktop companion. Cat + chat bubble using local/remote Ollama LLM. Later TTS addition.
- **Tech stack:** Python + PySide6 (>=6.5,<7), pyinstaller. Ollama HTTP client (streaming), piper-tts + Qt audio.
- **Build system:** pyproject.toml (name="westcat-overlay-macos", entry point script), requirements.txt (includes pyinstaller, pytest, piper-tts), install_app_bundle.py.
- **Build/run status:** Syntax clean. Tests present (test_client, test_storage, test_ui, test_tts). Full install would pull PySide + piper. Packager script exists.
- **Runtime behavior:** `python -m westcat_overlay_macos` or installed .app. Launches transparent cat overlay + separate chat bubble + settings panel. Reactive: user types → Ollama (Tailscale host) streams reply to bubble; cat state changes. Local JSON state in ~/Library/Application Support/. TTS synthesis + playback added (SilverTongue/piper). Health checks, model fallback, graceful errors.
- **Important files/directories:** westcat_overlay_macos/{app.py, ui.py, ollama_client.py, storage.py, tts_integration.py, audio.py, __main__.py}, pyproject.toml, install_app_bundle.py, BIBLE.md (authoritative spec), IMPLEMENTATION_SUMMARY.md (TTS), TTS_COMPLETION_REPORT.md, TASK_COMPLETION_STATUS.md, tests/, scratch/, docs/superpowers/, requirements.txt.
- **Overlay relevance:** High — cat + bubble windows.
- **Polling relevance:** Explicitly out of scope (per BIBLE: "does not initiate tasks, polls").
- **MacOS relevance:** Primary — macOS-first, .app bundle, Dock, logs in ~/Library/Logs.
- **Asset value:** Low (no large cat frame sets here).
- **Documentation value:** Highest — BIBLE.md (vision, scope, design philosophy, boundaries), detailed TTS impl summary + completion reports, task status.
- **Strengths:** Newest (2026-04 commits), production packaging (pyinstaller + install script), strong docs, tests for client/storage/ui/tts, Ollama streaming + model selection + TTS integration, graceful degradation.
- **Weaknesses:** Divergent feature set (chat vs poll), hard-coded default Ollama host in docs, TTS requires piper install + voices, smaller source footprint than polling variants.
- **Current / obsolete / experimental / archival / duplicate:** Current for the MacOS LLM companion variant. Not a polling overlay.
- **Preserve:** Yes — for Mac packaging patterns, docs quality, TTS/audio module, Ollama client if chat features desired later.
- **Archive later:** Only if chat/TTS features explicitly dropped from canonical overlay.
- **Confidence:** High
- **Evidence:** BIBLE.md dated 2026-04-14 authoritative, recent TTS integration commits + reports, pyproject entrypoint + bundle installer, explicit "no polls" scope.

## Notes and Uncertainties

- Several READMEs are copy-pasted across repos and contain stale clone paths or phase notes.
- RELOADED references a large transparent_png_frames.zip and subdirs not present in the clone — animation completeness unverified at runtime.
- west_cat_overlay has backup SVGs from Gemini that may be high quality; RELOADED uses PNG frame clusters (video-derived?).
- No evidence any repo was ever successfully unified (Unifier, redux, reloaded names did not achieve consolidation).
- MacOS is newer but intentionally different product direction.
- Build reproducibility is weak across the family due to strict pins and missing asset zips.
- "Polling" in names refers to the companion asking the user questions, not network polling or OBS polling.

All judgments derived from local file contents and git history, not GitHub metadata alone.
