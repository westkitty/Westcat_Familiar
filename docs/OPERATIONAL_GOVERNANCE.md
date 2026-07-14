# WESTCAT Familiar Operational Governance

## Architecture

The ten operational systems use one source of truth: `useGovernanceStore`. React components summon and inspect this state; they do not own competing copies of domain records.

The architecture has four boundaries:

1. Pure domain evaluators implement evidence, mode policy, provenance redaction, unfinished-work pressure, interruption resolution, capability staleness, memory scope, project sessions, and constitutional checks.
2. A single Zustand store coordinates records and persists a versioned snapshot.
3. Electron exposes a narrow local operating-system boundary for folder selection, bounded read-only inspection, an explicit append-only handoff, and dropped-file path recovery.
4. Summoned React views manage records while the familiar exposes compact operational signals.

No cloud service, account, telemetry, analytics, remote database, hidden network request, global key capture, screen capture, or arbitrary shell command is present.

## Evidence model

All new governance claims use `EvidenceClaim` and one of these classifications:

- `observed`: checked directly in the current environment.
- `strongly_inferred`: a deterministic conclusion from consistent observations.
- `weakly_inferred`: a bounded heuristic.
- `session_memory`: recorded in the current application session.
- `durable_memory`: explicitly persisted with scope and controls.
- `mocked`: demonstration data, never operational truth.
- `contradicted`: evidence conflicts and requires review.
- `unavailable`: the requested check could not be completed.
- `unknown`: adequate evidence does not exist.

Claims include a reason, source reference, observation time, optional expiry, optional contradiction references, and optional confidence. Confidence never replaces source and classification.

The older six-tier display model remains for preserved mock panels and packet structures. New operational records use the richer shared model. The UI distinguishes classes with text, border grammar, patterns, and accessible labels; it does not rely on color alone.

## Provenance and redaction

Each routed command and deterministic quick action records:

- original and normalized request, after secret-shaped values are redacted;
- active mode and familiar state;
- router and policy decisions;
- evidence and capability identifiers;
- selected engine;
- bounded resource paths;
- proposed/executed command metadata, when applicable;
- timestamps and final status;
- summarized outputs, errors, fallbacks, applied memories, approvals, cancellations, and related unfinished work.

The store retains at most 250 action records. Dexter Inspect exposes the chain and can delete the retained history. Full file contents, environment variables, credentials, tokens, authorization headers, and private message contents are not copied into provenance. File paths are retained only for explicitly selected or dropped workspaces and approved handoff targets.

An action is successful only after its outcome is produced. Proposed, blocked, failed, cancelled, and succeeded states are separate.

## Persistence and migration

Governance data uses the localStorage key `wcf.governance.v1` with schema version `1`.

The persisted envelope contains provenance, unfinished work, interruption contracts, capability observations, workspace associations, project sessions, behavioral memories, constitutional findings, and an optional recovery notice.

Loading validates each collection and record boundary. Unsupported or non-object data becomes an empty safe state. Valid records survive mixed corruption; invalid records are discarded and a visible recovery notice is stored. Schema `0` records migrate into the schema `1` envelope through the same validators.

Retention:

- provenance: newest 250 records;
- project sessions: newest 100 records;
- other governance records: retained until their explicit record control or full reset is used;
- session-only workspace associations: expired when the project session closes;
- interrupted sessions: marked on application exit and recovered on the next load.

Operational controls provide a confirmed full governance reset. It does not touch project files.

## Mode policies

`evaluateActionPolicy` is the central evaluator. Every decision returns one of: allowed, blocked, requires approval, requires additional evidence, requires capability, or requires mode change. Each has a human-readable reason and evidence.

| Mode | Enforced boundary |
| --- | --- |
| Plain | Conservative baseline; destructive work requires approval. |
| Dex | Diagnostic actions are allowed; provenance remains prominent. |
| Work | Task execution and unfinished-work tracking are available; attention remains contract-bound. |
| Canon | Authoritative rewrites remain proposed until explicit approval. |
| Build | Modification requires prior project inspection and a validation stopping point. |
| Necromancy | Project modification is refused until the operator changes mode after reconstruction. |
| Fable | Invocation requires a specific justification and retains the local fallback. |
| Image | Generation requires confirmation of locked invariants. |
| Crisis | Nonessential routed work and interruptions are suppressed. |

Known-absent or stale required capabilities block or defer the action. Contradicted applicable memory requires review instead of silent selection.

## Unfinished-business pressure

Items record type, title, description, timestamps, project/provenance scope, recoverability, urgency, blocking state, completion/dismissal/snooze/reopen history, evidence, and a next action.

Pressure is weighted by urgency, blocking state, recoverability, and age decay. One important blocked task remains more significant than a pile of trivial items. Completed, dismissed, or currently snoozed items contribute no pressure. The familiar’s compact signal links to the ledger and explains the highest-value recovery item in its accessible label and title.

Starting a Context Packet question creates a recoverable draft item. Forging the packet completes it; closing the panel before forging leaves it inspectable.

## Workspace scent trails and project sessions

Workspace context is created only by explicit folder selection or a drop onto the familiar. Electron observes:

- path existence and read/write access;
- whether Git is available and the path is a repository;
- branch and bounded dirty-state metadata;
- Node, package-manager, dependency-directory, build-script, and typecheck-script availability;
- known handoff filenames, never their contents.

Associations offer a small project-specific action set. They do not authorize actions and can be deleted or allowed to expire.

Project entry records the intended outcome, stopping point, mode, repository state, known handoff names, capabilities, and provenance. Project exit stores a summary and next action. An optional checkbox explicitly approves appending a redacted closeout to `WESTCAT_HANDOFF.md`; append semantics preserve prior content. Exit never commits or pushes.

## Interruption contracts

Contracts define scope, allowed and forbidden triggers, creation/expiry/quiet times, maximum nudges, priority, crisis interaction, and a readable summary.

Resolution is deterministic: active matching contracts are ordered by priority and creation time. No matching contract means no interruption. Crisis mode suppresses nonessential triggers even when a contract exists. Consuming a contract increments its nudge count before another nudge can be considered. Contracts are visible from the familiar and can be edited or cancelled.

## Capability Truth

Stack Status displays capability state, evidence, method, check time, expiry, environment, failure reason, remediation, and whether the check is safe to rerun. Project observations expire after five minutes and then display as stale. Safe refreshes use the same allowlisted Electron checks with 2.5-second command timeouts.

The preserved process table remains deliberately mocked and labeled. Fable remains an unavailable future seam. No local model or external service is claimed operational.

## Behavioral memory

Memory rules include rule text, scope, source, evidence, creation/confirmation/expiry, application count, contradiction state, authority, and enabled state.

Scopes are global, project, mode, or action type. User-authored and user-approved rules can apply durably. Inferred rules are stored disabled with review-required state until explicitly approved. Applied rule identifiers appear in provenance. The user can list, search, edit, approve, disable, enable, and delete rules. Deletion removes future behavioral effect.

Passwords, tokens, private messages, and arbitrary file content are not valid memory material.

## Self-Audit extensions

Governance audit rules are modular and inspect:

- missing action evidence;
- successful actions that bypassed mode policy;
- destructive success without approval;
- Fable use without justification;
- mocked evidence presented as ordinary success;
- broken session-to-provenance references;
- unapproved inferred memory;
- stale capability claims;
- expired active whispers;
- duplicate governance identifiers.

The existing visual identity, offline, evidence badge, familiar-first, motion, reduced-motion, and Dexter checks remain intact. A run with no finding is not described as universal compliance; it means the implemented checks found no represented violation.

## User controls

- Click the familiar to summon commands and modes.
- Click the compact operational signal below the familiar to open project, unfinished-work, contract, and memory controls.
- Drop a local folder onto the familiar to create a bounded scent trail.
- Open Dexter Inspect for provenance and redaction history.
- Open Stack Status for capability truth and safe refreshes.
- Start a Context Packet draft to create recoverable unfinished work.
- Run Self-Audit for visual and governance findings.
- Use Advanced local reset only after confirmation.

All controls use native keyboard-focusable elements. Panels focus their close button on open and restore prior focus on close. Escape closes the current panel before the drawer. Reduced-motion mode preserves textual and static evidence distinctions.

## Deliberately unsupported behavior and limitations

- Routed local-model output remains mocked; Fable is an unavailable future seam.
- There is no arbitrary command runner. Provenance supports command records, but this build does not accept raw shell input.
- Capability Truth covers selected project metadata, not global machine surveillance.
- External file-change interruption is modeled but no global file watcher is installed.
- Files changed outside familiar-owned actions cannot be inferred safely and remain unknown.
- Project handoff writing is limited to an explicit append to `WESTCAT_HANDOFF.md`.
- Self-Audit covers represented runtime and static rules; it is not a proof against every possible future violation.
- Browser-level localStorage can lose the latest event on an abrupt operating-system process kill before the renderer flushes it.
