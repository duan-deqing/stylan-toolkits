import { useI18n } from '../contexts/I18nContext'

export default function HomePage() {
  const { t } = useI18n()
  return (
    <div className="main-scroll home-page">
      <div className="home-hero">
        <div className="home-hero-icon">
          <img src="/favicon.ico" alt="STYLAN's toolkits" />
        </div>
        <h1 className="home-hero-title">STYLAN's toolkits</h1>
        <p className="home-hero-desc">{t('home.desc')}</p>
      </div>
      <div className="home-cards">
        <div className="home-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <h3>{t('nav.batch')}</h3>
          <p>{t('home.card.batch')}</p>
        </div>
        <div className="home-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <h3>{t('nav.single')}</h3>
          <p>{t('home.card.single')}</p>
        </div>
        <div className="home-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <h3>{t('nav.video')}</h3>
          <p>{t('home.card.video')}</p>
        </div>
      </div>
    </div>
  )
}
