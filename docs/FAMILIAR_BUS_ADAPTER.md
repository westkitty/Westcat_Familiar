# Familiar Bus — WESTCAT Adapter

## Purpose

Familiar Bus gives WESTCAT a small semantic input contract for attention and reaction while preserving the existing Familiar Constitution.

It does not replace WESTCAT's DOM + CSS familiar, invent new personality, bypass legal state transitions, or add cloud dependencies.

## Contract

WESTCAT accepts the same semantic fields used by other Familiar Bus consumers:

- attention: idle, aware, focused, interrupted, urgent
- reaction: neutral, blink, curious, startled, pleased, irritated, sleepy, dizzy, celebrate, warning, error
- trigger: pointer, touch, audio, system, agent, timer, world
- intensity, priority, duration, timestamp, sequence
- optional renderer-neutral look target

## WESTCAT state adapter

Signals are mapped only into existing legal Familiar states:

| Semantic input | Existing WESTCAT state |
|---|---|
| aware / curious | watching |
| focused + agent | thinking |
| focused + non-agent | working |
| interrupted / urgent / startled | alert |
| warning | judging |
| irritated / dizzy | annoyed |
| error | blocked |
| sleepy | sleeping |
| pleased / celebrate | watching |

The existing transition table remains authoritative. If the current state forbids the mapped transition, Familiar Bus does not force it.

## Current publishers

- user interaction publishes low-priority aware/curious state;
- attention-engine nudges publish timer-driven aware/curious state;
- command routing publishes focused state;
- Fable scarcity gates publish urgent/warning state;
- successful routing publishes pleased state;
- failed scarcity-budget execution publishes error state.

## Protected boundaries

- The familiar remains the interface.
- DOM + CSS remains the v0 visual implementation.
- Motion Means State remains controlling.
- Existing drawer, panels, modes, persistence, attention engine, scarcity gates and continuity controls remain intact.
- Familiar Bus is not a personality engine.
- No mandatory external service or telemetry is introduced.

## Validation status

Source integration is implemented on `feature/familiar-bus-foundation`. Typecheck, Electron build and runtime interaction checks remain unverified until an execution node is available.
