# Simplification Plan — Update Demo App (Task 1)

**Scope:** `projects/demo/src/app/` files created or modified for the demo update task.

**Outcome:** Multiple simplification opportunities found. This plan is **required** because `app.component.html` violates the `max-lines-per-file` rule (241 lines; limit is 200) and several styles/data patterns are duplicated across components.

## Findings Summary

| # | Finding | Severity | Files Affected |
|---|---------|----------|----------------|
| 1 | `app.component.html` exceeds 200-line file limit (241 lines). | Required | `app.component.html` |
| 2 | Inline `styles` strings in 7 components bloat TypeScript files and prevent style reuse. | High | `demo-button-matrix`, `demo-pill-matrix`, `demo-icon-grid`, `demo-text-showcase`, `demo-table`, `demo-nav-items`, `demo-module-card` |
| 3 | `.demo-surface` + surface modifier classes duplicated in 4 files. | High | `app.component.scss`, `demo-button-matrix`, `demo-pill-matrix`, `demo-text-showcase` |
| 4 | `.demo-matrix`, `.demo-matrix-row`, `.demo-matrix-cell`, caption styles duplicated between button and pill matrices. | High | `demo-button-matrix`, `demo-pill-matrix` |
| 5 | `.demo-pill` base/primary/size styles duplicated between app and pill matrix. | Medium | `app.component.scss`, `demo-pill-matrix` |
| 6 | `colorTokens` array repeats `variable: 'var(--cba-<name>)'` for every entry. | Medium | `app.component.ts` |
| 7 | Status `<option>` list duplicated in inputs section and form section. | Low | `app.component.html` |
| 8 | `inputSurfaces` in `app.component.ts` and surface blocks in `demo-text-showcase` repeat similar surface title/class mappings. | Low | `app.component.ts`, `demo-text-showcase` |

**No unused imports found.**  
**No methods exceed 50 lines.**  
**No nesting exceeds 2 levels.**

---

## Step 1 — Move Inline Component Styles to SCSS Files

Convert every component that currently uses an inline `styles:` string to a separate `.scss` file referenced via `styleUrl`. This reduces TypeScript file size, improves syntax highlighting, and enables shared SCSS partials in later steps.

### Components to update

1. `demo-button-matrix.component.ts`
2. `demo-pill-matrix.component.ts`
3. `demo-icon-grid.component.ts`
4. `demo-text-showcase.component.ts`
5. `demo-table.component.ts`
6. `demo-nav-items.component.ts`
7. `demo-module-card.component.ts`

### Instructions

For each component:

1. Create a new file named `<component-name>.component.scss` in the same folder.
2. Copy the entire contents of the existing `styles:` string into the new file. Remove the leading indentation and backticks.
3. Replace the `styles: \`...\`` property in the `@Component` decorator with `styleUrl: './<component-name>.component.scss'`.
4. Verify the component still builds (`ng build demo`).

### Example for `demo-table.component.ts`

Before:

```ts
styles: `
  :host {
    display: block;
  }
  .demo-table {
    ...
  }
`
```

After:

```ts
styleUrl: './demo-table.component.scss'
```

New file `demo-table.component.scss`:

```scss
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
```

---

## Step 2 — Create Shared SCSS Partials

Create two shared SCSS partials under `projects/demo/src/app/styles/` and import them where needed.

### 2.1 `_demo-surface.scss`

Create `projects/demo/src/app/styles/_demo-surface.scss`:

```scss
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

.demo-surface--tertiary {
  background: var(--cba-bg-tertiary);
}
```

**Import in:**
- `app.component.scss`
- `demo-button-matrix.component.scss`
- `demo-pill-matrix.component.scss`
- `demo-text-showcase.component.scss`

Use `@use 'styles/demo-surface';` at the top of each file. Then remove the duplicated `.demo-surface` and modifier class definitions from those files.

### 2.2 `_demo-matrix.scss`

Create `projects/demo/src/app/styles/_demo-matrix.scss`:

```scss
.demo-matrix {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
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
```

**Import in:**
- `demo-button-matrix.component.scss`
- `demo-pill-matrix.component.scss`

Then remove the duplicated matrix styles from both components.

---

## Step 3 — Create Shared `_demo-pill.scss` Partial

Create `projects/demo/src/app/styles/_demo-pill.scss` with the complete pill styles currently defined in `demo-pill-matrix.component.scss`:

```scss
.demo-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
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

.demo-pill--sm {
  padding: 2px 8px;
}

.demo-pill--md {
  padding: 6px 16px;
}
```

**Import in:**
- `app.component.scss`
- `demo-pill-matrix.component.scss`

Then remove all `.demo-pill*` rules from `app.component.scss` and from `demo-pill-matrix.component.scss`.

---

## Step 4 — Reduce `app.component.html` Below 200 Lines

`app.component.html` is 241 lines. Extract the workspace module-examples section into a new presentational component.

### 4.1 Create `demo-workspace.component.ts`

Create `projects/demo/src/app/components/demo-workspace/demo-workspace.component.ts`:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faDownload, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent } from '@cobranza-apps/ui';
import { DemoModuleCardComponent } from '../demo-module-card/demo-module-card.component';
import { DemoTableComponent } from '../demo-table/demo-table.component';

@Component({
  selector: 'demo-workspace',
  standalone: true,
  imports: [
    CbaButtonComponent,
    DemoModuleCardComponent,
    DemoTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-workspace.component.html',
  styleUrl: './demo-workspace.component.scss',
})
export class DemoWorkspaceComponent {
  protected readonly faPlus = faPlus;
  protected readonly faRefresh = faRefresh;
  protected readonly faDownload = faDownload;
}
```

### 4.2 Create `demo-workspace.component.html`

Move the entire `<main class="workspace">...</main>` block from `app.component.html` into this template unchanged.

### 4.3 Create `demo-workspace.component.scss`

Move the `.workspace`, `.workspace__row`, `.workspace__row--single-50`, and `.demo-actions` rules from `app.component.scss` into this file unchanged.

### 4.4 Update `app.component.ts`

1. Remove the icon imports that are only used by the workspace: `faPlus`, `faRefresh`, `faDownload`.
2. Remove `DemoModuleCardComponent` and `DemoTableComponent` from the `imports` array.
3. Add `DemoWorkspaceComponent` to the `imports` array.

### 4.5 Update `app.component.html`

Replace the `<main class="workspace">...</main>` block with:

```html
<demo-workspace />
```

### 4.6 Update `app.component.scss`

Remove the `.workspace`, `.workspace__row`, `.workspace__row--single-50`, and `.demo-actions` rules.

---

## Step 5 — Generate `colorTokens` from Compact Config

In `app.component.ts`, replace the full `colorTokens` array with a smaller source array and a `map` call.

### Before

```ts
protected readonly colorTokens: ColorToken[] = [
  { name: 'bg-primary', tag: 'Background', hex: '#BCB5A4', variable: 'var(--cba-bg-primary)' },
  ...
];
```

### After

```ts
private readonly COLOR_TOKEN_SOURCE: readonly { readonly name: string; readonly tag: string; readonly hex: string }[] = [
  { name: 'bg-primary', tag: 'Background', hex: '#BCB5A4' },
  { name: 'bg-secondary', tag: 'Background', hex: '#F2F0E8' },
  { name: 'bg-tertiary', tag: 'Background', hex: '#D8C3A5' },
  { name: 'bg-elevated', tag: 'Background', hex: '#FDFCF8' },
  { name: 'text-primary', tag: 'Text', hex: '#2B2620' },
  { name: 'text-secondary', tag: 'Text', hex: '#4A4640' },
  { name: 'text-muted', tag: 'Text', hex: '#625C55' },
  { name: 'text-inverse', tag: 'Text', hex: '#FDFCF8' },
  { name: 'border-subtle', tag: 'Border', hex: '#E8E5DB' },
  { name: 'border-default', tag: 'Border', hex: '#A29D94' },
  { name: 'border-strong', tag: 'Border', hex: '#6B665E' },
  { name: 'accent-primary', tag: 'Accent', hex: '#6B5B4F' },
  { name: 'accent-success', tag: 'Accent', hex: '#3E6B4F' },
  { name: 'accent-warning', tag: 'Accent', hex: '#E98074' },
  { name: 'accent-danger', tag: 'Accent', hex: '#B93E36' },
  { name: 'accent-info', tag: 'Accent', hex: '#56717E' },
  { name: 'selected-bg', tag: 'Selected', hex: '#E4DDD0' },
  { name: 'selected-text', tag: 'Selected', hex: '#2B2620' },
  { name: 'state-valid-border', tag: 'Form state', hex: '#3E6B4F' },
  { name: 'state-invalid-border', tag: 'Form state', hex: '#B93E36' },
];

protected readonly colorTokens: ColorToken[] = this.COLOR_TOKEN_SOURCE.map((token) => ({
  ...token,
  variable: `var(--cba-${token.name})`,
}));
```

The `ColorToken` interface stays unchanged.

---

## Step 6 — Extract Repeating Select Options

In `app.component.ts`, add:

```ts
protected readonly statusOptions: readonly { readonly value: string; readonly label: string }[] = [
  { value: '', label: 'Choose…' },
  { value: 'active', label: 'Active' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'settled', label: 'Settled' },
];
```

In `app.component.html`, replace the duplicated `<option>` blocks inside both `<cba-select>` elements with:

```html
@for (option of statusOptions; track option.value) {
  <option [value]="option.value">{{ option.label }}</option>
}
```

Apply this in both the "Inputs" section and the "Form example" section.

---

## Step 7 — Optional: Share Surface Title/Class Mapping

`inputSurfaces` in `app.component.ts` and the panel class names in `demo-text-showcase` repeat the same surface title-to-class mapping. If desired, define a shared constant in a new file `projects/demo/src/app/shared/demo-surfaces.ts`:

```ts
export interface DemoSurface {
  readonly title: string;
  readonly className: string;
}

export const DEMO_SURFACES: readonly DemoSurface[] = [
  { title: 'bg-secondary', className: 'demo-surface--secondary' },
  { title: 'bg-elevated', className: 'demo-surface--elevated' },
  { title: 'bg-primary', className: 'demo-surface--primary' },
  { title: 'bg-tertiary', className: 'demo-surface--tertiary' },
];
```

Then import and reuse in both `app.component.ts` and `demo-text-showcase.component.ts`.

**Note:** This is optional because the current duplication is small and the surfaces serve slightly different purposes. Implement only if time permits.

---

## Verification Checklist

After applying the plan:

- [ ] `ng build demo` succeeds with no errors.
- [ ] `app.component.html` is at or below 200 lines.
- [ ] All source files under `projects/demo/src/app/` are at or below 200 lines.
- [ ] No method exceeds 50 lines.
- [ ] No block nesting exceeds 2 levels.
- [ ] Visual output matches the previous version exactly (section order, labels, colors, spacing).
- [ ] No library source code (`src/components/`, `src/theme/`) was modified.
- [ ] No TODO sections were removed.

## Files to Create

- `projects/demo/src/app/styles/_demo-surface.scss`
- `projects/demo/src/app/styles/_demo-matrix.scss`
- `projects/demo/src/app/styles/_demo-pill.scss`
- `projects/demo/src/app/components/demo-workspace/demo-workspace.component.ts`
- `projects/demo/src/app/components/demo-workspace/demo-workspace.component.html`
- `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`
- New `.scss` files for components moving from inline `styles:` (Step 1)

## Files to Modify

- `projects/demo/src/app/app.component.ts`
- `projects/demo/src/app/app.component.html`
- `projects/demo/src/app/app.component.scss`
- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
- `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts`
- `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`
- `projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.ts`
- `projects/demo/src/app/components/demo-table/demo-table.component.ts`
- `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts`
- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
