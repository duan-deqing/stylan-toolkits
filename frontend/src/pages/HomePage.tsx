import { useI18n, TranslationKey } from '../contexts/I18nContext'
import { useTheme } from '../contexts/ThemeContext'

function tk(s: string): TranslationKey {
  return s as TranslationKey
}

const FEATURES = [
  { key: 'batch', icon: 'batch' as const },
  { key: 'single', icon: 'singleImage' as const },
  { key: 'video', icon: 'video' as const },
]

function FeatureIcon({ icon }: { icon: 'batch' | 'singleImage' | 'video' }) {
  const { resolved } = useTheme()
  const accent = '#6366f1'
  if (icon === 'batch') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="3" width="14" height="14" rx="2" />
        <rect x="3" y="7" width="14" height="14" rx="2" fill={resolved === 'dark' ? '#1a2332' : '#fafbff'} />
      </svg>
    )
  }
  if (icon === 'singleImage') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  )
}

export default function HomePage() {
  const { t } = useI18n()

  return (
    <div className="main-scroll home-page">
      <section className="home-hero">
        <div className="home-hero-icon">
          <img src="/favicon.ico" alt="STYLAN's toolkits" />
        </div>
        <h1 className="home-hero-title">STYLAN's toolkits</h1>
        <p className="home-hero-desc">{t('home.desc')}</p>
      </section>

      <section className="home-features">
        <div className="home-features-grid">
          {FEATURES.map((f) => (
            <div key={f.key} className="card home-feature-card">
              <div className="card-inset home-feature-icon">
                <FeatureIcon icon={f.icon} />
              </div>
              <h3 className="home-feature-title">{t(tk(`home.card.${f.key}.title`))}</h3>
              <p className="home-feature-desc">{t(tk(`home.card.${f.key}`))}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
