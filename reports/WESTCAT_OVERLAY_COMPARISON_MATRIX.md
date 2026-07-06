# WestCat Overlay Comparison Matrix

| Repo | Local path (relative) | Apparent role | Stack | Build status | Currentness | Completeness | Architecture quality | Asset value | Docs value | Preserve? | Archive later? | Confidence |
|------|-----------------------|---------------|-------|--------------|-------------|--------------|----------------------|-------------|------------|-----------|----------------|------------|
| westcat-polling-overlay | repos/westcat-polling-overlay | Early polling overlay cat (CLI) | Py + PySide6 | Syntax OK; pinned deps block on current py | Low (2025-10-12) | Medium (working main + assets + prompts) | Medium | High (SVGs/PNG backups + import) | Medium (README + SHIP) | No (duplicate) | Yes | High |
| westcat_overlay | repos/westcat_overlay | Empty placeholder | N/A | N/A | None | None | None | None | None | No | Yes | High |
| west_cat_overlay | repos/west_cat_overlay | Packaged polling overlay (evolved) | Py + PySide6 + pyproject | Syntax OK; strict pin blocked install on py 3.14; tests + main exist | Medium-High (packaging Oct 2025) | High (real main, asset pipeline, questions, state, SHIP) | Good (modular app/ + sequence + prompt) | High | Good (README, SHIP.md) | Yes (packaged base) | No | High |
| westcat_polling_overlay_dx | repos/westcat_polling_overlay_dx | DX snapshot / duplicate | Py + PySide6 | Same as polling-overlay | Low | Medium | Medium | High (same) | Medium | No | Yes | High |
| WestCat_Overlay_Unifier | repos/WestCat_Overlay_Unifier | Empty unifier attempt | N/A | N/A | None | None | None | None | None | No | Yes | High |
| west_cat_overlay_demo | repos/west_cat_overlay_demo | Empty demo placeholder | N/A | N/A | None | None | None | None | None | No | Yes | High |
| westcat-overlay-redux | repos/westcat-overlay-redux | Empty redux attempt | N/A | N/A | None | None | None | None | None | No | Yes | High |
| WESTCAT-OVERLAY-RELOADED | repos/WESTCAT-OVERLAY-RELOADED | Phased reload: polling + advanced anim | Py + PySide6 (loose) | Verified: loose pip succeeded; imports OK (bryan_duo etc.); 5 tests collected (anim sync + smoke); bootstrap runs cleanly. Full GUI needs assets. | Medium (2025-10-24) | High (duo windows, rich poll types, dev menu, editors, Bryan script) | Excellent (anim/cluster/zip/easing + peer windows + question model) | Medium (clusters + tools; zip missing in clone) | High (phase README + anim-sync.md) | Yes (features + arch) | After migration | High |
| Overlay_frame_maker | repos/Overlay_frame_maker | Cat animation / frame studio (Gemini) | React + Vite + TS + Gemini | Node; requires API key | Medium (2025-10-25) | Medium (full Vite app) | Good (modern frontend) | Medium-High (potential source of cat frames) | Low | As tool only | Possible (sibling) | High |
| character_sheet_archive | repos/character_sheet_archive | Empty archive placeholder | N/A | N/A | None | None | None | None | None | No | Yes | High |
| WestCat_Overlay_MacOS | repos/WestCat_Overlay_MacOS | macOS-first LLM chat companion + TTS | Py + PySide6 + pyproject + pyinstaller + piper | Syntax OK; tests + bundle script present | Highest (2026-04) | Medium (focused scope: chat + cat + settings + TTS) | Good (clean package, client, storage, audio) | Low | Highest (BIBLE.md + impl reports + task status) | Yes (packaging, docs, TTS, Mac) | Only if chat dropped | High |

## Matrix Notes

- **Currentness** factors: latest meaningful commit date + packaging activity + test/SHIP signals (not timestamp alone).
- **Completeness**: presence of runnable entrypoint/main, asset handling, tests, config, docs alignment with code.
- **Architecture quality**: modularity, separation (cat vs bubble), animation sophistication, reusability of components (prompts/questions, anim clusters, clients).
- **Preserve?** decision combines unique value + evidence it is not pure duplicate.
- Empty repos contribute 0 across columns.
- polling-overlay and _dx are effectively the same; west_cat_overlay is their direct descendant with packaging.
- RELOADED and west_cat_overlay overlap in vision (polling cat overlay) but differ in animation depth and phase vs ship focus.
- MacOS is the outlier in feature direction (reactive chat vs proactive polling) but strongest in production docs and bundling.
