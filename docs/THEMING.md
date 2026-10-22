# Theming

Everything visual is a **CSS variable** in `src/styles/tokens.css`, exposed to
Tailwind as utilities by `src/styles/theme.css` (via `@theme inline`). You style
with semantic utilities — `bg-card`, `text-text-muted`, `border-border`,
`p-card`, `gap-grid` — never raw hex. Change a token once and it updates
everywhere, in both light and dark.

---

## Rebrand in one line

The entire accent is derived from a single token. In your app's CSS (after the
package import), override it:

```css
:root {
  --brand: #4f46e5; /* was emerald #10b981 — now indigo, everywhere */
}
```

`--brand-hover` and `--brand-soft`, the secondary ramp, success colour, focus
rings, the icon chip, active nav, badges — all re-derive from `--brand`
automatically. No component changes.

---

## Dark mode

Dark mode is an attribute on the root element, **not** a class:

```ts
// read a saved choice or the OS preference, then:
document.documentElement.setAttribute('data-theme', 'dark')   // or 'light'
```

The package binds Tailwind's `dark:` variant to `[data-theme='dark']`, so both
your own `dark:` utilities and the components' internal ones follow this one
switch. A minimal, persistent toggle:

```tsx
import { useEffect, useState } from 'react'

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light'
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
```

Every colour token has a dark value (see `:root[data-theme='dark']` in
`tokens.css`); unset ones fall through to the light value.

---

## Density

`data-density` on `<html>` rescales page/card padding, grid gaps, the top-bar
height and sidebar width — as a designed step, not a blurry zoom:

```html
<html data-density="spacious">  <!-- default -->
<html data-density="compact">   <!-- tighter: 16px pads, 56px top bar, 220px sidebar -->
```

Because components express spacing only through tokens (`p-card`, `gap-grid`,
`h-topbar`, `w-sidebar`), switching density is a token flip, never a component
edit.

---

## Corners

```html
<html data-corners="rounded">  <!-- default -->
<html data-corners="sharp">     <!-- squares off the radii -->
```

---

## Fonts

Three font tokens, overridable:

```css
:root {
  --font-display: 'Sora', 'Noto Sans Arabic', sans-serif; /* headings */
  --font-sans: /* system stack */ ;                        /* body */
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;  /* numbers, codes */
}
```

Use them as utilities: `font-display`, `font-sans`, `font-mono`. See
`docs/INSTALL.md` §5 for loading Sora + JetBrains Mono.

---

## The token groups (reference)

All defined in `src/styles/tokens.css`, each with a light and dark value:

| Group | Example tokens | Tailwind utilities |
|---|---|---|
| Brand | `--brand`, `--brand-hover`, `--brand-soft` | `bg-brand`, `text-brand`, `bg-brand-soft`, `hover:bg-brand-hover` |
| Secondary / tertiary ramps | `--secondary-700`, `--tertiary-500` | `bg-secondary-700`, `text-tertiary-500` |
| Semantic status | `--success`, `--warning`, `--danger`, `--info` (+ `-soft`) | `text-danger`, `bg-warning-soft`, … |
| Surfaces | `--background`, `--surface`, `--surface-secondary`, `--card`, `--modal` | `bg-background`, `bg-card`, `bg-surface-secondary` |
| Sidebar chrome | `--sidebar`, `--sidebar-border`, `--sidebar-text` | `bg-sidebar`, `text-sidebar-text`, `text-sidebar-muted` |
| Text | `--text-primary/secondary/muted/disabled` | `text-text-primary`, `text-text-muted`, … |
| Borders | `--border`, `--border-light`, `--divider` | `border-border`, `border-divider` |
| Radii | `--radius-xs … --radius-2xl` | `rounded-md`, `rounded-lg`, … |
| Shadows | `--shadow-xs … --shadow-xl` | `shadow-sm`, `shadow-md`, … |
| Spacing (density) | `--page-pad`, `--card-pad`, `--grid-gap`, `--topbar-h`, `--sidebar-w` | `p-page`, `p-card`, `gap-grid`, `h-topbar`, `w-sidebar` |

### Handy component classes (from `theme.css`)
- `.field-box` — the bordered input shell with the accent focus ring (wrap a
  bare control in it; the form components already do).
- `.field-label` — 13px/500 field label.
- `.section-label` — 12px uppercase accent heading with an underline, for form
  groups.
- `.table-label` — muted uppercase table column header.
- `.icon-chip` — 36×36 accent-soft square for an icon.

---

## Customising safely

- **Override tokens in your app CSS** (after the `@mostafa-hussein-dev/ui/styles.css`
  import) — this is the supported way to tweak a project while staying on the
  shared system.
- **Don't** edit colours inside component files in your app; you'd lose the
  shared-system guarantee. If a token is missing, add it to the package and bump
  the version so every project benefits.
