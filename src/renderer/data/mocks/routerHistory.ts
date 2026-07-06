/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Example router decisions from imaginary past sessions. Real decisions
 * from THIS session are logged separately (tier: verified) and shown
 * alongside these in Stack Status.
 */
import type { Evidenced } from '../../types/evidence'
import type { RoutePath } from '../../types'

export interface RouterHistoryEntry extends Evidenced {
  id: string
  when: string
  input: string
  path: RoutePath
  outcome: string
}

export const MOCK_ROUTER_HISTORY: RouterHistoryEntry[] = [
  {
    id: 'rh-01',
    when: '2026-07-04T18:20:00Z',
    input: 'what time is it',
    path: 'local_logic',
    outcome: 'Answered from the local clock. Cost: nothing.',
    evidenceTier: 'mock'
  },
  {
    id: 'rh-02',
    when: '2026-07-04T18:25:00Z',
    input: 'summarize this session',
    path: 'local_mock_ai',
    outcome: 'Mock seam produced a labeled fake summary.',
    evidenceTier: 'mock'
  },
  {
    id: 'rh-03',
    when: '2026-07-04T18:31:00Z',
    input: 'why did the overlay projects keep dying — analyze and plan a fix',
    path: 'fable',
    outcome: 'Gate passed after confirm; packet forged; 1 budget unit spent.',
    evidenceTier: 'mock'
  },
  {
    id: 'rh-04',
    when: '2026-07-04T18:33:00Z',
    input: 'design a new mascot wardrobe system',
    path: 'local_mock_ai',
    outcome: 'Gate DECLINED by user — stayed local. Budget preserved.',
    evidenceTier: 'mock'
  },
  {
    id: 'rh-05',
    when: '2026-07-04T18:50:00Z',
    input: 'how many open tasks',
    path: 'local_logic',
    outcome: 'Counted mock tasks deterministically.',
    evidenceTier: 'mock'
  },
  {
    id: 'rh-06',
    when: '2026-07-04T19:02:00Z',
    input: 'refactor plan for the state machine?',
    path: 'local_mock_ai',
    outcome: 'Budget was exhausted; router fell back to the local seam.',
    evidenceTier: 'mock'
  }
]
