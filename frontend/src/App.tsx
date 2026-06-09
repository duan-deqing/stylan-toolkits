import { useState } from 'react'
import TitleBar from './components/TitleBar'
import Sidebar, { PageId } from './components/Sidebar'
import HomePage from './pages/HomePage'
import BatchWatermarkPage from './pages/BatchWatermarkPage'
import SettingsPage from './pages/SettingsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { I18nProvider, useI18n } from './contexts/I18nContext'
import './App.css'

const DEFAULT_SIDEBAR_WIDTH = 200

function AppInner() {
  const [page, setPage] = useState<PageId>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebar-width')
    return saved ? Number(saved) : DEFAULT_SIDEBAR_WIDTH
  })
  const { t } = useI18n()

  const handleWidthChange = (w: number) => {
    setSidebarWidth(w)
    localStorage.setItem('sidebar-width', String(w))
  }

  return (
    <div className="app">
      <TitleBar />
      <div className="app-body">
        <Sidebar active={page} onChange={setPage} collapsed={sidebarCollapsed} width={sidebarWidth} onWidthChange={handleWidthChange} onToggleCollapse={() => setSidebarCollapsed(v => !v)} t={t} />
        <main className="main" key={page}>
          {page === 'home' && <HomePage />}
          {page === 'batch' && <BatchWatermarkPage />}
          {page === 'settings' && <SettingsPage />}
          {page === 'single' && <PlaceholderPage title={t('nav.single')} description={t('placeholder.desc')} />}
          {page === 'video' && <PlaceholderPage title={t('nav.video')} description={t('placeholder.desc')} />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppInner />
      </I18nProvider>
    </ThemeProvider>
  )
}
