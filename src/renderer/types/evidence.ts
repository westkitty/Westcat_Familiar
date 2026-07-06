/**
 * Law 5 (No False Certainty): every piece of data shown to the user
 * carries one of exactly these tiers.
 */
export const EVIDENCE_TIERS = [
  'verified',
  'mock',
  'inferred',
  'stale',
  'unavailable',
  'future_seam'
] as const

export type EvidenceTier = (typeof EVIDENCE_TIERS)[number]

/** Anything displayed that could be mistaken for ground truth. */
export interface Evidenced {
  evidenceTier: EvidenceTier
}

export interface EvidenceTierMeta {
  tier: EvidenceTier
  label: string
  hint: string
}
