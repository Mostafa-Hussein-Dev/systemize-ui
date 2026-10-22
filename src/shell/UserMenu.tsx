import { Fragment } from 'react'
import { ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import type { ShellUser, ShellUserAction } from './types'

function deriveInitials(user: ShellUser): string {
  if (user.initials) return user.initials
  const parts = user.name.trim().split(/\s+/)
  const value = `${parts[0]?.charAt(0) ?? ''}${parts[1]?.charAt(0) ?? ''}`.toUpperCase()
  return value || '?'
}

/** Top-bar account menu, driven entirely by props (no auth/i18n coupling). */
export function UserMenu({
  user,
  actions = [],
}: {
  user: ShellUser
  actions?: ShellUserAction[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-secondary"
        >
          <span className="flex size-[34px] items-center justify-center overflow-hidden rounded-full bg-brand text-[13px] font-bold text-white">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              deriveInitials(user)
            )}
          </span>
          <span className="hidden max-w-40 truncate font-medium text-text-primary sm:inline">
            {user.name}
          </span>
          <ChevronDown className="size-4 text-text-muted" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="truncate font-medium text-text-primary">{user.name}</div>
          {user.email && (
            <div className="truncate text-xs font-normal text-text-muted">
              {user.email}
            </div>
          )}
        </DropdownMenuLabel>
        {actions.length > 0 && <DropdownMenuSeparator />}
        {actions.map((a) => (
          <Fragment key={a.key}>
            {a.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={() => a.onSelect()}>
              {a.icon && <a.icon />}
              {a.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
