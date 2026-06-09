import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  selectFile: (filters?: { name: string; extensions: string[] }[]) =>
    ipcRenderer.invoke('dialog:selectFile', filters),
  saveFile: (defaultName?: string) =>
    ipcRenderer.invoke('dialog:saveFile', defaultName),
  readImage: (filePath: string) => ipcRenderer.invoke('file:readImage', filePath),
  getBackendUrl: () => ipcRenderer.invoke('backend:url'),

  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  onMaximizedChanged: (callback: (maximized: boolean) => void) => {
    ipcRenderer.on('window:maximizedChanged', (_event, value) => callback(value))
  },

  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
})
