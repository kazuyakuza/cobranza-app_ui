# Front-end Technical Specification — Demo Button, Pill, Footer & Size Showcase Fixes

**Task:** Task 3 from `.agent/todos/20260819/20260819-todo-1.md` — fix Buttons/Pills sections, footer bar buttons, and button/pill size showcase.

**Scope:** Demo application only (`projects/demo/src/app/...`). No library component code changes. Use existing `@cobranza-apps/ui` APIs and `--cba-*` tokens.

---

## 1. Root-cause analysis

| # | Bug | Root cause | Fix location |
| --- | --- | --- | --- |
| 1 | Buttons/Pills matrices are not real tables and lack token/style info rows | Current matrices use a single flex row per state with captions under each cell. This is not the requested table layout (`status \| primary \| secondary \| ghost \| danger \| Success`) and omits a dedicated row for token/style information. | `demo-button-matrix.component.ts/.scss`, `demo-pill-matrix.component.ts/.scss` |
| 2 | `bg-primary` group blends into workspace background | `--cba-bg-primary` is also the demo app workspace background, so the group has no visible boundary. | `demo-button-matrix.component.scss`, `demo-pill-matrix.component.scss` |
| 3 | Footer bar uses buttons instead of section/category pills | `app.component.html` renders `<cba-button>` elements in the footer. Design intent is pill-shaped footer section switches (Clientes, Deudas, Pagos, Reportes). | `app.component.html/.scss`, optionally `demo-nav-items.component.ts/.scss` |
| 4 | Button/pill size section only shows primary variant | Current section shows one button and one pill per size, making cross-variant size comparison impossible. | `app.component.html/.scss` |

---

## 2. Files to modify

All paths are relative to workspace root `C:\projects\cobranza-app\front\ui`.

1. `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
2. `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.scss`
3. `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts`
4. `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss`
5. `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts` (minor input addition for reuse)
6. `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.scss` (large footer variant)
7. `projects/demo/src/app/app.component.html`
8. `projects/demo/src/app/app.component.scss`

**Do NOT modify:** `src/components/button/*`, `src/theme/*`, `docs/*`, or any other library file.

---

## 3. Detailed specification

### 3.1 Button matrix — table layout + token/style info rows

#### 3.1.1 Template (`demo-button-matrix.component.ts`)

Replace the current flex-loop structure with a semantic `<table>`.

```html
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
```

#### 3.1.2 Data model

Keep existing `ButtonMatrixBlock`, `ButtonMatrixRow`, `ButtonMatrixCell` interfaces and the `buildBlock`/`buildRow` helpers. Add a new pure helper in the component file:

```ts
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

Expose it to the template via a protected method or directly assign the helper to a class field:

```ts
protected readonly buttonTokenInfo = buttonTokenInfo;
```

#### 3.1.3 Styles (`demo-button-matrix.component.scss`)

Keep `.demo-matrix`, `.demo-surface`, surface color modifiers. Replace row/cell/caption classes with table styles.

```scss
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
  width: 80px;
}
.demo-matrix-table__status {
  width: 80px;
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

#### 3.1.4 `bg-primary` border

Add to `.demo-surface--primary`:

```scss
.demo-surface--primary {
  background: var(--cba-bg-primary);
  border: 1px solid var(--cba-border-strong);
}
```

---

### 3.2 Pill matrix — table layout + token/style info rows

#### 3.2.1 Template (`demo-pill-matrix.component.ts`)

Mirror the button matrix table structure, using `<span>` pills instead of `<cba-button>`.

```html
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
```

#### 3.2.2 Data model

Keep existing `PillMatrixBlock`, `PillMatrixRow`, `PillCell`, `PILL_VARIANTS`, `PILL_STATES`, `buildPillBlock`, `buildPillRow`, and `pillClass` helper. Add:

```ts
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

Expose to template:

```ts
protected readonly pillTokenInfo = pillTokenInfo;
```

#### 3.2.3 Styles (`demo-pill-matrix.component.scss`)

Replace existing `.demo-matrix-row`, `.demo-matrix-cell`, `.demo-matrix-cell__caption` classes with the same table styles used in `demo-button-matrix.component.scss` (Section 3.1.3).

Keep existing `.demo-pill` and modifier classes (`.demo-pill--primary`, `.demo-pill--secondary`, `.demo-pill--ghost`, `.demo-pill--danger`, `.demo-pill--success`, `.demo-pill--selected`, `.demo-pill--disabled`).

Add to `.demo-surface--primary`:

```scss
.demo-surface--primary {
  background: var(--cba-bg-primary);
  border: 1px solid var(--cba-border-strong);
}
```

---

### 3.3 Footer bar — pill-shaped section switches

The footer must display four section/category pills: **Clientes**, **Deudas**, **Pagos**, **Reportes**. Reuse the existing `demo-nav-items` component by converting its hardcoded item list into an `@Input()` with a default fallback.

#### 3.3.1 `demo-nav-items.component.ts`

Convert the hardcoded `items` array to an input with the current English defaults.

```ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

const DEFAULT_ITEMS: readonly NavItem[] = [
  { label: 'Customers', selected: true, disabled: false },
  { label: 'Invoices', selected: false, disabled: false },
  { label: 'Reports', selected: false, disabled: false },
  { label: 'Settings', selected: false, disabled: true },
];

@Component({
  selector: 'demo-nav-items',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...existing template...`,
  styleUrl: './demo-nav-items.component.scss',
})
export class DemoNavItemsComponent {
  readonly items = input<readonly NavItem[]>(DEFAULT_ITEMS);
}
```

Export `NavItem` interface so `app.component.ts` can type the footer array if desired (optional but recommended).

#### 3.3.2 `demo-nav-items.component.scss`

Add a large variant modifier for the footer use case.

```scss
:host(.demo-nav--large) {
  .demo-nav-item {
    padding: var(--cba-space-2) var(--cba-space-4);
    font-size: var(--cba-font-size-body);
  }
}
```

#### 3.3.3 `app.component.html`

Replace the footer button markup:

```html
<!-- 14. Footer bar -->
<footer class="shell-footer">
  <demo-nav-items
    class="shell-footer__pills demo-nav--large"
    [items]="footerItems"
    aria-label="Module sections" />
</footer>
```

Remove the old `.shell-footer__actions` wrapper and `<cba-button>` children.

#### 3.3.4 `app.component.ts`

Add a `footerItems` array:

```ts
protected readonly footerItems: readonly NavItem[] = [
  { label: 'Clientes', selected: true, disabled: false },
  { label: 'Deudas', selected: false, disabled: false },
  { label: 'Pagos', selected: false, disabled: false },
  { label: 'Reportes', selected: false, disabled: false },
];
```

Import `NavItem` from `demo-nav-items.component` if exported; otherwise define the same inline shape.

#### 3.3.5 `app.component.scss`

Update footer styles:

```scss
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

Remove the old `.shell-footer__actions` block.

---

### 3.4 Button and pill sizes — cross-variant size comparison

Replace the current single-row size demo with a table that shows every variant at both `sm` and `md` sizes for buttons and pills side by side.

#### 3.4.1 `app.component.html`

```html
<!-- 7. Button / pill sizes -->
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

#### 3.4.2 `app.component.scss`

Replace the old `.demo-size-row` styles. Keep `.demo-pill`, `.demo-pill--primary`, `.demo-pill--sm`, `.demo-pill--md` rules.

```scss
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

---

## 4. Token/style info text (exact strings)

These strings are required in the info rows.

### 4.1 Button matrix

| Variant | Info text |
| --- | --- |
| primary | `.cba-button--primary · var(--cba-accent-primary) · inverse overlay` |
| secondary | `.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)` |
| ghost | `.cba-button--ghost · transparent · dark overlay` |
| danger | `.cba-button--danger · var(--cba-accent-danger) · inverse overlay` |
| success | `.cba-button--success · var(--cba-accent-success) · inverse overlay` |

### 4.2 Pill matrix

| Variant | Info text |
| --- | --- |
| primary | `.demo-pill--primary · var(--cba-accent-primary) · inverse text` |
| secondary | `.demo-pill--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)` |
| ghost | `.demo-pill--ghost · transparent · var(--cba-border-default)` |
| danger | `.demo-pill--danger · var(--cba-accent-danger) · inverse text` |
| success | `.demo-pill--success · var(--cba-accent-success) · inverse text` |

---

## 5. Acceptance criteria

1. Button matrix renders a `<table>` with header `status \| primary \| secondary \| ghost \| danger \| Success`.
2. Each state in the button matrix has a control row followed by a token/style info row.
3. Pill matrix has the same table structure as the button matrix.
4. `bg-primary` surface blocks in both matrices have a visible `1px solid var(--cba-border-strong)` border.
5. Footer bar no longer contains `<cba-button>` elements; it shows four pill-shaped nav items labeled **Clientes**, **Deudas**, **Pagos**, **Reportes**.
6. `demo-nav-items` accepts its items via `@Input()` and still renders the original English items by default in the "Navigation items" section.
7. Button/pill size section shows both `sm` and `md` for every variant in a table layout.
8. All changes use existing `--cba-*` tokens and existing component APIs.
9. `npm run lint` and `npm run build:demo` pass after implementation.

---

## 6. Notes for implementer (50% restriction)

- Do not create new library components or change `CbaButtonComponent` API.
- Do not change theme tokens or `_variables.scss`.
- Keep all demo-only components demo-only; do not export anything new from `@cobranza-apps/ui`.
- Use semantic `<table>` markup for the matrices; do not approximate tables with flex/grid divs.
- Preserve existing component comments and JSDoc style.
