/**
 * PanelShell — the frame every summoned panel lives in. Panels are
 * secondary citizens (Law 2): dismissible, never fullscreen, never hiding
 * the familiar.
 */
import { useEffect, useRef } from 'react'
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
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    return () => {
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [])

  return (
    <section className={clinical ? 'panel clinical' : 'panel'} role="dialog" aria-modal="false" aria-label={title}>
      <header className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
        </div>
        <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Close panel" title="Close (Esc)">
          ✕
        </button>
      </header>
      {bannerText !== undefined ? <MockBanner text={bannerText} /> : null}
      <div className="panel-body">{children}</div>
    </section>
  )
}
