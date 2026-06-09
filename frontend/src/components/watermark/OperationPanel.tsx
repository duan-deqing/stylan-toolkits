import { Rect } from "../../types";
import { useI18n } from "../../contexts/I18nContext";
import {
  ReSelectIcon,
  PlayIcon,
  CloseIcon,
} from "./icons";

export type ProcessMode = "batch" | "single";

interface Props {
  rects: Rect[];
  isProcessing: boolean;
  mode: ProcessMode;
  onModeChange: (m: ProcessMode) => void;
  onLoadImage: () => void;
  onRemoveRect: (index: number) => void;
  onStart: () => void;
}

export default function OperationPanel({
  rects,
  isProcessing,
  mode,
  onModeChange,
  onLoadImage,
  onRemoveRect,
  onStart,
}: Props) {
  const { t } = useI18n();
  const hasRects = rects.length > 0;

  return (
    <div className="card batch-side-card">
      <div className="batch-side">
        <div className="side-section">
          <div className="side-label">{t("action.title")}</div>
          <div className="card-inset side-controls">
            <div className="side-mode-toggle">
              <button
                className={`side-mode-btn ${mode === "single" ? "active" : ""}`}
                onClick={() => onModeChange("single")}
                disabled={isProcessing}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{t("mode.single")}</span>
              </button>
              <button
                className={`side-mode-btn ${mode === "batch" ? "active" : ""}`}
                onClick={() => onModeChange("batch")}
                disabled={isProcessing}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="14" height="14" rx="2" opacity=".35" />
                  <rect x="4" y="6" width="14" height="14" rx="2" />
                  <circle cx="9" cy="11" r="1.3" />
                  <polyline points="18 17 14 12 7 18" />
                </svg>
                <span>{t("mode.batch")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="side-section">
          <div className="side-label">{t("canvas.selection")} ({rects.length})</div>
          {hasRects ? (
            <div className="card-inset side-rects">
              {rects.map((r, i) => (
                <div key={i} className="side-rect-item">
                  <span className="side-rect-tag">#{i + 1}</span>
                  <span className="side-rect-dims">
                    {r.w}&times;{r.h}
                  </span>
                  <span className="side-rect-pos">
                    ({r.x}, {r.y})
                  </span>
                  <button
                    className="side-rect-del"
                    onClick={() => onRemoveRect(i)}
                    title="Remove"
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-inset side-rects side-rects-empty">
              <div className="side-rects-empty-text">{t("canvas.noSelection")}</div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onLoadImage}
        disabled={isProcessing}
        className="side-btn-secondary"
      >
        <ReSelectIcon />
        <span>{t("action.reSelect")}</span>
      </button>

      <button
        onClick={onStart}
        disabled={!hasRects || isProcessing}
        className="side-btn-primary"
      >
        {isProcessing ? (
          t("action.processing")
        ) : (
          <>
            <PlayIcon />
            {mode === "batch" ? t("action.start") : t("action.startSingle")}
          </>
        )}
      </button>
    </div>
  );
}
