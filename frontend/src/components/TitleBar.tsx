import { useEffect, useState } from 'react'

export default function TitleBar() {
  const [maximized, setMaximized] = useState(false)

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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </span>
        <span className="title-bar-text">{`STYLAN's toolkits`}</span>
      </div>
      <div className="title-bar-controls">
        <button className="tb-btn tb-minimize" onClick={handleMinimize} title="最小化">
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="5" width="8" height="1" fill="currentColor"/></svg>
        </button>
        <button className="tb-btn tb-maximize" onClick={handleMaximize} title={maximized ? '还原' : '最大化'}>
          {maximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="2.5" y="0.5" width="7" height="7" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/>
              <rect x="0.5" y="2.5" width="7" height="7" rx="0.5" fill="#1e1e2e" stroke="currentColor" strokeWidth="1"/>
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
