import { useState } from 'react'

interface Props {
  label: string
  value: string
  onSelect: (path: string) => void
  placeholder?: string
}

export default function FolderSelector({ label, value, onSelect, placeholder }: Props) {
  const [busy, setBusy] = useState(false)

  const handleClick = async () => {
    if (!window.electronAPI) return
    setBusy(true)
    try {
      const dir = await window.electronAPI.selectDirectory()
      if (dir) onSelect(dir)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="folder-row">
      <label>{label}</label>
      <div className="folder-input-wrap">
        <input
          type="text"
          value={value}
          readOnly
          placeholder={placeholder}
          className={`folder-input${value ? ' has-value' : ''}`}
        />
        <button onClick={handleClick} disabled={busy} className="btn-folder" title={label}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
