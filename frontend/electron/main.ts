import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import fs from 'fs'

let mainWindow: BrowserWindow | null = null
let backendProcess: ChildProcess | null = null
const BACKEND_PORT = 8766
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`

function getBackendDir(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend')
  }
  return path.join(__dirname, '..', '..', '..', 'backend')
}

function startBackend(): Promise<void> {
  return new Promise((resolve, reject) => {
    const backendDir = getBackendDir()
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'
    const mainPy = path.join(backendDir, 'main.py')

    if (!fs.existsSync(mainPy)) {
      console.error(`Backend script not found: ${mainPy}`)
      resolve()
      return
    }

    backendProcess = spawn(pythonCmd, [mainPy], {
      cwd: backendDir,
      env: { ...process.env, PORT: String(BACKEND_PORT) },
    })

    backendProcess.stdout?.on('data', (data: Buffer) => {
      console.log(`[backend] ${data.toString().trim()}`)
    })

    backendProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`[backend:err] ${data.toString().trim()}`)
    })

    backendProcess.on('error', (err) => {
      console.error('Failed to start backend:', err)
      reject(err)
    })

    backendProcess.on('exit', (code) => {
      console.log(`Backend exited with code ${code}`)
      backendProcess = null
    })

    const maxRetries = 30
    let retries = 0
    const check = () => {
      retries++
      fetch(`${BACKEND_URL}/health`)
        .then((res) => {
          if (res.ok) resolve()
          else if (retries < maxRetries) setTimeout(check, 500)
          else reject(new Error('Backend health check failed'))
        })
        .catch(() => {
          if (retries < maxRetries) setTimeout(check, 500)
          else reject(new Error('Backend did not start in time'))
        })
    }
    setTimeout(check, 1000)
  })
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill()
    backendProcess = null
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 960,
    minHeight: 680,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: "STYLAN's toolkits",
    show: false,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximizedChanged', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximizedChanged', false)
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(async () => {
  try {
    await startBackend()
    console.log('Backend started')
  } catch (e) {
    console.error('Backend start failed, continuing anyway:', e)
  }
  createWindow()
})

app.on('window-all-closed', () => {
  stopBackend()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', () => {
  stopBackend()
})

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false
})

ipcMain.handle('dialog:selectDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('dialog:selectFile', async (_event, filters?: { name: string; extensions: string[] }[]) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: filters || [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'bmp'] }],
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('file:readImage', async (_event, filePath: string) => {
  const data = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mime: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.bmp': 'image/bmp',
  }
  const base64 = data.toString('base64')
  return `data:${mime[ext] || 'image/png'};base64,${base64}`
})

ipcMain.handle('backend:url', () => BACKEND_URL)
