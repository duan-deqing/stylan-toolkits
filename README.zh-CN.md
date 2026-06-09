<div align="center">

<img src="frontend/public/favicon.ico" width="80" alt="STYLAN's toolkits" />

# STYLAN's toolkits

基于智能修复算法的桌面水印去除工具。

Electron + React + FastAPI + OpenCV

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Electron](https://img.shields.io/badge/Electron-33-47848F?logo=electron)](https://www.electronjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/badge/release-v1.0.0-6366f1)](https://github.com/duan-deqing/stylan-toolkits/releases)

[English](README.md) | [简体中文](README.zh-CN.md)

</div>

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
  - [环境要求](#环境要求)
  - [安装](#安装)
  - [开发](#开发)
- [项目结构](#项目结构)
- [API 文档](#api-文档)
- [构建与发布](#构建与发布)
- [配置](#配置)
- [设计风格](#设计风格)
- [常见问题](#常见问题)
- [参与贡献](#参与贡献)
- [开源协议](#开源协议)

## 功能特性

- **批量处理** — 选择图片目录，标记一次水印区域，批量处理所有图片，实时进度追踪。
- **单张处理** — 在交互画布上精细控制单张图片的去水印过程。未指定输出目录时自动弹出保存对话框。
- **智能修复** — 基于 OpenCV Telea 和 Navier-Stokes 算法，无缝去除水印。
- **多格式支持** — 支持 JPG、PNG、BMP、TIFF 等常见图片格式。
- **Unicode 路径** — 完整支持含中文和特殊字符的文件路径。
- **纽姆orphism 设计** — 柔和阴影、内嵌卡片效果，亮色/暗色/跟随系统三种主题。
- **双语界面** — 简体中文 / English。
- **无边框窗口** — 自定义标题栏，可折叠侧边栏，宽度可拖拽调整（160–320px）。

## 技术栈

| 层级 | 技术 | 说明 |
|---|---|---|
| **前端** | React 19 + TypeScript | 严格类型检查的 UI 框架 |
| **构建** | Vite 6 | 极速热更新和优化的生产构建 |
| **桌面** | Electron 33 | 跨平台桌面壳，无边框窗口 |
| **后端** | Python FastAPI + OpenCV | HTTP 接口 + 图像处理管线 |
| **打包** | electron-builder | Windows 下生成 NSIS 安装包 + 便携版 |
| **测试** | Vitest + Testing Library | 单元测试与组件测试 |
| **国际化** | React Context | 轻量级中英双语支持 |

## 快速开始

### 环境要求

| 依赖 | 最低版本 | 安装方式 |
|---|---|---|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | 随 Node.js 附带 |
| Python | ≥ 3.10 | [python.org](https://python.org) |
| pip | 最新 | 随 Python 附带 |

### 安装

```bash
# 克隆仓库
git clone https://github.com/duan-deqing/stylan-toolkits.git
cd stylan-toolkits

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd ../backend && pip install -r requirements.txt
```

### 开发

```bash
# 启动完整开发环境（Vite + Electron + 后端）
cd frontend && npm run electron:dev
```

该命令会同时启动三个进程：

1. **Vite 开发服务器** — `http://localhost:5173`，支持热更新
2. **Electron 窗口** — Vite 就绪后自动打开
3. **Python 后端** — `http://127.0.0.1:8766`，由 Electron 管理生命周期

**其他常用命令：**

```bash
# 仅前端（不启动 Electron）
npm run dev

# TypeScript 类型检查
npx tsc --noEmit

# 运行测试
npm run test

# 监听测试
npm run test:watch
```

## 项目结构

```
stylan-toolkits/
│
├── frontend/                          # Electron + React 前端
│   ├── electron/
│   │   ├── main.ts                    # 主进程：窗口管理、后端生命周期
│   │   └── preload.ts                 # 上下文桥接，暴露 IPC 到渲染进程
│   ├── src/
│   │   ├── api.ts                     # 后端 API 客户端
│   │   ├── types.ts                   # 共享类型定义
│   │   ├── App.tsx                    # 根组件与路由分发
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Sidebar.tsx        # 可折叠、可拖拽侧边栏
│   │   │   │   └── TitleBar.tsx       # 自定义无边框标题栏
│   │   │   └── watermark/
│   │   │       ├── ImageCanvas.tsx    # 画布渲染 + 选区拖拽
│   │   │       ├── FoldersCard.tsx    # 目录/文件输入卡片
│   │   │       ├── FolderSelector.tsx # 文件夹选择器
│   │   │       ├── FileSelector.tsx   # 文件选择器
│   │   │       ├── OperationPanel.tsx # 模式切换 + 操作按钮
│   │   │       └── ProgressBar.tsx    # 进度条
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx       # 主题管理（light / dark / system）
│   │   │   └── I18nContext.tsx        # 国际化（zh-CN / en-US）
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # 首页（功能卡片导航）
│   │   │   ├── WatermarkPage.tsx      # 去水印工作页
│   │   │   └── SettingsPage.tsx       # 设置页（主题、语言、关于）
│   │   ├── styles/                    # 按模块拆分的 CSS
│   │   └── test/                      # Vitest 测试文件
│   ├── public/
│   │   ├── favicon.ico                # 应用图标
│   │   └── icon-512.png               # macOS 图标源
│   ├── package.json                   # 脚本 + electron-builder 配置
│   ├── vite.config.ts                 # Vite + vite-plugin-electron 配置
│   └── tsconfig.json
│
├── backend/                           # Python FastAPI 后端
│   ├── run.py                         # 启动入口
│   ├── app/
│   │   ├── config.py                  # 配置（端口/主机/格式等）
│   │   ├── main.py                    # FastAPI 应用工厂
│   │   ├── models/schemas.py          # Pydantic 数据模型
│   │   ├── routers/inpaint.py         # API 路由
│   │   ├── services/processor.py      # OpenCV 水印去除核心逻辑
│   │   └── utils/progress.py          # 线程安全的进度追踪器
│   └── requirements.txt
│
├── BUILD.md                           # 构建与打包详细指南
├── README.md                          # 英文 README
├── README.zh-CN.md                    # 中文 README
└── .gitignore
```

## API 文档

后端运行在 `http://127.0.0.1:8766`。

### 健康检查

```http
GET /health
```

**响应** `200`

```json
{ "status": "ok" }
```

### 获取进度

```http
GET /progress
```

**响应** `200`

```json
{
  "current": 5,
  "total": 10,
  "status": "processing",
  "message": "",
  "processed": 5
}
```

> `status` 可选值：`idle` | `processing` | `done` | `error`

### 单张去水印

```http
POST /inpaint-single
Content-Type: application/json
```

**请求体**

```json
{
  "input_path": "C:/photos/image.jpg",
  "output_path": "C:/photos/result.jpg",
  "rects": [
    { "x": 100, "y": 50, "w": 200, "h": 80 }
  ]
}
```

**响应** `200`

```json
{
  "message": "Done",
  "output_path": "C:/photos/result.jpg",
  "total": null
}
```

### 批量去水印

```http
POST /inpaint
Content-Type: application/json
```

**请求体**

```json
{
  "input_dir": "C:/photos/inputs",
  "output_dir": "C:/photos/outputs",
  "rects": [
    { "x": 100, "y": 50, "w": 200, "h": 80 }
  ]
}
```

**响应** `200`

```json
{
  "message": "Processing started",
  "total": 42
}
```

> 处理在后台线程中运行。通过 `/progress` 接口轮询进度。

**错误状态码**

| 状态码 | 原因 |
|---|---|
| `400` | 路径缺失/无效、未提供选区矩形、或图片无法解码 |
| `500` | 未知服务端错误 |

## 构建与发布

### 构建

```bash
cd frontend && npm run electron:build
```

产物输出到 `frontend/release/`：

| 产物 | 说明 |
|---|---|
| `STYLAN toolkits Setup x.x.x.exe` | NSIS 安装包 |
| `STYLAN toolkits x.x.x.exe` | 便携版（免安装） |
| `win-unpacked/` | 未打包的应用目录 |

### 发布到 GitHub Release

```bash
# 设置版本号
VERSION=1.0.0

# 创建 Release
gh release create v$VERSION \
  "frontend/release/STYLAN toolkits Setup $VERSION.exe" \
  "frontend/release/STYLAN toolkits $VERSION.exe" \
  --title "v$VERSION" \
  --generate-notes
```

详细的构建说明见 [BUILD.md](BUILD.md)。

## 配置

所有用户偏好保存在 `localStorage` 中：

| 设置项 | 选项 | 默认值 |
|---|---|---|
| 主题 | 亮色 / 暗色 / 跟随系统 | 跟随系统 |
| 语言 | zh-CN / en-US | zh-CN |
| 侧边栏宽度 | 160px – 320px | 200px |

## 设计风格

遵循 **纽姆orphism**（软 UI）设计理念：

| 设计 Token | 值 |
|---|---|
| 主色调 | `#6366f1`（靛蓝） |
| 亮色主题背景 | `#ecedf1` |
| 暗色主题背景 | `#0f172a` |
| 圆角半径 | 12 – 16px |
| 阴影 | 双向阴影（亮面 + 暗面），营造凸起/嵌入效果 |
| 字体 | 系统字体栈，无衬线风格 |

## 常见问题

<details>
<summary><strong>应用图标不显示怎么办？</strong></summary>

图片引用请使用相对路径（如 `favicon.ico`），不要使用绝对路径（`/favicon.ico`）。Electron 通过 `file://` 协议加载页面，绝对路径会解析到文件系统根目录。
</details>

<details>
<summary><strong>后端启动失败</strong></summary>

```bash
# 确认依赖安装
cd backend && pip install -r requirements.txt

# 手动测试
cd backend && python run.py
```
</details>

<details>
<summary><strong>含中文或特殊字符的图片无法打开</strong></summary>

此问题已修复 — 后端使用 `np.fromfile` + `cv2.imdecode` 替代了 `cv2.imread`，以支持 Unicode 路径。
</details>

<details>
<summary><strong>如何构建 macOS 版本？</strong></summary>

macOS 版本只能在 Mac 上构建。配置文件已就绪，在 Mac 上运行 `npm run electron:build` 即可生成 `.dmg` 和 `.zip` 安装包。
</details>

## 参与贡献

欢迎提交 Pull Request！

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feat/amazing-feature`）
3. 提交修改（`git commit -m 'feat: 添加新功能'`）
4. 推送到分支（`git push origin feat/amazing-feature`）
5. 发起 Pull Request

## 开源协议

[MIT](LICENSE) © STYLAN
