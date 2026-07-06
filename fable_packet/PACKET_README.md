# WESTCAT Familiar — Fable 5 Handoff Packet

**Purpose:** This directory contains a clean, self-contained handoff package for Fable 5 to build the first runnable version of WESTCAT Familiar.

**Why this packet exists:**
- Previous work lived in a graveyard of 11 overlapping Python/PySide repos (WestCat Overlay family).
- The product direction has been reset to **WESTCAT Familiar**: a Mac-first animated desktop familiar / mascot-buddy command layer.
- The target stack is now **Electron + React + TypeScript + Vite** (local-first).
- Old PySide code is **source lineage and inspiration only**, not the implementation base.
- The goal is to give Fable one coherent, strict task that produces a runnable desktop app without rediscovering the entire history or collapsing into dashboard sludge.

## How to use with Fable 5

1. Paste the entire contents of `WESTCAT_FAMILIAR_FABLE_BUILD_PROMPT.md` as the primary instruction to Fable.
2. Attach (or reference) the other documents in this packet as context:
   - FAMILIAR_CONSTITUTION.md (non-negotiable laws)
   - TECHNICAL_TARGET_SPEC.md
   - FILE_STRUCTURE_SPEC.md
   - MUST_BUILD_CHECKLIST.md
   - MOCK_DATA_INVENTORY.md (with evidence tiers)
3. Optionally attach excerpts from the old audit reports or key source files (BIBLE.md, anim clusters, questions.json) only if Fable asks for concrete examples.
4. **Do not** paste the full contents of all old repos unless Fable specifically requests a particular module for inspiration.

## What success looks like

- `npm run dev` launches a desktop app (via Electron).
- A persistent, animated familiar appears first (draggable, stateful).
- Summoning the command drawer works.
- Modes change behavior visibly.
- Evidence tiers are shown on data.
- Fable scarcity gate and context packet forge exist and are testable.
- Dexter Inspect and self-audit harness run locally with mock data.
- No external API calls or cloud dependencies are required to run.
- All items on the MUST_BUILD_CHECKLIST pass manual verification.

## What not to include in Fable runs

- Full history of the 11 old repos.
- Any assumption that PySide/Qt code must be ported 1:1.
- Dashboard-first or "control center" UIs.
- Real Ollama/Fable/Grok calls in v1 (use transparent mocks with clear labels).
- Over-scoped features (TTS, real shell execution, always-on-top production behavior, global shortcuts) beyond the seams defined in TECHNICAL_TARGET_SPEC.

## Key files (read in this order for Fable)

1. WESTCAT_FAMILIAR_FABLE_BUILD_PROMPT.md (the actual build instruction)
2. FAMILIAR_CONSTITUTION.md
3. TECHNICAL_TARGET_SPEC.md + FILE_STRUCTURE_SPEC.md
4. MUST_BUILD_CHECKLIST.md + VERIFICATION_CHECKLIST.md
5. MOCK_DATA_INVENTORY.md + RISK_REGISTER.md

This packet was generated 2026-07-06 from the Westcat_Familiar workspace after a full repo forensics audit.
