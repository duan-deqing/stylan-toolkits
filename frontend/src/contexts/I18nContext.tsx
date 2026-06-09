import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type Locale = "zh-CN" | "en-US";

export type TranslationKey =
  | "brand"
  | "nav.home"
  | "nav.batch"
  | "nav.settings"
  | "home.desc"
  | "home.card.batch"
  | "home.card.batch.title"
  | "home.card.template"
  | "home.card.template.title"
  | "tag.batch"
  | "tag.single"
  | "tag.inpaint"
  | "tag.coming"
  | "tag.preview"
  | "folder.input"
  | "folder.output"
  | "folder.placeholder"
  | "file.placeholder"
  | "canvas.empty"
  | "canvas.emptyHint"
  | "canvas.noSelection"
  | "canvas.selection"
  | "canvas.selectImage"
  | "action.title"
  | "action.reSelect"
  | "action.start"
  | "action.processing"
  | "action.startSingle"
  | "action.selectImage"
  | "mode.batch"
  | "mode.single"
  | "status.idle"
  | "status.loading"
  | "status.loaded"
  | "status.loadFailed"
  | "status.processing"
  | "status.error"
  | "status.saved"
  | "settings.title"
  | "settings.theme"
  | "settings.theme.light"
  | "settings.theme.dark"
  | "settings.theme.system"
  | "settings.language"
  | "about.title"
  | "about.version"
  | "about.repository"
  | "about.tech"
  | "about.tech.frontend"
  | "about.tech.backend";

const zhCN: Record<TranslationKey, string> = {
  brand: "STYLAN's toolkits",
  "nav.home": "首页",
  "nav.batch": "图片去水印",
  "nav.settings": "设置",

  "home.desc": "从侧边栏选择工具开始使用",
  "home.card.batch": "标记水印位置，一键智能去除",
  "home.card.batch.title": "图片去水印",
  "home.card.template": "更多实用工具即将上线",
  "home.card.template.title": "更多工具",
  "tag.batch": "批量处理",
  "tag.single": "单张处理",
  "tag.inpaint": "智能修复",
  "tag.coming": "即将上线",
  "tag.preview": "预告",

  "folder.input": "输入目录",
  "folder.output": "输出目录",
  "folder.placeholder": "点击右侧按钮选择文件夹",
  "file.placeholder": "点击右侧按钮选择文件",

  "canvas.empty": "上传文件",
  "canvas.emptyHint": "标记水印位置",
  "canvas.noSelection": "未选择区域",
  "canvas.selection": "选区",
  "canvas.selectImage": "点击上传图片",

  "action.title": "操作",
  "action.reSelect": "重新选择",
  "action.start": "开始批量处理",
  "action.processing": "处理中…",
  "action.startSingle": "开始处理",
  "action.selectImage": "选择图片",

  "mode.batch": "批量",
  "mode.single": "单张",

  "status.idle": "就绪",
  "status.loading": "正在加载图片…",
  "status.loaded": "已加载",
  "status.loadFailed": "加载图片失败",
  "status.processing": "正在处理…",
  "status.error": "处理出错",
  "status.saved": "已保存到",

  "settings.title": "设置",
  "settings.theme": "主题",
  "settings.theme.light": "浅色",
  "settings.theme.dark": "深色",
  "settings.theme.system": "系统默认",
  "settings.language": "语言",

  "about.title": "关于",
  "about.version": "版本",
  "about.repository": "开源仓库",
  "about.tech": "技术栈",
  "about.tech.frontend": "前端: React 19 + TypeScript + Vite + Electron",
  "about.tech.backend": "后端: Python FastAPI + OpenCV",
};

const enUS: Record<TranslationKey, string> = {
  brand: "STYLAN's toolkits",
  "nav.home": "Home",
  "nav.batch": "Image Watermark",
  "nav.settings": "Settings",

  "home.desc": "Select a tool from the sidebar to get started",
  "home.card.batch": "Mark watermark areas and remove them with one click",
  "home.card.batch.title": "Image Watermark Remover",
  "home.card.template": "More tools are on the way",
  "home.card.template.title": "More Tools",
  "tag.batch": "Batch",
  "tag.single": "Single",
  "tag.inpaint": "AI Inpaint",
  "tag.coming": "Coming Soon",
  "tag.preview": "Preview",

  "folder.input": "Input Directory",
  "folder.output": "Output Directory",
  "folder.placeholder": "Click the button to select folder…",
  "file.placeholder": "Click the button to select file…",

  "canvas.empty": "No sample image loaded",
  "canvas.emptyHint": "Click the button below to load and mark watermark",
  "canvas.noSelection": "No selection",
  "canvas.selection": "Selection",
  "canvas.selectImage": "Select Sample Image",

  "action.title": "Actions",
  "action.reSelect": "Re-select",
  "action.start": "Start Batch",
  "action.processing": "Processing…",
  "action.startSingle": "Process",
  "action.selectImage": "Select Image",

  "mode.batch": "Batch",
  "mode.single": "Single",

  "status.idle": "Ready",
  "status.loading": "Loading image…",
  "status.loaded": "Loaded",
  "status.loadFailed": "Failed to load image",
  "status.processing": "Processing…",
  "status.error": "Error",
  "status.saved": "Saved to",

  "settings.title": "Settings",
  "settings.theme": "Theme",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.theme.system": "System",
  "settings.language": "Language",

  "about.title": "About",
  "about.version": "Version",
  "about.repository": "Repository",
  "about.tech": "Tech Stack",
  "about.tech.frontend": "Frontend: React 19 + TypeScript + Vite + Electron",
  "about.tech.backend": "Backend: Python FastAPI + OpenCV",
};

const translations: Record<Locale, Record<TranslationKey, string>> = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "zh-CN",
  setLocale: () => {},
  t: () => "",
});

function loadLocale(): Locale {
  const saved = localStorage.getItem("locale");
  return saved === "zh-CN" || saved === "en-US" ? saved : "zh-CN";
}

function saveLocale(l: Locale) {
  localStorage.setItem("locale", l);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((l: Locale) => {
    saveLocale(l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? key,
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
