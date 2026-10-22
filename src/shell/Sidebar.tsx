import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../lib/utils'
import {
  DEFAULT_SHELL_LABELS,
  defaultIsActive,
  type ShellLabels,
  type ShellLink,
  type ShellNavGroup,
  type ShellUser,
} from './types'

interface SidebarPanelProps {
  appName: string
  nav: ShellNavGroup[]
  currentPath: string
  Link: ShellLink
  isActive: (path: string, end: boolean | undefined, currentPath: string) => boolean
  user?: ShellUser
  labels: ShellLabels
  collapsed: boolean
  onToggleCollapse?: () => void
  onNavigate?: () => void
}

function initials(user: ShellUser): string {
  if (user.initials) return user.initials
  const p = user.name.trim().split(/\s+/)
  return `${p[0]?.charAt(0) ?? ''}${p[1]?.charAt(0) ?? ''}`.toUpperCase() || '?'
}

/** The sidebar's inner content — shared by the desktop rail and mobile drawer. */
export function SidebarPanel({
  appName,
  nav,
  currentPath,
  Link,
  isActive,
  user,
  labels,
  collapsed,
  onToggleCollapse,
  onNavigate,
}: SidebarPanelProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-text">
      {/* Brand lockup — the mark stays when collapsed. */}
      <div
        className={cn(
          'flex h-topbar shrink-0 items-center gap-2.5',
          collapsed ? 'justify-center px-4' : 'px-6'
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-brand font-display text-[15px] font-bold text-white">
          {appName.charAt(0)}
        </span>
        {!collapsed && (
          <span className="truncate font-display text-[19px] font-bold tracking-[-0.01em]">
            {appName}
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {nav.map((group, gi) => (
          <div key={group.label ?? `group-${gi}`} className={cn(gi > 0 && 'mt-4')}>
            {group.label &&
              (collapsed ? (
                <div className="mx-auto my-1 h-px w-6 bg-sidebar-border" />
              ) : (
                <div className="px-3.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted/70">
                  {group.label}
                </div>
              ))}
            {group.items.map((item) => {
              const active = isActive(item.path, item.end, currentPath)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  active={active}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
                    collapsed && 'justify-center',
                    active
                      ? 'bg-brand-soft text-brand'
                      : 'text-sidebar-muted hover:bg-white/[0.06]'
                  )}
                >
                  <item.icon className="size-[18px] shrink-0" />
                  <span className={cn(collapsed && 'sr-only')}>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? labels.expandSidebar : labels.collapseSidebar}
          aria-expanded={!collapsed}
          className={cn(
            'flex items-center gap-3 border-t border-sidebar-border py-2.5 text-[13px] font-medium text-sidebar-muted transition-colors hover:bg-white/[0.06]',
            collapsed ? 'justify-center px-4' : 'px-6'
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-[18px] shrink-0 rtl:rotate-180" />
          ) : (
            <ChevronLeft className="size-[18px] shrink-0 rtl:rotate-180" />
          )}
          {!collapsed && <span>{labels.collapseSidebar}</span>}
        </button>
      )}

      {user && (
        <div
          className={cn(
            'flex items-center gap-2.5 border-t border-sidebar-border p-4',
            collapsed && 'justify-center'
          )}
        >
          <span className="flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-brand text-[13px] font-bold text-white">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              initials(user)
            )}
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-sidebar-text">
                {user.name}
              </div>
              {user.email && (
                <div className="truncate text-xs text-sidebar-muted">
                  {user.email}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface SidebarProps extends Omit<SidebarPanelProps, 'onNavigate'> {
  mobileOpen: boolean
  onCloseMobile: () => void
}

/** Desktop rail (collapsible) + mobile overlay drawer, both from one panel. */
export function Sidebar({
  mobileOpen,
  onCloseMobile,
  labels,
  ...panel
}: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'hidden shrink-0 transition-[width] duration-150 ease-out lg:block',
          panel.collapsed ? 'lg:w-sidebar-collapsed' : 'lg:w-sidebar'
        )}
      >
        <SidebarPanel {...panel} labels={labels} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={labels.closeMenu}
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/50"
            tabIndex={-1}
          />
          <div className="absolute inset-y-0 start-0 w-sidebar shadow-lg">
            <SidebarPanel
              {...panel}
              labels={labels}
              collapsed={false}
              onToggleCollapse={undefined}
              onNavigate={onCloseMobile}
            />
          </div>
        </div>
      )}
    </>
  )
}
