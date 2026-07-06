# Existing WESTCAT Character Frame Audit

## Repositories Searched
- `/Users/andrew/Westcat_Familiar/repos/WESTCAT-OVERLAY-RELOADED`
- `/Users/andrew/Westcat_Familiar/repos/west_cat_overlay`
- `/Users/andrew/Westcat_Familiar/repos/Overlay_frame_maker`
- `/Users/andrew/Westcat_Familiar/repos/WestCat_Overlay_MacOS`

## Candidate Sources Found

### Candidate 1: `west_cat_overlay` Sprite Frames
- **Source Path:** `repos/west_cat_overlay/assets/cat/`
- **File Count:** 4
- **Raster Image Count:** 4 (PNG)
- **Zip Count:** 0
- **JSON/Manifest Count:** 0
- **Sample Filenames:** `idle.png`, `blink.png`, `wiggle1.png`, `wiggle2.png`
- **Apparent States:** Idle, Blink, Wiggle/Movement
- **Transparency:** RGBA (average size 307x320 px)
- **Contact Sheet Path:** `qa/frame_source_audit/west_cat_overlay_cat_contact.png`
- **Visually Matches Character:** Yes, original desktop sprite.
- **Generated App Output:** No, source repository frames.
- **Usable in Electron Renderer:** Yes.
- **Confidence:** High
- **Notes:** Simple sprite set, but lacking sleeping/sad/happy expressions.

### Candidate 2: `west_cat_overlay` High-Resolution Expressions
- **Source Path:** `repos/west_cat_overlay/assets/source/transparent/`
- **File Count:** 11
- **Raster Image Count:** 11 (PNG)
- **Zip Count:** 0
- **JSON/Manifest Count:** 0
- **Sample Filenames:** `idle.png`, `blink.png`, `happy.png`, `happy_2.png`, `sad.png`, `sleep.png`, `sparkles.png`, `wake.png`, `pause.png`, `pause_2.png`, `icon_app.png`
- **Apparent States:** Idle, Blink, Happy, Sad, Sleep, Sparkles, Wake, Pause
- **Transparency:** RGBA (1024x1024 px)
- **Contact Sheet Path:** `qa/frame_source_audit/west_cat_overlay_transparent_contact.png`
- **Visually Matches Character:** Yes, the canonical WESTCAT cat character expressions.
- **Generated App Output:** No, source assets.
- **Usable in Electron Renderer:** Yes, perfect high-resolution translucent PNGs.
- **Confidence:** High
- **Notes:** Richest, most complete visual representation of the canonical character.

### Candidate 3: `WESTCAT-OVERLAY-RELOADED` Cluster Previews
- **Source Path:** `repos/WESTCAT-OVERLAY-RELOADED/assets/cluster_previews/`
- **File Count:** 10
- **Raster Image Count:** 10 (PNG)
- **Zip Count:** 0
- **JSON/Manifest Count:** 0
- **Sample Filenames:** `cluster_00.png` to `cluster_09.png`
- **Apparent States:** Previews of animations.
- **Transparency:** RGBA (1024x1024 px)
- **Contact Sheet Path:** `qa/frame_source_audit/reloaded_cluster_previews_contact.png`
- **Visually Matches Character:** Yes.
- **Generated App Output:** No.
- **Usable in Electron Renderer:** Yes, but they are just static index preview tiles rather than individual expression assets.
- **Confidence:** High (for previews), Low (for actual animation usage as the zip is missing in the clone).
- **Notes:** The raw animation frames zip `transparent_png_frames.zip` referenced by the repo's player is absent in the public clone.

## Rejected Candidates
- `repos/west_cat_overlay/assets/svg/`: Rejected because these are RGB JPEG/PNG files without transparency, or SVG vectors that are forbidden by visual lock laws.
- `repos/Overlay_frame_maker`: Empty asset folder, no raster images found.
- `repos/WestCat_Overlay_MacOS/scratch/test_win.png`: Single window layout mock, not a character asset.

## Accepted Candidate
- **Accepted Source:** `repos/west_cat_overlay/assets/source/transparent/`
- **Rationale:** High-resolution 1024x1024 transparent RGBA PNG assets representing the existing character in 11 expressions. Directly maps to the state machine of the WESTCAT Familiar overlay.

## Decision
**FRAME_SOURCE_FOUND_HIGH_CONFIDENCE**
