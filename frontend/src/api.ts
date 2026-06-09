import { Rect, ProcessProgress } from './types'

async function getBaseUrl(): Promise<string> {
  if (window.electronAPI) {
    return await window.electronAPI.getBackendUrl()
  }
  return 'http://127.0.0.1:8766'
}

export async function healthCheck(): Promise<boolean> {
  try {
    const baseUrl = await getBaseUrl()
    const res = await fetch(`${baseUrl}/health`)
    return res.ok
  } catch {
    return false
  }
}

export async function startProcessing(
  inputDir: string,
  outputDir: string,
  rect: Rect
): Promise<void> {
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/inpaint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_dir: inputDir, output_dir: outputDir, rect }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || 'Processing failed')
  }
}

export async function getProgress(): Promise<ProcessProgress> {
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/progress`)
  return res.json()
}
