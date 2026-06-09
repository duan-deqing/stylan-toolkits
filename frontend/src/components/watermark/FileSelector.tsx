interface Props {
  label: string
  value: string
  onSelect: (path: string) => void
  placeholder?: string
}

export default function FileSelector({ label, value, onSelect, placeholder }: Props) {
  const handleClick = async () => {
    if (!window.electronAPI) return
    const file = await window.electronAPI.selectFile()
    if (file) onSelect(file)
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
        <button onClick={handleClick} className="btn-folder" title={label}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  )
}
