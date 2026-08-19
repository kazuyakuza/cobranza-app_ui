# Part B — Angular Demo Mini-App Front-end Technical Specification

**Task:** Phase 12 — Replace the static `docs/theme-preview.html` with a real Angular 22 standalone demo app that consumes the built `@cobranza-apps/ui` library.

**Authoritative sources:**
- `docs/theme-preview.html` — content sections to preserve.
- `src/public-api.ts` — exported components.
- `package.json` / `ng-package.json` — build output layout (`dist/`).
- `src/theme/theme.scss` — theme import contract.

---

## 1. Scaffolding decision

### 1.1 Options considered

| Approach | Verdict | Reason |
|----------|---------|--------|
| Separate Angular CLI workspace under `projects/demo/` with its own `node_modules` | Rejected | Duplicates Angular/Bootstrap/Font Awesome installs; slower installs; drift risk. |
| Minimal manual Vite + `@angular/build` setup | Rejected | More config than needed; no CLI conveniences for serve/build. |
| Root-level `angular.json` with one application project `demo`, source under `projects/demo/src`, reusing root `node_modules` | **Selected** | Same Angular 22 version as lib, minimal footprint, conventional CLI scripts, no nested dependency tree. |

### 1.2 Library resolution strategy

Add the built library to root `package.json` as a local `file:` dependency:

```json
"devDependencies": {
  "@cobranza-apps/ui": "file:./dist"
}
```

After `npm run build` emits `dist/`, running `npm install` creates a `node_modules/@cobranza-apps/ui` symlink/copy. This satisfies two resolver paths at once:

- **TypeScript / ES modules:** imports like `import { CbaButtonComponent } from '@cobranza-apps/ui'` resolve through `node_modules/@cobranza-apps/ui/package.json`.
- **Sass:** `@use '@cobranza-apps/ui/theme'` resolves through `node_modules/@cobranza-apps/ui/theme.scss` (and the published `exports["./theme"]` map).

No `tsconfig` paths are required, but a `paths` entry in `projects/demo/tsconfig.app.json` may be kept as a fallback during `ng serve` hot-reloads. It must **not** be used to deep-import `src/` files.

### 1.3 Clear failure when lib is not built

- `npm install` fails if `file:./dist` does not exist.
- `ng build demo` / `ng serve demo` fail with a Sass resolution error on `@use '@cobranza-apps/ui/theme'` if the symlink is stale.
- README and script comments document the required order: `build:lib` → `npm install` (or `npm ci`) → `build:demo` / `start:demo`.

---

## 2. Folder structure and files

```text
angular.json                              # new: single application project 'demo'
package.json                              # add @cobranza-apps/ui file:./dist + scripts
projects/
  demo/
    src/
      index.html
      main.ts
      styles.scss
      app/
        app.config.ts
        app.component.ts
        app.component.html
        app.component.scss
    tsconfig.app.json
```

### 2.1 File responsibilities

| File | Purpose |
|------|---------|
| `angular.json` | Defines project `demo` (root `projects/demo`), builder `@angular-devkit/build-angular:application` or `@angular/build:application`, output `dist/demo/`. |
| `package.json` | Adds `@angular-devkit/build-angular` (or `@angular/build`) devDependency, `@cobranza-apps/ui: file:./dist`, and scripts `build:lib`, `build:demo`, `start:demo`. |
| `projects/demo/tsconfig.app.json` | Extends root `tsconfig.json`, scopes `src/**/*.ts`, enables `strictTemplates`. |
| `projects/demo/src/index.html` | `<html lang="es">`, page title includes "Demo app — consumes `@cobranza-apps/ui` build". |
| `projects/demo/src/main.ts` | Bootstraps standalone `AppComponent` with `bootstrapApplication`. |
| `projects/demo/src/app/app.config.ts` | Empty or minimal `ApplicationConfig` (no router required). |
| `projects/demo/src/app/app.component.ts` | Standalone root component; imports all library components used in the template. |
| `projects/demo/src/app/app.component.html` | All demo sections listed in §3. |
| `projects/demo/src/app/app.component.scss` | Layout chrome + section spacing only; no fake component styles. |
| `projects/demo/src/styles.scss` | Single `@use '@cobranza-apps/ui/theme';` and global `html/body` resets. |

---

## 3. Component usage matrix

Each row maps a `docs/theme-preview.html` section to the real library API in the demo app.

| Preview section | Demo implementation |
|-----------------|---------------------|
| **Shell chrome mock** | Plain markup using theme tokens (`--cba-bg-elevated`, `--cba-border-default`, `--cba-header-height`). Header actions use real `<cba-button>` (`variant="ghost"`, `iconOnly`). |
| **Module card + header + table + footer** | Real `<cba-module-container>`, `<cba-module-header>`, `<cba-module-footer>`. Body contains a plain `<table>` styled with `--cba-bg-tertiary`, `--cba-border-default`, etc. Table is not a library component. |
| **Token swatches** | Grid of `<div>` elements whose background/text/color reads from CSS variables via inline `style="background: var(--cba-*)"`. Labels show the token name only; no duplicated hex tables. |
| **Button state matrix** | Real `<cba-button>` instances: variants `primary`, `secondary`, `ghost`, `danger`, `success`; sizes `sm`/`md`; `disabled`, `loading`. Rendered on three surface panels (`--cba-bg-secondary`, `--cba-bg-elevated`, `--cba-bg-primary`). |
| **Text on surfaces** | Four panels (`canvas`, `panel`, `elevated`, `inset`) with spans using `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted` (where allowed), `.cba-text-inverse`. Include the documented WCAG-AA restriction callout for muted on canvas/inset. |
| **Border scale** | Three swatch boxes using `border: 1px solid var(--cba-border-*)`. |
| **Selected / nav / footer pills** | Plain markup using `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover`; no fake component classes. |
| **Form states** | Real `<cba-input>` and `<cba-select>` inside `<cba-field>` wrappers showing `disabled`, `readonly`, `valid`, `error` states. Static visual boxes may supplement missing states only if the component does not expose them. |
| **Type scale** | Samples using `.cba-text-display`, `.cba-text-heading-lg`, `.cba-text-heading-md`, `.cba-text-body`, `.cba-text-small`, `.cba-text-caption` utilities. |
| **Semantic status** | Real `<cba-badge>` with `variant` = `success`, `warning`, `danger`, `info`, `neutral` and `appearance` = `solid` / `outline`. |
| **Accent pills** | Plain markup using `--cba-accent-*` as background or border; no library component needed. |
| **Radius & shadow** | Utility-class samples from the theme: `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`, `.cba-shadow-module`, `.cba-shadow-elevated`. |

### 3.1 Component APIs to use

```ts
import {
  CbaButtonComponent,
  CbaBadgeComponent,
  CbaInputComponent,
  CbaSelectComponent,
  CbaFieldComponent,
  CbaModuleContainerComponent,
  CbaModuleFooterComponent,
  ModuleHeaderComponent,
} from '@cobranza-apps/ui';
```

#### `cba-button`
- Inputs: `variant`, `size`, `disabled`, `loading`, `icon`, `iconPosition`, `iconOnly`, `block`.
- Output: `cbaClick`.
- Use Font Awesome icons imported from `@fortawesome/free-solid-svg-icons`.

#### `cba-module-container`
- Inputs: `size` (`'50%'` | `'100%'`), `isCollapsed`, `isFullscreen`, `padding` (`'sm'` default).
- Content projection: `<cba-module-header cbaModuleContainerHeader>` + default body.

#### `cba-module-header`
- Inputs: `title`, `size`, `isCollapsed`, `isFullscreen`, `status`.
- Outputs: `collapseToggle`, `sizeToggle`, `fullscreenToggle`, `remove`.
- Demo handlers are no-ops; event wiring is required only to satisfy type checks.

#### `cba-module-footer`
- Inputs: `status`, `statusText`.

#### `cba-input` / `cba-select`
- Use `ngModel` or reactive forms for interactive samples.
- Use `cba-field` wrapper directly when demonstrating label/hint/error layout.

---

## 4. Styling architecture

- `styles.scss` contains **only**:
  ```scss
  @use '@cobranza-apps/ui/theme';
  ```
  plus minimal `html, body { margin: 0; }` and base font family.
- `app.component.scss` contains layout chrome only:
  - App shell grid/flex.
  - Section spacing and max-width.
  - Preview-only utility classes for demo grids (`.demo-swatch-grid`, `.demo-section`).
- **No `.pv-btn` fake button CSS.** Buttons must come from `<cba-button>`.
- Token swatches derive values from CSS variables at runtime, not from duplicated hex maps.

### 4.1 Theme constraints

- Single theme: **Minimal Yet Warm**.
- No theme switcher UI (optional only if already supported by the library; it is not).
- Desktop-only: no responsive breakpoints required.

### 4.2 Spanish copy

Library-owned strings (aria-labels, module header tooltips, footer status) are rendered by the library components in Spanish via `CBA_UI_MESSAGES`. Demo-only labels (section headings, table captions) are also in Spanish.

### 4.3 Accessibility

- `lang="es"` on `<html>`.
- Page label clearly identifies the demo: "Demo app — consumes `@cobranza-apps/ui` build".
- Interactive demo controls use native elements or library components.
- Icon-only buttons carry `aria-label`.

---

## 5. Build/serve pipeline

### 5.1 Required dependency additions

Add to root `package.json` `devDependencies`:

```json
{
  "@angular-devkit/build-angular": "22.1.2",
  "@cobranza-apps/ui": "file:./dist"
}
```

Use `@angular/build` instead of `@angular-devkit/build-angular` if the CLI version aligns with that builder. The builder must match Angular 22.1.2.

### 5.2 npm scripts

```json
{
  "build:lib": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
  "build:demo": "npm run build:lib && ng build demo",
  "start:demo": "ng serve demo"
}
```

Notes:
- `build:demo` always builds the library first so the demo consumes the latest output.
- `start:demo` does **not** rebuild the library automatically; the developer must run `npm run build:lib` first.
- Document this ordering in README/CONSUMER_GUIDE.

### 5.3 Output

- Library: `dist/` (existing).
- Demo app: `dist/demo/` (new).
- Both folders are produced by the pipeline in `build:demo`.

---

## 6. Content parity checklist against `docs/theme-preview.html`

The following sections must be present in `app.component.html`:

- [ ] Preview bar with the text "Demo app — consumes `@cobranza-apps/ui` build".
- [ ] Shell header mock with real `cba-button` actions.
- [ ] Workspace canvas (`--cba-bg-primary`) containing module examples.
- [ ] At least one expanded `100%` module with header + table + footer.
- [ ] At least one `50%` module and one collapsed module.
- [ ] Token swatch grid (backgrounds, text, borders, accents, interactive, selected, form-state tokens).
- [ ] Button matrix: 5 variants × 3 surfaces × normal/disabled/loading; sizes `sm`/`md`.
- [ ] Text-on-surfaces samples with WCAG-AA restriction callout.
- [ ] Accent pills and raw source-color strip.
- [ ] Typography scale for all six steps.
- [ ] Border scale (subtle/default/strong).
- [ ] Selected states: footer pills, nav items, table rows.
- [ ] Form states using real `cba-input` / `cba-select` / `cba-field`.
- [ ] Semantic status badges (`solid` + `outline`).
- [ ] Radius & shadow utility samples.
- [ ] Shell footer pill nav mock.

---

## 7. Verification criteria

Before the demo app is accepted:

1. `npm run build:lib` succeeds.
2. `npm run build:demo` succeeds and emits `dist/demo/`.
3. `npm run start:demo` serves without runtime errors (manual smoke).
4. `<cba-button variant="primary">` renders a solid `--cba-accent-primary` fill with `--cba-text-inverse` label.
5. `<cba-module-container>` visually separates canvas, panel, and elevated surfaces.
6. No `.pv-btn` selectors remain in the demo app styles.
7. No duplicated hex tables drive component looks; token swatches use `var(--cba-*)` only.
8. Page title/banner clearly labels the demo as consuming `@cobranza-apps/ui` build.

---

## 8. Out of scope

- Replacing Minimal Yet Warm.
- Mobile/responsive layout.
- Storybook or full design-system site.
- Playwright tests.
- Drag-and-drop in the demo.
- Part A host-encapsulation fixes and Part C doc/publish/removal work.
