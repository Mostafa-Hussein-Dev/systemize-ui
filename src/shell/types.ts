import type { ComponentType, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

/** One sidebar link. `label` is already resolved (the consumer runs its own
 *  i18n); `icon` is any lucide-react icon; `end` matches the path exactly
 *  (for index routes like the dashboard). */
export interface ShellNavItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
}

/** A sidebar section. `label` null/undefined renders an un-headed top group. */
export interface ShellNavGroup {
  label?: string | null
  items: ShellNavItem[]
}

export interface ShellUser {
  name: string
  email?: string | null
  avatarUrl?: string | null
  /** Overrides the derived two-letter avatar fallback. */
  initials?: string
}

/** A row in the account dropdown (change password, switch company, log out…). */
export interface ShellUserAction {
  key: string
  label: string
  icon?: LucideIcon
  onSelect: () => void
  /** Renders a separator *before* this item. */
  separatorBefore?: boolean
}

/**
 * Router-agnostic link renderer. The shell computes `active` and the full
 * `className`; this component only needs to render an anchor-like element that
 * navigates to `to`. In a React Router app, pass a tiny wrapper around `Link`.
 */
export interface ShellLinkProps {
  to: string
  className?: string
  active?: boolean
  title?: string
  onClick?: () => void
  children: ReactNode
}
export type ShellLink = ComponentType<ShellLinkProps>

export interface ShellLabels {
  collapseSidebar: string
  expandSidebar: string
  openMenu: string
  closeMenu: string
  switchToDark: string
  switchToLight: string
}

export const DEFAULT_SHELL_LABELS: ShellLabels = {
  collapseSidebar: 'Collapse sidebar',
  expandSidebar: 'Expand sidebar',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  switchToDark: 'Switch to dark mode',
  switchToLight: 'Switch to light mode',
}

/** Default active-path matcher: exact for `end` items, else prefix match. */
export function defaultIsActive(
  path: string,
  end: boolean | undefined,
  currentPath: string
): boolean {
  if (end) return currentPath === path
  return currentPath === path || currentPath.startsWith(path + '/')
}
