# Risk Register — WESTCAT Familiar Fable Build

## High Probability / High Impact

**Fable builds a dashboard instead of a familiar-first experience**
- Mitigation: Constitution + "Familiar First" law + explicit failure condition in the prompt. Force the familiar to be the first rendered thing. Require visual verification that the familiar dominates launch. Reject any "main app shell with small cat widget."

**Fable over-scopes into real AI, TTS, shell, or cloud on day one**
- Mitigation: Strict "local first, mocks only, future seams" language repeated in prompt, constitution, and technical spec. Explicit "no external API requirement" and "must run after npm run dev with zero network."

**Fable treats old PySide repos as code to port rather than inspiration**
- Mitigation: Clear SOURCE_LINEAGE_SUMMARY + REPO_TO_FEATURE_MAP that says "concepts and constraints, not implementation." Repeated warnings in the build prompt.

**Fable makes Fable recommendations too cheap or always available**
- Mitigation: Dedicated "Fable Is Scarce" law + router + gate requirements. Must-build checklist includes scarcity gate test.

## Medium Risks

**Fake certainty in mock data**
- Mitigation: MOCK_DATA_INVENTORY with mandatory evidence tiers on every item. EvidenceBadge component required. "No False Certainty" law.

**Animation without state (pretty but meaningless)**
- Mitigation: "Motion Means State" law + state machine in FILE_STRUCTURE_SPEC. Must-build requires state-driven animation.

**Dexter becomes cute or marketing**
- Mitigation: Explicit "Dexter Is Not Cute" rule with tone guidance (precise, diagnostic, clinical).

**Electron window management surprises (frameless drag, always-on-top, multi-monitor)**
- Mitigation: Keep v1 expectations modest (basic draggable familiar + drawer inside or controlled window). Document future seam for advanced desktop behavior. Test on macOS first.

**localStorage feels too temporary**
- Mitigation: Acknowledge in TECHNICAL_TARGET_SPEC that filesystem is the planned next step. Make persistence layer swappable.

## Lower but Real Risks

**Global shortcuts and launch-on-login require native work**
- Mitigation: Mark as future seams. Do not implement real globalShortcut or login items in v1 unless trivial.

**Attention engine becomes either too chatty or completely silent**
- Mitigation: Simple but working attention arbitration in the build. Make thresholds visible and tunable in UI or config.

**Old asset zips / frames from RELOADED are missing**
- Mitigation: Do not depend on the missing PNG zip for v1. Use simple SVG/CSS or a few bundled images for the familiar. Treat advanced clusters as future.

**Fable 5 may not have perfect local model access yet**
- Mitigation: The entire design assumes mocks are primary. Real Fable integration is explicitly a later seam.

## Process Risks

- Fable produces only a plan or beautiful but non-runnable prototype → prompt explicitly forbids this and requires `npm run dev` success + checklist.
- Fable hides complexity behind "it will be configurable later" → require concrete working mocks and visible tiers from the start.

Review this register before accepting any Fable output.
