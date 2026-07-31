# CbaDropdown — Implementation Plan

**Project:** `@cobranza-apps/ui`
**Task:** Phase 6 / Task 1 — Implement `CbaDropdown` (TODO `.agent/todos/20260730/20260730-todo-4.md`, section "### 1. Implement CbaDropdown")
**Step:** 4.1b — Analysis & Planning
**Author:** architector sub-agent
**Related spec:** `.kilo/plans/20260731-task1-dropdown-frontend-spec.md` (produced in 4.1a)
**Date:** 2026-07-31

---

## 0. Pre-analysis & decisions

### 0.1 Verification of inputs from the spec
The front-end spec (4.1a) is unambiguous and matches the TODO. Verified against source:
- ng-bootstrap v21 is installed (`package.json` peer + devDependency `^21.0.0`). No new dependency needed.
- `node_modules/@ng-bootstrap/ng-bootstrap/types/ng-bootstrap-ng-bootstrap-dropdown.d.ts` confirms:
  - `NgbDropdown` is a directive on selector `[ngbDropdown]` with `placement: PlacementArray` input and `openChange: EventEmitter<boolean>` output, plus `open()/close()/toggle()/isOpen()` public methods.
  - `NgbDropdownMenu` selector `[ngbDropdownMenu]`, `NgbDropdownToggle` selector `[ngbDropdownToggle]`, `NgbDropdownItem` selector `[ngbDropdownItem]`.
- `node_modules/@ng-bootstrap/ng-bootstrap/types/ng-bootstrap.d.ts` line 39 re-exports `Placement` and `PlacementArray` from the root entry, so `import { PlacementArray } from '@ng-bootstrap/ng-bootstrap'` is valid.
- `NgbDropdownModule` exports all five directives.
- `NgbDropdown` has **no `disabled` input** — disabled is purely a wrapper concern (host class + `aria-disabled` + consumer mirrors on the projected toggle). Confirmed from the `.d.ts`.

### 0.2 Architecture decision — where `ngbDropdown` lives
Two options were considered:

| Option | Description | Verdict |
| ------ | ----------- | ------- |
| A. `hostDirectives: [NgbDropdown]` on `<cba-dropdown>` | Forwards `placement`/`openChange` automatically; directive lives on the host element. | Rejected. Hides `placement`/`openChange` as wrapper members, makes the explicit JSDoc + signal-input pattern inconsistent with `CbaModal`/`CbaButton`/`CbaDatepicker`, and complicates the spec's test that asserts a visible `placement()` input on the component instance. |
| B. Inner root `<div ngbDropdown>` in the template with explicit `[placement]`/`(openChange)` bindings. | Mirrors `CbaDatepicker` (directive in template) and `CbaModal` (template owns ng-bootstrap structure). Exposes `placement()` signal input and `openChange` output as real component members. | **Chosen.** Consistent with existing wrapper patterns, explicit, testable, and keeps host `<cba-dropdown>` clean for `class`/`--disabled`/`aria-disabled` modifiers. |

**Consequence:** the consumer-facing DOM is:
```text
<cba-dropdown class="cba-dropdown">            <!-- host: themed class + disabled state -->
  <div ngbDropdown [placement]="placement()"  <!-- inner root: ng-bootstrap dropdown engine -->
       (openChange)="openChange.emit($event)">
    <ng-content select="[cbaDropdownToggle]"></ng-content>
    <div class="cba-dropdown__menu" ngbDropdownMenu>
      <ng-content></ng-content>                <!-- default slot = menu items -->
    </div>
  </div>
</cba-dropdown>
```
`NgbDropdown` automatically adds the Bootstrap `.dropdown` class to the inner div, providing `position: relative` for menu positioning. The host remains `display: inline-block`.

### 0.3 Rule compliance check
- **Max 200 lines / file** (`max-lines-per-file.md`): TS ≈ 70, HTML ≈ 6, SCSS ≈ 70, spec ≈ 110, index ≈ 6 — all well under 200.
- **Max 50 lines / method** (`max-lines-per-method.md`): no methods exceed a few lines; class has no large methods.
- **Max 2 params / method** (`max-arguments-per-method.md`): no methods with params except output handler `onOpenChange(open: boolean)` (1 param). Compliant.
- **Max depth 2** (`max-depth.md`): SCSS nesting reaches at most 2 levels (`.cba-dropdown__menu` → `[ngbDropdownItem]` → `&:hover`). Compliant.
- **Prefer private members** (`prefer-private-members.md`): only `placement`/`disabled` signal inputs (must be public), `openChange` output (must be public), and `onOpenChange` handler — marked `protected`. No internal state. Compliant.
- **Standalone components only**: confirmed (project uses standalone everywhere; `@Component({ standalone: true })`).
- **Self-documenting code / JSDoc**: required by TODO ("JSDoc + example"); spec §7 requires it.
- **No commented-out code**, **no `\n` literals**, **single-section boolean conditions**: enforced in snippets below.
- **Project structure** (`.agent/project-structure.md`): new folder `src/components/dropdown/` follows existing convention; `.agent/project-structure.md` will be updated.
- **Public barrel**: `src/public-api.ts` updated in alphabetical order (`dropdown` sorts between `datepicker` and `empty-state`).

### 0.4 Ambiguities / gaps → none blocking
All open questions from the spec are resolved by the spec itself. No caller escalation needed.

### 0.5 High-level approach
1. Create folder `src/components/dropdown/` and 5 files (TS, HTML, SCSS, spec, barrel `index.ts`). No separate types file — the single `CbaDropdownPlacement` type alias lives in the component TS (one small re-export, consistent with `CbaButtonComponent` which co-locates its types).
2. Component is a thin standalone wrapper: imports `NgbDropdownModule` (so `ngbDropdown`/`ngbDropdownMenu` directives resolve in the template), exposes `placement`/`disabled` signal inputs and `openChange` output, projects toggle + menu items.
3. Theme SCSS styles the inner `.dropdown-menu` (surrogate for `ngbDropdownMenu` host class) via the component-scoped `.cba-dropdown__menu` class, and styles `[ngbDropdownItem]` attribute so consumers do **not** need a custom item class.
4. Barrel + `public-api.ts` export.
5. Update `.agent/project-structure.md`.
6. Tests (Jest + `jest-preset-angular`) covering only wrapper concerns.
7. Build, test, lint verification.

---

## 1. Files to create

All paths are absolute relative to the workspace root `C:\projects\cobranza-app\front\ui`.

| # | Path | Purpose |
| - | ---- | ------- |
| 1 | `src/components/dropdown/cba-dropdown.component.ts` | Standalone component class. Selector `cba-dropdown`. Signal inputs `placement`/`disabled`, output `openChange`, content projection slots, host class + `--disabled`/`aria-disabled` bindings. Also co-locates the `CbaDropdownPlacement` type alias. |
| 2 | `src/components/dropdown/cba-dropdown.component.html` | Template: inner `<div ngbDropdown>` root with `[placement]`/`(openChange)` bindings, `[cbaDropdownToggle]` projection slot, and `<div class="cba-dropdown__menu" ngbDropdownMenu>` wrapping the default `<ng-content>`. |
| 3 | `src/components/dropdown/cba-dropdown.component.scss` | Theme styles using `--cba-*` tokens: host block, disabled modifier, menu surface, item hover/active/focus/disabled, optional divider, reduced-motion. |
| 4 | `src/components/dropdown/cba-dropdown.component.spec.ts` | Jest tests — wrapper concerns only (host class, projection, input forwarding, output passthrough, disabled state). |
| 5 | `src/components/dropdown/index.ts` | Barrel re-exporting `CbaDropdownComponent` and `CbaDropdownPlacement`. |

**Files NOT created** (deliberate):
- No separate `cba-dropdown.types.ts` — the single `CbaDropdownPlacement` alias is trivial (`= PlacementArray`) and co-locating it mirrors `CbaButtonComponent`. Avoids an extra file per the "keep it thin" directive.
- No service (unlike `CbaModal`, dropdown is template-driven, not service-driven).

### Files to modify

| # | Path | Change |
| - | ---- | ------ |
| 6 | `src/public-api.ts` | Add `export * from './components/dropdown';` in alphabetical order between the `datepicker` and `empty-state` lines. |
| 7 | `.agent/project-structure.md` | Add line under `# Folders in src/`: `- src/components/dropdown/ - CbaDropdown component: thin ng-bootstrap dropdown wrapper with projected toggle and menu items` (insert after the `datepicker` line to preserve order). |

---

## 2. Code snippets

### 2.1 `src/components/dropdown/cba-dropdown.component.ts`

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgbDropdownModule, PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/** Placement alias used by `CbaDropdown`. Passthrough to ng-bootstrap's `PlacementArray`. */
export type CbaDropdownPlacement = PlacementArray;

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` dropdown.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns menu open/close, keyboard navigation, focus management,
 *   auto-close, and Popper positioning.
 * - This component owns the Cobranza gray-theme surface, a stable `cba-dropdown`
 *   selector, and two thin passthrough inputs (`placement`, `disabled`) plus an
 *   `openChange` output.
 *
 * Project the toggle marked with both `cbaDropdownToggle` **and** `ngbDropdownToggle`
 * (the latter wires ng-bootstrap click handling). Project menu items inside the
 * default slot, each decorated with `ngbDropdownItem` so keyboard navigation works.
 *
 * @usageNotes
 * ```html
 * <cba-dropdown [disabled]="isDisabled" (openChange)="onOpen($event)">
 *   <cba-button cbaDropdownToggle ngbDropdownToggle variant="secondary"
 *              [disabled]="isDisabled">Options</cba-button>
 *   <button ngbDropdownItem (click)="onEdit()">Edit</button>
 *   <button ngbDropdownItem (click)="onDuplicate()">Duplicate</button>
 *   <div class="dropdown-divider"></div>
 *   <button ngbDropdownItem [disabled]="true">Delete</button>
 * </cba-dropdown>
 * ```
 *
 * @remarks
 * Behavior (open/close, positioning, keyboard) comes from `@ng-bootstrap/ng-bootstrap`.
 * `CbaDropdown` only adds theming and a stable projection API.
 *
 * @see [CBA_DROPDOWN.md](/docs/CBA_DROPDOWN.md)
 */
@Component({
  selector: 'cba-dropdown',
  standalone: true,
  imports: [NgbDropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-dropdown.component.html',
  styleUrl: './cba-dropdown.component.scss',
  host: {
    class: 'cba-dropdown',
    '[class.cba-dropdown--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class CbaDropdownComponent {
  /**
   * Preferred menu placement, forwarded to `NgbDropdown#placement`.
   * Follows ng-bootstrap positioning semantics
   * (e.g. `'bottom-start'`, `'top-end'`, or an array of fallbacks).
   */
  readonly placement = input<CbaDropdownPlacement>(undefined);

  /**
   * Wrapper-level disabled state. When `true`, applies the `cba-dropdown--disabled`
   * host modifier (blocks pointer events, dims the host) and sets `aria-disabled`.
   * The projected toggle (e.g. `cba-button`) **must** mirror this value on its own
   * `[disabled]` binding so the native button is fully disabled.
   */
  readonly disabled = input<boolean>(false);

  /** Passthrough for `NgbDropdown#openChange`. Emits `true` on open, `false` on close. */
  readonly openChange = output<boolean>();

  /** Bridges `NgbDropdown#openChange` to the wrapper output. */
  protected onOpenChange(open: boolean): void {
    this.openChange.emit(open);
  }
}
```

**Notes:**
- `input<CbaDropdownPlacement>(undefined)` — default `undefined` lets ng-bootstrap apply its own default placement order (`bottom-start bottom-end top-start top-end`), matching the spec.
- `host['[attr.aria-disabled]']` uses `"true"`/`null` so the attribute is absent when enabled (spec §4).
- `onOpenChange` exists to keep the template binding declarative and avoid an inline arrow (improves readability and lint cleanliness). Stays well under any method length/depth limits.

### 2.2 `src/components/dropdown/cba-dropdown.component.html`

```html
<div class="cba-dropdown__root"
     ngbDropdown
     [placement]="placement()"
     (openChange)="onOpenChange($event)">
  <ng-content select="[cbaDropdownToggle]"></ng-content>
  <div class="cba-dropdown__menu" ngbDropdownMenu>
    <ng-content></ng-content>
  </div>
</div>
```

**Notes:**
- `class="cba-dropdown__root"` is intentionally minimal — `NgbDropdown` adds Bootstrap's `.dropdown` class to this same element, providing `position: relative` for menu anchoring. No extra CSS rules are needed on `__root`; the class exists only as a stable BEM hook in case future wrappers need it.
- `[placement]="placement()"` forwards the signal input to the `NgbDropdown` directive instance (satisfies spec test 5.1.3 — query `NgbDropdown`, check `.placement`).
- `(openChange)` is `NgbDropdown`'s output; `onOpenChange` re-emits through the wrapper output (satisfies spec test 5.1.4).
- `[cbaDropdownToggle]` projection slot — the toggle must additionally carry `ngbDropdownToggle` (documented in JSDoc + spec §1.6 note).
- Default `<ng-content>` lands inside `ngbDropdownMenu` so projected items decorated with `ngbDropdownItem` are registered for keyboard navigation.

### 2.3 `src/components/dropdown/cba-dropdown.component.scss`

```scss
:host {
  display: inline-block;
}

:host(.cba-dropdown--disabled) {
  pointer-events: none;
  opacity: 0.6;
}

.cba-dropdown__menu {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-elevated);
  padding: var(--cba-space-1) 0;
  min-width: 12rem;

  [ngbDropdownItem] {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--cba-space-2) var(--cba-space-4);
    border: none;
    background: transparent;
    color: var(--cba-text-primary);
    font-size: 0.875rem;
    line-height: 1.5;
    text-align: left;
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease;

    &:hover {
      background-color: var(--cba-hover);
    }

    &:active,
    &.active {
      background-color: var(--cba-active);
    }

    &:focus-visible {
      outline: none;
      box-shadow: inset var(--cba-focus-ring);
    }

    &[disabled] {
      color: var(--cba-text-muted);
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

  .dropdown-divider {
    height: 0;
    margin: var(--cba-space-1) 0;
    border-top: 1px solid var(--cba-border-subtle);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cba-dropdown__menu [ngbDropdownItem] {
    transition: none;
  }
}
```

**Notes:**
- `ViewEncapsulation.Emulated` (Angular default) scopes `.cba-dropdown__menu` and `[ngbDropdownItem]` selectors to the component, so the `[ngbDropdownItem]` attribute targeting works because `ngbDropdownItem` is rendered on elements **projected** into this component's view — emulated encapsulation still scopes attribute selectors to projected content that lives inside the component's template host. (Same mechanism the datepicker uses for projected option styling.)
- Max nesting depth = 2 (`.cba-dropdown__menu` → `[ngbDropdownItem]` → `&:hover`). Compliant.
- Token usage exactly per spec §2.3/§2.4: `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`, `--cba-space-1/2/4`, `--cba-text-primary`, `--cba-text-muted`, `--cba-hover`, `--cba-active`, `--cba-focus-ring`. All confirmed present in `brief.md` §5 (lines 107–154).
- `min-width: 12rem` is the one non-token value; the spec §2.3 explicitly flags this as a candidate for future tokenization (`--cba-dropdown-min-width`) and leaves it inline for v1. Keeping inline matches the spec.
- Reduced-motion block disables item transitions only — no positioning/animation from ng-bootstrap is touched.
- Toggle styling is intentionally **not** added (spec §2.6): the projected `cba-button` already renders its own `--cba-focus-ring`.

### 2.4 `src/components/dropdown/index.ts`

```ts
/**
 * Barrel for `CbaDropdown`. Re-exports the public API so `public-api.ts`
 * and consumers import from `components/dropdown`.
 */
export * from './cba-dropdown.component';
```

**Note:** `export * from './cba-dropdown.component'` re-exports both `CbaDropdownComponent` and the co-located `CbaDropdownPlacement` type. Mirrors `CbaDatepicker` barrel pattern.

### 2.5 `src/public-api.ts` — modification

Insert one line in the components group, preserving alphabetical order. The current block:
```ts
export * from './components/datepicker';
export * from './components/empty-state';
```
becomes:
```ts
export * from './components/datepicker';
export * from './components/dropdown';
export * from './components/empty-state';
```
No other lines change.

### 2.6 `.agent/project-structure.md` — modification

Insert after the `datepicker` line (line 23) within `# Folders in src/`:
```text
- src/components/dropdown/ - CbaDropdown component: thin ng-bootstrap dropdown wrapper with projected toggle and menu items
```
No other lines change.

---

## 3. Styling plan (summary)

| Surface | Tokens used | BEM / selector |
| ------- | ----------- | -------------- |
| Host block | (none — layout `inline-block`) | `:host` |
| Disabled host | (opacity, pointer-events — no tokens needed for v1 per spec §2.2) | `:host(.cba-dropdown--disabled)` |
| Menu surface | `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`, `--cba-space-1` | `.cba-dropdown__menu` |
| Menu item base | `--cba-text-primary`, `--cba-space-2`, `--cba-space-4` | `.cba-dropdown__menu [ngbDropdownItem]` |
| Item hover | `--cba-hover` | `[ngbDropdownItem]:hover` |
| Item active | `--cba-active` | `[ngbDropdownItem]:active, .active` |
| Item focus | `--cba-focus-ring` (inset) | `[ngbDropdownItem]:focus-visible` |
| Item disabled | `--cba-text-muted` | `[ngbDropdownItem][disabled]` |
| Divider (optional) | `--cba-border-subtle`, `--cba-space-1` | `.cba-dropdown__menu .dropdown-divider` |
| Reduced motion | (transition: none) | `@media (prefers-reduced-motion: reduce)` |

**Leakage prevention:** every rule is scoped by emulated encapsulation to `<cba-dropdown>`. Consumers never need to add a custom item class — the `[ngbDropdownItem]` attribute selector themes ng-bootstrap's own item directive. The Bootstrap `.dropdown-menu` base class (rendered by `ngbDropdownMenu`) is overridden in place by `.cba-dropdown__menu` (the element carries both classes; our scoped rules win via equal specificity + source order in the component shadow). This keeps theming invisible to consumers, satisfying the spec §3 "without leaking implementation".

---

## 4. Test plan

File: `src/components/dropdown/cba-dropdown.component.spec.ts`. Follows the `CbaDatepickerComponent` spec style (direct import, `TestBed.configureTestingModule({ imports: [...] })`, `componentRef.setInput(...)` for signal inputs), with a small test-host component for projection (mirrors `CbaModalComponent` spec's `ModalProjectionHost`).

### 4.1 Test setup

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbDropdownModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { CbaButtonComponent } from '../button/cba-button.component';
import { CbaDropdownComponent } from './cba-dropdown.component';

@Component({
  standalone: true,
  imports: [CbaDropdownComponent, CbaButtonComponent, NgbDropdownModule],
  template: `<cba-dropdown [disabled]="disabled" (openChange)="onOpen($event)">
    <cba-button class="tg" cbaDropdownToggle ngbDropdownToggle>Options</cba-button>
    <button class="item" ngbDropdownItem>Edit</button>
    <button class="item-disabled" ngbDropdownItem [disabled]="true">Delete</button>
  </cba-dropdown>`,
})
class DropdownHost {
  disabled = false;
  onOpen = jest.fn();
}
```

### 4.2 Exact test cases

1. **Host class and default state**
   - Create `CbaDropdownComponent` directly.
   - Assert host element `.classList.contains('cba-dropdown')` is `true`.
   - Assert `disabled()` default is `false` (read `fixture.componentInstance.disabled()`).
   - Assert host does **not** have `cba-dropdown--disabled` and `getAttribute('aria-disabled')` is `null`.

2. **Disabled state toggling**
   - `componentRef.setInput('disabled', true)`; `detectChanges()`.
   - Assert host `.classList.contains('cba-dropdown--disabled')` is `true`.
   - Assert `host.getAttribute('aria-disabled')` is `'true'`.
   - Reset to `false`; assert `--disabled` removed and `aria-disabled` is `null`.

3. **Content projection — toggle slot**
   - Render `DropdownHost`.
   - Assert `.tg` (projected toggle) is found inside the `<cba-dropdown>` host.
   - Assert it carries `ngbDropdownToggle` (NgbDropdownToggle directive instantiated — query `By.directive(NgbDropdownToggle)` if needed, or assert the button exists and is a `<button>`).

4. **Content projection — default menu items**
   - Render `DropdownHost`.
   - Assert both `.item` and `.item-disabled` buttons are present inside `.cba-dropdown__menu`.
   - Assert a `[ngbDropdownMenu]` element exists wrapping them (query `By.directive(NgbDropdownMenu)` or `By.css('.cba-dropdown__menu')`).

5. **Input forwarding — `placement`**
   - Create `CbaDropdownComponent`; `setInput('placement', 'top-start')`; `detectChanges()`.
   - Query the `NgbDropdown` directive instance via `fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown)` (or `By.directive(NgbDropdown)` + `.componentInstance`).
   - Assert `ngbDropdown.placement` equals `'top-start'`.
   - (Second assertion: leave `placement` unset → `ngbDropdown.placement` is `undefined`; ng-bootstrap then applies its own default — do **not** assert the default value, since that is ng-bootstrap internals.)

6. **Output passthrough — `openChange`**
   - Render `DropdownHost`.
   - Get `NgbDropdown` instance (same query as test 5).
   - Call `ngbDropdown.open()`; `detectChanges()`.
   - Assert `hostComponent.onOpen` was called with `true`.
   - Call `ngbDropdown.close()`; `detectChanges()`.
   - Assert `hostComponent.onOpen` was called with `false`.

7. **Disabled pointer-events guard (class presence only)**
   - Covered implicitly by test 2 (class assertion). Do **not** assert computed `pointer-events` — that is a CSS concern and the spec §5.1.5 explicitly says the class check is sufficient.

### 4.3 What NOT to test (per spec §5.2)
- ng-bootstrap Popper positioning / actual menu placement in the viewport.
- Keyboard navigation (arrows, Home/End, Esc) — ng-bootstrap internals.
- Auto-close behavior (outside click, item click, Esc) — ng-bootstrap internals.
- Browser-native menu rendering across viewports.
- Bootstrap `.dropdown-menu` base styles (only our overrides matter, and those are CSS — not unit-tested).

### 4.4 Test execution
```
npm test -- cba-dropdown
```
(or `npx jest cba-dropdown`). Must pass alongside the existing suite.

---

## 5. Integration steps (ordered, atomic)

### Step 5.1 — Create folder + files
1. Create `src/components/dropdown/` folder (use `mkdir` or rely on file-creation tools that auto-create parents).
2. Create the 5 files with the exact contents from §2.1–§2.4.

### Step 5.2 — Update barrel
3. Edit `src/public-api.ts`: insert `export * from './components/dropdown';` between the `datepicker` and `empty-state` lines (§2.5).

### Step 5.3 — Update project-structure map
4. Edit `.agent/project-structure.md`: insert the `src/components/dropdown/` line after the `datepicker` line (§2.6).

### Step 5.4 — Build verification (no app entry; library build via ng-packagr)
5. Run:
   ```
   npm run build
   ```
   - Entry command is `ng-packagr -p ng-libraryconfig.json -c tsconfig.lib.json` (already defined in `package.json`).
   - Must complete with no Angular/ng-packagr errors; `.d.ts`/`.metadata.json` artifacts must include `CbaDropdownComponent` and `CbaDropdownPlacement`.

### Step 5.5 — Lint
6. Run:
   ```
   npm run lint
   ```
   - Entry is `eslint "src/**/*.ts"`. Must report zero errors/warnings on the new files.

### Step 5.6 — Test
7. Run:
   ```
   npm test
   ```
   - Must pass all suites including new `cba-dropdown.component.spec.ts`.

### Step 5.7 — Git (deferred to step 4.2/4.6 per Critical Workflow)
- This 4.1b step does **not** perform git actions. The implementer (4.2) will commit on the feature branch with a message such as:
  `feat(dropdown): add CbaDropdown thin ng-bootstrap wrapper`
- Follow `gitignore-compliance.md`: run `git status` before commit; ensure no `node_modules`/build artifacts are staged.

---

## 6. Acceptance criteria checklist (mapped to TODO + spec §7)

Each item is verifiable by the indicated step.

- [ ] **AC1** — `CbaDropdown` exists as a thin ng-bootstrap dropdown wrapper and compiles. → Step 5.4 (`npm run build` succeeds); file `src/components/dropdown/cba-dropdown.component.ts` exists with selector `cba-dropdown` and `imports: [NgbDropdownModule]`.
- [ ] **AC5** — No custom dropdown/popover/typeahead engines introduced. → Only `NgbDropdownModule` is imported; no custom open/close/keyboard logic in the TS. Verified by grep: `import.*NgbDropdownModule` present, no `addEventListener('keydown'`, no manual `document` menu logic.
- [ ] **AC6** — Visuals use only theme tokens. → SCSS uses only `var(--cba-*)` plus the one documented `12rem` min-width (spec-approved). No hex colors.
- [ ] **AC7** — Component exported from `public-api.ts`. → Step 5.2; grep `export \* from './components/dropdown'` in `src/public-api.ts`.
- [ ] **AC8** — Library build succeeds. → Step 5.4.
- [ ] **AC9 (docs + tests)** — JSDoc + example present; minimal wrapper tests pass. → §2.1 JSDoc block with `@usageNotes` example + `@remarks` ng-bootstrap note; spec file from §4 created; Step 5.6 green.
- TODO sub-checklist (Phase 6 / Task 1):
  - [ ] Build on ng-bootstrap dropdown (no custom menu system). → AC5.
  - [ ] Menu surface uses elevated bg + subtle border + radius tokens. → §2.3 `.cba-dropdown__menu` rules.
  - [ ] Item hover/active states use `--cba-hover` / `--cba-active`. → §2.3.
  - [ ] Text uses primary/secondary tokens with calm contrast. → `--cba-text-primary` / `--cba-text-muted`.
  - [ ] Works naturally with `cba-button` as toggle. → `DropdownHost` test + spec example §6.1 use `cba-button` as toggle.
  - [ ] Place under `src/components/dropdown/` (note: TODO says `src/lib/components/` but project convention, confirmed by `.agent/project-structure.md`, is `src/components/`; spec §1.7 reconciles this). → §1.
  - [ ] Export from `src/public-api.ts`. → AC7.
  - [ ] Build must succeed. → AC8.
  - [ ] JSDoc + example with button toggle and a few menu items. → §2.1 JSDoc.
  - [ ] Explicit note that behaviour comes from ng-bootstrap. → `@remarks` block.
  - [ ] Minimal tests for wrapper concerns only (projection / class mapping), not ng-bootstrap internals. → §4.2 + §4.3.

**Out of scope for this plan (handled by other Phase 6 tasks):** `CbaPopover`, `CbaTypeahead`, `CbaModuleFooter`, and docs file `docs/CBA_DROPDOWN.md` (docs creation is step 4.4 by docs-specialist; this plan references it for the JSDoc `@see` link only — the implementer/4.4 step will create it if not present).

---

## 7. Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Emulated encapsulation does not scope `[ngbDropdownItem]` styles to projected content. | Projected content rendered inside this component's template inherits the component's encapsulation attribute; the attribute selector `[ngbDropdownItem]` is scoped like any class selector. If a regression appears, fall back to `::ng-deep .cba-dropdown__menu [ngbDropdownItem]` bounded by the `.cba-dropdown__menu` parent — but this should not be needed. Verify visually in step 5.4 build + spec rendering. |
| `placement` default `undefined` vs ng-bootstrap's internal default. | The wrapper intentionally passes `undefined` so ng-bootstrap applies its own default placement order. Tests assert forwarding only, not the resolved default (§4.2 test 5). |
| `output<boolean>()` type vs `NgbDropdown.openChange: EventEmitter<boolean>`. | The wrapper output is a standard Angular `OutputEmitterRef<boolean>`; `onOpenChange` bridges. No `EventEmitter` import needed. |
| `.d.ts` 包 build sees only `public-api.ts` exports. | `CbaDropdownPlacement` re-exported via barrel + `public-api.ts`; ng-packagr generates types for it. Confirmed by step 5.4. |

---

## 8. Verification of plan against original task

Cross-checked every checkbox in TODO `.agent/todos/20260730/20260730-todo-4.md` §"### 1. Implement CbaDropdown" (lines 26–59) and the Phase-6 acceptance criteria rows 1, 5, 6, 7, 8, 9 (rows 2–4 belong to Tasks 2–4, out of scope):

- "Build on ng-bootstrap dropdown" → §0.2 decision B, §2.2 template uses `ngbDropdown`/`ngbDropdownMenu`, §2.1 imports `NgbDropdownModule`.
- "Menu surface elevated bg + subtle border + radius" → §2.3.
- "Item hover/active `--cba-hover`/`--cba-active`" → §2.3.
- "Text primary/secondary calm contrast" → §2.3 `--cba-text-primary`/`--cba-text-muted`.
- "Works with `cba-button` toggle" → §4.1 test host, §2.1 JSDoc example.
- "Place under `src/components/dropdown/`" → §1 (reconciled the TODO's `src/lib/components/` wording with project convention via spec §1.7).
- "Export from `src/public-api.ts`" → §2.5.
- "Build must succeed" → §5.4.
- "JSDoc + example" → §2.1.
- "Explicit ng-bootstrap note" → §2.1 `@remarks`.
- "Minimal tests, not ng-bootstrap internals" → §4.2/§4.3.

Plan is complete and consistent with the spec and the TODO. No deviations require caller escalation.

---

**End of plan.**