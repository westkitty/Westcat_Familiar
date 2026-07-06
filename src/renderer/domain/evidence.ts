/** Evidence helpers — tallying and coverage checks (Law 5, Law 10). */
import { EVIDENCE_TIERS } from '../types/evidence'
import type { EvidenceTier, Evidenced } from '../types/evidence'

export function isEvidenceTier(v: unknown): v is EvidenceTier {
  return typeof v === 'string' && (EVIDENCE_TIERS as readonly string[]).includes(v)
}

/** Count records per tier (used by packets and the audit). */
export function tallyTiers(records: readonly Evidenced[]): Partial<Record<EvidenceTier, number>> {
  const tally: Partial<Record<EvidenceTier, number>> = {}
  for (const r of records) {
    if (isEvidenceTier(r.evidenceTier)) {
      tally[r.evidenceTier] = (tally[r.evidenceTier] ?? 0) + 1
    }
  }
  return tally
}

export function mergeTallies(
  ...tallies: Partial<Record<EvidenceTier, number>>[]
): Partial<Record<EvidenceTier, number>> {
  const out: Partial<Record<EvidenceTier, number>> = {}
  for (const t of tallies) {
    for (const tier of EVIDENCE_TIERS) {
      const n = t[tier]
      if (n) out[tier] = (out[tier] ?? 0) + n
    }
  }
  return out
}

export interface CoverageResult {
  total: number
  labeled: number
  pct: number
}

/** What fraction of records carry a valid tier. The audit wants 100%. */
export function coverage(records: readonly Evidenced[]): CoverageResult {
  const total = records.length
  const labeled = records.filter((r) => isEvidenceTier(r.evidenceTier)).length
  return { total, labeled, pct: total === 0 ? 100 : Math.round((labeled / total) * 100) }
}
