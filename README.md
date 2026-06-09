<div align="center">

<img src="frontend/public/favicon.ico" width="80" alt="STYLAN's toolkits" />

# STYLAN's toolkits

A modern desktop application for intelligent image watermark removal.

Built with Electron + React + FastAPI + OpenCV

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Electron](https://img.shields.io/badge/Electron-33-47848F?logo=electron)](https://www.electronjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/badge/release-v1.0.0-6366f1)](https://github.com/duan-deqing/stylan-toolkits/releases)

[English](README.md) | [简体中文](README.zh-CN.md)

</div>

## Table of Contents

- [STYLAN's toolkits](#stylans-toolkits)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
  - [Project Structure](#project-structure)
  - [API Reference](#api-reference)
    - [Health Check](#health-check)
    - [Get Progress](#get-progress)
    - [Single Image Inpainting](#single-image-inpainting)
    - [Batch Inpainting](#batch-inpainting)
  - [Build \& Release](#build--release)
    - [Build](#build)
    - [Publish to GitHub Releases](#publish-to-github-releases)
  - [Configuration](#configuration)
  - [Design](#design)
  - [FAQ](#faq)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Batch Processing** — Select an entire folder of images, mark the watermark area once, and process all images in parallel with real-time progress tracking.
- **Single Image Mode** — Precision control over individual images with an interactive canvas. Prompt file-save dialog when no output directory is specified.
- **Smart Inpainting** — Powered by OpenCV's Telea and Navier-Stokes algorithms for seamless watermark removal.
- **Wide Format Support** — JPG, PNG, BMP, TIFF, and more.
- **Unicode Paths** — Full support for file paths containing Chinese characters and special symbols.
- **Neumorphism UI** — Soft shadows, inset cards, light/dark/system themes with smooth transitions.
- **i18n** — Simplified Chinese / English bilingual interface.
- **Frameless Window** — Custom title bar with drag region, collapsible sidebar with adjustable width (160–320px).

## Screenshots

> *Coming soon*

## Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + TypeScript | UI framework with strict type checking |
| **Bundler** | Vite 6 | Fast HMR and optimized production builds |
| **Desktop** | Electron 33 | Cross-platform desktop shell with frameless window |
| **Backend** | Python FastAPI + OpenCV | HTTP API with image processing pipeline |
| **Packaging** | electron-builder | NSIS installer + portable executable for Windows |
| **Testing** | Vitest + Testing Library | Unit and component testing |
| **i18n** | React Context | Lightweight bilingual support (zh-CN / en-US) |

## Getting Started

### Prerequisites

| Dependency | Version | Installation |
|---|---|---|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | Bundled with Node.js |
| Python | ≥ 3.10 | [python.org](https://python.org) |
| pip | latest | Bundled with Python |

### Installation

```bash
# Clone the repository
git clone https://github.com/duan-deqing/stylan-toolkits.git
cd stylan-toolkits

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && pip install -r requirements.txt
```

### Development

```bash
# Start full dev environment (Vite + Electron + Backend)
cd frontend && npm run electron:dev
```

This launches three processes simultaneously:

1. **Vite dev server** — `http://localhost:5173` with hot module replacement
2. **Electron window** — auto-opens after Vite is ready
3. **Python backend** — `http://127.0.0.1:8766`, managed by Electron lifecycle

**Other useful commands:**

```bash
# Frontend only (no Electron)
npm run dev

# TypeScript type check
npx tsc --noEmit

# Run tests
npm run test

# Watch tests
npm run test:watch
```

## Project Structure

```
stylan-toolkits/
│
├── frontend/                          # Electron + React
│   ├── electron/
│   │   ├── main.ts                    # Main process: window, backend lifecycle
│   │   └── preload.ts                 # Context bridge for IPC
│   ├── src/
│   │   ├── api.ts                     # API client for backend
│   │   ├── types.ts                   # Shared TypeScript types
│   │   ├── App.tsx                    # Root component with routing
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Sidebar.tsx        # Collapsible sidebar (draggable)
│   │   │   │   └── TitleBar.tsx       # Custom frameless title bar
│   │   │   └── watermark/
│   │   │       ├── ImageCanvas.tsx    # Canvas rendering + selection
│   │   │       ├── FoldersCard.tsx    # Directory/file input card
│   │   │       ├── FolderSelector.tsx
│   │   │       ├── FileSelector.tsx
│   │   │       ├── OperationPanel.tsx # Mode toggle + actions
│   │   │       └── ProgressBar.tsx
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx       # light / dark / system
│   │   │   └── I18nContext.tsx        # zh-CN / en-US
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # Landing with feature cards
│   │   │   ├── WatermarkPage.tsx      # Main workspace
│   │   │   └── SettingsPage.tsx       # Theme, language, about
│   │   ├── styles/                    # Modular CSS (by feature)
│   │   └── test/                      # Vitest test files
│   ├── public/
│   │   ├── favicon.ico                # App icon
│   │   └── icon-512.png               # macOS icon source
│   ├── package.json                   # Scripts + electron-builder config
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                           # Python FastAPI
│   ├── run.py                         # Entry point
│   ├── app/
│   │   ├── config.py                  # Settings (port, host, formats)
│   │   ├── main.py                    # FastAPI app factory
│   │   ├── models/schemas.py          # Pydantic models
│   │   ├── routers/inpaint.py         # API endpoints
│   │   ├── services/processor.py      # OpenCV watermark removal
│   │   └── utils/progress.py          # Thread-safe progress tracker
│   └── requirements.txt
│
├── BUILD.md                           # Build & packaging guide
├── README.md
└── .gitignore
```

## API Reference

The backend runs at `http://127.0.0.1:8766`.

### Health Check

```http
GET /health
```

**Response** `200`

```json
{ "status": "ok" }
```

### Get Progress

```http
GET /progress
```

**Response** `200`

```json
{
  "current": 5,
  "total": 10,
  "status": "processing",
  "message": "",
  "processed": 5
}
```

> `status` values: `idle` | `processing` | `done` | `error`

### Single Image Inpainting

```http
POST /inpaint-single
Content-Type: application/json
```

**Request Body**

```json
{
  "input_path": "C:/photos/image.jpg",
  "output_path": "C:/photos/result.jpg",
  "rects": [
    { "x": 100, "y": 50, "w": 200, "h": 80 }
  ]
}
```

**Response** `200`

```json
{
  "message": "Done",
  "output_path": "C:/photos/result.jpg",
  "total": null
}
```

### Batch Inpainting

```http
POST /inpaint
Content-Type: application/json
```

**Request Body**

```json
{
  "input_dir": "C:/photos/inputs",
  "output_dir": "C:/photos/outputs",
  "rects": [
    { "x": 100, "y": 50, "w": 200, "h": 80 }
  ]
}
```

**Response** `200`

```json
{
  "message": "Processing started",
  "total": 42
}
```

> Processing runs in a background thread. Poll `/progress` for status.

**Error Responses**

| Status | Cause |
|---|---|
| `400` | Missing or invalid input/output path, no rectangles, or image cannot be decoded |
| `500` | Unexpected server error |

## Build & Release

### Build

```bash
cd frontend && npm run electron:build
```

Artifacts are generated in `frontend/release/`:

| Artifact | Description |
|---|---|
| `STYLAN toolkits Setup x.x.x.exe` | NSIS installer |
| `STYLAN toolkits x.x.x.exe` | Portable executable |
| `win-unpacked/` | Unpacked app directory |

### Publish to GitHub Releases

```bash
# Set version
VERSION=1.0.0

# Create release
gh release create v$VERSION \
  "frontend/release/STYLAN toolkits Setup $VERSION.exe" \
  "frontend/release/STYLAN toolkits $VERSION.exe" \
  --title "v$VERSION" \
  --generate-notes
```

For detailed build instructions, see [BUILD.md](BUILD.md).

## Configuration

All preferences are persisted in `localStorage`:

| Setting | Options | Default |
|---|---|---|
| Theme | Light / Dark / System | System |
| Language | zh-CN / en-US | zh-CN |
| Sidebar Width | 160px – 320px | 200px |

## Design

The UI follows **Neumorphism** (soft UI) design principles:

| Token | Value |
|---|---|
| Primary Color | `#6366f1` (Indigo) |
| Light Background | `#ecedf1` |
| Dark Background | `#0f172a` |
| Border Radius | 12 – 16px |
| Shadow | Dual-shadow (highlight + shade) for raised/inset effects |
| Typography | System font stack, clean sans-serif |

## FAQ

<details>
<summary><strong>Why doesn't the app icon display?</strong></summary>

Use relative paths in `<img>` tags (`favicon.ico`) instead of absolute paths (`/favicon.ico`). Electron loads pages via `file://` protocol, where absolute paths resolve to the filesystem root.
</details>

<details>
<summary><strong>Backend fails to start</strong></summary>

```bash
# Verify dependencies
cd backend && pip install -r requirements.txt

# Test manually
cd backend && python run.py
```

</details>

<details>
<summary><strong>Images with Chinese/special characters won't open</strong></summary>

This is already handled — the backend uses `np.fromfile` + `cv2.imdecode` instead of `cv2.imread` to support Unicode paths.
</details>

<details>
<summary><strong>How to build for macOS?</strong></summary>

macOS builds require a Mac. The configuration is already in place — run `npm run electron:build` on a Mac to generate `.dmg` and `.zip` packages.
</details>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE) © STYLAN
