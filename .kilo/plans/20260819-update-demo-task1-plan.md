# Implementation Plan — Update Demo App (Task 1)

> Target: JUNIOR developer under 75% restriction. All structural, architectural, and scope decisions are encoded below. Do NOT make architectural choices; follow each step exactly. Only minor local details (internal variable names inside a planned function, exact wording of non-critical strings already specified) may be adjusted.
>
> Source of truth for this plan:
> - TODO: `.agent/todos/20260819/20260819-todo-0.md`
> - Front-end spec: `.kilo/plans/20260819-update-demo-frontend-spec.md`
>
> Scope boundary: modify ONLY files inside `projects/demo/`. Do NOT touch `src/` (library source).

## 0. Pre-analysis & architectural decisions (already made)

### 0.1 Resolved ambiguities

| # | Ambiguity | Resolution (locked) |
|---|-----------|---------------------|
| A1 | Spec §7.10 allows "DemoTableComponent OR inline". | **Create `DemoTableComponent`** as a new component. Keeps `app.component.ts` under the 200-line file cap. |
| A2 | Spec §7.11 says "Create DemoNavItemsComponent". | **Create `DemoNavItemsComponent`** as a new component. |
| A3 | Spec §6 lists new components for pills, icons, text, table, nav. | **Create all five** new components, each in its own folder under `projects/demo/src/app/components/`. This is required to keep `AppComponent` under 200 lines. |
| A4 | Library components use signal `input()`; demo components use `@Input()` decorator. | **Keep `@Input()` decorator style** in ALL demo components (existing + new). Decorator inputs and signal inputs interop via template bindings `[x]="y"`. No mixing inside one component. |
| A5 | New demo components: inline `template` + `styles` vs separate files. | **Use inline `template` and inline `styles`** for ALL new demo components, matching the existing `DemoSectionComponent` / `DemoButtonMatrixComponent` pattern. |
| A6 | Form example host element (spec §7.13: "`<cba-card>` or 100% demo module card"). | **Use `<cba-card>`** with `cbaCardHeader` (title) and `cbaCardFooter` (action buttons) attribute slots. |
| A7 | Icon imports for `DemoIconGridComponent`. | **Import all icons inside `DemoIconGridComponent`** (not in `AppComponent`). Keeps `AppComponent` lean. |
| A8 | `NgbDateStruct` import for `FormFieldModel`. | Import from `@ng-bootstrap/ng-bootstrap` directly in `app.component.ts` (peer dependency available at repo root). |
| A9 | Pills are demo-only (spec §7.6). | Use `<span class="demo-pill ...">` elements (not a library component). Styles live in `DemoPillMatrixComponent` inline styles + `app.component.scss` for the size-variant section. |
| A10 | Caption format for matrices. | Use the exact format strings given in spec §7.5 and §7.6; do not reformat. |

### 0.2 Coding rules to enforce (from `.kilo/rules/`)

- Max 200 lines per file (excl. blanks/comments/imports; ideal ≤125).
- Max 50 lines per method body.
- Max 2 params per method (use object param if more needed).
- Max 2 nesting levels; extract deeper logic to a named method.
- Prefer `private` members; only `@Input()`s and the class itself are public.
- Self-documenting code, no commented-out code, no `console.log`.
- Single-section boolean conditions (extract compound conditions to a method).

### 0.3 Library API contracts verified (do NOT re-verify during implementation)

- `CbaButtonComponent` inputs: `variant`, `size`, `icon`, `iconOnly`, `disabled`, `loading`, `block`, `truncate`. Selector: `cba-button`.
- `CbaInputComponent` inputs: `label`, `hint`, `error`, `valid`, `readonly`, `disabled`, `placeholder`, `value`. Selector: `cba-input`. Supports `[(ngModel)]`.
- `CbaSelectComponent` inputs: `label`, `hint`, `error`, `valid`, `readonly`, `disabled`. Selector: `cba-select`. Projects `<option>` children. Supports `[(ngModel)]`.
- `CbaDatepickerComponent` inputs: `label`, `hint`, `error`, `valid`, `readonly`, `placeholder`. Selector: `cba-datepicker`. Value type `NgbDateStruct | null`. Supports `[(ngModel)]`.
- `CbaBadgeComponent` inputs: `variant` (`'primary'|'success'|'warning'|'danger'|'info'|'neutral'`), `appearance` (`'solid'|'outline'`). Selector: `cba-badge`.
- `CbaModuleFooterComponent` inputs: `status` (`ModuleHeaderStatus`), `statusText` (`string | undefined`). Selector: `cba-module-footer`.
- `ModuleContainerComponent` inputs: `size` (`'50%'|'100%'`), `padding` (`'none'|'sm'|'md'`), `isCollapsed`, `isFullscreen`. Selector: `cba-module-container`. Header slot: `[cbaModuleContainerHeader]` attribute on projected `<cba-module-header>`.
- `ModuleHeaderComponent` inputs: `title`, `size`, `isCollapsed`, `isFullscreen`, `status`. Outputs: `collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`. Selector: `cba-module-header`.
- `CbaCardComponent` slots: `[cbaCardHeader]`, `[cbaCardFooter]`. Selector: `cba-card`.
- Public types exported from `@cobranza-apps/ui`: `CbaButtonVariant`, `CbaButtonSize`, `CbaBadgeVariant`, `ModuleHeaderStatus`, `ModuleContainerSize`, `ModuleContainerPadding`.

### 0.4 Build commands (do NOT modify scripts)

- Build library first: `npm run build` (outputs `dist/`).
- Build demo: `npm run build:demo` (per context.md / README). If the script name differs, STOP and ask caller.
- Do NOT run `npm install` or add dependencies. `@ng-bootstrap/ng-bootstrap` and `@fortawesome/free-solid-svg-icons` already available at repo root.

---

## 1. Git branch handling

> Per Critical Workflow step 2, the branch `feat/update-demo-app` should already be created by the implementer in step 2. This plan assumes the implementer is on that branch. If not on a feature branch, STOP and ask caller.

**Verification step (no command — just check `git status` is clean before starting code edits):**

1. Run: `git status`
   - Expected: clean working tree, on branch `feat/update-demo-app` (or the branch assigned by the planner). If dirty or on `main`, STOP and ask caller.

---

## 2. Update `projects/demo/src/index.html`

**File:** `projects/demo/src/index.html`

**Operation:** single line edit.

**Step 2.1** — Change the `<html>` lang attribute from `es` to `en`.

- Find: `<html lang="es">`
- Replace with: `<html lang="en">`

No other changes to this file.

**Commit point (after step 2.1):**
```
chore(demo): switch demo index.html lang to en
```

---

## 3. Update `DemoSwatchComponent` (existing)

**Files:**
- `projects/demo/src/app/components/demo-swatch/demo-swatch.component.ts`
- `projects/demo/src/app/components/demo-swatch/demo-swatch.component.scss`

### 3.1 `demo-swatch.component.ts` — full rewrite

Replace the entire file content with exactly:

```ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Demo-only swatch card that displays one theme color token: swatch fill,
 * token name, category tag, and hex value. Reads the color at runtime via
 * CSS variables (no duplicated hex tables).
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-swatch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-swatch" [style.background]="background" [style.color]="color">
      <span class="demo-swatch__name">{{ label }}</span>
      <span class="demo-swatch__tag">{{ tag }}</span>
      <span class="demo-swatch__hex">{{ hex }}</span>
    </div>
  `,
  styleUrl: './demo-swatch.component.scss',
})
export class DemoSwatchComponent {
  @Input() label = '';
  @Input() background = '';
  @Input() color?: string;
  @Input() tag = '';
  @Input() hex = '';
}
```

### 3.2 `demo-swatch.component.scss` — full rewrite

Replace the entire file content with exactly:

```scss
$swatch-min-height: 72px;

:host {
  display: block;
}

.demo-swatch {
  min-height: $swatch-min-height;
  border-radius: var(--cba-radius-sm);
  border: 1px solid var(--cba-border-default);
  padding: var(--cba-space-2);
  font-size: var(--cba-font-size-small);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-1);
}

.demo-swatch__name {
  font-weight: 600;
}

.demo-swatch__tag {
  font-size: var(--cba-font-size-caption);
  opacity: 0.85;
}

.demo-swatch__hex {
  font-size: var(--cba-font-size-caption);
  font-variant-numeric: tabular-nums;
}
```

**Commit point (after step 3):**
```
feat(demo): extend DemoSwatch with tag and hex inputs
```

---

## 4. Update `DemoModuleCardComponent` (existing)

**File:** `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

### 4.1 Full rewrite

Replace the entire file content with exactly:

```ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  CbaModuleFooterComponent,
  ModuleContainerComponent,
  ModuleContainerPadding,
  ModuleContainerSize,
  ModuleHeaderComponent,
  ModuleHeaderStatus,
} from '@cobranza-apps/ui';

/**
 * Demo-only wrapper combining a `cba-module-container` with its
 * `cba-module-header`, projecting extra body content (table, actions, …).
 * Optionally renders a `cba-module-footer` OUTSIDE the container so the
 * footer stays visible even when the module body is collapsed.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 *
 * Emits no-op handlers for the header outputs so the demo stays interactive
 * without side effects.
 */
@Component({
  selector: 'demo-module-card',
  standalone: true,
  imports: [ModuleContainerComponent, ModuleHeaderComponent, CbaModuleFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-module-card" [class.demo-module-card--size-50]="size === '50%'">
      <cba-module-container [size]="size" [padding]="padding" [isCollapsed]="isCollapsed">
        <cba-module-header
          cbaModuleContainerHeader
          [title]="title"
          [size]="size"
          [isCollapsed]="isCollapsed"
          [isFullscreen]="false"
          [status]="status"
          (collapseToggle)="noop()"
          (sizeToggle)="noop()"
          (fullscreenToggle)="noop()"
          (remove)="noop()"
        />
        <ng-content />
      </cba-module-container>
      @if (hasFooter) {
        <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-module-card--size-50 {
      flex: 0 0 calc(50% - var(--cba-space-3) / 2);
    }
  `,
})
export class DemoModuleCardComponent {
  @Input() title = '';
  @Input() size: ModuleContainerSize = '100%';
  @Input() padding: ModuleContainerPadding = 'md';
  @Input() status: ModuleHeaderStatus = 'loaded';
  @Input() isCollapsed = false;
  @Input() footerStatus: ModuleHeaderStatus | null = null;
  @Input() footerText = '';

  private get hasFooter(): boolean {
    return this.footerStatus !== null || this.footerText.length > 0;
  }

  protected noop(): void {}
}
```

**Notes for the implementer:**
- The `hasFooter` getter is a single-section boolean condition (rule compliant).
- The wrapper `div.demo-module-card` + `--size-50` modifier enables the 50% row layout; the modifier class is also referenced by `.workspace__row--single-50` in `app.component.scss` (see step 9.3).
- Do NOT change the `@Input()` set; the spec in §7.3 lists exactly these inputs.

**Commit point (after step 4):**
```
feat(demo): render module footer outside container in DemoModuleCard
```

---

## 5. Update `DemoButtonMatrixComponent` (existing)

**File:** `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`

### 5.1 Full rewrite

Replace the entire file content with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  CbaButtonComponent,
  CbaButtonVariant,
} from '@cobranza-apps/ui';

/** One button rendered inside the variant × state matrix. */
interface ButtonMatrixCell {
  readonly variant: CbaButtonVariant;
  readonly state: 'normal' | 'disabled' | 'loading';
}

/** One state row inside a surface block. */
interface ButtonMatrixRow {
  readonly state: 'normal' | 'disabled' | 'loading';
  readonly cells: ButtonMatrixCell[];
}

/** One surface block holding three state rows. */
interface ButtonMatrixBlock {
  readonly surfaceTitle: string;
  readonly surfaceClass: string;
  readonly rows: ButtonMatrixRow[];
}

/** The five standard variants reused on every state row. */
const VARIANTS: readonly CbaButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'success'];

/** State names reused for every surface block. */
const STATES: readonly ('normal' | 'disabled' | 'loading')[] = ['normal', 'disabled', 'loading'];

/** Builds a single state row containing all five variants in that state. */
function buildRow(state: 'normal' | 'disabled' | 'loading'): ButtonMatrixRow {
  const cells: ButtonMatrixCell[] = VARIANTS.map((variant) => ({ variant, state }));
  return { state, cells };
}

/** Builds the three-row matrix for one surface block. */
function buildBlock(surfaceTitle: string, surfaceClass: string): ButtonMatrixBlock {
  const rows: ButtonMatrixRow[] = STATES.map((state) => buildRow(state));
  return { surfaceTitle, surfaceClass, rows };
}

/**
 * Demo-only button matrix: five variants × three surfaces × three states
 * (normal / disabled / loading), with a caption under each button.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-button-matrix',
  standalone: true,
  imports: [CbaButtonComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-matrix">
      @for (block of blocks; track block.surfaceTitle) {
        <div [class]="'demo-surface ' + block.surfaceClass">
          <h3>{{ block.surfaceTitle }}</h3>
          @for (row of block.rows; track row.state) {
            <div class="demo-matrix-row">
              <span class="demo-matrix-row__status">{{ row.state }}</span>
              @for (cell of row.cells; track cell.variant) {
                <div class="demo-matrix-cell">
                  <cba-button
                    [variant]="cell.variant"
                    [disabled]="cell.state === 'disabled'"
                    [loading]="cell.state === 'loading'">
                    {{ cell.variant | titlecase }}
                  </cba-button>
                  <span class="demo-matrix-cell__caption">
                    {{ cell.variant }} · .cba-button--{{ cell.variant }} · {{ row.state }} · {{ block.surfaceTitle }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-matrix {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-3);
    }
    .demo-surface {
      padding: var(--cba-space-3);
      border-radius: var(--cba-radius-md);
    }
    .demo-surface--secondary {
      background: var(--cba-bg-secondary);
    }
    .demo-surface--elevated {
      background: var(--cba-bg-elevated);
    }
    .demo-surface--primary {
      background: var(--cba-bg-primary);
    }
    .demo-matrix-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--cba-space-3);
      margin-top: var(--cba-space-2);
    }
    .demo-matrix-row__status {
      width: 80px;
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
      text-transform: capitalize;
    }
    .demo-matrix-cell {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-1);
      align-items: flex-start;
    }
    .demo-matrix-cell__caption {
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
    }
  `,
})
export class DemoButtonMatrixComponent {
  protected readonly blocks: ButtonMatrixBlock[] = [
    buildBlock('bg-secondary', 'demo-surface--secondary'),
    buildBlock('bg-elevated', 'demo-surface--elevated'),
    buildBlock('bg-primary', 'demo-surface--primary'),
  ];
}
```

**Notes:**
- `VARIANTS.map` / `STATES.map` keep the file concise and the matrix complete (5 × 3 × 3 = 45 buttons). Do NOT hand-enumerate cells.
- The caption format exactly matches spec §7.5: `{variant} · .cba-button--{variant} · {state} · {surfaceTitle}`.

**Commit point (after step 5):**
```
feat(demo): rebuild button matrix as variants x surfaces x states
```

---

## 6. Create `DemoPillMatrixComponent` (new)

**File:** `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts`

### 6.1 Create the file with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

/** One demo pill rendered inside the variant × state matrix. */
interface PillCell {
  readonly name: string;
  readonly modifier: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
}

/** One state row inside a surface block. */
interface PillMatrixRow {
  readonly state: 'normal' | 'disabled' | 'selected';
  readonly pills: PillCell[];
}

/** One surface block holding three state rows. */
interface PillMatrixBlock {
  readonly surfaceTitle: string;
  readonly surfaceClass: string;
  readonly rows: PillMatrixRow[];
}

/** The five demo pill variants reused on every state row. */
const PILL_VARIANTS: readonly PillCell[] = [
  { name: 'Primary', modifier: 'primary' },
  { name: 'Secondary', modifier: 'secondary' },
  { name: 'Ghost', modifier: 'ghost' },
  { name: 'Danger', modifier: 'danger' },
  { name: 'Success', modifier: 'success' },
];

/** State names reused for every surface block. */
const PILL_STATES: readonly ('normal' | 'disabled' | 'selected')[] = ['normal', 'disabled', 'selected'];

/** Builds a state row reusing the five demo pill variants. */
function buildPillRow(state: 'normal' | 'disabled' | 'selected'): PillMatrixRow {
  return { state, pills: PILL_VARIANTS };
}

/** Builds the three-row matrix for one surface block. */
function buildPillBlock(surfaceTitle: string, surfaceClass: string): PillMatrixBlock {
  const rows: PillMatrixRow[] = PILL_STATES.map((state) => buildPillRow(state));
  return { surfaceTitle, surfaceClass, rows };
}

/** Returns the CSS modifier class for a pill in a given state. Pure helper. */
function pillClass(cell: PillCell, state: 'normal' | 'disabled' | 'selected'): string {
  const base = `demo-pill demo-pill--${cell.modifier}`;
  return state === 'normal' ? base : `${base} demo-pill--${state}`;
}

/**
 * Demo-only pill matrix: five pill variants × three surfaces × three states
 * (normal / disabled / selected), with a caption under each pill. Pills are
 * demo-only `<span>` elements styled with theme tokens — there is no library
 * pill component.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-pill-matrix',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-matrix">
      @for (block of blocks; track block.surfaceTitle) {
        <div [class]="'demo-surface ' + block.surfaceClass">
          <h3>{{ block.surfaceTitle }}</h3>
          @for (row of block.rows; track row.state) {
            <div class="demo-matrix-row">
              <span class="demo-matrix-row__status">{{ row.state }}</span>
              @for (cell of row.pills; track cell.name) {
                <div class="demo-matrix-cell">
                  <span [class]="pillClassFn(cell, row.state)">{{ cell.name }}</span>
                  <span class="demo-matrix-cell__caption">
                    {{ cell.name }} · .demo-pill--{{ cell.modifier }} · {{ row.state }} · {{ block.surfaceTitle }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-matrix {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-3);
    }
    .demo-surface {
      padding: var(--cba-space-3);
      border-radius: var(--cba-radius-md);
    }
    .demo-surface--secondary {
      background: var(--cba-bg-secondary);
    }
    .demo-surface--elevated {
      background: var(--cba-bg-elevated);
    }
    .demo-surface--primary {
      background: var(--cba-bg-primary);
    }
    .demo-matrix-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--cba-space-3);
      margin-top: var(--cba-space-2);
    }
    .demo-matrix-row__status {
      width: 80px;
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
      text-transform: capitalize;
    }
    .demo-matrix-cell {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-1);
      align-items: flex-start;
    }
    .demo-matrix-cell__caption {
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
    }
    .demo-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--cba-space-1);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: var(--cba-font-size-small);
      border: 1px solid transparent;
    }
    .demo-pill--primary {
      background: var(--cba-accent-primary);
      color: var(--cba-text-inverse);
    }
    .demo-pill--secondary {
      background: var(--cba-bg-elevated);
      color: var(--cba-text-primary);
      border-color: var(--cba-border-subtle);
    }
    .demo-pill--ghost {
      background: transparent;
      color: var(--cba-text-primary);
      border-color: var(--cba-border-default);
    }
    .demo-pill--danger {
      background: var(--cba-accent-danger);
      color: var(--cba-text-inverse);
    }
    .demo-pill--success {
      background: var(--cba-accent-success);
      color: var(--cba-text-inverse);
    }
    .demo-pill--selected {
      background: var(--cba-selected-bg);
      color: var(--cba-selected-text);
      border-color: var(--cba-selected-border);
    }
    .demo-pill--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class DemoPillMatrixComponent {
  protected readonly blocks: PillMatrixBlock[] = [
    buildPillBlock('bg-secondary', 'demo-surface--secondary'),
    buildPillBlock('bg-elevated', 'demo-surface--elevated'),
    buildPillBlock('bg-primary', 'demo-surface--primary'),
  ];

  protected pillClassFn(cell: PillCell, state: 'normal' | 'disabled' | 'selected'): string {
    return pillClass(cell, state);
  }
}
```

**Notes for the implementer:**
- There is exactly ONE helper function named `pillClass` (declared at module top, after `buildPillBlock`). The class method `pillClassFn` delegates to it so the template can bind `[class]` to a component method (templates cannot call free functions directly).
- Do NOT add a second helper. Do NOT rename `pillClass` or `pillClassFn`.

**Commit point (after step 6):**
```
feat(demo): add DemoPillMatrix component
```

---

## 7. Create `DemoIconGridComponent` (new)

**File:** `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`

### 7.1 Create the file with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBell,
  faCalendar,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faDownload,
  faInbox,
  faPen,
  faPlus,
  faRefresh,
  faSearch,
  faTrash,
  faTriangleExclamation,
  faUser,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent } from '@cobranza-apps/ui';

/** One predefined icon entry shown in the grid. */
interface IconEntry {
  readonly icon: unknown;
  readonly label: string;
  readonly ariaLabel: string;
}

/**
 * Demo-only grid of predefined Font Awesome icons rendered as icon-only
 * ghost `<cba-button>` elements, each with an English `aria-label` and a
 * text label below.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-icon-grid',
  standalone: true,
  imports: [CbaButtonComponent, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-icon-grid">
      @for (entry of icons; track entry.label) {
        <div class="demo-icon-cell">
          <cba-button
            variant="ghost"
            [iconOnly]="true"
            [icon]="entry.icon"
            [attr.aria-label]="entry.ariaLabel" />
          <span class="demo-icon-cell__label">{{ entry.label }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: var(--cba-space-3);
    }
    .demo-icon-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--cba-space-1);
      padding: var(--cba-space-2);
      border: 1px solid var(--cba-border-subtle);
      border-radius: var(--cba-radius-sm);
      background: var(--cba-bg-elevated);
    }
    .demo-icon-cell__label {
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
    }
  `,
})
export class DemoIconGridComponent {
  protected readonly icons: IconEntry[] = [
    { icon: faBell, label: 'Notifications', ariaLabel: 'Notifications' },
    { icon: faUser, label: 'Profile', ariaLabel: 'Profile' },
    { icon: faGear, label: 'Settings', ariaLabel: 'Settings' },
    { icon: faPlus, label: 'Add', ariaLabel: 'Add' },
    { icon: faRefresh, label: 'Refresh', ariaLabel: 'Refresh' },
    { icon: faDownload, label: 'Download', ariaLabel: 'Download' },
    { icon: faSearch, label: 'Search', ariaLabel: 'Search' },
    { icon: faCalendar, label: 'Calendar', ariaLabel: 'Calendar' },
    { icon: faPen, label: 'Edit', ariaLabel: 'Edit' },
    { icon: faTrash, label: 'Delete', ariaLabel: 'Delete' },
    { icon: faCheck, label: 'Check', ariaLabel: 'Check' },
    { icon: faCircleCheck, label: 'Success', ariaLabel: 'Success' },
    { icon: faTriangleExclamation, label: 'Warning', ariaLabel: 'Warning' },
    { icon: faCircleXmark, label: 'Error', ariaLabel: 'Error' },
    { icon: faInbox, label: 'Empty state', ariaLabel: 'Empty state' },
  ];
}
```

**Commit point (after step 7):**
```
feat(demo): add DemoIconGrid component
```

---

## 8. Create `DemoTextShowcaseComponent` (new)

**File:** `projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.ts`

### 8.1 Create the file with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

/** One typography-scale sample line. */
interface TypeSample {
  readonly className: string;
  readonly label: string;
}

/** One text-color swatch line inside a surface panel. */
interface TextColorItem {
  readonly className: string;
  readonly label: string;
}

/** One surface panel showing the type scale + allowed text colors. */
interface TextShowcasePanel {
  readonly title: string;
  readonly className: string;
  readonly textColors: TextColorItem[];
  readonly showStatusColors: boolean;
}

/** Type scale reused on every surface panel. */
const TYPE_SCALE: readonly TypeSample[] = [
  { className: 'cba-text-display', label: 'Display · cba-text-display' },
  { className: 'cba-text-heading-lg', label: 'Heading lg · cba-text-heading-lg' },
  { className: 'cba-text-heading-md', label: 'Heading md · cba-text-heading-md' },
  { className: 'cba-text-body', label: 'Body · cba-text-body' },
  { className: 'cba-text-small', label: 'Small · cba-text-small' },
  { className: 'cba-text-caption', label: 'Caption · cba-text-caption' },
];

/** Status text colors shown only on light surfaces. */
const STATUS_COLORS: readonly TextColorItem[] = [
  { className: 'cba-state-valid-text', label: 'Valid · cba-state-valid-text' },
  { className: 'cba-state-invalid-text', label: 'Invalid · cba-state-invalid-text' },
];

/**
 * Demo-only typography + text-color showcase. Renders one panel per surface
 * (bg-secondary, bg-elevated, bg-primary, bg-tertiary) with the six-step type
 * scale and the text color variants allowed on that surface. Status text
 * colors appear only on light surfaces (bg-secondary / bg-elevated).
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-text-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-text-panels">
      @for (panel of panels; track panel.className) {
        <div [class]="'demo-text-panel ' + panel.className">
          <h3>{{ panel.title }}</h3>
          <div class="demo-text-scale">
            @for (sample of typeScale; track sample.label) {
              <p [class]="sample.className">{{ sample.label }}</p>
            }
          </div>
          <div class="demo-text-colors">
            @for (color of panel.textColors; track color.label) {
              <span [class]="color.className">{{ color.label }}</span>
            }
            @if (panel.showStatusColors) {
              @for (color of statusColors; track color.label) {
                <span [class]="color.className">{{ color.label }}</span>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-text-panels {
      display: grid;
      gap: var(--cba-space-3);
    }
    .demo-text-panel {
      padding: var(--cba-space-3);
      border-radius: var(--cba-radius-md);
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-2);
    }
    .demo-text-panel--secondary {
      background: var(--cba-bg-secondary);
    }
    .demo-text-panel--elevated {
      background: var(--cba-bg-elevated);
    }
    .demo-text-panel--primary {
      background: var(--cba-bg-primary);
    }
    .demo-text-panel--tertiary {
      background: var(--cba-bg-tertiary);
    }
    .demo-text-scale {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-1);
      margin: 0;
    }
    .demo-text-scale p {
      margin: 0;
    }
    .demo-text-colors {
      display: flex;
      flex-wrap: wrap;
      gap: var(--cba-space-2);
    }
  `,
})
export class DemoTextShowcaseComponent {
  protected readonly typeScale: TypeSample[] = [...TYPE_SCALE];
  protected readonly statusColors: TextColorItem[] = [...STATUS_COLORS];
  protected readonly panels: TextShowcasePanel[] = [
    {
      title: 'bg-secondary',
      className: 'demo-text-panel--secondary',
      showStatusColors: true,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-muted', label: 'Muted' },
      ],
    },
    {
      title: 'bg-elevated',
      className: 'demo-text-panel--elevated',
      showStatusColors: true,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-muted', label: 'Muted' },
      ],
    },
    {
      title: 'bg-primary',
      className: 'demo-text-panel--primary',
      showStatusColors: false,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-inverse', label: 'Inverse' },
      ],
    },
    {
      title: 'bg-tertiary',
      className: 'demo-text-panel--tertiary',
      showStatusColors: false,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-inverse', label: 'Inverse' },
      ],
    },
  ];
}
```

**Notes:**
- The `--cba-state-valid-text` / `--cba-state-invalid-text` utility classes are emitted by the library theme (see `src/theme/_variables.scss`); the demo simply applies them. Do NOT redefine the colors in the demo.
- Muted text is intentionally omitted from the `bg-primary` and `bg-tertiary` panels per the WCAG restriction in `brief.md` §5.

**Commit point (after step 8):**
```
feat(demo): add DemoTextShowcase component
```

---

## 9. Create `DemoTableComponent` (new)

**File:** `projects/demo/src/app/components/demo-table/demo-table.component.ts`

### 9.1 Create the file with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CbaBadgeComponent } from '@cobranza-apps/ui';

/** One row in the demo table. */
export interface TableRow {
  readonly id: string;
  readonly document: string;
  readonly name: string;
  readonly debt: string;
  readonly status: 'overdue' | 'current' | 'settled';
  readonly selected: boolean;
}

/**
 * Demo-only complete table example with header, body, a selected row, and
 * status badges rendered via the library `CbaBadgeComponent`.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-table',
  standalone: true,
  imports: [CbaBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="demo-table">
      <thead>
        <tr>
          <th scope="col">Document</th>
          <th scope="col">Name</th>
          <th scope="col">Debt</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows; track row.id) {
          <tr [class.demo-row--selected]="row.selected">
            <td>{{ row.document }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.debt }}</td>
            <td>
              @switch (row.status) {
                @case ('overdue') {
                  <cba-badge variant="warning" appearance="solid">Overdue</cba-badge>
                }
                @case ('current') {
                  <cba-badge variant="success" appearance="solid">Current</cba-badge>
                }
                @case ('settled') {
                  <cba-badge variant="neutral" appearance="outline">Settled</cba-badge>
                }
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--cba-bg-elevated);
    }
    .demo-table th,
    .demo-table td {
      padding: var(--cba-space-2) var(--cba-space-3);
      border-bottom: 1px solid var(--cba-border-subtle);
      text-align: left;
      font-size: var(--cba-font-size-small);
    }
    .demo-table th {
      font-weight: 600;
      color: var(--cba-text-secondary);
    }
    .demo-row--selected {
      background: var(--cba-selected-bg);
      color: var(--cba-selected-text);
    }
  `,
})
export class DemoTableComponent {
  protected readonly rows: TableRow[] = [
    { id: '20-12345678-9', document: '20-12345678-9', name: 'Comercial del Sur S.A.', debt: '$ 1,250,000', status: 'overdue', selected: true },
    { id: '27-99887766-5', document: '27-99887766-5', name: 'Distribuidora Norte', debt: '$ 480,000', status: 'current', selected: false },
    { id: '30-55443322-1', document: '30-55443322-1', name: 'Tecnología Andina', debt: '$ 0', status: 'settled', selected: false },
  ];
}
```

**Commit point (after step 9):**
```
feat(demo): add DemoTable component
```

---

## 10. Create `DemoNavItemsComponent` (new)

**File:** `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts`

### 10.1 Create the file with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

/** One navigation item shown in the demo nav row. */
interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

/**
 * Demo-only horizontal navigation items example showing normal, selected,
 * hover, and disabled states. Renders plain `<a>` elements styled with theme
 * tokens — there is no library nav-item component.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-nav-items',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="demo-nav" aria-label="Demo navigation">
      @for (item of items; track item.label) {
        <a
          class="demo-nav-item"
          [class.demo-nav-item--selected]="item.selected"
          [class.demo-nav-item--disabled]="item.disabled"
          [attr.aria-current]="item.selected ? 'page' : null"
          [attr.aria-disabled]="item.disabled ? 'true' : null"
          href="#">
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-nav {
      display: flex;
      gap: var(--cba-space-2);
      flex-wrap: wrap;
    }
    .demo-nav-item {
      padding: var(--cba-space-1) var(--cba-space-3);
      border-radius: var(--cba-radius-sm);
      border: 1px solid var(--cba-border-strong);
      color: var(--cba-text-secondary);
      background: var(--cba-bg-secondary);
      text-decoration: none;
      font-size: var(--cba-font-size-small);
    }
    .demo-nav-item:hover {
      background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
      color: var(--cba-text-primary);
    }
    .demo-nav-item--selected {
      background: var(--cba-selected-bg);
      border-color: var(--cba-selected-border);
      color: var(--cba-selected-text);
      font-weight: 600;
    }
    .demo-nav-item--selected:hover {
      background-image: none;
    }
    .demo-nav-item--disabled {
      background: var(--cba-state-disabled-bg);
      border-color: var(--cba-border-subtle);
      color: var(--cba-state-disabled-text);
      cursor: not-allowed;
    }
    .demo-nav-item--disabled:hover {
      background-image: none;
    }
  `,
})
export class DemoNavItemsComponent {
  protected readonly items: NavItem[] = [
    { label: 'Customers', selected: true, disabled: false },
    { label: 'Invoices', selected: false, disabled: false },
    { label: 'Reports', selected: false, disabled: false },
    { label: 'Settings', selected: false, disabled: true },
  ];
}
```

**Commit point (after step 10):**
```
feat(demo): add DemoNavItems component
```

---

## 11. Rewrite `projects/demo/src/app/app.component.ts`

**File:** `projects/demo/src/app/app.component.ts`

### 11.1 Full rewrite

Replace the entire file content with exactly:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  faBell,
  faDownload,
  faPlus,
  faRefresh,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  CbaBadgeComponent,
  CbaButtonComponent,
  CbaCardComponent,
  CbaDatepickerComponent,
  CbaInputComponent,
  CbaModuleFooterComponent,
  CbaSelectComponent,
} from '@cobranza-apps/ui';
import { DemoButtonMatrixComponent } from './components/demo-button-matrix/demo-button-matrix.component';
import { DemoIconGridComponent } from './components/demo-icon-grid/demo-icon-grid.component';
import { DemoModuleCardComponent } from './components/demo-module-card/demo-module-card.component';
import { DemoNavItemsComponent } from './components/demo-nav-items/demo-nav-items.component';
import { DemoPillMatrixComponent } from './components/demo-pill-matrix/demo-pill-matrix.component';
import { DemoSectionComponent } from './components/demo-section/demo-section.component';
import { DemoSwatchComponent } from './components/demo-swatch/demo-swatch.component';
import { DemoTableComponent } from './components/demo-table/demo-table.component';
import { DemoTextShowcaseComponent } from './components/demo-text-showcase/demo-text-showcase.component';

/** One color token shown in the token grid. */
interface ColorToken {
  readonly name: string;
  readonly tag: string;
  readonly hex: string;
  readonly variable: string;
}

/** One form-control surface card in the inputs section. */
interface InputSurface {
  readonly title: string;
  readonly className: string;
}

/** Model for the form example (two-way bound via ngModel). */
interface FormFieldModel {
  readonly customerName: string;
  readonly email: string;
  readonly status: string;
  readonly dueDate: NgbDateStruct | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CbaBadgeComponent,
    CbaButtonComponent,
    CbaCardComponent,
    CbaDatepickerComponent,
    CbaInputComponent,
    CbaModuleFooterComponent,
    CbaSelectComponent,
    DemoButtonMatrixComponent,
    DemoIconGridComponent,
    DemoModuleCardComponent,
    DemoNavItemsComponent,
    DemoPillMatrixComponent,
    DemoSectionComponent,
    DemoSwatchComponent,
    DemoTableComponent,
    DemoTextShowcaseComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly pageTitle = 'Demo app — consumes @cobranza-apps/ui build';

  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
  protected readonly faPlus = faPlus;
  protected readonly faRefresh = faRefresh;
  protected readonly faDownload = faDownload;

  protected sampleText = '';
  protected sampleSelect = '';
  protected readonly formModel: FormFieldModel = {
    customerName: '',
    email: '',
    status: '',
    dueDate: null,
  };

  protected readonly colorTokens: ColorToken[] = [
    { name: 'bg-primary', tag: 'Background', hex: '#BCB5A4', variable: 'var(--cba-bg-primary)' },
    { name: 'bg-secondary', tag: 'Background', hex: '#F2F0E8', variable: 'var(--cba-bg-secondary)' },
    { name: 'bg-tertiary', tag: 'Background', hex: '#D8C3A5', variable: 'var(--cba-bg-tertiary)' },
    { name: 'bg-elevated', tag: 'Background', hex: '#FDFCF8', variable: 'var(--cba-bg-elevated)' },
    { name: 'text-primary', tag: 'Text', hex: '#2B2620', variable: 'var(--cba-text-primary)' },
    { name: 'text-secondary', tag: 'Text', hex: '#4A4640', variable: 'var(--cba-text-secondary)' },
    { name: 'text-muted', tag: 'Text', hex: '#625C55', variable: 'var(--cba-text-muted)' },
    { name: 'text-inverse', tag: 'Text', hex: '#FDFCF8', variable: 'var(--cba-text-inverse)' },
    { name: 'border-subtle', tag: 'Border', hex: '#E8E5DB', variable: 'var(--cba-border-subtle)' },
    { name: 'border-default', tag: 'Border', hex: '#A29D94', variable: 'var(--cba-border-default)' },
    { name: 'border-strong', tag: 'Border', hex: '#6B665E', variable: 'var(--cba-border-strong)' },
    { name: 'accent-primary', tag: 'Accent', hex: '#6B5B4F', variable: 'var(--cba-accent-primary)' },
    { name: 'accent-success', tag: 'Accent', hex: '#3E6B4F', variable: 'var(--cba-accent-success)' },
    { name: 'accent-warning', tag: 'Accent', hex: '#E98074', variable: 'var(--cba-accent-warning)' },
    { name: 'accent-danger', tag: 'Accent', hex: '#B93E36', variable: 'var(--cba-accent-danger)' },
    { name: 'accent-info', tag: 'Accent', hex: '#56717E', variable: 'var(--cba-accent-info)' },
    { name: 'selected-bg', tag: 'Selected', hex: '#E4DDD0', variable: 'var(--cba-selected-bg)' },
    { name: 'selected-text', tag: 'Selected', hex: '#2B2620', variable: 'var(--cba-selected-text)' },
    { name: 'state-valid-border', tag: 'Form state', hex: '#3E6B4F', variable: 'var(--cba-state-valid-border)' },
    { name: 'state-invalid-border', tag: 'Form state', hex: '#B93E36', variable: 'var(--cba-state-invalid-border)' },
  ];

  protected readonly inputSurfaces: InputSurface[] = [
    { title: 'bg-secondary', className: 'demo-surface--secondary' },
    { title: 'bg-elevated', className: 'demo-surface--elevated' },
    { title: 'bg-primary', className: 'demo-surface--primary' },
    { title: 'bg-tertiary', className: 'demo-surface--tertiary' },
  ];

  /** Text color must invert when the swatch fill is a dark text token. */
  protected swatchColor(token: ColorToken): string | undefined {
    const isTextTag = token.tag === 'Text';
    const isInverse = token.name === 'text-inverse';
    return isTextTag && !isInverse ? 'var(--cba-bg-elevated)' : undefined;
  }

  protected noop(): void {}
}
```

**Notes:**
- `FormFieldModel` is declared with `readonly` fields but the instance is bound via `[(ngModel)]` to mutable property paths (`formModel.customerName`, etc.). Because `readonly` applies to the property *type* (not runtime mutability for nested fields via `ngModel`), this compiles. If the TypeScript compiler reports an error on `[(ngModel)]="formModel.customerName"` due to `readonly`, remove the `readonly` modifier from the four fields of `FormFieldModel` only. Do NOT change any other interface. (This is the only permitted adjustment.)
- The `swatchColor` method keeps the template's boolean condition single-section (rule compliant).
- File line count is ~140 lines (under 200).

**Commit point (after step 11):**
```
feat(demo): rebuild AppComponent data model and imports
```

---

## 12. Rewrite `projects/demo/src/app/app.component.html`

**File:** `projects/demo/src/app/app.component.html`

### 12.1 Full rewrite

Replace the entire file content with exactly:

```html
<div class="demo-app">

  <!-- 1. Preview bar -->
  <div class="preview-bar">
    <strong>{{ pageTitle }}</strong>
    <span>Minimal Yet Warm · single theme · desktop demo</span>
  </div>

  <!-- 2. Header bar -->
  <header class="shell-header">
    <div class="shell-header__left">
      <cba-button variant="primary" size="sm">Back</cba-button>
      <span class="shell-header__brand">Cobranza - Back Office</span>
    </div>
    <div class="shell-header__center">
      <cba-input class="shell-header__search" placeholder="Search customer, invoice, debt…" aria-label="Search" />
    </div>
    <div class="shell-header__right">
      <cba-button variant="ghost" [iconOnly]="true" [icon]="faBell" aria-label="Notifications" />
      <cba-button variant="ghost" [iconOnly]="true" [icon]="faUser" aria-label="Profile" />
    </div>
  </header>

  <!-- 3. Workspace section: module examples -->
  <main class="workspace">

    <!-- Row 1: expanded 100% with header + footer -->
    <demo-module-card
      title="Customer portfolio"
      size="100%"
      padding="md"
      status="loaded"
      footerStatus="loaded"
      footerText="3 customers · total debt $ 1,730,000">
      <demo-table />
    </demo-module-card>

    <!-- Row 2: collapsed 100%, header only (no footer) -->
    <demo-module-card
      title="Quick actions"
      size="100%"
      padding="md"
      status="warning"
      [isCollapsed]="true" />

    <!-- Row 3: two expanded 50% with header + footer -->
    <div class="workspace__row">
      <demo-module-card
        title="New customer"
        size="50%"
        padding="sm"
        status="success"
        footerStatus="success"
        footerText="Saved">
        <div class="demo-actions">
          <cba-button variant="primary" [icon]="faPlus">Add customer</cba-button>
          <cba-button variant="secondary" [icon]="faRefresh">Sync</cba-button>
        </div>
      </demo-module-card>

      <demo-module-card
        title="Export data"
        size="50%"
        padding="sm"
        status="loaded"
        footerStatus="loaded"
        footerText="Ready">
        <div class="demo-actions">
          <cba-button variant="ghost" [icon]="faDownload">Export CSV</cba-button>
        </div>
      </demo-module-card>
    </div>

    <!-- Row 4: two collapsed 50% with header + footer -->
    <div class="workspace__row">
      <demo-module-card
        title="Invoices"
        size="50%"
        padding="md"
        status="dirty"
        [isCollapsed]="true"
        footerStatus="dirty"
        footerText="Unsaved changes" />

      <demo-module-card
        title="Reports"
        size="50%"
        padding="md"
        status="error"
        [isCollapsed]="true"
        footerStatus="error"
        footerText="Load failed" />
    </div>

    <!-- Row 5: one expanded 50% with empty space at the right -->
    <div class="workspace__row workspace__row--single-50">
      <demo-module-card
        title="Payment schedule"
        size="50%"
        padding="sm"
        status="loaded"
        footerStatus="loaded"
        footerText="Up to date">
        <p class="cba-text-body">Next payment: 2026-09-15</p>
      </demo-module-card>
    </div>

    <!-- Row 6: one collapsed 50% with empty space at the right -->
    <div class="workspace__row workspace__row--single-50">
      <demo-module-card
        title="Settings"
        size="50%"
        padding="md"
        status="dirty"
        [isCollapsed]="true"
        footerStatus="dirty"
        footerText="Pending changes" />
    </div>
  </main>

  <!-- 4. Token colors grid -->
  <demo-section
    title="Color tokens"
    caption="Runtime values from var(--cba-*). Hex values must stay in sync with src/theme/_variables.scss.">
    <div class="demo-swatch-grid">
      @for (token of colorTokens; track token.name) {
        <demo-swatch
          [label]="token.name"
          [tag]="token.tag"
          [hex]="token.hex"
          [background]="token.variable"
          [color]="swatchColor(token)" />
      }
    </div>
  </demo-section>

  <!-- 5. Button section -->
  <demo-section
    title="Buttons"
    caption="Variants × surfaces × normal / disabled / loading. Caption: name · class · state · surface.">
    <demo-button-matrix />
  </demo-section>

  <!-- 6. Pills section -->
  <demo-section
    title="Pills"
    caption="Demo-only pills (no library component). Variants × surfaces × normal / disabled / selected.">
    <demo-pill-matrix />
  </demo-section>

  <!-- 7. Button / pill sizes variants -->
  <demo-section title="Button and pill sizes" caption="sm vs md size variants.">
    <div class="demo-size-row">
      <cba-button variant="primary" size="sm">Small button</cba-button>
      <cba-button variant="primary" size="md">Medium button</cba-button>
      <span class="demo-pill demo-pill--primary demo-pill--sm">Small pill</span>
      <span class="demo-pill demo-pill--primary demo-pill--md">Medium pill</span>
    </div>
  </demo-section>

  <!-- 8. Predefined icons -->
  <demo-section title="Predefined icons" caption="Icon-only ghost buttons with English aria-labels.">
    <demo-icon-grid />
  </demo-section>

  <!-- 9. Texts, fonts, labels variants -->
  <demo-section
    title="Texts, fonts, labels"
    caption="Typography scale and text color variants per surface. Muted is restricted on canvas and inset.">
    <demo-text-showcase />
  </demo-section>

  <!-- 10. Complete table example -->
  <demo-section title="Complete table" caption="Header, body, selected row, and status badges.">
    <demo-table />
  </demo-section>

  <!-- 11. Navigation items example -->
  <demo-section title="Navigation items" caption="Normal, selected, hover, and disabled states.">
    <demo-nav-items />
  </demo-section>

  <!-- 12. Inputs variants over different backgrounds -->
  <demo-section
    title="Inputs"
    caption="Real cba-input / cba-select / cba-datepicker over each surface.">
    <div class="demo-input-grid">
      @for (surface of inputSurfaces; track surface.className) {
        <div [class]="'demo-surface ' + surface.className">
          <h3>{{ surface.title }}</h3>
          <cba-input label="Customer" hint="Name or tax ID." [(ngModel)]="sampleText" />
          <cba-input label="Disabled" [disabled]="true" />
          <cba-input label="Read only" [readonly]="true" value="Read-only value" />
          <cba-input label="Valid" [valid]="true" hint="Validated successfully." />
          <cba-input label="Invalid" error="The entered tax ID is invalid." />
          <cba-select label="Status" [(ngModel)]="sampleSelect">
            <option value="">Choose…</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="settled">Settled</option>
          </cba-select>
          <cba-datepicker label="Due date" hint="YYYY-MM-DD" [(ngModel)]="formModel.dueDate" />
        </div>
      }
    </div>
  </demo-section>

  <!-- 13. Form example -->
  <demo-section title="Form example" caption="Inputs, select, datepicker, labels, hints, and errors.">
    <cba-card>
      <div cbaCardHeader>Customer form</div>
      <div class="demo-form-grid">
        <cba-input label="Customer name" hint="Full business name." [(ngModel)]="formModel.customerName" />
        <cba-input label="Email" hint="Billing contact email." type="email" [(ngModel)]="formModel.email" />
        <cba-select label="Status" [(ngModel)]="formModel.status">
          <option value="">Choose…</option>
          <option value="active">Active</option>
          <option value="overdue">Overdue</option>
          <option value="settled">Settled</option>
        </cba-select>
        <cba-datepicker label="Due date" hint="Pick a date." [(ngModel)]="formModel.dueDate" />
        <cba-input label="Notes" hint="Optional observations." />
      </div>
      <div cbaCardFooter class="demo-form-actions">
        <cba-button variant="primary" type="submit">Save</cba-button>
        <cba-button variant="ghost">Cancel</cba-button>
      </div>
    </cba-card>
  </demo-section>

  <!-- 14. Footer bar -->
  <footer class="shell-footer">
    <div class="shell-footer__actions">
      <cba-button variant="secondary" [icon]="faRefresh">Refresh</cba-button>
      <cba-button variant="primary" [icon]="faPlus">New</cba-button>
      <cba-button variant="ghost" [icon]="faDownload">Export</cba-button>
    </div>
  </footer>

</div>
```

**Notes:**
- The `demo-table` component is used twice (rows 1 and section 10) — both render the same fixed data, which is acceptable per spec (sections 3 and 10 both require a table example).
- All text is English. The ellipsis character `…` is used as in the spec.

**Commit point (after step 12):**
```
feat(demo): rebuild app template with all showcase sections
```

---

## 13. Rewrite `projects/demo/src/app/app.component.scss`

**File:** `projects/demo/src/app/app.component.scss`

### 13.1 Full rewrite

Replace the entire file content with exactly:

```scss
// Demo app styles — layout chrome + demo-specific grids only.
// Component looks come from the built @cobranza-apps/ui library.
// Pixel values are exposed as named SCSS variables; the rest use theme tokens.

$preview-bar-padding: var(--cba-space-2) var(--cba-space-3);
$preview-bar-font-size: var(--cba-font-size-caption);
$header-height: var(--cba-header-height);
$search-max-width: 600px;
$swatch-grid-min: 140px;
$input-grid-min: 320px;
$size-row-gap: var(--cba-space-3);
$pill-sm-padding: 2px 8px;
$pill-md-padding: 6px 16px;

:host {
  display: block;
}

.demo-app {
  min-height: 100vh;
  background: var(--cba-bg-primary);
  color: var(--cba-text-primary);
}

.preview-bar {
  padding: $preview-bar-padding;
  font-size: $preview-bar-font-size;
  color: var(--cba-text-muted);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
  display: flex;
  gap: var(--cba-space-2);
  strong {
    color: var(--cba-text-secondary);
  }
}

.shell-header {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--cba-space-3);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
}
.shell-header__left,
.shell-header__right {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
}
.shell-header__center {
  flex: 0 0 50%;
  max-width: $search-max-width;
  margin: 0 auto;
}
.shell-header__search {
  width: 100%;
}
.shell-header__brand {
  font-weight: 600;
  color: var(--cba-text-primary);
}

.workspace {
  padding: var(--cba-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}
.workspace__row {
  display: flex;
  gap: var(--cba-space-3);
}
.workspace__row--single-50 .demo-module-card--size-50 {
  flex: 0 0 50%;
}

.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cba-space-2);
}

.demo-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($swatch-grid-min, 1fr));
  gap: var(--cba-space-2);
}

.demo-surface {
  padding: var(--cba-space-3);
  border-radius: var(--cba-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-2);
}
.demo-surface--secondary {
  background: var(--cba-bg-secondary);
}
.demo-surface--elevated {
  background: var(--cba-bg-elevated);
}
.demo-surface--primary {
  background: var(--cba-bg-primary);
}
.demo-surface--tertiary {
  background: var(--cba-bg-tertiary);
}

.demo-input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
  gap: var(--cba-space-3);
}

.demo-size-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $size-row-gap;
}

.demo-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
  border-radius: 999px;
  font-size: var(--cba-font-size-small);
  border: 1px solid transparent;
  background: var(--cba-bg-tertiary);
  color: var(--cba-text-primary);
}
.demo-pill--primary {
  background: var(--cba-accent-primary);
  color: var(--cba-text-inverse);
}
.demo-pill--sm {
  padding: $pill-sm-padding;
}
.demo-pill--md {
  padding: $pill-md-padding;
}

.demo-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
  gap: var(--cba-space-3);
}
.demo-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--cba-space-2);
}

.shell-footer {
  border-top: 1px solid var(--cba-border-default);
  background: var(--cba-bg-elevated);
  padding: var(--cba-space-3);
}
.shell-footer__actions {
  display: flex;
  justify-content: center;
  gap: var(--cba-space-2);
}
```

**Notes:**
- The `.demo-table`, `.demo-row--selected`, `.demo-nav`, `.demo-nav-item*` styles are now owned by their respective new components (steps 9, 10). Do NOT re-add them here.
- The `.demo-pill` base + `--primary` + `--sm` + `--md` styles are defined here because the sizes section (section 7) renders pills inline in `AppComponent` rather than via `DemoPillMatrixComponent`. The full variant matrix lives in `DemoPillMatrixComponent`'s own inline styles.
- All numeric values are expressed via named SCSS variables or `--cba-*` tokens (rule compliant).

**Commit point (after step 13):**
```
feat(demo): rebuild app styles for new showcase layout
```

---

## 14. Build verification

### 14.1 Build library
Run: `npm run build`
- Expected: completes with no errors, outputs to `dist/`. If it fails, STOP and report the error to the caller. Do NOT modify `src/`.

### 14.2 Build demo
Run: `npm run build:demo`
- Expected: completes with no errors, outputs to `dist/demo/browser/`. If it fails:
  - If the error is a missing `@ng-bootstrap/ng-bootstrap` import or `NgbDateStruct` not found, verify the import path `@ng-bootstrap/ng-bootstrap` is resolvable from the demo project (it is a peer dep at repo root). Do NOT add it to `projects/demo/package.json`.
  - If the error is a TypeScript `readonly` complaint on `[(ngModel)]="formModel.<field>"`, apply the permitted adjustment from step 11.1 notes (remove `readonly` from the four `FormFieldModel` fields only).
  - For any other error, STOP and report to the caller with the full error text. Do NOT guess fixes.

**Commit point (after successful build, only if any fix was applied):**
```
fix(demo): resolve build errors from showcase rebuild
```
(If no fix was needed, skip this commit.)

---

## 15. Code review checklist (self-check before signaling completion)

Run each check; if any fails, fix per the referenced step and re-run step 14.

1. **Language**: no Spanish strings remain in `projects/demo/src/` UI text. Verify by grep:
   - Run: `grep -rn "Buscar\|Cliente\|Estado\|Vencida\|Saldada\|Deshabilitado\|Configuración\|Notificaciones\|Nuevo\|Sincronizar\|Exportar\|Cartera\|Acciones\|Módulo\|tema único\|Elegir" projects/demo/src`
   - Expected: zero matches. If any match, replace with the English equivalent from the spec.

2. **`index.html` lang**: `grep -n 'lang="en"' projects/demo/src/index.html` → exactly one match.

3. **No `src/` modifications**: `git status -- src/` → no changes. If `src/` files appear modified, revert them (`git checkout -- src/`) and STOP.

4. **File line counts** (rule: ≤200): verify each new/modified `.ts` file is ≤200 lines.
   - Run: `wc -l projects/demo/src/app/app.component.ts projects/demo/src/app/components/*/*.ts`
   - All must be ≤200.

5. **No commented-out code** in any modified/new file (rule: no-commented-code).

6. **JSDoc present** on every new component class (DemoPillMatrix, DemoIconGrid, DemoTextShowcase, DemoTable, DemoNavItems) stating it is demo-only and not part of the public API.

7. **Real library components used** for buttons, badges, inputs, select, datepicker, module header/container/footer, card. No CSS-only fake replicas of library components.

8. **Section order** in `app.component.html` matches spec §4 / TODO exactly: preview → header → workspace (6 rows) → tokens → buttons → pills → sizes → icons → texts → table → nav → inputs → form → footer.

9. **Workspace row order** matches TODO lines 14–19 exactly (1 expanded 100%, 1 collapsed 100%, 2 expanded 50%, 2 collapsed 50%, 1 expanded 50% single, 1 collapsed 50% single).

10. **Acceptance criteria** from spec §11 all satisfied (walk through each `[ ]` item mentally against the final template).

---

## 16. Final commit + summary

### 16.1 Ensure all changes committed
Run: `git status`
- Expected: clean working tree. If anything is unstaged, stage and commit with a descriptive message.

### 16.2 Signal completion to caller

Return a summary containing:
- Plan file path: `.kilo/plans/20260819-update-demo-task1-plan.md`
- What was done: list of files created / modified.
- What was NOT done: implementation (this plan only), git branch creation (assumed done in step 2 of the Critical Workflow), version bump, code review sub-step, docs sub-step, verification sub-step, task completion sub-step.
- Build status: NOT built (planning step only — the implementer in step 4.2 will run the build).
- Any deviations from this plan applied during planning: none.

---

## 17. Plan vs. task verification (self-check)

- TODO requirement: header bar (back btn "Volver"? spec §7.2 says "Back") → spec overrides with English "Back". Plan uses "Back". ✓
- TODO: centered search ~50% width → spec §7.2 + plan step 13 `.shell-header__center { flex: 0 0 50%; }`. ✓
- TODO: notifications + profile icons at right → plan step 12 header. ✓
- TODO: 6 workspace rows in exact order → plan step 12 rows 1–6. ✓
- TODO: token grid with color, name, tag, hex → plan steps 3 + 12 (colorTokens array). ✓
- TODO: btn section variants × bkg × status with names/tags/status/bkg → plan step 5 caption format. ✓
- TODO: pills section → plan step 6. ✓
- TODO: sizes section → plan step 12 section 7. ✓
- TODO: predefined icons → plan step 7. ✓
- TODO: texts/fonts/labels over bkg/status → plan step 8. ✓
- TODO: complete table → plan step 9. ✓
- TODO: navigation items → plan step 10. ✓
- TODO: inputs variants over bkg → plan step 12 section 12. ✓
- TODO: form example → plan step 12 section 13. ✓
- TODO: footer centered → plan step 13 `.shell-footer__actions { justify-content: center }`. ✓
- TODO: English only → plan steps 2, 11, 12, 15.1. ✓
- Constraints: only `projects/demo/` modified → plan steps 2–13. ✓
- No library source changes → plan step 15.3. ✓
- Real library components → plan step 15.7. ✓
- JSDoc on new demo components → plan steps 6–10 + 15.6. ✓
- Coding rules (lines, methods, params, nesting, private, self-documenting) → plan section 0.2 + each file. ✓

Plan is correct. No redo needed.
