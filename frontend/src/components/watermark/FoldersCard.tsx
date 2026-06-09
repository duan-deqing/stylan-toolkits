import FolderSelector from "./FolderSelector";
import FileSelector from "./FileSelector";
import { useI18n } from "../../contexts/I18nContext";
import { ProcessMode } from "./OperationPanel";

interface Props {
  mode: ProcessMode;
  inputDir: string;
  outputDir: string;
  imagePath: string;
  onInputChange: (v: string) => void;
  onOutputChange: (v: string) => void;
  onSelectImage: (path: string) => void;
}

export default function FoldersCard({
  mode,
  inputDir,
  outputDir,
  imagePath,
  onInputChange,
  onOutputChange,
  onSelectImage,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="card folders-card">
      <div className="card-body">
        <div className="card-inset card-inset-lg">
          {mode === "batch" ? (
            <div className="folder-grid">
              <FolderSelector
                label={t("folder.input")}
                value={inputDir}
                onSelect={onInputChange}
                placeholder={t("folder.placeholder")}
              />
              <FolderSelector
                label={t("folder.output")}
                value={outputDir}
                onSelect={onOutputChange}
                placeholder={t("folder.placeholder")}
              />
            </div>
          ) : (
            <div className="folder-grid">
              <FileSelector
                label={t("action.selectImage")}
                value={imagePath}
                onSelect={onSelectImage}
                placeholder={t("file.placeholder")}
              />
              <FolderSelector
                label={t("folder.output")}
                value={outputDir}
                onSelect={onOutputChange}
                placeholder={t("folder.placeholder")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
