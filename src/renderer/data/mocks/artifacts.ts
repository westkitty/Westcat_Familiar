/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Sample artifacts: previous packets, audit outputs, exports. Real forged
 * packets from this session appear alongside these, tiered `verified`.
 */
import type { Evidenced } from '../../types/evidence'

export interface Artifact extends Evidenced {
  id: string
  type: 'context-packet' | 'audit-report' | 'export' | 'frame-set' | 'decision-log'
  created: string
  summary: string
}

export const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: 'art-pkt-001',
    type: 'context-packet',
    created: '2026-07-04T18:22:00Z',
    summary: 'Packet forged in explore mode; question about drawer ergonomics. Never sent (budget spared).',
    evidenceTier: 'mock'
  },
  {
    id: 'art-audit-001',
    type: 'audit-report',
    created: '2026-07-04T18:40:00Z',
    summary: 'Sample self-audit: 9 pass / 1 warn (stale records present).',
    evidenceTier: 'mock'
  },
  {
    id: 'art-export-001',
    type: 'export',
    created: '2026-06-30T10:05:00Z',
    summary: 'Imaginary JSON export of check-in history.',
    evidenceTier: 'mock'
  },
  {
    id: 'art-frames-001',
    type: 'frame-set',
    created: '2026-03-01T14:00:00Z',
    summary: 'Cat sprite frame set from the Overlay Frame Maker era. Location unknown.',
    evidenceTier: 'unavailable'
  },
  {
    id: 'art-decision-001',
    type: 'decision-log',
    created: '2026-07-01T09:00:00Z',
    summary: 'Decision log: adopt Electron + React; PySide lineage becomes inspiration only.',
    evidenceTier: 'mock'
  }
]
