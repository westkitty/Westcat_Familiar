import { EVIDENCE_CLASSES } from '../../shared/governance'
import type { EvidenceClaim, EvidenceClass, EvidenceWhisper } from '../../shared/governance'
import type { EvidenceTier } from '../types/evidence'

export const EVIDENCE_CLASS_META: Record<EvidenceClass, { label: string; hint: string }> = {
  observed: { label: 'observed', hint: 'Directly checked in the current environment.' },
  strongly_inferred: { label: 'strong inference', hint: 'Derived from multiple consistent observations.' },
  weakly_inferred: { label: 'weak inference', hint: 'A bounded heuristic; inspect before relying on it.' },
  session_memory: { label: 'session memory', hint: 'Recorded during this application session.' },
  durable_memory: { label: 'durable memory', hint: 'Persisted locally with explicit scope and controls.' },
  mocked: { label: 'mocked', hint: 'Demonstration data. It is not an operational observation.' },
  contradicted: { label: 'contradicted', hint: 'Available evidence conflicts; review is required.' },
  unavailable: { label: 'unavailable', hint: 'The check could not be completed.' },
  unknown: { label: 'unknown', hint: 'No adequate evidence is available.' }
}

export function isEvidenceClass(value: unknown): value is EvidenceClass {
  return typeof value === 'string' && EVIDENCE_CLASSES.some((entry) => entry === value)
}

export function createEvidence(
  classification: EvidenceClass,
  reason: string,
  sourceReference: string,
  options: { observedAt?: string; expiresAt?: string; confidence?: number; contradictions?: string[] } = {}
): EvidenceClaim {
  const evidence: EvidenceClaim = {
    classification,
    reason,
    sourceReference,
    observedAt: options.observedAt ?? new Date().toISOString()
  }

  if (options.expiresAt !== undefined) evidence.expiresAt = options.expiresAt
  if (options.confidence !== undefined) evidence.confidence = Math.min(1, Math.max(0, options.confidence))
  if (options.contradictions !== undefined) evidence.contradictionReferences = options.contradictions
  return evidence
}

export function isEvidenceExpired(evidence: EvidenceClaim, now = Date.now()): boolean {
  if (evidence.expiresAt === undefined) return false
  const expiry = Date.parse(evidence.expiresAt)
  return Number.isFinite(expiry) && expiry <= now
}

export function createWhisper(
  message: string,
  evidence: EvidenceClaim,
  options: Pick<EvidenceWhisper, 'actionable' | 'inspectionAvailable'> & {
    relatedActionId?: string
    relatedContradictionId?: string
  }
): EvidenceWhisper {
  const whisper: EvidenceWhisper = {
    id: `whisper-${crypto.randomUUID()}`,
    message,
    evidence,
    actionable: options.actionable,
    inspectionAvailable: options.inspectionAvailable
  }

  if (options.relatedActionId !== undefined) whisper.relatedActionId = options.relatedActionId
  if (options.relatedContradictionId !== undefined) whisper.relatedContradictionId = options.relatedContradictionId
  return whisper
}

export function evidenceClassFromLegacyTier(tier: EvidenceTier): EvidenceClass {
  const mapping: Record<EvidenceTier, EvidenceClass> = {
    verified: 'observed',
    mock: 'mocked',
    inferred: 'weakly_inferred',
    stale: 'unknown',
    unavailable: 'unavailable',
    future_seam: 'unavailable'
  }
  return mapping[tier]
}
