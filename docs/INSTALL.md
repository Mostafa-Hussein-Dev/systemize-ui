# Install & wire up a new project

This guide takes a **fresh Vite + React + TypeScript** app from zero to the
Systemize look. It assumes nothing beyond Node 18+.

Estimated time: ~5 minutes.

---

## 0. (If you don't have one) create the app

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

---

## 1. Install Tailwind v4 and the package

Tailwind v4 is a **peer dependency** — your app owns it (so Tailwind is only
loaded once). Install it and the Vite plugin, then the design system:

```bash
npm install tailwindcss @tailwindcss/vite
npm install @mostafa-hussein-dev/ui
```

> `react`, `react-dom`, and `tailwindcss` are **peer** deps of the package —
> your app already provides them, so npm won't duplicate them. The package's
> own runtime deps (radix, lucide-react, cva, clsx, tailwind-merge,
> @tanstack/react-table, tw-animate-css) install automatically.

Pick a consume method (see README for the list). The simplest while iterating:
```bash
# from your app folder, point at the folder on disk:
npm install "file:../systemize-ui"
```
or publish it once to GitHub Packages and `npm install @mostafa-hussein-dev/ui` everywhere
(see §7).

---

## 2. Enable the Tailwind Vite plugin

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## 3. Wire the stylesheet — the important bit

Create (or edit) your global CSS entry, e.g. `src/index.css`:

```css
/* 1 — Tailwind itself. MUST be first, and only here (never inside the package). */
@import 'tailwindcss';

/* 2 — the Systemize tokens, theme mapping, base styles and vendor bridging. */
@import '@mostafa-hussein-dev/ui/styles.css';

/* 3 — tell Tailwind v4 to scan the package's source for class names, so the
       utilities those components use are actually generated. Path is relative
       to THIS css file; adjust the depth to reach node_modules. */
@source '../node_modules/@mostafa-hussein-dev/ui/src';
```

Why `@source`? Tailwind v4 only generates utilities for classes it can *see* in
your source. By default it does **not** scan `node_modules`, so without this line
the package's components would render unstyled. The `@source` directive adds the
package's `src/` to the scan.

Then import that CSS once, at your app entry (`src/main.tsx`):
```ts
import './index.css'
```

> **Monorepo / workspace note:** if the package lives at `packages/ui` rather
> than in `node_modules`, point `@source` at it directly, e.g.
> `@source '../../packages/ui/src';`.

---

## 4. Set the base theme attributes on `<html>`

The tokens are driven by attributes on the root element. Set sensible defaults
in `index.html`:

```html
<html lang="en" data-theme="light" data-density="spacious" data-corners="rounded">
```

- `data-theme` — `light` (default) or `dark`.
- `data-density` — `spacious` (default) or `compact`.
- `data-corners` — `rounded` (default) or `sharp`.

Dark mode is just `document.documentElement.setAttribute('data-theme', 'dark')`.
See `docs/THEMING.md` for a ready-to-paste theme toggle.

For right-to-left languages, set `dir="rtl"` on `<html>` — the components already
use logical properties and `rtl:` variants, so they flip correctly.

---

## 5. Load the fonts (optional but recommended)

The type scale expects **Sora** (display) and **JetBrains Mono** (monospace);
body text uses the system sans stack. Without these the UI still works — it
falls back gracefully — but to match exactly, add to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

(Or self-host them and declare `@font-face` — the token names are `--font-display`,
`--font-sans`, `--font-mono`, overridable per `docs/THEMING.md`.)

---

## 6. Verify

```tsx
// src/App.tsx
import { Button, TextField, StatusBadge } from '@mostafa-hussein-dev/ui'

export default function App() {
  return (
    <div className="min-h-screen bg-background p-page text-text-primary">
      <h1 className="font-display text-2xl font-bold">It works</h1>
      <div className="mt-4 max-w-sm space-y-3">
        <TextField id="email" label="Email" placeholder="you@example.com" />
        <div className="flex items-center gap-2">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <StatusBadge variant="success">Active</StatusBadge>
        </div>
      </div>
    </div>
  )
}
```

```bash
npm run dev
```

You should see the emerald brand colour, the Sora headline, a bordered focus-ring
input, and pill badges. Toggle `data-theme="dark"` on `<html>` in devtools — the
whole page should recolour instantly.

---

## 7. Publish once, reuse everywhere (GitHub Packages)

To make `npm install @mostafa-hussein-dev/ui` work in every future project:

1. In this package's `package.json`, the name is already scoped (`@mostafa-hussein-dev/ui`).
   Add a `publishConfig` and `repository` pointing at your GitHub repo:
   ```json
   "publishConfig": { "registry": "https://npm.pkg.github.com" }
   ```
2. Create a GitHub repo (e.g. `systemize-ui`) and push this folder to it.
3. Authenticate npm to GitHub Packages with a Personal Access Token that has
   `write:packages` (publishing) / `read:packages` (installing). In `~/.npmrc`:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN
   @systemize:registry=https://npm.pkg.github.com
   ```
4. `npm publish` from this folder.
5. In any consuming project, add a project `.npmrc` with
   `@systemize:registry=https://npm.pkg.github.com`, then
   `npm install @mostafa-hussein-dev/ui`.

Bump `version` each time you change tokens/components; projects upgrade with
`npm update @mostafa-hussein-dev/ui` when they're ready.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Components render **unstyled** | Tailwind isn't scanning the package | Add `@source '../node_modules/@mostafa-hussein-dev/ui/src';` (§3); check the relative path reaches the package |
| `Cannot find module '@mostafa-hussein-dev/ui'` | Not installed / wrong path | Re-run the install from §1; for `file:` installs the path is relative to the consuming app |
| Dark mode doesn't switch | Missing root attribute | Set/toggle `data-theme="dark"` on `<html>`, not a class |
| Colours look wrong / default Tailwind | `@import 'tailwindcss'` missing or **after** the package import | Tailwind must be imported **first** in your CSS entry |
| Fonts look like Times/Arial | Font links not added | Add the `<link>` from §5 (or self-host) |
| `dark:` utilities only follow the OS, not your toggle | You re-imported Tailwind inside the package or overrode the custom variant | Don't `@import 'tailwindcss'` anywhere but your app entry; the package already binds `dark` to `[data-theme='dark']` |
| TS error importing from the package | Bundler not transpiling TS in `node_modules` | On Vite this works out of the box; on other bundlers, allow transpiling this package |
