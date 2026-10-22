import { useState, type ReactNode } from 'react'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useLocalStorageState } from './useLocalStorageState'
import {
  DEFAULT_SHELL_LABELS,
  defaultIsActive,
  type ShellLabels,
  type ShellLink,
  type ShellNavGroup,
  type ShellUser,
  type ShellUserAction,
} from './types'

const DefaultLink: ShellLink = ({ to, className, children, onClick, title }) => (
  <a href={to} className={className} onClick={onClick} title={title}>
    {children}
  </a>
)

export interface AppShellProps {
  /** Brand name shown in the sidebar lockup; its first letter is the mark. */
  appName: string
  /** Sidebar sections with already-resolved labels + lucide icons. */
  nav: ShellNavGroup[]
  /** The current route path, for active-link matching (e.g. router's pathname). */
  currentPath: string
  /** Router-agnostic link renderer. Defaults to a plain <a>; in a React Router
   *  app pass a wrapper around <Link>. */
  Link?: ShellLink
  /** Override active-link matching (default: exact for `end`, else prefix). */
  isActive?: (path: string, end: boolean | undefined, currentPath: string) => boolean
  /** Signed-in user for the sidebar footer + account menu. */
  user?: ShellUser
  /** Account-menu rows (change password, switch company, log out…). */
  userActions?: ShellUserAction[]
  /** Breadcrumbs node (the consumer derives these from its router). */
  breadcrumbs?: ReactNode
  /** Extra top-bar controls before the theme toggle (e.g. language switcher). */
  topBarActions?: ReactNode
  /** Show the built-in theme toggle (default true). */
  themeToggle?: boolean
  /** Localised labels for aria/controls. */
  labels?: Partial<ShellLabels>
  /** The routed page content (put your router's <Outlet /> here). */
  children: ReactNode
}

/**
 * The Systemize application shell: a collapsible sidebar + top bar framing the
 * page content, with a mobile drawer. Fully presentational and framework-
 * agnostic — pass your nav, user, link renderer and breadcrumbs as props.
 *
 * Sidebar-collapsed state persists to localStorage; the mobile drawer is
 * ephemeral.
 */
export function AppShell({
  appName,
  nav,
  currentPath,
  Link = DefaultLink,
  isActive = defaultIsActive,
  user,
  userActions,
  breadcrumbs,
  topBarActions,
  themeToggle = true,
  labels: labelOverrides,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useLocalStorageState(
    'systemize-sidebar-collapsed',
    false
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const labels: ShellLabels = { ...DEFAULT_SHELL_LABELS, ...labelOverrides }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        appName={appName}
        nav={nav}
        currentPath={currentPath}
        Link={Link}
        isActive={isActive}
        user={user}
        labels={labels}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          onOpenMobileSidebar={() => setMobileOpen(true)}
          labels={labels}
          breadcrumbs={breadcrumbs}
          actions={topBarActions}
          themeToggle={themeToggle}
          user={user}
          userActions={userActions}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-page">{children}</main>
      </div>
    </div>
  )
}
