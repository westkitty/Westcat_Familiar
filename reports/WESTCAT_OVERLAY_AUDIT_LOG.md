# WestCat Overlay Audit Log

**Workspace root:** `/Users/andrew/Westcat_Familiar`

**Date of audit:** 2026-07-06

## Commands Run (selected)

- `mkdir -p /Users/andrew/Westcat_Familiar/repos reports logs`
- `git clone https://github.com/westkitty/<repo>.git` for all 11 targets (via loop)
- Multiple `cd repos/<r> && git log --oneline -N`, `git status`, `git branch -a`
- `ls -la`, `find . -maxdepth 2`, `diff -rq` between near-duplicate repos
- `cat README.md | head`, full reads via tools on key files
- `python3 -m venv .venv_audit && pip install ...` (local per-repo attempts for west_cat_overlay, WESTCAT-OVERLAY-RELOADED)
- `python -m py_compile` and AST parse checks on .py files
- `grep -r` for tech indicators (obs, browser, poll, etc.)
- `find` counts for py/md/assets
- Various `head`, `cat`, `ls` for structure, assets, configs, pyproject, tests, docs

## Directories Inspected

- `/Users/andrew/Westcat_Familiar/repos/*` (all 11)
- Key subpaths: app/, assets/, tests/, docs/, west_cat_overlay/, westcat_overlay_macos/, tools/
- .git internals for remotes, HEAD, tags, branches (non-destructive)
- Specific files: README.md, SHIP.md, BIBLE.md, IMPLEMENTATION_SUMMARY.md, pyproject.toml, requirements.txt, config.yaml, app/__main__.py, clusters.json, questions.json, etc.

## Repositories Cloned or Already Present

All 11 cloned fresh into `repos/`. No pre-existing worktrees or checkouts found on start.

- westcat-polling-overlay (active, older polling base)
- westcat_overlay (empty)
- west_cat_overlay (active, packaged polling/overlay)
- westcat_polling_overlay_dx (active, near-duplicate of polling-overlay)
- WestCat_Overlay_Unifier (empty)
- west_cat_overlay_demo (empty)
- westcat-overlay-redux (empty)
- WESTCAT-OVERLAY-RELOADED (active, phase-based polling with advanced anim)
- Overlay_frame_maker (active, React Gemini cat animation studio)
- character_sheet_archive (empty)
- WestCat_Overlay_MacOS (active, newest, macOS LLM chat + TTS)

## Build Commands Attempted

- west_cat_overlay: venv + `pip install -r requirements.txt` (failed: PySide6==6.7.2 unavailable for Python 3.14.6 in env; strict pin)
- WESTCAT-OVERLAY-RELOADED: venv + `pip install "PySide6>=6.5,<7" pyyaml` (succeeded after ~2.5min). Then:
  - Imports: PySide6 OK; app.bryan_duo, app.poll_overlay, app.cat_window, app.ui_cat OK; bryan_duo.main exists.
  - pytest --collectonly: 5 tests collected (test_anim_sync.py::test_looping_cluster_wraps, test_one_shot_holds_last_frame; + 3 smoke tests in test_repo_smoke.py).
  - `python -m app`: Printed "BOOTSTRAP_OK" + JSON metadata (phase 1-bootstrap, python 3.14.6, macOS arm64, cwd). Confirms intentional stub.
- All: `python -m py_compile` + AST parse on .py sources (all clean, 0 syntax errors)
- Skipped: full interactive GUI runs (require display + user interaction or complete asset zips). Limited by practical constraints for headless audit.

## Key Build Contrast (new data)
RELOADED's loose dependency range allowed full import + test collection + bootstrap execution on the audit environment (Python 3.14.6 + macOS). west_cat_overlay's strict PySide6==6.7.2 pin prevented install. This is evidence of better forward compatibility in RELOADED's requirements, even if packaging is less advanced.

## Commands Skipped and Why

- Full long-running GUI launch (e.g., `python -m app` without timeout + manual interaction) — non-deterministic for headless/audit, may leave windows or require user input; recorded as "run only if practical".
- `pip install` globally or outside venvs — avoided.
- Any git reset / force / clean that could discard state.
- Remote operations (push, PR, archive on GitHub) — forbidden.
- Deletion of any files or .git history.
- Build/publish steps from READMEs that mention PyInstaller output to /Applications or Desktop exports — inspected only.
- Assuming network-dependent (Ollama in MacOS) or asset zip presence for runtime verification.

## Errors Encountered

- PySide6 exact pin 6.7.2 not satisfiable on current Python (west_cat_overlay). Indicates fragility of pinned old deps vs host Python.
- Some asset zips referenced in clusters.json not present in clone (RELOADED) — animation system incomplete without them.
- Empty repos had no history or files beyond .git skeleton.
- Diffs showed .git-only differences between polling-overlay and _dx; content trees identical.
- Several READMEs contain outdated clone instructions (e.g., west_cat_overlay README tells user to clone westcat-polling-overlay).

## Assumptions Made

- "Current" is determined by combination of: recent meaningful commits + code completeness + working entrypoint + packaging + architecture quality + test presence (not solely timestamp).
- Empty repos (no commits) are placeholders/abandoned inits with zero code value.
- Polling/overlay cat + bubble behavior is the core "WestCat Overlay" identity based on majority of named repos and code.
- MacOS variant is a deliberate divergence (chat vs poll) and should be evaluated separately unless unification explicitly targets LLM features.
- No evidence of browser-source / OBS-specific code in any repo; all are native desktop overlays.
- Backup dirs (.backup_*, .backup_svg_before_embed) contain historical generated assets (SVGs/PNGs) worth considering for preservation but not as active source.

## Limitations

- Full runtime verification of GUI + animation + polling flows limited by environment (no persistent display assumed for long sessions, heavy dep installs slow).
- Some referenced assets (zip frames in RELOADED) absent from clones — completeness of animation cannot be fully runtime-proven.
- GitHub MCP not used for remote metadata beyond initial clones (local content is source of truth per instructions).
- Date simulation (2025-2026 commits) taken as relative signals only.
- No remote fetch --all beyond initial clone for every branch in depth (but branches were listed).

## Working Directory Used

`/Users/andrew/Westcat_Familiar` (enforced for all clones, logs, reports).

## Repos with Uncommitted Changes at Inspection

None. All clean (`git status --porcelain` reported 0 files).

## Next for Log

Reports generated from this evidence base. See individual report files.

## Additional Build Data (post-initial report)

Command: WESTCAT-OVERLAY-RELOADED venv + loose PySide6 + verification (background task completed)
Result (exit 0):
- py: 3.14.6
- PySide6 OK
- core modules import OK (bryan_duo, poll_overlay, cat_window, ui_cat)
- bryan_duo has main: True
- pytest collected (5):
  - tests/test_anim_sync.py::test_looping_cluster_wraps
  - tests/test_anim_sync.py::test_one_shot_holds_last_frame
  - tests/test_repo_smoke.py::test_import_app
  - tests/test_repo_smoke.py::test_cat_widget_creation
  - tests/test_repo_smoke.py::test_speech_placeholder_creation
- main bootstrap: BOOTSTRAP_OK + JSON (phase 1-bootstrap, platform macOS-26.5.1-arm64-..., cwd note)

This data was incorporated into WESTCAT_OVERLAY_REPO_AUDIT.md, CURRENT_VERSION_FINDINGS.md, COMPARISON_MATRIX.md, UNIFICATION_PLAN.md, and this log.

.venv_audit directories left in place in repos/west_cat_overlay and repos/WESTCAT-OVERLAY-RELOADED as build evidence (reversible, local only).

