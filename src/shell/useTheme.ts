import { useCallback, useState } from 'react'

import { getInitialTheme, persistTheme, type Theme } from './theme'

/**
 * Light/dark theme state, persisted to localStorage and reflected on
 * `<html data-theme>`. Self-contained — no provider or app wiring needed.
 *
 * Apply the initial theme as early as possible (in your app entry, before
 * React renders) to avoid a flash — e.g.
 * `import { applyTheme, getInitialTheme } from '@mostafa-hussein-dev/ui'`
 * then `applyTheme(getInitialTheme())`.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    persistTheme(next)
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      return next
    })
  }, [])

  return { theme, setTheme, toggle }
}
