import { useI18n, TranslationKey } from '../contexts/I18nContext'
import { useTheme } from '../contexts/ThemeContext'
import type { PageId } from '../components/common/Sidebar'

function tk(s: string): TranslationKey {
  return s as TranslationKey
}

const FEATURES: { key: string; icon: 'batch' | 'tools'; page?: PageId }[] = [
  { key: 'batch', icon: 'batch', page: 'batch' },
  { key: 'template', icon: 'tools' },
]

function FeatureIcon({ icon }: { icon: 'batch' | 'tools' }) {
  const { resolved } = useTheme()
  const accent = '#6366f1'
  if (icon === 'batch') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="3" width="14" height="14" rx="2" />
        <rect x="3" y="7" width="14" height="14" rx="2" fill={resolved === 'dark' ? '#1a2332' : '#fafbff'} />
        <circle cx="8.5" cy="11" r="1.3" />
        <polyline points="17 17 13 12 6 18" />
      </svg>
    )
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export default function HomePage({ onNavigate }: { onNavigate?: (page: PageId) => void }) {
  const { t } = useI18n()

  return (
    <div className="main-scroll home-page">
      <section className="home-hero">
        <div className="home-hero-icon">
          <img src="favicon.ico" alt="STYLAN's toolkits" />
        </div>
        <h1 className="home-hero-title">STYLAN's toolkits</h1>
        <p className="home-hero-desc">{t('home.desc')}</p>
      </section>

      <section className="home-features">
        <div className="home-features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.key}
              className="card home-feature-card"
              onClick={f.page ? () => onNavigate?.(f.page!) : undefined}
              role={f.page ? "button" : undefined}
              tabIndex={f.page ? 0 : undefined}
              onKeyDown={f.page ? (e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate?.(f.page!) } : undefined}
            >
              <div className="card-inset home-feature-icon">
                <FeatureIcon icon={f.icon} />
              </div>
              <h3 className="home-feature-title">{t(tk(`home.card.${f.key}.title`))}</h3>
              <p className="home-feature-desc">{t(tk(`home.card.${f.key}`))}</p>
              <div className="home-feature-tags">
                {f.key === 'batch' && (
                  <>
                    <span className="tag">{t(tk('tag.batch'))}</span>
                    <span className="tag">{t(tk('tag.single'))}</span>
                    <span className="tag">{t(tk('tag.inpaint'))}</span>
                  </>
                )}
                {f.key === 'template' && (
                  <>
                    <span className="tag">{t(tk('tag.coming'))}</span>
                    <span className="tag">{t(tk('tag.preview'))}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
