# 构建与打包指南

## 项目结构概览

```txt
watermark_remover_gui/
├── frontend/                  # Electron + React 前端
│   ├── electron/
│   │   ├── main.ts            # Electron 主进程（窗口管理、后端启动）
│   │   └── preload.ts         # 上下文桥接（暴露 IPC API 到渲染进程）
│   ├── src/                   # React 源代码
│   │   ├── api.ts             # 后端 API 调用
│   │   ├── components/        # UI 组件
│   │   ├── contexts/          # React Context（主题、国际化）
│   │   ├── pages/             # 页面组件
│   │   ├── styles/            # CSS 样式
│   │   └── types.ts           # TypeScript 类型定义
│   ├── public/
│   │   ├── favicon.ico        # 应用图标（同时用作 exe 图标）
│   │   └── icon-512.png       # macOS 图标源文件（512×512 PNG）
│   ├── package.json           # 项目配置 + electron-builder 打包配置
│   ├── vite.config.ts         # Vite 构建配置
│   ├── tsconfig.json          # TypeScript 配置
│   └── index.html             # HTML 入口
├── backend/                   # Python FastAPI 后端
│   ├── app/                   # 应用代码
│   │   ├── config.py          # 配置管理
│   │   ├── main.py            # FastAPI 应用工厂
│   │   ├── models/schemas.py  # Pydantic 模型
│   │   ├── routers/inpaint.py # API 路由
│   │   ├── services/processor.py  # 图像处理服务
│   │   └── utils/progress.py  # 进度追踪
│   ├── run.py                 # 启动入口
│   └── requirements.txt       # Python 依赖
└── README.md
```

## 环境要求

| 依赖 | 版本 | 用途 |
|---|---|---|
| Node.js | >= 19 | 前端构建运行时 |
| npm | >= 9 | 包管理器 |
| Python | >= 3.10 | 后端运行时 |
| pip | 最新 | Python 包管理器 |

### 首次安装

```bash
# 1. 安装前端依赖
cd frontend
npm install

# 2. 安装后端依赖
cd ../backend
pip install -r requirements.txt
```

---

## 开发流程

### 启动开发模式

开发模式下，Vite 在 `localhost:5173` 提供热更新的前端页面，Electron 自动启动并加载该地址。

```bash
cd frontend
npm run electron:dev
```

Electron 主进程会自动：

1. 启动 Python 后端（端口 8766，`backend/run.py`）
2. 轮询 `http://127.0.0.1:8766/health` 等待后端就绪
3. 创建无边框窗口加载 `http://localhost:5173`

关闭窗口时自动终止后端进程。

### 仅启动前端（不启动 Electron）

```bash
cd frontend
npm run dev
```

浏览器访问 `http://localhost:5173`，但无法使用 Electron 原生的目录选择等 API。

### 启动后端（独立运行）

```bash
cd backend
python run.py
```

后端运行在 `http://127.0.0.1:8766`，提供以下 API：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| GET | `/progress` | 获取处理进度 |
| POST | `/inpaint` | 批量去水印（异步） |
| POST | `/inpaint-single` | 单张去水印（同步） |

### 运行测试

```bash
cd frontend
npm run test           # 单次运行
npm run test:watch     # 监听模式
```

---

## 构建打包

### 前置检查

构建前请确认：

```bash
cd frontend

# 1. TypeScript 类型检查通过
npx tsc --noEmit

# 2. 测试通过
npm run test
```

### 打包命令

```bash
cd frontend
npm run electron:build
```

该命令依次执行：

1. **`vite build`** — 编译 TypeScript，构建前端产物
   - `frontend/src/` — React 源码
   - `frontend/public/` — 静态资源（含 `favicon.ico`）
   - 输出到 `frontend/dist/`

2. **`electron-builder`** — 读取 `package.json` 中 `build` 字段配置，打包 Electron 应用
   - 打包 `dist/` + `dist-electron/` → `app.asar`
   - 将 `backend/` 整体复制到 `resources/backend/`
   - 嵌入 `win.icon` → exe 图标
   - 生成 Windows 安装包和便携版

### 构建产物

产物输出到 `frontend/release/`：

| 文件 | 大小（约） | 说明 |
|---|---|---|
| `STYLAN toolkits Setup 1.0.0.exe` | ~80 MB | NSIS 安装包（一键安装） |
| `STYLAN toolkits 1.0.0.exe` | ~79 MB | 便携版（免安装直接运行） |
| `win-unpacked/` | — | 未打包的应用目录（含 exe + 所有依赖） |

---

## 打包配置详解

`package.json` 中的 `build` 字段控制 electron-builder 行为：

```jsonc
"build": {
    // 应用唯一标识
    "appId": "com.stylan.toolkits",

    // 安装包显示名称
    "productName": "STYLAN toolkits",

    // 输出目录
    "directories": { "output": "release" },

    // 打入 asar 的文件
    "files": [
        "dist/**/*",           // Vite 构建产物（前端页面）
        "dist-electron/**/*"   // Electron 主进程/预加载脚本
    ],

    // 额外资源（不压缩进 asar），运行时通过 path 访问
    "extraResources": [
        { "from": "../backend", "to": "backend" }
    ],

    // Windows 平台配置
    "win": {
        "icon": "public/favicon.ico",  // exe 图标
        "target": [
            "nsis",      // NSIS 安装程序
            "portable"   // 单文件便携版
        ]
    },

    // macOS 平台配置（需在 Mac 上构建）
    "mac": {
        "icon": "public/icon-512.png",
        "category": "public.app-category.utilities",
        "target": ["dmg", "zip"]
    },

    // DMG 安装器标题
    "dmg": { "title": "STYLAN toolkits" }
}
```

### icon 文件说明

| 文件 | 用途 | 格式要求 |
|---|---|---|
| `public/favicon.ico` | Windows exe 图标、应用内 UI 图标 | `.ico`，含 256×256 帧 |
| `public/icon-512.png` | macOS 图标 | `.png`，≥ 512×512 |

在 `electron/main.ts` 中，BrowserWindow 图标路径：

```typescript
icon: path.join(__dirname, '..', 'dist', 'favicon.ico'),
```

组件内图片引用使用**相对路径**（因为通过 `file://` 协议加载）：

```tsx
<img src="favicon.ico" />   // ✅ 正确
<img src="/favicon.ico" />  // ❌ 生产环境解析到 C:\favicon.ico
```

---

## 发布到 GitHub Release

### 前提

1. 安装 [GitHub CLI](https://cli.github.com/) 并登录

   ```bash
   gh auth login
   ```

2. 确认 release 目录产物已构建

   ```bash
   ls frontend/release/*.exe
   ```

### 创建 Release

```bash
# 在仓库根目录执行
gh release create v1.0.0 \
  "frontend/release/STYLAN toolkits Setup 1.0.0.exe" \
  "frontend/release/STYLAN toolkits 1.0.0.exe" \
  --title "v1.0.0 - STYLAN's toolkits" \
  --notes "$(cat RELEASE_NOTES.md)"
```

### 更新已有 Release

```bash
# 修改 release 描述
gh release edit v1.0.0 --title "新的标题" --notes "新的说明"

# 追加文件
gh release upload v1.0.0 "frontend/release/新文件.exe"

# 删除文件
# 需先在 GitHub 网页手动删除，再重新上传
```

---

## 应用运行逻辑

### Electron 主进程启动流程

```txt
1. app.whenReady()
2.   ├─ startBackend()
3.   │   ├─ spawn("python run.py") → 后端启动
4.   │   └─ 轮询 /health → 等待就绪
5.   └─ createWindow()
6.       ├─ 加载 vite dev server（开发模式）
7.       │  或 loadFile("dist/index.html")（生产模式）
8.       └─ 显示窗口
9.
10. 关闭流程:
11.   app.on("before-quit") → stopBackend() → backendProcess.kill()
```

### 后端路径解析

生产模式中，后端通过 `extraResources` 被打包到 `resources/backend/`：

```typescript
function getBackendDir(): string {
  if (app.isPackaged) {
    // 生产: {app}/resources/backend
    return path.join(process.resourcesPath, 'backend')
  }
  // 开发: {项目根}/backend
  return path.join(__dirname, '..', '..', '..', 'backend')
}
```

---

## 常见问题

### 1. 应用图标不显示

确保：

- `public/favicon.ico` 存在且为有效 ICO 文件（含 256×256 帧）
- 组件内图片引用使用相对路径 `favicon.ico`，而非绝对路径 `/favicon.ico`
- `electron/main.ts` 中 BrowserWindow icon 指向 `dist/favicon.ico`

### 2. 后端无法启动

常见原因：

- Python 未安装或不在 PATH 中
- `backend/requirements.txt` 依赖未安装
- 端口 8766 被占用

```bash
# 检查后端依赖
cd backend && pip install -r requirements.txt

# 检查端口占用
netstat -ano | findstr 8766

# 手动测试后端
cd backend && python run.py
```

### 3. 打包体积较大（~80 MB）

体积主要来源于：

- Electron 运行时（Chromium + Node.js）：~120 MB
- Python 后端此时未打包进 exe（仅复制源码，需用户自行安装 Python）

如需瘦身：

- 使用 `electron-builder` 的文件过滤排除不需要的 locale 文件
- 考虑将 Python 后端用 PyInstaller 打包为独立 exe

### 4. macOS 构建

electron-builder 无法在 Windows 上交叉编译 macOS 版本。

需要在 Mac 上执行：

```bash
cd frontend
npm install
npm run electron:build
```

### 5. TypeScript 报错 `nav.single` 等 key 不存在

翻译键 `TranslationKey` 类型在 `src/contexts/I18nContext.tsx` 中定义，移除 key 时需要同步更新该类型及其测试。
