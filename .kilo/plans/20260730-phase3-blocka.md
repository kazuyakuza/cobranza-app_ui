<!--
  FILE: 20260730-phase3-blocka.md
  PURPOSE: Implementation plan for Phase 3, Block A (TODO Tasks 1–2) of
           ModuleContainerComponent — component generation, inputs, JSDoc,
           template structure, and content projection.
  AUDIENCE: Implementer (Block A / 4.2), Code Reviewer, Code Simplifier,
            Plan Adherence (4.5b).
  INPUTS:
    - TODO:  .agent/todos/20260730/20260730-todo-1.md (Tasks 1–2)
    - SPEC:  .kilo/plans/20260730-phase3-blocka-frontend-spec.md
    - BRANCH (already created in Step 2 of Critical Workflow): feat/phase3-module-container
  SCOPE BOUNDARY:
    - IN:  Tasks 1 (generate component + inputs + JSDoc) and 2 (template
           structure + content projection + collapsed/fullscreen handling).
    - OUT (deferred to Block B): size CSS behaviour, chrome (border/radius/
           shadow), padding mapping, scroll styling, full SCSS rules.
    - OUT (deferred to Block C/D): documentation file, unit tests spec,
           project-structure update (already lists the folder).
-->

# Phase 3 — Block A Implementation Plan

## 0. Scope cross-check

| TODO task | Block A covers | Deferred to |
| --------- | -------------- | ----------- |
| 1. Generate component | standalone, selector, OnPush, all 4 inputs, JSDoc on class + inputs | — |
| 2. Template structure | header/body projection, collapse removal, fullscreen hosting | — |
| 3. Size behaviour | host binding classes only (no CSS values) | Block B |
| 4. Chrome | host binding classes only (no CSS values) | Block B |
| 5. Padding | host binding classes only (no CSS values) | Block B |
| 6. Scroll | body wrapper `overflow` deferred | Block B |
| 7. ModuleHeader integration | verified via projection selector (no wiring) | — |
| 8. Styles | minimal placeholder SCSS | Block B |
| 9. Export | barrel + public-api update | — |
| 10. Docs & tests | excluded | Block C/D |

Block A produces a compiling, exportable component whose host classes are
already wired for Block B to style. No CSS values are authored here.

## 1. Pre-implementation verification

Before writing any file:

1. Confirm on branch `feat/phase3-module-container`:
   `git branch --show-current`
2. Confirm working tree clean except for spec/plan files:
   `git status --short`
   Expected: only `.kilo/plans/` artefacts untracked; no staged code files.
3. Read `.gitignore` (gitignore-compliance rule) before any later commit.

No git actions are performed by Block A itself; commits happen during the
Implementation sub-step (4.2) driven by the Plan Agent.

## 2. High-level approach

Create five files under `src/lib/components/module-container/` and update
one existing file. The component follows the `ModuleHeaderComponent` pattern
exactly:
- Signal-based `input()` with no transforms.
- `ChangeDetectionStrategy.OnPush`.
- `host` map driving modifier classes (no inline styles).
- `templateUrl` + `styleUrl` (external files).
- JSDoc on the class (`@usageNotes`, `@see`) and on every public input.
- Barrel `index.ts` re-exporting types + component.

The SCSS file is a minimal placeholder: only the `:host` `display:flex` rule
required for the template to render sensibly, plus a header-note comment
reserving the full styling to Block B. This keeps Block A within scope while
leaving the host modifier classes (already bound in TS) ready for Block B
to style.

## 3. Files to create / modify

```text
src/lib/components/module-container/
  module-container.types.ts         # NEW
  module-container.component.ts      # NEW
  module-container.component.html    # NEW
  module-container.component.scss    # NEW (minimal placeholder)
  index.ts                           # MODIFY (replace empty barrel)
src/lib/public-api.ts                # MODIFY (add export line)
```

No other files are touched. No tests, no docs, no project-structure change
(folder already documented).

---

### 3.1 NEW `src/lib/components/module-container/module-container.types.ts`

Single-section public type aliases. Matches spec §3 and `ModuleHeaderSize`
documentation style.

```ts
/**
 * Width modes supported by {@link ModuleContainerComponent} `size` input.
 *
 * `'50%'`  — module rendered at half of the workspace row width.
 * `'100%'` — module rendered at the full workspace row width.
 */
export type ModuleContainerSize = '50%' | '100%';

/**
 * Body padding options supported by {@link ModuleContainerComponent} `padding` input.
 *
 * | Value  | Suggested padding            |
 * | ------ | ---------------------------- |
 * | `none` | `0`                          |
 * | `sm`   | Small balanced spacing token |
 * | `md`   | Medium spacing token         |
 */
export type ModuleContainerPadding = 'none' | 'sm' | 'md';
```

Line count: ~20. Complies with all rules (no methods, no nesting).

---

### 3.2 NEW `src/lib/components/module-container/module-container.component.ts`

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import {
  ModuleContainerSize,
  ModuleContainerPadding,
} from './module-container.types';

/**
 * Wrapper that hosts a projected module header + the MFE body inside the
 * Shell workspace.
 *
 * Visual state (size, collapse, fullscreen, padding) is driven entirely by
 * inputs and reflected on the host element as modifier classes. The
 * component never mutates these values; the Shell owns the source of
 * truth and re-binds state on every change.
 *
 * Content projection:
 * - Header slot: any element carrying the `[cbaModuleContainerHeader]`
 *   attribute (typically `<cba-module-header cbaModuleContainerHeader>`).
 * - Body slot:   the default `<ng-content>` projection.
 *
 * The body region is removed from the DOM while `isCollapsed` is `true`,
 * so it never participates in layout or scroll. In fullscreen mode the
 * container still hosts header + body; the chrome (border-radius, shadow)
 * modifiers are suppressed via the `cba-module-container--fullscreen`
 * host class (styled in Block B).
 *
 * Styling of size / chrome / padding / scroll is intentionally handled in
 * Block B. Block A wires the host modifier classes only.
 *
 * Exported from `@cobranza-apps/ui` via `src/lib/public-api.ts`.
 *
 * @usageNotes
 * ```html
 * <cba-module-container
 *   [size]="size"
 *   [isCollapsed]="isCollapsed"
 *   [isFullscreen]="isFullscreen"
 *   [padding]="padding">
 *
 *   <cba-module-header
 *     cbaModuleContainerHeader
 *     title="Customers"
 *     [size]="size"
 *     [isCollapsed]="isCollapsed"
 *     [isFullscreen]="isFullscreen">
 *   </cba-module-header>
 *
 *   <app-customers-mfe></app-customers-mfe>
 * </cba-module-container>
 * ```
 *
 * @see {@link ModuleContainerSize}
 * @see {@link ModuleContainerPadding}
 * @see {@link ModuleHeaderComponent}
 */
@Component({
  selector: 'cba-module-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-container.component.html',
  styleUrl: './module-container.component.scss',
  host: {
    '[class.cba-module-container--size-50]': "size() === '50%'",
    '[class.cba-module-container--size-100]': "size() === '100%'",
    '[class.cba-module-container--collapsed]': 'isCollapsed()',
    '[class.cba-module-container--fullscreen]': 'isFullscreen()',
    '[class.cba-module-container--padding-none]': "padding() === 'none'",
    '[class.cba-module-container--padding-sm]': "padding() === 'sm'",
    '[class.cba-module-container--padding-md]': "padding() === 'md'",
  },
})
export class ModuleContainerComponent {
  /** Workspace width mode. Drives the size modifier class on the host element. */
  readonly size = input<ModuleContainerSize>('100%');

  /** When `true`, the body region is removed from the DOM (no layout box, no scroll). */
  readonly isCollapsed = input<boolean>(false);

  /** When `true`, module chrome modifier classes are present for Block B to suppress border-radius and shadow. */
  readonly isFullscreen = input<boolean>(false);

  /** Body internal padding. Drives the padding modifier class applied to the body region by Block B. */
  readonly padding = input<ModuleContainerPadding>('sm');
}
```

Rule compliance notes:
- File ≈ 100 lines (under 200).
- Class body 4 lines (under 50).
- All inputs use signal `input()` with ≤ 2 args (1 arg each): satisfies
  `max-arguments-per-method` (input is a function call, one arg).
- All members `readonly` and public (inputs must be public to bind).
- `host` binding conditions are single-section (e.g. `size() === '50%'`).
- No private members needed — the class holds no internal state.

---

### 3.3 NEW `src/lib/components/module-container/module-container.component.html`

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

Rule compliance notes:
- `@if (!isCollapsed())` is a single-section boolean condition.
- Header wrapper always rendered; body wrapper rendered only when expanded
  (meets TODO Task 2 collapsed rule and spec §7 rendering rules 1–4).
- No inline styles; all visuals come from host modifier classes (Block B).

---

### 3.4 NEW `src/lib/components/module-container/module-container.component.scss`

Minimal placeholder for Block A. Block B will author size, chrome, padding
and scroll rules here.

```scss
/**
 * ModuleContainer component styles.
 *
 * Block A scope: only the host layout rule needed for the projected
 * header + body to render sensibly. All size / chrome / padding / scroll
 * behaviour is implemented in Block B using the host modifier classes
 * bound in module-container.component.ts:
 *
 *   .cba-module-container--size-50 / --size-100
 *   .cba-module-container--collapsed
 *   .cba-module-container--fullscreen
 *   .cba-module-container--padding-none / --padding-sm / --padding-md
 */
:host {
  display: flex;
  flex-direction: column;
}

.cba-module-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
```

This file uses only structural CSS (flex layout + box-sizing) so the
component compiles and projects content without Block B's token-based
theme. No `--cba-*` token values are introduced in Block A (tokens belong
to Block B). No commented-out code; the header comment is documentation,
not commented code.

---

### 3.5 MODIFY `src/lib/components/module-container/index.ts`

Replace the current empty `export {}` barrel with a real re-export. Write
the full file content:

```ts
/**
 * Barrel file for ModuleContainer.
 *
 * Re-exports the public API of the ModuleContainer component so consumers
 * and `public-api.ts` import from a single, stable path
 * (`components/module-container`). Internal helpers or test utilities are
 * NOT exported from here.
 */
export * from './module-container.types';
export * from './module-container.component';
```

---

### 3.6 MODIFY `src/lib/public-api.ts`

Add the module-container export immediately after the existing
`module-header` line, keeping alphabetical / category grouping. The new
content of the components section:

```ts
/** Components. */
export * from './components/module-header';
export * from './components/module-container';
```

Only one line is added; the rest of the file (header JSDoc, structure) is
preserved exactly. The implementer must read the file first (per `write`
tool requirement) and apply a targeted edit, not a full overwrite.

---

## 4. Implementation order (executed in 4.2)

Strictly sequential; each step produces a self-contained, compiling state.

1. Read `.gitignore`; run `git status --short` (gitignore-compliance).
2. Create `module-container.types.ts`.
3. Create `module-container.component.ts`.
4. Create `module-container.component.html`.
5. Create `module-container.component.scss` (placeholder).
6. Replace `module-container/index.ts` barrel contents.
7. Edit `src/lib/public-api.ts` to add the module-container export line.
8. Run verification commands (§5).
9. Commit with message:
   `feat(module-container): generate standalone component with inputs, JSDoc, template and content projection`
   Stage only the files listed in §3. Verify no `.gitignore`-matching
   artefacts are staged.

## 5. Verification commands

Run each command as a single `bash` invocation (no chaining).

1. Lint:
   `npm run lint`
2. Library build (acceptance criterion #11 is verified at the phase level;
   Block A still confirms compilation):
   `npm run build`
3. Type check (if the project exposes it — see `tech.md` scripts; skip if
   not present to avoid an unknown-command retry loop):
   `npm run typecheck`

Acceptance for Block A: lint and build exit `0`. No new unit tests are
added in Block A (tests are Block C/D).

## 6. Acceptance criteria for Block A (from spec §11)

| # | Criterion | Verified by |
| --- | --------- | ----------- |
| 1 | Standalone component with correct selector + OnPush | code review |
| 2 | All 4 inputs declared via `input()` with exact types/defaults | code review |
| 3 | JSDoc on class + every public input | code review |
| 4 | Header slot `[cbaModuleContainerHeader]` + default body slot | code review |
| 5 | Body removed from DOM when `isCollapsed` is true (`@if`) | code review |
| 6 | Host bindings map size/collapse/fullscreen/padding to modifier classes | code review |
| 7 | Fullscreen modifier class present for Block B to suppress chrome | code review |
| 8 | File structure matches spec §2; barrel export configured; public-api updated | code review + build |

Build passing additionally satisfies phase acceptance #1 and #10 (compile
+ export). Phase criteria #2–9 (visual behaviours) are met once Block B
styles the modifier classes; Block A wires them.

## 7. What is NOT done in Block A

- No SCSS size / chrome / padding / scroll rules (Block B).
- No unit tests `module-container.component.spec.ts` (Block C/D, per TODO
  Task 10).
- No `/docs/MODULE_CONTAINER.md` documentation (Block C/D, per TODO Task 10).
- No `.agent/project-structure.md` update (folder already listed).
- No git branch creation or merge (handled by Step 2 / Step 5 of the
  Critical Workflow).
- No version bump (Step 3 of the Critical Workflow).
- No `npm install` (no new dependencies; Angular core already present).