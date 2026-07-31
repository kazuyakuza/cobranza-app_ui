# Phase 7 — Task 2: Spanish-only UI copy (Implementation Plan)

- **TODO file:** `.agent/todos/20260730/20260730-todo-5.md` (Task 2)
- **Branch:** `feat/phase7-accordion-spanish-delivery`
- **Plan step:** 4.1b Analysis & Implementation Plan
- **Author:** Architector sub-agent
- **Date:** 2026-07-31

## 1. Goal

Replace all English default user-visible strings owned by the library with
Spanish equivalents and centralize them in a single typed constants module.
No i18n framework, no locale switchers, no translation loaders, no language
codes are introduced. Consumers may still override copy via existing inputs
(`statusText`, `title`, projected content).

## 2. High-level approach

1. Create a new `src/i18n/` folder and a single `ui-messages.ts` file exporting
   a frozen `CBA_UI_MESSAGES` object typed with `as const`.
2. Replace the inline `STATUS_TEXTS` constant in `module-footer.component.ts`
   with a reference into `CBA_UI_MESSAGES.moduleFooter.status`.
3. Move the inline aria/title strings in `module-header.component.html` to
   references into `CBA_UI_MESSAGES.moduleHeader.aria.*` (template-referenced
   readonly fields on the component, since templates can only access component
   members).
4. Replace the literal `aria-label="Close"` in `cba-modal.component.html` and
   `aria-label="Open date picker"` in `cba-datepicker.component.html` with
   references into `CBA_UI_MESSAGES` (expose a protected readonly field on each
   component class).
5. Update both affected spec files to assert the Spanish default strings.
6. Update `docs/USAGE.md`, `docs/CBA_MODULE_FOOTER.md`, and `README.md` so the
   documented default strings and the Spanish-only note match reality.
7. Register `src/i18n/` in `.agent/project-structure.md`.
8. Decide on public export of `CBA_UI_MESSAGES` (see §6) and update
   `src/public-api.ts` accordingly.
9. Verify build, lint, and unit tests pass; commit.

## 3. Architecture decisions

### 3.1 Folder placement: `src/i18n/` (not `src/lib/i18n/`)

- The existing `src/` layout has no `src/lib/` segment; components live under
  `src/components/`, theme under `src/theme/`, directives under
  `src/directives/`. Per the Project Structure Rule this plan uses `src/i18n/`
  for the defaults module, consistent with the existing flat `src/` layout.
- `i18n/` is named for human clarity ("UI messages"). It does **not** imply any
  translation system; it is a single static constants object. A JSDoc banner on
  the file states this explicitly so future agents don't grow it into a locale
  engine.

### 3.2 Template access pattern (Angular signal-era, standalone)

Angular templates can only reference members of the host component class; they
cannot import standalone constants. For HTML files that need a default string
the component TS file exposes a `protected readonly` field pointing to the
relevant sub-object of `CBA_UI_MESSAGES`:

```ts
protected readonly uiMessages = CBA_UI_MESSAGES.moduleHeader.aria;
```

Then the template uses `uiMessages.collapse.expand`, etc. This is the same
pattern already used for Font Awesome icons (`faChevronUp`, `faRemoveIcon`,
...). It keeps the constants in one module while keeping templates typed and
testable.

### 3.3 Override semantics (unchanged)

- `CbaModuleFooter`: `statusText` input still wins over the default mapping.
  Only the *default* mapping values change (English → Spanish). The component
  reads `CBA_UI_MESSAGES.moduleFooter.status[current]` instead of the local
  `STATUS_TEXTS[current]`. `STATUS_TEXTS` constant is removed from the
  component file.
- `ModuleHeader`, `CbaModal`, `CbaDatepicker`: these strings are inherent to
  icon-only buttons owned by the library; there is no existing input to
  override them. This plan does **not** add new override inputs — out of scope
  for Task 2. If a later task wants overrides it can add inputs that fall back
  to `CBA_UI_MESSAGES`.

### 3.4 No multiline literal `\n`

Per the Newline Prevention Rule, all string literals in `ui-messages.ts` use
real source newlines where needed (none are needed here; every value is a
single-line string). The ellipsis in `Cargando…` uses the U+2026 character
consistent with the existing `Loading…` source.

## 4. `CBA_UI_MESSAGES` object shape

```ts
// src/i18n/ui-messages.ts
/**
 * Default Spanish-only UI copy for @cobranza-apps/ui.
 *
 * This is a single source of truth for user-visible strings the library owns
 * (status text, aria-labels/tooltips on icon-only controls). It is NOT an i18n
 * system: there are no language codes, locale switchers, or translation
 * loaders. Consumers override copy through component inputs / content
 * projection, never through this module.
 */
export const CBA_UI_MESSAGES = {
  moduleFooter: {
    status: {
      loading: 'Cargando…',
      loaded: 'Listo',
      success: 'Guardado',
      warning: 'Requiere atención',
      error: 'Error',
      dirty: 'Cambios sin guardar',
    },
  },
  moduleHeader: {
    aria: {
      collapse: {
        expand: 'Expandir módulo',
        collapse: 'Colapsar módulo',
      },
      size: {
        shrink: 'Reducir módulo a 50%',
        expand: 'Expandir módulo a 100%',
      },
      remove: 'Quitar módulo',
      fullscreen: 'Pantalla completa',
    },
  },
  modal: {
    aria: {
      close: 'Cerrar',
    },
  },
  datepicker: {
    aria: {
      open: 'Abrir selector de fecha',
    },
  },
} as const;
```

Notes:
- `as const` gives literal-narrowed readonly types; consumers referencing
  `CBA_UI_MESSAGES.moduleFooter.status.loading` get the literal `'Cargando…'`.
- The spread of nesting (`collapse.expand` / `collapse.collapse`) mirrors the
  ternary structure already in the header template
  (`isCollapsed() ? 'Expand …' : 'Collapse …'`).

## 5. Files to touch (exact changes)

### 5.1 CREATE — `src/i18n/ui-messages.ts`

- New file. Exact content is §4 above.
- File length well under the 200-line / 125-line limit.
- No exported types beyond the const; consumers use `typeof CBA_UI_MESSAGES`
  if they need a type for overrides.

### 5.2 EDIT — `src/components/module-footer/module-footer.component.ts`

Current local constant (lines 35–43):

```ts
/** Default status text used when `statusText` is not provided. `null` renders no text. */
const STATUS_TEXTS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, string>> = {
  loading: 'Loading…',
  loaded: 'Ready',
  success: 'Saved',
  warning: 'Attention needed',
  error: 'Error',
  dirty: 'Unsaved changes',
};
```

Change:
- REMOVE the `STATUS_TEXTS` local constant.
- ADD import: `import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';`
  (place after the icon imports, before the `ModuleHeaderStatus` import — keep
  alphabetical order within the import block as eslint expects; if the linter
  flags ordering, group external imports first then local).
- ADD a `protected readonly` field near the other computed/protected members:

  ```ts
  /** Default status text per `ModuleHeaderStatus`. Sourced from `CBA_UI_MESSAGES`. */
  protected readonly statusTexts = CBA_UI_MESSAGES.moduleFooter.status;
  ```
- UPDATE `displayText` computed to use `this.statusTexts[current]` instead of
  `STATUS_TEXTS[current]`:

  ```ts
  readonly displayText = computed<string>(() => {
    const explicit = this.statusText();
    if (this.hasExplicitText(explicit)) {
      return explicit;
    }
    const current = this.status();
    return current === null ? '' : (this.statusTexts[current] ?? '');
  });
  ```

Verification: the JSDoc on `statusText` input still says "wins over the default
`STATUS_TEXTS` mapping" — update that wording to `'CBA_UI_MESSAGES.moduleFooter.status'
mapping` for accuracy (Self-Documenting Code Rule).

### 5.3 EDIT — `src/components/module-header/module-header.component.ts` and `.html`

`.ts` changes:
- ADD import: `import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';`
- ADD `protected readonly` fields (next to the existing icon fields near the
  bottom of the class):

  ```ts
  /** Aria/title defaults for header action buttons. Sourced from `CBA_UI_MESSAGES`. */
  protected readonly aria = CBA_UI_MESSAGES.moduleHeader.aria;
  ```

  (Single field exposes the whole `aria` sub-object; the template destructures
  via property access.)

`.html` changes — replace the four button definitions:

Line 4 (collapse button) currently:

```html
<button type="button" class="cba-module-header__action" [attr.aria-label]="isCollapsed() ? 'Expand module' : 'Collapse module'" [title]="isCollapsed() ? 'Expand module' : 'Collapse module'" (click)="collapseToggle.emit()">
```

Replace with:

```html
<button type="button" class="cba-module-header__action" [attr.aria-label]="isCollapsed() ? aria.collapse.expand : aria.collapse.collapse" [title]="isCollapsed() ? aria.collapse.expand : aria.collapse.collapse" (click)="collapseToggle.emit()">
```

Line 7 (size button) currently:

```html
<button type="button" class="cba-module-header__action" [attr.aria-label]="size() === '100%' ? 'Shrink module to 50%' : 'Expand module to 100%'" [title]="size() === '100%' ? 'Shrink module to 50%' : 'Expand module to 100%'" (click)="sizeToggle.emit(size() === '100%' ? '50%' : '100%')">
```

Replace the two ternary string literals with `aria.size.shrink` / `aria.size.expand`:

```html
<button type="button" class="cba-module-header__action" [attr.aria-label]="size() === '100%' ? aria.size.shrink : aria.size.expand" [title]="size() === '100%' ? aria.size.shrink : aria.size.expand" (click)="sizeToggle.emit(size() === '100%' ? '50%' : '100%')">
```

Line 10 (remove button) currently:

```html
<button type="button" class="cba-module-header__action" aria-label="Remove module" title="Remove module" (click)="remove.emit()">
```

Replace with:

```html
<button type="button" class="cba-module-header__action" [attr.aria-label]="aria.remove" [title]="aria.remove" (click)="remove.emit()">
```

Line 13 (fullscreen button) currently:

```html
<button type="button" class="cba-module-header__action" aria-label="Enter fullscreen" title="Enter fullscreen" (click)="fullscreenToggle.emit()">
```

Replace with:

```html
<button type="button" class="cba-module-header__action" [attr.aria-label]="aria.fullscreen" [title]="aria.fullscreen" (click)="fullscreenToggle.emit()">
```

Note: the existing static `aria-label="..."` attributes become bound
`[attr.aria-label]="..."` so they read from the constants. The icon `<fa-icon>`
lines and click handlers stay untouched.

### 5.4 EDIT — `src/components/modal/cba-modal.component.ts` and `.html`

`.ts` changes:
- ADD import: `import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';`
- ADD field near `titleId`:

  ```ts
  /** Aria-label for the close button. Sourced from `CBA_UI_MESSAGES`. */
  protected readonly closeAriaLabel = CBA_UI_MESSAGES.modal.aria.close;
  ```

`.html` change (line 10 — `aria-label="Close"`):

```html
aria-label="Close"
```

becomes:

```html
[attr.aria-label]="closeAriaLabel"
```

### 5.5 EDIT — `src/components/datepicker/cba-datepicker.component.ts` and `.html`

First read the datepicker `.ts` to confirm import structure (the implementer
must; if it already has a `protected readonly` pattern, follow it). Plan:

`.ts` changes:
- ADD import: `import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';`
- ADD field:

  ```ts
  /** Aria-label for the datepicker toggle button. Sourced from `CBA_UI_MESSAGES`. */
  protected readonly toggleAriaLabel = CBA_UI_MESSAGES.datepicker.aria.open;
  ```

`.html` change (line 26 — `aria-label="Open date picker"`):

```html
aria-label="Open date picker"
```

becomes:

```html
[attr.aria-label]="toggleAriaLabel"
```

### 5.6 EDIT — `src/components/module-footer/module-footer.component.spec.ts`

Update `STATUS_SCENARIOS` expected `text` values to the Spanish defaults:

```ts
const STATUS_SCENARIOS: Scenario[] = [
  { status: 'loading', text: 'Cargando…', modifier: 'cba-module-footer__status--loading' },
  { status: 'loaded', text: 'Listo', modifier: 'cba-module-footer__status--loaded' },
  { status: 'success', text: 'Guardado', modifier: 'cba-module-footer__status--success' },
  { status: 'warning', text: 'Requiere atención', modifier: 'cba-module-footer__status--warning' },
  { status: 'error', text: 'Error', modifier: 'cba-module-footer__status--error' },
  { status: 'dirty', text: 'Cambios sin guardar', modifier: 'cba-module-footer__status--dirty' },
];
```

Also update the two assertions hard-coding `'Unsaved changes'`:
- Line 72 `expect(statusText()).not.toContain('Unsaved changes');` → keep but
  also assert the Spanish default is what shows, e.g. append
  `expect(statusText()).toBe('Cambios sin guardar');` for clarity (the override
  test still proves override wins).
- Lines 98–100 (`.toContain('Unsaved changes')`) → change to
  `.toContain('Cambios sin guardar')`.

The override-win test (lines 65–73) keeps `statusText="'Draft mode active'"` as
its override value — that override value is input by the consumer, not a library
default, so it can stay English in the test (or be changed to a Spanish override
sample such as `'Borrador activo'` for consistency; either is acceptable, but
the implementer should pick Spanish to keep the suite Spanish-only in spirit).

### 5.7 EDIT — `src/components/module-header/module-header.component.spec.ts`

The `queryButton(label)` helper selects by `button[aria-label="<label>"]`.
Because the aria-labels become Spanish, every `queryButton('...')` call must
use the new Spanish labels:

- `queryButton('Collapse module')` → `queryButton('Colapsar módulo')`
  (default `isCollapsed=false` → collapse label).
- `queryButton('Shrink module to 50%')` → `queryButton('Reducir módulo a 50%')`
- `queryButton('Expand module to 100%')` → `queryButton('Expandir módulo a 100%')`
- `queryButton('Remove module')` → `queryButton('Quitar módulo')`
- `queryButton('Enter fullscreen')` → `queryButton('Pantalla completa')`

The collapse test currently asserts the default (non-collapsed) state renders
the "Collapse module" button; with Spanish that becomes `'Colapsar módulo'`.
No behavioural assertion changes, only the label strings.

### 5.8 EDIT — `src/components/modal/cba-modal.component.spec.ts`

Line 118:

```ts
expect(closeBtn.getAttribute('aria-label')).toBe('Close');
```

becomes:

```ts
expect(closeBtn.getAttribute('aria-label')).toBe('Cerrar');
```

### 5.9 EDIT — `src/components/datepicker/cba-datepicker.component.spec.ts`

Line 48:

```ts
expect(toggle.getAttribute('aria-label')).toBe('Open date picker');
```

becomes:

```ts
expect(toggle.getAttribute('aria-label')).toBe('Abrir selector de fecha');
```

### 5.10 EDIT — `docs/USAGE.md`

- §`CbaModuleFooter` Status text mapping (lines 549–551):

  ```text
  **Status text mapping:** `loading` → "Loading…", `loaded` → "Ready", `success` → "Saved",
  `warning` → "Attention needed", `error` → "Error", `dirty` → "Unsaved changes", `null` → no status region.
  ```

  becomes Spanish:

  ```text
  **Status text mapping:** `loading` → "Cargando…", `loaded` → "Listo", `success` → "Guardado",
  `warning` → "Requiere atención", `error` → "Error", `dirty` → "Cambios sin guardar", `null` → no status region.
  ```

- Add a short **Spanish-only defaults** note near the top (after "Quick Start" or
  in a new `## Spanish-only defaults` subsection near the top). Suggested text:

  > ### Spanish-only defaults
  >
  > Library-owned default chrome strings (module footer status text, header
  > action aria-labels/tooltips, modal close label, datepicker toggle label)
  > are Spanish. The platform is not multi-language; there is no i18n
  > framework. Override defaults via component inputs (`statusText`) or content
  > projection — never via a locale switcher.

- The ModuleHeader status values list (`loading` | `loaded` | ...) is a code
  contract, not displayed text — leave as-is.

### 5.11 EDIT — `docs/CBA_MODULE_FOOTER.md`

§Status text mapping table (lines 58–66) — update the "Default text" column:

| Status | Default text | Icon | Color token |
| --- | --- | --- | --- |
| `loading` | `Cargando…` | `faSpinner` (spin) | `--cba-accent-info` |
| `loaded` | `Listo` | `faCheck` | `--cba-accent-success` |
| `success` | `Guardado` | `faCircleCheck` | `--cba-accent-success` |
| `warning` | `Requiere atención` | `faTriangleExclamation` | `--cba-accent-warning` |
| `error` | `Error` | `faCircleXmark` | `--cba-accent-danger` |
| `dirty` | `Cambios sin guardar` | `faPen` | `--cba-text-secondary` |
| `null` | _(no status region)_ | _(none)_ | _(none)_ |

Also update the prose:
- Line 42 input table description for `statusText`: "wins over the default
  `STATUS_TEXTS` mapping" → "wins over the default `CBA_UI_MESSAGES.moduleFooter.status`
  mapping".
- Line 80 example: "Renders the footer bar with the `faPen` icon and the text
  'Unsaved changes'." → "...y el texto 'Cambios sin guardar'."
- Line 88 example: 'The explicit `statusText` wins over the default "Error"
  text.' → '...wins over the default "Error" text.' (kept, since "Error" is the
  same in Spanish).
- Add a one-liner after the Status text mapping table noting defaults are
  Spanish-only and centralized in `CBA_UI_MESSAGES`.

### 5.12 EDIT — `README.md`

Add a bullet to the Overview **What this library provides** list (after the
"Icons" bullet, around line 36):

- **Spanish-only defaults** — Library-owned UI copy (status text, aria-labels)
  is Spanish by default; no i18n framework. Override via inputs/projection.

Also add a short subsection (e.g., under Quick Start or a new `## Spanish-only
UI defaults` heading) summarizing: defaults are Spanish, centralized in
`CBA_UI_MESSAGES`, overrides via inputs, and no locale switching is supported.
Link to `docs/USAGE.md#spanish-only-defaults`.

### 5.13 EDIT — `.agent/project-structure.md`

Add a new line under `# Folders in src/` (alphabetical/position near
`src/components/` and `src/directives/`):

```text
- src/i18n/ - Centralized Spanish-only default UI copy constants (CBA_UI_MESSAGES); no i18n framework, single typed consts object
```

### 5.14 EDIT — `src/public-api.ts`

Decision: **export `CBA_UI_MESSAGES`.** Rationale (recorded here per
instruction §5): consumers building Spanish shells/MFEs benefit from importing
the exact default strings (e.g., to assert consistency, or to use the same
status text in slotted content). It is a frozen `as const` value — cheap to
re-export and harmless to the semver surface (changing a default string is a
behavioural change consumers opt into). The TODO explicitly lists
"`CBA_UI_MESSAGES` only if useful to consumers" — this plan judges it useful.

Implementation:
- Add a new export line in `public-api.ts`. Keep the existing component-grouped
  exports; add a small constants group after the components block:

  ```ts
  /** Centralized Spanish-only default UI copy. */
  export * from './i18n/ui-messages';
  ```

  (`export *` re-exports `CBA_UI_MESSAGES` from `ui-messages.ts`.)

Note: do NOT add a barrel `src/i18n/index.ts`; the single file is small enough
and `export * from './i18n/ui-messages'` is direct and clear. (If the project's
barrel convention strictly requires `index.ts`, the implementer may add one
and use `export * from './i18n'` instead — either is acceptable. Prefer the
direct path to avoid an extra file.)

## 6. Public-export decision (documented)

`CBA_UI_MESSAGES` **will** be exported from `src/public-api.ts`. Justification:

- Consumers may want to reference the same default strings (e.g., for sr-only
  labels mirroring footer status) without duplicating literals.
- It is a frozen readonly object — re-export has no runtime cost beyond the
  symbol reference.
- It is already a deliberate, named, stable symbol, not an internal helper.
- The alternative (not exporting) would force consumers to hardcode Spanish
  strings and drift from defaults over time.

The export is part of the public semver surface per the existing JSDoc on
`public-api.ts`; changing any value is a breaking change for consumers that
assert on it, which is acceptable and expected.

## 7. Explicit non-goals (do NOT do)

- Do NOT introduce `@angular/localize`, `$localize`, ngx-translate, or any
  locale/translation runtime.
- Do NOT add language codes, a `locale` input, or a service/store for strings.
- Do NOT add new override inputs to `ModuleHeader` / `CbaModal` /
  `CbaDatepicker` for aria-labels (out of scope for Task 2).
- Do NOT translate content projected by consumers (titles, business labels).
- Do NOT touch the `CbaAccordion` component (Task 1, already `[DONE]`).
- Do NOT modify `STATUS_VISUALS` (icons remain unchanged).
- Do NOT add a barrel `src/i18n/index.ts` unless eslint/import rules force it.
- Do NOT change test behavioural assertions, only the expected string literals.

## 8. Verification steps (for the implementer & reviewer)

1. `npm run lint` — passes; no unused `STATUS_TEXTS` reference left.
2. `npm test` — all updated specs green:
   - module-footer spec renders Spanish defaults for all six statuses.
   - module-footer override test still proves `statusText` wins.
   - module-header spec finds buttons by Spanish aria-labels and emits on click.
   - modal spec asserts `aria-label === 'Cerrar'`.
   - datepicker spec asserts `aria-label === 'Abrir selector de fecha'`.
3. `npm run build` — ng-packagr build succeeds; `dist/` contains the new
   `i18n/ui-messages` module and `public-api` re-exports `CBA_UI_MESSAGES`.
4. Manual grep audit: no remaining English default strings in the five touched
   component sources/templates:
   - `grep -ri "Loading…\|Ready\|Saved\|Attention needed\|Unsaved changes"
     src/components` returns nothing in `module-footer`.
   - `grep -ri "Expand module\|Collapse module\|Shrink module to 50%\|
     Expand module to 100%\|Remove module\|Enter fullscreen"
     src/components/module-header` returns nothing.
   - `grep -r "aria-label=\"Close\"" src/components/modal` returns nothing.
   - `grep -r "aria-label=\"Open date picker\"" src/components/datepicker`
     returns nothing.
5. Docs grep: only Spanish default strings appear in the USAGE/ModuleFooter
   status mapping tables; README mentions Spanish-only defaults.

## 9. Commits (suggested, one per logical group, on the feature branch)

1. `feat(i18n): centralize Spanish-only UI defaults in CBA_UI_MESSAGES` — adds
   `src/i18n/ui-messages.ts`, `public-api.ts` export,
   `.agent/project-structure.md` entry.
2. ` refactor(components): use CBA_UI_MESSAGES for module footer status text` —
   module-footer `.ts` + spec.
3. `refactor(components): use CBA_UI_MESSAGES for header/modal/datepicker aria`
   — module-header `.ts/.html` + spec, modal `.ts/.html` + spec, datepicker
   `.ts/.html` + spec.
4. `docs: document Spanish-only UI defaults` — `README.md`, `docs/USAGE.md`,
   `docs/CBA_MODULE_FOOTER.md`.

The implementer may squash into a single commit if the project's commit style
prefers it. Commit messages follow the repo's conventional-commit style
observed in the existing git log.

## 10. Risks / edge cases

- **Spec attribute selector brittleness:** `queryButton` matches by exact
  `aria-label`. Accented characters (`módulo`, `atención`) must be byte-identical
  between the template constant and the spec selector. The implementer must copy
  the literals from `CBA_UI_MESSAGES` into the specs verbatim, not retype them.
- **Import order:** angular-eslint may flag import ordering. Plan places the
  local `CBA_UI_MESSAGES` import in the correct relative-import group; if the
  linter complains, group it after external imports (Angular, FontAwesome) and
  before sibling `module-header.types`.
- **ng-packagr public surface:** exporting a non-component const from
  `public-api.ts` is supported by ng-packagr; no extra config needed. The
  `dist/` should emit `ui-messages.d.ts` with the literal types preserved.
- **`as const` deep typing:** `typeof CBA_UI_MESSAGES['moduleFooter']['status']['loading']`
  resolves to the literal `'Cargando…'`. If any consumer code does
  `string extends typeof ...` it could break; acceptable since this is a new
  export with no existing consumers.
- **Ellipsis character:** use `…` (U+2026), not three dots `...`, to match the
  existing `Loading…` style and to keep file length minimal.

## 11. Cross-references

- TODO task 2 source: `.agent/todos/20260730/20260730-todo-5.md` §2.
- Existing default strings being replaced: see §1 of this plan and the audit
  list in the task prompt.
- Plan file location: `.kilo/plans/20260731-phase7-task2-plan.md`.
- Next step after this plan is approved: **4.2 Implementation** (implementer
  sub-agent), following this plan exactly.

## 12. Self-check against TODO Task 2 acceptance

| TODO checkbox | Addressed by |
| --- | --- |
| Centralize library-owned default strings in one constants object | §4, §5.1 |
| Components read defaults from that module | §5.2–§5.5 |
| Consumers may override via inputs/projection | §3.3 (no change to override semantics) |
| Do NOT add language codes / locale switchers / loaders | §7 non-goals, §3.1 note |
| ModuleFooter default status texts Spanish | §5.2, §5.6 |
| ModuleHeader aria-labels/tooltips Spanish | §5.3, §5.7 |
| Modal dismiss/close labels Spanish | §5.4, §5.8 |
| Datepicker toggle Spanish | §5.5, §5.9 |
| Document Spanish-only in README/USAGE | §5.10, §5.12 |
| Assert Spanish default where it matters (footer status) | §5.6 |
| No i18n framework tests | (none added) |
| Export `CBA_UI_MESSAGES` only if useful | §6 (decision: yes, documented) |
| Update `.agent/project-structure.md` | §5.13 |

All Task 2 checkboxes are fully covered by the steps in this plan. No assumed
work outside Task 2's scope.