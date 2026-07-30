<!--
  FILE: 20260730-phase3-blocka-frontend-spec.md
  PURPOSE: Front-end Technical Specification for ModuleContainerComponent (Phase 3, Block A).
  AUDIENCE: Implementer, Code Reviewer, Frontend Verification.
-->

# ModuleContainerComponent — Front-end Technical Specification

## 1. Component identity

| Property | Value |
| --- | --- |
| Selector | `cba-module-container` |
| Class | `ModuleContainerComponent` |
| Location | `src/lib/components/module-container/` |
| Framework | Angular 22 standalone component |
| Change detection | `ChangeDetectionStrategy.OnPush` |
| View encapsulation | Default (`Emulated`) |
| Style language | SCSS (`styleUrl`) |

## 2. File structure

```text
src/lib/components/module-container/
├── index.ts                         # barrel export
├── module-container.types.ts        # public type aliases
├── module-container.component.ts    # component class + host bindings
├── module-container.component.html  # template with content projection
├── module-container.component.scss  # component styles (token-only)
└── module-container.component.spec.ts # unit tests
```

## 3. Public types

Define in `module-container.types.ts` and re-export via the barrel.

```ts
/** Width modes supported by {@link ModuleContainerComponent}. */
export type ModuleContainerSize = '50%' | '100%';

/** Body padding options supported by {@link ModuleContainerComponent}. */
export type ModuleContainerPadding = 'none' | 'sm' | 'md';
```

## 4. Inputs

Use Angular `input()` signals, matching the {@link ModuleHeaderComponent} pattern.

| Name | Type | Default | `input()` transform | Description |
| --- | --- | --- | --- | --- |
| `size` | `ModuleContainerSize` | `'100%'` | none | Workspace width mode. |
| `isCollapsed` | `boolean` | `false` | none | When `true`, the body region is removed from the DOM and cannot scroll. |
| `isFullscreen` | `boolean` | `false` | none | When `true`, the module chrome (border-radius, shadow) is suppressed. |
| `padding` | `ModuleContainerPadding` | `'sm'` | none | Body internal padding. |

## 5. Content projection API

Two projection slots. The header slot uses an explicit attribute selector so the Shell can project any element (typically `cba-module-header`) without tag-name coupling. The body uses the default slot.

| Slot | Selector | Purpose |
| --- | --- | --- |
| Header | `[cbaModuleContainerHeader]` | Projects the module header (typically `<cba-module-header cbaModuleContainerHeader>`). |
| Body / default | `<ng-content></ng-content>` | Projects the MFE content. |

### Usage example

```html
<cba-module-container
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  [padding]="padding">

  <cba-module-header
    cbaModuleContainerHeader
    title="Customers"
    [size]="size"
    [isCollapsed]="isCollapsed"
    [isFullscreen]="isFullscreen">
  </cba-module-header>

  <app-customers-mfe></app-customers-mfe>
</cba-module-container>
```

## 6. Host bindings strategy

Drive all visual modifiers from the host element via the `host` map in `@Component`. Each binding reads the corresponding signal directly.

```ts
host: {
  '[class.cba-module-container--size-50]': "size() === '50%'",
  '[class.cba-module-container--size-100]': "size() === '100%'",
  '[class.cba-module-container--collapsed]': 'isCollapsed()',
  '[class.cba-module-container--fullscreen]': 'isFullscreen()',
  '[class.cba-module-container--padding-none]': "padding() === 'none'",
  '[class.cba-module-container--padding-sm]': "padding() === 'sm'",
  '[class.cba-module-container--padding-md]': "padding() === 'md'",
}
```

No inline `style` bindings are used. All layout / chrome / padding values are applied through these modifier classes.

## 7. Template conditional rendering logic

```html
<section class="cba-module-container">
  <div class="cba-module-container__header">
    <ng-content select="[cbaModuleContainerHeader]"></ng-content>
  </div>

  @if (!isCollapsed()) {
    <div class="cba-module-container__body">
      <ng-content></ng-content>
    </div>
  }
</section>
```

### Rendering rules

1. The `.cba-module-container__header` wrapper is always rendered.
2. The `.cba-module-container__body` wrapper is rendered **only** when `isCollapsed() === false`.
3. When collapsed, the body is removed from the DOM (no layout box, no scroll container).
4. In fullscreen mode the container still hosts header + body, but the chrome modifiers are suppressed via host class (see §8).

## 8. Styling architecture

Use only `--cba-*` tokens from `src/lib/theme/_variables.scss`.

### Host / root chrome

```scss
:host {
  display: flex;
  flex-direction: column;
}

.cba-module-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
  box-sizing: border-box;
}
```

### Size modifiers

| Host class | Behaviour |
| --- | --- |
| `.cba-module-container--size-50` | `width: 50%` |
| `.cba-module-container--size-100` | `width: 100%` |

### Fullscreen modifier

When `:host(.cba-module-container--fullscreen) .cba-module-container`:

- `border-radius: 0`
- `box-shadow: none`
- `border: none` (Shell owns fullscreen chrome)

### Collapsed modifier

When `:host(.cba-module-container--collapsed)` the body is absent from DOM; no extra body styles are required. The container itself keeps its chrome unless fullscreen.

### Body styles

```scss
.cba-module-container__body {
  flex: 1 1 auto;
  overflow: auto;
}
```

### Padding modifiers (applied to the body)

| Host class | Body padding |
| --- | --- |
| `.cba-module-container--padding-none` | `0` |
| `.cba-module-container--padding-sm` | `var(--cba-space-3)` |
| `.cba-module-container--padding-md` | `var(--cba-space-4)` |

### Scrollbar styling (CSS-only)

- Thin scrollbar by default.
- Larger thumb on hover via `::-webkit-scrollbar` pseudo-elements if supported.
- Optional top/bottom jump buttons are **out of scope** for Block A.

## 9. JSDoc requirements

Match the {@link ModuleHeaderComponent} documentation style:

- Multi-line JSDoc on the component class with `@usageNotes`, example markup, `@see` links, and a note that workspace state is owned by the Shell.
- One-line JSDoc on every public `@Input()` property describing intent, default, and visual effect.
- No JSDoc on protected/private members unless they are non-trivial.

## 10. Export contract

1. Re-export types and component from `src/lib/components/module-container/index.ts`.
2. Add `export * from './components/module-container';` to `src/lib/public-api.ts` (alphabetically after `module-header`).

## 11. Acceptance criteria for Block A

| # | Criterion |
| --- | --- |
| 1 | `ModuleContainerComponent` is generated as a standalone component with the correct selector and `OnPush` change detection. |
| 2 | All four inputs are declared using `input()` signals with the exact types and defaults. |
| 3 | Complete JSDoc is present on the component class and every public input. |
| 4 | Template projects a header slot via `[cbaModuleContainerHeader]` and a default body slot. |
| 5 | Body is removed from DOM when `isCollapsed` is `true`. |
| 6 | Host bindings map size / collapsed / fullscreen / padding to modifier classes. |
| 7 | Fullscreen mode suppresses module border-radius and shadow through host modifier classes. |
| 8 | File structure matches §2 and barrel export is configured. |
