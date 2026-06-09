import FolderSelector from "./FolderSelector"
import { useI18n } from "../contexts/I18nContext"

interface Props {
  inputDir: string
  outputDir: string
  onInputChange: (v: string) => void
  onOutputChange: (v: string) => void
}

export default function FoldersCard({ inputDir, outputDir, onInputChange, onOutputChange }: Props) {
  const { t } = useI18n()

  return (
    <div className="card folders-card">
      <div className="card-header">
        <span>{t("folder.title")}</span>
        <span className="card-hint">{t("folder.hint")}</span>
      </div>
      <div className="card-body">
        <div className="card-inset card-inset-lg">
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
        </div>
      </div>
    </div>
  )
}
