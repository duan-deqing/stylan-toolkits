import { useState, useCallback } from 'react'
import FolderSelector from '../components/FolderSelector'
import ImageCanvas from '../components/ImageCanvas'
import ControlPanel from '../components/ControlPanel'
import ProgressBar from '../components/ProgressBar'
import { Rect, ProcessProgress } from '../types'
import { startProcessing, getProgress } from '../api'
import { useI18n } from '../contexts/I18nContext'

export default function BatchWatermarkPage() {
  const { t } = useI18n()
  const [inputDir, setInputDir] = useState('')
  const [outputDir, setOutputDir] = useState('')
  const [examplePath, setExamplePath] = useState('')
  const [imageData, setImageData] = useState<string | null>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [progress, setProgress] = useState<ProcessProgress>({
    current: 0,
    total: 0,
    status: 'idle',
    message: t('status.idle'),
  })

  const loadExampleImage = useCallback(async () => {
    if (!window.electronAPI) return
    const filePath = await window.electronAPI.selectFile()
    if (!filePath) return
    setExamplePath(filePath)
    setRect(null)
    setProgress({ current: 0, total: 0, status: 'idle', message: t('status.loading') })
    try {
      const dataUrl = await window.electronAPI.readImage(filePath)
      setImageData(dataUrl)
      setProgress({ current: 0, total: 0, status: 'idle', message: `${t('status.loaded')} ${filePath.split(/[/\\]/).pop()}` })
    } catch {
      setProgress({ current: 0, total: 0, status: 'error', message: t('status.loadFailed') })
    }
  }, [t])

  const handleStartBatch = useCallback(async () => {
    if (!inputDir || !outputDir || !rect) return

    setProgress({ current: 0, total: 0, status: 'processing', message: t('status.processing') })

    const pollProgress = setInterval(async () => {
      try {
        const p = await getProgress()
        setProgress(p)
        if (p.status === 'done' || p.status === 'error') {
          clearInterval(pollProgress)
        }
      } catch {
        // ignore
      }
    }, 300)

    try {
      await startProcessing(inputDir, outputDir, rect)
    } catch (e: unknown) {
      clearInterval(pollProgress)
      setProgress(prev => ({ ...prev, status: 'error', message: `${t('status.error')}: ${e instanceof Error ? e.message : ''}` }))
    }
  }, [inputDir, outputDir, rect, t])

  const hasRect = rect !== null
  const isProcessing = progress.status === 'processing'

  return (
    <div className="batch-page">
      <div className="card folders-card">
        <div className="card-header">
          <span>{t('folder.title')}</span>
          <span className="card-hint">{t('folder.hint')}</span>
        </div>
        <div className="card-body">
          <div className="folder-grid">
            <FolderSelector label={t('folder.input')} value={inputDir} onSelect={setInputDir} placeholder={t('folder.placeholder')} />
            <FolderSelector label={t('folder.output')} value={outputDir} onSelect={setOutputDir} placeholder={t('folder.placeholder')} />
          </div>
        </div>
      </div>

      <ImageCanvas
        imageData={imageData}
        rect={rect}
        onRectChange={setRect}
        fileName={examplePath}
        onLoadImage={loadExampleImage}
      />

      <div className="card action-card">
        <div className="card-header">
          <span>{t('action.title')}</span>
          <span className="card-hint">{isProcessing ? t('action.hintProcessing') : t('action.hint')}</span>
        </div>
        <ControlPanel
          hasRect={hasRect}
          isProcessing={isProcessing}
          onClear={() => { setRect(null); setImageData(null); setExamplePath('') }}
          onStart={handleStartBatch}
          onLoadImage={loadExampleImage}
        />
        <div style={{ padding: '0 20px 16px' }}>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  )
}
