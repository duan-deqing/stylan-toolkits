import { useCallback, useEffect, useRef } from "react";
import type { TranslationKey } from "../../contexts/I18nContext";

export type PageId = "home" | "batch" | "settings";

const MAIN_ITEMS: { id: PageId; labelKey: TranslationKey }[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "batch", labelKey: "nav.batch" },
];

const MIN_WIDTH = 160;
const MAX_WIDTH = 320;
const COLLAPSED_WIDTH = 52;

interface Props {
  active: PageId;
  onChange: (id: PageId) => void;
  collapsed: boolean;
  width: number;
  onWidthChange: (w: number) => void;
  onToggleCollapse: () => void;
  t: (key: TranslationKey) => string;
}

export default function Sidebar({
  active,
  onChange,
  collapsed,
  width,
  onWidthChange,
  onToggleCollapse,
  t,
}: Props) {
  const resizing = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      resizing.current = true;
      startX.current = e.clientX;
      startW.current = width;
      document.body.style.cursor = "col-resize";
    },
    [width],
  );

  useEffect(() => {
    if (collapsed) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing.current) return;
      const delta = e.clientX - startX.current;
      const w = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startW.current + delta),
      );
      onWidthChange(w);
    };
    const handleMouseUp = () => {
      if (!resizing.current) return;
      resizing.current = false;
      document.body.style.cursor = "";
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [collapsed, onWidthChange]);

  const asideClass = [
    "sidebar",
    collapsed ? " collapsed" : "",
    resizing.current ? " resizing" : "",
  ].join("");

  return (
    <aside
      className={asideClass}
      style={{ width: collapsed ? COLLAPSED_WIDTH : width }}
    >
      <div className="sidebar-brand">
        <div
          className="sidebar-brand-left"
          onClick={onToggleCollapse}
          style={{ cursor: "pointer" }}
        >
          <div className="sidebar-brand-icon">
            <img
              src="favicon.ico"
              alt="STYLAN's toolkits"
              className="sidebar-brand-icon-img"
            />
          </div>
          <span className="sidebar-brand-text">{t("brand")}</span>
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {collapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {MAIN_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item${active === item.id ? " active" : ""}`}
            onClick={() => onChange(item.id)}
            title={collapsed ? t(item.labelKey) : undefined}
          >
            {item.id === "home" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            )}
            {item.id === "batch" && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="4" width="14" height="14" rx="2" opacity=".35" />
                <rect x="4" y="6" width="14" height="14" rx="2" />
                <circle cx="9" cy="11" r="1.3" />
                <polyline points="18 17 14 12 7 18" />
              </svg>
            )}
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className={`sidebar-nav-item${active === "settings" ? " active" : ""}`}
          onClick={() => onChange("settings")}
          title={collapsed ? t("nav.settings") : undefined}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>{t("nav.settings")}</span>
        </button>
      </div>
      <div
        className={`sidebar-resize-handle${resizing.current ? " active" : ""}`}
        onMouseDown={handleMouseDown}
      />
    </aside>
  );
}
