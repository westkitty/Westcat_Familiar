/** Global honesty banner for inspection panels (mock inventory rule). */

export function MockBanner({
  text = 'This panel runs on transparent mock data. Rows tiered `verified` are live; everything else is labeled fake.'
}: {
  text?: string
}): JSX.Element {
  return (
    <div className="mock-banner" role="note">
      <span className="mock-banner-mark">⚠ mock</span>
      <span>{text}</span>
    </div>
  )
}
