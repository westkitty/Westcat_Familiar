/**
 * Persistence layer, v1: localStorage behind a swap-friendly interface.
 * FUTURE SEAM: a filesystemAdapter with the identical interface, backed by
 * JSON files in Electron's userData dir. Nothing else may touch storage
 * directly — the self-audit checks health through this module.
 */

export interface PersistenceAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  keys(): string[]
}

const PREFIX = 'wcf.'

export const localStorageAdapter: PersistenceAdapter = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw === null ? null : (JSON.parse(raw) as T)
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable — the app keeps working in memory.
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      // ignore
    }
  },
  keys(): string[] {
    try {
      return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX))
    } catch {
      return []
    }
  }
}

export const persistence: PersistenceAdapter = localStorageAdapter

export const KEYS = {
  position: 'familiar.position',
  flipped: 'familiar.flipped',
  mode: 'mode',
  lastAudit: 'audit.last',
  lastAuditAt: 'audit.lastRanAt',
  lastPacket: 'packet.last'
} as const

/** Total bytes currently persisted under the app prefix (tier: verified). */
export function storageUsageBytes(): number {
  try {
    return persistence
      .keys()
      .reduce((sum, k) => sum + k.length + (localStorage.getItem(k)?.length ?? 0), 0)
  } catch {
    return 0
  }
}
