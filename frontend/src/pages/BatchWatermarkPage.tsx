import { useState, useCallback } from "react";
import FoldersCard from "../components/FoldersCard";
import OperationPanel from "../components/OperationPanel";
import ImageCanvas from "../components/ImageCanvas";
import ProgressBar from "../components/ProgressBar";
import { Rect, ProcessProgress } from "../types";
import { startProcessing, getProgress } from "../api";
import { useI18n } from "../contexts/I18nContext";

export default function BatchWatermarkPage() {
  const { t } = useI18n();
  const [inputDir, setInputDir] = useState("");
  const [outputDir, setOutputDir] = useState("");
  const [examplePath, setExamplePath] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [progress, setProgress] = useState<ProcessProgress>({
    current: 0,
    total: 0,
    status: "idle",
    message: t("status.idle"),
  });

  const loadExampleImage = useCallback(async () => {
    if (!window.electronAPI) return;
    const filePath = await window.electronAPI.selectFile();
    if (!filePath) return;
    setExamplePath(filePath);
    setRects([]);
    setProgress({
      current: 0,
      total: 0,
      status: "idle",
      message: t("status.loading"),
    });
    try {
      const dataUrl = await window.electronAPI.readImage(filePath);
      setImageData(dataUrl);
      setProgress({
        current: 0,
        total: 0,
        status: "idle",
        message: `${t("status.loaded")} ${filePath.split(/[/\\]/).pop()}`,
      });
    } catch {
      setProgress({
        current: 0,
        total: 0,
        status: "error",
        message: t("status.loadFailed"),
      });
    }
  }, [t]);

  const handleStartBatch = useCallback(async () => {
    if (!inputDir || !outputDir || rects.length === 0) return;

    setProgress({
      current: 0,
      total: 0,
      status: "processing",
      message: t("status.processing"),
    });

    const pollProgress = setInterval(async () => {
      try {
        const p = await getProgress();
        setProgress(p);
        if (p.status === "done" || p.status === "error") {
          clearInterval(pollProgress);
        }
      } catch {
        // ignore
      }
    }, 300);

    try {
      await startProcessing(inputDir, outputDir, rects);
    } catch (e: unknown) {
      clearInterval(pollProgress);
      setProgress((prev) => ({
        ...prev,
        status: "error",
        message: `${t("status.error")}: ${e instanceof Error ? e.message : ""}`,
      }));
    }
  }, [inputDir, outputDir, rects, t]);

  const handleRemoveRect = useCallback((index: number) => {
    setRects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setRects([]);
    setImageData(null);
    setExamplePath("");
  }, []);

  const isProcessing = progress.status === "processing";

  return (
    <div className="batch-page">
      <FoldersCard
        inputDir={inputDir}
        outputDir={outputDir}
        onInputChange={setInputDir}
        onOutputChange={setOutputDir}
      />

      <div className="batch-main">
        <OperationPanel
          rects={rects}
          isProcessing={isProcessing}
          onLoadImage={loadExampleImage}
          onClear={handleClear}
          onRemoveRect={handleRemoveRect}
          onStart={handleStartBatch}
        />
        <ImageCanvas
          imageData={imageData}
          rects={rects}
          onRectsChange={setRects}
          fileName={examplePath}
          onLoadImage={loadExampleImage}
        />
      </div>

      <div className="progress-footer">
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
