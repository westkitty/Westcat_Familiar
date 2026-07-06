# Mock Data Inventory — WESTCAT Familiar

All data in the v1 app must be mock or clearly derived from mocks. Every item must carry an evidence tier.

## Evidence Tiers (use exactly these labels)

- `verified` — Real user data or confirmed fact in this session.
- `mock` — Explicitly generated for demonstration. Safe to treat as fake.
- `inferred` — Derived by simple local rules from other data.
- `stale` — Previously true but age makes it questionable.
- `unavailable` — We know the data exists somewhere but cannot reach it right now.
- `future_seam` — Placeholder for a capability that does not exist yet.

## Required Mock Domains (minimum)

1. **Projects**
   - id, name, description, status, lastActivity, evidenceTier
   - At least 3–5 varied examples (personal, work, side, archived).

2. **Tasks / Check-ins**
   - id, projectId, text, due, completed, source (check-in prompt, manual, imported), evidenceTier
   - Some generated from "polling" style questions.

3. **Stack Diagnostics** (for Stack Status panel)
   - process, status (running/stopped/degraded), version, memory, lastCheck, evidenceTier
   - Include pretend Electron, Vite, React, storage, attention engine, router, etc.
   - Some future_seam entries (real local model, TTS worker, shell executor).

4. **Artifacts**
   - id, type (context-packet, audit-report, export, frame-set, decision-log), created, summary, evidenceTier
   - Examples of previous "packets" and self-audit outputs.

5. **Attention Conditions**
   - Simple rules or current state that the attention engine consults (user idle time, recent interactions, mode, time of day, etc.).
   - Must be mockable and inspectable.

6. **Router History / Past Decisions**
   - Recent commands or prompts, which path the router took (local logic vs Fable recommendation), outcome, evidenceTier.

7. **Dexter / Lineage Examples**
   - Mock entries representing old WestCat Overlay repos, previous decisions (e.g., "Chose Electron over continuing PySide", "Extracted animation concepts from RELOADED"), risks, and graveyard notes.
   - Must feel forensic, not cute.

8. **Audit Results**
   - Sample outputs from the self-audit harness (constitution compliance, evidence coverage %, persistence health, mode coverage, etc.).
   - Include both clean and "issues found" examples.

## Mock Data Rules

- All mock generators or static files live in `src/data/mocks/`.
- Every record or collection must be easy to find and edit.
- When displaying any of the above, the UI component must surface the evidenceTier (via EvidenceBadge or equivalent).
- Do not hard-code "real" looking data that would mislead a user who doesn't read the code.
- Include a visible "This is all mock data" banner or footer in inspection panels.

## Regeneration

Provide (or make obvious) a way to regenerate or reset the mock data set for testing (e.g., a dev-only "Reset Mocks" action or script).

This inventory must be reflected in the actual delivered `src/data/mocks/` directory.
