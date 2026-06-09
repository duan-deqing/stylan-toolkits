import { Rect } from "../types"
import { useI18n } from "../contexts/I18nContext"
import { UploadIcon, ReSelectIcon, TrashIcon, ImageIcon, PlayIcon, CloseIcon } from "./icons"

interface Props {
  rects: Rect[]
  isProcessing: boolean
  onLoadImage: () => void
  onClear: () => void
  onRemoveRect: (index: number) => void
  onStart: () => void
}

export default function OperationPanel({ rects, isProcessing, onLoadImage, onClear, onRemoveRect, onStart }: Props) {
  const { t } = useI18n()
  const hasRects = rects.length > 0

  return (
    <div className="card batch-side-card">
      <div className="batch-side">
        <div className="side-section">
          <div className="side-label">
            <UploadIcon />
            {t("action.title")}
          </div>
          <div className="card-inset side-controls">
            <div className="side-grid-2">
              <button onClick={onLoadImage} disabled={isProcessing} className="side-btn">
                <ReSelectIcon />
                <span>{t("action.reSelect")}</span>
              </button>
              <button onClick={onClear} disabled={!hasRects || isProcessing} className="side-btn">
                <TrashIcon />
                <span>{t("action.clear")}</span>
              </button>
            </div>
          </div>
        </div>

        {hasRects && (
          <div className="side-section">
            <div className="side-label">
              <ImageIcon />
              {t("canvas.selection")} ({rects.length})
            </div>
            <div className="card-inset side-rects">
              {rects.map((r, i) => (
                <div key={i} className="side-rect-item">
                  <span className="side-rect-tag">#{i + 1}</span>
                  <span className="side-rect-dims">{r.w}&times;{r.h}</span>
                  <span className="side-rect-pos">({r.x}, {r.y})</span>
                  <button className="side-rect-del" onClick={() => onRemoveRect(i)} title="Remove">
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="side-spacer" />

        <button onClick={onStart} disabled={!hasRects || isProcessing} className="side-btn-primary">
          {isProcessing ? (
            t("action.processing")
          ) : (
            <>
              <PlayIcon />
              {t("action.start")}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
