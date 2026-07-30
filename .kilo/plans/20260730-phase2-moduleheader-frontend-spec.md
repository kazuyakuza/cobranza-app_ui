# ModuleHeader — Front-end Technical Specification

**Component:** `ModuleHeader`  
**Library:** `@cobranza-apps/ui`  
**Framework:** Angular 22 (standalone)  
**Branch:** `feat/phase2-module-header`  
**Spec date:** 2026-07-30

## 1. Component Contract

### 1.1 Selector & metadata

| Property | Value |
| --- | --- |
| Selector | `cba-module-header` |
| Standalone | `true` |
| Change detection | `ChangeDetectionStrategy.OnPush` |
| Encapsulation | `ViewEncapsulation.Emulated` (default) |
| File location | `src/lib/components/module-header/module-header.component.ts` |

### 1.2 Inputs

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | Yes | — | Module title rendered in the center section. No default; parent must supply a value. |
| `size` | `ModuleHeaderSize` (`'50%' \| '100%'`) | No | `'100%'` | Current module width mode. |
| `isCollapsed` | `boolean` | No | `false` | Whether the module body is collapsed. Drives collapse/expand icon state. |
| `isFullscreen` | `boolean` | No | `false` | When `true`, only the title section is rendered; status and actions are hidden. |
| `status` | `ModuleHeaderStatus` (`'loading' \| 'loaded' \| 'success' \| 'warning' \| 'error' \| 'dirty' \| null`) | No | `null` | Optional visual status indicator rendered in the left section. `null` renders nothing. |

### 1.3 Outputs

| Name | Payload | Emission condition |
| --- | --- | --- |
| `collapseToggle` | `void` | User clicks the collapse/expand action button. |
| `sizeToggle` | `ModuleHeaderSize` | User clicks the size toggle button; payload is the target size (opposite of current `size`). |
| `remove` | `void` | User clicks the remove action button. |
| `fullscreenToggle` | `void` | User clicks the fullscreen action button. |

### 1.4 Public types

Define and export from the component folder (e.g. `module-header.types.ts`):

```ts
export type ModuleHeaderSize = '50%' | '100%';

export type ModuleHeaderStatus =
  | 'loading'
  | 'loaded'
  | 'success'
  | 'warning'
  | 'error'
  | 'dirty'
  | null;
```

These types must be re-exported from `src/lib/components/module-header/index.ts`.

## 2. Template Structure

### 2.1 Root host element

The host element is a `<header>` (semantic landmark) with the component's class.

```html
<header class="cba-module-header">
  <!-- content -->
</header>
```

### 2.2 Sections

The header contains three horizontal sections inside a flex row:

```html
<div class="cba-module-header__section cba-module-header__section--status">
  <!-- status icon or empty -->
</div>
<div class="cba-module-header__section cba-module-header__section--title">
  <!-- title text -->
</div>
<div class="cba-module-header__section cba-module-header__section--actions">
  <!-- action buttons -->
</div>
```

### 2.3 Fullscreen conditional

When `isFullscreen` is `true`, render **only** the title section. Do not render status or actions sections.

```html
@if (isFullscreen()) {
  <div class="cba-module-header__section cba-module-header__section--title">
    {{ title() }}
  </div>
} @else {
  <div class="cba-module-header__section cba-module-header__section--status">
    <!-- status icon -->
  </div>
  <div class="cba-module-header__section cba-module-header__section--title">
    {{ title() }}
  </div>
  <div class="cba-module-header__section cba-module-header__section--actions">
    <!-- buttons -->
  </div>
}
```

### 2.4 Status icon conditional

Render the status icon only when `status()` is not `null`:

```html
@if (statusIcon(); as iconConfig) {
  <fa-icon
    [icon]="iconConfig.icon"
    [spin]="iconConfig.spin"
    [class]="iconConfig.cssClass"
    aria-hidden="true">
  </fa-icon>
}
```

Use a computed signal or getter (`statusIcon`) that maps `status` to `{ icon, spin, cssClass }`.

### 2.5 Action buttons

Four native `<button>` elements, visible only in non-fullscreen mode:

1. **Collapse / Expand**
   - Icon: `faChevronUp` when `isCollapsed` is `false`; `faChevronDown` when `true`.
   - `aria-label`: `"Collapse module"` / `"Expand module"`.
   - Click: emit `collapseToggle`.

2. **Size toggle**
   - Icon: `faMinimize` / `faMaximize` or equivalent arrows indicating the target size.
   - `aria-label`: `"Shrink module to 50%"` when current `size` is `'100%'`; `"Expand module to 100%"` when `'50%'`.
   - Click: emit `sizeToggle` with the opposite size.

3. **Remove**
   - Icon: `faXmark` (or `faTrashCan` if library convention prefers).
   - `aria-label`: `"Remove module"`.
   - Click: emit `remove`.

4. **Fullscreen**
   - Icon: `faExpand`.
   - `aria-label`: `"Enter fullscreen"`.
   - Click: emit `fullscreenToggle`.

Each button uses a single shared class (e.g. `cba-module-header__action`) plus modifier classes for state styling.

### 2.6 Title rendering

- Render as plain text via interpolation `{{ title() }}`.
- Never editable (no `<input>`, no `contenteditable`).
- Allow multi-line wrapping.

## 3. SCSS Architecture

### 3.1 File location

`src/lib/components/module-header/module-header.component.scss`

### 3.2 Layout

```scss
:host {
  display: block;
}

.cba-module-header {
  display: flex;
  align-items: flex-start;
  min-height: var(--cba-module-header-min-height, 40px);
  padding: var(--cba-space-2) var(--cba-space-3);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-secondary);
  color: var(--cba-text-primary);
  border-bottom: 1px solid var(--cba-border-subtle);
  box-sizing: border-box;
}

.cba-module-header__section {
  display: flex;
  align-items: center;
  min-height: var(--cba-module-header-min-height, 40px);
}

.cba-module-header__section--status {
  flex: 0 0 auto;
  justify-content: center;
  width: 32px; /* fixed status column */
}

.cba-module-header__section--title {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5;
}

.cba-module-header__section--actions {
  flex: 0 0 auto;
  justify-content: flex-end;
  gap: var(--cba-space-1);
}
```

### 3.3 Action buttons

```scss
.cba-module-header__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--cba-text-secondary);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--cba-radius-sm);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;

  &:hover {
    background-color: var(--cba-hover);
    color: var(--cba-text-primary);
  }

  &:active {
    background-color: var(--cba-active);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}
```

### 3.4 Status icon colors

Apply color tokens via modifier classes generated from the status mapping (e.g. `.cba-module-header__status--loading`):

| Status | Color token |
| --- | --- |
| `loading` | `var(--cba-accent-info)` |
| `loaded` | `var(--cba-accent-success)` |
| `success` | `var(--cba-accent-success)` |
| `warning` | `var(--cba-accent-warning)` |
| `error` | `var(--cba-accent-danger)` |
| `dirty` | `var(--cba-text-muted)` |

Status section is empty when `status` is `null`; the fixed-width placeholder remains so the title does not shift horizontally when status changes.

### 3.5 Fullscreen modifier

When fullscreen, the header should not display a bottom border or background different from the fullscreen surface. The title section remains centered.

```scss
.cba-module-header--fullscreen {
  background-color: transparent;
  border-bottom: none;
  justify-content: center;

  .cba-module-header__section--title {
    flex: 0 1 auto; /* do not stretch */
  }
}
```

Host binding for the fullscreen modifier class:

```ts
@HostBinding('class.cba-module-header--fullscreen') isFullscreenClass = computed(() => this.isFullscreen());
```

## 4. Icon Mapping Table

| Status | Font Awesome icon (solid) | Spin | Color token | Notes |
| --- | --- | --- | --- | --- |
| `loading` | `faSpinner` | Yes | `--cba-accent-info` | Animated spinner indicates ongoing operation. |
| `loaded` | `faCheck` | No | `--cba-accent-success` | Subtle success: data ready. |
| `success` | `faCircleCheck` | No | `--cba-accent-success` | Stronger success: explicit save/submit. |
| `warning` | `faTriangleExclamation` | No | `--cba-accent-warning` | Soft validation / incomplete data. |
| `error` | `faCircleXmark` | No | `--cba-accent-danger` | Load failure or hard validation error. |
| `dirty` | `faPen` | No | `--cba-text-muted` | Unsaved changes present. |
| `null` | — | — | — | Nothing rendered. |

Import all icons from `@fortawesome/free-solid-svg-icons`.

## 5. Accessibility Notes

- **Semantic element**: use `<header>` as the root element.
- **Keyboard operability**: all actions are native `<button>` elements and are focusable/activatable by default.
- **Focus indicator**: `:focus-visible` applies `--cba-focus-ring`.
- **Icon buttons**: each action button has a descriptive, dynamic `aria-label`.
  - Collapse/Expand label reflects `isCollapsed` state.
  - Size-toggle label reflects the target size.
- **Status icon**: use `aria-hidden="true"`. The status is decorative/secondary feedback; if screen-reader announcements are required, the consuming Shell/MFE should manage `aria-live` regions separately.
- **Color contrast**: status colors must meet WCAG AA against `--cba-bg-secondary`.
- **No title editing**: the title is plain text, preventing accidental inline edits.

## 6. Animation Rules

- **Spinner spin**: use the Font Awesome Angular binding (`[spin]="true"` or `animation="spin"` depending on installed `@fortawesome/angular-fontawesome` version). This produces a continuous 360° rotation.
- **Button transitions**: allow short CSS transitions (≤150 ms) for `background-color`, `color`, and `border-color` on hover/active/focus.
- **Reduced motion**: respect `prefers-reduced-motion` by disabling spinner animation and hover transitions when the user prefers reduced motion.

```scss
@media (prefers-reduced-motion: reduce) {
  .cba-module-header__action {
    transition: none;
  }

  fa-icon[spin] {
    animation: none;
  }
}
```

## 7. Edge Cases

| Scenario | Behaviour |
| --- | --- |
| `isFullscreen === true` | Render only the title section; hide status and actions. Header remains semantically a `<header>`. |
| `status === null` | Status section is empty but keeps its fixed width; title does not shift. |
| Long / multi-line title | Title wraps naturally; header `min-height` is 40 px and grows with content; actions remain top-aligned. |
| Empty `title` string | Title section renders no text but still occupies center space. Component does not fallback to a default. |
| `size` toggle | Button emits the opposite size (`'100%'` → `'50%'`, `'50%'` → `'100%'`). |
| `isCollapsed` change | Only the collapse button icon and label change; component does not internally mutate `isCollapsed`. |
| Missing required `title` | TypeScript strict mode enforces the input at compile time; runtime rendering shows blank if not provided. |

## 8. File Deliverables (for implementation phase)

| File | Purpose |
| --- | --- |
| `src/lib/components/module-header/module-header.component.ts` | Component class with inputs, outputs, signals, and status mapping. |
| `src/lib/components/module-header/module-header.component.html` | Template described in section 2. |
| `src/lib/components/module-header/module-header.component.scss` | Styles described in section 3. |
| `src/lib/components/module-header/module-header.types.ts` | Public `ModuleHeaderSize` and `ModuleHeaderStatus` types. |
| `src/lib/components/module-header/index.ts` | Barrel re-export of component and types. |
| `src/lib/components/module-header/module-header.component.spec.ts` | Unit tests (Jest). |

## 9. Acceptance Criteria

- [ ] Component selector is `cba-module-header` and it is standalone.
- [ ] All five inputs and four outputs match the contract with correct types and defaults.
- [ ] `ChangeDetectionStrategy.OnPush` is used.
- [ ] Fullscreen mode renders **only** the title; status and action buttons are absent from DOM.
- [ ] Status icon mapping matches section 4 exactly.
- [ ] Spinner icon animates continuously when status is `loading`.
- [ ] Layout uses three sections: fixed-width status, flexible centered title, fixed-width actions.
- [ ] Action buttons are native `<button>` elements with dynamic `aria-label`s.
- [ ] Hover, active, and focus-visible states use `--cba-hover`, `--cba-active`, `--cba-focus-ring`.
- [ ] Minimum header height is `var(--cba-module-header-min-height)` (40 px default).
- [ ] Library build (`npm run build`), lint (`npm run lint`), and tests (`npm test`) pass.
