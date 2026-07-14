import { EVIDENCE_CLASS_META } from '../../domain/evidenceModel'
import type { EvidenceClass } from '../../../shared/governance'

export function EvidenceClassBadge({ classification }: { classification: EvidenceClass }): JSX.Element {
  const meta = EVIDENCE_CLASS_META[classification]
  return (
    <span
      className={`evidence-class-badge evidence-${classification}`}
      title={meta.hint}
      data-evidence-class={classification}
      aria-label={`Evidence: ${meta.label}. ${meta.hint}`}
    >
      {meta.label}
    </span>
  )
}
