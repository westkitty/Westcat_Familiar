# DECISION: WESTCAT Familiar

**Date:** 2026-07-06  
**Status:** New product direction locked for Fable 5 preparation.

## Product Identity

1. The product is now **WESTCAT Familiar**.
2. The goal is no longer just WestCat TTS or WestCat polling overlay.
3. The target implementation is **Electron + React + TypeScript + Vite**.
4. The previous PySide repos are reference lineage and source material only, **not** the final canonical app base.
5. `WestCat_Overlay_MacOS` remains the strongest reference for chat/TTS, docs (BIBLE.md), local companion behavior, and macOS packaging philosophy.
6. `west_cat_overlay` remains the strongest reference for polling/check-in prompt behavior, asset import, and packaged "working main" patterns.
7. `WESTCAT-OVERLAY-RELOADED` remains the strongest reference for animation/state/poll UX architecture (cluster system, duo windows, question types, dev menu, hotkeys, peer sync).
8. `Overlay_frame_maker` remains a possible asset/frame-generation utility (React + Gemini cat visuals).
9. The reason for this consolidation is to prepare a **coherent Fable 5 build packet**.
10. The final artifact should be a **runnable local-first desktop familiar**, not an audit report, not a pure PySide app, and not a dashboard.

## Rationale

The prior audit revealed a graveyard of overlapping PySide experiments. The new vision unifies the "familiar/mascot buddy" concept into a modern, local-first, Electron desktop application where:

- The **familiar is the interface**.
- A **command drawer** is summoned by the familiar.
- It prepares the ground for a future **Fable 5** build (local agentic / reasoning layer).
- It inherits ideas (presence, animation, polling/check-ins, chat/TTS, attention, state) from the lineage but implements in the target stack.

## Constraints Going Forward

- No more PySide/Qt consolidation work unless explicitly for reference extraction.
- All new development targets the Electron + React + TS + Vite stack.
- Local-first, no mandatory cloud or external AI APIs in v1.
- Transparent mock data with evidence tiers.
- Strict adherence to the Familiar Constitution (to be defined in the Fable packet).

This decision supersedes previous unification plans that assumed a PySide canonical.
