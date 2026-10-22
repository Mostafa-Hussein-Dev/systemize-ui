import { Moon, Sun } from 'lucide-react'

import { Button } from '../components/ui/button'
import { useTheme } from './useTheme'
import { DEFAULT_SHELL_LABELS } from './types'

/**
 * Self-contained sun/moon toggle that flips `<html data-theme>` and persists
 * the choice. Pass `labels` to localise the aria-label.
 */
export function ThemeToggle({
  labels,
}: {
  labels?: { switchToDark?: string; switchToLight?: string }
}) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={
        isDark
          ? (labels?.switchToLight ?? DEFAULT_SHELL_LABELS.switchToLight)
          : (labels?.switchToDark ?? DEFAULT_SHELL_LABELS.switchToDark)
      }
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}
