# Implementation Plan — Demo Showcase Minor Fixes (Task 4)

**TODO:** `.agent/todos/20260819/20260819-todo-1.md` — sections "minor bug in Color tokens section", "Predefined icons section", "minimal style in Texts, fonts, labels section"
**Front-end spec:** `.kilo/plans/20260820-fix-demo-bugs-task4-frontend-spec.md`
**Scope:** Demo app only. **No library source changes** (`src/components/`, `src/theme/`, `public-api.ts` MUST NOT be touched).
**Target implementer:** JUNIOR developer, 50% restriction. Follow each step verbatim. Do NOT refactor, rename, or touch files outside the explicit list below.

---

## Pre-flight (read-only verification, do NOT modify)

1. Confirm the three target files exist exactly at:
   - `projects/demo/src/app/app.component.ts`
   - `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`
   - `projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.scss`
2. Confirm `module-header.component.ts` imports the 8 missing icons listed below (already verified by planner: lines 11–23). No action required; this is a read-only cross-check.

---

## Change 1 — Color tokens: `selected-text` swatch text invisible

**File:** `projects/demo/src/app/app.component.ts`

### Step 1.1 — Edit `needsSwatchInverseColor`

**OLD (lines 158–160):**
```ts
  private needsSwatchInverseColor(token: ColorToken): boolean {
    return token.tag === 'Text' && token.name !== 'text-inverse';
  }
```

**NEW:**
```ts
  private needsSwatchInverseColor(token: ColorToken): boolean {
    return (token.tag === 'Text' && token.name !== 'text-inverse') || token.name === 'selected-text';
  }
```

### Rationale (do not write in code)
`selected-text` has `tag: 'Selected'` and value `#2B2620` (dark). The current heuristic only inverts for `tag === 'Text'`, so the swatch label fell back to `--cba-text-primary` (`#2B2620`) on a `#2B2620` background → invisible. Adding the explicit `token.name === 'selected-text'` clause reuses the existing `--cba-bg-elevated` inverse path returned by `swatchColor()`. No new token, no new branch in `swatchColor()`.

### Verification (Change 1)
- Build: `npm run build:demo` (or the project's demo build script; if unavailable, `npm run build`).
- Visual: open the demo app, scroll to **Color tokens**, find the `selected-text` swatch. The label text MUST be the cream/elevated color (`#FDFCF8`) on the dark swatch.
- The `selected-bg` swatch (light `#E4DDD0`) MUST remain unchanged (default text color, no inverse).

---

## Change 2 — Predefined icons section: add module-header icons

**File:** `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`

### Step 2.1 — Extend the import block from `@fortawesome/free-solid-svg-icons`

**OLD (lines 3–19):**
```ts
import {
  faBell,
  faCalendar,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faDownload,
  faInbox,
  faPen,
  faPlus,
  faRefresh,
  faSearch,
  faTrash,
  faTriangleExclamation,
  faUser,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
```

**NEW (add 8 icons, keep alphabetical-ish ordering consistent with existing style — append the new names in the position shown):**
```ts
import {
  faBell,
  faCalendar,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faDownload,
  faInbox,
  faArrowsLeftRight,
  faArrowsLeftRightToLine,
  faPen,
  faPlus,
  faRefresh,
  faSearch,
  faSpinner,
  faTrash,
  faTriangleExclamation,
  faUpDownLeftRight,
  faUser,
  faGear,
  faWindowMaximize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

### Step 2.2 — Append 8 `IconEntry` objects to the `icons` array

Insert the new entries **after the last existing entry** (`faInbox` / 'Empty state', line 74) and before the closing `];` (line 75). Keep the existing 15 entries unchanged.

**OLD (lines 59–75):**
```ts
  protected readonly icons: IconEntry[] = [
    { icon: faBell, label: 'Notifications', ariaLabel: 'Notifications' },
    { icon: faUser, label: 'Profile', ariaLabel: 'Profile' },
    { icon: faGear, label: 'Settings', ariaLabel: 'Settings' },
    { icon: faPlus, label: 'Add', ariaLabel: 'Add' },
    { icon: faRefresh, label: 'Refresh', ariaLabel: 'Refresh' },
    { icon: faDownload, label: 'Download', ariaLabel: 'Download' },
    { icon: faSearch, label: 'Search', ariaLabel: 'Search' },
    { icon: faCalendar, label: 'Calendar', ariaLabel: 'Calendar' },
    { icon: faPen, label: 'Edit', ariaLabel: 'Edit' },
    { icon: faTrash, label: 'Delete', ariaLabel: 'Delete' },
    { icon: faCheck, label: 'Check', ariaLabel: 'Check' },
    { icon: faCircleCheck, label: 'Success', ariaLabel: 'Success' },
    { icon: faTriangleExclamation, label: 'Warning', ariaLabel: 'Warning' },
    { icon: faCircleXmark, label: 'Error', ariaLabel: 'Error' },
    { icon: faInbox, label: 'Empty state', ariaLabel: 'Empty state' },
  ];
```

**NEW (append 8 entries, in this exact order, mirroring the module-header usage sequence: drag → width → collapse → fullscreen → close → loading):**
```ts
  protected readonly icons: IconEntry[] = [
    { icon: faBell, label: 'Notifications', ariaLabel: 'Notifications' },
    { icon: faUser, label: 'Profile', ariaLabel: 'Profile' },
    { icon: faGear, label: 'Settings', ariaLabel: 'Settings' },
    { icon: faPlus, label: 'Add', ariaLabel: 'Add' },
    { icon: faRefresh, label: 'Refresh', ariaLabel: 'Refresh' },
    { icon: faDownload, label: 'Download', ariaLabel: 'Download' },
    { icon: faSearch, label: 'Search', ariaLabel: 'Search' },
    { icon: faCalendar, label: 'Calendar', ariaLabel: 'Calendar' },
    { icon: faPen, label: 'Edit', ariaLabel: 'Edit' },
    { icon: faTrash, label: 'Delete', ariaLabel: 'Delete' },
    { icon: faCheck, label: 'Check', ariaLabel: 'Check' },
    { icon: faCircleCheck, label: 'Success', ariaLabel: 'Success' },
    { icon: faTriangleExclamation, label: 'Warning', ariaLabel: 'Warning' },
    { icon: faCircleXmark, label: 'Error', ariaLabel: 'Error' },
    { icon: faInbox, label: 'Empty state', ariaLabel: 'Empty state' },
    { icon: faUpDownLeftRight, label: 'Drag', ariaLabel: 'Drag' },
    { icon: faArrowsLeftRight, label: 'Expand width', ariaLabel: 'Expand width' },
    { icon: faArrowsLeftRightToLine, label: 'Shrink width', ariaLabel: 'Shrink width' },
    { icon: faChevronUp, label: 'Collapse', ariaLabel: 'Collapse' },
    { icon: faChevronDown, label: 'Expand', ariaLabel: 'Expand' },
    { icon: faWindowMaximize, label: 'Fullscreen', ariaLabel: 'Fullscreen' },
    { icon: faXmark, label: 'Close', ariaLabel: 'Close' },
    { icon: faSpinner, label: 'Loading', ariaLabel: 'Loading' },
  ];
```

### Notes
- Labels stay in English to match existing grid convention (section caption is English).
- `faSpinner` is rendered as a static icon by the existing `cba-button` icon-only ghost pattern; the spin animation used in `module-header` is a module-header concern and MUST NOT be replicated here (the grid is a static icon catalog).
- Do NOT modify the template or SCSS of `demo-icon-grid`. The existing grid CSS already wraps new cells correctly.

### Verification (Change 2)
- Build: `npm run build:demo` (or `npm run build`).
- Visual: scroll to **Predefined icons**. Count cells: MUST be 23 (15 original + 8 new).
- Confirm each new icon renders as an icon-only ghost button with the exact English `aria-label` listed above. Spot-check `Drag`, `Expand width`, `Shrink width`, `Collapse`, `Expand`, `Fullscreen`, `Close`, `Loading`.

---

## Change 3 — Texts, fonts, labels: border for `bg-primary` panel

**File:** `projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.scss`

### Step 3.1 — Add border to `.demo-text-panel--primary`

**OLD (lines 24–26):**
```scss
.demo-text-panel--primary {
  background: var(--cba-bg-primary);
}
```

**NEW:**
```scss
.demo-text-panel--primary {
  background: var(--cba-bg-primary);
  border: 1px solid var(--cba-border-strong);
}
```

### Rationale (do not write in code)
The demo workspace background (`.demo-app`) also uses `--cba-bg-primary`, so the primary panel had no visible edge. `--cba-border-strong` (`#6B665E`) is the brief.md §5 token for structural edges on darker surfaces. The other three panels already contrast against the workspace and MUST NOT receive a border (spec acceptance criterion 3).

### Verification (Change 3)
- Build: `npm run build:demo` (or `npm run build`).
- Visual: scroll to **Texts, fonts, labels**. The `bg-primary` panel MUST show a visible thin border. The `bg-secondary`, `bg-elevated`, and `bg-tertiary` panels MUST remain borderless.

---

## Post-implementation checks (all three changes)

1. **Scope guard:** run `git status`. The ONLY modified files MUST be:
   - `projects/demo/src/app/app.component.ts`
   - `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts`
   - `projects/demo/src/app/components/demo-text-showcase/demo-text-showcase.component.scss`
   If any file under `src/`, `projects/demo/src/app/components/demo-*/` (other than the two listed), or `public-api.ts` appears, STOP and report to caller.
2. **No new tokens:** grep the diff for `--cba-` and confirm no new CSS custom properties are introduced; only existing tokens are referenced.
3. **Build:** run the demo build command. It MUST succeed with zero new errors/warnings related to the three changed files.
4. **Lint/typecheck:** if a `npm run lint` or `npm run typecheck` script exists, run it; resolve any errors introduced by the changes only (do not touch pre-existing unrelated issues).
5. **Diagnostics:** run the VS Code diagnostics on the two changed `.ts` files; zero errors.

## Commit (single commit, after all 3 changes pass checks)

Commit message (verbatim):
```
fix(demo): show selected-text swatch, add header icons, border bg-primary panel

- Color tokens: invert selected-text swatch foreground via existing
  --cba-bg-elevated token (demo heuristic only).
- Predefined icons: add the 8 module-header icons (drag, width expand/
  shrink, collapse/expand, fullscreen, close, loading) to the demo grid.
- Texts showcase: border the bg-primary panel with --cba-border-strong
  so it separates from the workspace background.
```

Stage only the three files listed in the Scope guard. Do NOT push.

## Out of scope (DO NOT do)
- Any change to `src/components/module-header/*` or any other library file.
- Reordering existing icon entries (only append).
- Adding the `spin` animation to the `Loading` icon cell.
- Borders on the secondary/elevated/tertiary text panels.
- Any change to `swatchColor()` beyond the `needsSwatchInverseColor` return clause.
- Version bump, CHANGELOG, branch creation — handled by other Critical Workflow steps.
