# Usage

Everything is a named export from the package root:

```tsx
import {
  Button, Input, Textarea, Badge, Tabs, Table,
  TextField, SelectField, PasswordField, CheckboxField, SwitchField,
  RadioGroupField, FormBanner, StatusBadge, Modal, DataTable, Pagination,
  cn,
} from '@mostafa-hussein-dev/ui'
```

> These components are **presentational**. Data fetching, forms state, i18n and
> routing stay in your app. The form fields are plain controlled/`ref` inputs,
> so they drop straight into React Hook Form, Formik, or manual state.

---

## cn — class merging

`clsx` + `tailwind-merge`: compose conditional classes and let later Tailwind
utilities win over earlier ones.

```tsx
<div className={cn('p-card rounded-lg', isActive && 'bg-brand-soft', className)} />
```

---

## Primitives (`ui/`)

shadcn-style, unstyled-by-logic + token-styled. Use when you need a raw control.

```tsx
<Button>Default</Button>
<Button variant="outline" size="sm">Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon" aria-label="Menu"><MenuIcon /></Button>

<Input placeholder="Plain input" />
<Textarea placeholder="Plain textarea" />
<Badge>Label</Badge>
```

Also exported: `Label`, `Checkbox`, `Switch`, `RadioGroup` (+`RadioGroupItem`),
`Dialog` (+`DialogContent/Header/Title/Description/Footer`), `Popover`,
`DropdownMenu`, `Tabs`, `Table` (+`TableHeader/Body/Row/Head/Cell`). In most app
code you'll reach for the composed building blocks below instead.

---

## Form fields (`common/`)

Each pairs a label + the bordered `.field-box` shell + an error slot. They take
an `id`, a `label`, an optional `error`, and forward the rest to the control — so
they spread a React Hook Form `register()` cleanly.

```tsx
// plain controlled
<TextField
  id="email"
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>

// with React Hook Form
<TextField id="name" label="Name" error={errors.name?.message} {...register('name')} />

<TextareaField id="notes" label="Notes" {...register('notes')} />

<PasswordField id="pw" label="Password" {...register('password')} />

<SelectField
  id="currency"
  label="Currency"
  placeholder="Select…"
  options={[
    { value: 'USD', label: 'US Dollar' },
    { value: 'LBP', label: 'Lebanese Pound' },
  ]}
  error={errors.currency?.message}
  {...register('currency')}
/>

<CheckboxField
  id="active"
  label="Active"
  checked={active}
  onCheckedChange={(v) => setActive(v === true)}
/>

<SwitchField id="notify" label="Email notifications" checked={on} onCheckedChange={setOn} />

<RadioGroupField
  label="Direction"
  value={dir}
  onValueChange={setDir}
  options={[
    { value: 'IN', label: 'Incoming' },
    { value: 'OUT', label: 'Outgoing' },
  ]}
/>
```

---

## Feedback

```tsx
{/* form-level error / success banner */}
{error && <FormBanner variant="error">{error}</FormBanner>}
<FormBanner variant="success">Saved.</FormBanner>

{/* status chips — soft fill + matching text, always pill-shaped */}
<StatusBadge variant="success">Posted</StatusBadge>
<StatusBadge variant="warning">Pending</StatusBadge>
<StatusBadge variant="danger">Cancelled</StatusBadge>
<StatusBadge variant="info">Approved</StatusBadge>
<StatusBadge variant="neutral">Draft</StatusBadge>
```

---

## Modal

Themed wrapper over the dialog primitive — title/description/footer slots.

```tsx
const [open, setOpen] = useState(false)

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete item?"
  description="This cannot be undone."
  footer={
    <>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={confirm}>Delete</Button>
    </>
  }
>
  <p className="text-text-secondary">The item will be permanently removed.</p>
</Modal>
```

---

## DataTable

A thin, typed wrapper over TanStack Table — give it `columns` + `data`, an empty
state, and an optional row click.

```tsx
import type { ColumnDef } from '@tanstack/react-table'

type Row = { id: string; name: string; total: number }

const columns: ColumnDef<Row>[] = [
  { id: 'name', header: 'Name', cell: ({ row }) => row.original.name },
  {
    id: 'total',
    header: 'Total',
    cell: ({ row }) => <span className="font-mono">{row.original.total}</span>,
  },
]

<DataTable
  columns={columns}
  data={rows}
  emptyState="No records yet."
  onRowClick={(row) => navigate(`/items/${row.id}`)}
/>
```

---

## Pagination

i18n-agnostic. Renders nothing for a single page. Pass label props to localise.

```tsx
<Pagination
  page={meta.page}
  totalPages={meta.totalPages}
  total={meta.total}
  onPrev={() => setPage((p) => Math.max(1, p - 1))}
  onNext={() => setPage((p) => p + 1)}
  // optional localisation (e.g. from i18next):
  prevLabel={t('pagination.prev')}
  nextLabel={t('pagination.next')}
  summary={({ page, totalPages, total }) =>
    t('pagination.summary', { page, totalPages, total })
  }
/>
```

---

## Layout utilities worth knowing

Use these token-backed utilities for page scaffolding so spacing stays on-system:

```tsx
<div className="min-h-screen bg-background text-text-primary">
  <main className="p-page">
    <h1 className="font-display text-2xl font-bold tracking-tight">Title</h1>
    <div className="mt-6 grid gap-grid sm:grid-cols-2 lg:grid-cols-3">
      <section className="rounded-lg border border-border bg-card p-card">…</section>
    </div>
  </main>
</div>
```

See `docs/THEMING.md` for the full token/utility reference.

---

## Application shell (`AppShell`)

The full app chrome — collapsible sidebar + top bar + mobile drawer — as one
presentational component. It is **router-, i18n- and auth-agnostic**: you pass
the nav (with already-translated labels), the current path, a link renderer, the
user, and the account-menu actions. A self-contained light/dark toggle is built
in.

```tsx
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, LogOut, Settings } from 'lucide-react'
import { AppShell, type ShellLinkProps } from '@mostafa-hussein-dev/ui'

// 1. Adapt your router's Link to the shell's link contract (once).
function ShellLink({ to, active, ...rest }: ShellLinkProps) {
  return <RouterLink to={to} aria-current={active ? 'page' : undefined} {...rest} />
}

export function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <AppShell
      appName="My App"
      currentPath={pathname}
      Link={ShellLink}
      user={{ name: 'Jane Doe', email: 'jane@acme.com' }}
      nav={[
        { items: [{ label: 'Dashboard', path: '/app', icon: LayoutDashboard, end: true }] },
        {
          label: 'Sales',
          items: [
            { label: 'Customers', path: '/app/customers', icon: Users },
            { label: 'Invoices', path: '/app/invoices', icon: FileText },
          ],
        },
        { label: 'Settings', items: [{ label: 'Settings', path: '/app/settings', icon: Settings }] },
      ]}
      userActions={[
        { key: 'logout', label: 'Log out', icon: LogOut, onSelect: () => navigate('/logout'), separatorBefore: true },
      ]}
      // Optional: breadcrumbs (derive from your router), extra top-bar controls,
      // and localised labels:
      // breadcrumbs={<MyBreadcrumbs />}
      // topBarActions={<LanguageSwitcher />}
      // labels={{ collapseSidebar: t('shell.collapse'), openMenu: t('shell.openMenu'), ... }}
    >
      <Outlet />
    </AppShell>
  )
}
```

Notes:
- **Labels are strings**, already resolved — run your own i18n when you build the
  `nav` array and `userActions`, and pass `labels` for the aria text. Nothing in
  the shell imports an i18n library.
- `Link` is optional; omitted, it falls back to a plain `<a>` (full-page nav).
  Pass the adapter above for SPA navigation + active styling.
- The sidebar groups render headings when expanded and a divider when collapsed;
  collapsed state persists to localStorage automatically.
- Theme: the built-in toggle flips `<html data-theme>`. Apply the initial theme
  before React renders to avoid a flash:
  ```ts
  // main.tsx, before createRoot(...).render(...)
  import { applyTheme, getInitialTheme, applyFeel, getStoredDensity, getStoredCorners } from '@mostafa-hussein-dev/ui'
  applyTheme(getInitialTheme())
  applyFeel(getStoredDensity(), getStoredCorners())
  ```

### Composing your own chrome
If you don't want the whole `AppShell`, the pieces are exported too: `Sidebar`,
`SidebarPanel`, `TopBar`, `UserMenu`, `ThemeToggle`, plus the `useTheme` hook and
the `applyTheme` / `applyFeel` / `persist*` helpers.
