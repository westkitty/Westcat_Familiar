# Source Lineage Summary — WESTCAT Familiar

## Original Family

The work began as "WestCat Overlay" — a series of experiments around a transparent, always-visible desktop cat companion.

Eleven GitHub repositories under the westkitty owner were examined:

- Multiple attempts at a polling/check-in overlay (the cat occasionally asks the user reflective or workflow questions).
- One more ambitious "reloaded" version with richer animation and polling UX.
- A macOS-first variant that shifted to reactive chat with local/remote LLM (Ollama) + later TTS.
- A separate React + Gemini tool for generating cat animation frames.
- Several empty or near-empty placeholder repos (westcat_overlay, WestCat_Overlay_Unifier, westcat-overlay-redux, west_cat_overlay_demo, character_sheet_archive).
- Near-duplicates of the early polling code.

All original implementations used **Python + PySide6 (Qt)** for native frameless transparent windows. None were browser-based or Electron.

## The Shift to WESTCAT Familiar

The product direction has been explicitly reset:

- This is no longer "just a polling overlay".
- This is no longer "just WestCat TTS".
- This is no longer a PySide/Qt consolidation project.
- The new product is **WESTCAT Familiar**: a Mac-first animated desktop familiar / mascot-buddy that acts as the primary interface to a local command layer.
- The familiar **is** the interface. A command drawer is summoned by the familiar.
- The technical target is now **Electron + React + TypeScript + Vite**, local-first.

The previous Python/PySide repositories are now treated as **source lineage and reference material**, not the canonical implementation base. We are not porting PySide code. We are extracting useful concepts, behaviors, and lessons.

## What Each Key Source Contributes

**WestCat_Overlay_MacOS** (strongest overall reference for the new vision)
- Strong "local companion" and "mascot-driven chat surface" philosophy.
- Excellent BIBLE.md (authoritative scope, design principles, in/out of scope, graceful failure).
- Cat + separate bubble coordination.
- macOS packaging intent (bundle, Dock, ~/Library paths, install script).
- High-quality internal documentation and task tracking.
- Reactive model (user speaks → companion responds) with local state.
- TTS integration work (later addition) and audio handling patterns.

**west_cat_overlay** (strongest reference for polling / check-in behavior)
- Working main entrypoint that actually launches the overlay + demo.
- Asset import pipeline (user images → usable transparent cat assets).
- Structured questions.json with follow-ups and encouragements.
- Prompt engine + simple state tracking (idle/sleep/activity).
- Packaging signals (pyproject.toml, SHIP.md checklist, tests).
- Config-driven behavior.

**WESTCAT-OVERLAY-RELOADED** (strongest reference for animation, state, and rich poll UX)
- Advanced animation architecture (ClusterSpec, Animator, ZipFrameStream, fps, easing, loop vs one-shot, hold_last_ms).
- Clean separation of Cat window + Poll/Bubble window with peer communication.
- Rich question types (acknowledge auto-advance, MCQ, short text, final 5-click trigger on cat).
- Dev Menu, hotkeys, drag, size/opacity/flip controls, question editor.
- Bryan demo script as concrete example of multi-step polling flow.
- Animation sync documentation and probe tools.
- Phase discipline in development.

**Overlay_frame_maker**
- Standalone React + Vite + TypeScript + Gemini app for generating cat images and animation frames.
- Potentially useful as an asset creation utility in the future.
- Already uses a modern frontend stack (unlike the PySide repos).
- Not core runtime.

**Everything else**
- Duplicates or abandoned name experiments (westcat-polling-overlay + _dx were near-identical).
- Empty repos contribute nothing but historical naming attempts.

## Why Electron/React/TS Now?

- The original experiments proved the value of a persistent, low-friction, mascot-driven desktop presence.
- They also showed the limitations of pure native Qt for rapid iteration, web-like UI richness, and future web-compatible tooling.
- Modern local-first desktop apps are well served by Electron + React + Vite + TypeScript.
- The future Fable layer (local reasoning) is expected to be more easily integrated in a JavaScript/TypeScript environment.
- We want a clean, auditable, mock-transparent foundation rather than carrying forward pinned old Python dependencies and Qt platform quirks.

## Important Caveats

- No single previous repo was a complete, unified "WestCat Overlay" success. They were parallel explorations.
- Animation assets (especially the large PNG frame zips referenced in RELOADED) were incomplete in the clones.
- Build reproducibility was fragile across the old repos.
- The new app must feel like a living familiar, not a port of any one of the old UIs.

Use the old work for **ideas, patterns, and constraints**, not as copy-paste source.
