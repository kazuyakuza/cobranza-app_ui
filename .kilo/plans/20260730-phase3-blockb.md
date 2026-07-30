# Phase 3 — Block B.1b: Implementation Plan — Styling + Behaviour

- TODO source: `.agent/todos/20260730/20260730-todo-1.md` (Tasks 3–9)
- Branch: `feat/phase3-module-container`
- Owner after approval: implementer sub-agent (Block B.2)
- Plan agent: architector (this file)

## 0. Scope & context summary

Block A already:
- Flattened the DOM: the `cba-module-container` class and **all modifier
  classes live on the `:host` element** (see `host:` bindings in
  `module-container.component.ts`).
- Bound the host modifier classes:
  `--size-50`, `--size-100`, `--collapsed`, `--fullscreen`,
  `--padding-none`, `--padding-sm`, `--padding-md`.
- Conditionally removed the body region via `@if (!isCollapsed())` in the
  template.
- Exported `ModuleContainerComponent` from `src/lib/public-api.ts` (line 19) —
  **Task 9 already satisfied; no change required** (verified during planning).

Block B (this plan) is **SCSS-only**. No TypeScript or HTML changes are
expected. All behaviour is driven by the host modifier classes already bound
in Block A.

The inner DOM (already final from Block A):

```html
<div class="cba-module-container__header">
  <ng-content select="[cbaModuleContainerHeader]"></ng-content>
</div>

@if (!isCollapsed()) {
  <div class="cba-module-container__body">
    <ng-content></ng-content>
  </div>
}
```

Available tokens (`src/lib/theme/_variables.scss`, do not rename):

- Borders: `--cba-border-subtle`, `--cba-border-default`, `--cba-border-strong`
- Radii: `--cba-radius-sm` (6px), `--cba-radius-md` (10px), `--cba-radius-lg`
- Shadow: `--cba-shadow-module`, `--cba-shadow-elevated`
- Backgrounds: `--cba-bg-secondary`, `--cba-bg-elevated`
- Spaces: `--cba-space-2` (8px), `--cba-space-3` (12px), `--cba-space-4` (16px), `--cba-space-5` (20px)

## 1. High-level approach

Replace the placeholder SCSS (`module-container.component.scss`) with the full
Block B stylesheet. Target structure:

1. `:host` base layout (keep flex column, `height: 100%`, `box-sizing`).
2. `:host(.cba-module-container--size-*)` → width mode (Task 3).
3. `:host(:not(.cba-module-container--fullscreen))` → chrome: background,
   border, border-radius, box-shadow (Task 4 non-fullscreen).
4. `:host(.cba-module-container--fullscreen)` → suppress chrome (Task 4
   fullscreen).
5. `.cba-module-container__header` → fixed height band; never scrolls
   (Task 7).
6. `.cba-module-container__body` → flex grow + `min-height: 0` + scroll
   container (Task 6) + `overscroll-behavior: contain` so scroll does NOT
   escape the module.
7. `:host(.cba-module-container--padding-*) .cba-module-container__body` →
   padding tokens (Task 5).
8. WebKit scrollbar styling: thin default, larger on `:hover` (Task 6).
9. `prefers-reduced-motion` guard (no transitions introduced in Block B, but
   add the media block for consistency / parity with ModuleHeader).

Rules compliance:
- Max 200 lines/file: the new SCSS is ~110 lines → OK.
- Theme tokens only (no hard-coded colours/sizes) → OK.
- No `::ng-deep` needed: all selectors target the host or its own inner
  regions; projected `cba-module-header` styles are owned by that component.

## 2. Atomic implementation steps

### Step B.2-1 — Replace `module-container.component.scss`

File: `src/lib/components/module-container/module-container.component.scss`

Overwrite the file with the exact content below (Block B implementation). It
is the **only** file modified by Block B.

```scss
/**
 * ModuleContainer component styles — Block B.
 *
 * The `cba-module-container` class and every modifier class live on the
 * `:host` element (see host bindings in module-container.component.ts):
 *
 *   .cba-module-container--size-50 / --size-100  → width mode
 *   .cba-module-container--fullscreen           → suppress module chrome
 *   .cba-module-container--padding-none/sm/md    → body padding
 *   .cba-module-container--collapsed             → body removed via @if
 *
 * The body region is rendered only while `isCollapsed` is false (template
 * control flow), so no scroll exists while collapsed.
 *
 * All values come from `--cba-*` tokens (see src/lib/theme/_variables.scss).
 */

:host {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

/* Task 3 — width mode driven by Shell. */
:host(.cba-module-container--size-50) {
  width: 50%;
}

:host(.cba-module-container--size-100) {
  width: 100%;
}

/* Task 4 — module chrome applied only when NOT fullscreen. */
:host(:not(.cba-module-container--fullscreen)) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  /* Clip projected header to the rounded corners. */
  overflow: hidden;
}

/* Task 4 — fullscreen: the Shell owns outer chrome. */
:host(.cba-module-container--fullscreen) {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

/* Task 7 — header band never scrolls, never shrinks. */
.cba-module-container__header {
  flex: 0 0 auto;
  min-width: 0;
}

/* Task 6 — body is the internal scroll container while expanded. */
.cba-module-container__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  /* Keep scroll inside the body; never bubble to the workspace. */
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--cba-border-default) transparent;
}

.cba-module-container__body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cba-module-container__body:hover::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

.cba-module-container__body::-webkit-scrollbar-track {
  background: transparent;
}

.cba-module-container__body::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
}

.cba-module-container__body:hover::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-strong);
}

/* Task 5 — padding modifiers (body only, host-driven). */
:host(.cba-module-container--padding-none) .cba-module-container__body {
  padding: 0;
}

:host(.cba-module-container--padding-sm) .cba-module-container__body {
  padding: var(--cba-space-2);
}

:host(.cba-module-container--padding-md) .cba-module-container__body {
  padding: var(--cba-space-4);
}

@media (prefers-reduced-motion: reduce) {
  .cba-module-container__body:hover::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
```

Line count: ~110 lines (well under the 200-line ceiling).

### Step B.2-2 — No TS / HTML edits

Confirm NO changes to:
- `module-container.component.ts` — host bindings already cover every modifier
  used by Block B. (The `--collapsed` host class is bound but unused in SCSS:
  collapsing is handled entirely by the template `@if`; the class is kept for
  Shell / debugging hooks. Do NOT remove the binding.)
- `module-container.component.html` — already final.
- `module-container.types.ts` — already final.
- `public-api.ts` — Task 9 export present; no change.

If the implementer finds any of the above contrary to reality, STOP and return
a question to the Plan Agent. Do not edit these files for Block B.

### Step B.2-3 — Verify build (Task 11 acceptance)

Run, in `C:\projects\cobranza-app\front\ui`:

```powershell
npm run lint
```

`lint` targets TS only (`eslint "src/**/*.ts"`); since Block B touches no TS,
lint should pass unchanged. Run it anyway to confirm no regressions were
introduced by prior steps.

```powershell
npm run build
```

`build` runs `ng-packagr -p ng-package.json -c tsconfig.lib.json`, which
compiles SCSS through the Angular stylesheet pipeline. This is the gate that
proves the SCSS is valid and tokens resolve. On success, exit cleanly.

### Step B.2-4 — Acceptance criteria mapping (verify, no edits)

| # | Criterion | How satisfied by Block B |
| --- | --------- | ------------------------ |
| 4 | `size` switches 50% / 100% | `:host(.cba-module-container--size-50/100)` width rules |
| 6 | Border-radius + shadow only when not fullscreen | `:host(:not(...--fullscreen))` applies them; fullscreen suppresses |
| 7 | Body is the internal scroll container when expanded | `.cba-module-container__body { overflow-y:auto; min-height:0 }` + `@if` removal when collapsed |
| 8 | `padding` controls body padding with tokens | `--padding-none/sm/md` body selectors |
| 9 | Styles use only theme tokens | every value uses `var(--cba-*)` |

## 3. Notes / decisions

- **Width approach.** `width: 50%` / `100%` on the host is the simplest,
  documented contract the Shell can rely on (parent row sizing controls the
  remainder). Intentionally NOT using `flex-basis` because the Shell owns the
  row layout; the container only declares its own width.
- **`overflow: hidden` on the non-fullscreen host.** Clips the projected
  header background to the rounded corners without affecting the body's own
  scroll (the body has its own `overflow-y: auto`). Verified: nested scroll
  inside an `overflow: hidden` ancestor scrolls normally.
- **Scrollbar enlargement.** Achieved by widening `::-webkit-scrollbar` on
  `.body:hover` (Webkit). For Firefox, `scrollbar-width: thin` is fixed
  (CSS has no hover-enlarge API); acceptable for this phase per TODO
  ("larger thumb on hover if reasonably achievable with pure CSS"). The thumb
  colour also strengthens on hover (`--cba-border-default` →
  `--cba-border-strong`).
- **No header/body divider drawn by the container.** The projected
  `cba-module-header` owns its own `border-bottom` (and removes it in
  fullscreen via its `--fullscreen` modifier). Avoiding a second border
  prevents doubled lines.
- **`overscroll-behavior: contain`.** Guarantees scroll does not chain to the
  Shell workspace, matching Task 6 ("Do not capture scroll outside the module
  body").
- **`--collapsed` host class.** Bound in Block A but not targeted in SCSS.
  Kept for Shell/debugging hooks; not required for behaviour because the body
  is removed at the template level. Do not remove the binding.
- **Robustness for long content/titles (Task 8).** Header has `min-width: 0`
  so long projected titles can shrink/clip per their own rules; body has
  `min-height: 0` + `flex: 1 1 auto` so it scrolls instead of pushing the
  host past `height: 100%`.

## 4. Out of scope (Block B does NOT do)

- Unit tests, docs, JSDoc — those are Block C / Tasks 10.
- Any TS API change.
- Drag-and-drop, workspace state, routing.
- Scrollbar jump buttons (explicitly nice-to-have, out of phase).

## 5. Verification commands (final)

```powershell
npm run lint
npm run build
```

Both must succeed from `C:\projects\cobranza-app\front\ui` before signalling
Block B completion.

## 6. Deliverable to implementer

- Apply ONLY Step B.2-1 (replace SCSS) and Step B.2-3 (verify).
- Do NOT modify TS / HTML / types / public-api.
- Commit with message:
  `feat(module-container): Block B styling — size, chrome, padding, scroll`