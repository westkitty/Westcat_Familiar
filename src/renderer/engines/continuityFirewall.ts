/**
 * Continuity Firewall — a hard wall between "this session" (verified,
 * volatile, dies with the window) and "long-term memory" (mock, read-only
 * in v1). Every read across the wall is logged; writes across the wall are
 * a future seam and are refused with a reason.
 */
import type { Evidenced } from '../types/evidence'

export interface MemoryRecord extends Evidenced {
  id: string
  text: string
  createdAt: string
}

export interface FirewallCrossing {
  at: string
  direction: 'read'
  purpose: string
}

/** ⚠ MOCK: pretend long-term memory. Lives here so the wall is one file. */
const MOCK_LONG_TERM: MemoryRecord[] = [
  {
    id: 'ltm-01',
    text: 'User prefers the familiar on the left half of the screen.',
    createdAt: '2026-06-12T09:00:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'ltm-02',
    text: 'Focus blocks usually run 09:00–12:00; check-ins land better after lunch.',
    createdAt: '2026-06-20T14:30:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'ltm-03',
    text: 'Previous overlay attempts died at the packaging step. Ship small.',
    createdAt: '2026-07-01T08:15:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'ltm-04',
    text: 'Fable answers were best when packets stayed under a screenful.',
    createdAt: '2026-07-03T19:45:00Z',
    evidenceTier: 'mock'
  }
]

class ContinuityFirewall {
  private session: MemoryRecord[] = []
  private crossings: FirewallCrossing[] = []
  private counter = 0

  /** Record something that truly happened this session (tier: verified). */
  addSessionEvent(text: string): MemoryRecord {
    const record: MemoryRecord = {
      id: `sess-${++this.counter}`,
      text,
      createdAt: new Date().toISOString(),
      evidenceTier: 'verified'
    }
    this.session.push(record)
    return record
  }

  sessionEvents(): readonly MemoryRecord[] {
    return this.session
  }

  /** Reading long-term memory crosses the wall — and gets logged. */
  readLongTerm(purpose: string): readonly MemoryRecord[] {
    this.crossings.push({ at: new Date().toISOString(), direction: 'read', purpose })
    return MOCK_LONG_TERM
  }

  crossingLog(): readonly FirewallCrossing[] {
    return this.crossings
  }

  /** Writing across the wall does not exist yet. Refuse, with a reason. */
  promoteToLongTerm(_record: MemoryRecord): { ok: false; reason: string } {
    return {
      ok: false,
      reason:
        'future_seam: v1 keeps session and long-term memory strictly separated. ' +
        'Promotion will require an explicit review step when real memory lands.'
    }
  }
}

export const continuityFirewall = new ContinuityFirewall()
