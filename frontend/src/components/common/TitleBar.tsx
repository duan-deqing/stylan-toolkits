import { useEffect, useState } from 'react'
import { useI18n } from '../../contexts/I18nContext'
import { PageId } from './Sidebar'

export default function TitleBar({ page }: { page: PageId }) {
  const [maximized, setMaximized] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    if (!window.electronAPI) return
    window.electronAPI.isMaximized().then(setMaximized)
    window.electronAPI.onMaximizedChanged(setMaximized)
  }, [])

  useEffect(() => {
    const app = document.querySelector('.app')
    if (app) {
      app.classList.toggle('maximized', maximized)
    }
  }, [maximized])

  const handleMinimize = () => window.electronAPI?.minimize()
  const handleMaximize = () => window.electronAPI?.maximize()
  const handleClose = () => window.electronAPI?.close()

  return (
    <div className="title-bar">
      <div className="title-bar-drag">
        <span className="title-bar-icon">
          <img src="/favicon.ico" alt="STYLAN's toolkits" className="title-bar-icon-img" />
        </span>
        <span className="title-bar-text">{t(`nav.${page}`)}</span>
      </div>
      <div className="title-bar-controls">
        <button className="tb-btn tb-minimize" onClick={handleMinimize} title="最小化">
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="5" width="8" height="1" fill="currentColor"/></svg>
        </button>
        <button className="tb-btn tb-maximize" onClick={handleMaximize} title={maximized ? '还原' : '最大化'}>
          {maximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="2.5" y="0.5" width="7" height="7" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
              <rect x="0.5" y="2.5" width="7" height="7" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="1" y="1" width="8" height="8" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          )}
        </button>
        <button className="tb-btn tb-close" onClick={handleClose} title="关闭">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
