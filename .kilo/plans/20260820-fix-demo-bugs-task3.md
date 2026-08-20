# Implementation Plan — Task 3: Button, Pill, Footer & Size Showcase Fixes

**TODO:** `.agent/todos/20260819/20260819-todo-1.md` → section **"Buttons and Pills sections bugs"**, **"Footer bar btns"**, **"Button and pill sizes" section**.
**Front-end spec:** `.kilo/plans/20260820-fix-demo-bugs-task3-frontend-spec.md`.
**Scope:** Demo app only (`projects/demo/src/app/...`). NO library changes.
**Target implementer:** JUNIOR developer, 50% restriction. Follow every step verbatim. Do NOT rename, reorder, or invent.

All paths are relative to `C:\projects\cobranza-app\front\ui`.

---

## Pre-flight (read-only, before any edit)

1. Read these files (already done by planner; implementer MUST re-read before editing):
   - `.kilo/plans/20260820-fix-demo-bugs-task3-frontend-spec.md`
   - `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
   - `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.scss`
   - `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts`
   - `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss`
   - `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts`
   - `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.scss`
   - `projects/demo/src/app/app.component.html`
   - `projects/demo/src/app/app.component.scss`
   - `projects/demo/src/app/app.component.ts`
2. Confirm the feature branch from Step 2 is active: `git branch --show-current` (must NOT be `main`). Do NOT create/switch branches.

## Step ordering

Execute steps in this exact order. Commit after each labeled step with the message given.

1. Step A — Button matrix (template + helper + SCSS)
2. Step B — Pill matrix (template + helper + SCSS)
3. Step C — `demo-nav-items` input + large variant
4. Step D — `app.component.ts` footer items + import
5. Step E — `app.component.html` footer + size section
6. Step F — `app.component.scss` footer + size styles
7. Step G — Verify (lint + build:demo)
8. Step H — Final commit if any remaining

---

## Step A — Button matrix

### A.1 `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`

**A.1.1** Replace the entire `template: \`...\`` block (current lines 57–83) with the table-based template below.

OLD (exact, lines 57–83):
```
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
```

NEW:
```
  template: `
    <div class="demo-matrix">
      @for (block of blocks; track block.surfaceTitle) {
        <div [class]="'demo-surface ' + block.surfaceClass">
          <h3>{{ block.surfaceTitle }}</h3>
          <table class="demo-matrix-table">
            <thead>
              <tr>
                <th scope="col" class="demo-matrix-table__status-head">status</th>
                <th scope="col">primary</th>
                <th scope="col">secondary</th>
                <th scope="col">ghost</th>
                <th scope="col">danger</th>
                <th scope="col">success</th>
              </tr>
            </thead>
            <tbody>
              @for (row of block.rows; track row.state) {
                <tr class="demo-matrix-table__control-row">
                  <th scope="row" class="demo-matrix-table__status">{{ row.state }}</th>
                  @for (cell of row.cells; track cell.variant) {
                    <td class="demo-matrix-table__cell">
                      <cba-button
                        [variant]="cell.variant"
                        [disabled]="cell.state === 'disabled'"
                        [loading]="cell.state === 'loading'">
                        {{ cell.variant | titlecase }}
                      </cba-button>
                    </td>
                  }
                </tr>
                <tr class="demo-matrix-table__info-row">
                  <td></td>
                  @for (cell of row.cells; track cell.variant) {
                    <td class="demo-matrix-table__info">
                      {{ buttonTokenInfo(cell.variant) }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
```

**A.1.2** Add the `buttonTokenInfo` pure helper function. Insert it immediately AFTER the `buildBlock` function (after current line 43, before the JSDoc comment block for the component at line 45). Use exactly:

```ts
/** Token/style info text shown under each button variant in the matrix. */
function buttonTokenInfo(variant: CbaButtonVariant): string {
  switch (variant) {
    case 'primary':
      return '.cba-button--primary · var(--cba-accent-primary) · inverse overlay';
    case 'secondary':
      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)';
    case 'ghost':
      return '.cba-button--ghost · transparent · dark overlay';
    case 'danger':
      return '.cba-button--danger · var(--cba-accent-danger) · inverse overlay';
    case 'success':
      return '.cba-button--success · var(--cba-accent-success) · inverse overlay';
  }
}
```

**A.1.3** Inside `export class DemoButtonMatrixComponent`, add a protected field exposing the helper. Insert as the FIRST member of the class body (before `protected readonly blocks`).

```ts
  protected readonly buttonTokenInfo = buttonTokenInfo;
```

The existing `blocks` field stays unchanged.

### A.2 `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.scss`

**A.2.1** Replace the `demo-matrix-row`, `demo-matrix-row__status`, `demo-matrix-cell`, `demo-matrix-cell__caption` rule blocks (current lines 27–49) with the table styles below. Keep `$matrix-status-width`, `:host`, `.demo-matrix`, `.demo-surface`, `.demo-surface--secondary`, `.demo-surface--elevated` untouched.

OLD (lines 27–49):
```
.demo-matrix-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--cba-space-3);
  margin-top: var(--cba-space-2);
}
.demo-matrix-row__status {
  width: $matrix-status-width;
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
```

NEW:
```
.demo-matrix-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: var(--cba-space-2);
}
.demo-matrix-table th,
.demo-matrix-table td {
  padding: var(--cba-space-2);
  text-align: left;
  vertical-align: top;
}
.demo-matrix-table thead th {
  font-size: var(--cba-font-size-caption);
  font-weight: 600;
  color: var(--cba-text-secondary);
  text-transform: capitalize;
  border-bottom: 1px solid var(--cba-border-default);
}
.demo-matrix-table__status-head {
  width: $matrix-status-width;
}
.demo-matrix-table__status {
  width: $matrix-status-width;
  font-size: var(--cba-font-size-caption);
  color: var(--cba-text-secondary);
  text-transform: capitalize;
  font-weight: 500;
}
.demo-matrix-table__cell {
  text-align: left;
}
.demo-matrix-table__info-row td {
  padding-top: 0;
}
.demo-matrix-table__info {
  font-size: var(--cba-font-size-caption);
  color: var(--cba-text-muted);
  line-height: var(--cba-line-height-caption);
}
```

**A.2.2** Add a border to `.demo-surface--primary`. Replace the existing block (current lines 24–26):

OLD:
```
.demo-surface--primary {
  background: var(--cba-bg-primary);
}
```

NEW:
```
.demo-surface--primary {
  background: var(--cba-bg-primary);
  border: 1px solid var(--cba-border-strong);
}
```

### A.3 Commit

```
git add projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.scss
git commit -m "feat(demo): button matrix as semantic table with token info rows + bg-primary border"
```

---

## Step B — Pill matrix

### B.1 `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts`

**B.1.1** Replace the entire `template: \`...\`` block (current lines 64–85) with the table-based template below.

OLD (lines 64–85):
```
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
```

NEW:
```
  template: `
    <div class="demo-matrix">
      @for (block of blocks; track block.surfaceTitle) {
        <div [class]="'demo-surface ' + block.surfaceClass">
          <h3>{{ block.surfaceTitle }}</h3>
          <table class="demo-matrix-table">
            <thead>
              <tr>
                <th scope="col" class="demo-matrix-table__status-head">status</th>
                <th scope="col">primary</th>
                <th scope="col">secondary</th>
                <th scope="col">ghost</th>
                <th scope="col">danger</th>
                <th scope="col">success</th>
              </tr>
            </thead>
            <tbody>
              @for (row of block.rows; track row.state) {
                <tr class="demo-matrix-table__control-row">
                  <th scope="row" class="demo-matrix-table__status">{{ row.state }}</th>
                  @for (cell of row.pills; track cell.name) {
                    <td class="demo-matrix-table__cell">
                      <span [class]="pillClassFn(cell, row.state)">{{ cell.name }}</span>
                    </td>
                  }
                </tr>
                <tr class="demo-matrix-table__info-row">
                  <td></td>
                  @for (cell of row.pills; track cell.name) {
                    <td class="demo-matrix-table__info">
                      {{ pillTokenInfo(cell.modifier) }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
```

**B.1.2** Add the `pillTokenInfo` pure helper. Insert it immediately AFTER the `pillClass` function (after current line 49, before the JSDoc comment block at line 51). Use exactly:

```ts
/** Token/style info text shown under each pill variant in the matrix. */
function pillTokenInfo(modifier: PillCell['modifier']): string {
  switch (modifier) {
    case 'primary':
      return '.demo-pill--primary · var(--cba-accent-primary) · inverse text';
    case 'secondary':
      return '.demo-pill--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)';
    case 'ghost':
      return '.demo-pill--ghost · transparent · var(--cba-border-default)';
    case 'danger':
      return '.demo-pill--danger · var(--cba-accent-danger) · inverse text';
    case 'success':
      return '.demo-pill--success · var(--cba-accent-success) · inverse text';
  }
}
```

**B.1.3** Inside `export class DemoPillMatrixComponent`, add a protected field exposing the helper. Insert as the FIRST member of the class body (before `protected readonly blocks`).

```ts
  protected readonly pillTokenInfo = pillTokenInfo;
```

The existing `blocks` and `pillClassFn` members stay unchanged.

### B.2 `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss`

**B.2.1** Replace the `demo-matrix-row`, `demo-matrix-row__status`, `demo-matrix-cell`, `demo-matrix-cell__caption` rule blocks (current lines 29–51) with the same table styles used in Step A.2.1. Keep `$matrix-status-width`, `$pill-padding`, `$pill-border-radius`, `:host`, `.demo-matrix`, `.demo-surface`, surface modifiers, and ALL `.demo-pill*` rules untouched.

OLD (lines 29–51):
```
.demo-matrix-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--cba-space-3);
  margin-top: var(--cba-space-2);
}
.demo-matrix-row__status {
  width: $matrix-status-width;
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
```

NEW (identical to Step A.2.1 NEW block):
```
.demo-matrix-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-top: var(--cba-space-2);
}
.demo-matrix-table th,
.demo-matrix-table td {
  padding: var(--cba-space-2);
  text-align: left;
  vertical-align: top;
}
.demo-matrix-table thead th {
  font-size: var(--cba-font-size-caption);
  font-weight: 600;
  color: var(--cba-text-secondary);
  text-transform: capitalize;
  border-bottom: 1px solid var(--cba-border-default);
}
.demo-matrix-table__status-head {
  width: $matrix-status-width;
}
.demo-matrix-table__status {
  width: $matrix-status-width;
  font-size: var(--cba-font-size-caption);
  color: var(--cba-text-secondary);
  text-transform: capitalize;
  font-weight: 500;
}
.demo-matrix-table__cell {
  text-align: left;
}
.demo-matrix-table__info-row td {
  padding-top: 0;
}
.demo-matrix-table__info {
  font-size: var(--cba-font-size-caption);
  color: var(--cba-text-muted);
  line-height: var(--cba-line-height-caption);
}
```

**B.2.2** Add a border to `.demo-surface--primary`. Replace the existing block (current lines 26–28):

OLD:
```
.demo-surface--primary {
  background: var(--cba-bg-primary);
}
```

NEW:
```
.demo-surface--primary {
  background: var(--cba-bg-primary);
  border: 1px solid var(--cba-border-strong);
}
```

### B.3 Commit

```
git add projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss
git commit -m "feat(demo): pill matrix as semantic table with token info rows + bg-primary border"
```

---

## Step C — `demo-nav-items` input + large variant

### C.1 `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts`

**C.1.1** Replace the import line (current line 1):

OLD:
```
import { ChangeDetectionStrategy, Component } from '@angular/core';
```

NEW:
```
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
```

**C.1.2** Export the `NavItem` interface. Replace the interface declaration (current lines 3–8):

OLD:
```
/** One navigation item shown in the demo nav row. */
interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}
```

NEW:
```
/** One navigation item shown in the demo nav row. */
export interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}
```

**C.1.3** Add a `DEFAULT_ITEMS` constant. Insert it immediately AFTER the exported `NavItem` interface (after the new interface block, before the component JSDoc comment). Use exactly:

```ts
/** Default English items used when no `[items]` input is bound. */
const DEFAULT_ITEMS: readonly NavItem[] = [
  { label: 'Customers', selected: true, disabled: false },
  { label: 'Invoices', selected: false, disabled: false },
  { label: 'Reports', selected: false, disabled: false },
  { label: 'Settings', selected: false, disabled: true },
];
```

**C.1.4** Convert the hardcoded `items` class field to a signal input with the default fallback. Replace the class body field (current lines 39–46):

OLD:
```
export class DemoNavItemsComponent {
  protected readonly items: NavItem[] = [
    { label: 'Customers', selected: true, disabled: false },
    { label: 'Invoices', selected: false, disabled: false },
    { label: 'Reports', selected: false, disabled: false },
    { label: 'Settings', selected: false, disabled: true },
  ];
}
```

NEW:
```
export class DemoNavItemsComponent {
  protected readonly items = input<readonly NavItem[]>(DEFAULT_ITEMS);
}
```

The template (current lines 22–36) stays UNCHANGED.

### C.2 `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.scss`

**C.2.1** Append the large-variant modifier block at the END of the file (after the `.demo-nav-item--disabled:hover` rule, current line 41). Add exactly:

```scss
:host(.demo-nav--large) {
  .demo-nav-item {
    padding: var(--cba-space-2) var(--cba-space-4);
    font-size: var(--cba-font-size-body);
  }
}
```

Do NOT modify any existing rule in this file.

### C.3 Commit

```
git add projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.scss
git commit -m "feat(demo): demo-nav-items accepts items input + large footer variant"
```

---

## Step D — `app.component.ts` footer items + import

### D.1 `projects/demo/src/app/app.component.ts`

**D.1.1** Update the `DemoNavItemsComponent` import to also bring in `NavItem`. Replace (current line 20):

OLD:
```
import { DemoNavItemsComponent } from './components/demo-nav-items/demo-nav-items.component';
```

NEW:
```
import { DemoNavItemsComponent, NavItem } from './components/demo-nav-items/demo-nav-items.component';
```

**D.1.2** Add the `footerItems` readonly array. Insert it as a new class member immediately AFTER `protected readonly faDownload = faDownload;` (current line 93). Use exactly:

```ts
  protected readonly footerItems: readonly NavItem[] = [
    { label: 'Clientes', selected: true, disabled: false },
    { label: 'Deudas', selected: false, disabled: false },
    { label: 'Pagos', selected: false, disabled: false },
    { label: 'Reportes', selected: false, disabled: false },
  ];
```

Do NOT remove the existing `faBell`, `faUser`, `faPlus`, `faRefresh`, `faDownload` fields (they remain used by the header). Do NOT remove `faRefresh`/`faDownload`/`faPlus` even though the footer no longer uses them — they are unused now but removing them is OUT OF SCOPE (header still uses `faBell`, `faUser`; the others are pre-existing and not part of this task's removal). Leave them as-is.

### D.2 Commit

```
git add projects/demo/src/app/app.component.ts
git commit -m "feat(demo): add footerItems (Clientes/Deudas/Pagos/Reportes) and import NavItem"
```

---

## Step E — `app.component.html` footer + size section

### E.1 Footer (current lines 135–142)

OLD:
```
  <!-- 14. Footer bar -->
  <footer class="shell-footer">
    <div class="shell-footer__actions">
      <cba-button variant="secondary" [icon]="faRefresh">Refresh</cba-button>
      <cba-button variant="primary" [icon]="faPlus">New</cba-button>
      <cba-button variant="ghost" [icon]="faDownload">Export</cba-button>
    </div>
  </footer>
```

NEW:
```
  <!-- 14. Footer bar -->
  <footer class="shell-footer">
    <demo-nav-items
      class="shell-footer__pills demo-nav--large"
      [items]="footerItems"
      aria-label="Module sections" />
  </footer>
```

### E.2 Button / pill sizes section (current lines 57–65)

OLD:
```
  <!-- 7. Button / pill sizes variants -->
  <demo-section title="Button and pill sizes" caption="sm vs md size variants.">
    <div class="demo-size-row">
      <cba-button variant="primary" size="sm">Small button</cba-button>
      <cba-button variant="primary" size="md">Medium button</cba-button>
      <span class="demo-pill demo-pill--primary demo-pill--sm">Small pill</span>
      <span class="demo-pill demo-pill--primary demo-pill--md">Medium pill</span>
    </div>
  </demo-section>
```

NEW:
```
  <!-- 7. Button / pill sizes variants -->
  <demo-section title="Button and pill sizes" caption="sm vs md (normal) for every variant.">
    <div class="demo-size-matrix">
      <table class="demo-size-table">
        <thead>
          <tr>
            <th scope="col">size</th>
            <th scope="col">primary</th>
            <th scope="col">secondary</th>
            <th scope="col">ghost</th>
            <th scope="col">danger</th>
            <th scope="col">success</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">sm</th>
            <td><cba-button variant="primary" size="sm">Small</cba-button></td>
            <td><cba-button variant="secondary" size="sm">Small</cba-button></td>
            <td><cba-button variant="ghost" size="sm">Small</cba-button></td>
            <td><cba-button variant="danger" size="sm">Small</cba-button></td>
            <td><cba-button variant="success" size="sm">Small</cba-button></td>
          </tr>
          <tr>
            <th scope="row">md</th>
            <td><cba-button variant="primary" size="md">Normal</cba-button></td>
            <td><cba-button variant="secondary" size="md">Normal</cba-button></td>
            <td><cba-button variant="ghost" size="md">Normal</cba-button></td>
            <td><cba-button variant="danger" size="md">Normal</cba-button></td>
            <td><cba-button variant="success" size="md">Normal</cba-button></td>
          </tr>
        </tbody>
      </table>

      <table class="demo-size-table">
        <thead>
          <tr>
            <th scope="col">size</th>
            <th scope="col">primary</th>
            <th scope="col">secondary</th>
            <th scope="col">ghost</th>
            <th scope="col">danger</th>
            <th scope="col">success</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">sm</th>
            <td><span class="demo-pill demo-pill--primary demo-pill--sm">Small</span></td>
            <td><span class="demo-pill demo-pill--secondary demo-pill--sm">Small</span></td>
            <td><span class="demo-pill demo-pill--ghost demo-pill--sm">Small</span></td>
            <td><span class="demo-pill demo-pill--danger demo-pill--sm">Small</span></td>
            <td><span class="demo-pill demo-pill--success demo-pill--sm">Small</span></td>
          </tr>
          <tr>
            <th scope="row">md</th>
            <td><span class="demo-pill demo-pill--primary demo-pill--md">Normal</span></td>
            <td><span class="demo-pill demo-pill--secondary demo-pill--md">Normal</span></td>
            <td><span class="demo-pill demo-pill--ghost demo-pill--md">Normal</span></td>
            <td><span class="demo-pill demo-pill--danger demo-pill--md">Normal</span></td>
            <td><span class="demo-pill demo-pill--success demo-pill--md">Normal</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </demo-section>
```

> Note: `.demo-pill--secondary`, `.demo-pill--ghost`, `.demo-pill--danger`, `.demo-pill--success` modifier classes are NOT defined in `app.component.scss`. They MUST be added in Step F.2 so the pills render with the correct surface. The existing `.demo-pill--primary` and size modifiers stay.

### E.3 Commit

```
git add projects/demo/src/app/app.component.html
git commit -m "feat(demo): footer uses demo-nav-items pills + size section as cross-variant table"
```

---

## Step F — `app.component.scss` footer + size styles

### F.1 Footer styles

**F.1.1** Replace the `.shell-footer` and `.shell-footer__actions` blocks (current lines 145–154).

OLD:
```
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

NEW:
```
.shell-footer {
  border-top: 1px solid var(--cba-border-default);
  background: var(--cba-bg-elevated);
  padding: var(--cba-space-3);
  display: flex;
  justify-content: center;
}
.shell-footer__pills {
  display: block;
}
```

### F.2 Size matrix + missing pill variant modifiers

**F.2.1** Replace the `.demo-size-row` block (current lines 106–111).

OLD:
```
.demo-size-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $size-row-gap;
}
```

NEW:
```
.demo-size-matrix {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-4);
}
.demo-size-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.demo-size-table th,
.demo-size-table td {
  padding: var(--cba-space-2);
  text-align: left;
  vertical-align: middle;
}
.demo-size-table thead th {
  font-size: var(--cba-font-size-caption);
  font-weight: 600;
  color: var(--cba-text-secondary);
  text-transform: capitalize;
  border-bottom: 1px solid var(--cba-border-default);
}
.demo-size-table tbody th {
  width: 60px;
  font-size: var(--cba-font-size-caption);
  color: var(--cba-text-secondary);
  text-transform: uppercase;
  font-weight: 500;
}
```

**F.2.2** The `$size-row-gap` SCSS variable (current line 11) is now unused. Remove that single line to avoid an unused-variable lint warning.

OLD (line 11):
```
$size-row-gap: var(--cba-space-3);
```

NEW: (delete the line entirely)

**F.2.3** Add the missing `.demo-pill` variant modifiers referenced by the new size table. Insert these rules immediately AFTER the existing `.demo-pill--primary` rule (after current line 126, before `.demo-pill--sm`).

```scss
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
```

The existing `.demo-pill`, `.demo-pill--primary`, `.demo-pill--sm`, `.demo-pill--md` rules stay unchanged.

### F.3 Commit

```
git add projects/demo/src/app/app.component.scss
git commit -m "feat(demo): footer pill layout + size matrix table styles + missing pill variant modifiers"
```

---

## Step G — Verify

Run each command separately (do NOT chain). Fix any error before proceeding; if an error is outside the modified files, STOP and ask the caller.

1. Lint:
   ```
   npm run lint
   ```
   Expected: passes with no new warnings/errors in the modified files.

2. Build demo:
   ```
   npm run build:demo
   ```
   Expected: build succeeds, no Angular template type errors.

3. If both pass, no further code changes. If a lint/build error points to an unused import (e.g. `faRefresh`, `faDownload`, `faPlus`, `faBell`, `faUser` no longer referenced), do NOT remove header icons. Only the footer buttons were removed; header icons (`faBell`, `faUser`) remain in use. If `faRefresh`, `faDownload`, `faPlus` trigger an unused-variable lint error, remove ONLY those three imports and their corresponding `protected readonly fa*` fields (lines for `faPlus`, `faRefresh`, `faDownload`). Do NOT touch `faBell` or `faUser`. If no lint error is raised, leave them untouched.

---

## Step H — Final

No extra commit unless Step G.3 made changes. If changes were made in G.3, commit:
```
git add -A
git commit -m "chore(demo): drop unused footer icon imports"
```

---

## Acceptance criteria (verifiable)

- [ ] `demo-button-matrix` renders a `<table>` with header `status | primary | secondary | ghost | danger | success`.
- [ ] Each button state row is followed by a token/style info row using `buttonTokenInfo`.
- [ ] `demo-pill-matrix` renders the same table structure with `pillTokenInfo` info rows.
- [ ] `.demo-surface--primary` in BOTH matrix SCSS files has `border: 1px solid var(--cba-border-strong)`.
- [ ] Footer in `app.component.html` contains NO `<cba-button>`; it renders `<demo-nav-items [items]="footerItems" class="shell-footer__pills demo-nav--large">`.
- [ ] `footerItems` = Clientes (selected), Deudas, Pagos, Reportes.
- [ ] `demo-nav-items` exposes `items` as `input<readonly NavItem[]>(DEFAULT_ITEMS)`; `NavItem` is exported; default English items render when no input bound (Navigation items section).
- [ ] `.demo-nav--large` host modifier increases padding and font size.
- [ ] Button/pill size section renders two tables (buttons, pills) each with `sm`/`md` rows across all 5 variants.
- [ ] `.demo-pill--secondary/--ghost/--danger/--success` modifiers exist in `app.component.scss`.
- [ ] Only `--cba-*` tokens and existing component APIs used. No library files modified.
- [ ] `npm run lint` and `npm run build:demo` pass.

---

## Out of scope (do NOT do)

- Do NOT modify any file under `src/`, `docs/`, `projects/demo/src/app/components/demo-workspace/`, `demo-text-showcase`, `demo-icon-grid`, `demo-table`, `demo-section`, `demo-swatch`, or `demo-input*`.
- Do NOT touch the "Color tokens" section, "Predefined icons" section, "Texts, fonts, labels" section, or workspace modules (those belong to other tasks).
- Do NOT bump `package.json` version, change `CHANGELOG.md`, push, merge, or rename the TODO file (those are other workflow steps).
- Do NOT change theme tokens or `_variables.scss`.
- Do NOT remove `faBell` / `faUser` (header still uses them).
