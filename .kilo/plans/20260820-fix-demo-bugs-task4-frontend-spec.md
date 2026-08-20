# Front-end Technical Specification — Demo Showcase Minor Fixes

**Scope:** Task 4 from `.agent/todos/20260819/20260819-todo-1.md`  
**Covers:**
1. Color tokens — `selected-text` swatch text not visible.
2. Predefined icons section — missing module-header icons.
3. Texts, fonts, labels section — `bg-primary` panel lacks border.

**Fix ownership:** All three issues are **demo-app only**; no library source (`src/components/`, `src/theme/`, `public-api.ts`) needs to change.

---

## 1. Color tokens — `selected-text` text invisible

### Root cause
`projects/demo/src/app/app.component.ts` computes the swatch foreground color via `swatchColor()` → `needsSwatchInverseColor()`. The inverse color (`var(--cba-bg-elevated)`) is applied only when `token.tag === 'Text' && token.name !== 'text-inverse'`.

The `selected-text` token has `tag: 'Selected'` and value `#2B2620` (dark). Because its tag is not `'Text'`, the swatch foreground falls back to the default `--cba-text-primary` (`#2B2620`), which is identical to the swatch background, rendering the label invisible.

### Fix ownership
**Demo app.** The token value and library contract are correct; only the demo swatch color-contrast heuristic is incomplete.

### Exact file path
- `projects/demo/src/app/app.component.ts`

### Change
Update `needsSwatchInverseColor()` so `selected-text` is treated as a dark text color that requires inverse foreground:

```ts
private needsSwatchInverseColor(token: ColorToken): boolean {
  return (token.tag === 'Text' && token.name !== 'text-inverse') || token.name === 'selected-text';
}
```

This reuses the existing `--cba-bg-elevated` token already returned by `swatchColor()`.

---

## 2. Predefined icons section — include module-header icons

### Root cause
`projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts` lists a subset of Font Awesome icons, but it does not include the icons rendered by `src/components/module-header/module-header.component.ts`. Consumers reviewing the icon grid cannot see the header's action/status icons.

Icons used in `module-header.component.ts`:
- `faArrowsLeftRight`
- `faArrowsLeftRightToLine`
- `faCheck`
- `faChevronDown`
- `faChevronUp`
- `faCircleCheck`
- `faCircleXmark`
- `faPen`
- `faSpinner`
- `faTriangleExclamation`
- `faUpDownLeftRight`
- `faWindowMaximize`
- `faXmark`

Already present in the demo grid: `faCheck`, `faCircleCheck`, `faCircleXmark`, `faPen`, `faTriangleExclamation`.

Missing icons: `faArrowsLeftRight`, `faArrowsLeftRightToLine`, `faChevronDown`, `faChevronUp`, `faSpinner`, `faUpDownLeftRight`, `faWindowMaximize`, `faXmark`.

### Fix ownership
**Demo app.** The icon grid is a demo-only showcase, not part of the public library API.

### Exact file path
- `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`

### Change
Import the missing icons from `@fortawesome/free-solid-svg-icons` and append the corresponding `IconEntry` objects to the `icons` array. Use the same icon-only ghost button pattern already in place.

```ts
import {
  faArrowsLeftRight,
  faArrowsLeftRightToLine,
  faChevronDown,
  faChevronUp,
  faSpinner,
  faUpDownLeftRight,
  faWindowMaximize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

Append to `icons`:

```ts
{ icon: faUpDownLeftRight, label: 'Drag', ariaLabel: 'Drag' },
{ icon: faArrowsLeftRight, label: 'Expand width', ariaLabel: 'Expand width' },
{ icon: faArrowsLeftRightToLine, label: 'Shrink width', ariaLabel: 'Shrink width' },
{ icon: faChevronUp, label: 'Collapse', ariaLabel: 'Collapse' },
{ icon: faChevronDown, label: 'Expand', ariaLabel: 'Expand' },
{ icon: faWindowMaximize, label: 'Fullscreen', ariaLabel: 'Fullscreen' },
{ icon: faXmark, label: 'Close', ariaLabel: 'Close' },
{ icon: faSpinner, label: 'Loading', ariaLabel: 'Loading' },
```

Labels must remain in English to match the existing grid convention and section caption.

---

## 3. Texts, fonts, labels — border for `bg-primary` panel

### Root cause
`projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.scss` defines `demo-text-panel--primary` with `background: var(--cba-bg-primary)`. The demo app workspace also uses `--cba-bg-primary` (`.demo-app` background), so the `bg-primary` text panel blends into the workspace and has no visible edge.

### Fix ownership
**Demo app.** This is a demo-only presentation issue; the library text color utilities and tokens are correct.

### Exact file path
- `projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.scss`

### Change
Add a visible border to the `bg-primary` panel using the existing strong border token, which provides enough contrast against the canvas background:

```scss
.demo-text-panel--primary {
  background: var(--cba-bg-primary);
  border: 1px solid var(--cba-border-strong);
}
```

`--cba-border-strong` (`#6B665E`) is the correct choice for structural edges on darker surfaces per `brief.md` §5. No other panels need a border because they already contrast against the workspace background.

---

## Acceptance criteria

1. The `selected-text` swatch in the **Color tokens** section displays white/cream text (`--cba-bg-elevated`) on the dark swatch.
2. The **Predefined icons** section shows every icon imported by `module-header.component.ts`, each rendered as an icon-only ghost button with an English `aria-label`.
3. The **bg-primary** panel in the **Texts, fonts, labels** section has a visible `1px solid var(--cba-border-strong)` border and does not blend into the workspace background.
4. No files outside the `projects/demo/` directory are modified.
5. Existing `--cba-*` tokens are reused; no new tokens are introduced.
