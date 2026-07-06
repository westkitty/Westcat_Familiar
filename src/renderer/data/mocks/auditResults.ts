/**
 * ⚠ MOCK DATA — WESTCAT Familiar
 * Sample self-audit outputs: one clean, one with issues. A LIVE audit run
 * (Self-Audit panel → run) produces a `verified` report; these are the
 * bundled examples and say `mock`.
 */
import type { AuditReport } from '../../types/audit'

export const MOCK_AUDIT_SAMPLES: AuditReport[] = [
  {
    id: 'audit-sample-clean',
    ranAt: '2026-07-04T18:40:00Z',
    appVersion: '0.1.0',
    passed: 10,
    warned: 0,
    failed: 0,
    evidenceTier: 'mock',
    checks: [
      {
        id: 'sample-evidence',
        law: 'Law 5 — No False Certainty',
        title: 'Evidence coverage',
        status: 'pass',
        detail: '100% of mock records carried a valid tier.',
        evidenceTier: 'mock'
      },
      {
        id: 'sample-modes',
        law: 'Law 6 — Mode Changes Behavior',
        title: 'Mode coverage',
        status: 'pass',
        detail: '4 modes, distinct skins, distinct attention profiles.',
        evidenceTier: 'mock'
      }
    ]
  },
  {
    id: 'audit-sample-issues',
    ranAt: '2026-06-20T11:05:00Z',
    appVersion: '0.0.9',
    passed: 7,
    warned: 2,
    failed: 1,
    evidenceTier: 'mock',
    checks: [
      {
        id: 'sample-fail-evidence',
        law: 'Law 5 — No False Certainty',
        title: 'Evidence coverage',
        status: 'fail',
        detail: '3 diagnostic rows shipped without tiers. Fixed in 0.1.0.',
        evidenceTier: 'mock'
      },
      {
        id: 'sample-warn-stale',
        law: 'Data freshness',
        title: 'Stale records',
        status: 'warn',
        detail: 'Frame pipeline diagnostics untouched for 100+ days.',
        evidenceTier: 'mock'
      },
      {
        id: 'sample-warn-scarcity',
        law: 'Law 7 — Fable Is Scarce',
        title: 'Fable usage discipline',
        status: 'warn',
        detail: '41% of routed inputs recommended Fable. Gate thresholds tightened.',
        evidenceTier: 'mock'
      }
    ]
  }
]
