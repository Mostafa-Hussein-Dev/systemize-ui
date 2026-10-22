# Claude Code agent prompt — adopt @mostafa-hussein-dev/ui in a new project

Paste the block below into Claude Code **inside the new project**. Fill in the
two bracketed bits first (`APP_NAME`, and how the package is installed).

---

```
We use a shared design system package, @mostafa-hussein-dev/ui (the "Systemize"
UI). Set this project up to use it so the UI/UX matches our other apps. This is
a Vite + React + TypeScript + Tailwind v4 project.

Do all of the following, then run the typecheck/build to prove it works:

1. Install dependencies:
   - npm install tailwindcss @tailwindcss/vite
   - Install the design system. It is published to GitHub Packages under the
     @mostafa-hussein-dev scope, so first create a project .npmrc with:
       @mostafa-hussein-dev:registry=https://npm.pkg.github.com
     then: npm install @mostafa-hussein-dev/ui
     (If I tell you to use a local path instead, run:
       npm install "file:../systemize-ui")

2. Enable the Tailwind v4 Vite plugin in vite.config.ts:
     import tailwindcss from '@tailwindcss/vite'
     plugins: [react(), tailwindcss()]

3. In the global CSS entry (e.g. src/index.css), in EXACTLY this order:
     @import 'tailwindcss';
     @import '@mostafa-hussein-dev/ui/styles.css';
     @source '../node_modules/@mostafa-hussein-dev/ui/src';
   Tailwind MUST be imported first and only here. The @source line is required
   so Tailwind generates the utilities the package's components use; adjust its
   relative path to reach node_modules. Import this CSS once in src/main.tsx.

4. In index.html set the theme attributes on <html>:
     <html lang="en" data-theme="light" data-density="spacious" data-corners="rounded">
   And add the fonts (Sora + JetBrains Mono) via Google Fonts <link> (see the
   package's docs/INSTALL.md §5).

5. Apply the saved theme before React renders, in src/main.tsx BEFORE
   createRoot(...).render(...):
     import { applyTheme, getInitialTheme, applyFeel, getStoredDensity, getStoredCorners } from '@mostafa-hussein-dev/ui'
     applyTheme(getInitialTheme())
     applyFeel(getStoredDensity(), getStoredCorners())

6. Build the app chrome with the shell. Create an AppShell-based layout that
   wraps the routed <Outlet/>. Pass: appName="APP_NAME", currentPath from
   react-router's useLocation().pathname, a Link adapter around react-router's
   Link (ShellLinkProps -> RouterLink, mapping `active` to aria-current), the
   signed-in user, the nav groups (with lucide icons and labels), and
   userActions (e.g. log out). Follow the example in the package's
   docs/USAGE.md "Application shell" section exactly.

7. Use the package's components everywhere instead of hand-rolling UI:
   Button, Input, Textarea, Badge, Tabs, Table and the composed building blocks
   TextField, SelectField, PasswordField, CheckboxField, SwitchField,
   RadioGroupField, FormBanner, StatusBadge, Modal, DataTable, Pagination, and
   the cn() helper. Import everything from '@mostafa-hussein-dev/ui'. See
   docs/USAGE.md for every component's props and examples.

8. Styling rules (match our conventions):
   - Never use raw hex colours. Use the token utilities: bg-background, bg-card,
     bg-surface-secondary, text-text-primary/secondary/muted, border-border,
     bg-brand / text-brand / bg-brand-soft, and status variants.
   - Use the density spacing utilities for page/card layout: p-page, p-card,
     gap-grid, and font-display for headings, font-mono for numbers/codes.
   - Dark mode is driven by <html data-theme="dark">; use `dark:` utilities only
     if needed — the tokens already handle both themes.
   - To rebrand this project's accent, override only --brand in our own CSS after
     the package import; do not edit component colours.

9. Do NOT copy the package's component source into this repo and do NOT fork its
   styles. Consume it as a dependency so every project stays in sync. If a
   primitive or token is missing, tell me — we add it to the package, not here.

Then: run `npx tsc --noEmit` and `npm run build`, fix any issues, and start the
dev server so I can see the shell + a sample page using these components.

Reference docs live in the package: README.md, docs/INSTALL.md, docs/THEMING.md,
docs/USAGE.md.
```
