# Front-end Technical Specification — Module Header Per-Action Controls

## Scope

Add explicit visibility and enabled/disabled controls for each built-in action button in `ModuleHeaderComponent`:

- Collapse / expand
- Size toggle (50% ↔ 100%)
- Fullscreen
- Remove

The drag handle remains consumer-controlled via the existing `[cbaModuleDragHandle]` projection slot and is out of scope for these controls.

- **TODO reference**: `.agent/todos/20260821/20260821-todo-0.md` — *Add per-action visibility and enabled/disabled controls in module header*
- **Affected files**:
  - `src/components/module-header/module-header.types.ts`
  - `src/components/module-header/module-header.component.ts`
  - `src/components/module-header/module-header.component.html`
  - `src/components/module-header/module-header.component.spec.ts`
  - `docs/CBA_MODULE_HEADER.md`

## Target Framework

- Angular 22 standalone component
- Signals-based inputs (`input()`)
- OnPush change detection
- SCSS with `--cba-*` design tokens

## Config Interface

Add to `src/components/module-header/module-header.types.ts`:

```ts
/**
 * Visibility and disabled-state controls for the built-in action buttons
 * rendered by {@link ModuleHeaderComponent}.
 *
 * All properties default to `true` so existing consumers continue to see
 * every action button enabled.
 */
export interface ModuleHeaderActionsConfig {
  /** When `false`, the collapse/expand button is removed from the DOM. */
  showCollapse?: boolean;
  /** When `false`, the size-toggle button is removed from the DOM. */
  showSizeToggle?: boolean;
  /** When `false`, the fullscreen button is removed from the DOM. */
  showFullscreen?: boolean;
  /** When `false`, the remove button is removed from the DOM. */
  showRemove?: boolean;
  /** When `false`, the collapse/expand button is rendered `[disabled]`. */
  enableCollapse?: boolean;
  /** When `false`, the size-toggle button is rendered `[disabled]`. */
  enableSizeToggle?: boolean;
  /** When `false`, the fullscreen button is rendered `[disabled]`. */
  enableFullscreen?: boolean;
  /** When `false`, the remove button is rendered `[disabled]`. */
  enableRemove?: boolean;
}
```

## Default Constant

Add to `src/components/module-header/module-header.component.ts` (or `module-header.types.ts`):

```ts
/** Default action controls: every action is visible and enabled. */
export const DEFAULT_MODULE_HEADER_ACTIONS_CONFIG: Required<ModuleHeaderActionsConfig> = {
  showCollapse: true,
  showSizeToggle: true,
  showFullscreen: true,
  showRemove: true,
  enableCollapse: true,
  enableSizeToggle: true,
  enableFullscreen: true,
  enableRemove: true,
};
```

## Input Contract

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `actionsConfig` | `ModuleHeaderActionsConfig` | `DEFAULT_MODULE_HEADER_ACTIONS_CONFIG` | no | Controls visibility (`showXxx`) and disabled state (`enableXxx`) of each built-in action button. Partial objects are merged with defaults. |

Add in `module-header.component.ts`:

```ts
/**
 * Visibility and disabled-state controls for the built-in action buttons.
 * Partial values are merged with {@link DEFAULT_MODULE_HEADER_ACTIONS_CONFIG}.
 * @default DEFAULT_MODULE_HEADER_ACTIONS_CONFIG
 */
readonly actionsConfig = input<ModuleHeaderActionsConfig>(DEFAULT_MODULE_HEADER_ACTIONS_CONFIG);

/** Effective action controls after merging user-provided partial config with defaults. */
protected readonly effectiveActionsConfig = computed<Required<ModuleHeaderActionsConfig>>(
  () => ({ ...DEFAULT_MODULE_HEADER_ACTIONS_CONFIG, ...this.actionsConfig() }),
);
```

## Visibility Behavior

`showXxx` flags **remove** the button from the DOM via `@if`, consistent with `showStatus` and `showTitle`. This keeps the component predictable: consumers that hide an action do not need to worry about disabled styling, focus management, or ARIA attributes for a non-existent control.

`isFullscreen` continues to remove the entire actions `<nav>` from the DOM, taking precedence over any `showXxx` value.

## Template Changes

In `src/components/module-header/module-header.component.html`, wrap each built-in action button with `@if (effectiveActionsConfig().showXxx)` and bind `[disabled]="!effectiveActionsConfig().enableXxx"` on the native `<button>`.

### Collapse / expand button

```html
@if (effectiveActionsConfig().showCollapse) {
  <button
    type="button"
    class="cba-module-header__action"
    [attr.aria-label]="collapseLabel()"
    [title]="collapseLabel()"
    [disabled]="!effectiveActionsConfig().enableCollapse"
    (click)="collapseToggle.emit()">
    <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
  </button>
}
```

### Size toggle button

```html
@if (effectiveActionsConfig().showSizeToggle) {
  <button
    type="button"
    class="cba-module-header__action"
    [attr.aria-label]="sizeToggleLabel()"
    [title]="sizeToggleLabel()"
    [disabled]="!effectiveActionsConfig().enableSizeToggle"
    (click)="sizeToggle.emit(sizeToggleTarget())">
    <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
  </button>
}
```

### Fullscreen button

```html
@if (effectiveActionsConfig().showFullscreen) {
  <button
    type="button"
    class="cba-module-header__action"
    [attr.aria-label]="aria.fullscreen"
    [title]="aria.fullscreen"
    [disabled]="!effectiveActionsConfig().enableFullscreen"
    (click)="fullscreenToggle.emit()">
    <fa-icon [icon]="faFullscreen" aria-hidden="true" />
  </button>
}
```

### Remove button

```html
@if (effectiveActionsConfig().showRemove) {
  <button
    type="button"
    class="cba-module-header__action"
    [attr.aria-label]="aria.remove"
    [title]="aria.remove"
    [disabled]="!effectiveActionsConfig().enableRemove"
    (click)="remove.emit()">
    <fa-icon [icon]="faXmark" aria-hidden="true" />
  </button>
}
```

The projected drag handle (`<ng-content select="[cbaModuleDragHandle]"></ng-content>`) remains untouched; its show/hide/enable behavior is owned by the Shell consumer.

## Styling

No new SCSS classes or tokens are required. The existing `.cba-module-header__action` styles already handle `:disabled` indirectly through browser defaults. To keep the library visually consistent, add an explicit disabled style block using existing tokens:

```scss
.cba-module-header__action:disabled {
  color: var(--cba-state-disabled-text);
  background-color: transparent;
  cursor: not-allowed;
}
```

This block is optional but recommended. If added, it must use only existing `--cba-*` tokens. No token changes are required for this task, so the `brief.md` §8.1 Token Change Checklist does not apply.

## Unit Tests

Add tests to `src/components/module-header/module-header.component.spec.ts`. Reuse the existing `setup()` helper and `queryButton(label)` helper.

### Visibility tests

For each action, verify that setting `showXxx` to `false` removes the button from the DOM, and that the default renders it.

| Action | Button selector (`queryButton`) | Config to hide |
| --- | --- | --- |
| Collapse | `collapseLabel()` (default `"Colapsar módulo"`) | `{ showCollapse: false }` |
| Size toggle | `sizeToggleLabel()` (default `"Reducir módulo a 50%"`) | `{ showSizeToggle: false }` |
| Fullscreen | `"Pantalla completa"` | `{ showFullscreen: false }` |
| Remove | `"Quitar módulo"` | `{ showRemove: false }` |

Example test pattern:

```ts
it('removes the collapse button from the DOM when showCollapse is false', () => {
  setup();
  fixture.componentRef.setInput('actionsConfig', { showCollapse: false });
  fixture.detectChanges();

  expect(queryButton('Colapsar módulo')).toBeNull();
});
```

### Disabled tests

For each action, verify that setting `enableXxx` to `false` adds the `disabled` attribute, and that the default leaves it enabled.

| Action | Button selector | Config to disable |
| --- | --- | --- |
| Collapse | `"Colapsar módulo"` | `{ enableCollapse: false }` |
| Size toggle | `"Reducir módulo a 50%"` | `{ enableSizeToggle: false }` |
| Fullscreen | `"Pantalla completa"` | `{ enableFullscreen: false }` |
| Remove | `"Quitar módulo"` | `{ enableRemove: false }` |

Example test pattern:

```ts
it('disables the collapse button when enableCollapse is false', () => {
  setup();
  fixture.componentRef.setInput('actionsConfig', { enableCollapse: false });
  fixture.detectChanges();

  const button = queryButton('Colapsar módulo');
  expect(button.disabled).toBe(true);
});
```

### Emission guard tests

For each disabled action, verify that clicking the disabled button does **not** emit the corresponding output. This confirms the native `[disabled]` binding is actually preventing interaction.

Example test pattern:

```ts
it('does not emit collapseToggle when the collapse button is disabled', () => {
  const component = setup();
  const emitted: unknown[] = [];
  component.collapseToggle.subscribe((value) => emitted.push(value));

  fixture.componentRef.setInput('actionsConfig', { enableCollapse: false });
  fixture.detectChanges();

  const button = queryButton('Colapsar módulo');
  button.click();

  expect(emitted).toHaveLength(0);
});
```

### Default behavior test

```ts
it('renders all four action buttons enabled by default', () => {
  setup();
  const navButtons = fixture.nativeElement.querySelectorAll('nav button');

  expect(navButtons).toHaveLength(4);
  navButtons.forEach((button: HTMLButtonElement) => {
    expect(button.disabled).toBe(false);
  });
});
```

### Fullscreen precedence test

```ts
it('hides all action buttons in fullscreen regardless of actionsConfig', () => {
  setup();
  fixture.componentRef.setInput('actionsConfig', {
    showCollapse: true,
    showSizeToggle: true,
    showFullscreen: true,
    showRemove: true,
  });
  fixture.componentRef.setInput('isFullscreen', true);
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('nav')).toBeNull();
});
```

## Doc Update Summary

Update `docs/CBA_MODULE_HEADER.md`:

1. **Inputs table**: add the `actionsConfig` row with type `ModuleHeaderActionsConfig`, default `"all actions visible and enabled"`, and a short description.
2. **New "Action controls" section** after "Visibility inputs":
   - Explain that `actionsConfig.showXxx` removes the button from the DOM (consistent with `showStatus`/`showTitle`).
   - Explain that `actionsConfig.enableXxx` sets `[disabled]` on the native `<button>`.
   - Show a partial config example, e.g. hiding remove and disabling fullscreen.
3. **Icon order table**: add a note that hidden actions are skipped entirely; positions shift only by projected drag handle, not by hidden built-ins.
4. **Accessibility section**: note that disabled buttons remain focusable/visible in the tab order (native `<button disabled>` behavior) and keep their `aria-label`/`title`.
5. **Drag handle slot section**: keep unchanged; the drag handle is consumer-controlled and unaffected by `actionsConfig`.

## Backward Compatibility

All `ModuleHeaderActionsConfig` properties are optional and default to `true`. Existing consumers that do not bind `actionsConfig` continue to see all four action buttons visible and enabled, with identical output behavior. No existing input names, output names, or CSS classes are changed.

## Acceptance Criteria

- [ ] `ModuleHeaderActionsConfig` interface is exported from `src/components/module-header/module-header.types.ts`.
- [ ] `DEFAULT_MODULE_HEADER_ACTIONS_CONFIG` constant is exported and used as the input default.
- [ ] `actionsConfig` input accepts partial objects and merges them with defaults.
- [ ] Each `showXxx` flag removes its button from the DOM via `@if`.
- [ ] Each `enableXxx` flag binds `[disabled]` on the native `<button>`.
- [ ] Unit tests cover visibility and disabled state for collapse, size toggle, fullscreen, and remove.
- [ ] `docs/CBA_MODULE_HEADER.md` is updated with the new input, action-controls section, and accessibility note.
- [ ] Existing tests continue to pass; `npm run lint` and `npm run build` remain passing.
- [ ] No new `--cba-*` tokens are introduced.
