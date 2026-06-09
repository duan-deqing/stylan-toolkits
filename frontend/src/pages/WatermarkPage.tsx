import { useState, useCallback } from "react";
import FoldersCard from "../components/watermark/FoldersCard";
import OperationPanel, { ProcessMode } from "../components/watermark/OperationPanel";
import ImageCanvas from "../components/watermark/ImageCanvas";
import ProgressBar from "../components/watermark/ProgressBar";
import { Rect, ProcessProgress } from "../types";
import { startProcessing, processSingle, getProgress } from "../api";
import { useI18n } from "../contexts/I18nContext";

export default function WatermarkPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<ProcessMode>("batch");
  const [inputDir, setInputDir] = useState("");
  const [outputDir, setOutputDir] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [progress, setProgress] = useState<ProcessProgress>({
    current: 0,
    total: 0,
    status: "idle",
    message: t("status.idle"),
  });

  const loadImage = useCallback(async () => {
    if (!window.electronAPI) return;
    const filePath = await window.electronAPI.selectFile();
    if (!filePath) return;
    readAndSetImage(filePath);
  }, [t]);

  const handleFileSelect = useCallback((filePath: string) => {
    readAndSetImage(filePath);
  }, [t]);

  const readAndSetImage = useCallback(async (filePath: string) => {
    setImagePath(filePath);
    setRects([]);
    setProgress({
      current: 0,
      total: 0,
      status: "idle",
      message: t("status.loading"),
    });
    try {
      if (!window.electronAPI) return;
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

  const handleStart = useCallback(async () => {
    if (rects.length === 0) return;

    if (mode === "batch") {
      if (!inputDir || !outputDir) return;

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
    } else {
      if (!imagePath || !window.electronAPI) return;

      const fileName = imagePath.split(/[/\\]/).pop() || "output.png";
      const extIndex = fileName.lastIndexOf(".");
      const baseName = extIndex > 0 ? fileName.slice(0, extIndex) : fileName;
      const ext = extIndex > 0 ? fileName.slice(extIndex) : ".png";

      let outputPath: string;
      if (outputDir) {
        const sep = imagePath.includes("\\") ? "\\" : "/";
        outputPath = `${outputDir.replace(/\\+$/, "")}${sep}${baseName}_processed${ext}`;
      } else {
        const result = await window.electronAPI.saveFile(`${baseName}_processed${ext}`);
        if (!result) return;
        outputPath = result;
      }

      setProgress({
        current: 0,
        total: 1,
        status: "processing",
        message: t("status.processing"),
      });

      try {
        await processSingle(imagePath, outputPath, rects);
        setProgress({
          current: 1,
          total: 1,
          status: "done",
          message: `${t("status.saved")} ${outputPath.split(/[/\\]/).pop()}`,
        });
      } catch (e: unknown) {
        setProgress({
          current: 0,
          total: 1,
          status: "error",
          message: `${t("status.error")}: ${e instanceof Error ? e.message : ""}`,
        });
      }
    }
  }, [mode, inputDir, outputDir, imagePath, rects, t]);

  const handleRemoveRect = useCallback((index: number) => {
    setRects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleModeChange = useCallback((m: ProcessMode) => {
    setMode(m);
    setRects([]);
    setImageData(null);
    setImagePath("");
    setProgress({
      current: 0,
      total: 0,
      status: "idle",
      message: t("status.idle"),
    });
  }, [t]);

  const isProcessing = progress.status === "processing";

  return (
    <div className="batch-page">
      <FoldersCard
        mode={mode}
        inputDir={inputDir}
        outputDir={outputDir}
        imagePath={imagePath}
        onInputChange={setInputDir}
        onOutputChange={setOutputDir}
        onSelectImage={handleFileSelect}
      />

      <div className="batch-main">
        <OperationPanel
          rects={rects}
          isProcessing={isProcessing}
          mode={mode}
          onModeChange={handleModeChange}
          onLoadImage={loadImage}
          onRemoveRect={handleRemoveRect}
          onStart={handleStart}
        />
        <ImageCanvas
          imageData={imageData}
          rects={rects}
          onRectsChange={setRects}
          fileName={imagePath}
          onLoadImage={loadImage}
        />
      </div>

      <div className="progress-footer">
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
}
