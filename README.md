# STYLAN's toolkits

基于 React + Vite + Electron + FastAPI 的桌面工具集应用。

## 功能

- **批量去水印**：选择图片目录，标记水印区域，批量移除
- **单张处理**（开发中）：精确控制单张图片的水印去除
- **视频去水印**（开发中）：去除视频中的水印

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite |
| 桌面壳 | Electron（无边框窗口） |
| 后端 | Python FastAPI + OpenCV |
| 测试 | Vitest + Testing Library |

## 项目结构

```txt
stylan-toolkits/
├── frontend/                  # 前端 (React + Electron)
│   ├── electron/
│   │   ├── main.ts            # Electron 主进程
│   │   └── preload.ts         # 上下文桥接
│   ├── src/
│   │   ├── components/        # UI 组件
│   │   │   ├── Sidebar.tsx    # 可折叠侧边栏
│   │   │   ├── TitleBar.tsx   # 自定义标题栏
│   │   │   ├── ImageCanvas.tsx# 图片画布 + 选区
│   │   │   ├── FolderSelector.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx# 主题（亮/暗/系统）
│   │   │   └── I18nContext.tsx # 国际化（中/英）
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── BatchWatermarkPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── PlaceholderPage.tsx
│   │   ├── test/              # 测试文件
│   │   ├── api.ts             # 后端 API 调用
│   │   ├── types.ts           # 类型定义
│   │   └── App.tsx            # 根组件
│   ├── public/favicon.ico     # 应用图标
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/                   # 后端 (Python FastAPI)
│   ├── run.py                 # 启动入口
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # 应用配置
│   │   ├── main.py            # FastAPI 应用工厂
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py     # Pydantic 请求/响应模型
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── inpaint.py     # API 路由
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── processor.py   # OpenCV 图像处理核心
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── progress.py    # 线程安全进度跟踪
│   └── requirements.txt
├── .gitignore
└── README.md
```

## 开发

### 环境要求

- Node.js >= 18
- Python >= 3.10
- npm 或 yarn

### 安装

```ash

# 前端依赖

cd frontend && npm install

# 后端依赖

cd backend && pip install -r requirements.txt
```

### 启动

```ash
cd frontend && npm run dev
```

Electron 主进程会自动启动 Python 后端（端口 8766），窗口就绪前会等待后端健康检查通过。

### 测试

```ash
cd frontend && npm run test
```

## 构建

```ash
cd frontend && npm run electron:build
```

构建产物输出到 rontend/release/。

## 配置

- **主题**：亮色 / 暗色 / 跟随系统（设置页切换）
- **语言**：简体中文 / English（设置页切换）
- **侧边栏**：可折叠、可拖拽调整宽度（160-320px），宽度自动保存

## 开源协议

MIT
