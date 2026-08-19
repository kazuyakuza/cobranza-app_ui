# Front-end Technical Specification: Update Demo App

## 1. Objective

Update the Angular demo application at `projects/demo/` so it renders the complete `@cobranza-apps/ui` component and token showcase from top to bottom, exactly in the order requested in `.agent/todos/20260819/20260819-todo-0.md`. All user-facing text in the demo must be in English.

## 2. Scope

### In scope

- `projects/demo/src/index.html`
- `projects/demo/src/app/app.component.ts`
- `projects/demo/src/app/app.component.html`
- `projects/demo/src/app/app.component.scss`
- Existing demo-only components:
  - `DemoSectionComponent`
  - `DemoSwatchComponent`
  - `DemoButtonMatrixComponent`
  - `DemoModuleCardComponent`
- New demo-only components created as needed (e.g. `DemoPillMatrixComponent`, `DemoIconGridComponent`).

### Out of scope

- Changes to library source code in `src/`.
- Changes to theme tokens in `src/theme/_variables.scss`.
- New library components.

## 3. Target Framework & Theme

- Angular 22 standalone components.
- Library consumed from `@cobranza-apps/ui` (built into `dist/`, materialized in `node_modules`).
- Theme loaded via `@use '@cobranza-apps/ui/theme';` in `projects/demo/src/styles.scss` (already present).
- All colors/spacing/typography must reference `--cba-*` tokens or `.cba-*` utility classes.

## 4. Exact Section Order

The demo page must render the following sections from top to bottom:

1. **Preview bar** (keep the existing thin bar, English text only).
2. **Header bar** with back button, brand label, centered search, and action icons.
3. **Workspace section** containing module examples in this exact row order:
   1. Expanded module at `100%` with header and footer.
   2. Collapsed module at `100%` (header only, no footer).
   3. Two expanded modules at `50%` with header and footer.
   4. Two collapsed modules at `50%` with header and footer.
   5. One expanded module at `50%` with header and footer and empty space at the right of the row.
   6. One collapsed module at `50%` with header and footer and empty space at the right of the row.
4. **Token colors grid** — swatch, name, tag, hex value.
5. **Button section** — variants × backgrounds × states with captions.
6. **Pills section** — same matrix idea for demo-only pills.
7. **Button / pill sizes variants**.
8. **Predefined icons** grid.
9. **Texts, fonts, labels variants** over different backgrounds and statuses.
10. **Complete table example**.
11. **Navigation items example**.
12. **Inputs variants** over different backgrounds.
13. **Form example**.
14. **Footer bar** with centered buttons.

## 5. Shared Data Models

Define these interfaces in `projects/demo/src/app/app.component.ts` (replace the existing ad-hoc interfaces).

```ts
interface ColorToken {
  readonly name: string;      // e.g. 'bg-primary'
  readonly tag: string;       // e.g. 'Background'
  readonly hex: string;       // e.g. '#BCB5A4'
  readonly variable: string;  // e.g. 'var(--cba-bg-primary)'
}

interface SurfaceTextItem {
  readonly className: string;
  readonly label: string;
}

interface TextSurface {
  readonly background: string;
  readonly items: SurfaceTextItem[];
}

interface TableRow {
  readonly id: string;
  readonly document: string;
  readonly name: string;
  readonly debt: string;
  readonly status: 'overdue' | 'current' | 'settled';
  readonly selected: boolean;
}

interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

interface FormFieldModel {
  readonly customerName: string;
  readonly email: string;
  readonly status: string;
  readonly dueDate: NgbDateStruct | null;
}
```

## 6. Component Breakdown

### Library components to import in `AppComponent`

```ts
import {
  CbaBadgeComponent,
  CbaButtonComponent,
  CbaDatepickerComponent,
  CbaInputComponent,
  CbaModuleFooterComponent,
  CbaSelectComponent,
  ModuleContainerComponent,
  ModuleHeaderComponent,
} from '@cobranza-apps/ui';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
```

### Demo-only components

| Component | File | Purpose |
|-----------|------|---------|
| `DemoSectionComponent` | existing | Section wrapper with title + caption. |
| `DemoSwatchComponent` | update existing | One token swatch card (swatch + name + tag + hex). |
| `DemoButtonMatrixComponent` | update existing | Button variants × surfaces × states. |
| `DemoModuleCardComponent` | update existing | Wraps `ModuleContainer` + `ModuleHeader` and optionally renders `CbaModuleFooter` outside the container. |
| `DemoPillMatrixComponent` | new | Pill variants × surfaces × states. |
| `DemoIconGridComponent` | new | Grid of predefined icons with labels. |
| `DemoTextShowcaseComponent` | new | Typography + text color variants over surfaces. |
| `DemoTableComponent` | new | Complete table example. |
| `DemoNavItemsComponent` | new | Navigation pills example. |

## 7. Section Specifications

### 7.1 Preview bar

Keep the existing `.preview-bar` element. Replace any Spanish text with English.

```html
<div class="preview-bar">
  <strong>{{ pageTitle }}</strong>
  <span>Minimal Yet Warm · single theme · desktop demo</span>
</div>
```

- `pageTitle` value: `'Demo app — consumes @cobranza-apps/ui build'`.

### 7.2 Header bar

Render inside `<header class="shell-header">`.

| Region | Content |
|--------|---------|
| Left | `<cba-button variant="primary" size="sm">Back</cba-button>` followed by `<span class="shell-header__brand">Cobranza - Back Office</span>`. |
| Center | `<cba-input class="shell-header__search" placeholder="Search customer, invoice, debt…" />`. |
| Right | Two icon-only ghost buttons: notifications (`faBell`, `aria-label="Notifications"`) and profile (`faUser`, `aria-label="Profile"`). |

Layout notes:
- `.shell-header` is `display: flex; align-items: center; justify-content: space-between;`.
- `.shell-header__search` is `flex: 0 0 50%; max-width: 600px;` and centered via `margin: 0 auto` or flex centering.
- The left group and right group are `display: flex; align-items: center; gap: var(--cba-space-2);`.

### 7.3 Workspace section

Render inside `<main class="workspace">`.

Update `DemoModuleCardComponent` so it can render a footer **outside** the collapsed body.

```ts
@Input() title = '';
@Input() size: ModuleContainerSize = '100%';
@Input() padding: ModuleContainerPadding = 'md';
@Input() status: ModuleHeaderStatus = 'loaded';
@Input() isCollapsed = false;
@Input() footerStatus: ModuleHeaderStatus | null = null;
@Input() footerText = '';
```

Template:

```html
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
  @if (footerStatus !== null || footerText) {
    <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
  }
</div>
```

Workspace row markup:

```html
<main class="workspace">
  <!-- Row 1 -->
  <demo-module-card
    title="Customer portfolio"
    size="100%"
    status="loaded"
    footerStatus="loaded"
    footerText="3 customers · total debt $ 1,730,000">
    <table class="demo-table">…</table>
  </demo-module-card>

  <!-- Row 2 -->
  <demo-module-card
    title="Quick actions"
    size="100%"
    status="warning"
    [isCollapsed]="true" />

  <!-- Row 3 -->
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

  <!-- Row 4 -->
  <div class="workspace__row">
    <demo-module-card
      title="Invoices"
      size="50%"
      status="dirty"
      [isCollapsed]="true"
      footerStatus="dirty"
      footerText="Unsaved changes" />

    <demo-module-card
      title="Reports"
      size="50%"
      status="error"
      [isCollapsed]="true"
      footerStatus="error"
      footerText="Load failed" />
  </div>

  <!-- Row 5 -->
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

  <!-- Row 6 -->
  <div class="workspace__row workspace__row--single-50">
    <demo-module-card
      title="Settings"
      size="50%"
      status="dirty"
      [isCollapsed]="true"
      footerStatus="dirty"
      footerText="Pending changes" />
  </div>
</main>
```

SCSS layout notes for rows:

```scss
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

.demo-module-card--size-50 {
  flex: 0 0 calc(50% - var(--cba-space-3) / 2);
}

.workspace__row--single-50 .demo-module-card--size-50 {
  flex: 0 0 50%;
}
```

### 7.4 Token colors grid

Update `DemoSwatchComponent` template:

```html
<div class="demo-swatch" [style.background]="background" [style.color]="color">
  <span class="demo-swatch__name">{{ label }}</span>
  <span class="demo-swatch__tag">{{ tag }}</span>
  <span class="demo-swatch__hex">{{ hex }}</span>
</div>
```

Add `@Input() tag = '';` and `@Input() hex = '';`.

Data array in `AppComponent` (exact order and values sourced from `src/theme/_variables.scss`):

```ts
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
```

Section markup:

```html
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
        [color]="token.tag === 'Text' && token.name !== 'text-inverse' ? 'var(--cba-bg-elevated)' : undefined" />
    }
  </div>
</demo-section>
```

### 7.5 Button section

Update `DemoButtonMatrixComponent` to show variants × surfaces × states.

Data model:

```ts
interface ButtonMatrixCell {
  readonly variant: CbaButtonVariant;
  readonly state: 'normal' | 'disabled' | 'loading';
  readonly surface: 'bg-secondary' | 'bg-elevated' | 'bg-primary';
}

interface ButtonMatrixRow {
  readonly surfaceTitle: string;
  readonly surfaceClass: string;
  readonly cells: ButtonMatrixCell[];
}
```

Render one block per surface. Inside each surface block, render three rows: normal, disabled, loading. Each row shows all five variants. Below each button show a caption with: button name, tag (variant class), status name, background name.

Example markup pattern:

```html
<div class="demo-matrix">
  @for (block of buttonBlocks; track block.surfaceTitle) {
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
              <span class="demo-matrix-cell__caption">{{ cell.variant }} · .cba-button--{{ cell.variant }} · {{ row.state }} · {{ block.surfaceTitle }}</span>
            </div>
          }
        </div>
      }
    </div>
  }
</div>
```

### 7.6 Pills section

Create `DemoPillMatrixComponent`.

Data model:

```ts
interface PillVariant {
  readonly name: string;
  readonly modifier: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
}

interface PillMatrixRow {
  readonly surfaceTitle: string;
  readonly surfaceClass: string;
  readonly state: 'normal' | 'disabled' | 'selected';
  readonly pills: PillVariant[];
}
```

Pill styles (demo-only, not library):

```scss
.demo-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--cba-font-size-small);
  border: 1px solid transparent;
}

.demo-pill--primary { background: var(--cba-accent-primary); color: var(--cba-text-inverse); }
.demo-pill--secondary { background: var(--cba-bg-elevated); color: var(--cba-text-primary); border-color: var(--cba-border-subtle); }
.demo-pill--ghost { background: transparent; color: var(--cba-text-primary); border-color: var(--cba-border-default); }
.demo-pill--danger { background: var(--cba-accent-danger); color: var(--cba-text-inverse); }
.demo-pill--success { background: var(--cba-accent-success); color: var(--cba-text-inverse); }
.demo-pill--selected { background: var(--cba-selected-bg); color: var(--cba-selected-text); border-color: var(--cba-selected-border); }
.demo-pill--disabled { opacity: 0.6; cursor: not-allowed; }
```

Render one block per surface, one row per state, each pill with caption: name, tag, status, background.

### 7.7 Button / pill sizes variants

Create a small inline section (no separate component required).

```html
<demo-section title="Button and pill sizes" caption="sm vs md size variants.">
  <div class="demo-size-row">
    <cba-button variant="primary" size="sm">Small button</cba-button>
    <cba-button variant="primary" size="md">Medium button</cba-button>
    <span class="demo-pill demo-pill--primary demo-pill--sm">Small pill</span>
    <span class="demo-pill demo-pill--primary demo-pill--md">Medium pill</span>
  </div>
</demo-section>
```

Add `.demo-pill--sm` and `.demo-pill--md` modifiers with reduced/increased padding.

### 7.8 Predefined icons

Create `DemoIconGridComponent`.

Icons to display (import each from `@fortawesome/free-solid-svg-icons` in `AppComponent` and pass to the component, or import directly inside the component):

- `faBell` — Notifications
- `faUser` — Profile
- `faGear` — Settings
- `faPlus` — Add
- `faRefresh` — Refresh
- `faDownload` — Download
- `faSearch` — Search
- `faCalendar` — Calendar
- `faPen` — Edit
- `faTrash` — Delete
- `faCheck` — Check
- `faCircleCheck` — Success
- `faTriangleExclamation` — Warning
- `faCircleXmark` — Error
- `faInbox` — Empty state

Render each as an icon-only ghost `<cba-button>` with `[iconOnly]="true"` and an English `aria-label`, with a text label below.

### 7.9 Texts, fonts, labels variants

Create `DemoTextShowcaseComponent`.

Render panels for each surface:

- `bg-secondary`
- `bg-elevated`
- `bg-primary`
- `bg-tertiary`

Inside each panel show:

1. Typography scale: `.cba-text-display`, `.cba-text-heading-lg`, `.cba-text-heading-md`, `.cba-text-body`, `.cba-text-small`, `.cba-text-caption`.
2. Text color variants allowed on that surface:
   - On `bg-secondary` and `bg-elevated`: `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`.
   - On `bg-primary` and `bg-tertiary`: `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-inverse` (muted is restricted).
3. Status text colors (only on panel/elevated): `.cba-state-valid-text` and `.cba-state-invalid-text`.

### 7.10 Complete table example

Create `DemoTableComponent` or render inline in `AppComponent`.

Table data:

```ts
protected readonly tableRows: TableRow[] = [
  { id: '20-12345678-9', document: '20-12345678-9', name: 'Comercial del Sur S.A.', debt: '$ 1,250,000', status: 'overdue', selected: true },
  { id: '27-99887766-5', document: '27-99887766-5', name: 'Distribuidora Norte', debt: '$ 480,000', status: 'current', selected: false },
  { id: '30-55443322-1', document: '30-55443322-1', name: 'Tecnología Andina', debt: '$ 0', status: 'settled', selected: false },
];
```

Markup:

```html
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
    @for (row of tableRows; track row.id) {
      <tr [class.demo-row--selected]="row.selected">
        <td>{{ row.document }}</td>
        <td>{{ row.name }}</td>
        <td>{{ row.debt }}</td>
        <td>
          @switch (row.status) {
            @case ('overdue') { <cba-badge variant="warning" appearance="solid">Overdue</cba-badge> }
            @case ('current') { <cba-badge variant="success" appearance="solid">Current</cba-badge> }
            @case ('settled') { <cba-badge variant="neutral" appearance="outline">Settled</cba-badge> }
          }
        </td>
      </tr>
    }
  </tbody>
</table>
```

Styling uses existing `.demo-table` classes. The selected row uses `.demo-row--selected`.

### 7.11 Navigation items example

Create `DemoNavItemsComponent`.

Data:

```ts
protected readonly navItems: NavItem[] = [
  { label: 'Customers', selected: true, disabled: false },
  { label: 'Invoices', selected: false, disabled: false },
  { label: 'Reports', selected: false, disabled: false },
  { label: 'Settings', selected: false, disabled: true },
];
```

Render as horizontal nav pills:

```html
<nav class="demo-nav" aria-label="Demo navigation">
  @for (item of navItems; track item.label) {
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
```

States:

- normal: `background: var(--cba-bg-secondary); border: 1px solid var(--cba-border-strong); color: var(--cba-text-secondary);`
- hover: `background: var(--cba-bg-secondary); background-image: linear-gradient(var(--cba-hover), var(--cba-hover)); color: var(--cba-text-primary);`
- selected: `background: var(--cba-selected-bg); border-color: var(--cba-selected-border); color: var(--cba-selected-text); font-weight: 600;`
- disabled: `background: var(--cba-state-disabled-bg); border-color: var(--cba-border-subtle); color: var(--cba-state-disabled-text); cursor: not-allowed;`

### 7.12 Inputs variants

Render real form controls inside surface cards.

Surfaces: `bg-secondary`, `bg-elevated`, `bg-primary`, `bg-tertiary`.

For each surface show:

- Default input
- Disabled input
- Readonly input
- Valid input
- Invalid input
- Select
- Datepicker

Use two-way binding where needed. Example:

```html
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
      <cba-datepicker label="Due date" hint="YYYY-MM-DD" [(ngModel)]="sampleDate" />
    </div>
  }
</div>
```

### 7.13 Form example

A complete form inside a `<cba-card>` or a `100%` demo module card.

Fields:

1. Customer name — `cba-input`, label "Customer name", hint "Full business name.", required error "Customer name is required."
2. Email — `cba-input`, type `email`, label "Email", hint "Billing contact email.", error "Enter a valid email."
3. Status — `cba-select`, label "Status", options: Active, Overdue, Settled.
4. Due date — `cba-datepicker`, label "Due date", hint "Pick a date."
5. Notes — `cba-input`, label "Notes", hint "Optional observations."

Actions:

- Submit: `<cba-button variant="primary" type="submit">Save</cba-button>`
- Cancel: `<cba-button variant="ghost">Cancel</cba-button>`

Use `FormsModule` with `ngModel` bindings on a `FormFieldModel` object. No real submission logic is required; handlers may be no-ops.

### 7.14 Footer bar

Render inside `<footer class="shell-footer">`.

Center a row of `<cba-button>` components:

```html
<footer class="shell-footer">
  <div class="shell-footer__actions">
    <cba-button variant="secondary" [icon]="faRefresh">Refresh</cba-button>
    <cba-button variant="primary" [icon]="faPlus">New</cba-button>
    <cba-button variant="ghost" [icon]="faDownload">Export</cba-button>
  </div>
</footer>
```

SCSS:

```scss
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

## 8. Global SCSS Notes

- All new layout classes live in `app.component.scss`.
- Keep component look-and-feel out of demo SCSS; library components own their tokens.
- Use `--cba-space-*` for gaps and `--cba-radius-*` for radii.
- Do not introduce arbitrary pixel values without a named SCSS variable.
- Existing named variables (`$preview-bar-padding`, `$search-width`, etc.) may be reused or renamed as needed.

## 9. Language Requirement

- Update `projects/demo/src/index.html` `<html lang="es">` to `<html lang="en">`.
- All labels, placeholders, hints, errors, button text, captions, table headers, nav labels, and footer text must be in English.
- Library-owned Spanish defaults (e.g. `CbaModuleFooter` status text, header action aria-labels) must be overridden with English text via component inputs (`statusText`, `aria-label`) where the demo exposes them.

## 10. Accessibility Considerations

- Use semantic landmarks: `<header>`, `<main>`, `<footer>`, `<section>`.
- Every icon-only button must have an explicit `aria-label` in English.
- The search input should remain accessible; use a visible label or an `aria-label="Search"` if the design keeps only a placeholder.
- Table headers must use `scope="col"`.
- Navigation items must use `aria-current="page"` for the selected item and `aria-disabled="true"` for disabled items.
- Color must not be the sole means of conveying status; pair badges/icons with text.
- Focus rings come from the library (`--cba-focus-ring`); do not override them.

## 11. Acceptance Criteria

- [ ] `index.html` has `lang="en"`.
- [ ] Header bar matches the exact left/center/right layout and English labels.
- [ ] Workspace section contains module examples in the exact row order and sizes specified.
- [ ] Collapsed modules with footer render the footer even when the body is hidden.
- [ ] Token grid displays swatch, name, category tag, and hex value for the listed tokens.
- [ ] Button section shows all five variants over all three surfaces in normal, disabled, and loading states with captions.
- [ ] Pills section shows matching variants/states/surfaces with captions.
- [ ] Button / pill sizes section shows `sm` and `md`.
- [ ] Icons section displays the fifteen predefined icons with English labels.
- [ ] Text/type section shows typography scale and allowed text colors per surface.
- [ ] Table example includes header, body, selected row, and status badges.
- [ ] Navigation items example shows normal, selected, hover, and disabled states.
- [ ] Inputs variants section places real controls over each surface.
- [ ] Form example uses inputs, select, datepicker, labels, hints, and errors.
- [ ] Footer bar is centered and uses English button labels.
- [ ] `npm run build:demo` passes after `npm run build:lib`.
- [ ] No Spanish text remains in `projects/demo/src/` UI strings.
