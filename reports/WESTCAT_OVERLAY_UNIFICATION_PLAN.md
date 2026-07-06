# WestCat Overlay Unification Plan

## Recommendation

**Split into main app + tools + archive, seeded from existing code.**

- Use `west_cat_overlay` as the **primary base** for the canonical polling overlay app (it has the packaging, real main, SHIP process, asset pipeline).
- Port high-value pieces from `WESTCAT-OVERLAY-RELOADED` (animation cluster system, duo window peer model, question types/parser/editor, dev menu, Bryan demo content or equivalent, anim tools).
- Adopt packaging/bundling patterns and documentation quality from `WestCat_Overlay_MacOS`.
- Keep `Overlay_frame_maker` as a sibling utility (or move its outputs into assets/ of main).
- Do **not** create a brand new empty repo unless the existing bases are too messy to salvage (they are salvageable).
- Do not collapse MacOS chat/TTS into the polling main immediately; evaluate after core polling overlay stabilizes.

**Why this path?**
- Evidence shows west_cat_overlay is the closest to a "current maintained version" of the polling overlay identity.
- RELOADED demonstrably improved animation and polling interaction but did not finish packaging/shipping.
- MacOS shows the highest maturity in docs, tests, and macOS delivery but changed the core interaction model.
- Starting from a working main + packaging reduces risk vs starting from bootstrap stub.
- Splitting app/tools/archive respects that frame generation, cluster tools, and historical assets are not the runtime app.

## Recommended Canonical Repo Name

**westcat-overlay**

- Clean, lowercase, hyphenated.
- Matches the pyproject name already used in west_cat_overlay ("westcat-overlay").
- Short and descriptive without "polling", "reloaded", "macos", or "cli" that would prematurely narrow scope.
- If a suite is needed later: westcat-overlay (main) + westcat-overlay-tools.

Avoid "WestCat_Overlay_Canonical" or versioned names.

## Why This Path

- Preserves the strongest signals of "ship" (pyproject + SHIP.md + working entry) while upgrading the weakest parts (animation, question richness).
- Avoids throwing away the packaging work already done.
- Allows Mac-specific packaging and chat features to be evaluated against (or layered on) a solid polling base later.
- Empties and pure duplicates can be archived with minimal loss.
- Matches the primary objective: fold useful parts into one maintained canonical.

## Phase 1 — Freeze and Preserve

1. Snapshot current state of all active repos (already done via clones + logs).
2. Copy or note all .backup_* asset directories and generated SVGs/PNGs from west_cat_overlay.
3. Note the referenced (but missing) transparent_png_frames.zip and overlay_final frames from RELOADED; attempt to locate or regenerate if critical.
4. Record current commit SHAs for traceability.
5. Do not modify any source yet.

## Phase 2 — Select Canonical Base

**Primary base:** `west_cat_overlay` checked out / copied into new working dir `westcat-overlay/` (or worktree).

Reasons:
- Has pyproject.toml defining the package.
- Has executable `app/__main__.py` that actually runs the overlay + demo.
- Has asset import pipeline and questions.json.
- Has SHIP process and recent packaging hygiene commits.
- Is the direct evolution of the most-named "polling overlay" repos.

**Secondary sources for porting:**
- Animation + cluster system + anim tools from RELOADED.
- Duo window + peer + dev menu + question model + Bryan demo script from RELOADED.
- BIBLE.md style + high-quality docs + pyinstaller bundler patterns from MacOS.
- Any reusable TTS/audio if polling overlay later wants optional voice.

## Phase 3 — Migration Map

| Source repo | Local path | Action | What to preserve | What to ignore/archive | Notes |
|-------------|------------|--------|------------------|------------------------|-------|
| west_cat_overlay | repos/west_cat_overlay | Use as primary base / copy tree | pyproject.toml, app/ (main, ui_cat, speech_bubble, prompt_engine, resources, tracker, sequence_player), assets/* + backups, config.yaml, questions.json, SHIP.md, tests/, data/ patterns, ruff/pytest config | .backup_* (move to archive/assets or tools/), .vscode (recreate), old clone instructions in README | Core of canonical app/ |
| WESTCAT-OVERLAY-RELOADED | repos/WESTCAT-OVERLAY-RELOADED | Port key subsystems | app/anim/* (cluster_sync, zip_stream), app/cat_window.py + poll_overlay.py + bryan_duo.py + dev_panel.py + question_editor.py + bryan_parser.py, assets/cat/clusters.json + demo/BryanDemoConversation.txt, docs/anim-sync.md, tools/{cluster_builder,probe_anim_sync}, hotkey/peer logic | bootstrap-only __main__.py (replace), requirements.txt (merge), phase-specific scratch, any missing zip assets (document) | Major upgrade to animation + polling UX |
| WestCat_Overlay_MacOS | repos/WestCat_Overlay_MacOS | Adopt patterns + docs, selective port | BIBLE.md (adapt), IMPLEMENTATION_SUMMARY style, install_app_bundle.py + pyinstaller usage, pyproject entrypoint pattern, ollama_client.py + storage.py + tests (if chat mode added later), TTS/audio.py (optional later) | Hard-coded Tailscale host, chat-only scope, MacOS-specific paths in docs initially | Use for docs quality and bundling; keep chat as future module or separate |
| westcat-polling-overlay | repos/westcat-polling-overlay | Archive after migration | Historical reference only | All code (dupe) | Duplicate of base |
| westcat_polling_overlay_dx | repos/westcat_polling_overlay_dx | Archive after migration | None | All | Pure duplicate |
| Overlay_frame_maker | repos/Overlay_frame_maker | Keep separate or tools/ | Gemini integration pattern, any generated frame outputs | Full React app if not wanted in tree | Potential asset pipeline input |
| 5 empty repos | various | Archive / delete local | Nothing | Everything | Placeholders only |
| character_sheet_archive | ... | Archive | None | All | No content |

## Phase 4 — Proposed Final Folder Structure

```
westcat-overlay/
├── README.md
├── QUICKSTART.md
├── ARCHITECTURE.md
├── MIGRATION_NOTES.md
├── OBS_SETUP.md (if browser source ever added)
├── MACOS_SETUP.md
├── POLLING.md
├── TOOLS.md
├── ARCHIVE_INDEX.md
├── pyproject.toml
├── requirements.txt
├── ruff.toml
├── pytest.ini
├── config.yaml (example)
├── .gitignore
├── app/
│   ├── __init__.py
│   ├── __main__.py
│   ├── cat_window.py          # from RELOADED + evolved
│   ├── poll_overlay.py        # or speech_bubble evolved
│   ├── ui_cat.py
│   ├── anim/                  # cluster + zip + sequence unified
│   │   ├── __init__.py
│   │   ├── cluster_sync.py
│   │   └── ...
│   ├── prompt_engine.py
│   ├── question_model.py      # from RELOADED parser + editor
│   ├── resources.py
│   ├── tracker.py
│   └── ...
├── assets/
│   ├── cat/
│   │   ├── clusters.json
│   │   └── frames/ (or zip)
│   ├── expressions/ (svg + png states)
│   └── demo/
├── tools/
│   ├── cluster_builder.py
│   ├── asset_import.py
│   ├── vectorize/
│   └── frame_probe.py
├── tests/
├── data/ (gitignore most)
├── docs/
│   ├── research/
│   └── superpowers/ (from MacOS if useful)
└── archive-notes/
    └── (notes on migrated repos)
```

Adjust after actual porting. Keep app/ flat or with clear subpackages.

## Phase 5 — Dependency Cleanup

- Unify on loose PySide6>=6.5,<7 (or latest stable 6.x) + explicit Python >=3.10/3.12. Audit verification: loose range allowed full install + imports + 5 tests collected + bootstrap on Python 3.14.6/macOS arm64. Strict ==6.7.2 pins blocked west_cat_overlay.
- One requirements.txt or rely on pyproject [dependencies].
- Remove exact pins that caused install failures (PySide6==6.7.2, old pydantic etc.). Prefer ranges that worked in audit.
- Standardize: pyyaml, pydantic (v2), pillow if still used for asset processing.
- Add pyinstaller only for the bundling profile or optional extra.
- For animation: no new heavy deps (zipfile + Qt are stdlib/Qt).
- Lockfile: decide on one (none currently used). Consider uv or pip-tools later.
- Environment vars: document any (GEMINI for asset gen tool if kept; OLLAMA_HOST for chat mode).
- Merge ruff + pytest configs; keep one set of lint/test commands.
- Platform notes: keep Wayland workarounds but make them conditional.

## Phase 6 — Build and Runtime Standardization

- **Package manager:** pip + pyproject (or uv if adopted). No mixed yarn/pnpm.
- **Install:** `python -m venv .venv && .venv/bin/pip install -e ".[dev]"` (or equivalent).
- **Dev / run (polling overlay):** `python -m app` or `python -m westcat_overlay` (after package name settle). Or provide `westcat-overlay` console script. (Note: top-level in RELOADED is bootstrap stub; real flows via modules like bryan_duo.)
- **Demo / specific:** `python -m app.bryan_duo` (or equivalent unified entry with flags) after porting.
- **Test:** `pytest -q` (audit collected 5 tests in RELOADED including anim_sync cluster tests).
- **Lint/format:** `ruff check . && ruff format --check .`
- **Build (wheel):** `python -m build` or `pip wheel`.
- **macOS bundle (later):** `python install_app_bundle.py` (adapted).
- **Production/export:** Document any data export paths; keep results to Desktop or ./data with clear config.

Document all in QUICKSTART.md. Make commands match what actually works.

## Phase 7 — Documentation Plan

Produce in canonical:

- **README.md**: short what it is, quick start (macOS/Windows/Linux), links to other docs.
- **QUICKSTART.md**: exact venv + run commands for common cases.
- **ARCHITECTURE.md**: cat vs bubble, animation model (clusters), prompt/question flow, state, config.
- **MIGRATION_NOTES.md**: what came from which repo + decisions.
- **POLLING.md**: question types, editor, demo scripts, result export.
- **MACOS_SETUP.md**: bundle install, permissions, Ollama if chat added.
- **TOOLS.md**: asset import, cluster builder, probes, frame gen.
- **ARCHIVE_INDEX.md**: list of archived repos with one-line reasons + links to old SHAs.
- Adapt strong text from BIBLE.md (scope, philosophy) and anim-sync.md.
- Keep SHIP.md style checklist for releases.

## Phase 8 — Verification Plan

After each migration wave:
1. Syntax + import checks pass.
2. `pytest` (at minimum smoke + widget creation + any non-GUI unit tests).
3. Manual run of main demo flow (cat appears, bubble shows prompts, answers accepted, state saved, no crash).
4. Animation probe (if cluster system) produces expected tsv or HUD.
5. Asset import path works on a small set of test images.
6. On macOS: verify drag, frameless, always-on-top, right-click menu.
7. Cross-check against old README hotkeys/behaviors.
8. Update docs and re-verify.

Use the check-work skill or manual before declaring a phase done.

## Phase 9 — Archive Plan

For each repo to archive later, add (or commit) a top-level README warning (do not actually archive on GitHub yet):

```
# Archived / Superseded

This repository has been superseded by westcat-overlay.

It is preserved for historical reference only.

Do not use this as the current WestCat Overlay build.

See: https://github.com/westkitty/westcat-overlay (or local canonical)

Original commits and assets may have been migrated.
Last active commit before archival: <sha>
```

Update ARCHIVE_INDEX.md in canonical with table of archived repos + migration date + key salvaged items.

Do not push or create remote archives during this phase.

## Risks

- Animation zip assets missing → may need to regenerate frames or simplify cluster system initially.
- PySide6 + platform (Wayland/macOS) quirks will reappear; test on target platforms early.
- Scope creep: pulling chat/TTS too early dilutes the polling overlay identity.
- Dependency hell on install: pin ranges carefully + test on clean Pythons (3.10–3.12+).
- Stale READMEs in source repos will mislead if anyone looks at them post-consolidation.
- Contributor confusion: multiple similar-named repos will persist on GitHub until archived.

## Open Questions

- Should the canonical support both "poll mode" (proactive questions) and "chat mode" (Ollama) from day one, or keep separate?
- Are the PNG frame clusters essential, or can SVG + simple sequences suffice for v1 canonical?
- Will the final product ever target OBS/browser-source, or is native desktop the permanent model?
- Should frame generation (Overlay_frame_maker) be integrated or remain a separate creative tool?
- Target platforms for first canonical release (macOS primary + Windows notes, or full cross)?
