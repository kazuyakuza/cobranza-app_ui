# Implementation Plan — Fix: Remove incorrectly added built-in drag handle from ModuleHeader

- **TODO file:** `.agent/todos/20260820/20260820-todo-0.md`
- **Front-end spec:** `.kilo/plans/20260820-fix-drag-handle-frontend-spec.md`
- **Branch:** `feat/fix-moduleheader-drag-handle` (already created in Critical Workflow step 2; do NOT create/switch branches)
- **Version:** `package.json` is already at `0.18.6` (Critical Workflow step 3 already performed). Do NOT bump version again.
- **Target implementer:** JUNIOR developer under 50% restriction. All structural/scope decisions are encoded below; do not deviate.

## Pre-conditions verified by Architector

- `src/components/module-header/module-header.component.html` lines 24–30 contain the no-op built-in drag `<button>` to remove.
- `src/components/module-header/module-header.component.ts` line 21 imports `faUpDownLeftRight`, line 165 declares `protected readonly faDrag = faUpDownLeftRight;`.
- `src/components/module-header/module-header.component.spec.ts` line 112 expects `5` built-in buttons; line 142 expects `6` total buttons.
- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` does NOT import `FaIconComponent` or `faUpDownLeftRight`; uses self-closing `<cba-module-header ... />` at lines 32–43.
- `docs/CBA_MODULE_HEADER.md` Icon order table (lines 123–130) lists 6 rows including a built-in no-op Drag row at position 1; the optional-drag-handle note (lines 134–138) and Drag handle slot rules (line 159) still reference the built-in no-op drag button.
- `CHANGELOG.md` first dated header is `## [0.18.5] — 2026-08-20` at line 33; no `## [0.18.6]` section exists yet.
- `package.json` `version` is already `0.18.6`.
- Scripts: `npm run test` → `jest --passWithNoTests`; `npm run lint` → `eslint "src/**/*.ts"` (only `src/`, not demo); `npm run build` → `npm run build:lib && npm run build:demo`.

## Constraints & rules to obey

- Do NOT touch `module-header.component.scss` (out of scope per spec §1.3 and §8).
- Do NOT modify inputs, outputs, public API, selector, host bindings, or JSDoc on the component class.
- Do NOT change `CBA_UI_MESSAGES`, routing, state management, or add dependencies.
- Preserve all unrelated code/markup exactly (rule: Preserve Existing Code).
- File-content edits MUST use real newlines, never literal `\n` (rule: newline-prevention.md).
- Prefer MCP file tools (`vscode-mcp-server_*`, `Bifrost_*`) over raw `edit`; reserve `bash` for git/npm.
- No commented-out code (rule: no-commented-code.md) — delete, don't comment.
- No global installs (rule: never-global-installs.md).
- Commit after each logical step with meaningful messages (per Critical Workflow step 4.2 guidance).
- Do NOT push (push restricted to Critical Workflow step 5).
- Do NOT create/switch branches (restricted to step 2) and do NOT bump version (restricted to step 3).

---

## Step 1 — Remove built-in drag button from library template

**File:** `src/components/module-header/module-header.component.html`

**Action:** Delete lines 24–30 (the no-op drag `<button>` block, including the blank line that follows it) so the actions `<nav>` starts directly with the projection slot followed by the collapse button. Keep `<ng-content select="[cbaModuleDragHandle]"></ng-content>` (line 22) and the comment on line 21 untouched.

**Exact text to remove (lines 24–31 inclusive of the trailing blank line):**

```html
      <button
        type="button"
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo"
        title="Arrastrar módulo">
        <fa-icon [icon]="faDrag" aria-hidden="true" />
      </button>

```

**Resulting `<nav>` block must read (only the projection slot + 4 built-in action buttons):**

```html
    <nav class="cba-module-header__section cba-module-header__section--actions">
      <!-- Optional drag-handle projection slot. Shell projects a [cbaModuleDragHandle] element here (e.g. cdkDragHandle). Hidden in fullscreen mode. -->
      <ng-content select="[cbaModuleDragHandle]"></ng-content>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="collapseLabel()"
        [title]="collapseLabel()"
        (click)="collapseToggle.emit()">
        <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="sizeToggleLabel()"
        [title]="sizeToggleLabel()"
        (click)="sizeToggle.emit(sizeToggleTarget())">
        <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="aria.fullscreen"
        [title]="aria.fullscreen"
        (click)="fullscreenToggle.emit()">
        <fa-icon [icon]="faFullscreen" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="aria.remove"
        [title]="aria.remove"
        (click)="remove.emit()">
        <fa-icon [icon]="faXmark" aria-hidden="true" />
      </button>
    </nav>
```

**Implementation note for junior dev:** Use `vscode-mcp-server_replace_lines_code` with `startLine=24`, `endLine=31`, `originalCode` = the exact 8 lines above (lines 24–31), and `content` = empty string is NOT allowed by the tool. Instead, set `startLine=24`, `endLine=31`, and `content` to a single empty line is also not ideal. **Preferred approach:** use the `edit` tool with `oldString` = the 8-line block (lines 24–31, i.e. the `<button .../>` block plus the blank line after it) and `newString` = empty string is also not allowed by `edit`. Therefore use `vscode-mcp-server_replace_lines_code` with `startLine=24`, `endLine=31` and `content` = `` (empty). If the tool rejects an empty `content`, set `content` to a single newline character. Verify by re-reading the file: line 23 (blank after `<ng-content>`) must be followed directly by the collapse `<button>` opening tag.

**Verification:**
- Re-read the file. Confirm there is no `<button>` with `class="...__action--drag"` and no `faDrag` reference.
- Confirm `<ng-content select="[cbaModuleDragHandle]"></ng-content>` is still present.
- Confirm exactly 4 built-in `<button>` elements remain inside `<nav>` (collapse, size, fullscreen, remove).

**Commit:**
```bash
git add src/components/module-header/module-header.component.html
git commit -m "fix(module-header): remove incorrectly re-added built-in drag button"
```

---

## Step 2 — Remove `faUpDownLeftRight` import and `faDrag` property

**File:** `src/components/module-header/module-header.component.ts`

**Action A — Remove the import:** Delete line 21 (`  faUpDownLeftRight,`) from the `@fortawesome/free-solid-svg-icons` import block. The import block (lines 10–24) must end with `faTriangleExclamation,` immediately followed by `faWindowMaximize,` (i.e. `faUpDownLeftRight` line gone, alphabetical order preserved among the remaining entries — note the existing list is NOT strictly alphabetical, so just remove the single line and do not reorder anything else).

**Resulting import block:**

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

**Action B — Remove the property:** Delete line 165 (`  protected readonly faDrag = faUpDownLeftRight;`). The remaining `/** Icons referenced directly by the header template. */` JSDoc (line 162) and the two surviving properties (`faFullscreen`, `faXmark`) must stay. After deletion, the block reads:

```ts
  /** Icons referenced directly by the header template. */
  protected readonly faFullscreen = faWindowMaximize;
  protected readonly faXmark = faXmark;
```

**Implementation note for junior dev:** Use two `edit` calls (or two `vscode-mcp-server_replace_lines_code` calls). For Action A, `oldString` = `  faTriangleExclamation,\n  faUpDownLeftRight,\n  faWindowMaximize,` and `newString` = `  faTriangleExclamation,\n  faWindowMaximize,` (this uniquely identifies the location). For Action B, `oldString` = `  protected readonly faDrag = faUpDownLeftRight;\n` and `newString` = `` (empty) — if `edit` rejects empty, instead use `oldString` containing the preceding line plus the target line and `newString` containing only the preceding line:

- `oldString`:
```ts
  protected readonly faFullscreen = faWindowMaximize;
  protected readonly faXmark = faXmark;
  protected readonly faDrag = faUpDownLeftRight;
```
- `newString`:
```ts
  protected readonly faFullscreen = faWindowMaximize;
  protected readonly faXmark = faXmark;
```

**Verification:**
- Grep the file for `faUpDownLeftRight` and `faDrag` — both must return zero matches.
- Run `npm run lint` (see Step 7) to confirm no unused-import / unused-property warnings remain.

**Commit:**
```bash
git add src/components/module-header/module-header.component.ts
git commit -m "fix(module-header): drop faUpDownLeftRight import and faDrag property"
```

---

## Step 3 — Update unit-test button counts

**File:** `src/components/module-header/module-header.component.spec.ts`

**Action A — Empty-slot test (lines 112–116):** Rename the test description and change the expected count from `5` to `4`.

**Current (lines 112–116):**
```ts
  it('renders the five built-in action buttons when no drag handle is projected (empty slot)', () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(5);
  });
```

**Required:**
```ts
  it('renders the four built-in action buttons when no drag handle is projected (empty slot)', () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(4);
  });
```

**Action B — Projected-drag-handle test (line 142):** Change the total count assertion from `6` to `5` (1 projected + 4 built-in). Keep the `navButtons[0]` is `dragHandle` assertion (line 143) unchanged.

**Current (line 142):**
```ts
    expect(navButtons).toHaveLength(6);
```

**Required:**
```ts
    expect(navButtons).toHaveLength(5);
```

**Implementation note for junior dev:** Use `edit` with `replaceAll=false`. For Action A, `oldString` = the full 5-line `it(...)` block shown above (unique enough) and `newString` = the required 5-line block. For Action B, `oldString` = `    expect(navButtons).toHaveLength(6);` (unique in file) and `newString` = `    expect(navButtons).toHaveLength(5);`.

**Do NOT change** the `ACTION_CASES` array (still 4 cases) or the `it.each` emission tests or the fullscreen / status tests.

**Verification:** See Step 7 (`npm run test`).

**Commit:**
```bash
git add src/components/module-header/module-header.component.spec.ts
git commit -m "test(module-header): expect 4 built-in buttons; 5 with projected drag handle"
```

---

## Step 4 — Update demo to project its own drag handle

**File:** `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

**Action A — Add imports:** After the existing `@cobranza-apps/ui` import block (lines 2–9), add two new imports. Place them in a logical position: immediately after the `@cobranza-apps/ui` import block and before the JSDoc comment (line 11).

**Add:**
```ts
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
```

**Action B — Update `imports` array (line 27):** Add `FaIconComponent`.

**Current:**
```ts
  imports: [ModuleContainerComponent, ModuleHeaderComponent, CbaModuleFooterComponent],
```

**Required:**
```ts
  imports: [ModuleContainerComponent, ModuleHeaderComponent, CbaModuleFooterComponent, FaIconComponent],
```

**Action C — Convert self-closing `<cba-module-header ... />` to paired tag with projected drag handle:** Replace lines 32–43 (the self-closing `<cba-module-header ... />` element) with a paired tag that projects a drag-handle `<button>` as the first child.

**Current (lines 32–43):**
```ts
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
```

**Required:**
```ts
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
          (remove)="noop()">
          <button
            type="button"
            cbaModuleDragHandle
            class="cba-module-header__action cba-module-header__action--drag"
            aria-label="Arrastrar módulo">
            <fa-icon [icon]="faUpDownLeftRight" aria-hidden="true" />
          </button>
        </cba-module-header>
```

**Action D — Add `faUpDownLeftRight` field to the component class:** Add a `protected readonly` field so the template binding resolves. Place it among the other class members (e.g. immediately before the `noop` method, near line 80).

**Add:**
```ts
  /** Drag-handle icon projected into the library header slot (demo-only). */
  protected readonly faUpDownLeftRight = faUpDownLeftRight;
```

**Implementation note for junior dev:**
- For Action A use `edit` with `oldString` = the closing `}` of the `@cobranza-apps/ui` import + the blank line + the JSDoc opening `/**` and `newString` = same closing `}` + blank line + the two new imports + blank line + JSDoc opening `/**`. Concretely:
  - `oldString`:
```ts
} from '@cobranza-apps/ui';

/**
```
  - `newString`:
```ts
} from '@cobranza-apps/ui';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

/**
```
- For Action B use a direct `edit` on the `imports:` line.
- For Action C use `edit` with `oldString` = the 12-line self-closing element block and `newString` = the paired-tag block shown above. Preserve the leading 8-space indentation exactly.
- For Action D use `edit` with `oldString`:
```ts
  /** No-op handler bound to header outputs so the demo stays interactive without side effects. */
  protected noop(): void {}
```
  and `newString`:
```ts
  /** Drag-handle icon projected into the library header slot (demo-only). */
  protected readonly faUpDownLeftRight = faUpDownLeftRight;

  /** No-op handler bound to header outputs so the demo stays interactive without side effects. */
  protected noop(): void {}
```

**Verification:**
- Re-read the file; confirm `FaIconComponent` and `faUpDownLeftRight` are imported, `FaIconComponent` is in `imports`, the template contains `<button ... cbaModuleDragHandle ...>` with `<fa-icon [icon]="faUpDownLeftRight" .../>`, and the class has the `faUpDownLeftRight` field.
- See Step 7 (`npm run build` runs `build:demo` which compiles the demo).

**Commit:**
```bash
git add projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts
git commit -m "demo(module-card): project drag handle via cbaModuleDragHandle slot"
```

---

## Step 5 — Update documentation

**File:** `docs/CBA_MODULE_HEADER.md`

**Action A — Replace the Icon order table (lines 123–130):**

**Current:**
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

**Required:**
```markdown
| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 0 (optional, projected) | Drag handle (Shell-owned) | Shell-provided | — |
| 0 / 1 | Collapse / expand | `chevron-up` / `chevron-down` | `collapseToggle` |
| 1 / 2 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` / `arrows-left-right` | `sizeToggle` |
| 2 / 3 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 3 / 4 | Remove | `xmark` | `remove` |

> The dual position notation means: when a drag handle is projected it occupies position 0 and the built-ins shift right; otherwise the built-ins start at position 0.
```

**Action B — Replace the optional-drag-handle note (lines 134–138):**

**Current:**
```markdown
> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered at
> position 0, before the built-in no-op drag icon (position 1) and the rest of
> the fixed action set. The library renders nothing at position 0 when the slot
> is empty; position 1 is always rendered as a no-op drag affordance.
```

**Required:**
```markdown
> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered before the
> built-in action buttons. The library renders nothing at that position when the
> slot is empty; only the four built-in action buttons are shown.
```

**Action C — Replace the Drag handle slot rule about the built-in no-op button (line 159):**

**Current (line 159):**
```markdown
- When nothing is projected at position 0, no empty gap is left; the built-in no-op drag button (position 1) is always rendered.
```

**Required:**
```markdown
- When nothing is projected, no empty gap is left; only the four built-in action buttons are rendered.
```

**Implementation note for junior dev:** Use three separate `edit` calls with `replaceAll=false`, each targeting the exact multi-line block shown. Preserve all surrounding content (the `## Icon order` heading, the paragraph above the table, the `## Drag handle slot` section, the slot contract table, the Shell wiring example, and everything below). Do NOT edit any other section of the doc.

**Verification:**
- Re-read the file. Grep for `no-op` and `faUpDownLeftRight` in `docs/CBA_MODULE_HEADER.md` — both must return zero matches.
- Confirm the Icon order table has exactly 5 data rows (1 projected + 4 built-ins) and the dual-position note immediately follows it.
- Confirm the Drag handle slot rules list contains the new "When nothing projected" wording.

**Commit:**
```bash
git add docs/CBA_MODULE_HEADER.md
git commit -m "docs(module-header): remove built-in no-op drag button references"
```

---

## Step 6 — Update CHANGELOG

**File:** `CHANGELOG.md`

**Action:** Insert a new `## [0.18.6] — 2026-08-20` section with a `Fixed` entry directly under the `# Changelog` preamble, immediately **before** the existing `## [0.18.5] — 2026-08-20` header (line 33). Do NOT add an `[Unreleased]` section (rule: changelog-versioning.md).

**Insertion point:** Between line 32 (the `> Releases prior to 0.8.1…` quote, which is the last preamble line) and line 33 (`## [0.18.5] — 2026-08-20`).

**Text to insert (with one blank line before and after):**

```markdown

## [0.18.6] — 2026-08-20

### Fixed

- Removed the incorrectly re-added built-in drag button from `ModuleHeader`. The library no longer renders a drag handle by default; consumers must project one via the `[cbaModuleDragHandle]` slot. See `docs/CBA_MODULE_HEADER.md` §Drag handle slot.
- Updated the Angular demo app (`projects/demo/`) to project its own drag handle (`faUpDownLeftRight`) inside `<cba-module-header>` so the visual reference continues to show the handle.

```

**Implementation note for junior dev:** Use `edit` with `oldString`:
```markdown
> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.

## [0.18.5] — 2026-08-20
```
and `newString`:
```markdown
> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.

## [0.18.6] — 2026-08-20

### Fixed

- Removed the incorrectly re-added built-in drag button from `ModuleHeader`. The library no longer renders a drag handle by default; consumers must project one via the `[cbaModuleDragHandle]` slot. See `docs/CBA_MODULE_HEADER.md` §Drag handle slot.
- Updated the Angular demo app (`projects/demo/`) to project its own drag handle (`faUpDownLeftRight`) inside `<cba-module-header>` so the visual reference continues to show the handle.

## [0.18.5] — 2026-08-20
```

**Verification:**
- Re-read lines 30–45 of `CHANGELOG.md`. Confirm the `## [0.18.6] — 2026-08-20` header appears before `## [0.18.5] — 2026-08-20`.
- Grep `CHANGELOG.md` for `[Unreleased]` — must return zero matches.

**Commit:**
```bash
git add CHANGELOG.md
git commit -m "changelog: record v0.18.6 ModuleHeader drag-handle fix"
```

---

## Step 7 — Build, lint, and test verification

Run the three commands below sequentially (one per `bash` tool call; do not chain). Stop and report if any fails.

**7.1 Lint:**
```bash
npm run lint
```
Expected: exit 0, no errors. (Scope: `src/**/*.ts` only — the demo file is not linted by this command, but `build:demo` will compile it.)

**7.2 Test:**
```bash
npm run test
```
Expected: exit 0. The two updated `ModuleHeaderComponent` tests must pass:
- `renders the four built-in action buttons when no drag handle is projected (empty slot)` → expects 4.
- `projects the drag handle into the actions nav before the built-in buttons` → expects 5 total buttons, `navButtons[0]` is the projected drag handle.

**7.3 Build:**
```bash
npm run build
```
Expected: exit 0 (`build:lib` then `build:demo` both succeed). The demo compilation confirms the projected drag handle template and the new `faUpDownLeftRight` field resolve correctly.

**On failure:** Do NOT attempt to fix by changing scope. Re-read the failing file, compare against this plan, and either correct a typo-level deviation or stop and report the exact error to the caller.

---

## Step 8 — Final self-check against acceptance criteria

Before signaling completion, verify each item from spec §7:

- [ ] `module-header.component.html` contains no built-in drag `<button>` and still contains `<ng-content select="[cbaModuleDragHandle]"></ng-content>`.
- [ ] `module-header.component.ts` no longer imports `faUpDownLeftRight` and no longer declares `faDrag`.
- [ ] `module-header.component.spec.ts` expects `4` built-in buttons (empty slot) and `5` total buttons (projected handle).
- [ ] `demo-module-card.component.ts` imports `FaIconComponent` + `faUpDownLeftRight`, adds `FaIconComponent` to `imports`, projects `<button cbaModuleDragHandle>` with `faUpDownLeftRight` icon, and declares the `faUpDownLeftRight` field.
- [ ] `docs/CBA_MODULE_HEADER.md` Icon order table + Drag handle slot description no longer reference a built-in no-op drag button; the slot is described as the only source of a drag handle.
- [ ] `CHANGELOG.md` contains `## [0.18.6] — 2026-08-20` with a `Fixed` entry (removal + demo update) and no `[Unreleased]` section.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.

---

## Step 9 — Completion summary

Report to the caller:
- **What was done:** list each file modified, the commit hash (from `git log --oneline -6`), and the final lint/test/build results.
- **What was NOT done:** no version bump (already at 0.18.6 by step 3), no branch creation/switch (step 2), no push (step 5), no SCSS changes, no public-API changes, no new dependencies.
- **Any deviations:** none expected; if any, list them with rationale.

---

## Out of scope (do NOT do)

- No changes to `module-header.component.scss`.
- No changes to `CBA_UI_MESSAGES` or `ui-messages.ts`.
- No changes to component inputs/outputs/selector/host bindings/JSDoc on the class.
- No changes to `public-api.ts` or barrel exports.
- No new dependencies in `package.json`.
- No routing, state, or demo-routing changes beyond the single demo component listed.
- No git push, no branch operations, no version bump.
- No edits to other TODO tasks' plans.
