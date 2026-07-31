# Implementation Plan — `CbaModuleFooter`

- **Task:** Task 4 of `.agent/todos/20260730/20260730-todo-4.md` — Implement `CbaModuleFooter`.
- **Front-end spec:** `.kilo/plans/20260731-task4-module-footer-frontend-spec.md` (authoritative input).
- **Project:** `@cobranza-apps/ui` — Angular 22 standalone component library, OnPush, signal inputs.
- **Date:** 2026-07-31
- **Branch (assumed already created by Step 2):** `feat/phase6-module-footer` (or current feature branch assigned by Plan Agent).

---

## 0. Pre-analysis & technical decisions

### 0.1 Plain component — no ng-bootstrap dependency
`CbaModuleFooter` owns no overlay/menu logic. It imports only from `@angular/core`, `@fortawesome/angular-fontawesome`, `@fortawesome/fontawesome-svg-core`, and the local `module-header.types.ts`. **No** `NgbModule` import, **no** `hostDirectives`, **no** `NgbDropdown` injection.

### 0.2 Reuse `ModuleHeaderStatus` type
`ModuleHeaderStatus` is the single source of truth for status semantics and already covers `null`. It is imported from `src/components/module-header/module-header.types.ts` (existing barrel `index.ts` re-exports it). **No new types file is created.** The spec Section 1.4 explicitly states: *“No new public type is introduced.”*

### 0.3 Mirror header icon semantics locally
`ModuleHeader` keeps its `STATUS_VISUALS` mapping private to its own file. To keep the footer decoupled and avoid a fragile cross-component import of a private constant, this component defines its **own** `STATUS_VISUALS` record (identical content to the header’s), along with its own `StatusVisual` interface. The icon definitions referenced are the exact same `@fortawesome/free-solid-svg-icons` exports used by the header (`faSpinner`, `faCheck`, `faCircleCheck`, `faTriangleExclamation`, `faCircleXmark`, `faPen`), guaranteeing visual parity. Spec Section 1.4 mentions only the `STATUS_TEXTS` helper as internal; the `STATUS_VISUALS` mirror follows the same internal-only pattern.

### 0.4 Status text mapping
A readonly record `STATUS_TEXTS` maps each non-null status to its default string (spec Section 4). `displayText()` computed returns `statusText() ?? STATUS_TEXTS[status] ?? ''`.

### 0.5 Color for `dirty`
Spec Section 3.3 pins `dirty` → `var(--cba-text-secondary)`. The `ModuleHeader` uses `--cba-text-muted` for `dirty`. The spec is the front-end-authorized input for this task, so the footer follows the spec (`--cba-text-secondary`). This minor divergence is intentional and acceptable per the spec; implementer must NOT “fix” it to match the header without a spec change. (Flagged here for the Code Review step.)

### 0.6 Template element
Root is a `<footer>` element (spec Section 5/6). Host is the component itself (`:host { display: block }`).

### 0.7 Signals + OnPush
Use Angular 22 `input()` signal API and `computed()` (same pattern as `ModuleHeaderComponent`). `ChangeDetectionStrategy.OnPush`.

### 0.8 Rules compliance
- Max 200 lines/file (source). Component TS will be well under 125 effective lines.
- Max 50 lines/method — `STATUS_TEXTS`/`STATUS_VISUALS` are constants, not methods; computeds are one-liners.
- Max 2 params — no methods with params introduced.
- Max depth 2 — template uses a single `@if` nesting level; SCSS nesting kept shallow.
- Private members preferred — `STATUS_TEXTS`/`STATUS_VISUALS` are module-level constants (effectively private to the file); no `public` methods beyond the signal inputs/computeds required by the template.
- Standalone only — `standalone: true`.

### 0.9 File naming
The project uses two conventions: `cba-<name>.component.*` (newer components like `dropdown`) and `<name>.component.*` (module-header/module-container). The TODO and spec both use selector `cba-module-footer`. The spec Section 2 prescribes:
```
module-footer.component.ts
module-footer.component.html
module-footer.component.scss
```
Follow the spec file names exactly (matches `module-header` neighbour), class `ModuleFooterComponent`, selector `cobra-module-footer` → actually `cba-module-footer`.

---

## 1. Files to create (exact paths)

| # | Path | Purpose |
| --- | --- | --- |
| 1 | `src/components/module-footer/module-footer.component.ts` | Standalone component class + JSDoc. |
| 2 | `src/components/module-footer/module-footer.component.html` | Template: status region + default `<ng-content>`. |
| 3 | `src/components/module-footer/module-footer.component.scss` | BEM styles using only `--cba-*` tokens. |
| 4 | `src/components/module-footer/index.ts` | Barrel: re-export component + re-export `ModuleHeaderStatus` from `../module-header`. |
| 5 | `src/components/module-footer/module-footer.component.spec.ts` | Jest spec covering spec Section 7 cases. |

No types file is created (see 0.2).

---

## 2. Code snippets

### 2.1 `module-footer.component.ts`

```ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faPen,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { ModuleHeaderStatus } from '../module-header/module-header.types';

/** Visual configuration derived from a non-null status value. */
interface StatusVisual {
  readonly icon: IconDefinition;
  readonly animation?: 'spin';
}

/** Static status → visual mapping. Mirrors `ModuleHeader` icon semantics. `null` renders no icon. */
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin' },
  loaded: { icon: faCheck },
  success: { icon: faCircleCheck },
  warning: { icon: faTriangleExclamation },
  error: { icon: faCircleXmark },
  dirty: { icon: faPen },
};

/** Default status text used when `statusText` is not provided. `null` renders no text. */
const STATUS_TEXTS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, string>> = {
  loading: 'Loading…',
  loaded: 'Ready',
  success: 'Saved',
  warning: 'Attention needed',
  error: 'Error',
  dirty: 'Unsaved changes',
};

/**
 * Optional plain footer bar for a module.
 *
 * Renders a finite-height surface with module status text aligned to the same
 * `ModuleHeaderStatus` semantics used by {@link ModuleHeaderComponent}, plus an
 * optional default projection slot for auxiliary plain content. v1 is
 * intentionally plain: background only, no heavy borders/shadows, no toolbar.
 *
 * The footer is never mandatory: modules omit it entirely when not needed.
 *
 * @usageNotes
 * ```html
 * <cba-module-container [size]="'100%'" [isCollapsed]="false">
 *   <cba-module-header title="Invoice Editor" [status]="headerStatus"></cba-module-header>
 *   <div class="module-body"><!-- MFE content --></div>
 *   <cba-module-footer [status]="'dirty'">Changes are not saved automatically.</cba-module-footer>
 * </cba-module-container>
 * ```
 *
 * @remarks
 * Status values and their default text match {@link ModuleHeaderStatus}. When
 * `statusText` is provided it always overrides the default mapping. The status
 * region uses `role="status"` / `aria-live="polite"` so screen readers announce
 * status changes; the icon is decorative (`aria-hidden="true"`).
 *
 * @see {@link ModuleHeaderStatus}
 * @see {@link ModuleHeaderComponent}
 */
@Component({
  selector: 'cba-module-footer',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-footer.component.html',
  styleUrl: './module-footer.component.scss',
})
export class ModuleFooterComponent {
  /** Module status aligned with {@link ModuleHeaderStatus}. `null` renders no status region. */
  readonly status = input<ModuleHeaderStatus>(null);

  /** Explicit status text override. When provided, wins over the default `STATUS_TEXTS` mapping. */
  readonly statusText = input<string | undefined>(undefined);

  /** Status visual config or `null` when `status === null` (icon hidden). */
  readonly statusVisual = computed<StatusVisual | null>(() => {
    const current = this.status();
    return current === null ? null : (STATUS_VISUALS[current] ?? null);
  });

  /** BEM modifier class for the status region, or `null` when no status is set. */
  readonly statusClass = computed<string | null>(() => {
    const current = this.status();
    return current === null ? null : `cba-module-footer__status--${current}`;
  });

  /** Resolved status text: explicit override wins, else default mapping, else empty string. */
  readonly displayText = computed<string>(() => {
    const explicit = this.statusText();
    if (explicit !== undefined && explicit !== null) {
      return explicit;
    }
    const current = this.status();
    return current === null ? '' : (STATUS_TEXTS[current] ?? '');
  });

  /** Whether the status region (text + icon + live region) should render at all. */
  readonly hasStatusRegion = computed<boolean>(() => {
    return this.status() !== null || this.statusText() !== undefined;
  });
}
```

> **Notes for implementer**
> - `input<string | undefined>(undefined)` default lets the template distinguish “not provided” from a provided empty string; an empty-string `statusText` is a valid override that suppresses text but still counts as provided (region shows icon only if `status !== null`). This matches spec Section 4: *“If `statusText` is provided, it always wins.”*
> - Keep `StatusVisual` local (not exported) — it is an internal helper.
> - The two readonly records are module-private constants; do not export them from the barrel.

### 2.2 `module-footer.component.html`

```html
<footer class="cba-module-footer">
  @if (hasStatusRegion()) {
    <div
      class="cba-module-footer__status"
      [class]="statusClass() ?? ''"
      role="status"
      aria-live="polite"
      aria-atomic="true">
      @if (statusVisual(); as visual) {
        <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true" />
      }
      @if (displayText()) {
        <span class="cba-module-footer__text">{{ displayText() }}</span>
      }
    </div>
  }

  <ng-content></ng-content>
</footer>
```

> **Notes for implementer**
> - Nesting depth: `footer` → `@if` block → inner `@if`. This is two levels of template control-flow nesting, within the max-depth-2 rule.
> - `[class]="statusClass() ?? ''"` — when `status` is null but `statusText` is provided, `statusClass()` returns `null` and we bind the empty class so the element still renders the live region with neutral styling.
> - The inner `@if (displayText())` guards the empty-string-override case so no empty `<span>` leaks into the DOM.

### 2.3 `module-footer.component.scss`

```scss
:host {
  display: block;
}

.cba-module-footer {
  display: flex;
  align-items: center;
  height: var(--cba-module-footer-height, 40px);
  padding: 0 var(--cba-space-4);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-secondary);
  border-top: none;
  box-shadow: none;
  overflow: hidden;
  box-sizing: border-box;
}

.cba-module-footer__status {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-2);
  font-size: 14px;
  line-height: 1.5;
}

.cba-module-footer__status fa-icon {
  font-size: 0.875em;
}

.cba-module-footer__status--loading {
  color: var(--cba-accent-info);
}

.cba-module-footer__status--loaded,
.cba-module-footer__status--success {
  color: var(--cba-accent-success);
}

.cba-module-footer__status--warning {
  color: var(--cba-accent-warning);
}

.cba-module-footer__status--error {
  color: var(--cba-accent-danger);
}

.cba-module-footer__status--dirty {
  color: var(--cba-text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  :host ::ng-deep .fa-spin {
    animation: none;
  }
}
```

> **Notes for implementer**
> - `--cba-module-footer-height` is a local custom property with fallback `40px`, mirroring `ModuleHeader`’s `--cba-module-header-min-height` override pattern. This lets consumers tweak footer height without a new input.
> - `loaded` and `success` share the success accent (matches `ModuleHeader` scss grouping).
> - `dirty` uses `--cba-text-secondary` per spec (see 0.5). Do not change to `--cba-text-muted`.
> - No `--cba-bg-tertiary` variant needed in v1.

### 2.4 `index.ts`

```ts
/**
 * Barrel file for ModuleFooter.
 *
 * Re-exports the public API of the ModuleFooter component so consumers and
 * `public-api.ts` import from a single, stable path
 * (`components/module-footer`). `ModuleHeaderStatus` is re-exported here so
 * consumers importing the footer get the shared status type in the same
 * namespace. Internal helpers are NOT exported.
 */
export { ModuleFooterComponent } from './module-footer.component';
export type { ModuleHeaderStatus } from '../module-header/module-header.types';
```

> **Notes for implementer**
> - Use a named export for `ModuleFooterComponent` (not `export *`) so the barrel surfaces exactly the component class. Use `export type` for `ModuleHeaderStatus` to avoid a runtime re-export cycle and to keep the type-only surface clean. (`module-header/index.ts` already `export *`s it, so a plain `export *` would also work, but the named/type form is clearer and avoids exporting `ModuleHeaderComponent` from this footer barrel.)
> - Do NOT re-export `STATUS_VISUALS` / `STATUS_TEXTS` (internal).

---

## 3. Styling plan summary

| Concern | Token / value | Source |
| --- | --- | --- |
| Host | `:host { display: block }` | matches module-header |
| Background | `var(--cba-bg-secondary)` | spec 3.1 |
| Height | `var(--cba-module-footer-height, 40px)` | spec 3.1 (40px) |
| Horizontal padding | `0 var(--cba-space-4)` | spec 3.1 (16px) |
| Gap | `var(--cba-space-2)` | spec 3.1 (8px) |
| Border / shadow | `none` | spec 3.1 (plain v1) |
| Status text size | `14px / line-height 1.5` | spec 3.2 |
| Icon size | `0.875em` | spec 3.4 |
| loading color | `--cba-accent-info` | spec 3.3 |
| loaded/success | `--cba-accent-success` | spec 3.3 |
| warning | `--cba-accent-warning` | spec 3.3 |
| error | `--cba-accent-danger` | spec 3.3 |
| dirty | `--cba-text-secondary` | spec 3.3 |
| BEM root | `.cba-module-footer` | spec |
| BEM status | `.cba-module-footer__status` + `--{status}` modifiers | spec |

Reduces-motion: disable `.fa-spin` animation under `prefers-reduced-motion` (parity with `module-header.component.scss`).

---

## 4. Test plan — `module-footer.component.spec.ts`

Use the same harness pattern as `module-header.component.spec.ts` (jest + `TestBed`, `fixture.componentRef.setInput`). For projected-content cases, use a tiny host component (like `DropdownHost` in the dropdown spec).

### 4.1 Test cases (exact)

1. **Default text per status** — for each non-null status in `['loading','loaded','success','warning','error','dirty']`:
   - Render `<cba-module-footer [status]="status">`.
   - Assert `.cba-module-footer__text` text equals the expected default:
     - loading → `Loading…`
     - loaded → `Ready`
     - success → `Saved`
     - warning → `Attention needed`
     - error → `Error`
     - dirty → `Unsaved changes`
   - Use a table-driven test (`it.each` / array `forEach`).

2. **`statusText` override wins** — render `[status]="'dirty'" [statusText]="'Draft mode active'"` and assert `Draft mode active` is present and `Unsaved changes` is NOT present in `.cba-module-footer__text`.

3. **No status region for `null` and no projection** — render `[status]="null"` with no projection; assert there is NO element with `role="status"`, NO `<fa-icon>`, and NO `.cba-module-footer__text`. (The `<footer.cba-module-footer>` host-surface still exists.)

4. **Projected content renders** — host component template:
   ```html
   <cba-module-footer [status]="null"><span class="proj">aux</span></cba-module-footer>
   ```
   Assert `.proj` appears inside the footer and that no status region is rendered (because `status` is null and no `statusText`).

5. **Projected content renders alongside status** — host template:
   ```html
   <cba-module-footer [status]="'dirty'"><span class="proj">hint</span></cba-module-footer>
   ```
   Assert both `.cba-module-footer__text` (Unsaved changes) and `.proj` (hint) are present.

6. **Icon mirrors header semantics** — for each non-null status, assert a `<fa-icon>` is rendered and that its resolved icon matches the same `IconDefinition` used by `ModuleHeaderComponent` for that status. Implementation note: compare against the identical `@fortawesome/free-solid-svg-icons` export the component imports:
   - loading → `faSpinner`
   - loaded → `faCheck`
   - success → `faCircleCheck`
   - warning → `faTriangleExclamation`
   - error → `faCircleXmark`
   - dirty → `faPen`
   - Test by querying `.cba-module-footer__status fa-icon` and asserting it is not null (exact icon-definition parity with header is guaranteed by the shared constant set; a structural assertion is sufficient and avoids brittle FontAwesome internal introspection).

7. **Color modifier class per status** — for each non-null status, assert `.cba-module-footer__status` has the class `cobra-module-footer__status--{status}` (e.g. `--error`). Table-driven.

8. **Live region attributes** — render `[status]="'error'"` and assert the status wrapper element has `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`.

9. **Icon is decorative** — render `[status]="'success'"` and assert the `<fa-icon>` host element has `aria-hidden="true"`.

10. **`statusText` provided with `status=null` shows live region with neutral color** — render `[status]="null" [statusText]="'Custom note'"`; assert `Custom note` is present in `.cba-module-footer__text`, the status region (`role="status"`) is rendered, NO `<fa-icon>` is present, and the status wrapper does NOT carry any `--{status}` modifier class (only base `cobra-module-footer__status`).

> Build/lint/test acceptance is covered in Section 6.

### 4.2 Spec skeleton

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleFooterComponent } from './module-footer.component';
import { ModuleHeaderStatus } from '../module-header/module-header.types';

interface Scenario { status: Exclude<ModuleHeaderStatus, null>; text: string; iconPresent: boolean; modifier: string; }

const STATUS_SCENARIOS: Scenario[] = [
  { status: 'loading', text: 'Loading…', iconPresent: true, modifier: 'cobra-module-footer__status--loading' },
  { status: 'loaded',  text: 'Ready',    iconPresent: true, modifier: 'cobra-module-footer__status--loaded' },
  { status: 'success', text: 'Saved',    iconPresent: true, modifier: 'cobra-module-footer__status--success' },
  { status: 'warning', text: 'Attention needed', iconPresent: true, modifier: 'cobra-module-footer__status--warning' },
  { status: 'error',   text: 'Error',    iconPresent: true, modifier: 'cobra-module-footer__status--error' },
  { status: 'dirty',   text: 'Unsaved changes', iconPresent: true, modifier: 'cobra-module-footer__status--dirty' },
];

@Component({ standalone: true, imports: [ModuleFooterComponent], template: `<cba-module-footer [status]="status" [statusText]="statusText"><span class="proj">hint</span></cba-module-footer>` })
class FooterHost { status: ModuleHeaderStatus = null; statusText: string | undefined = undefined; }
// ... fixture setup + table-driven assertions per cases 1–10
```

Notes:
- Use direct `TestBed.createComponent(ModuleFooterComponent)` for non-projection tests (set inputs via `componentRef.setInput`).
- Use `FooterHost` host component for projection tests (cases 4, 5, and 10′s projection variants).
- All assertions use `fixture.nativeElement.querySelector(...)`.
- Mock theme tokens are not needed; tests assert structural/class/text, not computed styles.

---

## 5. Integration steps

### 5.1 Update `src/public-api.ts`
Insert a new line in the components group, alphabetical order, **after** `module-container` and **before** `module-header` (spec Section 2):

```ts
export * from './components/module-container';
export * from './components/module-footer';   // <-- NEW
export * from './components/module-header';
```

> Keep the rest of the file unchanged (Code Guidelines rule 5: preserve existing code).

### 5.2 Update `.agent/project-structure.md`
Add a new bullet under `# Folders in src/` immediately after the `module-container` line (alphabetical-ish with neighbours):

```markdown
- src/components/module-footer/ - CbaModuleFooter component: optional plain module footer bar with status text/icons aligned to ModuleHeaderStatus
```

### 5.3 Build / lint / test commands
Run each as a single `bash` command (per tool-selection rule — no chaining):
1. `npm run build` — ng-packagr build of the library (acceptance: succeeds with no errors).
2. `npm run lint` — ESLint on `src/**/*.ts` (acceptance: no new errors).
3. `npm test` — Jest (acceptance: new spec passes; existing specs unaffected).

> The implementer MUST run `npm run build` at minimum; `lint` and `test` should be run if available in the environment. If `npm test` fails to discover the new spec, verify jest config picks up `**/*.spec.ts` under `src/` (existing specs are discovered, so the new one will be too).

### 5.4 Docs (handled by Step 4.4, NOT this plan)
This plan authorises the implementer to add a JSDoc example (already in the component) but **does not** create the `/docs/CBA_MODULE_FOOTER.md` file. That is Step 4.4 (docs-specialist). The component JSDoc already satisfies the “JSDoc + example” requirement; the docs file is a separate delegation.

---

## 6. Acceptance criteria checklist

- [ ] `src/components/module-footer/` folder created with `module-footer.component.ts`, `.html`, `.scss`, `index.ts`, `module-footer.component.spec.ts`.
- [ ] Component selector `cba-module-footer`, standalone, OnPush, imports only `FaIconComponent`.
- [ ] `status` input typed `ModuleHeaderStatus` (default `null`), imported from `../module-header/module-header.types`.
- [ ] `statusText` input typed `string | undefined` (default `undefined`); override wins over default mapping.
- [ ] `STATUS_TEXTS` mapping matches spec Section 4 exactly (`Loading…`, `Ready`, `Saved`, `Attention needed`, `Error`, `Unsaved changes`).
- [ ] `STATUS_VISUALS` icon mapping mirrors `ModuleHeaderComponent` (loading→spinner+spin, loaded→check, success→circle-check, warning→triangle-exclamation, error→circle-xmark, dirty→pen).
- [ ] No icon/text rendered when `status === null` and no `statusText`/projection.
- [ ] Live region: status wrapper has `role="status"`, `aria-live="polite"`, `aria-atomic="true"`.
- [ ] Icon is `aria-hidden="true"`.
- [ ] Default `<ng-content>` slot projects auxiliary plain content after the status region.
- [ ] Background `--cba-bg-secondary`, height `40px` (via `--cba-module-footer-height` fallback), padding `0 var(--cba-space-4)`, gap `--cba-space-2`.
- [ ] Status colors per spec: loading/success loaded→info/success, warning→warning, error→danger, dirty→`--cba-text-secondary`.
- [ ] BEM naming `cobra-module-footer`, `cobra-module-footer__status`, `--{status}` modifiers.
- [ ] `index.ts` exports `ModuleFooterComponent` (named) and re-exports `ModuleHeaderStatus` as type.
- [ ] `src/public-api.ts` adds `export * from './components/module-footer';` between `module-container` and `module-header`.
- [ ] `.agent/project-structure.md` updated with the new folder line.
- [ ] `npm run build` succeeds with no errors.
- [ ] `npm run lint` reports no new errors.
- [ ] `npm test` passes (new spec + existing specs green).
- [ ] Component TS ≤ 200 lines; methods ≤ 50 lines; no `&&`/section compound boolean conditions (none introduced); depth ≤ 2.
- [ ] Minimal spec covers cases 1–10 of Section 4.

---

## 7. Out of scope (explicit)

- `ModuleContainer` optional footer slot (TODO integration note says “may be added — but keep it optional and non-breaking”). NOT in this task; only the footer component.
- `/docs/CBA_MODULE_FOOTER.md` (Step 4.4).
- Any change to `module-header` files.
- Git commit/branch actions (Step 2 owns branch; Step 4.2 / 4.6 own commits).

---

## 8. Assumptions & flags for the caller

- **A1:** The feature branch for this TODO is assumed already created by Critical Workflow Step 2. This plan does not perform git operations.
- **A2:** FontAwesome v7 `FaIconComponent` `[animation]` input is available (header uses it; spec Section 3.4 relies on it). Verified against existing `module-header.component.html`.
- **F1 (divergence flag):** Footer uses `--cba-text-secondary` for `dirty` while header uses `--cba-text-muted`. Spec-authorised. Code reviewer should not “normalise” this without a spec change.
- **F2:** Spec Sections 2/4 imply the barrel re-exports `ModuleHeaderStatus`; chosen form is `export type` to avoid widening the footer barrel to the header component class. If the Plan Agent prefers `export *` for parity with `module-header/index.ts`, that is an acceptable swap at implementation time.

**Plan file path:** `.kilo/plans/20260731-task4-module-footer-impl.md`