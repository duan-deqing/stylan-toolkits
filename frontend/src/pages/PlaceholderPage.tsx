interface Props {
  title: string
  description: string
}

export default function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="main-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16, opacity: 0.5 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#64748b', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13 }}>{description}</div>
      </div>
    </div>
  )
}
