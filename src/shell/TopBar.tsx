import type { ReactNode } from 'react'
import { Menu } from 'lucide-react'

import { Button } from '../components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import type { ShellLabels, ShellUser, ShellUserAction } from './types'

interface TopBarProps {
  onOpenMobileSidebar: () => void
  labels: ShellLabels
  /** Breadcrumbs node (router-derived in the consuming app). */
  breadcrumbs?: ReactNode
  /** Extra controls on the end side, before the theme toggle (e.g. a language
   *  switcher). */
  actions?: ReactNode
  themeToggle?: boolean
  user?: ShellUser
  userActions?: ShellUserAction[]
}

/** Top bar: breadcrumbs on the start; actions, theme toggle and account on the
 *  end. The hamburger (mobile only) opens the sidebar drawer. */
export function TopBar({
  onOpenMobileSidebar,
  labels,
  breadcrumbs,
  actions,
  themeToggle = true,
  user,
  userActions,
}: TopBarProps) {
  return (
    <header className="flex h-topbar shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileSidebar}
          aria-label={labels.openMenu}
        >
          <Menu />
        </Button>
        {breadcrumbs}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {actions}
        {themeToggle && <ThemeToggle labels={labels} />}
        {user && <UserMenu user={user} actions={userActions} />}
      </div>
    </header>
  )
}
