import type { EvidenceTier } from './evidence'

/** Law 10 (The Project Must Be Auditable): self-audit vocabulary. */

export type AuditStatus = 'pass' | 'warn' | 'fail'

export interface AuditCheck {
  id: string
  /** Which constitutional law (or quality bar) this check serves. */
  law: string
  title: string
  status: AuditStatus
  detail: string
  /** Tier of the evidence backing this check's verdict. */
  evidenceTier: EvidenceTier
}

export interface AuditReport {
  id: string
  ranAt: string
  appVersion: string
  checks: AuditCheck[]
  passed: number
  warned: number
  failed: number
  /**
   * A live run inspects real runtime state, so a fresh report is
   * `verified`; bundled sample reports are `mock`.
   */
  evidenceTier: EvidenceTier
}
