import { useTheme, ThemeMode } from '../contexts/ThemeContext'
import { useI18n, Locale } from '../contexts/I18nContext'

const THEME_OPTIONS: { value: ThemeMode; labelKey: string }[] = [
  { value: 'light', labelKey: 'settings.theme.light' },
  { value: 'dark', labelKey: 'settings.theme.dark' },
  { value: 'system', labelKey: 'settings.theme.system' },
]

const LANG_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
]

export default function SettingsPage() {
  const { mode, setMode } = useTheme()
  const { t, locale, setLocale } = useI18n()

  return (
    <div className="main-scroll">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span>{t('settings.theme')}</span>
        </div>
        <div className="card-body">
          <div className="setting-options">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`setting-option${mode === opt.value ? ' active' : ''}`}
                onClick={() => setMode(opt.value)}
              >
                {opt.value === 'light' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                )}
                {opt.value === 'dark' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
                {opt.value === 'system' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                )}
                <span>{t(opt.labelKey)}</span>
                {mode === opt.value && <span className="setting-check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span>{t('settings.language')}</span>
        </div>
        <div className="card-body">
          <div className="setting-options">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`setting-option${locale === opt.value ? ' active' : ''}`}
                onClick={() => setLocale(opt.value)}
              >
                <span>{opt.label}</span>
                {locale === opt.value && <span className="setting-check">?</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span>{t('about.title')}</span>
        </div>
        <div className="card-body">
          <div className="about-info">
            <div className="about-row">
              <span className="about-label">{t('about.version')}</span>
              <span className="about-value">1.0.0</span>
            </div>
            <div className="about-row">
              <span className="about-label">{t('about.repository')}</span>
              <span className="about-link" onClick={() => window.electronAPI?.openExternal('https://github.com/duan-deqing/stylan-toolkits')} role="button" tabIndex={0}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                duan-deqing/stylan-toolkits
              </span>
            </div>
            <div className="about-divider" />
            <div className="about-row">
              <span className="about-label">{t('about.tech')}</span>
            </div>
            <div className="about-tech-list">
              <div className="about-tech-item">
                <span className="about-tech-dot" style={{ background: '#6366f1' }} />
                <span>{t('about.tech.frontend')}</span>
              </div>
              <div className="about-tech-item">
                <span className="about-tech-dot" style={{ background: '#22c55e' }} />
                <span>{t('about.tech.backend')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
