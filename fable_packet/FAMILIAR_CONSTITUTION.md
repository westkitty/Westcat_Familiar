# FAMILIAR CONSTITUTION — WESTCAT Familiar

These are the non-negotiable laws of the product. Every screen, interaction, animation, and piece of data must be judged against them.

## The Ten Laws

1. **Familiar First**  
   The animated familiar is the primary interface. It is always present. Drawers, panels, and tools are summoned from it.

2. **Presence Before Panels**  
   Never bury the familiar behind a conventional dashboard or app shell on launch. The user should feel the familiar is "there with them."

3. **Motion Means State**  
   Animation is not decoration. Every movement, blink, posture, or transition must map to a real state in the familiar state machine. If it doesn't mean something, it shouldn't move.

4. **Attention Must Be Earned**  
   The familiar and drawer respect the user's focus. Proactive interruptions, highlights, or drawer openings must be justified by the attention engine and user-configurable thresholds.

5. **No False Certainty**  
   Every suggestion, diagnostic, task, artifact, or "AI" output carries a visible evidence tier. Mock data must look like mock data.

6. **Mode Changes Behavior**  
   Switching modes is not just a filter. It must change the familiar's appearance, available actions, animation vocabulary, drawer contents, and how the attention engine behaves.

7. **Fable Is Scarce**  
   Fable (the deeper reasoning layer) is expensive and limited. The UI must actively discourage casual overuse. The router must prefer local, cheap paths. Recommendations for "ask Fable" must be gated and costed.

8. **Local First Means Local First**  
   The app runs completely without network. All core experiences work with bundled transparent mocks. Future integrations are seams, not requirements.

9. **Dexter Is Not Cute**  
   Dexter Inspect (the project inspection / necromancy / self-audit lens) is precise, diagnostic, slightly austere, and useful. It is not a whimsical cartoon character or marketing mascot. It surfaces structure, history, decisions, and rot.

10. **The Project Must Be Auditable**  
    The app must be able to inspect itself. State, decisions, mock data, packets, and compliance with these laws must be locally inspectable without external tools.

## Anti-Patterns (forbidden)

- Dashboard collapse: turning the familiar into a small icon in the corner of a giant control-center UI.
- Fake intelligence theater: presenting mock outputs without evidence tiers or with overconfident language.
- Fable over-recommendation: the UI constantly suggesting "use Fable" for trivial things.
- Motion without meaning: idle animations that have no state backing.
- Hidden mocks: data that looks real until you dig.
- Mode theater: mode selector that only changes a label or color with no behavioral difference.
- Scarcity theater: a gate that is always open or always closed with no real logic.

## Interface Behavior Rules

- The familiar must be draggable (with care for interactive zones).
- Right-click or long-press on the familiar should offer context actions (size, opacity, flip, inspect, etc.).
- Drawer summon should feel intentional and reversible.
- Evidence labels must be visible by default or one click away on data surfaces.
- Reduced motion must disable or simplify non-essential animations while preserving state communication.

## Review Checklist (use on every major change)

- [ ] Does the familiar remain the primary presence?
- [ ] Is motion backed by explicit state?
- [ ] Are evidence tiers visible where data appears?
- [ ] Does changing mode actually change behavior (not just chrome)?
- [ ] Would a new user understand that Fable is scarce?
- [ ] Can everything here be audited locally?
- [ ] Does this feel like a living buddy or like a productivity dashboard?
- [ ] Is Dexter still precise rather than cute?

## Dexter Rule

"Dexter is not cute."  
When building inspection, history, project graveyard, or self-audit views, use clinical, useful, slightly dry language and visuals. Think "diagnostic tool" or "forensic lens," not "fun helper character."

## Fable Scarcity Rule (Router)

The AI router must:
- Prefer local deterministic logic first.
- Surface a clear "cost" or "scarce resource" signal before offering Fable.
- Make over-use of Fable feel expensive or limited.
- Produce context packets that are high-signal rather than dumping the entire world.

## Evidence Tier Rule

Never present anything without its tier when it could be mistaken for ground truth. Tiers: verified, mock, inferred, stale, unavailable, future_seam.

These laws are the constitution. Code that violates them is incorrect even if it "works."
