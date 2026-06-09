import { useI18n } from '../contexts/I18nContext'

interface Props {
  hasRect: boolean
  isProcessing: boolean
  onClear: () => void
  onStart: () => void
  onLoadImage: () => void
}

export default function ControlPanel({ hasRect, isProcessing, onClear, onStart, onLoadImage }: Props) {
  const { t } = useI18n()

  return (
    <div className="action-bar">
      <button onClick={onLoadImage} disabled={isProcessing} className="btn btn-ghost">
        {t('action.reSelect')}
      </button>

      <button onClick={onClear} disabled={!hasRect || isProcessing} className="btn btn-ghost">
        {t('action.clear')}
      </button>

      <span className="spacer" />

      <button
        onClick={onStart}
        disabled={!hasRect || isProcessing}
        className="btn btn-success"
        style={{ padding: '10px 28px', fontSize: 14 }}
      >
        {isProcessing ? t('action.processing') : t('action.start')}
      </button>
    </div>
  )
}
