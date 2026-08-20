# Implementation Plan — Task 1: Module Layout Fixes

- **TODO**: `.agent/todos/20260819/20260819-todo-1.md` (items: *modules footer*, *modules at 50% mode all wrong*, *modules header btns*)
- **Front-end spec**: `.kilo/plans/20260820-fix-demo-bugs-task1-frontend-spec.md`
- **Plan target**: JUNIOR developer under 50% restriction. All structural/architectural decisions are encoded below. Do NOT make any choice not specified; if a choice appears necessary, STOP and ask the caller.

## Scope

Three bugs only:

1. **Bug 1 — modules footer**: footer inside the module container chrome, status right-aligned as `[text][icon]`, hidden when collapsed, correct width at 50%.
2. **Bug 2 — modules header btns**: add a no-op `faUpDownLeftRight` drag icon as the **first built-in** action (position 1, after the projected slot at position 0).
3. **Bug 3 — modules at 50% mode all wrong**: 50% modules take exactly half of the workspace content width minus half the gutter, in both paired and single rows.

### Out of scope (do NOT touch)

- `app.component.html`, `app.component.scss`
- `module-container.component.*`
- `module-header.component.scss` (the `.cba-module-header__action--drag` modifier already exists with `cursor: grab`/`grabbing` — reuse it, do not edit)
- `CBA_MODULE_FOOTER.md`, `CBA_MODULE_CONTAINER.md`
- All other TODO items (header search input, color tokens, buttons/pills, predefined icons, texts/fonts/labels, footer bar btns, button/pill sizes)
- Version bump and `CHANGELOG.md` — owned by Critical Workflow **Step 3**, NOT this plan. Do NOT edit `package.json` or `CHANGELOG.md`.
- Git branch creation/switch/push — owned by Steps 2 and 5. Only commit on the current feature branch.

## Pre-flight (read-only verification, no edits)

Run these reads to confirm starting state matches this plan before editing:

1. `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` — confirm `<cba-module-footer>` is currently OUTSIDE `<cba-module-container>` (lines 44–47).
2. `src/components/module-footer/module-footer.component.html` — confirm icon is rendered before text (lines 9–14).
3. `src/components/module-footer/module-footer.component.scss` — confirm `.cba-module-footer` has NO `justify-content` (lines 5–14).
4. `src/components/module-header/module-header.component.ts` — confirm no `faUpDownLeftRight` import and no `faDrag` field.
5. `src/components/module-header/module-header.component.html` — confirm no built-in drag button before the collapse button.
6. `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss` — confirm `.workspace__row { display: flex }` and the ineffective `.workspace__row--single-50 .demo-module-card--size-50 { flex: 0 0 50% }` rule.
7. `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss` — confirm the ineffective `.demo-module-card--size-50 { flex: 0 0 calc(50% - var(--cba-space-3) / 2) }` rule.

If any file does not match the expected starting state, STOP and ask the caller.

## Known constraint conflict (do NOT resolve here)

`src/components/module-header/module-header.component.ts` is currently **215 lines**, already exceeding the 200-line `src/` limit (`.kilo/rules/max-lines-per-file.md`). This plan adds **+3 lines** (one import entry, one JSDoc line, one field assignment), bringing it to ~218. Line reduction/refactor is **out of scope** for Task 1 (pre-existing non-compliance). Proceed exactly as specified; do NOT split or refactor the file to compensate.

---

## Bug 1 — modules footer

### Step 1.1 — Move footer inside the container

**File**: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

Replace the entire `template:` inline string (current lines 28–49) with the exact text below. The only structural change: the `@if (hasFooter) { ... }` block moves from AFTER `</cba-module-container>` to INSIDE it, immediately after `<ng-content />` (indented one extra level). All attributes, bindings, and `(event)="noop()"` handlers stay identical.

Old (exact):

```ts
  template: `
    <div class="demo-module-card" [class.demo-module-card--size-50]="size === '50%'">
      <cba-module-container [size]="size" [padding]="padding" [isCollapsed]="isCollapsed">
        <cba-module-header
          cbaModuleContainerHeader
          [title]="title"
          [size]="size"
          [isCollapsed]="isCollapsed"
          [isFullscreen]="false"
          [status]="status"
          (collapseToggle)="noop()"
          (sizeToggle)="noop()"
          (fullscreenToggle)="noop()"
          (remove)="noop()"
        />
        <ng-content />
      </cba-module-container>
      @if (hasFooter) {
        <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
      }
    </div>
  `,
```

New (exact):

```ts
  template: `
    <div class="demo-module-card" [class.demo-module-card--size-50]="size === '50%'">
      <cba-module-container [size]="size" [padding]="padding" [isCollapsed]="isCollapsed">
        <cba-module-header
          cbaModuleContainerHeader
          [title]="title"
          [size]="size"
          [isCollapsed]="isCollapsed"
          [isFullscreen]="false"
          [status]="status"
          (collapseToggle)="noop()"
          (sizeToggle)="noop()"
          (fullscreenToggle)="noop()"
          (remove)="noop()"
        />
        <ng-content />
        @if (hasFooter) {
          <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
        }
      </cba-module-container>
    </div>
  `,
```

### Step 1.2 — Update the class JSDoc (correctness)

**File**: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

The current JSDoc (lines 11–22) states the footer is rendered OUTSIDE the container so it stays visible when collapsed. That is now false. Replace the single sentence:

Old (exact):

```
 * Optionally renders a `cba-module-footer` OUTSIDE the container so the
 * footer stays visible even when the module body is collapsed.
```

New (exact):

```
 * Optionally renders a `cba-module-footer` INSIDE the container so the
 * footer shares the module chrome (rounded border + shadow) and is removed
 * from the DOM when the module body is collapsed.
```

Do not change any other line of the JSDoc.

### Step 1.3 — Reverse status children order (text before icon)

**File**: `src/components/module-footer/module-footer.component.html`

Inside `.cba-module-footer__status`, swap the two `@if` blocks so the text `<span>` renders before the `<fa-icon>`.

Old (exact, lines 9–14):

```html
      @if (statusVisual(); as visual) {
        <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true" />
      }
      @if (displayText()) {
        <span class="cba-module-footer__text">{{ displayText() }}</span>
      }
```

New (exact):

```html
      @if (displayText()) {
        <span class="cba-module-footer__text">{{ displayText() }}</span>
      }
      @if (statusVisual(); as visual) {
        <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true" />
      }
```

Leave the surrounding `<div class="cba-module-footer__status" ...>` and the `<ng-content></ng-content>` lines untouched.

### Step 1.4 — Right-align the footer status

**File**: `src/components/module-footer/module-footer.component.scss`

Add `justify-content: flex-end;` to the `.cba-module-footer` rule. Insert it as a new line immediately after `align-items: center;` (current line 7). Do not remove or reorder any existing declaration.

Old (exact, lines 5–14):

```scss
.cba-module-footer {
  display: flex;
  align-items: center;
  height: var(--cba-module-footer-height, 40px);
  padding: 0 var(--cba-space-4);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-tertiary);
  overflow: hidden;
  box-sizing: border-box;
}
```

New (exact):

```scss
.cba-module-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: var(--cba-module-footer-height, 40px);
  padding: 0 var(--cba-space-4);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-tertiary);
  overflow: hidden;
  box-sizing: border-box;
}
```

Do not edit `.cba-module-footer__status` or any other rule in this file.

---

## Bug 2 — modules header btns (add no-op drag icon)

### Step 2.1 — Add the icon import

**File**: `src/components/module-header/module-header.component.ts`

Add `faUpDownLeftRight,` to the existing `@fortawesome/free-solid-svg-icons` import block, in alphabetical position — immediately AFTER `faTriangleExclamation,` and BEFORE `faWindowMaximize,`. Do NOT create a separate `import` statement (a duplicate import from the same module triggers lint errors).

Old (exact, lines 20–22):

```ts
  faTriangleExclamation,
  faWindowMaximize,
  faXmark,
```

New (exact):

```ts
  faTriangleExclamation,
  faUpDownLeftRight,
  faWindowMaximize,
  faXmark,
```

### Step 2.2 — Expose the icon as a template field

**File**: `src/components/module-header/module-header.component.ts`

Add a new `protected readonly` field immediately AFTER the `faXmark` field (current line 177) and BEFORE the `aria` field (current line 179). Use this exact text (2 lines: JSDoc + assignment):

```ts
  /** Drag-handle icon shown as the first built-in action (no-op in this library). Template-referenced. */
  protected readonly faDrag = faUpDownLeftRight;
```

### Step 2.3 — Render the no-op drag button in the template

**File**: `src/components/module-header/module-header.component.html`

Add a new `<button>` immediately AFTER the projected drag-handle slot line (`<ng-content select="[cbaModuleDragHandle]"></ng-content>`) and BEFORE the collapse button. The button has NO `(click)` handler (no-op). It reuses the existing `.cba-module-header__action` and `.cba-module-header__action--drag` classes (the `--drag` modifier already provides `cursor: grab`/`grabbing` in `module-header.component.scss` — do NOT edit that file).

Old (exact, lines 5–6):

```html
    <ng-content select="[cbaModuleDragHandle]"></ng-content>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="collapseLabel()" [title]="collapseLabel()" (click)="collapseToggle.emit()">
```

New (exact):

```html
    <ng-content select="[cbaModuleDragHandle]"></ng-content>
    <button
      type="button"
      class="cba-module-header__action cba-module-header__action--drag"
      aria-label="Arrastrar módulo"
      title="Arrastrar módulo">
      <fa-icon [icon]="faDrag" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="collapseLabel()" [title]="collapseLabel()" (click)="collapseToggle.emit()">
```

Do NOT modify the collapse, size-toggle, fullscreen, or remove buttons.

### Step 2.4 — Update the docs "Icon order" table

**File**: `docs/CBA_MODULE_HEADER.md`

Replace the table under `## Icon order` (current lines 123–129) and the preceding intro sentence stays as-is. Replace the exact block:

Old (exact, lines 123–129):

```markdown
| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 1 | Collapse / expand | `up-down` (collapsed) / `up-down` (expanded) | `collapseToggle` |
| 2 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` (at 100%) / `arrows-left-right` (at 50%) | `sizeToggle` |
| 3 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 4 | Remove | `xmark` | `remove` |
```

New (exact):

```markdown
| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 0 | Drag handle (projected, Shell-owned) | Shell-provided | — |
| 1 | Drag (no-op) | `faUpDownLeftRight` | — |
| 2 | Collapse / expand | `chevron-up` / `chevron-down` | `collapseToggle` |
| 3 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` / `arrows-left-right` | `sizeToggle` |
| 4 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 5 | Remove | `xmark` | `remove` |
```

### Step 2.5 — Update the projected-slot note under "Icon order"

**File**: `docs/CBA_MODULE_HEADER.md`

The note block immediately after the table (current lines 132–135) becomes partially inaccurate because position 1 is now always rendered. Replace it.

Old (exact, lines 132–135):

```markdown
> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered **before**
> the built-in actions (position 0) and is **not** part of the library's fixed
> set. The library renders nothing in that position when the slot is empty.
```

New (exact):

```markdown
> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered at
> position 0, before the built-in no-op drag icon (position 1) and the rest of
> the fixed action set. The library renders nothing at position 0 when the slot
> is empty; position 1 is always rendered as a no-op drag affordance.
```

### Step 2.6 — Update the "Drag handle slot" bullet

**File**: `docs/CBA_MODULE_HEADER.md`

The last bullet in the `Rules:` list under `## Drag handle slot` (current line 156) is now inaccurate.

Old (exact, line 156):

```markdown
- When nothing is projected, the actions layout is unchanged (no empty gap, no default button).
```

New (exact):

```markdown
- When nothing is projected at position 0, no empty gap is left; the built-in no-op drag button (position 1) is always rendered.
```

---

## Bug 3 — modules at 50% mode all wrong

### Step 3.1 — Replace the workspace layout with a grid

**File**: `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`

Replace the ENTIRE file content with the exact text below. Changes: `.workspace__row` becomes a 2-column grid (`repeat(2, 1fr)`); a new `.workspace__row--single-50` rule sets `grid-template-columns: 50% 1fr`; the old ineffective `.workspace__row--single-50 .demo-module-card--size-50 { flex: 0 0 50% }` rule is removed. `.workspace`, `.demo-actions`, and `:host` are unchanged.

New full file content (exact):

```scss
// Demo-only workspace section — module examples rows. Uses theme tokens only.

:host {
  display: block;
}
.workspace {
  padding: var(--cba-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}
.workspace__row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--cba-space-3);
}
.workspace__row--single-50 {
  grid-template-columns: 50% 1fr;
}
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cba-space-2);
}
```

### Step 3.2 — Override the library container's 50% host width

**File**: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`

Replace the ENTIRE file content with the exact text below. Changes: remove the old ineffective `.demo-module-card--size-50 { flex: 0 0 calc(50% - var(--cba-space-3) / 2) }` rule; add `.demo-module-card { width: 100% }` so the card fills its grid cell; add a selector that forces the library container to fill the card cell, overriding `:host(.cba-module-container--size-50) { width: 50% }` from `src/components/module-container/module-container.component.scss`.

New full file content (exact):

```scss
// Demo-only module-card: module container + projected body + optional footer.
// Uses theme tokens only.

:host {
  display: block;
}
.demo-module-card {
  width: 100%;
}
.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50 {
  width: 100%;
}
```

The selector `cba-module-container.cba-module-container--size-50` matches the container's host element, which carries the `cba-module-container` and `cba-module-container--size-50` classes (host bindings in `module-container.component.ts`). The `>` direct-child combinator matches because `cba-module-container` is a direct child of the `.demo-module-card--size-50` div. This rule has higher specificity than the library's `:host(.cba-module-container--size-50)` rule and wins, so the container fills the full card cell (which is already half the workspace in 50% mode).

Do NOT edit `module-container.component.scss` or any library file for Bug 3.

---

## Build & lint verification

Run each command separately (no chaining). All must pass before declaring completion.

1. `npm run build:lib`
2. `npm run build:demo`
3. `npm run lint`

If any command fails, STOP, report the exact error output, and ask the caller. Do NOT attempt to fix unrelated errors outside the scope above.

## Manual visual verification checklist

Serve the demo (`npm run start:demo`) and confirm each row in the workspace matches:

- [ ] **Row 1 (expanded 100%, footer)**: footer is inside the module's rounded border + shadow, flush with the bottom edge; status text (`3 customers · total debt $ 1,730,000`) appears LEFT of the status icon, both aligned to the RIGHT edge of the footer bar.
- [ ] **Row 2 (collapsed 100%, no footer)**: no footer visible; header only.
- [ ] **Row 3 (two expanded 50%, footers)**: the two modules sit side by side, each occupying half the workspace content width minus half the gutter; both footers are inside their respective module chrome and constrained to the module width.
- [ ] **Row 4 (two collapsed 50%, footers)**: both modules collapsed, footers NOT visible (removed from DOM).
- [ ] **Row 5 (single expanded 50%, empty right)**: the module occupies exactly the LEFT half of the workspace; the right half is empty.
- [ ] **Row 6 (single collapsed 50%, empty right)**: module collapsed, footer NOT visible; right half empty.
- [ ] **Every module header**: a four-arrow drag icon (`faUpDownLeftRight`) is the leftmost BUILT-IN action icon, before the collapse chevron. It shows the `grab` cursor (not `pointer`) and performs no action when clicked. Collapse / size-toggle / fullscreen / remove icons still work (no-op handlers in demo) and appear to the right of the drag icon.

## Acceptance criteria (from front-end spec)

- [ ] Footer is visually inside the module rounded container in both 100% and 50% expanded modes.
- [ ] Footer is hidden when the module is collapsed.
- [ ] Footer status text renders before the status icon and is right-aligned within the footer.
- [ ] Drag icon is the first built-in action in the module header and is visually consistent with the other icons (same 32×32 hit target, hover/active states, focus ring, grab cursor).
- [ ] 50% modules render at the correct width in both paired and single rows.
- [ ] `npm run build:lib` and `npm run build:demo` complete without errors.
- [ ] `npm run lint` passes.

## Commit

After all edits pass build + lint, make ONE commit on the current feature branch (do NOT push — push is Step 5):

```
git add projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts \
        projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss \
        projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss \
        src/components/module-footer/module-footer.component.html \
        src/components/module-footer/module-footer.component.scss \
        src/components/module-header/module-header.component.ts \
        src/components/module-header/module-header.component.html \
        docs/CBA_MODULE_HEADER.md
git commit -m "fix(module): integrate footer into container, correct 50% width, add header drag icon"
```

Before committing, run `git status` and confirm no `.gitignore`-matching files (e.g. `node_modules/`, `dist/`) are staged. Unstage any that are.

## Summary of files changed

| File | Bug | Change |
| --- | --- | --- |
| `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` | 1 | Move `<cba-module-footer>` inside `<cba-module-container>`; update JSDoc |
| `src/components/module-footer/module-footer.component.html` | 1 | Render status text before icon |
| `src/components/module-footer/module-footer.component.scss` | 1 | Add `justify-content: flex-end` |
| `src/components/module-header/module-header.component.ts` | 2 | Import `faUpDownLeftRight`; add `faDrag` field |
| `src/components/module-header/module-header.component.html` | 2 | Add no-op drag button at position 1 |
| `docs/CBA_MODULE_HEADER.md` | 2 | Update Icon order table + slot notes |
| `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss` | 3 | Flex row → 2-col grid; `--single-50` → `50% 1fr` |
| `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss` | 3 | Card `width: 100%`; override container 50% host width |

Total: 8 files. No new files. No deleted files.
