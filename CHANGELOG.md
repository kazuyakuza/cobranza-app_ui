<!--
  FILE: CHANGELOG.md — Release changelog for @cobranza-apps/ui
  FORMAT: Keep a Changelog (https://keepachangelog.com/en/1.1.0/)
  VERSIONING: Semantic Versioning (https://semver.org/spec/v2.0.0.html)

  HOW TO UPDATE:
    1. NEVER use an [Unreleased] section — every push to origin publishes the lib.
       Add entries directly under the current dated [x.y.z] — YYYY-MM-DD header.
    2. Bump package.json version and create the dated header in the same change.
    3. Use categories: Added, Changed, Fixed, Deprecated, Removed, Security.
    4. Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries
       touch design tokens, components, or integration patterns.

  RULE: See .kilo/rules/changelog-versioning.md (no [Unreleased] sections).

  AUDIENCE: Consumers, maintainers, and AI agents tracking release history.
  RELATIONSHIPS:
    - brief.md §5 — Design Tokens (Theme) source of truth.
    - docs/THEME.md — Theme import, tokens, and utility classes guide.
    - docs/USAGE.md — Consumer usage patterns and examples.
    - context.md — Current work status and recent changes log.
-->

# Changelog

All notable changes to `@cobranza-apps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.

## [0.18.4] — 2026-08-20

### Changed

- Typography scale bumped by one step: `--cba-font-size-display` is now `1.5rem`, `--cba-font-size-heading-lg` `1.25rem`, `--cba-font-size-heading-md` `1.125rem`, `--cba-font-size-body` `1rem`, `--cba-font-size-small` `0.875rem`, `--cba-font-size-caption` `0.8125rem`. `--cba-line-height-caption` aligned to `1.385`. See `src/theme/_variables.scss`, `docs/THEME.md`, and `.agent/project-info/brief.md` §5.
- Input field visual refresh: control background is now `--cba-bg-elevated`, focus border is `--cba-accent-info`, and valid/invalid borders render at `2px solid`. See `src/components/form-field/cba-field.component.scss`, `docs/CBA_INPUT.md`, and `docs/CBA_FORM_FIELD.md`.
- Secondary button variant now uses `--cba-bg-secondary` background with `--cba-border-default` border for clearer distinction on panel surfaces. See `src/components/button/cba-button.component.scss`.

### Fixed

- "New customer" demo form no longer overflows in 50% modules: `.demo-customer-form`, `.cba-field__control`, and `%cba-native-control` all receive `box-sizing: border-box`, and the form receives `max-width: 100%`. See `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`.
- Added Cancel button to the "New customer" demo form, right-aligned with the primary Add customer button. See `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`.

## [0.18.3] — 2026-08-20

### Added

- `ModuleContainerComponent` now exposes a dedicated footer projection slot `[cbaModuleContainerFooter]`, rendered below the body and removed together with the body when the module is collapsed. See `docs/CBA_MODULE_CONTAINER.md`.

### Fixed

- `CbaModuleFooterComponent` status region (`__status`) now aligns its text+icon group to the right edge via `justify-content: flex-end`.
- Demo `demo-workspace` base row grid now uses `grid-template-columns: repeat(2, 1fr)` universally, ensuring a single 50% module and its adjacent empty space have equal widths.

## [0.18.2] — 2026-08-20

### Added

- Module header icons (drag, expand/shrink width, collapse/expand, fullscreen, close, loading) included in the demo's predefined icons section (`demo-icon-grid`).
- "Button and pill sizes" comparison section in the demo, including normal and bigger button/pill sizes for easy comparison.
- "Texts, fonts, labels" and "Color tokens" `bg-primary` groups now carry a strong border to separate them from the workspace background.

### Changed

- Demo module footers now render as part of the module (rounded, integrated look), with the status info right-aligned as `[status/info text][status icon]`; honored the 50% module width; hidden entirely when the module is collapsed.
- 50% module width fixed so a 50% module takes half the workspace width, minus left/right/middle gutter spacing.
- Header search input now centered within the header bar.
- Header drag icon (`faUpDownLeftRight`) added at the first position of the header action icons list (visual only, like the others).
- Button and pill example matrices reorganized into tables with a token/style info row per variant (status × primary/secondary/ghost/danger/success).
- Demo footer bar now uses navigation pills with section/category names (e.g. Clientes, Deudas, Pagos, Reportes).

### Fixed

- "Color tokens" selected-text example text now visible.

## [0.18.1] — 2026-08-19

### Changed

- Updated Angular demo app (`projects/demo/`) to match the full design-system showcase specification: reorganized header bar with back button and centered search, expanded module examples in exact order, token color grid with hex values, button and pill matrices over all surfaces, size variants, icon grid, typography and text samples, complete table and navigation examples, inputs over backgrounds, form example, and centered footer. All demo text switched to English.

## [0.18.0] — 2026-08-19

### Added

- Demo app artifact location documented in `README.md` (`dist/demo/browser/` from `npm run build:demo`; `dist/` is gitignored, produced locally).
- `docs/CONSUMER_GUIDE.md` quick-verify item 10 now names the Angular demo app as the canonical visual reference and lists the exact `build:lib` → `npm install` → `start:demo` / `build:demo` command order.

### Changed

- Docs retargeted to the demo app as the canonical visual reference: `brief.md` §5/§8.1, `instructions.md` pre-commit grep scope, and `docs/INDEX.md` now reference `projects/demo/` and grep `projects/demo/src/` instead of the deleted `docs/theme-preview.html` / `preview-html.spec.ts`.
- `build:lib` + `build:demo` now replaces the removed `npm run build:preview` step for regenerating the visual reference.

### Removed

- `docs/theme-preview.html` and `docs/theme-preview.css` — the static "DEMO CSS ONLY" preview is replaced by the Angular demo app at `projects/demo/`, which consumes the built library and renders real `<cba-*>` components instead of fake `.pv-btn--*` CSS. Shell teams should compare against the demo app, not outdated screenshots of the static HTML.
- `npm run build:preview` script — obsolete after the static preview deletion. The demo app builds via `npm run build:demo`.
- `src/theme/preview-html.spec.ts` — regression spec for the deleted preview files. Canonical token-value coverage remains in `src/theme/tokens.spec.ts` and `src/theme/contrast.spec.ts`.
- `PREVIEW_HTML_PATH` / `PREVIEW_CSS_PATH` exports from `src/components/testing/theme-fixtures.ts`.

## [0.17.0] — 2026-08-18

### Added

- Angular demo mini-app under `projects/demo/` that consumes the built `@cobranza-apps/ui`
  library and renders every `docs/theme-preview.html` section with real library components and
  live `var(--cba-*)` token swatches (no fake `.pv-btn` CSS as the button source of truth).
- npm scripts `build:lib`, `build:demo`, `start:demo`.
- `@cobranza-apps/ui` exposed as a local `file:./dist` devDependency so the demo resolves the
  built package via `node_modules` (no deep `src/` imports).
- `angular.json` with a single `demo` application project rooted at `projects/demo`.
- `projects/demo/package.json` isolating the demo from the library package scope so in-repo
  native-package resolution reaches the built `dist` output.

### Changed

- `package.json` devDependencies: added `@angular-devkit/build-angular@22.1.2`.
- Root `package.json` `exports` now exposes a `.` entry pointing at the built `dist` output so
  in-repo consumers of the demo app resolve the library root path under `ng serve`.

## [0.16.1] — 2026-08-18

### Fixed

- Host-bound modifier classes (`cba-button--primary`, `--secondary`, `--ghost`,
  `--danger`, `--success`, `--sm`, `--md`, `--disabled`, `--loading`,
  `--truncate`, `--icon-only`, `--block`, and the `--disabled`/`--readonly`
  modifiers on `cba-input`, `cba-select`, `cba-datepicker`, `cba-typeahead`) now
  use `:host(.modifier)` selectors so styles apply under Angular emulated
  encapsulation. Previously the primary button (and other variants) rendered
  without their accent fill in consumer apps like the Shell because the modifier
  lives on the `_nghost-*` element while the SCSS targeted `_ngcontent-*`. See
  `docs/CBA_BUTTON.md` "Host modifiers and encapsulation".

### Added

- Component-authoring note in `AGENTS.md` documenting the `:host(.modifier)` rule
  for host-bound classes.
- Unit-test assertions for `readonly`/`disabled` host classes on
  `cba-input`, `cba-select`, `cba-datepicker`.

## [0.16.0] — 2026-08-18

## [0.15.2] — 2026-08-13

### Fixed

- **Theme import resolves in Angular dev-server via directory-index partial** — `@use '@cobranza-apps/ui/theme';` now resolves under `ng serve` as well as `ng build`. The v0.15.1 package-root shim `src/theme.scss` was insufficient because Angular's dev-server Sass importer joins the specifier to `<pkgRoot>/theme` without appending `.scss`. Added `src/theme/_index.scss` (`@forward './theme.scss';`) so standard Sass directory-index resolution matches the joined directory. Published to `dist/theme/_index.scss` by the existing `ng-package.json` `**/*.scss` glob; the v0.15.1 root shim and `package.json` `exports["./theme"]` are unchanged. See [docs/THEME.md](docs/THEME.md).

## [0.15.1] — 2026-08-12

### Fixed

- **Theme import works in Angular dev-server** — `@use '@cobranza-apps/ui/theme'` now resolves under `ng serve` as well as `ng build`. Angular's Sass importer resolves package imports to a literal file and ignores `package.json` `exports` conditions, so it failed looking for `node_modules/@cobranza-apps/ui/theme.scss`. Added a package-root shim `src/theme.scss` (`@forward './theme/theme.scss'`) copied to `dist/theme.scss` by a second `ng-package.json` asset entry. The existing `exports["./theme"]` map remains unchanged for resolvers that honor it. Consumers can drop the `stylePreprocessorOptions.includePaths` workaround and use the canonical import. See `.agent/todos/20260812/20260812-todo-1.md`, [docs/THEME.md](docs/THEME.md), and [docs/CONSUMER_GUIDE.md](docs/CONSUMER_GUIDE.md).

## [0.15.0] — 2026-08-12

Project-wide audit: package exports, theme tokens, component SCSS compliance, documentation fixes, and preview HTML consumer-reference overhaul.

### Added

- New layout/typography tokens: `--cba-module-footer-height` (40px), `--cba-icon-size-md` (1.75rem), `--cba-dropdown-min-width` (12rem). Registered in `src/components/testing/theme-fixtures.ts`; `docs/theme-preview.css` regenerated. See `docs/THEME.md` and `src/theme/_variables.scss`.
- `package.json` `exports["./theme"]` now resolves under `sass`, `style`, and `default` conditions (previously `sass`-only).
- `src/theme/theme.scss` now `@forward`s `_mixins.scss` so `@use '@cobranza-apps/ui/theme' as cba; @include cba.cba-elevated-surface;` works as documented in `docs/THEME.md`.
- `docs/theme-preview.html` now wears a `<p class="section-caption">` beneath every top-level `<h2>` preview heading. Each caption maps the demo CSS to the real library API (`<cba-*>` component, `.cba-*` utility class, or `--cba-*` token) with a link to the relevant `docs/CBA_*.md`. New sections: `<h2>Shell mockup</h2>`, `<h2>Module examples</h2>`, `<h2>Radius &amp; Shadow</h2>` (shows `.cba-radius-sm/md/lg` and `.cba-shadow-module/elevated`). New Button sub-states: `Focus` (`.is-focus`), `Loading` (`.is-loading`), and `sm`/`md` sizes (`.pv-btn--sm/--md`). See `docs/theme-preview.html`.

### Changed

- `package.json` `sideEffects` changed from `false` to `["**/*.scss"]` so SCSS is not tree-shaken away from consumers' bundles.
- **BREAKING:** `ModuleFooterComponent` renamed to `CbaModuleFooterComponent` (class, barrel export, spec describe block, README inventory, `CBA_MODULE_FOOTER.md` import). The `<cba-module-footer>` selector and `.cba-module-footer` CSS class are unchanged — consumer templates need no edit; only TS imports of the class symbol require updating.
- `ModuleHeaderComponent` gains `host: { class: 'cba-module-header', '[class.cba-module-header--fullscreen]': 'isFullscreen()' }`; the inner `<header>` no longer carries the `--fullscreen` modifier. SCSS `--fullscreen` rules now use `:host(.cba-module-header--fullscreen)`. Visual behaviour unchanged.
- `CbaModuleFooterComponent` gains `host: { class: 'cba-module-footer' }` (was host-less).
- Component SCSS now uses `--cba-*` tokens in place of hard-coded sizes: `CbaModalComponent` title (was `--cba-space-5` → `--cba-font-size-display`), `CbaButtonComponent` sm/md line-height & font-size, `CbaDropdownComponent` menu min-width + item typography, `ModuleFooterComponent` status typography, `CbaEmptyStateComponent` icon/title/description typography (adds `--cba-icon-size-md`), `CbaBadgeComponent` caption font-size.
- Doc file renames: `MODULE_HEADER.md` → `CBA_MODULE_HEADER.md`, `MODULE_CONTAINER.md` → `CBA_MODULE_CONTAINER.md`. Cross-refs updated in `docs/INDEX.md`, `README.md`, `docs/CBA_MODULE_FOOTER.md`, `docs/CONSUMER_GUIDE.md`, and the `@see` JSDoc of `ModuleHeaderComponent` / `ModuleContainerComponent`.
- `docs/theme-preview.html` `body` font-size now uses `var(--cba-font-size-body)` (was hard-coded `14px`). Inline dev-tool / preview-chrome CSS rules (dark sidebar, shell mockup, preview controls) are now explicitly segregated by a `DEV-TOOL / PREVIEW CHROME EXEMPTION` comment block that documents why those rules intentionally use hard-coded px values and are exempt from the `--cba-*` token mandate.
- `docs/theme-preview.html` `.search` element changed from a non-focusable `<div>` to a disabled native `<input type="search">` with `aria-label="Buscar (solo vista previa)"`. Visually unchanged (same pill); accessibility improved (now keyboard-focusable and screen-reader-announced).
- `docs/theme-preview.html` fake component-table selectors (`.cba-module-container__body table`, `thead th`, `tbody td`, `tr:hover`, `tr:last-child td`) renamed to the preview-only `.preview-module-table` class. The copied component SCSS block no longer claims table selectors the real `<cba-module-container>` does not export. The new block is prefixed with `/* Preview-only table chrome; not exported by the library. */`. `buildModuleBody(cfg)` in the preview script applies the new class to the rendered `<table>`.
- `.agent/project-info/brief.md` §5 now declares `src/theme/_variables.scss` the sole authoritative token source (docs/USAGE.md and docs/THEME.md are convenience views; preview swatches are a visual view). New `brief.md` §8.1 "Token Change Checklist" mandates a 7-item verification (docs/THEME.md, docs/CONSUMER_GUIDE.md, docs/USAGE.md, component SCSS compile, docs/theme-preview.html + build:preview, CHANGELOG, context.md) for every `--cba-*` add/remove/rename/value-change. New `.agent/project-info/instructions.md` "Pre-Commit Cross-File Sync Verification" requires AI agents to `rg` each changed `--cba-*` token and `.cba-*` class across `docs/` and `src/` before committing changes to `src/theme/`, `src/components/**/*.scss`, or `docs/theme-preview.html`. `.agent/project-info/context.md` records the 2026-08-12 audit as completed remediation and adds the cross-file drift recurrence risk to "Open Items / Risks".

### Fixed

- `docs/USAGE.md` no longer documents a non-existent `@import '@cobranza-apps/ui/theme.css';` fallback (Sass-only import is the only supported path); same removal in `docs/THEME.md`.
- 6 stale hex values in `docs/USAGE.md` (borders and canvas) corrected against `src/theme/_variables.scss`: `--cba-bg-primary` `#C5BFAE` → `#BCB5A4`, `--cba-border-subtle` `#DAD7CA` → `#E8E5DB`, `--cba-border-default` `#A7A6A2` → `#A29D94`, `--cba-border-strong` `#8E8D8A` → `#6B665E`.
- `docs/CBA_TYPEAHEAD.md` correctly reports the input surface token as `--cba-bg-secondary` (was `--cba-bg-primary`).
- `docs/CBA_MODULE_FOOTER.md` height token reference kept and simplified after `--cba-module-footer-height` was added to `_variables.scss`.
- `docs/CBA_FORM_FIELD.md` ASCII tree now lists `readonly` and `valid` inputs.
- `docs/CBA_INPUT.md`, `docs/CBA_SELECT.md`, `docs/CBA_DATEPICKER.md` host-class lists now include `--invalid` (each component binds both `--error` and `--invalid` to `error()`).
- `docs/CBA_EMPTY_STATE.md` clarifies that the consumer must add `aria-hidden="true"` on the projected icon (component does not add it).
- `docs/CBA_BUTTON.md` Table of Contents now lists `Non-goals` and `Related docs`.
- `docs/theme-preview.html` `.t-callout` warning callout now uses `color: var(--cba-text-primary)` on `background-color: var(--cba-accent-warning)` (was `color: var(--cba-text-inverse)`). New contrast ratio ≈ 5.6:1, passing WCAG AA (≥4.5:1). Related assertion in `src/theme/preview-html.spec.ts` updated to pin the corrected contrast behavior.
- `docs/CONSUMER_GUIDE.md` now references the preview captions as the canonical visual reproduction map for the library (`<cba-button>`, `<cba-badge>`, `<cba-field>`, module components, and `.cba-*` utility classes).

## [0.14.0] — 2026-08-11

### Added

- **`ModuleContainerComponent.scrollChaining` input** (`boolean`, default `false`) — opt into workspace scroll chaining. When `true`, `.cba-module-container__body` switches from `overscroll-behavior: contain` (default) to `overscroll-behavior: auto`, so wheel events bubble to the workspace once the module body reaches its edge. Drives the `cba-module-container--scroll-chaining` host modifier. Replaces the Shell's removed `::ng-deep` override. See `docs/MODULE_CONTAINER.md` §Scroll behaviour.
- **`CbaButtonComponent.truncate` input** (`boolean`, default `false`) — ellipsis-clamp long labels in constrained containers. Sets `min-width: 0` on `.cba-button__control` and `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on `.cba-button__label`. Drives the `cba-button--truncate` host modifier. See `docs/CBA_BUTTON.md` §Label truncation.
- **`CbaButtonComponent.iconOnly` input** (`boolean`, default `false`) — minimal square icon-only button. Sets `aspect-ratio: 1 / 1`, `min-width: auto`, and per-size padding (`--cba-space-1` for `sm`, `--cba-space-2` for `md`). Drives the `cba-button--icon-only` host modifier. The icon is `aria-hidden`; consumers must supply an accessible label via `aria-label`. See `docs/CBA_BUTTON.md` §Icon-only.
- **`CbaButtonComponent.block` input** (`boolean`, default `false`) — block-level button that fills its parent width. Host becomes `display: block` at `width: 100%`; internal control spans `100%`. Ghost block buttons left-align the label. Drives the `cba-button--block` host modifier. See `docs/CBA_BUTTON.md` §Block.
- **Reimplemented `docs/theme-preview.html`** as a faithful, interactive reference of `@cobranza-apps/ui`. The preview now models the Cobranza back-office shell (header + non-scrolling workspace + footer) with 7 module examples covering 100% / 50% width modes and expanded / collapsed states, all rendered with the exact library CSS class names (`cba-module-container--size-100/50`, `cba-module-header__action`, `cba-module-footer__status--*`) and Font Awesome icons. Module #1 includes a 5-row client-list table and a right-aligned status footer. See `docs/theme-preview.html` and [Consumer Guide](docs/CONSUMER_GUIDE.md).
- **Minimizable sidebar** — an "X" close button at the top of the sidebar collapses it; a "Show controls" button in `.preview-bar` reopens it. The open/close state persists across reloads via `localStorage` key `cba-theme-preview-sidebar-visible` (default open).
- **Expanded style showcase** — 31 color-token swatches (all backgrounds, text, borders, accents, interactive, selected, and form-state tokens), button state matrix (5 variants × 4 states × 3 surfaces), labels & pills, icon list (every Font Awesome icon used by the library + shell preview), text-on-surfaces legibility cards with WCAG-AA muted-restriction callouts, typography scale, border scale, selected-state samples, form-state field boxes, and semantic status badges (solid / outline / neutral).
- **Sidebar state regression tests** in `src/theme/preview-html.spec.ts` (localStorage key, close/reopen buttons, `is-sidebar-hidden` grid rule) and expanded `SWATCH_ROLE_TOKEN` map from 9 → 31 entries.

### Changed

- **`ModuleContainerComponent` fullscreen mode now retains `background-color`** — moved `background-color: var(--cba-bg-secondary)` from `:host(:not(.cba-module-container--fullscreen))` to the base `:host` rule. Only `border`, `border-radius`, `box-shadow`, and `overflow: hidden` are suppressed in fullscreen mode. Fixes transparent panel surface in the Shell fullscreen placeholder. See `docs/MODULE_CONTAINER.md` §Fullscreen behaviour.
- `docs/theme-preview.html` module footer mockup now uses the real `.cba-module-footer` / `.cba-module-footer__status--*` classes (copied inline from `module-footer.component.scss` with a "keep in sync" comment) instead of the previous ad-hoc `.module-footer` class. The workspace no longer scrolls (`flex:1 0 auto`, page scrolls instead) per the back-office mockup intent.
- `src/theme/preview-html.spec.ts` `SWATCH_ROLE_TOKEN` map expanded to 31 entries so the `TOKEN_ROLES.length` assertion stays green alongside the expanded swatch grid.

### Notes

- All new inputs default to `false`; the change is additive and backward-compatible. No `--cba-*` token names, component selectors, or public exports changed.
- Source TODO: `.agent/todos/20260811/20260811-todo-0.md` (Tasks 1–5). Front-end spec: [20260811-task-a-frontend-spec.md](.kilo/plans/20260811-task-a-frontend-spec.md).
- The Shell `.cba-bg-secondary` workaround on `<cba-module-container>` in the fullscreen placeholder (see TODO Task 2 reference) becomes harmless after this release and may be removed in a follow-up Shell PR — out of scope for this library change.
- Compliance: no `[Unreleased]` section introduced (per `.kilo/rules/changelog-versioning.md`).
- The preview reimplementation introduces no `--cba-*` token names, values, or library component SCSS changes. `docs/theme-preview.css` is regenerated via `npm run build:preview` (content unchanged — `src/theme/theme.scss` untouched; command must succeed).
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Front-end spec: [20260811-task-b-frontend-spec.md](.kilo/plans/20260811-task-b-frontend-spec.md).

## [0.13.0] — 2026-08-09

### Added

- **ModuleHeader optional drag-handle projection slot** — consumers can project a `[cbaModuleDragHandle]` element into the header actions area. The library does not render a default handle when the slot is empty, and the slot is hidden in fullscreen mode along with other actions. Enables Shell-owned `@angular/cdk/drag-drop` integration without adding CDK as a library dependency. See `docs/MODULE_HEADER.md` §Drag handle slot and `docs/CONSUMER_GUIDE.md` §ModuleHeader drag handle.

### Removed

- Removed the built-in visual-only drag button from `ModuleHeader` (was `faUpDownLeftRight` / `aria.drag`). Drag handle is now consumer-projected via the `[cbaModuleDragHandle]` slot. Removed the `drag` key from `CBA_UI_MESSAGES.moduleHeader.aria` and the `faDrag` property from `ModuleHeaderComponent`.

### Notes

- No `@angular/cdk` peer dependency added. Existing `ModuleHeader` inputs/outputs are unchanged. Spec: [20260809-phase11-drag-handle-frontend-spec.md](.kilo/plans/20260809-phase11-drag-handle-frontend-spec.md).

## [0.12.1] — 2026-08-08

### Fixed

- **Preview module header accuracy** — `docs/theme-preview.html` module header mockup now uses the actual component CSS classes (`cba-module-header`, `cba-module-header__action`, etc.) instead of ad-hoc inline styles, matching `module-header.component.scss` 100%.
- Added Font Awesome CDN to `docs/theme-preview.html` so the preview renders the library's Font Awesome icons accurately, mirroring the Angular component's icon set and order.
- Replaced hardcoded px values in the preview mockup with `--cba-*` CSS variables. See [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and `docs/THEME.md`.
- Aligned the module container mockup with `module-container.component.scss`. See `docs/THEME.md` §Border Roles and §Surface Hierarchy.

## [0.12.0] — 2026-08-07

### Added

- **Selected state tokens** in `src/theme/_variables.scss`: `--cba-selected-bg` (#E4DDD0), `--cba-selected-border` (aliases `--cba-accent-primary`), `--cba-selected-text` (aliases `--cba-text-primary`), `--cba-selected-hover` (#D8CFC0). Semantics: selected ≠ active(pressed) ≠ focus. Consumers: footer pills, nav tabs, table rows, dropdown options, filter chips. See `docs/THEME.md` §Selected State and `docs/CONSUMER_GUIDE.md` §Selected State Usage.
- **Form state tokens** in `src/theme/_variables.scss`: `--cba-state-invalid-border` (#B93E36), `--cba-state-invalid-text` (#8B3028), `--cba-state-valid-border` (#3E6B4F), `--cba-state-valid-text` (#2E523C), `--cba-state-disabled-bg` (#E0DCD4), `--cba-state-disabled-text` (#9A958D). Reuse warmed accent hues (no parallel reds/greens invented). See `docs/THEME.md` §Form State Matrix and `docs/CONSUMER_GUIDE.md` §Form State Matrix.
- **Typography scale tokens** in `src/theme/_variables.scss`: six-step scale as `--cba-font-size-{display,heading-lg,heading-md,body,small,caption}` + matching `--cba-line-height-*` pairs. Utility classes `.cba-text-display` through `.cba-text-caption` generated in `src/theme/_utilities.scss`. See `docs/THEME.md` §Typography Scale and `docs/CONSUMER_GUIDE.md` §Typography Scale Usage.
- **Radius and shadow rules** documented in `docs/THEME.md` and `docs/CONSUMER_GUIDE.md`: lg/md/sm/pill usage table; border-primary / shadow-secondary rule.
- **Form control state wiring** — `CbaInput`, `CbaSelect`, and `CbaDatepicker` now accept `readonly` and `valid` inputs (inherited from `CbaFieldControlValueAccessor`). The shared `CbaFieldComponent` applies host classes `.cba-field--disabled`, `.cba-field--readonly`, `.cba-field--valid`, `.cba-field--invalid`, and `.cba-field--error` based on the current state. Visual state matrix: default / hover / focus-visible / disabled / readonly / invalid / valid. `error` and `valid` are visual-only inputs — no validation engine is built into the library. See `docs/CBA_FORM_FIELD.md` §Shared field state classes, `docs/CBA_INPUT.md` §Visual state matrix, `docs/CBA_SELECT.md`, and `docs/CBA_DATEPICKER.md`.
- **Dropdown selected option pattern** — consumers mark the active item by adding the `.cba-dropdown__item--selected` CSS class. The selected state uses `--cba-selected-bg`, `--cba-selected-text`, and `--cba-selected-hover` tokens. See `docs/CBA_DROPDOWN.md` §Selected option pattern.
- **Theme preview pattern sections** in `docs/theme-preview.html`: added Multi-module density strip (2 module cards showing canvas→panel→elevated→inset under density), Border scale swatches (subtle/default/strong labelled by role), Selected samples (footer pill + fake nav item + fake table row using `.is-hover`/`.is-selected`/`.is-disabled`), Form state samples (default/focus/disabled/readonly/invalid using `--cba-state-*` + `--cba-focus-ring`), Type scale sample (six steps driven by `--cba-font-size-*`/`--cba-line-height-*`), and Semantic status badges (solid + outline + neutral). New preview sections rendered from JS arrays (`DENSITY_MODULES`, `DENSITY_ROWS`, `BORDER_LEVELS`, `SELECTED_PILLS`, `SELECTED_NAV`, `TABLE_ROWS`, `FORM_STATES`, `TYPE_SCALE`, `STATUS_BADGES`) so the 9-entry `TOKEN_ROLES` swatch grid and `preview-html.spec.ts` stay stable. Regenerate via `npm run build:preview`. See `docs/theme-preview.html`.
- **THEME.md pattern sections** added: Table State Patterns, Navigation / Footer Pill State Patterns, Semantic Status Patterns (with ToC entries), cross-linking the matching Consumer Guide sections. `docs/CONSUMER_GUIDE.md` already contained these pattern sections plus Quick verify items for selected/form states/typography; no further edits were required. `README.md` already points to the Consumer Guide for table/nav/status patterns.

### Changed

- **Surface retuning** in `src/theme/_variables.scss` for multi-module density: canvas (`--cba-bg-primary`) darkened from #C5BFAE to #BCB5A4 (L*~74); panel (`--cba-bg-secondary`) lightened from #E6DDC6 to #F2F0E8 (L* ~94); elevated (`--cba-bg-elevated`) lightened from #FBF7ED to #FDFCF8 (L*~99); inset (`--cba-bg-tertiary`) unchanged at #D8C3A5 (L* ~81). New L* gaps: canvas→panel ≈ 20, panel→elevated ≈ 5, panel→inset ≈ 13. Modules now read as cards on a desk. See `docs/THEME.md` §Surface Hierarchy and [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme).
- **Border retuning** in `src/theme/_variables.scss`: `--cba-border-subtle` lightened from #DAD7CA to #E8E5DB (recedes on panel); `--cba-border-default` adjusted from #A7A6A2 to #A29D94 (visible structural edge); `--cba-border-strong` darkened from #8E8D8A to #6B665E (defines chrome shape). Three levels now visibly distinct on cream/sand. See `docs/THEME.md` §Border Roles.
- **ModuleHeader icon swap and order change** — action icons now use Font Awesome 6 names (`up-down-left-right` for drag, `up-down` for collapse, `arrows-left-right-to-line` / `arrows-left-right` for size toggle, `window-maximize` for fullscreen, `xmark` for remove). Icon order is now: drag → collapse → size toggle → fullscreen → remove. The drag handle is visual-only (no output event). Title typography uses `.cba-text-heading-md` + `font-weight: 600`. See `docs/MODULE_HEADER.md` §Icon order and §Title typography.
- **Border audit** — `ModuleContainer`, `ModuleHeader`, and card structural edges now use `--cba-border-default` (was `--cba-border-subtle` in some places). Structural chrome should use the default border level; `--cba-border-subtle` is reserved for internal separators (row lines, soft dividers). See `docs/THEME.md` §Border Roles and `docs/CONSUMER_GUIDE.md`.

### Notes

- **No existing `--cba-*` token names were renamed** — only values changed (surfaces, borders) and new tokens added (selected, form state, typography scale). Additive change.
- **Potential visual breaking change** for Shell layouts that depended on the previous surface values (canvas #C5BFAE, panel #E6DDC6, elevated #FBF7ED). After upgrade the canvas is clearly darker and modules lift more distinctly; Shell authors should review the updated [Consumer Guide](docs/CONSUMER_GUIDE.md) and verify in `docs/theme-preview.html`.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Front-end spec: [20260807-phase10-cluster1-frontend-spec.md](.kilo/plans/20260807-phase10-cluster1-frontend-spec.md).

## [0.11.2] — 2026-08-07

### Added

- New interactive-state tokens in `src/theme/_variables.scss` for solid accent buttons: `--cba-hover-inverse` (`rgba(253, 252, 248, 0.12)`) and `--cba-active-inverse` (`rgba(253, 252, 248, 0.22)`). Hue matches `--cba-text-inverse`; applied via `background-image: linear-gradient(token, token)` so the overlay composites over the base accent fill without replacing it. See `.agent/project-info/brief.md` §5 and `docs/CONSUMER_GUIDE.md` §Button Color Guide.

### Fixed

- Solid button variants (`primary`, `danger`, `success`) were nearly indistinguishable across normal/hover/active states because dark overlays (`--cba-hover`, `--cba-active`) on already-dark accent backgrounds produced imperceptible shifts. Solid variants now use the new light inverse overlays; `secondary` and `ghost` continue using the dark overlays (light surfaces). Mirrors the split in `docs/theme-preview.html` and regenerates `docs/theme-preview.css` via `npm run build:preview`. Token-key parity asserted by `src/theme/tokens.spec.ts` and `src/theme/preview-html.spec.ts`.

## [0.11.1] — 2026-08-06

### Changed

- Increased interactive overlay opacity in `src/theme/_variables.scss` to make hover and active states distinguishable on warm light surfaces: `--cba-hover` is now `rgba(43, 38, 32, 0.10)` (was `0.06`) and `--cba-active` is now `rgba(43, 38, 32, 0.18)` (was `0.10`).

### Fixed

- Fixed unreadable token labels in `docs/theme-preview.html`: `.t-row .tok` now uses `--cba-text-secondary` at 11 px/500 weight, passing WCAG AA on every preview surface.
- Fixed unreadable warning callout and warning accent pill by switching to a solid `--cba-accent-warning` background with `--cba-text-inverse` text.
- Fixed Shell footer blending into the workspace by setting `.shell-footer` to `--cba-bg-elevated` and updating `docs/CONSUMER_GUIDE.md` to recommend the same.

### Added

- Regression tests in `src/theme/preview-html.spec.ts` (token labels, callout, accent pills, footer/workspace background difference, button state overlay values) and new `src/theme/docs-compliance.spec.ts` (no `[Unreleased]` section, dated `[0.11.1]` header, changelog-versioning rule reference).

### Notes

- No `--cba-*` token names were renamed, added, or removed; only `--cba-hover` and `--cba-active` alpha values changed.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Compliance enforced by [.kilo/rules/changelog-versioning.md](.kilo/rules/changelog-versioning.md) (no `[Unreleased]` sections).

## [0.11.0] — 2026-08-06

### Changed

- Adjusted two **Minimal Yet Warm** surface tokens in `src/theme/_variables.scss` to widen
  the panel→elevated L*gap from ~4.2 to ~9.0: `--cba-bg-secondary` (panel) darkened from
  `#F2F0E8` to `#E6DDC6` (warm cream, L* 88.26); `--cba-bg-elevated` tinted from `#FDFCF8`
  to `#FBF7ED` (warm cream, lightest surface, L* 97.29). Canvas (`#C5BFAE`), inset
  (`#D8C3A5`), text, accent, and border tokens unchanged.
- Synced `docs/theme-preview.html`, `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, and
  `.agent/project-info/brief.md` §5 to the adjusted token values and updated L* gap
  descriptors (canvas→panel ≈11, panel→elevated ≈9, panel→inset ≈8, elevated→inset ≈17).
- `docs/theme-preview.html` now uses compiled library CSS (`docs/theme-preview.css` from
  `src/theme/theme.scss`) instead of mirrored inline custom properties. The preview resolves
  `--cba-*` tokens from `:root` exactly as the Shell does, eliminating token drift.

### Fixed

- Surface distinguishability: panel→elevated step is now the clearest in the stack (~9 L*),
  resolving the issue where `--cba-bg-elevated` (used by active/pressed secondary buttons)
  was visually indistinguishable from the panel surface it sits on.

### Added

- **Regression test suite** (11 files: 6 helpers + 5 specs) under `src/theme/` and
  `src/components/testing/` guarding theme integrity:
  - `tokens.spec.ts` — canonical `--cba-*` token names and values in `_variables.scss`.
  - `contrast.spec.ts` — WCAG AA contrast ratios for all intended text/background pairs.
  - `surfaces.spec.ts` — surface lightness ordering and minimum L* gaps between canvas,
    panel, elevated, and inset.
  - `preview-html.spec.ts` — `docs/theme-preview.html` structure (compiled CSS link,
    required sections, 9 token swatches, TOKEN_ROLES mapping, muted-text restriction) and
    `docs/theme-preview.css` `:root` canonical values.
  - `consumer-guide.spec.ts` — mandated sections in `docs/CONSUMER_GUIDE.md` (token
    compliance, button guide, surface tree, text rules, bar/chrome guide, checklists,
    anti-patterns, quick verify).
  - Shared test helpers: `color-math`, `scss-tokens`, `html-loader`, `markdown-headings`,
    `project-files`, `theme-fixtures`.
- Cross-reference comments in `src/theme/_utilities.scss`, `src/theme/_mixins.scss`, and
  `src/theme/theme.scss` pointing to brief.md §5 and docs/THEME.md for AI-agent navigation.
- `docs/theme-preview.html` overhaul: now links compiled `docs/theme-preview.css` (generated
  from `src/theme/theme.scss` via `npm run build:preview`) so the preview resolves real
  `--cba-*` tokens — zero drift from the library. Added 9 token swatches (canvas, panel,
  elevated, inset, text, border, accent, warning, danger) with hex + token labels, a button
  state matrix (5 variants × 4 states × 3 surfaces = 60 buttons), text-on-surfaces samples
  with muted-restriction callouts on canvas/inset, and a surface ownership demo (Shell
  mockup showing canvas → panel → elevated → inset hierarchy).
- `build:preview` npm script (`sass src/theme/theme.scss docs/theme-preview.css`) and `sass`
  devDependency for regenerating the preview stylesheet after token changes.
- `docs/CONSUMER_GUIDE.md` — five new prescriptive sections for Shell and MFE authors:
  **Token Compliance Mandate** (≥90 % `--cba-*` usage, no hard-coded hex without a `TODO`),
  **Button Color Guide** (variant × surface base mapping, state overlays, focus ring),
  **Surface Decision Tree** (canvas / panel / elevated / inset / overlay decision rule),
  **Text Color Rules** (allowed text tokens per surface, muted restriction on canvas and
  inset), and **Bar and Chrome Guide** (header, footer, module header/footer, footer pills
  with border and height tokens). Cross-references updated in `docs/INDEX.md`, `README.md`,
  and `docs/THEME.md`.

### Notes

- **No token names renamed, added, or removed** — only two values changed. Build/lint pass;
  consumers of `--cba-*` tokens get the refined hierarchy by upgrading.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)
  and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Task 1 front-end spec: [20260806-task1-token-adjustments-frontend-spec.md](.kilo/plans/20260806-task1-token-adjustments-frontend-spec.md).
- Task 2 front-end spec: [20260806-task2-preview-html-frontend-spec.md](.kilo/plans/20260806-task2-preview-html-frontend-spec.md).
- Task 3 front-end spec: [20260806-task3-consumer-guide-frontend-spec.md](.kilo/plans/20260806-task3-consumer-guide-frontend-spec.md).

## [0.10.0] - 2026-08-05

### Changed

- Widened the **Minimal Yet Warm** surface hierarchy in `src/theme/_variables.scss` so
  all four surfaces are obviously distinct: canvas darkened to `#C5BFAE` (warm sand
  floor), panel refined to `#F2F0E8` (clean cream), elevated to `#FDFCF8` (warm
  near-white), inset kept at `#D8C3A5` (warm sand). Canvas → panel step ≈ 17 L*,
  panel → elevated ≈ 4 L*, inset sits ≈ 15 L* below panel.
- Strengthened borders on cream/sand: `--cba-border-subtle` now `#DAD7CA` (was
  `#E7E5DE`); `--cba-border-default` `#A7A6A2` and `--cba-border-strong` `#8E8D8A`
  confirmed for inputs, footer pills, and header icon-button outlines.
- Increased warm-tinted module shadows: `--cba-shadow-module` now
  `0 6px 24px rgba(43, 34, 28, 0.18)` (was `0 4px 16px ... 0.12`);
  `--cba-shadow-elevated` now `0 10px 32px rgba(43, 34, 28, 0.26)` (was
  `0 8px 24px ... 0.18`). Modules visibly lift off the warm canvas without harsh black
  bloom.
- README now refers to the design system as **Minimal Yet Warm** (was
  "intermediate-gray"); no behavioral change.

### Added

- `docs/CONSUMER_GUIDE.md` — normative Shell & MFE integration guide: theme load
  (once), surface ownership map (Shell / Lib / MFE), Shell checklist (6 items), MFE
  checklist (4 items), anti-patterns (5), quick visual verify (5 steps).
- `docs/THEME.md` surface-hierarchy note pointing to the Consumer Guide.
- Cross-links from `docs/INDEX.md`, `README.md` (Integration Notes + Documentation), and
  `docs/THEME.md` to the new Consumer Guide.

### Notes

- **No token names renamed, added, or removed** — only values and docs changed.
  Build/lint pass; consumers of `--cba-*` tokens get the new hierarchy by upgrading.
- **Potential visual breaking change for Shell layouts** that depended on near-identical
  surfaces (canvas vs panel both ~#EAE7DC/#F3F1E9). After upgrade the canvas is clearly
  sand and modules lift as cards; Shell authors should review the Consumer Guide and
  confirm the workspace uses `--cba-bg-primary`. See
  [docs/CONSUMER_GUIDE.md](docs/CONSUMER_GUIDE.md).
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)
  and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- `--cba-text-muted` is now RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) in
  addition to `--cba-bg-tertiary` (~3.86:1); use `--cba-text-secondary` on those
  surfaces.

## [0.9.0] - 2026-08-04

### Changed

- Replaced the intermediate-gray palette with the **Minimal Yet Warm** system across
  `src/theme/_variables.scss`: warm sand/cream/taupe surfaces (canvas `#EAE7DC`,
  panel `#F3F1E9`, elevated `#FCFBF6`, inset `#D8C3A5`), warm near-black/taupe text,
  warm border steps, warm-tinted shadows and hover/active overlays.
- `--cba-accent-primary` is now a warm taupe `#6B5B4F` (was blue `#3b82f6`). Coral
  (`#E98074` / `#E85A4F`) is reserved for warning/danger/focus accents only.
- `--cba-focus-ring` is now a warm coral ring (`rgba(232,90,79,0.45)`) to stay visible
  on warm light surfaces.
- `--cba-border-subtle` is now a dedicated `#E7E5DE` separator (was an alias of
  `--cba-bg-elevated`).
- Module header surface switched to `--cba-bg-elevated`; module footer to
  `--cba-bg-tertiary` (inset) to expose the four-level surface hierarchy.
- `docs/theme-preview.html` reduced to a single Minimal Yet Warm theme (theme-list UI
  retained for future themes).

### Added

- Inline accent-discipline guidance in `src/theme/_variables.scss` (coral reserved for
  status/focus/small accents; primary CTAs use warm taupe).
- Muted-text restriction now documented against the warm inset surface
  (`--cba-bg-tertiary`, ~3.86:1).

### Fixed

- Accordion disabled button text contrast: `--cba-text-muted` on `--cba-bg-tertiary`
  (~3.86:1, below WCAG AA) replaced with `--cba-text-secondary` (passes AA). See
  `src/theme/_accordion.scss`.
- Theme preview (`docs/theme-preview.html`) no longer demonstrates the restricted
  muted-on-inset pair; `.search` chip uses `--text-2` (`--cba-text-secondary`).
- Theme preview now uses static token values matching `--cba-*` exactly, replacing
  dynamic color-derivation logic that produced slightly different shadows/overlays.

### Notes

- **No token names were renamed, added, or removed** — only values, component
  surface-role token references, and documentation changed. Build/lint pass; this is
  not a breaking API change for consumers of `--cba-*` tokens.
- See `.agent/project-info/brief.md` §5 for the authoritative token table and
  `docs/THEME.md` for the theme quick reference.

## [0.8.1] - 2026-08-03

### Added

- Added a complete Design Tokens reference to `docs/USAGE.md`, with value tables for
  backgrounds, text, borders, accents, interactive states, and shadows.
- Added grouped section comments inside `src/theme/_variables.scss` documenting each token group.

### Changed

- **Lightened the intermediate-gray theme palette** (see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)).
  Background surfaces shifted to a lighter medium-gray scale (`#2a2d32` → `#7a838d`).
- Updated text tokens to near-black (`#e8eaed` → `#0f1115`) for stronger legibility on lighter
  backgrounds.
- Adjusted interactive `hover`/`active` states from white overlays to subtle dark overlays.
- Reduced shadow opacity for module and elevated surfaces.
- Reduced the modal/overlay backdrop from `0.55` to `0.32` opacity.
- Reorganized `src/theme/_variables.scss` with section comments and deduplicated the
  `--cba-border-subtle` token (now aliases `--cba-bg-elevated`). **No token names changed**,
  so this is a drop-in update.
- Updated theme documentation (`docs/THEME.md`, `docs/USAGE.md`, `README.md`, and the project
  brief) to reflect the lightened token values and renamed `#5-design-tokens-theme` anchors.

### Fixed

- Fixed text-contrast compliance: darkened `--cba-text-secondary` to `#15181c` and
  `--cba-text-muted` to `#212429` so intended text/background pairs meet WCAG AA 4.5:1.
  - `--cba-text-secondary` on `--cba-bg-primary`: 4.63:1.
  - `--cba-text-muted` on `--cba-bg-secondary`: 5.13:1.
  - Intentional exception: `--cba-text-muted` on `--cba-bg-primary` is 4.05:1; library
    components must not use this pair. Use `--cba-text-secondary` on `--cba-bg-primary` for
    lower-emphasis text.

---

## Cross-Reference (AI Agents)

- [Project Brief §5 — Design Tokens](.agent/project-info/brief.md#5-design-tokens-theme) — Source of truth for token values.
- [Theme Guide](docs/THEME.md) — Theme import, tokens, and utility classes.
- [Usage Guide](docs/USAGE.md) — Consumer patterns and examples.
- [Context](.agent/project-info/context.md) — Current work status and recent changes.
- [Architecture](.agent/project-info/architecture.md) — Build strategy and integration patterns.
