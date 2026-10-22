# @mostafa-hussein-dev/ui

The **Systemize design system** — one source of truth for the look, feel, and
building blocks shared across every Systemize project. Drop it into a new app
and it instantly matches: same colours, typography, spacing, dark mode, form
fields, tables, dialogs, badges, and buttons.

It is a **source package** (it ships `.tsx` + CSS, not a prebuilt bundle). Your
app's own Tailwind compiles it — which is exactly how shadcn/ui is meant to
work, and why theming "just works": your app and this package share one Tailwind
build and one set of CSS variables.

> **Stack assumption:** React 18/19 + Vite + TypeScript + **Tailwind CSS v4**.
> Every Systemize front end uses this stack, so the package ships source and
> stays tiny. (Non-Vite bundlers work too as long as they transpile TS from
> `node_modules` and run Tailwind v4 — see `docs/INSTALL.md`.)

---

## What's inside

```
src/
  index.ts                     ← the public API (import everything from here)
  lib/utils.ts                 ← cn() — clsx + tailwind-merge
  styles/
    index.css                  ← the ONE stylesheet you import (@mostafa-hussein-dev/ui/styles.css)
    tokens.css                 ← all design tokens (colours, radii, spacing, fonts) — light + dark
    theme.css                  ← maps tokens → Tailwind utilities (@theme) + base styles + .field-box etc.
    vendors.css                ← shadcn variable bridging
  components/
    ui/                        ← shadcn-style primitives (Button, Input, Dialog, Table, Badge, …)
    common/                    ← composed building blocks (SelectField, DataTable, Modal, …)
```

### Components you get
**Primitives (`ui/`):** `Button` · `Input` · `Textarea` · `Label` · `Checkbox` ·
`Switch` · `RadioGroup` · `Badge` · `Dialog` · `Popover` · `DropdownMenu` ·
`Tabs` · `Table`.

**Building blocks (`common/`):** `TextField` · `TextareaField` · `SelectField` ·
`PasswordField` · `CheckboxField` · `SwitchField` · `RadioGroupField` ·
`FormBanner` · `StatusBadge` · `Modal` · `DataTable` · `Pagination`.

**Helper:** `cn(...)` — conditional class merging.

> Deliberately **not** included: anything app-specific — the sidebar/top-bar
> shell, i18n, auth, routing, data fetching. Those differ per project. This
> package is the visual foundation; each app builds its own screens on top.

---

## 30-second quick start

```bash
npm install @mostafa-hussein-dev/ui   # plus its peers if you don't have them: react, react-dom, tailwindcss v4
```

`src/index.css` (or wherever your Tailwind entry lives):
```css
@import 'tailwindcss';
@import '@mostafa-hussein-dev/ui/styles.css';
@source '../node_modules/@mostafa-hussein-dev/ui/src';
```

Anywhere in your app:
```tsx
import { Button, TextField, cn } from '@mostafa-hussein-dev/ui'

export function Example() {
  return (
    <div className="p-card">
      <TextField id="name" label="Name" placeholder="Jane Doe" />
      <Button className={cn('mt-4')}>Save</Button>
    </div>
  )
}
```

Full, detailed setup (fonts, dark mode, troubleshooting) is in **`docs/INSTALL.md`**.

---

## Documentation
- **[docs/INSTALL.md](docs/INSTALL.md)** — step-by-step new-project setup and Tailwind wiring (start here).
- **[docs/THEMING.md](docs/THEMING.md)** — tokens, rebranding (one line), dark mode, density, corners, fonts.
- **[docs/USAGE.md](docs/USAGE.md)** — every component with a copy-paste example.

---

## Using it across projects

The point of this package is a **standard template** for all your work. Pick how
you want to consume it (details in `docs/INSTALL.md`):

1. **Private registry (recommended for separate repos)** — publish to GitHub
   Packages as `@mostafa-hussein-dev/ui`, then `npm install @mostafa-hussein-dev/ui` in any project.
2. **Local / file install** — `npm install /path/to/systemize-ui` or
   `"@mostafa-hussein-dev/ui": "file:../systemize-ui"` while iterating.
3. **Git install** — `npm install git+https://github.com/<you>/systemize-ui.git`.
4. **Monorepo workspace** — drop this folder in `packages/ui` and add it to your
   workspaces.

Bump `version` in `package.json` when you change tokens or components so every
project can upgrade deliberately.
