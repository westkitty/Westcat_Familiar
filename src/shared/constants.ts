/** Shared constants for WESTCAT Familiar. */

export const APP_NAME = 'WESTCAT Familiar'
export const APP_VERSION = '0.1.0'

export const PACKET_SCHEMA = 'wcf.packet.v1' as const

/**
 * Law 7 (Fable Is Scarce): units of Fable reasoning available per session.
 * Finite on purpose. Resets on relaunch; spending one requires passing the
 * scarcity gate explicitly.
 */
export const FABLE_SESSION_BUDGET = 3

/** Law 4 (Attention Must Be Earned): max proactive nudges per rolling hour. */
export const NUDGE_HOURLY_CAP = 3

/** Minimum seconds between two nudges, regardless of mode. */
export const NUDGE_COOLDOWN_MS = 60_000
