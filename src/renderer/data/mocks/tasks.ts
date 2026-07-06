/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Invented tasks and check-ins. Some are framed as answers to polling-style
 * questions (the west_cat_overlay lineage). All labeled.
 */
import type { Evidenced } from '../../types/evidence'

export interface Task extends Evidenced {
  id: string
  projectId: string
  text: string
  due: string | null
  completed: boolean
  source: 'check-in' | 'manual' | 'imported'
}

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-01',
    projectId: 'proj-familiar',
    text: 'Wire the drawer summon gesture to the familiar click.',
    due: '2026-07-08',
    completed: false,
    source: 'manual',
    evidenceTier: 'mock'
  },
  {
    id: 'task-02',
    projectId: 'proj-familiar',
    text: 'Check-in answer: “energy is fine, momentum is real” → keep going.',
    due: null,
    completed: true,
    source: 'check-in',
    evidenceTier: 'mock'
  },
  {
    id: 'task-03',
    projectId: 'proj-familiar',
    text: 'Check-in answer: “stuck on packaging” → parked as future seam.',
    due: null,
    completed: false,
    source: 'check-in',
    evidenceTier: 'mock'
  },
  {
    id: 'task-04',
    projectId: 'proj-dictation',
    text: 'Sketch how a dictation start/stop would route through the drawer.',
    due: '2026-07-12',
    completed: false,
    source: 'manual',
    evidenceTier: 'mock'
  },
  {
    id: 'task-05',
    projectId: 'proj-hub',
    text: 'Imported from an older list; provenance uncertain.',
    due: null,
    completed: false,
    source: 'imported',
    evidenceTier: 'stale'
  },
  {
    id: 'task-06',
    projectId: 'proj-familiar',
    text: 'Follow-up derived from task-02: schedule the next check-in prompt.',
    due: '2026-07-07',
    completed: false,
    source: 'check-in',
    evidenceTier: 'inferred'
  },
  {
    id: 'task-07',
    projectId: 'proj-frame-maker',
    text: 'Decide whether sprite frames beat pure SVG for the familiar.',
    due: null,
    completed: false,
    source: 'manual',
    evidenceTier: 'mock'
  }
]
