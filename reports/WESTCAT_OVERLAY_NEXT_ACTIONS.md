# Next Actions

## Immediate Next Step

**Read the full set of reports in order**, starting with `WESTCAT_OVERLAY_REPO_AUDIT.md` and `WESTCAT_OVERLAY_CURRENT_VERSION_FINDINGS.md`. Do not start coding or cloning new things until you have internalized the evidence and judgments.

The audit is complete. The plan is actionable but conservative.

## Next 5 Actions

1. **Choose the canonical base explicitly** (west_cat_overlay as primary + port plan from RELOADED, or a clean new repo if you prefer a fresh start). Write the decision in a short DECISION.md at the workspace root.

2. **Create the canonical working directory** (e.g. `mkdir -p /Users/andrew/Westcat_Familiar/canonical/westcat-overlay` or use a git worktree from one of the clones). Copy the chosen base without overwriting history yet.

3. **Perform a minimal verification run** on the base you chose:
   - On a clean Python (ideally 3.10–3.12), create venv.
   - Install with relaxed PySide6 range.
   - Confirm `python -m app` or equivalent launches without immediate crash (even if assets incomplete).
   - Run pytest collect + any non-GUI tests.
   - Note exact commands that worked.

4. **Extract the animation cluster system** from RELOADED into a spike branch or folder inside the canonical base. Wire a minimal "cluster idle" state using whatever PNGs you can source or stub. Prove the animator runs.

5. **Write the first draft of the consolidated README + QUICKSTART** using the best text from the three active repos. Do not overpromise on features that aren't ported yet.

## Do Not Do Yet

- Do not delete, archive, or force-push anything on GitHub.
- Do not start a brand new GitHub repository until the local canonical is stable enough to push.
- Do not run full GUI sessions for long periods or export results to Desktop without explicit intent.
- Do not merge chat/TTS from MacOS into the polling main without a deliberate decision.
- Do not assume the referenced frame zip in RELOADED exists somewhere; locate or regenerate first.
- Do not treat any single repo name ("Reloaded", "Unifier", "MacOS", "dx") as proof of superiority.
- Do not install PySide6 or heavy deps globally.
- Do not rewrite large modules before the migration map is executed in small, reviewable steps.

## Best Canonical Path

**Continue from existing repo (west_cat_overlay as base) + port from RELOADED + adopt patterns from MacOS.**

Do **not** create a completely new empty repo from scratch, and do **not** treat MacOS as the polling canonical.

This path gives you a working main + packaging immediately, plus the best animation and polling UX available in the family.

## One Recommended Next Command

After reading the reports:

```bash
cd /Users/andrew/Westcat_Familiar && ls -R reports/ && echo "=== Read WESTCAT_OVERLAY_CURRENT_VERSION_FINDINGS.md next ===" && head -30 reports/WESTCAT_OVERLAY_CURRENT_VERSION_FINDINGS.md
```

Then open the files in your editor and make the explicit base choice.
