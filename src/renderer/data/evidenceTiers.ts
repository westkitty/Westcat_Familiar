/** Display metadata for the six evidence tiers (Law 5). */
import type { EvidenceTier, EvidenceTierMeta } from '../types/evidence'

export const EVIDENCE_TIER_META: Record<EvidenceTier, EvidenceTierMeta> = {
  verified: {
    tier: 'verified',
    label: 'verified',
    hint: 'Real user data or a fact confirmed live in this session.'
  },
  mock: {
    tier: 'mock',
    label: 'mock',
    hint: 'Generated for demonstration. Safe to treat as fake.'
  },
  inferred: {
    tier: 'inferred',
    label: 'inferred',
    hint: 'Derived by simple local rules from other data.'
  },
  stale: {
    tier: 'stale',
    label: 'stale',
    hint: 'Previously true; age makes it questionable.'
  },
  unavailable: {
    tier: 'unavailable',
    label: 'unavailable',
    hint: 'Exists somewhere, but unreachable right now.'
  },
  future_seam: {
    tier: 'future_seam',
    label: 'future seam',
    hint: 'Placeholder for a capability that does not exist yet.'
  }
}
