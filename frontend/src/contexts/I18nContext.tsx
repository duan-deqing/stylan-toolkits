import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export type Locale = "zh-CN" | "en-US";

const ZH: Record<string, string> = {
  brand: "STYLAN's toolkits",
  "nav.home": "首页",
  "home.desc": "从侧边栏选择工具开始使用",
  "home.card.batch": "批量去除多张图片中的水印",
  "home.card.single": "精确控制单张图片的处理",
  "home.card.video": "去除视频中的水印",
  "nav.batch": "批量去水印",
  "nav.single": "单张处理",
  "nav.video": "视频去水印",
  "nav.settings": "设置",
  "folder.title": "文件夹设置",
  "folder.hint": "选择原始图片所在目录和输出目录",
  "folder.input": "输入目录",
  "folder.output": "输出目录",
  "folder.placeholder": "点击右侧按钮选择文件夹…",
  "canvas.title": "示例图片",
  "canvas.hint": "在图片上拖拽框选水印区域",
  "canvas.empty": "上传文件",
  "canvas.emptyHint": "标记水印位置",
  "canvas.noSelection": "未选择区域",
  "canvas.selection": "选区",
  "canvas.selectImage": "点击上传图片",
  "action.title": "操作",
  "action.hint": "确认设置后开始批量去除水印",
  "action.hintProcessing": "正在批量处理…",
  "action.reSelect": "重新选择",
  "action.clear": "清除选区",
  "action.start": "开始批量处理",
  "action.processing": "处理中…",
  "status.idle": "就绪",
  "status.loading": "正在加载图片…",
  "status.loaded": "已加载",
  "status.loadFailed": "加载图片失败",
  "status.processing": "正在处理…",
  "status.error": "处理出错",
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
  "placeholder.desc": "此功能正在开发中",
};

const EN: Record<string, string> = {
  brand: "STYLAN's toolkits",
  "nav.home": "Home",
  "home.desc": "Select a tool from the sidebar to get started",
  "home.card.batch": "Remove watermarks from multiple images at once",
  "home.card.single": "Process one image with precise control",
  "home.card.video": "Remove watermarks from videos",
  "nav.batch": "Batch Removal",
  "nav.single": "Single Image",
  "nav.video": "Video Watermark",
  "nav.settings": "Settings",
  "folder.title": "Folders",
  "folder.hint": "Select input and output directories",
  "folder.input": "Input Directory",
  "folder.output": "Output Directory",
  "folder.placeholder": "Click the button to select folder…",
  "canvas.title": "Sample Image",
  "canvas.hint": "Drag to select the watermark area",
  "canvas.empty": "No sample image loaded",
  "canvas.emptyHint": "Click the button below to load and mark watermark",
  "canvas.noSelection": "No selection",
  "canvas.selection": "Selection",
  "canvas.selectImage": "Select Sample Image",
  "action.title": "Actions",
  "action.hint": "Configure and start batch watermark removal",
  "action.hintProcessing": "Processing…",
  "action.reSelect": "Re-select",
  "action.clear": "Clear",
  "action.start": "Start Batch",
  "action.processing": "Processing…",
  "status.idle": "Ready",
  "status.loading": "Loading image…",
  "status.loaded": "Loaded",
  "status.loadFailed": "Failed to load image",
  "status.processing": "Processing…",
  "status.error": "Error",
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
  "placeholder.desc": "Coming soon",
};

const LOCALE_MAP: Record<Locale, Record<string, string>> = {
  "zh-CN": ZH,
  "en-US": EN,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "zh-CN",
  setLocale: () => {},
  t: (k: string) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return (saved as Locale) || "zh-CN";
  });

  const setLocale = useCallback((l: Locale) => {
    localStorage.setItem("locale", l);
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: string) => LOCALE_MAP[locale][key] ?? key,
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
