# Developer Checklist: Adding New Modes and States

When extending the WESTCAT Familiar overlay with a new visual state or attention mode, follow this checklist to guarantee system consistency, type safety, visual permanence, and self-audit compliance.

---

## Part 1: Adding a New State

1. **Declare Types**
   - Add the state literal string to the `FamiliarStateId` union type in [types/index.ts](file:///Users/andrew/Westcat_Familiar/src/renderer/types/index.ts).
   - Valid states must represent actual posture, physical status, or interaction phases.

2. **Add to State Machine Transitions Map**
   - Update `TRANSITIONS` in [domain/familiarStateMachine.ts](file:///Users/andrew/Westcat_Familiar/src/renderer/domain/familiarStateMachine.ts) to define which states can transition to the new state.
   - Guard against invalid paths; transitions must be pure and deterministic.

3. **Define CSS Motion States**
   - Declare the state class selector `.state-<your-state>` inside [styles/familiar.css](file:///Users/andrew/Westcat_Familiar/src/renderer/styles/familiar.css).
   - Ensure all keyframe animations or transitions are scoped behind this state class selector or a `data-state` attribute to honor the "Motion Means State" law.

4. **Verify Preferences**
   - Scrutinize styling transitions; ensure all animations honor prefers-reduced-motion classes cleanly.

---

## Part 2: Adding a New Mode

1. **Define Mode Specifications**
   - In [types/mode.ts](file:///Users/andrew/Westcat_Familiar/src/renderer/types/mode.ts), review the `ModeDef` structure.
   - Add your new mode configuration block inside the modes registry in [domain/modeManager.ts](file:///Users/andrew/Westcat_Familiar/src/renderer/domain/modeManager.ts).
   - Define:
     - `id`: unique string matching `mode-<id>`
     - `label`: visual label
     - `statusText`: text indicator
     - `proactivity`: nudge intensity label
     - `nudgeAfterIdleMs`: positive value, minimum 30s (or `null` if the mode never nudges)
     - `drawerCommandIds`: local and routed actions array

2. **Define Accent Color & Focus Outline**
   - Declare the mode theme token inside [styles/tokens.css](file:///Users/andrew/Westcat_Familiar/src/renderer/styles/tokens.css).
   - Scope the accent color on elements in [index.css](file:///Users/andrew/Westcat_Familiar/src/renderer/index.css) using `.mode-<your-mode> { --accent: ... }` to auto-adjust drawer accents and focus outlines.

3. **Budget Compliance**
   - Verify that any routed AI commands added to `drawerCommandIds` are gated by the Fable scarcity budget helper checks.

---

## Part 3: Updating the Self-Audit Harness

1. **Register Class Verification**
   - Add the new state label to `REQUIRED_STATES` or the new mode label to `REQUIRED_MODES` in [engines/selfAudit.ts](file:///Users/andrew/Westcat_Familiar/src/renderer/engines/selfAudit.ts).
   - The self-audit harness will automatically assert that the active DOM and CSS selectors match.

2. **Run Local Verification**
   - Run `npm run verify` to test build compiler diagnostics.
   - Trigger the developer mode self-audit panel to certify the visual and state coverage passes with 0 failures.
