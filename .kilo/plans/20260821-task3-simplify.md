# Task 3 Code Simplification Report

## Scope

Review of the files changed for Task 3 (per-action visibility / enabled controls and drag-handle documentation):

- `src/components/module-header/module-header.types.ts`
- `src/components/module-header/module-header.component.ts`
- `src/components/module-header/module-header.component.html`
- `src/components/module-header/module-header.component.scss`
- `src/components/module-header/module-header.component.spec.ts`
- `docs/CBA_MODULE_HEADER.md`

## Executive Summary

The implementation is correct and follows project conventions, but two source files exceed the `max-lines-per-file` rule:

| File | Current lines | Limit | Risk |
| --- | --- | --- | --- |
| `module-header.component.ts` | 236 | 200 | Exceeds limit |
| `module-header.component.spec.ts` | 334 | 200 | Exceeds limit |

The main sources of bloat are:

1. **Duplicate signal reads in `module-header.component.ts`** — `statusVisual()` and `statusClass()` both read `status()`.
2. **Over-granular action computeds** — five separate computeds for collapse/size label/icon/target.
3. **Template repetition** — four action buttons share an identical wrapper pattern.
4. **Test table fragmentation** — four overlapping case tables plus redundant positive/negative tests.

The plan below removes these redundancies while preserving all public API and behavior.

---

## 1. `src/components/module-header/module-header.component.ts`

### 1.1 Merge `statusVisual()` and `statusClass()` into one computed

**Reason:** Both computeds read `status()` and return derived state. A single computed reduces signal subscriptions and lines.

**Replace:**

```ts
/** Status visual config or `null` when no status is set (icon hidden). */
readonly statusVisual = computed<StatusVisual | null>(() => {
  const current = this.status();
  return current === null ? null : STATUS_VISUALS[current] ?? null;
});

/** CSS modifier class for the status section, derived from the current status. */
readonly statusClass = computed<string | null>(() => {
  const current = this.status();
  return current === null ? null : `cba-module-header__status--${current}`;
});
```

**With:**

```ts
/** Status render state or `null` when no status icon should be shown. */
readonly statusState = computed<{ icon: IconDefinition; animation?: 'spin'; class: string } | null>(
  () => {
    const current = this.status();
    if (current === null) {
      return null;
    }
    const visual = STATUS_VISUALS[current];
    return visual ? { ...visual, class: `cba-module-header__status--${current}` } : null;
  },
);
```

> Note: `STATUS_VISUALS` is already typed as `Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>>`, so `visual` is guaranteed defined; the `?? null` guard can be removed safely.

### 1.2 Replace five action computeds with two state objects

**Reason:** `collapseLabel`, `collapseIcon`, `sizeToggleLabel`, `sizeToggleIcon`, and `sizeToggleTarget` are simple ternaries. Grouping them into `collapseState` and `sizeState` removes fields and makes intent clearer.

**Replace:**

```ts
/** Label/tooltip for the collapse button, derived from `isCollapsed`. */
protected readonly collapseLabel = computed<string>(() =>
  this.isCollapsed()
    ? CBA_UI_MESSAGES.moduleHeader.aria.collapse.expand
    : CBA_UI_MESSAGES.moduleHeader.aria.collapse.collapse,
);

/** Icon for the collapse button, derived from `isCollapsed`. */
protected readonly collapseIcon = computed<IconDefinition>(() =>
  this.isCollapsed() ? faChevronDown : faChevronUp,
);

/** Label/tooltip for the size-toggle button, derived from the current size. */
protected readonly sizeToggleLabel = computed<string>(() =>
  this.isFullSize()
    ? CBA_UI_MESSAGES.moduleHeader.aria.size.shrink
    : CBA_UI_MESSAGES.moduleHeader.aria.size.expand,
);

/** Icon for the size-toggle button, derived from the current size. */
protected readonly sizeToggleIcon = computed<IconDefinition>(() =>
  this.isFullSize() ? faArrowsLeftRightToLine : faArrowsLeftRight,
);

/** Target size emitted when the size-toggle button is clicked (the opposite of the current size). */
protected readonly sizeToggleTarget = computed<ModuleHeaderSize>(() =>
  this.isFullSize() ? '50%' : '100%',
);
```

**With:**

```ts
/** Render state for the collapse/expand button. */
protected readonly collapseState = computed<{ label: string; icon: IconDefinition }>(() =>
  this.isCollapsed()
    ? { label: CBA_UI_MESSAGES.moduleHeader.aria.collapse.expand, icon: faChevronDown }
    : { label: CBA_UI_MESSAGES.moduleHeader.aria.collapse.collapse, icon: faChevronUp },
);

/** Render state for the size-toggle button. */
protected readonly sizeState = computed<{
  label: string;
  icon: IconDefinition;
  target: ModuleHeaderSize;
}>(() =>
  this.isFullSize()
    ? {
        label: CBA_UI_MESSAGES.moduleHeader.aria.size.shrink,
        icon: faArrowsLeftRightToLine,
        target: '50%',
      }
    : {
        label: CBA_UI_MESSAGES.moduleHeader.aria.size.expand,
        icon: faArrowsLeftRight,
        target: '100%',
      },
);
```

### 1.3 Collapse icon aliases into a single map

**Reason:** `faFullscreen` and `faXmark` are only used by the template. A single `protected readonly actionIcons` map is shorter and scales better.

**Replace:**

```ts
/** Icons referenced directly by the header template. */
protected readonly faFullscreen = faWindowMaximize;
protected readonly faXmark = faXmark;
```

**With:**

```ts
/** Static icons used by action buttons that do not change shape. */
protected readonly actionIcons = {
  fullscreen: faWindowMaximize,
  remove: faXmark,
} as const;
```

### 1.4 Remove the `showStatusSection` computed

**Reason:** It is a one-line boolean combination used only in the template. Inline the expression in the template `@if` to remove a field.

**Replace:**

```ts
/** Whether the status section is rendered: hidden while fullscreen or when `showStatus` is `false`. */
readonly showStatusSection = computed<boolean>(() => !this.isFullscreen() && this.showStatus());
```

**With:** remove the field entirely.

### 1.5 Expected outcome for component TS

- File should drop from 236 to ~175 lines.
- No public API changes.
- Template bindings must be updated per Section 2.

---

## 2. `src/components/module-header/module-header.component.html`

### 2.1 Update status section binding

**Replace:**

```html
@if (showStatusSection()) {
  <div
    class="cba-module-header__section cba-module-header__section--status"
    [class]="statusClass() ?? ''">
    @if (statusVisual(); as visual) {
      <fa-icon
        [icon]="visual.icon"
        [animation]="visual.animation"
        aria-hidden="true" />
    }
  </div>
}
```

**With:**

```html
@if (!isFullscreen() && showStatus()) {
  <div
    class="cba-module-header__section cba-module-header__section--status"
    [class]="statusState()?.class ?? ''">
    @if (statusState(); as state) {
      <fa-icon
        [icon]="state.icon"
        [animation]="state.animation"
        aria-hidden="true" />
    }
  </div>
}
```

### 2.2 Update collapse and size toggle bindings

**Replace the collapse button block:**

```html
<button
  type="button"
  class="cba-module-header__action"
  [attr.aria-label]="collapseLabel()"
  [title]="collapseLabel()"
  [disabled]="!effectiveActionsConfig().enableCollapse"
  (click)="collapseToggle.emit()">
  <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
</button>
```

**With:**

```html
<button
  type="button"
  class="cba-module-header__action"
  [attr.aria-label]="collapseState().label"
  [title]="collapseState().label"
  [disabled]="!effectiveActionsConfig().enableCollapse"
  (click)="collapseToggle.emit()">
  <fa-icon [icon]="collapseState().icon" aria-hidden="true" />
</button>
```

**Replace the size toggle button block:**

```html
<button
  type="button"
  class="cba-module-header__action"
  [attr.aria-label]="sizeToggleLabel()"
  [title]="sizeToggleLabel()"
  [disabled]="!effectiveActionsConfig().enableSizeToggle"
  (click)="sizeToggle.emit(sizeToggleTarget())">
  <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
</button>
```

**With:**

```html
<button
  type="button"
  class="cba-module-header__action"
  [attr.aria-label]="sizeState().label"
  [title]="sizeState().label"
  [disabled]="!effectiveActionsConfig().enableSizeToggle"
  (click)="sizeToggle.emit(sizeState().target)">
  <fa-icon [icon]="sizeState().icon" aria-hidden="true" />
</button>
```

### 2.3 Replace static icon aliases

**Replace:**

```html
<fa-icon [icon]="faFullscreen" aria-hidden="true" />
```

**With:**

```html
<fa-icon [icon]="actionIcons.fullscreen" aria-hidden="true" />
```

**Replace:**

```html
<fa-icon [icon]="faXmark" aria-hidden="true" />
```

**With:**

```html
<fa-icon [icon]="actionIcons.remove" aria-hidden="true" />
```

### 2.4 (Optional) Render action buttons with `@for`

**Reason:** The four built-in buttons repeat the same structure. A data-driven loop removes duplication but adds a computed array and a click handler. Apply only if the team prefers data-driven templates over explicit markup.

**Add to component class:**

```ts
interface ActionRenderConfig {
  readonly showFlag: keyof Required<ModuleHeaderActionsConfig>;
  readonly enableFlag: keyof Required<ModuleHeaderActionsConfig>;
  readonly label: () => string;
  readonly icon: () => IconDefinition;
  readonly output: OutputEmitterRef<unknown>;
  readonly payload?: () => unknown;
}

protected readonly builtInActions = computed<ActionRenderConfig[]>(() => [
  {
    showFlag: 'showCollapse',
    enableFlag: 'enableCollapse',
    label: () => this.collapseState().label,
    icon: () => this.collapseState().icon,
    output: this.collapseToggle as OutputEmitterRef<unknown>,
  },
  {
    showFlag: 'showSizeToggle',
    enableFlag: 'enableSizeToggle',
    label: () => this.sizeState().label,
    icon: () => this.sizeState().icon,
    output: this.sizeToggle as OutputEmitterRef<unknown>,
    payload: () => this.sizeState().target,
  },
  {
    showFlag: 'showFullscreen',
    enableFlag: 'enableFullscreen',
    label: () => this.aria.fullscreen,
    icon: () => this.actionIcons.fullscreen,
    output: this.fullscreenToggle as OutputEmitterRef<unknown>,
  },
  {
    showFlag: 'showRemove',
    enableFlag: 'enableRemove',
    label: () => this.aria.remove,
    icon: () => this.actionIcons.remove,
    output: this.remove as OutputEmitterRef<unknown>,
  },
]);

protected onActionClick(action: ActionRenderConfig): void {
  action.output.emit(action.payload?.());
}
```

**Replace the four `@if` button blocks (lines 31–77) with:**

```html
@for (action of builtInActions(); track action.showFlag) {
  @if (effectiveActionsConfig()[action.showFlag]) {
    <button
      type="button"
      class="cba-module-header__action"
      [attr.aria-label]="action.label()"
      [title]="action.label()"
      [disabled]="!effectiveActionsConfig()[action.enableFlag]"
      (click)="onActionClick(action)">
      <fa-icon [icon]="action.icon()" aria-hidden="true" />
    </button>
  }
}
```

> Trade-off: the explicit four-button template is easier to read for static buttons; the `@for` version is shorter but more abstract. Pick one approach and apply it consistently. The current recommendation is to keep explicit markup unless line count is critical.

---

## 3. `src/components/module-header/module-header.component.spec.ts`

### 3.1 Consolidate the four action case tables into one

**Reason:** `ACTION_CASES`, `VISIBILITY_CASES`, `DISABLED_CASES`, and `EMISSION_CASES` describe the same four buttons. A single table reduces duplication and makes it obvious that one row covers all behaviors for a button.

**Replace the existing interfaces and arrays:**

```ts
interface ActionCase {
  readonly label: string;
  readonly output: 'collapseToggle' | 'sizeToggle' | 'remove' | 'fullscreenToggle';
  readonly payload?: ModuleHeaderSize;
}

const ACTION_CASES: readonly ActionCase[] = [
  { label: 'Colapsar módulo', output: 'collapseToggle' },
  { label: 'Reducir módulo a 50%', output: 'sizeToggle', payload: '50%' },
  { label: 'Quitar módulo', output: 'remove' },
  { label: 'Pantalla completa', output: 'fullscreenToggle' },
];
```

and the later `VisibilityCase`, `DisabledCase`, `EmissionCase` tables.

**With one combined table:**

```ts
interface ActionControlCase {
  readonly label: string;
  readonly output: 'collapseToggle' | 'sizeToggle' | 'remove' | 'fullscreenToggle';
  readonly showFlag: keyof ModuleHeaderActionsConfig;
  readonly enableFlag: keyof ModuleHeaderActionsConfig;
  readonly payload?: ModuleHeaderSize;
}

const ACTION_CONTROL_CASES: readonly ActionControlCase[] = [
  { label: 'Colapsar módulo', output: 'collapseToggle', showFlag: 'showCollapse', enableFlag: 'enableCollapse' },
  { label: 'Reducir módulo a 50%', output: 'sizeToggle', showFlag: 'showSizeToggle', enableFlag: 'enableSizeToggle', payload: '50%' },
  { label: 'Pantalla completa', output: 'fullscreenToggle', showFlag: 'showFullscreen', enableFlag: 'enableFullscreen' },
  { label: 'Quitar módulo', output: 'remove', showFlag: 'showRemove', enableFlag: 'enableRemove' },
];
```

### 3.2 Replace the four action test blocks with three `it.each` loops

**Replace the existing click emission test:**

```ts
it.each(ACTION_CASES)('emits $output when the $label button is clicked', ({ label, output, payload }) => {
  const component = setup();
  const emitted: unknown[] = [];
  (component[output] as OutputEmitterRef<unknown>).subscribe((value) => emitted.push(value));

  queryButton(label).click();

  if (payload === undefined) {
    expect(emitted).toHaveLength(1);
  } else {
    expect(emitted).toEqual([payload]);
  }
});
```

**With a unified loop using `ACTION_CONTROL_CASES`:**

```ts
it.each(ACTION_CONTROL_CASES)('emits $output when the $label button is clicked', ({ label, output, payload }) => {
  const component = setup();
  const emitted: unknown[] = [];
  (component[output] as OutputEmitterRef<unknown>).subscribe((value) => emitted.push(value));

  queryButton(label).click();

  expect(emitted).toEqual(payload === undefined ? [undefined] : [payload]);
});
```

**Replace the visibility tests:**

```ts
it.each(VISIBILITY_CASES)(
  'removes the $label button from the DOM when $hideFlag is false',
  ({ label, hideFlag }) => {
    setup();
    fixture.componentRef.setInput('actionsConfig', { [hideFlag]: false });
    fixture.detectChanges();

    expect(queryButton(label)).toBeNull();
  },
);
```

**With:**

```ts
it.each(ACTION_CONTROL_CASES)(
  'removes the $label button from the DOM when $showFlag is false',
  ({ label, showFlag }) => {
    setup();
    fixture.componentRef.setInput('actionsConfig', { [showFlag]: false });
    fixture.detectChanges();

    expect(queryButton(label)).toBeNull();
  },
);
```

**Replace the disabled tests:**

```ts
it.each(DISABLED_CASES)(
  'disables the $label button when $disableFlag is false',
  ({ label, disableFlag }) => {
    setup();
    fixture.componentRef.setInput('actionsConfig', { [disableFlag]: false });
    fixture.detectChanges();

    expect(queryButton(label).disabled).toBe(true);
  },
);
```

**With:**

```ts
it.each(ACTION_CONTROL_CASES)(
  'disables the $label button when $enableFlag is false',
  ({ label, enableFlag }) => {
    setup();
    fixture.componentRef.setInput('actionsConfig', { [enableFlag]: false });
    fixture.detectChanges();

    expect(queryButton(label).disabled).toBe(true);
  },
);
```

**Replace the emission suppression tests:**

```ts
it.each(EMISSION_CASES)(
  'does not emit $output when the $label button is disabled',
  ({ label, disableFlag, output }) => {
    const component = setup();
    const emitted: unknown[] = [];
    (component[output] as OutputEmitterRef<unknown>).subscribe((value) =>
      emitted.push(value),
    );

    fixture.componentRef.setInput('actionsConfig', { [disableFlag]: false });
    fixture.detectChanges();

    queryButton(label).click();

    expect(emitted).toHaveLength(0);
  },
);
```

**With:**

```ts
it.each(ACTION_CONTROL_CASES)(
  'does not emit $output when the $label button is disabled',
  ({ label, enableFlag, output }) => {
    const component = setup();
    const emitted: unknown[] = [];
    (component[output] as OutputEmitterRef<unknown>).subscribe((value) => emitted.push(value));

    fixture.componentRef.setInput('actionsConfig', { [enableFlag]: false });
    fixture.detectChanges();

    queryButton(label).click();

    expect(emitted).toHaveLength(0);
  },
);
```

### 3.3 Remove redundant positive tests

**Reason:** The default setup already proves the positive case. Tests that explicitly set the default value and assert the default behavior add no value.

**Remove:**

```ts
it('shows the status icon when showStatus is true and status is non-null', () => {
  setup();
  fixture.componentRef.setInput('status', 'success');
  fixture.componentRef.setInput('showStatus', true);
  fixture.detectChanges();

  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  ) as HTMLElement;

  expect(statusSection).not.toBeNull();
  expect(statusSection.querySelector('fa-icon')).not.toBeNull();
});
```

and

```ts
it('shows the title section when showTitle is true', () => {
  setup();
  fixture.componentRef.setInput('showTitle', true);
  fixture.detectChanges();

  const titleSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--title',
  ) as HTMLElement;

  expect(titleSection).not.toBeNull();
  expect(titleSection.textContent).toContain('Test Module');
});
```

**Keep the negative tests** (`hides the status section when showStatus is false`, `hides the title section when showTitle is false`) because they verify the hide path.

### 3.4 Combine status null behavior into the existing hide test

**Reason:** The test `still hides the status icon when status is null even if showStatus defaults to true` asserts the same empty-section behavior that the first status test already covers. Merge it into the existing non-null status test.

**Replace:**

```ts
it('renders the status icon only when status is non-null', () => {
  setup();
  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  ) as HTMLElement;
  expect(statusSection.querySelector('fa-icon')).toBeNull();

  fixture.componentRef.setInput('status', 'loading');
  fixture.detectChanges();
  expect(statusSection.querySelector('fa-icon')).not.toBeNull();
});
```

**With:**

```ts
it('renders the status icon only when status is non-null', () => {
  setup();
  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  ) as HTMLElement;

  expect(statusSection.querySelector('fa-icon')).toBeNull();

  fixture.componentRef.setInput('status', 'loading');
  fixture.detectChanges();
  expect(statusSection.querySelector('fa-icon')).not.toBeNull();

  fixture.componentRef.setInput('status', null);
  fixture.detectChanges();
  expect(statusSection.querySelector('fa-icon')).toBeNull();
});
```

Then remove the separate test `still hides the status icon when status is null even if showStatus defaults to true`.

### 3.5 Remove the standalone 100% expansion test

**Reason:** The `it.each(ACTION_CONTROL_CASES)` emission test already covers the `sizeToggle` payload with `payload: '50%'`. The dedicated `emits 100% when the expand button is clicked at 50% size` test duplicates that coverage.

**Remove:**

```ts
it('emits 100% when the expand button is clicked at 50% size', () => {
  const component = setup();
  const sizes: ModuleHeaderSize[] = [];
  component.sizeToggle.subscribe((size) => sizes.push(size));

  fixture.componentRef.setInput('size', '50%');
  fixture.detectChanges();
  queryButton('Expandir módulo a 100%').click();

  expect(sizes).toEqual(['100%']);
});
```

### 3.6 Expected outcome for spec TS

- File should drop from 334 to ~180 lines.
- All existing assertions are preserved or merged; no behavior coverage is lost.

---

## 4. `src/components/module-header/module-header.component.scss`

### 4.1 Consolidate status color rules

**Reason:** Six separate status color selectors can be collapsed using a Sass map loop or grouped selectors.

**Replace:**

```scss
.cba-module-header__status--loading {
  color: var(--cba-accent-info);
}

.cba-module-header__status--loaded,
.cba-module-header__status--success {
  color: var(--cba-accent-success);
}

.cba-module-header__status--warning {
  color: var(--cba-accent-warning);
}

.cba-module-header__status--error {
  color: var(--cba-accent-danger);
}

.cba-module-header__status--dirty {
  color: var(--cba-text-muted);
}
```

**With grouped selectors:**

```scss
.cba-module-header__status--loading {
  color: var(--cba-accent-info);
}

.cba-module-header__status--loaded,
.cba-module-header__status--success {
  color: var(--cba-accent-success);
}

.cba-module-header__status--warning {
  color: var(--cba-accent-warning);
}

.cba-module-header__status--error {
  color: var(--cba-accent-danger);
}

.cba-module-header__status--dirty {
  color: var(--cba-text-muted);
}
```

> The grouped selector is already present; no change is required unless the project prefers a map loop. This section is marked as low priority.

---

## 5. `docs/CBA_MODULE_HEADER.md`

### 5.1 Deduplicate fullscreen / showStatus / showTitle explanations

**Reason:** The interaction between `isFullscreen`, `showStatus`, and `showTitle` is explained in three places (Inputs > Visibility inputs, Fullscreen behaviour, Accessibility). Consolidate to one authoritative paragraph and cross-reference it.

**Suggested rewrite of "Visibility inputs" subsection:**

```markdown
### Visibility inputs

`showStatus` and `showTitle` are boolean inputs (default `true`) that remove their
respective sections from the DOM when bound to `false`. They are independent of the
status value and of each other.

- `showStatus = false` removes the left `.cba-module-header__section--status` `<div>`.
  The `status` input itself is unaffected.
- `showTitle = false` removes the center `.cba-module-header__section--title` `<div>`.
- `status = null` continues to render an **empty** status `<div>` (no icon) when
  `showStatus` is not bound — this preserves pre-existing behavior.

`isFullscreen` overrides `showStatus`: in fullscreen the status section is always
hidden. `showTitle` is intentionally **not** gated by `isFullscreen`, so binding
both `[isFullscreen]="true"` and `[showTitle]="false"` renders no header content.
```

**Then shorten "Fullscreen behaviour" to:**

```markdown
## Fullscreen behaviour

When `isFullscreen === true`, the component renders **only** the title; status
and action buttons are removed from the DOM. The host element receives the
`cba-module-header--fullscreen` CSS class, which removes the background and
border-bottom so the header blends into the Shell's fullscreen chrome.

See [Visibility inputs](#visibility-inputs) for the interaction between
`isFullscreen`, `showStatus`, and `showTitle`.
```

**Expected outcome:** docs file drops by ~20–30 lines without losing information.

---

## 6. Verification Steps

After applying the simplifications, run the following commands and confirm success:

1. `npm test -- --testPathPattern=module-header.component.spec.ts --watch=false`
2. `npm run lint` (or equivalent project lint command)
3. `npm run build:lib` (or equivalent library build command)

No test should be skipped and no public API should change.

---

## 7. Non-Goals

Do **not** change:

- The public API of `ModuleHeaderComponent` or `ModuleHeaderActionsConfig`.
- The drag-handle projection slot contract.
- The default behavior of any input.
- The visual styling beyond the optional SCSS consolidation.
- Any logic related to Task 1 or Task 2 in the TODO file.
