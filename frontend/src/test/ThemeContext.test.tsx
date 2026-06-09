import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('should default to system mode', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    expect(result.current.mode).toBe('system')
    expect(result.current.resolved).toBe('light')
  })

  it('should change theme mode', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    act(() => result.current.setMode('dark'))
    expect(result.current.mode).toBe('dark')
    expect(localStorage.getItem('theme-mode')).toBe('dark')
  })

  it('should persist theme in localStorage', () => {
    localStorage.setItem('theme-mode', 'dark')
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    expect(result.current.mode).toBe('dark')
  })

  it('should apply data-theme attribute', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })
    act(() => result.current.setMode('dark'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
