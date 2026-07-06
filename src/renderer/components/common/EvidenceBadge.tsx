/**
 * EvidenceBadge — Law 5 made visible. Use wherever data appears.
 * Hovering reveals the tier's meaning; `mock` is deliberately striped so
 * fake data cannot pass as real at a glance.
 */
import { EVIDENCE_TIER_META } from '../../data/evidenceTiers'
import type { EvidenceTier } from '../../types/evidence'

export function EvidenceBadge({ tier }: { tier: EvidenceTier }): JSX.Element {
  const meta = EVIDENCE_TIER_META[tier]
  return (
    <span className={`evidence-badge ev-${tier}`} title={meta.hint} data-tier={tier}>
      {meta.label}
    </span>
  )
}
