# Front-end Technical Specification: ModuleHeader show/hide inputs

## 1. Overview

Add two new boolean inputs to `ModuleHeaderComponent` so consumers can explicitly hide the status icon and/or the module title without relying on side effects such as `status = null` or `isFullscreen = true`.

## 2. Component under change

- File: `src/components/module-header/module-header.component.ts`
- Template: `src/components/module-header/module-header.component.html`
- Tests: `src/components/module-header/module-header.component.spec.ts`
- Docs: `docs/CBA_MODULE_HEADER.md`

## 3. Inputs

Add the following Angular signals-based inputs to `ModuleHeaderComponent`, after the existing `status` input and before the outputs.

### 3.1 `showStatus`

```ts
/**
 * Whether the status icon section is rendered.
 * When `false` the left status section is removed from the DOM.
 * Does not affect the status value itself.
 * @default true
 */
readonly showStatus = input<boolean>(true);
```

- Type: `boolean`
- Default: `true`
- Required: no

### 3.2 `showTitle`

```ts
/**
 * Whether the title section is rendered.
 * When `false` the center title section is removed from the DOM.
 * @default true
 */
readonly showTitle = input<boolean>(true);
```

- Type: `boolean`
- Default: `true`
- Required: no

## 4. Template logic

### 4.1 Status section

The status section must render only when **all** of the following are true:

1. `!isFullscreen()`
2. `showStatus()`
3. `statusVisual()` is not `null` (i.e., `status` is a known non-null value)

Update the existing `@if (!isFullscreen())` block that wraps the status section to also require `showStatus()`.

Keep the inner `@if (statusVisual(); as visual)` block unchanged; it already guards against unknown or null status values.

### 4.2 Title section

The title section must render only when `showTitle()` is `true`.

Wrap the existing title `<div>` with `@if (showTitle()) { ... }`.

When `showTitle()` is `false`, the title text is removed from the DOM entirely.

### 4.3 Fullscreen behaviour

`isFullscreen` continues to take precedence over the new flags in the following way:

- In fullscreen mode the status section and actions nav are still hidden (existing behaviour).
- The title section is controlled solely by `showTitle()`. Therefore, if a consumer binds `[isFullscreen]="true"` and `[showTitle]="false"`, no header content is rendered.

This is the intended behaviour; do not add extra cross-guards between `isFullscreen` and `showTitle`.

## 5. Backward-compatibility strategy

Default values are `true` for both new inputs, so existing consumers that do not bind them see no visual change.

`status = null` must continue to hide the status icon when `showStatus` is not explicitly bound, because:

- `showStatus` defaults to `true`.
- The inner `statusVisual()` computed returns `null` when `status` is `null`.
- The inner `@if (statusVisual(); as visual)` block therefore renders nothing.

No additional special-casing for `status = null` is required.

## 6. Computed signals

No new computed signals are required.

The existing signals remain valid:

- `statusVisual` — unchanged.
- `statusClass` — unchanged; the CSS class is still applied to the status section whenever the outer block renders.

## 7. Styling

No SCSS changes are required.

The existing layout using flexbox and the status/title/actions sections remains unchanged.

## 8. Unit tests

Add the following test cases to `src/components/module-header/module-header.component.spec.ts` inside the main `describe('ModuleHeaderComponent', ...)` block.

### 8.1 `showStatus` tests

```ts
it('hides the status section when showStatus is false', () => {
  const component = setup();
  fixture.componentRef.setInput('status', 'loading');
  fixture.componentRef.setInput('showStatus', false);
  fixture.detectChanges();

  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  ) as HTMLElement;

  expect(statusSection).toBeNull();
});

it('shows the status icon when showStatus is true and status is non-null', () => {
  const component = setup();
  fixture.componentRef.setInput('status', 'success');
  fixture.componentRef.setInput('showStatus', true);
  fixture.detectChanges();

  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  ) as HTMLElement;

  expect(statusSection).not.toBeNull();
  expect(statusSection.querySelector('fa-icon')).not.toBeNull();
});

it('still hides the status icon when status is null even if showStatus defaults to true', () => {
  setup();
  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  ) as HTMLElement;

  expect(statusSection.querySelector('fa-icon')).toBeNull();
});
```

### 8.2 `showTitle` tests

```ts
it('hides the title section when showTitle is false', () => {
  setup();
  fixture.componentRef.setInput('showTitle', false);
  fixture.detectChanges();

  const titleSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--title',
  ) as HTMLElement;

  expect(titleSection).toBeNull();
  expect(fixture.nativeElement.textContent).not.toContain('Test Module');
});

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

### 8.3 Interaction with `isFullscreen`

```ts
it('hides status and actions in fullscreen even when showStatus is explicitly true', () => {
  setup();
  fixture.componentRef.setInput('status', 'loaded');
  fixture.componentRef.setInput('showStatus', true);
  fixture.componentRef.setInput('isFullscreen', true);
  fixture.detectChanges();

  const actionsNav = fixture.nativeElement.querySelector('nav');
  const statusSection = fixture.nativeElement.querySelector(
    '.cba-module-header__section--status',
  );

  expect(actionsNav).toBeNull();
  expect(statusSection).toBeNull();
});
```

## 9. Documentation update

Update `docs/CBA_MODULE_HEADER.md` as follows:

1. Add the two new inputs to the **Inputs** table.

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| title | string | — | yes | Module title (provided by Shell / MFE). |
| size | '50%' \| '100%' | '100%' | no | Current width mode. |
| isCollapsed | boolean | false | no | Whether the module body is collapsed. Drives collapse/expand icon. |
| isFullscreen | boolean | false | no | When true, only the title is shown. |
| status | 'loading' \| 'loaded' \| 'success' \| 'warning' \| 'error' \| 'dirty' \| null | null | no | Optional status indicator. |
| **showStatus** | **boolean** | **true** | **no** | **When `false`, the status icon section is hidden.** |
| **showTitle** | **boolean** | **true** | **no** | **When `false`, the title section is hidden.** |

2. Add a new subsection under **Inputs** named `### Visibility inputs` describing `showStatus` and `showTitle`.

3. Update the **Status values** table description for `null` to note: "Nothing rendered; same as before and still respected when `showStatus` is not bound."

4. Update the **Fullscreen behaviour** section to mention that `isFullscreen` hides status and actions independently of `showStatus`, and that `showTitle` can still hide the title in fullscreen mode.

## 10. Acceptance criteria

- [ ] `showStatus` input exists with type `boolean` and default `true`.
- [ ] `showTitle` input exists with type `boolean` and default `true`.
- [ ] Template renders the status section only when `!isFullscreen() && showStatus() && statusVisual() !== null`.
- [ ] Template renders the title section only when `showTitle()` is `true`.
- [ ] `status = null` still hides the status icon when `showStatus` is not bound.
- [ ] Existing behaviour for `isFullscreen` remains unchanged.
- [ ] New unit tests pass alongside the existing test suite.
- [ ] `docs/CBA_MODULE_HEADER.md` reflects the new inputs and behaviour.
