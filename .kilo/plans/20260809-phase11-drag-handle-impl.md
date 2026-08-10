# Implementation Plan — Phase 11: ModuleHeader optional drag-handle projection slot

**Task:** Replace the built-in drag button in `ModuleHeader` with an optional content-projection slot (`[cbaModuleDragHandle]`) so the Shell can project a `cdkDragHandle`-wired element without the UI library depending on `@angular/cdk`.
**Front-end spec:** `.kilo/plans/20260809-phase11-drag-handle-frontend-spec.md`
**TODO file:** `.agent/todos/20260809/20260809-todo-0.md`
**Version target:** `0.13.0`
**Date:** `2026-08-09`

---

## 1. Git context

- **Branch:** `feat/module-header-drag-handle-slot` (already created, already checked out).
- **Version:** `package.json` already bumped to `0.13.0` (commit `8698fa9 chore: bump version to 0.13.0`).
- **No branch setup, version bump, or merge actions** are part of this plan — those were handled by earlier Critical Workflow steps (Step 2 Git Feature Branch Setup, Step 3 Version Update).
- This plan covers **Task 1 only** (4.2 Implementation scope): the code, test, doc, and changelog changes for the drag-handle projection slot.
- Do NOT push to any remote; do NOT merge to `main`; do NOT create further branches. Implementation commits land on the current feature branch.

---

## 2. Step-by-step implementation

All file paths are relative to the project root `C:\projects\cobranza-app\front\ui`.

### 2a. `src/components/module-header/module-header.component.html` — remove built-in drag button, add projection slot

**Current state (lines 3–19):** The actions `<nav>` contains a hardcoded drag `<button>` as its first child (lines 4–6), followed by the collapse, size-toggle, fullscreen, and remove buttons.

**Change:** Remove the hardcoded drag `<button>` block and insert the `<ng-content>` projection slot in its place as the **first child** of the actions `<nav>`. The slot must remain inside the `@else` (non-fullscreen) branch — it already is, since the `<nav>` lives in `@else`.

**Exact removal (lines 4–6):**

```html
    <button type="button" class="cba-module-header__action cba-module-header__action--drag" [attr.aria-label]="aria.drag" [title]="aria.drag">
      <fa-icon [icon]="faDrag" aria-hidden="true" />
    </button>
```

**Exact replacement (insert at the same position, as first child of `<nav>`):**

```html
    <ng-content select="[cbaModuleDragHandle]"></ng-content>
```

**Resulting actions `<nav>` block (lines 3–18 after edit):**

```html
  <nav class="cba-module-header__section cba-module-header__section--actions">
    <ng-content select="[cbaModuleDragHandle]"></ng-content>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="collapseLabel()" [title]="collapseLabel()" (click)="collapseToggle.emit()">
      <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="sizeToggleLabel()" [title]="sizeToggleLabel()" (click)="sizeToggle.emit(sizeToggleTarget())">
      <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="aria.fullscreen" [title]="aria.fullscreen" (click)="fullscreenToggle.emit()">
      <fa-icon [icon]="faFullscreen" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="aria.remove" [title]="aria.remove" (click)="remove.emit()">
      <fa-icon [icon]="faXmark" aria-hidden="true" />
    </button>
  </nav>
```

**Verification:** `<ng-content select="[cbaModuleDragHandle]"></ng-content>` is the first child of `<nav>`; it appears only inside `@else`; no default button/icon/placeholder is rendered when the slot is empty.

**Tool:** Use `edit` (exact-string replacement of the 3-line drag button block with the 1-line `ng-content`).

---

### 2b. `src/components/module-header/module-header.component.ts` — remove `faUpDownLeftRight` import and `faDrag` property

**Change 1 — Remove the icon import (line 21):**

Delete this line from the `@fortawesome/free-solid-svg-icons` import block:

```ts
  faUpDownLeftRight,
```

The import block (lines 10–24) becomes (no `faUpDownLeftRight`):

```ts
import {
  faArrowsLeftRight,
  faArrowsLeftRightToLine,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faWindowMaximize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

**Change 2 — Remove the `faDrag` property (lines 135–136):**

Delete:

```ts
  /** Drag handle icon (visual only; drag is owned by the Shell). Template-referenced. */
  protected readonly faDrag = faUpDownLeftRight;
```

**Change 3 (optional) — Update the JSDoc intro comment (lines 47–54):**

The current sentence (lines 51–53):

```
 * `--cba-*` design tokens. In fullscreen mode only the title is shown. Drag
 * and drop are intentionally NOT implemented here (owned by the Shell +
 * `@cobranza-apps/mfe-events`); the title is never editable from this header.
```

Replace with:

```
 * `--cba-*` design tokens. In fullscreen mode only the title is shown. The
 * Shell projects an optional drag handle via the `[cbaModuleDragHandle]`
 * projection slot; drag-and-drop is intentionally NOT implemented here (owned
 * by the Shell + `@cobranza-apps/mfe-events`); the title is never editable
 * from this header.
```

This is optional (the existing note that drag-and-drop is Shell-owned remains accurate); include it to reflect the new projection-based contract.

**Keep unchanged:** all other icon properties, inputs, outputs, computed signals, the `aria` reference, and the rest of the JSDoc.

**Verification:** `faDrag` and `faUpDownLeftRight` no longer appear in the file; no TypeScript compile errors; `npm run build` succeeds.

**Tool:** Use `edit` for each of Change 1, Change 2, Change 3. After edits, run `vscode-mcp-server_get_diagnostics_code` on the file.

---

### 2c. `src/i18n/ui-messages.ts` — remove `drag` aria-label entry

**Current state (lines 21–35):**

```ts
  moduleHeader: {
    aria: {
      collapse: {
        expand: 'Expandir módulo',
        collapse: 'Colapsar módulo',
      },
      size: {
        shrink: 'Reducir módulo a 50%',
        expand: 'Expandir módulo a 100%',
      },
      remove: 'Quitar módulo',
      fullscreen: 'Pantalla completa',
      drag: 'Arrastrar módulo',
    },
  },
```

**Change:** Delete line 33:

```ts
      drag: 'Arrastrar módulo',
```

**Resulting block:**

```ts
  moduleHeader: {
    aria: {
      collapse: {
        expand: 'Expandir módulo',
        collapse: 'Colapsar módulo',
      },
      size: {
        shrink: 'Reducir módulo a 50%',
        expand: 'Expandir módulo a 100%',
      },
      remove: 'Quitar módulo',
      fullscreen: 'Pantalla completa',
    },
  },
```

**Verification:** `aria.drag` references no longer exist; grep the codebase for `aria.drag` and confirm zero hits in `src/` (the template already removed its only usage in 2a). The accessible name of the projected handle is the consumer's responsibility.

**Tool:** Use `edit` to remove the single `drag:` line. Then run a project-wide `grep` for `\.drag` / `aria.drag` in `src/` to confirm no dangling references.

---

### 2d. `src/components/module-header/module-header.component.scss` — confirm `.cba-module-header__action--drag` stays for consumer use

**No change required.** The file already contains (lines 74–81):

```scss
.cba-module-header__action--drag {
  cursor: grab;
}

.cba-module-header__action--drag:active {
  cursor: grabbing;
  background-color: transparent;
}
```

And the `gap: var(--cba-space-1)` on `.cba-module-header__section--actions` (line 44) naturally handles spacing between the projected handle and built-in buttons — no wrapper `<div>` is needed.

**Verification (confirm only, no edit):**
- `.cba-module-header__action--drag` remains in the file.
- `.cba-module-header__action` base styles (sizing, hover, focus ring) remain.
- `::ng-deep` is not introduced; no CDK-related class references exist.
- No extra wrapper element is added to the template for flex alignment.

**Tool:** `read` to confirm; no write.

---

### 2e. `src/components/module-header/module-header.component.spec.ts` — add 3 projection tests; ensure existing tests pass

**Current state (93 lines):**
- `ACTION_CASES` (lines 12–17) has **4** entries: `collapseToggle`, `sizeToggle` (payload `'50%'`), `remove`, `fullscreenToggle`. **No drag case** — so removing the built-in drag button does not break the `it.each` table.
- `setup()` creates `ModuleHeaderComponent` directly via `TestBed.createComponent` (no host), which means no content is projected — exactly the "empty slot" scenario.
- The fullscreen test (lines 67–80) asserts `nav` is `null` when `isFullscreen === true`.

**Existing tests stay green** because:
- The 4 remaining buttons (collapse, size-toggle, fullscreen, remove) keep their `aria-label` attributes; `queryButton(label)` still finds them.
- `querySelector('nav')` is still `null` in fullscreen (the `<nav>` lives in the `@else` branch).

**Changes:**

1. **Add the `Component` import** to the existing `@angular/core` import (line 1):

   Current line 1:

   ```ts
   import { OutputEmitterRef } from '@angular/core';
   ```

   Replace with:

   ```ts
   import { Component, OutputEmitterRef } from '@angular/core';
   ```

2. **Add a `TestHostComponent`** at the end of the import/constants section (after `ACTION_CASES`, before `describe`), to project a drag handle:

   ```ts
   @Component({
     standalone: true,
     imports: [ModuleHeaderComponent],
     template: `
       <cba-module-header title="Host Module">
         <button
           type="button"
           cbaModuleDragHandle
           class="cba-module-header__action cba-module-header__action--drag"
           aria-label="Arrastrar módulo">
         </button>
       </cba-module-header>
     `,
   })
   class TestHostComponent {}
   ```

3. **Add a separate `describe` block** for projection tests (the projection tests need a host fixture, while the existing tests use the direct component fixture). Place it after the existing `describe('ModuleHeaderComponent', ...)` block closes (after line 93), or restructure by adding a sibling `describe`. Recommended: keep the existing `describe` untouched and add a new one:

   ```ts
   describe('ModuleHeaderComponent — drag handle projection slot', () => {
     function setupHost(inputs: { isFullscreen?: boolean }): ComponentFixture<TestHostComponent> {
       const hostFixture = TestBed.createComponent(TestHostComponent);
       if (inputs.isFullscreen !== undefined) {
         hostFixture.componentRef.setInput('isFullscreen', inputs.isFullscreen);
       }
       hostFixture.detectChanges();
       return hostFixture;
     }

     beforeEach(async () => {
       await TestBed.configureTestingModule({
         imports: [TestHostComponent],
       }).compileComponents();
     });

     it('renders the four built-in action buttons when no drag handle is projected (empty slot)', () => {
       const directFixture = TestBed.createComponent(ModuleHeaderComponent);
       directFixture.componentRef.setInput('title', 'Direct Module');
       directFixture.detectChanges();

       const navButtons = directFixture.nativeElement.querySelectorAll('nav button');
       expect(navButtons).toHaveLength(4);
     });

     it('projects the drag handle into the actions nav before the built-in buttons', () => {
       const hostFixture = setupHost({});

       const nav = hostFixture.nativeElement.querySelector('nav');
       const navButtons = nav.querySelectorAll('button');
       const dragHandle = nav.querySelector('button[aria-label="Arrastrar módulo"]');

       expect(nav).not.toBeNull();
       expect(dragHandle).not.toBeNull();
       expect(navButtons).toHaveLength(5);
       expect(navButtons[0]).toBe(dragHandle);
     });

     it('hides the projected drag handle when isFullscreen is true', () => {
       const hostFixture = setupHost({ isFullscreen: true });

       const nav = hostFixture.nativeElement.querySelector('nav');
       const dragHandle = hostFixture.nativeElement.querySelector('button[aria-label="Arrastrar módulo"]');

       expect(nav).toBeNull();
       expect(dragHandle).toBeNull();
     });
   });
   ```

   **Note on test design:**
   - The first projection-`describe` test (empty slot) deliberately uses a **direct** `ModuleHeaderComponent` fixture (no host) to assert the empty-slot layout — equivalent to the spec §7.1 scenario. It keeps the existing direct-creation pattern the suite already uses.
   - The second and third tests use the `TestHostComponent` host to project the handle — equivalent to spec §7.2 and §7.3.
   - No CDK imports or drag behaviour testing, per spec §7.

4. **Verify all existing tests still pass** — they are untouched; the `it.each(ACTION_CASES)` table has 4 cases that match the 4 remaining built-in buttons.

**Line-count note:** The file grows from 93 → ~150 lines, staying under the 200-line `max-lines-per-file` limit (rule applies to `src/` files; spec files under 200 lines are fine). If the file exceeds 200 lines, extract `TestHostComponent` into a separate `module-header.testing-host.ts` file — but the projection tests need it inline for readability; verify the count after writing.

**Tool:** Use `edit` for the import line; use `edit` (append at end) or `vscode-mcp-server_replace_lines_code` to insert the host component and the new `describe` block. Run `vscode-mcp-server_get_diagnostics_code` on the spec file after editing.

---

### 2f. `docs/MODULE_HEADER.md` — update icon order, add projection slot section, add Shell wiring example, add ownership note

**Change 1 — Table of Contents (line 13):**

Current:

```markdown
- [Drag note](#drag-note)
```

Replace with:

```markdown
- [Drag handle slot](#drag-handle-slot)
```

**Change 2 — Icon order section (lines 117–129):**

Replace the entire section:

```markdown
## Icon order

The action icons are rendered left-to-right in the following fixed order:

| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 1 | Drag handle | `up-down-left-right` | None (visual-only) |
| 2 | Collapse / expand | `up-down` (collapsed) / `up-down` (expanded) | `collapseToggle` |
| 3 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` (at 100%) / `arrows-left-right` (at 50%) | `sizeToggle` |
| 4 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 5 | Remove | `xmark` | `remove` |

The order is hard-coded in the template and must not be rearranged by consumers.
```

With:

```markdown
## Icon order

The built-in action icons are rendered left-to-right in the following fixed order:

| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 1 | Collapse / expand | `up-down` (collapsed) / `up-down` (expanded) | `collapseToggle` |
| 2 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` (at 100%) / `arrows-left-right` (at 50%) | `sizeToggle` |
| 3 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 4 | Remove | `xmark` | `remove` |

The order is hard-coded in the template and must not be rearranged by consumers.

> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered **before**
> the built-in actions (position 0) and is **not** part of the library's fixed
> set. The library renders nothing in that position when the slot is empty.
```

**Change 3 — Replace the "Drag note" section (lines 131–135) with "Drag handle slot":**

Replace:

```markdown
## Drag note

The drag handle icon (`up-down-left-right`) is **visual-only** — it does not emit
any output event. Drag-and-drop contracts live in `@cobranza-apps/mfe-events` and
the Shell; the header merely signals that the module is draggable.
```

With:

```markdown
## Drag handle slot

`ModuleHeader` exposes an **optional** content-projection slot so the Shell can
inject its own drag handle (typically a `cdkDragHandle`-wired element from
`@angular/cdk/drag-drop`). The library does **not** depend on `@angular/cdk`,
does not render a default handle when the slot is empty, and emits no drag
outputs. Drag-and-drop contracts live in `@cobranza-apps/mfe-events` and the
Shell; the header only provides a stable place to paint the handle.

### Slot contract

| Selector | Required | Placement | Notes |
|----------|----------|-----------|-------|
| `[cbaModuleDragHandle]` | No | First child of the actions `<nav>` | Attribute marker on the projected element; no directive is required. |

Rules:

- The projected element is rendered **before** the built-in action buttons.
- The slot is hidden in fullscreen mode (title-only), exactly like the other actions.
- When nothing is projected, the actions layout is unchanged (no empty gap, no default button).
- Apply `class="cba-module-header__action cba-module-header__action--drag"` on the
  projected element to inherit the library's 32 × 32 px hit target, hover/active
  states, focus ring, and `grab`/`grabbing` cursor without any `::ng-deep` piercing.

### Shell wiring example

```html
<div cdkDrag>
  <cba-module-container [size]="size">
    <cba-module-header
      [title]="title"
      [status]="status"
      [size]="size"
      [isCollapsed]="isCollapsed"
      [isFullscreen]="false"
      (collapseToggle)="..."
      (sizeToggle)="..."
      (remove)="..."
      (fullscreenToggle)="...">
      <button
        type="button"
        cbaModuleDragHandle
        cdkDragHandle
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo">
        <!-- Shell-provided icon, e.g. Font Awesome grip -->
      </button>
    </cba-module-header>
  </cba-module-container>
</div>
```

### Ownership

- `cdkDrag` goes on an **ancestor the Shell controls** (typically the wrapper
  `<div>` around `cba-module-container`).
- `cdkDragHandle` goes on the **projected element** so dragging is initiated
  only from the header handle.
- The library owns the visual styling contract (`.cba-module-header__action*`
  classes); the Shell owns the drag behaviour and the accessible name.
- **Anti-pattern:** asking the UI library to implement drag behaviour or to add
  `@angular/cdk` as a dependency. See `docs/CONSUMER_GUIDE.md` §Shell checklist.
```

**Change 4 — Accessibility section (line 157):**

Current:

```markdown
- The drag handle is decorative (`aria-hidden="true"`) and emits no output.
```

Replace with:

```markdown
- The optional projected drag handle's accessible name is provided by the **Shell**
  (e.g. `aria-label="Arrastrar módulo"`); the library does not supply the
  accessible name for the projected element.
```

**Verification:** `docs/MODULE_HEADER.md` has a `## Drag handle slot` section, the ToC links to it, the icon-order table no longer lists a drag row, and the accessibility section reflects the Shell-owned accessible name.

**Tool:** Use `edit` for each of the 4 changes (ToC line, icon-order section, drag-note→slot section, accessibility bullet).

---

### 2g. `docs/CONSUMER_GUIDE.md` — add Shell wiring subsection

**Placement:** Insert a new `### ModuleHeader drag handle` subsection immediately after the `## Shell checklist` section (which ends at line 337, before `## MFE checklist` at line 339).

**Insert (after the Shell checklist list, before `## MFE checklist`):**

```markdown
### ModuleHeader drag handle

The Shell can project an optional drag handle into `cba-module-header` via the
`[cbaModuleDragHandle]` attribute-projection slot:

- Project a native `<button type="button" cbaModuleDragHandle cdkDragHandle>` as a
  child of `<cba-module-header>`.
- Apply `cdkDrag` on an **ancestor the Shell controls** (the wrapper around
  `cba-module-container`) and `cdkDragHandle` on the projected element.
- Apply `class="cba-module-header__action cba-module-header__action--drag"` on the
  projected button to inherit the library's action-button sizing, hover/active
  states, focus ring, and grab cursor — no `::ng-deep` needed.
- The slot is hidden in fullscreen mode along with the other actions.
- The Shell **must** provide the accessible name (`aria-label="Arrastrar módulo"`).
- Full example: see [`MODULE_HEADER.md` §Drag handle slot](./MODULE_HEADER.md#drag-handle-slot).

**Anti-pattern:** asking the UI library to implement drag behaviour or to add
`@angular/cdk` as a dependency. The library provides only the projection slot and
the visual contract; drag-and-drop is Shell-owned.
```

**Also add an anti-pattern entry** to the `## Anti-patterns` list (after line 360, the last existing bullet). Append:

```markdown
- Asking `@cobranza-apps/ui` to implement drag-and-drop or to depend on `@angular/cdk`. The Library exposes the `[cbaModuleDragHandle]` projection slot; the Shell owns DnD. See [`MODULE_HEADER.md` §Drag handle slot](./MODULE_HEADER.md#drag-handle-slot).
```

**Verification:** grep `cbaModuleDragHandle` in `docs/CONSUMER_GUIDE.md` → at least 2 hits (subsection + anti-pattern).

**Tool:** Use `edit` to insert the subsection between Shell checklist and MFE checklist, and `edit` to append the anti-pattern bullet.

---

### 2h. `docs/USAGE.md` — update ModuleHeader usage pattern with optional slot

**Placement:** Update the `### ModuleHeader` section (lines 242–262).

Current (lines 242–262):

```markdown
### ModuleHeader

Shell-injected header above each MFE module. See [`MODULE_HEADER.md`](./MODULE_HEADER.md) for the full API and notes.

```html
<cba-module-header
  title="Module Title"
  size="100%"
  [isCollapsed]="false"
  [isFullscreen]="false"
  status="loading"
  (collapseToggle)="onCollapse()"
  (sizeToggle)="onSizeChange($event)"
  (fullscreenToggle)="onFullscreen()"
  (remove)="onRemove()">
</cba-module-header>
```

**Status values:** `loading` | `loaded` | `success` | `warning` | `error` | `dirty` | `null`

**Outputs:** `collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`
```

Replace the block's closing lines (after the `**Outputs:**` line) by appending an optional-slot note. Insert after the `**Outputs:**` line and before the next `### ModuleContainer` heading:

```markdown
**Optional drag-handle slot:** Project a `[cbaModuleDragHandle]` element as a child
of `<cba-module-header>` to let the Shell wire `cdkDrag` / `cdkDragHandle`. The
library renders nothing when the slot is empty and does not depend on
`@angular/cdk`. See [`MODULE_HEADER.md` §Drag handle slot](./MODULE_HEADER.md#drag-handle-slot)
for the full Shell wiring example.

> The basic example above intentionally omits the drag handle so the simplest
> usage stays simple.
```

Keep the basic example unchanged (no drag handle in the minimal snippet).

**Verification:** grep `cbaModuleDragHandle` in `docs/USAGE.md` → 1 hit; the minimal example still has no projected handle.

**Tool:** Use `edit` to insert the optional-slot paragraph after the `**Outputs:**` line.

---

### 2i. `CHANGELOG.md` — add `[0.13.0] — 2026-08-09` with Added entry

**Placement:** Insert the new version header **after** the introductory block (after line 31, the `> Releases prior to 0.8.1...` note) and **before** the existing `## [0.12.1] — 2026-08-08` header (line 33).

**Per `.kilo/rules/changelog-versioning.md`:** no `[Unreleased]` section is introduced; the entry goes directly under the dated `[0.13.0] — 2026-08-09` header.

**Insert:**

```markdown
## [0.13.0] — 2026-08-09

### Added

- **ModuleHeader optional drag-handle projection slot** — consumers can project a `[cbaModuleDragHandle]` element into the header actions area. The library does not render a default handle when the slot is empty, and the slot is hidden in fullscreen mode along with other actions. Enables Shell-owned `@angular/cdk/drag-drop` integration without adding CDK as a library dependency. See `docs/MODULE_HEADER.md` §Drag handle slot and `docs/CONSUMER_GUIDE.md` §ModuleHeader drag handle.

### Removed

- Removed the built-in visual-only drag button from `ModuleHeader` (was `faUpDownLeftRight` / `aria.drag`). Drag handle is now consumer-projected via the `[cbaModuleDragHandle]` slot. Removed the `drag` key from `CBA_UI_MESSAGES.moduleHeader.aria` and the `faDrag` property from `ModuleHeaderComponent`.

### Notes

- No `@angular/cdk` peer dependency added. Existing `ModuleHeader` inputs/outputs are unchanged. Spec: [20260809-phase11-drag-handle-frontend-spec.md](.kilo/plans/20260809-phase11-drag-handle-frontend-spec.md).
```

**Verification:** A `## [0.13.0] — 2026-08-09` header exists; no `[Unreleased]` section is introduced; the `[0.12.1]` header still follows. Optional: the existing `src/theme/docs-compliance.spec.ts` asserts no `[Unreleased]` section — the new entry must keep that test green.

**Tool:** Use `edit` to insert the new block between the intro note and the `## [0.12.1]` header.

---

### 2j. Build & verify

Run each command as a **single** `bash` tool invocation (no chaining; per tool-selection-priority rule).

1. **Build:**

   ```
   npm run build
   ```

   Expected: `ng-packagr` builds the library; zero errors; output in `dist/`. Confirm no dangling `faDrag` / `aria.drag` references break the build.

2. **Tests:**

   ```
   npm test
   ```

   Expected: Jest runs; the 3 new projection tests pass; all pre-existing `ModuleHeaderComponent` tests pass; `src/theme/docs-compliance.spec.ts` (no `[Unreleased]` section) passes; `src/theme/*.spec.ts` token/theme regression suites pass. Total `ModuleHeaderComponent` test count = existing (≤6) + 3 new.

3. **Lint:**

   ```
   npm run lint
   ```

   Expected: ESLint reports zero errors/warnings on `src/**/*.ts` (including the edited component, i18n, and spec files).

**On any failure:** stop, do NOT commit, report the failure to the caller. Fix root cause (e.g. a missed `aria.drag` reference) before re-running.

**Verification grep sweep (after all edits, before commit):**
- `grep` `faDrag` in `src/` → 0 hits.
- `grep` `faUpDownLeftRight` in `src/` → 0 hits.
- `grep` `aria\.drag` in `src/` → 0 hits.
- `grep` `cbaModuleDragHandle` in `src/` → 1 hit (the template `ng-content`).
- `grep` `cbaModuleDragHandle` in `docs/` → ≥3 hits (MODULE_HEADER, CONSUMER_GUIDE, USAGE).
- `grep` `Unreleased` in `CHANGELOG.md` → 0 hits (the rule comment in the header block mentions the word; verify no section header `[Unreleased]` is introduced — a `grep` for `## \[Unreleased\]` must be 0 hits).

---

## 3. Commit strategy

Three logical commits on the `feat/module-header-drag-handle-slot` branch. Order matters: component + i18n first, tests next, docs + changelog last.

### Commit 1 — Component & i18n (source behaviour change)

Stage:
- `src/components/module-header/module-header.component.html`
- `src/components/module-header/module-header.component.ts`
- `src/i18n/ui-messages.ts`
- `src/components/module-header/module-header.component.scss` (only if formatting/touch edits were made; otherwise leave unstaged — the file has no functional change)

Message:

```
feat(module-header): replace built-in drag button with optional projection slot

Replace the hardcoded visual-only drag button with an <ng-content
select="[cbaModuleDragHandle]"> projection slot so the Shell can wire
cdkDrag/cdkDragHandle without the UI library depending on @angular/cdk.

- Remove the built-in drag <button> and faDrag icon from the template.
- Remove faUpDownLeftRight import and faDrag property from the component.
- Remove the drag aria-label key from CBA_UI_MESSAGES.moduleHeader.aria.
- Keep .cba-module-header__action--drag class for consumer-projected handles.
- The slot is the first child of the actions <nav> and is hidden in fullscreen.
```

### Commit 2 — Unit tests

Stage:
- `src/components/module-header/module-header.component.spec.ts`

Message:

```
test(module-header): add drag-handle projection slot unit tests

Add three projection tests: empty slot preserves the four built-in action
buttons, a projected [cbaModuleDragHandle] element appears before the built-in
buttons, and the projected handle is hidden in fullscreen mode. Existing tests
remain unchanged and green (ACTION_CASES already excludes a drag case).
```

### Commit 3 — Docs & changelog

Stage:
- `docs/MODULE_HEADER.md`
- `docs/CONSUMER_GUIDE.md`
- `docs/USAGE.md`
- `CHANGELOG.md`

Message:

```
docs(module-header): document drag-handle projection slot and Shell wiring

- MODULE_HEADER.md: add "Drag handle slot" section with slot contract, Shell
  wiring example, ownership notes; update icon order; update accessibility note.
- CONSUMER_GUIDE.md: add "ModuleHeader drag handle" Shell subsection and an
  anti-pattern entry against library-owned DnD.
- USAGE.md: mention the optional [cbaModuleDragHandle] slot with a link.
- CHANGELOG.md: add [0.13.0] — 2026-08-09 Added/Removed entries.
```

**Pre-commit checks (before each commit):**
- Run `git status` and confirm only intended files are staged.
- Read `.gitignore`; verify no `dist/`, `node_modules/`, or other ignored paths are staged.
- Do NOT amend or force-push. Do NOT push to any remote.

---

## 4. Risk / mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | A lingering `aria.drag` / `faDrag` reference survives somewhere in `src/` (e.g. a story or another template), breaking the build. | Medium | High | Run the `grep` sweep in §2j before committing; fix every dangling reference. The only known usages were the template (removed in 2a) and the component property (removed in 2b). |
| 2 | The existing `it.each(ACTION_CASES)` test or other existing tests break because they assumed the drag button. | Low | Medium | Inspected: `ACTION_CASES` has 4 entries (no drag), and the fullscreen test asserts `nav === null` — both unaffected. Run `npm test` after edits; any failure stops the commit. |
| 3 | The new projection test host does not project correctly because `cba-module-header`'s `<ng-content>` is conditional inside `@else`. | Low | Medium | `isFullscreen` defaults to `false`, so the `@else` branch renders the `<nav>` and the `<ng-content>`. The fullscreen-hidden test explicitly sets `isFullscreen = true` and asserts both `nav` and the handle are absent. |
| 4 | `spec.ts` exceeds the 200-line `max-lines-per-file` rule after adding the host + 3 tests. | Low | Low | Estimate ~150 lines total. If exceeded, extract `TestHostComponent` into a separate `module-header.testing-host.ts` under `src/components/module-header/` (covered by the same folder). |
| 5 | `docs-compliance.spec.ts` rejects the new changelog heading if formatting is off (e.g. missing dated header, accidental `[Unreleased]`). | Low | Medium | Use the exact `## [0.13.0] — 2026-08-09` heading (em-dash, not hyphen); do NOT add `[Unreleased]`. The spec already asserts this rule; `npm test` will catch it. |
| 6 | The optional JSDoc edit (§2b Change 3) introduces a wording inconsistency or a lint warning. | Low | Low | It is optional; if any lint/wording issue arises, revert the JSDoc to the original — the existing "drag-and-drop is Shell-owned" sentence is still accurate without the projection clarification. |
| 7 | `npm run build` fails due to a stale `dist/` or ng-packagr cache from a prior build. | Low | Low | `dist/` is gitignored; rebuild is clean. If it fails on cache, re-run `npm run build` (the tool-selection rule allows up to 2 retries of the same command). |
| 8 | A consumer (Shell) currently relies on the built-in drag button being present. | Medium | Medium | This is a documented **breaking** removal (captured in the `### Removed` changelog entry). The library version bumps to `0.13.0` (minor; the breaking removal is noted). The Shell migration path is the documented projection slot. The TODO explicitly scopes this to desktop-only and Shell-owned DnD. |
| 9 | `cdkDragHandle` is not a known attribute in the library context (it is Shell-side) — no risk here, but a doc reader may think the library provides it. | Low | Low | The docs example clearly states `cdkDrag`/`cdkDragHandle` are Shell-applied (Shell owns the import) and the library only provides the `[cbaModuleDragHandle]` slot + visual classes. |

---

## 5. Out of plan scope (handled by other Critical Workflow steps)

- Step 2 (Git Feature Branch Setup) — already done; branch `feat/module-header-drag-handle-slot` checked out.
- Step 3 (Version Update) — already done; `package.json` at `0.13.0`.
- Step 4.3 (Code Review & Simplification), 4.4 (Documentation is part of this plan but the dedicated docs-specialist pass is separate), 4.5 (Verification), 4.6 (Task Completion).
- Step 5 (TODO File Completion / merge / push) — not in this plan.
- Implementing drag-and-drop inside the library.
- Adding `@angular/cdk` as a peer dependency.
- Generic header-action slots.
- Changes to `ModuleContainer` API.
- Shell repo implementation (only the documented contract).

## 4.3 Code Review Findings

Reviewer: code-reviewer sub-agent (step 4.3 of Critical Workflow).
Date: 2026-08-09.

### Verification performed

- Read implementation plan `.kilo/plans/20260809-phase11-drag-handle-impl.md`.
- Read front-end spec `.kilo/plans/20260809-phase11-drag-handle-frontend-spec.md`.
- Read current content of all files listed in the review task.
- Ran `npm run build` — passed.
- Ran `npm test` — passed (22 suites, 204 tests).
- Ran `npm run lint` — passed (no errors/warnings).
- Ran grep sweep for dangling references:
  - `faDrag|faUpDownLeftRight|aria.drag|DragDropModule|@angular/cdk` in `src/` — 0 hits.
  - `cbaModuleDragHandle` in `src/` — 3 hits (template `ng-content`, component JSDoc, test host) as expected.
  - `cbaModuleDragHandle` in `docs/` — 7 hits across `MODULE_HEADER.md`, `CONSUMER_GUIDE.md`, and `USAGE.md`.
  - `## [Unreleased]` in `CHANGELOG.md` — 0 hits.

### Checklist results

1. No `@angular/cdk` or `DragDropModule` imports added anywhere. ✅
2. No drag outputs added to `ModuleHeaderComponent`. ✅
3. Built-in drag button is removed; only `<ng-content select="[cbaModuleDragHandle]"></ng-content>` exists. ✅
4. Projection slot is inside the actions `<nav>` and inside the `@else` branch (so fullscreen hides it). ✅
5. When slot is empty, no extra gap or placeholder is rendered (`ng-content` renders nothing; existing `gap` handles spacing). ✅
6. `faUpDownLeftRight` import and `faDrag` property are removed. ✅
7. `drag` aria-label removed from `ui-messages.ts`. ✅
8. `.cba-module-header__action--drag` CSS class is retained for consumer use. ✅
9. Unit tests are minimal and focused: empty slot, projected handle present, fullscreen hides slot. ✅
10. No CDK behaviour tested. ✅
11. Docs include Shell wiring example and ownership note. ✅
12. Changelog has dated `[0.13.0] — 2026-08-09` header, no `[Unreleased]` section. ✅
13. Existing inputs/outputs unchanged. ✅
14. Build, test, lint all pass. ✅

### Issues

No issues found.

---

## 4.3 Code Simplification Suggestions

Reviewer: code-simplifier sub-agent.
Date: 2026-08-09.

The implementation is already minimal; the following are optional opportunities to remove duplication or tighten code without changing the API contract, the projection slot, or any inputs/outputs.

### Suggestions

1. **`src/components/module-header/module-header.component.html`** — Extract the duplicated title `<div>` into an `<ng-template #titleTemplate>` and render it in both `@if` branches.
   - **Rationale:** The title markup is identical in fullscreen and normal modes; a shared template removes duplication and makes future title changes safer.

2. **`src/components/module-header/module-header.component.scss`** — Replace `min-height: var(--cba-module-header-min-height, 40px)` on `.cba-module-header__section` with `min-height: inherit`.
   - **Rationale:** The parent `.cba-module-header` already defines the same min-height; inheriting it removes redundant token fallback and keeps a single source of truth.

3. **`src/components/module-header/module-header.component.spec.ts`** — Move the empty-slot assertion (`nav button` length = 4) into the main `describe('ModuleHeaderComponent', …)` block and reuse the existing `setup()` helper.
   - **Rationale:** It avoids creating a second direct fixture inside the projection describe and keeps the host-focused describe limited to projected-content scenarios.

4. **`src/components/module-header/module-header.component.spec.ts`** — Simplify `setupHost(inputs: { isFullscreen?: boolean })` to `setupHost(isFullscreen: boolean = false)`.
   - **Rationale:** The host template already binds `[isFullscreen]="isFullscreen"`; a boolean parameter removes the optional-object wrapper and conditional `setInput` branch.

5. **`docs/CONSUMER_GUIDE.md`** — Remove the bold **Anti-pattern:** paragraph at the end of the `### ModuleHeader drag handle` subsection and rely on the existing anti-patterns list bullet.
   - **Rationale:** The same warning is duplicated twice in the file; one mention is enough and avoids drift.

6. **`docs/CONSUMER_GUIDE.md`** — Trim the `### ModuleHeader drag handle` subsection bullets to a short summary and link to `MODULE_HEADER.md` for the full slot contract and wiring example.
   - **Rationale:** The detailed contract already lives in `MODULE_HEADER.md`; a shorter cross-reference reduces maintenance duplication while preserving discoverability.

7. **`docs/USAGE.md`** — Replace the `**Status values:**` and `**Outputs:**` lines under `### ModuleHeader` with a single pointer to `MODULE_HEADER.md`.
   - **Rationale:** Those lists duplicate the API tables in `MODULE_HEADER.md`; `USAGE.md` can stay focused on usage patterns.

8. **`src/components/module-header/module-header.component.html`** (minor) — Verify whether `[class]="statusClass()"` is sufficient; if Angular treats `null` as empty class, drop the `?? ''` fallback.
   - **Rationale:** Removes a redundant null-coalescing expression when the binding already handles `null`.

### Note

None of the above are required for correctness. If time is limited, items 2 and 4 offer the lowest-risk, highest-value simplifications.