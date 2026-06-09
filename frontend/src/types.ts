export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface ProcessProgress {
  current: number
  total: number
  status: 'idle' | 'processing' | 'done' | 'error'
  message: string
}

export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>
  saveFile: (defaultName?: string) => Promise<string | null>
  readImage: (filePath: string) => Promise<string>
  getBackendUrl: () => Promise<string>
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  isMaximized: () => Promise<boolean>
  onMaximizedChanged: (callback: (maximized: boolean) => void) => void
  openExternal: (url: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
