# Front-end Technical Specification — `CbaModuleFooter`

**Task:** Task 4 of `.agent/todos/20260730/20260730-todo-4.md` — Implement `CbaModuleFooter`.
**Project:** `@cobranza-apps/ui` — Angular 22 standalone component library.
**Date:** 2026-07-31

## 1. API surface

### 1.1 Component

| Item | Value |
| --- | --- |
| Class | `ModuleFooterComponent` |
| Selector | `cba-module-footer` |
| Change detection | `OnPush` |
| Encapsulation | `Emulated` (default) |
| Standalone | Yes |

### 1.2 Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `ModuleHeaderStatus` | `null` | Reuses the `ModuleHeaderStatus` union defined in `src/components/module-header/module-header.types.ts` so footer status semantics stay locked to header status semantics. |
| `statusText` | `string` | `undefined` | Explicit text override. When provided, it is rendered verbatim and the default mapping is ignored. |

### 1.3 Content projection

| Slot | Description |
| --- | --- |
| Default (`<ng-content></ng-content>`) | Optional plain content projected into the footer, rendered after the status region. Useful for small auxiliary labels or links. The component does not style projected content beyond the container layout. |

### 1.4 Public type contract

- The footer imports `ModuleHeaderStatus` from `src/components/module-header/module-header.types.ts`.
- No new public type is introduced; consumers already referencing `ModuleHeaderStatus` continue to work.
- Internal helper: a readonly record `STATUS_TEXTS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, string>>` holds the default strings.

## 2. File structure

> Note: The TODO draft mentions `src/lib/components/module-footer/`, but the actual project structure and `public-api.ts` use `src/components/`. This specification targets the project-correct path.

```text
src/components/module-footer/
├── index.ts                    # barrel: exports component and re-exports ModuleHeaderStatus
├── module-footer.component.ts  # component logic + JSDoc
├── module-footer.component.html
└── module-footer.component.scss
```

`src/public-api.ts` adds:

```ts
export * from './components/module-footer';
```

in the components group (alphabetical order, after `module-container`, before `module-header`).

## 3. Styling rules

### 3.1 Layout

```scss
.cba-module-footer {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 var(--cba-space-4);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-secondary);
  border-top: none;          // v1 is intentionally plain; no heavy separators
  box-shadow: none;          // v1 keeps it secondary to the header
  overflow: hidden;
}
```

- **Height:** fixed `40px` (same as `ModuleHeader` minimum height for visual rhythm).
- **Padding:** horizontal `var(--cba-space-4)` (`16px`). Vertical centering via flexbox.
- **Gap:** `var(--cba-space-2)` (`8px`) between icon and text, and between status region and projected content.

### 3.2 Status region

```scss
.cba-module-footer__status {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-2);
  font-size: 14px;
  line-height: 1.5;
}
```

The status region is only rendered when `status !== null || statusText` (or if an icon is desired for `null`? No — no status icon/text for `null`).

### 3.3 Text colors per status

| Status | Color token | Rationale |
| --- | --- | --- |
| `loading` | `var(--cba-accent-info)` | Ongoing operation, informative. |
| `loaded` | `var(--cba-accent-success)` | Positive readiness. |
| `success` | `var(--cba-accent-success)` | Strong positive save confirmation. |
| `warning` | `var(--cba-accent-warning)` | Needs attention. |
| `error` | `var(--cba-accent-danger)` | Failure state. |
| `dirty` | `var(--cba-text-secondary)` | Subtle, non-alarming unsaved indicator. |
| `null` | (no status text) | — |

Color is applied via a generated modifier class:

```scss
.cba-module-footer__status--loading  { color: var(--cba-accent-info); }
.cba-module-footer__status--loaded   { color: var(--cba-accent-success); }
.cba-module-footer__status--success  { color: var(--cba-accent-success); }
.cba-module-footer__status--warning  { color: var(--cba-accent-warning); }
.cba-module-footer__status--error    { color: var(--cba-accent-danger); }
.cba-module-footer__status--dirty    { color: var(--cba-text-secondary); }
```

### 3.4 Icon

A small status icon is included in v1, placed to the left of the status text. It mirrors the semantic icon mapping used by `ModuleHeader`:

| Status | Icon | Animation |
| --- | --- | --- |
| `loading` | `faSpinner` | `spin` |
| `loaded` | `faCheck` | — |
| `success` | `faCircleCheck` | — |
| `warning` | `faTriangleExclamation` | — |
| `error` | `faCircleXmark` | — |
| `dirty` | `faPen` | — |

Icon size: `0.875em` (14px on 16px root) or match line-height. Use `FontAwesome` `FaIconComponent` with `[icon]` and optional `[spin]`.

The icon is hidden from assistive technology with `aria-hidden="true"`; the text carries the semantic meaning.

## 4. Status text mapping

When `statusText` is not provided, the footer derives text from `status` using the following exact default strings:

| Status | Default text |
| --- | --- |
| `loading` | `Loading…` |
| `loaded` | `Ready` |
| `success` | `Saved` |
| `warning` | `Attention needed` |
| `error` | `Error` |
| `dirty` | `Unsaved changes` |
| `null` | (nothing rendered) |

If `statusText` is provided, it always wins and is rendered with the color associated with the current `status` (or the neutral secondary color when `status` is `null`).

## 5. Template structure

```html
<footer class="cba-module-footer">
  @if (status() !== null || statusText()) {
    <div
      class="cba-module-footer__status"
      [class]="statusClass()"
      role="status"
      aria-live="polite"
      aria-atomic="true">
      @if (statusVisual(); as visual) {
        <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true"></fa-icon>
      }
      <span class="cba-module-footer__text">{{ displayText() }}</span>
    </div>
  }

  <ng-content></ng-content>
</footer>
```

Notes:
- `status()` and `statusText()` are Angular 22 signals (using `input()` API).
- `statusVisual()` returns the icon config or `null` when `status() === null`.
- `statusClass()` returns `cba-module-footer__status--{{status}}` or `null`.
- `displayText()` returns `statusText()` if present, otherwise the mapped default, otherwise `''`.
- The `footer` element is always rendered so projected content can be placed; if neither status nor projected content exists, consumers should simply not use the component.

## 6. Accessibility notes

- **Semantic element:** use `<footer>` for the root.
- **Live region:** the status text wrapper uses `role="status"`, `aria-live="polite"`, `aria-atomic="true"` so screen-reader users are notified when the status changes.
- **Decorative icon:** the icon is `aria-hidden="true"`; meaning is conveyed by text.
- **No focusable elements** are introduced by the component itself; projected content remains responsible for its own keyboard/a11y behavior.
- **Color:** status colors rely on `--cba-*` accent tokens already expected to meet WCAG AA contrast against `--cba-bg-secondary`.

## 7. Test strategy

Use Jest + `@angular/core/testing` (or Angular Testing Library if already installed). Tests live at `src/components/module-footer/module-footer.component.spec.ts`.

### Required test cases

1. **Default text per status**  
   For each non-null status value, render `<cba-module-footer [status]="status">` and assert the mapped default text is present.

2. **`statusText` override wins**  
   Render with `[status]="'dirty'"` and `[statusText]="'Draft mode active'"` and assert the custom text is shown and the default `Unsaved changes` is not.

3. **No status output for `null` and no projection**  
   Render with `[status]="null"` and no projected content; assert no status text, no icon, and no live-region status wrapper is present.

4. **Projected content renders**  
   Render with projected plain text; assert it appears inside the footer regardless of `status`.

5. **Icon mirrors header semantics**  
   For each non-null status, assert the rendered `<fa-icon>` uses the same icon definition as `ModuleHeader`.

6. **Color classes are applied per status**  
   For each non-null status, assert the status wrapper has the expected modifier class (e.g., `--error`).

7. **Build succeeds**  
   `npm run build` must complete with no errors.

## 8. Example usage

```html
<cba-module-container [size]="'100%'" [isCollapsed]="false">
  <cba-module-header
    title="Invoice Editor"
    [status]="headerStatus">
  </cba-module-header>

  <div class="module-body">
    <!-- MFE content -->
  </div>

  <cba-module-footer [status]="'dirty'">
    Changes are not saved automatically.
  </cba-module-footer>
</cba-module-container>
```

Result: footer renders the pencil icon + `Unsaved changes` text in the dirty color, followed by the projected hint text.

## 9. Acceptance criteria for implementation

- [ ] `ModuleFooterComponent` exists as a standalone component under `src/components/module-footer/`.
- [ ] `status` input uses `ModuleHeaderStatus` imported from `module-header.types.ts`.
- [ ] Default status text mapping matches Section 4 exactly.
- [ ] `statusText` input overrides default mapping.
- [ ] Small status icon is rendered for non-null statuses and matches `ModuleHeader` icon semantics.
- [ ] Background, height, padding, and text colors use only `--cba-*` tokens.
- [ ] Component is exported from `src/components/module-footer/index.ts` and re-exported from `src/public-api.ts`.
- [ ] JSDoc includes the dirty-status example and notes the relationship with `ModuleHeader` status values.
- [ ] Minimal spec file covers all test cases in Section 7.
- [ ] `npm run build`, `npm run lint`, and `npm test` pass.
