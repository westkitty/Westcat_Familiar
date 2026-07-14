# Operational Governance Manual Verification

Run from the repository root.

## Static gate

```bash
npm test
npm run typecheck
npm run build
```

All commands must exit zero before runtime testing.

## Electron smoke run

1. Run `npm run dev`.
2. Confirm the Electron window appears with the canonical raster familiar visible and primary.
3. Drag the familiar and release it. Confirm its position changes and survives a drawer interaction.
4. Click the familiar. Confirm the drawer opens. Press Escape and confirm it closes.
5. Open every mode. Confirm the mode label, action set, familiar posture/emphasis, and attention description change.
6. Open Operational controls from the compact signal below the familiar.
7. Enter a project session:
   - set an intended outcome and stopping point;
   - select this repository;
   - confirm path, branch, dirty state, and handoff-name evidence appear as observed;
   - confirm no commit or push occurs.
8. Drag a local project folder onto the familiar. Confirm Operational controls opens and a scoped scent trail appears without file content display.
9. Route `what mode is active?`. Open Dexter Inspect and verify the successful provenance chain.
10. Route `delete the project`. Confirm policy blocks it, the familiar shows a classified blocked whisper, Dexter records the reason, and an unfinished item appears.
11. Open Context Packet Forge, type a question, close the panel, and inspect Unfinished business. Confirm an incomplete packet exists. Reopen Packet Forge, forge it, and confirm the item resolves.
12. Add the `One nudge` contract. Confirm the familiar signal shows a contract. Inspect it, then cancel it.
13. Open Stack Status. Confirm live capabilities show observed evidence, method, timestamp, expiry, and remediation. Run Refresh safe checks.
14. Add a user-authored project memory. Search for it, edit it, disable it, enable it, and delete it. Add an inferred rule and confirm it starts disabled until approved.
15. Run Self-Audit. Confirm visual checks and Governance findings are distinct and evidence-labeled.
16. Close the project session with a summary and next action. Leave the handoff checkbox clear first; confirm no project file is written.
17. Start another session, select the append-only handoff checkbox, close it, and confirm `WESTCAT_HANDOFF.md` is appended rather than overwritten.
18. Start a session and quit without closing it. Relaunch and confirm an interrupted session is shown with a Restore active session control.

## Reduced-motion smoke run

1. Enable Reduce motion in macOS Accessibility settings before launch, or launch the renderer with an equivalent media emulation.
2. Repeat familiar state changes, mode switches, an observed whisper, a mocked router result, and a contradicted/blocked whisper.
3. Confirm loops are removed while text labels, border grammar, patterns, status state, and evidence classes remain distinguishable without color.

## Failure recording

For every failed step, record:

- exact step;
- observed behavior;
- whether the claim was observed, inferred, mocked, unavailable, or unknown;
- related provenance identifier where present;
- first failure rather than cascaded symptoms.
