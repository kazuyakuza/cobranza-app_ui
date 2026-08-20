# Task 4 Code Simplification Suggestions

## Scope

Review the two files changed in Task 4 (`Demo Showcase Minor Fixes`) and propose simplifications only. Implementation is **not** part of this step.

Files reviewed:

- `projects/demo/src/app/app.component.scss`
- `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`

## Suggestions for `app.component.scss`

### 1. Inline single-use SCSS variables that only wrap theme tokens

The file header says SCSS variables should expose *pixel* values; variables that just alias a single theme token add indirection without value.

**Variables to inline (replace with their token values):**

| Variable | Current value | Used in |
|----------|---------------|---------|
| `$preview-bar-padding` | `var(--cba-space-2) var(--cba-space-3)` | `.preview-bar` |
| `$preview-bar-font-size` | `var(--cba-font-size-caption)` | `.preview-bar` |
| `$header-height` | `var(--cba-header-height)` | `.shell-header` |
| `$pill-sm-padding` | `2px 8px` | `.demo-pill--sm` |
| `$pill-md-padding` | `6px 16px` | `.demo-pill--md` |

**Variables to keep (multi-use or carry semantic pixel value):**

- `$search-max-width: 600px`
- `$swatch-grid-min: 140px`
- `$input-grid-min: 320px`
- `$pill-radius-pill: 999px`

After inlining, remove the unused variable declarations at the top of the file.

### 2. Merge identical grid declarations for `.demo-input-grid` and `.demo-form-grid`

Both rules currently duplicate:

```scss
display: grid;
grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
gap: var(--cba-space-3);
```

**Recommended change:** keep `.demo-input-grid` as the canonical rule and make `.demo-form-grid` extend/share it.

```scss
.demo-input-grid,
.demo-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
  gap: var(--cba-space-3);
}
```

This removes duplication and keeps the two layouts consistent.

### 3. Reduce repetition in `.demo-surface` modifiers with a CSS custom property

The modifiers only change `background`. Use a local custom property on the base block and set it per modifier.

```scss
.demo-surface {
  --surface-bg: var(--cba-bg-primary);

  padding: var(--cba-space-3);
  border-radius: var(--cba-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-2);
  background: var(--surface-bg);
}

.demo-surface--secondary { --surface-bg: var(--cba-bg-secondary); }
.demo-surface--elevated  { --surface-bg: var(--cba-bg-elevated); }
.demo-surface--primary   { --surface-bg: var(--cba-bg-primary); }
.demo-surface--tertiary  { --surface-bg: var(--cba-bg-tertiary); }
```

This removes repeated `background` declarations and makes the modifier rules single-line.

### 4. Reduce repetition in `.demo-pill` variant modifiers with a CSS custom property

Similar to `.demo-surface`, the variant modifiers repeat `background` and `color`. Consolidate them with local custom properties.

```scss
.demo-pill {
  --pill-bg: var(--cba-bg-tertiary);
  --pill-color: var(--cba-text-primary);
  --pill-border: transparent;

  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
  border-radius: $pill-radius-pill;
  font-size: var(--cba-font-size-small);
  border: 1px solid var(--pill-border);
  background: var(--pill-bg);
  color: var(--pill-color);
}

.demo-pill--primary   { --pill-bg: var(--cba-accent-primary); --pill-color: var(--cba-text-inverse); }
.demo-pill--secondary { --pill-bg: var(--cba-bg-elevated);    --pill-color: var(--cba-text-primary); --pill-border: var(--cba-border-subtle); }
.demo-pill--ghost     { --pill-bg: transparent;               --pill-color: var(--cba-text-primary); --pill-border: var(--cba-border-default); }
.demo-pill--danger    { --pill-bg: var(--cba-accent-danger);  --pill-color: var(--cba-text-inverse); }
.demo-pill--success   { --pill-bg: var(--cba-accent-success); --pill-color: var(--cba-text-inverse); }
```

This keeps the base rule as the single source of truth for layout and the modifiers focused only on what changes.

## Suggestions for `demo-icon-grid.component.ts`

### 5. Remove duplicated `ariaLabel` property from icon entries

Every entry has the same value for `label` and `ariaLabel`. Remove `ariaLabel` and bind `[attr.aria-label]` directly to `entry.label`.

**Interface change:**

```typescript
interface IconEntry {
  readonly icon: IconDefinition;
  readonly label: string;
}
```

**Template change:**

```html
<cba-button
  variant="ghost"
  [iconOnly]="true"
  [icon]="entry.icon"
  [attr.aria-label]="entry.label" />
```

### 6. Simplify icon array construction

With `ariaLabel` removed, each array item still repeats `label`. Add a small private factory function so the array only declares the icon and the label once.

```typescript
export class DemoIconGridComponent {
  private readonly icon = (icon: IconDefinition, label: string): IconEntry => ({ icon, label });

  protected readonly icons: IconEntry[] = [
    this.icon(faBell, 'Notifications'),
    this.icon(faUser, 'Profile'),
    this.icon(faGear, 'Settings'),
    this.icon(faPlus, 'Add'),
    this.icon(faRefresh, 'Refresh'),
    this.icon(faDownload, 'Download'),
    this.icon(faSearch, 'Search'),
    this.icon(faCalendar, 'Calendar'),
    this.icon(faPen, 'Edit'),
    this.icon(faTrash, 'Delete'),
    this.icon(faCheck, 'Check'),
    this.icon(faCircleCheck, 'Success'),
    this.icon(faTriangleExclamation, 'Warning'),
    this.icon(faCircleXmark, 'Error'),
    this.icon(faInbox, 'Empty state'),
    this.icon(faUpDownLeftRight, 'Drag'),
    this.icon(faArrowsLeftRight, 'Expand width'),
    this.icon(faArrowsLeftRightToLine, 'Shrink width'),
    this.icon(faChevronUp, 'Collapse'),
    this.icon(faChevronDown, 'Expand'),
    this.icon(faWindowMaximize, 'Fullscreen'),
    this.icon(faXmark, 'Close'),
    this.icon(faSpinner, 'Loading'),
  ];
}
```

This reduces visual noise and makes future additions a single-line change.

### 7. Preserve the `@for` `track` function

The current `@for (entry of icons; track entry.label)` is correct. Keep `entry.label` as the tracker after simplification because labels are unique and stable.

## Non-changes

The following are intentionally **not** suggested because they would expand scope or conflict with existing project conventions:

- Splitting `app.component.scss` into smaller files — out of scope for a bug-fix task.
- Replacing Font Awesome imports with a registry/dynamic import — unnecessary complexity for a demo-only component.
- Changing BEM naming — the existing naming is consistent with the rest of the demo app.

## Verification checklist for implementer

- [ ] `app.component.scss` still compiles without warnings.
- [ ] All demo surfaces render the same background colors.
- [ ] All demo pill variants render the same background, text, and border colors.
- [ ] `.demo-form-grid` still matches `.demo-input-grid` layout.
- [ ] `DemoIconGridComponent` template still renders every icon with a visible label and an `aria-label` attribute equal to the label text.
- [ ] The icon grid displays the same icons in the same order after removing `ariaLabel` and using the factory helper.
