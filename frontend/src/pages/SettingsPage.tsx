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
                {locale === opt.value && <span className="setting-check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
