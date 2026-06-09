import { useRef, useEffect, useCallback, useState } from "react";
import { Rect } from "../../types";
import { useI18n } from "../../contexts/I18nContext";

interface Props {
  imageData: string | null;
  rects: Rect[];
  onRectsChange: (r: Rect[]) => void;
  fileName: string;
  onLoadImage: () => void;
}

export default function ImageCanvas({
  imageData,
  rects,
  onRectsChange,
  fileName,
  onLoadImage,
}: Props) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dimsRef = useRef({
    naturalW: 0,
    naturalH: 0,
    displayW: 0,
    displayH: 0,
  });
  const [dims, setDims] = useState({
    naturalW: 0,
    naturalH: 0,
    displayW: 0,
    displayH: 0,
  });
  const drawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentRect = useRef<Rect | null>(null);
  const drawRef = useRef<() => void>(() => {});
  const scaleRef = useRef({ x: 1, y: 1 });

  dimsRef.current = dims;
  scaleRef.current = {
    x: dimsRef.current.naturalW / dimsRef.current.displayW || 1,
    y: dimsRef.current.naturalH / dimsRef.current.displayH || 1,
  };

  const fitImage = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const pr = parent.getBoundingClientRect();
    const cw = Math.round(pr.width);
    const ch = Math.round(pr.height);
    if (cw <= 0 || ch <= 0) return;
    const scale = ch / img.naturalHeight;
    const dw = Math.round(img.naturalWidth * scale);
    const dh = Math.round(img.naturalHeight * scale);
    if (canvas.width === dw && canvas.height === dh) return;
    canvas.width = dw;
    canvas.height = dh;
    const newDims = {
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
      displayW: dw,
      displayH: dh,
    };
    dimsRef.current = newDims;
    setDims(newDims);
    drawRef.current();
  }, []);

  const drawRect = useCallback(
    (ctx: CanvasRenderingContext2D, r: Rect, index?: number) => {
      const s = scaleRef.current;
      const rx = r.x / s.x;
      const ry = r.y / s.y;
      const rw = r.w / s.x;
      const rh = r.h / s.y;

      ctx.fillStyle = "rgba(99, 102, 241, 0.08)";
      ctx.fillRect(rx, ry, rw, rh);

      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(rx + 4, ry + 4, rw - 8, rh - 8);

      const label =
        index !== undefined
          ? `#${index + 1} ${r.w}\u00d7${r.h}`
          : `${r.w}\u00d7${r.h}`;
      ctx.font = "11px -apple-system, sans-serif";
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = "#6366f1";
      ctx.fillRect(rx, ry - 20, tw + 10, 20);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, rx + 5, ry - 6);
    },
    [],
  );  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imgRef.current) {
      const d = dimsRef.current;
      ctx.drawImage(imgRef.current, 0, 0, d.displayW, d.displayH);

      rects.forEach((r, i) => drawRect(ctx, r, i));

      if (currentRect.current) {
        drawRect(ctx, currentRect.current);
      }
    }
  }, [rects, drawRect]);

  drawRef.current = draw;

  useEffect(() => {
    if (!imageData) {
      imgRef.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      fitImage();
    };
    img.src = imageData;
  }, [imageData, fitImage]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => {
      if (imgRef.current) fitImage();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [fitImage]);

  const getNaturalPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const br = canvas.getBoundingClientRect();
    const mx = (clientX - br.left) * (canvas.width / br.width);
    const my = (clientY - br.top) * (canvas.height / br.height);
    return {
      x: Math.round(mx * scaleRef.current.x),
      y: Math.round(my * scaleRef.current.y),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    drawing.current = true;
    currentRect.current = null;
    drawRef.current();
    const pos = getNaturalPos(e.clientX, e.clientY);
    startPos.current = pos;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const pos = getNaturalPos(e.clientX, e.clientY);
    const x = Math.min(startPos.current.x, pos.x);
    const y = Math.min(startPos.current.y, pos.y);
    const w = Math.abs(pos.x - startPos.current.x);
    const h = Math.abs(pos.y - startPos.current.y);
    if (w > 2 && h > 2) {
      currentRect.current = { x, y, w, h };
    } else {
      currentRect.current = null;
    }
    drawRef.current();
  };

  const handleMouseUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (currentRect.current) {
      onRectsChange([...rects, currentRect.current]);
      currentRect.current = null;
    }
  };

  const showEmpty = !imageData;

  return (
    <div className="card canvas-card">
      <div className="card-inset canvas-inset">
        {showEmpty ? (
          <div className="canvas-empty">
            <div className="card canvas-empty-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v12"></path>
                <path d="m17 8-5-5-5 5"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              </svg>
            </div>
            <div className="canvas-empty-text">{t("canvas.empty")}</div>
            <div className="canvas-empty-hint">{t("canvas.emptyHint")}</div>
            <button
              onClick={onLoadImage}
              className="btn btn-primary"
              style={{ marginTop: 12 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
              </svg>
              {t("canvas.selectImage")}
            </button>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="image-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: "crosshair" }}
          />
        )}
      </div>
      <div className="canvas-status-bar">
        <span>{fileName ? fileName.split(/[/\\]/).pop() : ""}</span>
      </div>
    </div>
  );
}
