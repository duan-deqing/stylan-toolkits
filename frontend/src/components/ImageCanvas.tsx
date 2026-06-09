import { useRef, useEffect, useCallback, useState } from 'react'
import { Rect } from '../types'
import { useI18n } from '../contexts/I18nContext'

interface Props {
  imageData: string | null
  rect: Rect | null
  onRectChange: (r: Rect | null) => void
  fileName: string
  onLoadImage: () => void
}

export default function ImageCanvas({ imageData, rect, onRectChange, fileName, onLoadImage }: Props) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [dims, setDims] = useState({ naturalW: 0, naturalH: 0, displayW: 0, displayH: 0, offsetX: 0, offsetY: 0 })
  const drawing = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  const scaleX = dims.naturalW / dims.displayW || 1
  const scaleY = dims.naturalH / dims.displayH || 1

  const fitImage = useCallback(() => {
    const img = imgRef.current
    const container = containerRef.current
    if (!img || !container) return
    const cw = container.clientWidth
    const ch = container.clientHeight
    if (cw <= 0 || ch <= 0) return
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight, 1)
    const dw = Math.round(img.naturalWidth * scale)
    const dh = Math.round(img.naturalHeight * scale)
    const ox = Math.round((cw - dw) / 2)
    const oy = Math.round((ch - dh) / 2)
    setDims({ naturalW: img.naturalWidth, naturalH: img.naturalHeight, displayW: dw, displayH: dh, offsetX: ox, offsetY: oy })
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (imgRef.current) {
      ctx.drawImage(imgRef.current, dims.offsetX, dims.offsetY, dims.displayW, dims.displayH)

      if (rect) {
        const rx = rect.x / scaleX + dims.offsetX
        const ry = rect.y / scaleY + dims.offsetY
        const rw = rect.w / scaleX
        const rh = rect.h / scaleY

        ctx.fillStyle = 'rgba(99, 102, 241, 0.08)'
        ctx.fillRect(rx, ry, rw, rh)

        ctx.strokeStyle = '#6366f1'
        ctx.lineWidth = 2.5
        ctx.setLineDash([])
        ctx.strokeRect(rx, ry, rw, rh)

        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.strokeRect(rx + 4, ry + 4, rw - 8, rh - 8)

        const label = `${rect.w}\u00d7${rect.h}`
        ctx.font = '11px -apple-system, sans-serif'
        const tw = ctx.measureText(label).width
        ctx.fillStyle = '#6366f1'
        ctx.fillRect(rx, ry - 20, tw + 10, 20)
        ctx.fillStyle = '#fff'
        ctx.fillText(label, rx + 5, ry - 6)
      }
    }
  }, [rect, dims, scaleX, scaleY])

  useEffect(() => {
    if (!imageData) {
      imgRef.current = null
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      fitImage()
    }
    img.src = imageData
  }, [imageData, fitImage])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(() => {
      if (imgRef.current) fitImage()
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [fitImage])

  const getNaturalPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const br = canvas.getBoundingClientRect()
    const mx = clientX - br.left - dims.offsetX
    const my = clientY - br.top - dims.offsetY
    return {
      x: Math.round(mx * scaleX),
      y: Math.round(my * scaleY),
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current) return
    drawing.current = true
    const pos = getNaturalPos(e.clientX, e.clientY)
    startPos.current = pos
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing.current) return
    const pos = getNaturalPos(e.clientX, e.clientY)
    const x = Math.min(startPos.current.x, pos.x)
    const y = Math.min(startPos.current.y, pos.y)
    const w = Math.abs(pos.x - startPos.current.x)
    const h = Math.abs(pos.y - startPos.current.y)
    if (w > 0 && h > 0) {
      onRectChange({ x, y, w, h })
    }
  }

  const handleMouseUp = () => {
    drawing.current = false
  }

  const showEmpty = !imageData

  return (
    <div className="card canvas-card">
      <div className="card-header">
        <span>{t('canvas.title')}</span>
        <span className="card-hint">{t('canvas.hint')}</span>
      </div>
      <div className="canvas-container" ref={containerRef}>
        {showEmpty ? (
          <div className="canvas-empty">
            <div className="canvas-empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div className="canvas-empty-text">{t('canvas.empty')}</div>
            <div className="canvas-empty-hint">{t('canvas.emptyHint')}</div>
            <button onClick={onLoadImage} className="btn btn-primary" style={{ marginTop: 4 }}>
              {t('canvas.title')}
            </button>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={dims.displayW || 800}
            height={dims.displayH || 450}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="image-canvas"
            style={{ cursor: 'crosshair' }}
          />
        )}
      </div>
      <div className="canvas-status-bar">
        <span>{fileName ? fileName.split(/[/\\]/).pop() : ''}</span>
        {rect ? (
          <span className="rect-badge">
            {t('canvas.selection')} ({rect.x}, {rect.y}) — {rect.w} x {rect.h}
          </span>
        ) : (
          <span style={{ color: '#94a3b8' }}>{t('canvas.noSelection')}</span>
        )}
      </div>
    </div>
  )
}
