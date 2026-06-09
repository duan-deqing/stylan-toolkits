import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { I18nProvider, useI18n, TranslationKey } from '../contexts/I18nContext'

describe('I18nContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should default to zh-CN', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    })
    expect(result.current.locale).toBe('zh-CN')
  })

  it('should switch locale', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    })
    act(() => result.current.setLocale('en-US'))
    expect(result.current.locale).toBe('en-US')
  })

  it('should translate keys', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    })
    expect(result.current.t('nav.home')).toBe('首页')
    act(() => result.current.setLocale('en-US'))
    expect(result.current.t('nav.home')).toBe('Home')
  })

  it('should return key as fallback for missing translations', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    })
    const key: TranslationKey = 'nav.batch'
    expect(result.current.t(key)).toBe('图片去水印')
  })
})
