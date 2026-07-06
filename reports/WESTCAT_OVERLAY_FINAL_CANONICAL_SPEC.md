# WestCat Overlay Final Canonical Spec

## Plain-English Description

WestCat Overlay is a small, always-visible desktop companion: a cute, transparent, draggable cat character that lives on your screen (frameless, above other windows) alongside a speech bubble or chat surface.

It keeps you company while you work. In its primary polling form, it occasionally (or on demand) asks lightweight workflow / mindfulness / focus questions, records your answers privately on your machine, and reacts with animations (idle, blink, happy, etc.).

The cat and bubble are separate but coordinated windows. You can drag, resize, flip, and change opacity of the cat. Answers can be given by click, keyboard, or text input. Results can be exported.

Advanced versions support rich question flows (acknowledge auto-advance, multiple choice, short text) and sophisticated frame-based cat animation (clusters of PNGs with timing, easing, one-shots).

A related but distinct macOS variant replaces proactive polling with reactive chat driven by a local LLM (Ollama) and adds text-to-speech.

All of this is implemented as native PySide6/Qt desktop applications, not web pages or browser overlays.

## Intended Users

- Individuals who want a persistent, low-friction companion while working (programmers, writers, knowledge workers).
- People who benefit from occasional reflective prompts or lightweight polling without leaving their desktop or opening another app.
- macOS users who want a packaged .app with local LLM chat + voice.
- Teams or individuals experimenting with "mascot-driven" interfaces or focus tools.

Not for: heavy automation, screen reading, voice-first assistants, or multi-user shared surfaces.

## Core Features (Polling Overlay)

- Transparent frameless always-on-top cat window (multiple sizes, opacity, flip/mirror).
- Separate speech/poll bubble window for questions and input.
- Draggable windows (with Wayland caveats).
- Cat animation states or frame clusters (idle, blink, reactions, one-shots).
- Configurable via yaml (asset dir, speeds, etc.).
- Prompt / question engine with follow-ups and encouragements.
- Local private logging + state persistence.
- Asset import pipeline (user PNG/SVG cat images → usable transparent assets).
- Demo / startable question flows.
- Result export (text or json).
- Dev / debug controls (hotkeys, menus for speed, stepping, editing questions).
- Graceful behavior when assets are missing (fallbacks).

## Optional Features

- Advanced animation (PNG clusters from zip, fps, easing, probes).
- Rich question types and scripted demos (e.g., Bryan conversation).
- Question editor (add/remove/reorder/import/export).
- TTS + audio playback (from MacOS work).
- LLM chat mode (Ollama client, streaming, model selection) — potentially as a toggle or separate mode.
- Packaged macOS .app bundle with Dock entry and proper logs.
- Cross-platform notes and workarounds (Windows/macOS drag, Wayland control panel).

## Main App

The canonical `westcat-overlay` package / `python -m app` (or console script).

Contains the runtime for the cat + bubble overlay + polling.

## Overlay Runtime

Native PySide6 desktop application.

- Qt: FramelessWindowHint + WindowStaysOnTopHint + Tool + translucent background.
- Two (or more) top-level windows that can coordinate (peer pattern from RELOADED).
- No browser source, no Electron, no web server in core.
- Local only (files, optional local Ollama).

## Polling System

Core to the "overlay" identity in most repos.

- Proactive or demo-driven questions to the user.
- Types: acknowledge (auto), multiple choice (click or 1-4), short text, final trigger (rapid clicks on cat).
- Responses recorded locally.
- Structured via questions.json or Bryan-style scripts + parser.
- Editor support desirable.

Polling is **not** network polling or OBS source polling.

## MacOS-Specific Pieces

- .app bundling via PyInstaller + install script.
- ~/Library paths for support/logs.
- Dock integration.
- Stronger emphasis on packaged "it just works" experience.
- TTS via piper + Qt audio (optional module).
- Ollama client tuned for Tailscale/local LLM.

These patterns (bundler, docs, packaging) are valuable even if chat is not the primary mode.

## Frame Maker

Separate concern: a React + Gemini tool for generating cat images and animation frames.

Valuable as a content/asset creation utility. Outputs (or the generator itself) may feed the assets/ used by the overlay.

Not part of the main runtime.

## Character Sheet Archive

Currently empty placeholder. If "character" or persona sheets for the cat (or user) become a thing, they belong in tools/ or a data/ subdir of the main app, not a separate top-level repo.

## Assets

- Cat expression images (PNG + SVG states).
- Frame clusters / animation zips for advanced motion.
- Demo question scripts.
- Generated backups from earlier Gemini work.

Assets should live in `assets/` (with clear subdirs) and be importable/processed at first run.

## What Belongs in the Canonical Repo

- The main overlay app (cat + bubble + polling).
- Core animation (unified best of sequence + clusters).
- Question/prompt system + demo content.
- Asset pipeline + example assets.
- Config, state, logging.
- Packaging (pyproject + optional bundle scripts).
- Tests (smoke + widget + unit where possible).
- High-quality docs (README + architecture + quickstart + polling + migration).
- Tools/ that directly support building/running the app (cluster builder, asset import, probes).

## What Should Remain Separate

- Full React Gemini frame studio (Overlay_frame_maker) — unless tightly integrated.
- Pure chat/LLM mode if it diverges too far (or make it a plugin/mode).
- Historical backups and generated one-off assets (move to archive-notes/ or a data/ archive).
- Empty name experiments.

## What Should Be Archived

After successful migration and verification:

- westcat-polling-overlay
- westcat_polling_overlay_dx
- westcat_overlay (empty)
- west_cat_overlay_demo (empty)
- WestCat_Overlay_Unifier (empty)
- westcat-overlay-redux (empty)
- character_sheet_archive (empty)

Keep local clones or GitHub as read-only historical for a period, with warning READMEs.

## Definition of Done (for Canonical v1)

- One repo: westcat-overlay (or equivalent clean name).
- `python -m app` (or equivalent) starts a working cat + bubble overlay on macOS (and preferably Windows).
- At least one complete question/poll flow works end-to-end (answer capture + export).
- Cat has at least idle + blink + one reaction animation (cluster or sequence).
- Assets can be imported or fall back gracefully.
- Tests pass (`pytest`).
- Docs allow a new user to install + run in < 10 minutes on macOS.
- Clear ARCHIVE_INDEX and MIGRATION_NOTES.
- No hard dependency on missing zips or private hosts.
- SHIP checklist or equivalent release process documented and followed for the first release.
