# Phase 12 — Part B: Angular Demo Mini-App — Implementation Plan

**Task source:** `.agent/todos/20260818/20260818-todo-0.md` → Part B (Angular demo mini-app).
**Front-end spec (input):** `.kilo/plans/20260818-phase12-frontend-spec-partB.md` (auto-approved).
**Plan output (this file):** `.kilo/plans/20260818-phase12-partB-plan.md`
**Scope:** Part B ONLY. Scaffolding, content, scripts, and build verification of the demo app. Part A (encapsulation) is `[DONE]`. Part C (publish pipeline, remove `docs/theme-preview.html`, retarget docs) is **out of scope** and will be planned separately.

---

## 1. Pre-analysis & key decisions

### 1.1 Library resolution strategy (spec §1.2)

The demo app MUST consume the BUILT library (`dist/`), never deep-import `src/`.

**Mechanism:** add the built library as a local `file:` dependency in the ROOT `package.json`:

```json
"devDependencies": {
  "@cobranza-apps/ui": "file:./dist"
}
```

After `npm run build:lib` emits `dist/`, running `npm install` makes npm materialize
`node_modules/@cobranza-apps/ui` as a copy/symlink of `./dist`. Two resolver paths are then satisfied:

- **TS / ES modules:** `import { CbaButtonComponent } from '@cobranza-apps/ui'` resolves via
  `node_modules/@cobranza-apps/ui/package.json` (the published `public-api` entry).
- **Sass:** `@use '@cobranza-apps/ui/theme'` resolves via `node_modules/@cobranza-apps/ui/theme/theme.scss`
  (published by `ng-package.json` asset glob) and the `exports["./theme"]` map in the built `dist/package.json`.

**CRITICAL — tsconfig path override (spec §1.2, "must NOT deep-import src/"):**

The ROOT `tsconfig.json` currently maps:

```json
"paths": { "@cobranza-apps/ui": ["src/public-api.ts"] }
```

`projects/demo/tsconfig.app.json` EXTENDS the root tsconfig and would INHERIT that mapping, which would
point the demo compiler at the library SOURCE entry (`src/public-api.ts`) — exactly the deep-`src/`
import the TODO forbids. The demo tsconfig MUST override `paths` to remove that mapping so resolution
falls through to `node_modules/@cobranza-apps/ui` (the `file:./dist` package).

TypeScript does NOT merge `paths` across extends — a child `paths` REPLACES the parent's. Therefore the
demo tsconfig sets `"paths": {}` (empty mapping), forcing node_modules resolution. No `baseUrl` override
needed (inherited `"./"` is harmless with an empty paths map).

The spec's optional "paths fallback for ng serve hot-reload" is NOT used: it would re-introduce a
source-pointing mapping. The documented hot-reload workflow is: re-run `npm run build:lib`, then restart
`ng serve demo`. `start:demo` does NOT auto-rebuild the lib (spec §5.2).

**Clear failure when lib is not built (spec §1.3):**

- `npm install` fails if `file:./dist` does not exist (npm error: package not found).
- `ng build demo` / `ng serve demo` fail with a Sass resolution error on
  `@use '@cobranza-apps/ui/theme'` if the symlink/copy is stale or missing.
- README/CONSUMER_GUIDE note (small, in-scope per spec §5.2) documents the required order:
  `build:lib` → `npm install` (or `npm ci`) → `build:demo` / `start:demo`.

### 1.2 Builder choice (spec §5.1)

Use `@angular-devkit/build-angular:application` with `@angular-devkit/build-angular` version `22.1.2`
(matching `@angular/cli` 22.1.2 and Angular 22.1.2 already in devDependencies). This builder is
well-established, published at that exact version, and provides both `application` (build) and
`dev-server` (serve) builders. The `application` builder uses the new `browser` key for the entry
(not the legacy `main` key) and a string `outputPath`.

### 1.3 Gap resolution — `CbaFieldComponent` is NOT public (spec §3.1 vs reality)

The spec's import block lists `CbaFieldComponent` and §3 says form states use `<cba-field>` wrappers.
However, `src/components/form-field/cba-field.component.ts` is explicitly INTERNAL — its barrel comment
states "Not part of the public API" and `src/public-api.ts` does NOT re-export it.

`CbaInputComponent` and `CbaSelectComponent` already extend `CbaFieldControlValueAccessor`, which
exposes `label`, `hint`, `error`, `readonly`, `valid`, and `disabled` inputs, and each component renders
a `CbaFieldComponent` internally. So the form-state demo intent (label / hint / error / disabled /
readonly / valid visuals) is FULLY covered by using `<cba-input>` and `<cba-select>` directly with those
inputs — NO standalone `<cba-field>` wrapper is needed (wrapping `<cba-input>` in `<cba-field>` would
double-nest the field layout).

**Decision (least-scope, no public-API change):** the demo uses `<cba-input>` / `<cba-select>` with
their `label` / `hint` / `error` / `readonly` / `valid` / `disabled` inputs for the Form states section.
`CbaFieldComponent` is NOT imported and NOT exported. This is recorded as an **accepted deviation** from
the spec's literal import line; it preserves the spec's intent and avoids expanding the library's public
semver surface (which is out of Part B scope).

### 1.4 Component class names (verified from source)

| Spec symbol | Verified export | Selector |
|-------------|-----------------|----------|
| `CbaButtonComponent` | `src/components/button/cba-button.component.ts` | `cba-button` |
| `CbaBadgeComponent` | `src/components/badge/cba-badge.component.ts` | `cba-badge` |
| `CbaInputComponent` | `src/components/input/cba-input.component.ts` | `cba-input` |
| `CbaSelectComponent` | `src/components/select/cba-select.component.ts` | `cba-select` |
| `CbaModuleContainerComponent` | `src/components/module-container/module-container.component.ts` | `cba-module-container` |
| `CbaModuleFooterComponent` | `src/components/module-footer/module-footer.component.ts` | `cba-module-footer` |
| `ModuleHeaderComponent` | `src/components/module-header/module-header.component.ts` | `cba-module-header` |
| `CbaFieldComponent` | **internal — NOT used** | `cba-field` |

Badge API (verified): `variant` ∈ `primary|success|warning|danger|info|neutral`, `appearance` ∈ `solid|outline`.
Module header content-projection attribute: `cbaModuleContainerHeader` (used as
`<cba-module-header cbaModuleContainerHeader>`).

### 1.5 Theme import (spec §4)

`projects/demo/src/styles.scss` contains exactly:

```scss
@use '@cobranza-apps/ui/theme';

html, body { margin: 0; }
body { font-family: var(--cba-font-family-base, system-ui, sans-serif); }
```

No `bootstrap` CSS import (the library theme is self-contained; spec §4 does not list bootstrap).
No per-component styles in `styles.scss`.

### 1.6 Scope boundaries

- IN: scaffold `angular.json` + `projects/demo/**`, update root `package.json` (deps + scripts), build
  verification (`build:lib`, `build:demo`, `start:demo` smoke), small README/CONSUMER_GUIDE command-order
  note (spec §5.2).
- OUT (Part C / separate): removing `docs/theme-preview.html` + `theme-preview.css`, retargeting all doc
  links, CI integration, packaging the demo as a publish artifact, changelog entry for the demo
  replacement. (A changelog entry for the NEW demo app + new scripts/deps WILL be added per the
  changelog-versioning rule, because every change landing on `main` must be recorded under a dated
  version header. Version bump is Part B since it ships the new files + scripts.)

---

## 2. High-level approach

1. On the existing feature branch (created in Critical Workflow Step 2), update root `package.json`:
   add `@cobranza-apps/ui: file:./dist` and `@angular-devkit/build-angular: 22.1.2` to devDependencies;
   add scripts `build:lib`, `build:demo`, `start:demo`.
2. Create `angular.json` at repo root with a single application project `demo` rooted at `projects/demo`.
3. Create `projects/demo/tsconfig.app.json` extending root tsconfig, OVERRIDING `paths: {}` to force
   node_modules resolution, and setting `compilationMode: full`.
4. Scaffold `projects/demo/src/**`: `index.html`, `main.ts`, `styles.scss`, `app.config.ts`,
   `app.component.ts`, `app.component.html`, `app.component.scss`.
5. Build the library (`npm run build:lib`), then `npm install` (materializes
   `node_modules/@cobranza-apps/ui` from `file:./dist`), then `npm run build:demo` and verify
   `dist/demo/` is emitted.
6. `npm run start:demo` manual smoke; verify acceptance criteria.
7. Add a minimal command-order note to README + CONSUMER_GUIDE (spec §5.2).
8. Bump `package.json` version (minor: new feature = demo app + scripts) and add a dated CHANGELOG
   header per changelog-versioning rule.
9. Commit all changes on the feature branch with a meaningful message.

All file creations use `vscode-mcp-server_create_file_code` (tool-selection-priority rule). Edits to
existing files use `vscode-mcp-server_replace_lines_code` or `edit`.

---

## 3. File inventory

### 3.1 New files

| Path | Purpose |
|------|---------|
| `angular.json` | Root Angular CLI config; single `demo` application project. |
| `projects/demo/tsconfig.app.json` | Demo app TS config; extends root, overrides `paths`, `compilationMode: full`. |
| `projects/demo/src/index.html` | App shell HTML; `lang="es"`, demo-labeled title. |
| `projects/demo/src/main.ts` | `bootstrapApplication(AppComponent, appConfig)`. |
| `projects/demo/src/styles.scss` | `@use '@cobranza-apps/ui/theme'` + base resets only. |
| `projects/demo/src/app/app.config.ts` | Minimal `ApplicationConfig` (zone change detection; no router). |
| `projects/demo/src/app/app.component.ts` | Standalone root; imports the 7 library components + `FormsModule`. |
| `projects/demo/src/app/app.component.html` | All demo sections (§5 of this plan). |
| `projects/demo/src/app/app.component.scss` | Layout chrome + demo-grid utilities only; no `.pv-btn`. |

### 3.2 Modified files

| Path | Change |
|------|--------|
| `package.json` | + `@cobranza-apps/ui: file:./dist`, + `@angular-devkit/build-angular: 22.1.2` (devDeps); + scripts `build:lib`, `build:demo`, `start:demo`; bump `version` (minor). |
| `README.md` | Small "Demo app" subsection: command order (`build:lib` → `npm install` → `build:demo` / `start:demo`). |
| `docs/CONSUMER_GUIDE.md` | Same command-order note (spec §5.2). |
| `CHANGELOG.md` | New dated `[x.y.z] — 2026-08-18` header (Added: demo app + scripts; no `[Unreleased]`). |

### 3.3 NOT modified / NOT created (out of scope)

- `docs/theme-preview.html`, `docs/theme-preview.css` — untouched (Part C removes them).
- `ng-package.json`, `tsconfig.json`, `tsconfig.lib.json` — untouched.
- `src/**` library sources — untouched (Part A done).
- No `projects/demo/tsconfig.spec.json` (no demo unit tests required by spec).
- No `projects/demo/tsconfig.json` (the demo uses `tsconfig.app.json` extending root directly).

---

## 4. Detailed step-by-step plan

### Step 0 — Preconditions & git state

- Confirm current branch is the feature branch from Critical Workflow Step 2 (e.g. `feat/phase12-demo-app`).
  If not, STOP and return a question to the caller (do not switch branches — that is Step 2's job, already done).
- `git status` must be clean of unrelated staged changes. If unstaged unrelated files exist, commit them
  first with a meaningful message (gitignore-compliance rule: read `.gitignore`, ensure no
  `dist/` / `node_modules/` / `.angular/` are staged).
- No new tmp folders (no-play-in-external-paths rule).

### Step 1 — Update root `package.json`

Use `vscode-mcp-server_replace_lines_code` (or `edit`) on `package.json`.

**1a. Add scripts** (replace the existing `scripts` block):

```json
"scripts": {
  "build": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
  "build:lib": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
  "build:demo": "npm run build:lib && ng build demo",
  "start:demo": "ng serve demo",
  "build:preview": "sass src/theme/theme.scss docs/theme-preview.css --no-source-map --style=compressed",
  "test": "jest --passWithNoTests",
  "lint": "eslint \"src/**/*.ts\"",
  "format": "prettier --write \"src/**/*.{ts,scss,css,json,md}\""
}
```

Notes:
- `build:lib` aliases the existing library build (keeps `build` unchanged for back-compat).
- `build:demo` always builds the library first so the demo consumes the latest `dist/`.
- `start:demo` does NOT rebuild the library (documented dev workflow).

**1b. Add devDependencies** (insert in alphabetical order within `devDependencies`):

```json
"@angular-devkit/build-angular": "22.1.2",
"@cobranza-apps/ui": "file:./dist",
```

Place `@angular-devkit/build-angular` immediately before `@angular/cli` (alphabetical), and
`@cobranza-apps/ui` immediately before `@fortawesome/angular-fontawesome`.

**1c. Bump version** (minor for new feature): e.g. `"version": "0.16.1"` → `"version": "0.17.0"`.
The implementer MUST verify the current version in `package.json` before bumping and use the next
minor; do not blindly use `0.17.0` if the file already shows a higher version.

### Step 2 — Create `angular.json`

`vscode-mcp-server_create_file_code` at repo root. Exact content:

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "demo": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "standalone": true,
          "changeDetection": "OnPush"
        }
      },
      "root": "projects/demo",
      "sourceRoot": "projects/demo/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/demo",
            "index": "projects/demo/src/index.html",
            "browser": "projects/demo/src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "projects/demo/tsconfig.app.json",
            "assets": [],
            "styles": ["projects/demo/src/styles.scss"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                { "type": "initial", "maximumWarning": "1mb", "maximumError": "2mb" },
                { "type": "anyComponentStyle", "maximumWarning": "8kb", "maximumError": "16kb" }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": { "buildTarget": "demo:build:production" },
            "development": { "buildTarget": "demo:build:development" }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

Notes:
- `outputPath: "dist/demo"` lives under the gitignored `dist/` (so demo build output is not committed);
  the SOURCE under `projects/demo/` IS committed (not gitignored).
- `"browser"` (not `"main"`) is the `application` builder's entry key.
- `assets: []` — no extra assets needed; theme comes via `@use` in `styles.scss`.
- `prefix: "app"` — the only component is `AppComponent` (`app-root`); library selectors use `cba-`.

### Step 3 — Create `projects/demo/tsconfig.app.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc-demo",
    "types": ["node"],
    "paths": {}
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"],
  "angularCompilerOptions": {
    "compilationMode": "full",
    "strictTemplates": true
  }
}
```

CRITICAL rationale (see §1.1): `"paths": {}` overrides the inherited root
`"@cobranza-apps/ui": ["src/public-api.ts"]` mapping, forcing TS to resolve
`@cobranza-apps/ui` from `node_modules/@cobranza-apps/ui` (the `file:./dist` package).
`compilationMode: full` is required for an application (consumes the library's partial compilation).
`strictTemplates: true` re-asserted per spec §2.1 (already inherited, but explicit here).

### Step 4 — Create `projects/demo/src/index.html`

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>@cobranza-apps/ui — Demo app (consumes the built library)</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

`lang="es"` (spec §4.3). Title clearly labels the demo as consuming the `@cobranza-apps/ui` build
(acceptance criterion 8 / spec §6 first checkbox).

### Step 5 — Create `projects/demo/src/main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

### Step 6 — Create `projects/demo/src/styles.scss`

```scss
// Demo app global styles.
// Single source of visual truth: the built @cobranza-apps/ui theme.
// Do NOT add component styles here; component looks come from library components.
@use '@cobranza-apps/ui/theme';

html,
body {
  margin: 0;
}

body {
  font-family: var(--cba-font-family-base, system-ui, sans-serif);
}
```

### Step 7 — Create `projects/demo/src/app/app.config.ts`

```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
};
```

No router (spec §2.1: "no router required"). No animations provider (library uses CSS animations only).

### Step 8 — Create `projects/demo/src/app/app.component.ts`

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  faMagnifyingGlass,
  faBell,
  faGear,
  faRefresh,
  faPlus,
  faSave,
  faTrash,
  faDownload,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  CbaBadgeComponent,
  CbaButtonComponent,
  CbaInputComponent,
  CbaModuleContainerComponent,
  CbaModuleFooterComponent,
  CbaSelectComponent,
  ModuleHeaderComponent,
} from '@cobranza-apps/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CbaButtonComponent,
    CbaBadgeComponent,
    CbaInputComponent,
    CbaSelectComponent,
    CbaModuleContainerComponent,
    CbaModuleFooterComponent,
    ModuleHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly pageTitle = 'Demo app — consumes @cobranza-apps/ui build';

  // Font Awesome icon definitions bound to <cba-button [icon]="...">.
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faBell = faBell;
  protected readonly faGear = faGear;
  protected readonly faRefresh = faRefresh;
  protected readonly faPlus = faPlus;
  protected readonly faSave = faSave;
  protected readonly faTrash = faTrash;
  protected readonly faDownload = faDownload;
  protected readonly faFilter = faFilter;

  // Interactive form samples (ngModel).
  protected sampleText = '';
  protected sampleSelect = '';

  // No-op handlers for module header outputs (event wiring required for type checks).
  protected onCollapse(): void {}
  protected onSizeToggle(): void {}
  protected onFullscreen(): void {}
  protected onRemove(): void {}
}
```

Notes:
- `FormsModule` is required for `[(ngModel)]` on the form-state demos (spec §3.1).
- `CbaFieldComponent` is intentionally NOT imported (§1.3).
- Icon imports come from `@fortawesome/free-solid-svg-icons` (already a devDependency); icon-only
  buttons must carry `aria-label` (spec §4.3) — applied in the template.
- No-op output handlers satisfy `strictTemplates` output binding type checks (spec §3.1).

### Step 9 — Create `projects/demo/src/app/app.component.html`

This is the largest file. It must cover every section in spec §6 content-parity checklist and the
matrix in spec §3. Structure: a top preview bar, a shell header mock, a workspace canvas with module
examples, then a stacked showcase of every token/component section. All Spanish copy. No `.pv-btn`
classes. Token swatches use `var(--cba-*)` inline only — no duplicated hex tables.

Section order (mirrors `docs/theme-preview.html`):

1. Preview bar
2. Shell header mock
3. Workspace canvas with module examples (100% expanded + table + footer; 50% module; collapsed module)
4. Token swatches (backgrounds, text, borders, accents, interactive, selected, form-state)
5. Button states matrix (5 variants × 3 surfaces × normal/disabled/loading; sizes sm/md)
6. Text on surfaces (4 panels + WCAG-AA callout)
7. Accent pills + raw source-color strip
8. Typography scale (6 steps)
9. Border scale (subtle/default/strong)
10. Selected states (footer pills, nav items, table rows)
11. Form states (real `<cba-input>` / `<cba-select>` with label/hint/error/readonly/valid/disabled)
12. Semantic status badges (solid + outline, all 6 variants)
13. Radius & shadow utilities
14. Shell footer pill nav mock

Template skeleton (the implementer fills each section; key binding patterns shown):

```html
<div class="demo-app">

  <!-- 1. Preview bar -->
  <div class="preview-bar">
    <strong>{{ pageTitle }}</strong>
    <span>Minimal Yet Warm · tema único · demo de escritorio</span>
  </div>

  <!-- 2. Shell header mock -->
  <header class="shell-header">
    <div class="shell-header__brand">Cobranza · Back-office</div>
    <div class="shell-header__search">
      <cba-input placeholder="Buscar cliente, factura, deuda…" [icon]="faMagnifyingGlass" />
    </div>
    <div class="shell-header__actions">
      <cba-button variant="ghost" [iconOnly]="true" [icon]="faBell" aria-label="Notificaciones" />
      <cba-button variant="ghost" [iconOnly]="true" [icon]="faGear" aria-label="Configuración" />
    </div>
  </header>

  <!-- 3. Workspace canvas + module examples -->
  <main class="workspace">
    <!-- 3a. 100% expanded module with header + table + footer -->
    <cba-module-container [size]="'100%'" [padding]="'md'">
      <cba-module-header
        cbaModuleContainerHeader
        title="Cartera de clientes"
        [size]="'100%'"
        [isCollapsed]="false"
        [isFullscreen]="false"
        status="loaded"
        (collapseToggle)="onCollapse()"
        (sizeToggle)="onSizeToggle()"
        (fullscreenToggle)="onFullscreen()"
        (remove)="onRemove()">
      </cba-module-header>

      <table class="demo-table">
        <thead>
          <tr><th>Documento</th><th>Nombre</th><th>Deuda</th><th>Estado</th></tr>
        </thead>
        <tbody>
          <tr><td>20-12345678-9</td><td>Comercial del Sur S.A.</td><td>$ 1.250.000</td>
            <td><cba-badge variant="warning" appearance="solid">Vencida</cba-badge></td></tr>
          <tr><td>27-99887766-5</td><td>Distribuidora Norte</td><td>$ 480.000</td>
            <td><cba-badge variant="success" appearance="solid">Al día</cba-badge></td></tr>
          <tr><td>30-55443322-1</td><td>Tecnología Andina</td><td>$ 0</td>
            <td><cba-badge variant="neutral" appearance="outline">Saldado</cba-badge></td></tr>
        </tbody>
      </table>

      <cba-module-footer status="loaded">3 clientes · deuda total $ 1.730.000</cba-module-footer>
    </cba-module-container>

    <!-- 3b. 50% module -->
    <cba-module-container [size]="'50%'" [padding]="'sm'">
      <cba-module-header
        cbaModuleContainerHeader
        title="Acciones rápidas"
        [size]="'50%'"
        status="success"
        (collapseToggle)="onCollapse()"
        (sizeToggle)="onSizeToggle()"
        (fullscreenToggle)="onFullscreen()"
        (remove)="onRemove()">
      </cba-module-header>
      <div class="demo-actions">
        <cba-button variant="primary" [icon]="faPlus">Nuevo cliente</cba-button>
        <cba-button variant="secondary" [icon]="faRefresh">Sincronizar</cba-button>
        <cba-button variant="ghost" [icon]="faDownload">Exportar</cba-button>
      </div>
    </cba-module-container>

    <!-- 3c. Collapsed module -->
    <cba-module-container [size]="'50%'" [isCollapsed]="true" [padding]="'sm'">
      <cba-module-header
        cbaModuleContainerHeader
        title="Módulo colapsado (demo)"
        [size]="'50%'"
        [isCollapsed]="true"
        status="dirty"
        (collapseToggle)="onCollapse()"
        (sizeToggle)="onSizeToggle()"
        (fullscreenToggle)="onFullscreen()"
        (remove)="onRemove()">
      </cba-module-header>
    </cba-module-container>
  </main>

  <!-- 4. Token swatches -->
  <section class="demo-section">
    <h2>Tokens de color</h2>
    <p class="section-caption">Valores leídos en runtime vía var(--cba-*) — sin tablas hex duplicadas.</p>
    <div class="demo-swatch-grid">
      <div class="demo-swatch" style="background: var(--cba-bg-primary)">bg-primary</div>
      <div class="demo-swatch" style="background: var(--cba-bg-secondary)">bg-secondary</div>
      <div class="demo-swatch" style="background: var(--cba-bg-tertiary)">bg-tertiary</div>
      <div class="demo-swatch" style="background: var(--cba-bg-elevated)">bg-elevated</div>
      <div class="demo-swatch" style="background: var(--cba-bg-inset)">bg-inset</div>
      <div class="demo-swatch demo-swatch--text" style="background: var(--cba-text-primary); color: var(--cba-bg-elevated)">text-primary</div>
      <div class="demo-swatch demo-swatch--text" style="background: var(--cba-text-secondary); color: var(--cba-bg-elevated)">text-secondary</div>
      <div class="demo-swatch demo-swatch--text" style="background: var(--cba-text-muted); color: var(--cba-bg-elevated)">text-muted</div>
      <div class="demo-swatch demo-swatch--text" style="background: var(--cba-text-inverse); color: var(--cba-bg-primary)">text-inverse</div>
      <div class="demo-swatch" style="background: var(--cba-accent-primary)">accent-primary</div>
      <div class="demo-swatch" style="background: var(--cba-accent-primary-hover)">accent-primary-hover</div>
      <div class="demo-swatch" style="background: var(--cba-accent-success)">accent-success</div>
      <div class="demo-swatch" style="background: var(--cba-accent-danger)">accent-danger</div>
      <div class="demo-swatch" style="background: var(--cba-accent-warning)">accent-warning</div>
      <div class="demo-swatch" style="background: var(--cba-accent-info)">accent-info</div>
      <div class="demo-swatch" style="background: var(--cba-selected-bg); color: var(--cba-selected-text)">selected-bg</div>
      <div class="demo-swatch" style="background: var(--cba-state-valid-bg)">state-valid-bg</div>
      <div class="demo-swatch" style="background: var(--cba-state-error-bg)">state-error-bg</div>
    </div>
  </section>

  <!-- 5. Button states matrix -->
  <section class="demo-section">
    <h2>Estados de botón</h2>
    <p class="section-caption">Variants × surfaces × normal/disabled/loading; sizes sm/md.</p>

    <div class="demo-surfaces">
      <div class="demo-surface demo-surface--secondary">
        <h3>bg-secondary · panel</h3>
        <div class="demo-btn-row">
          <cba-button variant="primary">Primary</cba-button>
          <cba-button variant="secondary">Secondary</cba-button>
          <cba-button variant="ghost">Ghost</cba-button>
          <cba-button variant="danger">Danger</cba-button>
          <cba-button variant="success">Success</cba-button>
        </div>
        <div class="demo-btn-row">
          <cba-button variant="primary" [disabled]="true">Disabled</cba-button>
          <cba-button variant="secondary" [loading]="true">Loading</cba-button>
          <cba-button variant="ghost" size="sm">Ghost sm</cba-button>
          <cba-button variant="primary" size="sm">Primary sm</cba-button>
        </div>
      </div>

      <div class="demo-surface demo-surface--elevated">
        <h3>bg-elevated</h3>
        <div class="demo-btn-row">
          <cba-button variant="primary">Primary</cba-button>
          <cba-button variant="secondary">Secondary</cba-button>
          <cba-button variant="ghost">Ghost</cba-button>
          <cba-button variant="danger">Danger</cba-button>
          <cba-button variant="success">Success</cba-button>
        </div>
      </div>

      <div class="demo-surface demo-surface--primary">
        <h3>bg-primary · canvas</h3>
        <div class="demo-btn-row">
          <cba-button variant="primary">Primary</cba-button>
          <cba-button variant="secondary">Secondary</cba-button>
          <cba-button variant="ghost">Ghost</cba-button>
          <cba-button variant="danger">Danger</cba-button>
          <cba-button variant="success">Success</cba-button>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Text on surfaces -->
  <section class="demo-section">
    <h2>Texto sobre superficies</h2>
    <p class="section-caption">Restricción WCAG-AA: text-muted no se usa sobre canvas ni inset.</p>
    <div class="demo-text-surfaces">
      <div class="demo-text-panel" style="background: var(--cba-bg-primary)">
        <span class="cba-text-primary">Primary · canvas</span>
        <span class="cba-text-secondary">Secondary · canvas</span>
        <span class="cba-text-inverse">Inverse · canvas</span>
      </div>
      <div class="demo-text-panel" style="background: var(--cba-bg-secondary)">
        <span class="cba-text-primary">Primary · panel</span>
        <span class="cba-text-secondary">Secondary · panel</span>
        <span class="cba-text-muted">Muted · panel</span>
      </div>
      <div class="demo-text-panel" style="background: var(--cba-bg-elevated)">
        <span class="cba-text-primary">Primary · elevated</span>
        <span class="cba-text-secondary">Secondary · elevated</span>
        <span class="cba-text-muted">Muted · elevated</span>
      </div>
      <div class="demo-text-panel" style="background: var(--cba-bg-inset)">
        <span class="cba-text-primary">Primary · inset</span>
        <span class="cba-text-secondary">Secondary · inset</span>
        <span class="cba-text-inverse">Inverse · inset</span>
      </div>
    </div>
  </section>

  <!-- 7. Accent pills + source color strip -->
  <section class="demo-section">
    <h2>Píldoras de acento</h2>
    <p class="section-caption">Acentos sobre fondos de superficie; sin componente de librería.</p>
    <div class="demo-pills">
      <span class="demo-pill" style="background: var(--cba-accent-primary); color: var(--cba-text-inverse)">accent-primary</span>
      <span class="demo-pill" style="background: var(--cba-accent-success); color: var(--cba-text-inverse)">accent-success</span>
      <span class="demo-pill" style="background: var(--cba-accent-danger); color: var(--cba-text-inverse)">accent-danger</span>
      <span class="demo-pill" style="border: 1px solid var(--cba-accent-warning); color: var(--cba-text-primary)">accent-warning</span>
      <span class="demo-pill" style="border: 1px solid var(--cba-accent-info); color: var(--cba-text-primary)">accent-info</span>
    </div>
    <div class="demo-source-color" style="background: var(--cba-source-color)">color fuente</div>
  </section>

  <!-- 8. Typography scale -->
  <section class="demo-section">
    <h2>Escala tipográfica</h2>
    <p class="section-caption">Utilidades .cba-text-* del tema.</p>
    <div class="demo-type">
      <p class="cba-text-display">Display · cba-text-display</p>
      <p class="cba-text-heading-lg">Heading lg · cba-text-heading-lg</p>
      <p class="cba-text-heading-md">Heading md · cba-text-heading-md</p>
      <p class="cba-text-body">Body · cba-text-body</p>
      <p class="cba-text-small">Small · cba-text-small</p>
      <p class="cba-text-caption">Caption · cba-text-caption</p>
    </div>
  </section>

  <!-- 9. Border scale -->
  <section class="demo-section">
    <h2>Escala de bordes</h2>
    <p class="section-caption">border-subtle / border-default / border-strong.</p>
    <div class="demo-border-grid">
      <div class="demo-border-box" style="border: 1px solid var(--cba-border-subtle)">border-subtle</div>
      <div class="demo-border-box" style="border: 1px solid var(--cba-border-default)">border-default</div>
      <div class="demo-border-box" style="border: 1px solid var(--cba-border-strong)">border-strong</div>
    </div>
  </section>

  <!-- 10. Selected states -->
  <section class="demo-section">
    <h2>Estados seleccionados</h2>
    <p class="section-caption">Patrones de footer, navegación y filas usando --cba-selected-*.</p>
    <div class="demo-patterns">
      <div class="demo-pattern-card">
        <h3>Footer pills</h3>
        <div class="demo-pills">
          <span class="demo-pill" style="background: var(--cba-selected-bg); color: var(--cba-selected-text)">Activo</span>
          <span class="demo-pill">Inactivo</span>
        </div>
      </div>
      <div class="demo-pattern-card">
        <h3>Nav items</h3>
        <div class="demo-nav">
          <a class="demo-nav-item demo-nav-item--selected">Clientes</a>
          <a class="demo-nav-item">Facturas</a>
          <a class="demo-nav-item">Reportes</a>
        </div>
      </div>
      <div class="demo-pattern-card">
        <h3>Table rows</h3>
        <table class="demo-table">
          <thead><tr><th>Documento</th><th>Nombre</th></tr></thead>
          <tbody>
            <tr class="demo-row--selected"><td>20-12345678-9</td><td>Comercial del Sur</td></tr>
            <tr><td>27-99887766-5</td><td>Distribuidora Norte</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 11. Form states (real cba-input / cba-select; NO cba-field wrapper) -->
  <section class="demo-section">
    <h2>Estados de formulario</h2>
    <p class="section-caption">Controles reales cba-input / cba-select con label / hint / error / readonly / valid / disabled.</p>
    <div class="demo-form-grid">
      <cba-input label="Cliente" hint="Nombre o CUIT." [(ngModel)]="sampleText" />
      <cba-input label="Solo lectura" readonly="true" hint="No editable." />
      <cba-input label="Válido" valid="true" hint="Validado correctamente." />
      <cba-input label="Con error" error="El CUIT ingresado no es válido." />
      <cba-input label="Deshabilitado" disabled="true" />
      <cba-select label="Estado" hint="Seleccione un estado." [(ngModel)]="sampleSelect">
        <option value="">Elegir…</option>
        <option value="active">Activo</option>
        <option value="vencida">Vencida</option>
        <option value="saldada">Saldada</option>
      </cba-select>
    </div>
  </section>

  <!-- 12. Semantic status badges -->
  <section class="demo-section">
    <h2>Estados semánticos</h2>
    <p class="section-caption">cba-badge · variant × appearance (solid / outline).</p>
    <div class="demo-badge-grid">
      <div class="demo-badge-col"><h3>Solid</h3>
        <cba-badge variant="primary" appearance="solid">Primary</cba-badge>
        <cba-badge variant="success" appearance="solid">Success</cba-badge>
        <cba-badge variant="warning" appearance="solid">Warning</cba-badge>
        <cba-badge variant="danger" appearance="solid">Danger</cba-badge>
        <cba-badge variant="info" appearance="solid">Info</cba-badge>
        <cba-badge variant="neutral" appearance="solid">Neutral</cba-badge>
      </div>
      <div class="demo-badge-col"><h3>Outline</h3>
        <cba-badge variant="primary" appearance="outline">Primary</cba-badge>
        <cba-badge variant="success" appearance="outline">Success</cba-badge>
        <cba-badge variant="warning" appearance="outline">Warning</cba-badge>
        <cba-badge variant="danger" appearance="outline">Danger</cba-badge>
        <cba-badge variant="info" appearance="outline">Info</cba-badge>
        <cba-badge variant="neutral" appearance="outline">Neutral</cba-badge>
      </div>
    </div>
  </section>

  <!-- 13. Radius & shadow -->
  <section class="demo-section">
    <h2>Radio y sombra</h2>
    <p class="section-caption">Utilidades de radio y sombra del tema.</p>
    <div class="demo-radius-grid">
      <div class="demo-radius-box cba-radius-sm">radius-sm</div>
      <div class="demo-radius-box cba-radius-md">radius-md</div>
      <div class="demo-radius-box cba-radius-lg">radius-lg</div>
    </div>
    <div class="demo-shadow-grid">
      <div class="demo-shadow-box cba-shadow-module">shadow-module</div>
      <div class="demo-shadow-box cba-shadow-elevated">shadow-elevated</div>
    </div>
  </section>

  <!-- 14. Shell footer pill nav mock -->
  <footer class="shell-footer">
    <nav class="shell-footer__nav">
      <a class="demo-pill demo-pill--selected">Resumen</a>
      <a class="demo-pill">Clientes</a>
      <a class="demo-pill">Facturas</a>
      <a class="demo-pill">Reportes</a>
    </nav>
  </footer>

</div>
```

Notes:
- The implementer MUST verify each token name (`--cba-bg-tertiary`, `--cba-bg-inset`,
  `--cba-source-color`, `--cba-selected-*`, `--cba-state-*-bg`, `--cba-accent-*`, `--cba-border-*`,
  `--cba-text-*`) and each utility class (`.cba-text-*`, `.cba-radius-*`, `.cba-shadow-*`) actually
  exist in `src/theme/_variables.scss` / `_utilities.scss` before using them. If a token/utility is
  missing, use the closest existing one and record the substitution in the implementation summary.
  Do NOT invent new tokens in the demo (that would be a library change = Part A scope).
- The demo's interactive ngModel samples need `FormsModule` (imported in §8).
- Icon-only buttons carry `aria-label` (spec §4.3).
- All headings/captions in Spanish (spec §4.2).

### Step 10 — Create `projects/demo/src/app/app.component.scss`

Layout chrome + demo-grid utilities ONLY. No `.pv-btn`. No component look-alikes. Example structure:

```scss
:host {
  display: block;
}

.demo-app {
  min-height: 100vh;
  background: var(--cba-bg-primary);
  color: var(--cba-text-primary);
}

.preview-bar {
  padding: 8px 14px;
  font-size: 12px;
  color: var(--cba-text-muted);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
  display: flex;
  gap: var(--cba-space-2);
  strong { color: var(--cba-text-secondary); }
}

.shell-header {
  height: var(--cba-header-height, 48px);
  display: flex;
  align-items: center;
  gap: var(--cba-space-3);
  padding: 0 var(--cba-space-3);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
}
.shell-header__search { flex: 0 0 320px; }
.shell-header__actions { display: flex; gap: var(--cba-space-1); }

.workspace {
  padding: var(--cba-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}

.demo-section {
  max-width: 960px;
  margin: var(--cba-space-4) auto;
  padding: 0 var(--cba-space-3);
}
.section-caption {
  color: var(--cba-text-secondary);
  font-size: var(--cba-font-size-caption);
  font-style: italic;
  margin: 0 0 var(--cba-space-2);
}

.demo-swatch-grid,
.demo-border-grid,
.demo-badge-grid,
.demo-form-grid {
  display: grid;
  gap: var(--cba-space-2);
}

.demo-swatch {
  height: 56px;
  border-radius: var(--cba-radius-sm);
  border: 1px solid var(--cba-border-default);
  padding: var(--cba-space-2);
  font-size: var(--cba-font-size-small);
}

.demo-surfaces { display: flex; flex-direction: column; gap: var(--cba-space-2); }
.demo-surface { padding: var(--cba-space-3); border-radius: var(--cba-radius-md); }
.demo-surface--secondary { background: var(--cba-bg-secondary); }
.demo-surface--elevated  { background: var(--cba-bg-elevated); }
.demo-surface--primary   { background: var(--cba-bg-primary); }
.demo-btn-row { display: flex; flex-wrap: wrap; gap: var(--cba-space-2); margin-top: var(--cba-space-2); }

.demo-text-surfaces { display: grid; gap: var(--cba-space-2); }
.demo-text-panel { padding: var(--cba-space-3); border-radius: var(--cba-radius-md); display: flex; flex-direction: column; gap: 4px; }

.demo-pills { display: flex; flex-wrap: wrap; gap: var(--cba-space-2); }
.demo-pill {
  padding: 4px 10px;
  border-radius: var(--cba-radius-sm);
  background: var(--cba-bg-tertiary);
  color: var(--cba-text-primary);
  font-size: var(--cba-font-size-small);
}
.demo-source-color { height: 40px; border-radius: var(--cba-radius-sm); margin-top: var(--cba-space-2); }

.demo-border-box { padding: var(--cba-space-2); border-radius: var(--cba-radius-sm); background: var(--cba-bg-elevated); }

.demo-table { width: 100%; border-collapse: collapse; background: var(--cba-bg-tertiary); }
.demo-table th, .demo-table td {
  padding: 6px 10px;
  border-bottom: 1px solid var(--cba-border-default);
  text-align: left;
  font-size: var(--cba-font-size-small);
}

.demo-nav { display: flex; flex-direction: column; gap: 2px; }
.demo-nav-item { padding: 6px 10px; border-radius: var(--cba-radius-sm); color: var(--cba-text-secondary); }
.demo-nav-item--selected { background: var(--cba-selected-bg); color: var(--cba-selected-text); }
.demo-row--selected { background: var(--cba-selected-bg); color: var(--cba-selected-text); }

.demo-radius-box, .demo-shadow-box {
  padding: var(--cba-space-3);
  background: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-default);
}
.demo-shadow-grid { display: flex; gap: var(--cba-space-3); margin-top: var(--cba-space-2); }

.shell-footer {
  border-top: 1px solid var(--cba-border-default);
  background: var(--cba-bg-secondary);
  padding: var(--cba-space-2) var(--cba-space-3);
}
.shell-footer__nav { display: flex; gap: var(--cba-space-2); }
```

Notes:
- All values come from `--cba-*` tokens (no hardcoded hex). If a spacing token (`--cba-space-*`) name
  differs in `_variables.scss`, the implementer adjusts to the real names and records it.
- NO `.pv-btn` selector (acceptance criterion 6 / spec §3 "Do not reintroduce .pv-btn").
- File stays well under the 200-line max (rule applies to `src/` files; this is under `projects/demo/src/`,
  which is source code — keep ≤ 200 lines; the skeleton above is ~110 lines).

### Step 11 — Install + build verification

Run these single commands (bash tool, one per invocation, no chaining — tool-selection-priority rule):

1. `npm install`
   - Installs `@angular-devkit/build-angular@22.1.2` and materializes `node_modules/@cobranza-apps/ui`
     from `file:./dist`. **If `./dist` does not exist yet**, this fails — run `npm run build:lib` first.
   - Pre-flight: ensure `dist/` exists. If not, run `npm run build` (the library build) before install.
2. `npm run build:lib` (or `npm run build`)
   - Emits `dist/` with the library + `dist/theme/theme.scss` + `dist/theme.scss` shim.
   - Verify `dist/` exists and contains `package.json`, `public-api.d.ts`, `theme/theme.scss`.
3. `npm install` (again, to materialize the `file:./dist` symlink after the lib build)
   - Verify `node_modules/@cobranza-apps/ui` exists and its `package.json` name is `@cobranza-apps/ui`.
4. `npm run build:demo`
   - Runs `build:lib` then `ng build demo`. Must succeed and emit `dist/demo/` (containing
     `index.html`, `*.js`, `*.css`).
   - Verify `dist/demo/browser/index.html` exists (the `application` builder outputs to
     `dist/demo/browser/` by default).
5. If the build fails on Sass `@use '@cobranza-apps/ui/theme'`, confirm the theme subpath resolves:
   check `node_modules/@cobranza-apps/ui/package.json` has `exports["./theme"]` and
   `node_modules/@cobranza-apps/ui/theme/theme.scss` exists. Re-run `npm run build:lib` + `npm install`.
6. `npm run lint` must remain clean (the demo is under `projects/demo/`, NOT matched by the current
   `eslint "src/**/*.ts"` glob, so lint is unaffected — do NOT broaden the lint glob in Part B).

### Step 12 — `start:demo` manual smoke

1. `npm run start:demo` (background_process tool, `ready.pattern: "Local:"` or the Angular dev-server
   "watch mode" line; do NOT chain with `&`).
2. Open the served URL in the Playwright browser (`kilo-playwright_browser_navigate`).
3. Verify acceptance criteria (§7 of this plan) visually:
   - Page banner shows the demo label.
   - `variant="primary"` button renders solid `--cba-accent-primary` fill + `--cba-text-inverse` label.
   - `cba-module-container` visibly separates canvas / panel / elevated surfaces.
   - No `.pv-btn` styles (inspect the built CSS via devtools).
   - Token swatches read live CSS variables (no hex tables).
4. Stop the dev server.

### Step 13 — Documentation updates (small, in-scope per spec §5.2)

- `README.md`: add a "Demo app" subsection under the existing Integration/Development section:
  ```
  ### Demo app
  The Angular demo app under `projects/demo/` consumes the BUILT library.
  Order of commands:
  1. `npm run build:lib`  (emits `dist/`)
  2. `npm install`        (materializes `node_modules/@cobranza-apps/ui` from `file:./dist`)
  3. `npm run start:demo` (dev server) OR `npm run build:demo` (emits `dist/demo/`)
  `start:demo` does NOT rebuild the library — re-run `build:lib` after library changes.
  ```
- `docs/CONSUMER_GUIDE.md`: append the same command-order note in the "Verifying against the theme"
  section (or equivalent). Do NOT remove references to `docs/theme-preview.html` here — that retarget
  is Part C. Only ADD the demo-app path as an additional verification surface.

### Step 14 — Version bump + CHANGELOG (changelog-versioning rule)

- `package.json` `version`: bump to next minor (e.g. `0.16.1` → `0.17.0`). Implementer verifies the
  current value first.
- `CHANGELOG.md`: add a NEW dated header at the TOP (most recent first), e.g.:

  ```markdown
  ## [0.17.0] — 2026-08-18

  ### Added
  - Angular demo mini-app under `projects/demo/` that consumes the built `@cobranza-apps/ui` library
    and renders every `docs/theme-preview.html` section with real library components and live
    `var(--cba-*)` token swatches.
  - npm scripts `build:lib`, `build:demo`, `start:demo`.
  - `@cobranza-apps/ui` exposed as a local `file:./dist` devDependency so the demo resolves the built
    package via `node_modules` (no deep `src/` imports).
  - `angular.json` with a single `demo` application project.

  ### Changed
  - `package.json` devDependencies: added `@angular-devkit/build-angular@22.1.2`.
  ```

- Verify NO `[Unreleased]` section exists (changelog-versioning rule). If a stale `[Unreleased]`
  exists, move its entries under this dated header and remove the `[Unreleased]` block.

### Step 15 — Git commit

- `git status` (read `.gitignore` first — gitignore-compliance rule).
- Ensure ONLY these are staged:
  - `angular.json` (new)
  - `projects/demo/**` (new)
  - `package.json`, `package-lock.json` (modified)
  - `README.md`, `docs/CONSUMER_GUIDE.md`, `CHANGELOG.md` (modified)
- Ensure NOT staged: `dist/`, `node_modules/`, `.angular/`, `*.tsbuildinfo`.
- Commit message (matches repo style, e.g.):
  `feat(demo): add Angular demo mini-app consuming built @cobranza-apps/ui`
- Do NOT push (push is Critical Workflow Step 5 / Part C scope; git-remote-safety rule: push only to
  `origin`, only when explicitly instructed).

---

## 5. Content parity matrix (spec §6 checklist → demo section)

| Spec §6 checkbox | Demo section (Step 9) |
|------------------|-----------------------|
| Preview bar with demo label | §1 Preview bar |
| Shell header mock w/ real `cba-button` | §2 Shell header (ghost iconOnly buttons) |
| Workspace canvas (`--cba-bg-primary`) | §3 Workspace `<main>` |
| Expanded 100% module + header + table + footer | §3a |
| 50% module + collapsed module | §3b, §3c |
| Token swatch grid (all categories) | §4 |
| Button matrix 5 variants × 3 surfaces × states; sizes | §5 |
| Text-on-surfaces + WCAG-AA callout | §6 |
| Accent pills + raw source-color strip | §7 |
| Typography scale, 6 steps | §8 |
| Border scale (subtle/default/strong) | §9 |
| Selected states: footer pills, nav items, table rows | §10 |
| Form states w/ real `cba-input` / `cba-select` | §11 |
| Semantic status badges (solid + outline) | §12 |
| Radius & shadow utilities | §13 |
| Shell footer pill nav mock | §14 |

---

## 6. Library resolution strategy — summary

1. `npm run build:lib` → emits `dist/` (library + theme SCSS + package.json with `exports`).
2. `npm install` → npm reads `@cobranza-apps/ui: file:./dist` from root `package.json` and materializes
   `node_modules/@cobranza-apps/ui` (copy of `./dist`).
3. Demo TS resolves `@cobranza-apps/ui` via `node_modules/@cobranza-apps/ui` (because the demo's
   `tsconfig.app.json` overrides inherited `paths` with `{}`).
4. Demo Sass resolves `@use '@cobranza-apps/ui/theme'` via the published `exports["./theme"]` map /
   `node_modules/@cobranza-apps/ui/theme/theme.scss`.
5. Failure modes: missing `dist/` → `npm install` error; stale symlink → Sass resolution error.

---

## 7. Verification criteria mapping (spec §7)

| Spec §7 criterion | How verified |
|-------------------|--------------|
| 1. `npm run build:lib` succeeds | Step 11.2 |
| 2. `npm run build:demo` succeeds, emits `dist/demo/` | Step 11.4 |
| 3. `npm run start:demo` serves w/o runtime errors | Step 12 |
| 4. `variant="primary"` solid accent + inverse text | Step 12 visual; Part A fix ensures it |
| 5. `cba-module-container` separates canvas/panel/elevated | Step 12 visual |
| 6. No `.pv-btn` selectors in demo styles | Step 10 (no `.pv-btn`); Step 12 devtools grep |
| 7. No duplicated hex tables; swatches use `var(--cba-*)` | Step 9 §4 (inline var() only) |
| 8. Page title/banner labels the demo | Step 4 title; Step 9 §1 banner |

---

## 8. Out of scope (handled by Part C / other)

- Removing `docs/theme-preview.html` and `docs/theme-preview.css`.
- Retargeting all doc links (README, THEME.md, INDEX, AGENTS) from the HTML preview → demo app.
- CI pipeline integration (`build:lib` then `build:demo`).
- Packaging/publishing the demo build as a library artifact.
- Removing "DEMO CSS ONLY" generator scripts for the HTML file.
- Demo unit tests / Playwright suite (spec §8 out of scope).
- Mobile/responsive layout (spec §8 / TODO constraints: desktop-only).
- Theme switcher (not supported; spec §4.1).

---

## 9. Risks & notes

- **Token/utility name drift:** the implementer MUST grep `src/theme/_variables.scss` and
  `_utilities.scss` for the exact `--cba-*` and `.cba-*` names used in the template before finalizing.
  Substitutions (if a name differs) must be recorded in the implementation summary, not invented.
- **`application` builder output path:** emits to `dist/demo/browser/` by default (not `dist/demo/`
  root). The spec says `dist/demo/`; both are under the gitignored `dist/`. Acceptable. Document the
  exact `dist/demo/browser/index.html` location in the README note.
- **`@angular-devkit/build-angular` version:** must be `22.1.2` to match `@angular/cli` 22.1.2. If npm
  reports that exact version is unavailable, STOP and return a question to the caller (do not silently
  pick another version).
- **`file:./dist` + npm install ordering:** `npm install` BEFORE the first `build:lib` fails because
  `./dist` is absent. The documented order (build lib → install) is in Step 11. The implementer must
  follow that order, not run `npm install` blindly first.
- **Public API unchanged:** Part B does NOT export `CbaFieldComponent` or any new library symbol. If a
  later need arises to demo `<cba-field>` standalone, that is a separate library public-API change.
- **Strict templates:** the demo tsconfig keeps `strictTemplates: true`; the no-op output handlers and
  correct input types are required for the build to pass.

---

**Plan file:** `.kilo/plans/20260818-phase12-partB-plan.md`
**Status:** Ready for implementation (auto-approved per "Approve Global and Tasks Plans").
