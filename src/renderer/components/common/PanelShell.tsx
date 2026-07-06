/**
 * PanelShell — the frame every summoned panel lives in. Panels are
 * secondary citizens (Law 2): dismissible, never fullscreen, never hiding
 * the familiar.
 */
import type { ReactNode } from 'react'
import { MockBanner } from './MockBanner'

export function PanelShell({
  title,
  subtitle,
  onClose,
  children,
  bannerText,
  clinical = false
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  bannerText?: string
  clinical?: boolean
}): JSX.Element {
  return (
    <section className={clinical ? 'panel clinical' : 'panel'} role="dialog" aria-label={title}>
      <header className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close panel" title="Close (Esc)">
          ✕
        </button>
      </header>
      <MockBanner text={bannerText} />
      <div className="panel-body">{children}</div>
    </section>
  )
}
