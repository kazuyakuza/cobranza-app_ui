# Front-end Technical Specification — Task A (Component Bug Fixes)

**Scope:** Tasks 1–5 from `.agent/todos/20260811/20260811-todo-0.md`
**Branch:** `feat/shell-ui-bug-fixes-round-2`
**Library:** `@cobranza-apps/ui`
**Target framework:** Angular 22, standalone components, SCSS + CSS variables

## Summary

This spec defines the precise component changes required to fix five Shell UI bugs in `ModuleContainerComponent` and `CbaButtonComponent`. All changes are additive and backward-compatible.

## Target files

- `src/components/module-container/module-container.component.ts`
- `src/components/module-container/module-container.component.scss`
- `src/components/button/cba-button.component.ts`
- `src/components/button/cba-button.component.scss`
- `docs/MODULE_CONTAINER.md`
- `docs/CBA_BUTTON.md`
- `CHANGELOG.md`

---

## Task 1 — Expose Scroll Chaining Control on Module Container

### Goal

Allow consumers to opt into workspace scroll chaining by setting `[scrollChaining]="true"`. Default behavior (`false`) preserves the existing `overscroll-behavior: contain`.

### TypeScript changes

Add the input signal and host class binding in `module-container.component.ts`.

```ts
/**
 * Allows scroll gestures to chain to the parent workspace container.
 *
 * When `false` (default), the module body uses `overscroll-behavior: contain`
 * so wheel events stay inside the module. When `true`, the body uses
 * `overscroll-behavior: auto` so the workspace can scroll once the module
 * body reaches its edge.
 *
 * Drives the host modifier class `cba-module-container--scroll-chaining`.
 *
 * @default false
 */
readonly scrollChaining = input<boolean>(false);
```

Append to the `host` object:

```ts
'[class.cba-module-container--scroll-chaining]': 'scrollChaining()',
```

### SCSS changes

In `module-container.component.scss`, add after the existing `.cba-module-container__body` block:

```scss
/* When scroll chaining is enabled, bubble scroll to the workspace. */
:host(.cba-module-container--scroll-chaining) .cba-module-container__body {
  overscroll-behavior: auto;
}
```

Update the body block comment from `/* Keep scroll inside the body; never bubble to the workspace. */` to:

```scss
/* Keep scroll inside the body by default; scrollChaining allows bubbling to the workspace. */
```

### Template changes

None.

### Visual behaviour

- Default (`scrollChaining = false`): mouse-wheel events stop at the module body edge (current behaviour).
- Opt-in (`scrollChaining = true`): mouse-wheel events chain to the Shell workspace once the module body reaches its scroll boundary.

### Test expectations

1. Default state: host does **not** have `cba-module-container--scroll-chaining`.
2. With `[scrollChaining]="true"`: host has `cba-module-container--scroll-chaining`.
3. Default body computed `overscroll-behavior` is `contain`.
4. With `[scrollChaining]="true"`: body computed `overscroll-behavior` is `auto`.

### Doc updates

- `docs/MODULE_CONTAINER.md`:
  - Add `scrollChaining` row to the Inputs table:
    | Name | Type | Default | Required | Description |
    | --- | --- | --- | --- | --- |
    | `scrollChaining` | `boolean` | `false` | no | When `true`, wheel events chain to the workspace once the module body reaches its edge. |
  - Update the Scroll behaviour section to describe the default `contain` and the opt-in `auto` behaviour.

---

## Task 2 — Retain Panel Background in Fullscreen Mode

### Goal

Keep `background-color: var(--cba-bg-secondary)` on the host in fullscreen mode; only suppress border, border-radius, box-shadow, and overflow clipping.

### SCSS changes

In `module-container.component.scss`, refactor the `:host` and chrome selectors:

```scss
:host {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--cba-bg-secondary);
}

/* Task 4 — module chrome applied only when NOT fullscreen. */
:host(:not(.cba-module-container--fullscreen)) {
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  /* Border is the primary separator; shadow is secondary depth. */
  overflow: hidden;
}
```

Remove `background-color` from the `:host(:not(.cba-module-container--fullscreen))` selector.

### TypeScript changes

None.

### Template changes

None.

### Visual behaviour

- Non-fullscreen: panel has cream background, border, radius, and shadow (unchanged).
- Fullscreen: panel keeps the cream secondary background; border, radius, shadow, and overflow clipping are removed so the Shell fullscreen view owns the chrome.

### Test expectations

1. Non-fullscreen host computed `background-color` equals `--cba-bg-secondary`.
2. Non-fullscreen host computed `border`, `border-radius`, and `box-shadow` match the chrome tokens.
3. Fullscreen host computed `background-color` still equals `--cba-bg-secondary`.
4. Fullscreen host computed `border`, `border-radius`, and `box-shadow` are `none` / `0px`.

### Doc updates

- `docs/MODULE_CONTAINER.md`:
  - Update the Fullscreen behaviour section: remove "Background and border are also removed." State that `background-color` is retained and only border, radius, and shadow are suppressed.

---

## Task 3 — Expose Label Truncation on CbaButton

### Goal

Add `[truncate]` input that applies `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to the button label.

### TypeScript changes

Add the input signal and host class binding in `cba-button.component.ts`.

```ts
/**
 * Truncates the button label with an ellipsis when it overflows the
 * available space. Useful for buttons inside constrained flex containers.
 *
 * Drives the host modifier class `cba-button--truncate`.
 *
 * @default false
 */
readonly truncate = input<boolean>(false);
```

Append to the `host` object:

```ts
'[class.cba-button--truncate]': 'truncate()',
```

### SCSS changes

In `cba-button.component.scss`, add:

```scss
.cba-button--truncate .cba-button__control {
  min-width: 0;
}

.cba-button--truncate .cba-button__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Template changes

None.

### Visual behaviour

- Default: label renders normally and may overflow the button (current behaviour).
- `[truncate]="true"`: long labels are clamped to a single line and show a trailing ellipsis when the button width is constrained.

### Test expectations

1. Default state: host does **not** have `cba-button--truncate`.
2. With `[truncate]="true"`: host has `cba-button--truncate`.
3. With `[truncate]="true"` and a constrained width, the label span computed style has `text-overflow: ellipsis`, `white-space: nowrap`, and `overflow: hidden`.

### Doc updates

- `docs/CBA_BUTTON.md`:
  - Add `truncate` row to the Inputs table:
    | Name | Type | Default | Description |
    | --- | --- | --- | --- |
    | `truncate` | `boolean` | `false` | Truncates the label with an ellipsis when space is constrained. |
  - Add example:
    ```html
    <cba-button [truncate]="true" style="max-width: 120px;">Very long action label</cba-button>
    ```

---

## Task 4 — Minimal Square Icon-Only Button

### Goal

Add `[iconOnly]` input that renders a square button with minimal padding when the button contains only an icon.

### TypeScript changes

Add the input signal and host class binding in `cba-button.component.ts`.

```ts
/**
 * Renders the button as a minimal square icon-only control.
 *
 * Use when the button has an `icon` but no text content. Removes
 * excessive horizontal padding, applies a square aspect ratio, and keeps
 * the icon centered.
 *
 * Drives the host modifier class `cba-button--icon-only`.
 *
 * @default false
 */
readonly iconOnly = input<boolean>(false);
```

Append to the `host` object:

```ts
'[class.cba-button--icon-only]': 'iconOnly()',
```

### SCSS changes

In `cba-button.component.scss`, add after the size modifiers:

```scss
.cba-button--icon-only .cba-button__control {
  aspect-ratio: 1 / 1;
  min-width: auto;
}

.cba-button--icon-only.cba-button--sm .cba-button__control {
  padding: var(--cba-space-1);
}

.cba-button--icon-only.cba-button--md .cba-button__control {
  padding: var(--cba-space-2);
}
```

### Template changes

None.

### Visual behaviour

- Default: button uses normal size padding and content-driven width (current behaviour).
- `[iconOnly]="true"`: button becomes a square with minimal padding; the icon stays vertically and horizontally centered. The consumer can place it in a flex container with `flex: 0 0 auto` to prevent stretching.

### Test expectations

1. Default state: host does **not** have `cba-button--icon-only`.
2. With `[iconOnly]="true"`: host has `cba-button--icon-only`.
3. Icon-only `md` control computed `padding` equals `var(--cba-space-2)` (8px).
4. Icon-only `sm` control computed `padding` equals `var(--cba-space-1)` (4px).
5. Icon-only control computed `aspect-ratio` is `1 / 1`.

### Doc updates

- `docs/CBA_BUTTON.md`:
  - Add `iconOnly` row to the Inputs table:
    | Name | Type | Default | Description |
    | --- | --- | --- | --- |
    | `iconOnly` | `boolean` | `false` | Renders a minimal square button for icon-only usage. |
  - Add example:
    ```html
    <cba-button [icon]="faPlus" [iconOnly]="true" (cbaClick)="onAdd()"></cba-button>
    ```
  - Note that `iconOnly` buttons still render an `aria-hidden` icon; consumers must provide an accessible label via `aria-label` on `<cba-button>`.

---

## Task 5 — Block-Level Ghost Button

### Goal

Add `[block]` input that makes the button host and internal control fill the parent width. For ghost variants the label is left-aligned.

### TypeScript changes

Add the input signal and host class binding in `cba-button.component.ts`.

```ts
/**
 * Makes the button fill the full width of its parent container.
 *
 * The host becomes a block-level element and the internal control spans
 * 100% width. When combined with `variant="ghost"`, the label is left-aligned.
 *
 * Drives the host modifier class `cba-button--block`.
 *
 * @default false
 */
readonly block = input<boolean>(false);
```

Append to the `host` object:

```ts
'[class.cba-button--block]': 'block()',
```

### SCSS changes

In `cba-button.component.scss`, add:

```scss
:host(.cba-button--block) {
  display: block;
  width: 100%;
}

.cba-button--block .cba-button__control {
  width: 100%;
}

.cba-button--block.cba-button--ghost .cba-button__control {
  justify-content: flex-start;
}
```

### Template changes

None.

### Visual behaviour

- Default: host is `inline-block`; control sizes to content (current behaviour).
- `[block]="true"`: host becomes block-level and spans 100% width; internal control also spans 100% width. Ghost block buttons left-align their label; other variants remain centered.

### Test expectations

1. Default state: host does **not** have `cba-button--block`; host computed `display` is `inline-block`.
2. With `[block]="true"`: host has `cba-button--block`; host computed `display` is `block` and `width` is `100%`.
3. Block button internal control computed `width` is `100%`.
4. Ghost block button internal control computed `justify-content` is `flex-start`.

### Doc updates

- `docs/CBA_BUTTON.md`:
  - Add `block` row to the Inputs table:
    | Name | Type | Default | Description |
    | --- | --- | --- | --- |
    | `block` | `boolean` | `false` | Makes the button fill the full width of its parent; ghost labels are left-aligned. |
  - Add example:
    ```html
    <cba-button variant="ghost" [block]="true" (cbaClick)="onFilter()">Filter results</cba-button>
    ```

---

## Cross-cutting concerns

### Accessibility

- No ARIA changes are required; all new inputs are visual/layout only.
- `iconOnly` buttons still render a native `<button>` with an `aria-hidden` icon. Consumers must supply an accessible label via `aria-label` on `<cba-button>` or use visible text. Document this requirement in `CBA_BUTTON.md`.

### Backward compatibility

- All new inputs default to `false`, preserving existing rendering.
- `scrollChaining` default keeps current `overscroll-behavior: contain`.
- The fullscreen background change restores the intended panel color. The existing Shell `.cba-bg-secondary` workaround becomes harmless but can be removed once the library is released.

### Changelog

Update `CHANGELOG.md` under the current dated version header per `.kilo/rules/changelog-versioning.md`:

- Added: `ModuleContainerComponent` `scrollChaining` input.
- Changed: `ModuleContainerComponent` fullscreen mode retains `background-color`.
- Added: `CbaButtonComponent` `truncate`, `iconOnly`, and `block` inputs.

### Verification checklist

- [ ] `npm run lint` passes.
- [ ] `npm run test` passes (new tests + existing suite).
- [ ] `npm run build` passes.
- [ ] `docs/MODULE_CONTAINER.md` and `docs/CBA_BUTTON.md` updated.
- [ ] `CHANGELOG.md` updated with dated header (no `[Unreleased]` section).
