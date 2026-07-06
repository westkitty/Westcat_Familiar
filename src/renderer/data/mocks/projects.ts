/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Everything in this file is invented for demonstration (Law 5: No False
 * Certainty). Edit freely; the UI labels each record with its tier.
 */
import type { Evidenced } from '../../types/evidence'

export interface Project extends Evidenced {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'archived'
  lastActivity: string
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-familiar',
    name: 'WESTCAT Familiar',
    description: 'This app — Electron familiar with a local command layer.',
    status: 'active',
    lastActivity: '2026-07-05',
    evidenceTier: 'mock'
  },
  {
    id: 'proj-dictation',
    name: 'Dictation Sidecar',
    description: 'Pretend menu-bar dictation tool the familiar could summon.',
    status: 'active',
    lastActivity: '2026-06-28',
    evidenceTier: 'mock'
  },
  {
    id: 'proj-hub',
    name: 'Home Hub',
    description: 'Imaginary tablet portal for household check-ins.',
    status: 'paused',
    lastActivity: '2026-05-14',
    evidenceTier: 'mock'
  },
  {
    id: 'proj-frame-maker',
    name: 'Overlay Frame Maker',
    description: 'Possible future asset studio for familiar sprite sets.',
    status: 'paused',
    lastActivity: '2026-03-02',
    evidenceTier: 'mock'
  },
  {
    id: 'proj-overlay-reloaded',
    name: 'WESTCAT-OVERLAY-RELOADED',
    description: 'Archived PySide ancestor. Animation ideas were extracted; code was not.',
    status: 'archived',
    lastActivity: '2025-11-02',
    evidenceTier: 'stale'
  }
]
