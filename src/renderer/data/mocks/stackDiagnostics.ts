/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Pretend process health for the Stack Status panel. The panel also shows
 * a LIVE section (verified) sourced from the real bridge — these rows are
 * the fake ones, and they say so.
 */
import type { Evidenced } from '../../types/evidence'

export interface StackDiagnostic extends Evidenced {
  id: string
  process: string
  status: 'running' | 'stopped' | 'degraded' | 'not_built'
  version: string
  memory: string
  lastCheck: string
  note?: string
}

export const MOCK_STACK_DIAGNOSTICS: StackDiagnostic[] = [
  {
    id: 'diag-electron',
    process: 'electron shell',
    status: 'running',
    version: 'see live section',
    memory: '~180 MB',
    lastCheck: '2026-07-05T21:10:00Z',
    note: 'Verified versions appear in the live section above.',
    evidenceTier: 'mock'
  },
  {
    id: 'diag-vite',
    process: 'vite renderer (HMR)',
    status: 'running',
    version: '5.x',
    memory: '~90 MB',
    lastCheck: '2026-07-05T21:10:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'diag-react',
    process: 'react renderer',
    status: 'running',
    version: '18.x',
    memory: 'shared',
    lastCheck: '2026-07-05T21:10:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'diag-persistence',
    process: 'persistence layer (localStorage)',
    status: 'running',
    version: 'v1',
    memory: '<1 MB',
    lastCheck: '2026-07-05T21:10:00Z',
    note: 'Filesystem JSON adapter is a declared seam.',
    evidenceTier: 'mock'
  },
  {
    id: 'diag-attention',
    process: 'attention engine',
    status: 'running',
    version: 'v1',
    memory: 'negligible',
    lastCheck: '2026-07-05T21:10:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'diag-router',
    process: 'command router',
    status: 'running',
    version: 'v1',
    memory: 'negligible',
    lastCheck: '2026-07-05T21:10:00Z',
    evidenceTier: 'mock'
  },
  {
    id: 'diag-frames',
    process: 'frame asset pipeline',
    status: 'degraded',
    version: '0.0 (concept)',
    memory: '—',
    lastCheck: '2026-03-02T09:00:00Z',
    note: 'Last touched in the Overlay Frame Maker era.',
    evidenceTier: 'stale'
  },
  {
    id: 'diag-ollama',
    process: 'ollama sidecar',
    status: 'not_built',
    version: '—',
    memory: '—',
    lastCheck: '—',
    note: 'Local model integration point. Interface only.',
    evidenceTier: 'future_seam'
  },
  {
    id: 'diag-fable',
    process: 'fable reasoning core',
    status: 'not_built',
    version: '—',
    memory: '—',
    lastCheck: '—',
    note: 'The scarce one. Packets forge locally until it lands.',
    evidenceTier: 'future_seam'
  },
  {
    id: 'diag-tts',
    process: 'tts / audio worker',
    status: 'not_built',
    version: '—',
    memory: '—',
    lastCheck: '—',
    evidenceTier: 'future_seam'
  },
  {
    id: 'diag-shell',
    process: 'allowlisted shell executor',
    status: 'not_built',
    version: '—',
    memory: '—',
    lastCheck: '—',
    note: 'Will require explicit user approval + allowlist config.',
    evidenceTier: 'future_seam'
  }
]
