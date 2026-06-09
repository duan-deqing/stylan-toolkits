import { ProcessProgress } from '../types'

interface Props {
  progress: ProcessProgress
}

export default function ProgressBar({ progress }: Props) {
  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0
  const isProcessing = progress.status === 'processing'
  const isDone = progress.status === 'done'
  const isError = progress.status === 'error'

  let fillClass = ''
  if (isDone) fillClass = 'done'
  else if (isError) fillClass = 'error'
  else if (isProcessing && pct === 0) fillClass = 'indeterminate'

  return (
    <div className="progress-section">
      <div className="progress-track">
        <div
          className={`progress-fill ${fillClass}`}
          style={{ width: `${isProcessing && pct === 0 ? 30 : pct}%` }}
        />
      </div>
      <span className={`status-text ${progress.status}`}>
        {progress.message}
        {isProcessing && progress.total > 0 && ` (${pct}%)`}
      </span>
    </div>
  )
}
