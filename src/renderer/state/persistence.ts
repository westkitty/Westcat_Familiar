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

const memoryStore = new Map<string, string>()

let isLocalStorageAvailable = false
try {
  const testKey = PREFIX + '__test__'
  localStorage.setItem(testKey, '1')
  const read = localStorage.getItem(testKey)
  localStorage.removeItem(testKey)
  isLocalStorageAvailable = read === '1'
} catch {
  isLocalStorageAvailable = false
}

export const localStorageAdapter: PersistenceAdapter = {
  get<T>(key: string): T | null {
    try {
      const raw = isLocalStorageAvailable
        ? localStorage.getItem(PREFIX + key)
        : memoryStore.get(PREFIX + key) ?? null
      return raw === null ? null : (JSON.parse(raw) as T)
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      const raw = JSON.stringify(value)
      if (isLocalStorageAvailable) {
        localStorage.setItem(PREFIX + key, raw)
      } else {
        memoryStore.set(PREFIX + key, raw)
      }
    } catch {
      // Storage full or unavailable
    }
  },
  remove(key: string): void {
    try {
      if (isLocalStorageAvailable) {
        localStorage.removeItem(PREFIX + key)
      } else {
        memoryStore.delete(PREFIX + key)
      }
    } catch {
      // ignore
    }
  },
  keys(): string[] {
    try {
      if (isLocalStorageAvailable) {
        return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX))
      } else {
        return Array.from(memoryStore.keys())
      }
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
      .reduce((sum, k) => {
        const keyWithoutPrefix = k.startsWith(PREFIX) ? k.slice(PREFIX.length) : k
        const val = persistence.get<unknown>(keyWithoutPrefix)
        const valStr = val !== null && val !== undefined ? JSON.stringify(val) : ''
        return sum + k.length + valStr.length
      }, 0)
  } catch {
    return 0
  }
}

