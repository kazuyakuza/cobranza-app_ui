# Phase 3 — Block C — Documentation & Tests

- **Branch:** `feat/phase3-module-container`
- **TODO:** `.agent/todos/20260730/20260730-todo-1.md` (Task 10)
- **Scope:** Documentation for `ModuleContainer` + focused unit tests + README link. No component logic changes.
- **Predecessors:** Block A (component, inputs, JSDoc) and Block B (styles) are DONE and reviewed.

## 1. Pre-Analysis

### 1.1 Current state (verified)

- `src/lib/components/module-container/module-container.component.ts` — standalone, `OnPush`, signal inputs (`size`, `isCollapsed`, `isFullscreen`, `padding`), host modifier classes for every input. **JSDoc is already complete** on the class and on all four public `@Input()` signals (verified: lines 11–58 class doc + `@usageNotes`; lines 78–123 input docs). Task 10 bullet "JSDoc on every public member" → **verification only, no edits required** unless a regression is found during implementation.
- Host bindings (the contract the tests must assert against):
  - `class='cba-module-container'` (always)
  - `--size-50` / `--size-100` from `size()`
  - `--collapsed` from `isCollapsed()`
  - `--fullscreen` from `isFullscreen()`
  - `--padding-none` / `--padding-sm` / `--padding-md` from `padding()`
- Template: header slot `[cbaModuleContainerHeader]`; body `.cba-module-container__body` rendered only when `!isCollapsed()` (`@if` control flow → removed from DOM when collapsed).
- Types `ModuleContainerSize`, `ModuleContainerPadding` exported from `./module-container` barrel and `public-api.ts`.
- **No spec file exists yet** for `module-container` (`glob src/lib/components/module-container/*` → no `.spec.ts`).

### 1.2 Existing doc/test patterns to follow

- Doc template: `docs/MODULE_HEADER.md` — sections: TOC → Selector → Basic usage (HTML + TS host) → Inputs → Outputs/semantics → behaviour notes → Accessibility → Related docs.
- Test template: `src/lib/components/module-header/module-header.component.spec.ts` — Jest + TestBed, `componentRef.setInput` for signal inputs, `fixture.nativeElement.querySelector` / `classList.contains` for assertions.
- JSDOM does **not** compute CSS (no `box-shadow`/`width` applied). Tests therefore assert the **host modifier classes** that drive the behaviour — that is the verifiable contract at the unit level. Each test states the visual effect it maps to.

### 1.3 Reference docs already touching ModuleContainer

- `README.md` Component Inventory row `ModuleContainer` (line 123) — no detail link yet. **Add detail link** in Documentation section.
- `docs/USAGE.md` Quick Start + "Component Usage Patterns → ModuleContainer" (lines 250–264) — brief snippet only. The new `MODULE_CONTAINER.md` is the **detailed** companion (mirrors how `MODULE_HEADER.md` complements the USAGE snippet).

### 1.4 Technical decisions

- Single new doc file `docs/MODULE_CONTAINER.md` (follows `MODULE_HEADER.md` structure exactly; covers all sub-bullets the TODO requires: selector + usage with projected header+body, full inputs table, size/collapsed/fullscreen behaviour, padding options, internal-scroll note, border/shadow-suppression note).
- README change is **minimal and surgical**: one new bullet in the existing Documentation list, between the `MODULE_HEADER.md` bullet and the `brief.md` bullet (preserve ordering: component docs grouped together).
- Tests are **focused (4 tests)** covering the four behaviours the TODO lists. Keep the suite small and clear. Tests use the established `setup()` + helper-query pattern from the header spec.
- File-size rule (max 200 lines src): doc files are exempt (not `src/`); the spec file target is < 100 lines.
- Method-body rule (max 50 lines): each test/ helper stays well under.

## 2. High-Level Approach

1. Verify `module-container.component.ts` JSDoc still covers every public member (read-only check). If complete → no edit.
2. Create `docs/MODULE_CONTAINER.md` with the exact content in §3.1.
3. Create `src/lib/components/module-container/module-container.component.spec.ts` with the exact content in §3.2.
4. Edit `README.md` Documentation section: add the `MODULE_CONTAINER.md` bullet per §3.3.
5. Run verification: `npm test`, `npm run lint`, `npm run build`.
6. Commit (message in §5).

## 3. Exact File Contents

### 3.1 NEW — `docs/MODULE_CONTAINER.md`

```markdown
# ModuleContainer

Wrapper that hosts a projected module header and the MFE body inside the Company Back-office Shell workspace. Provides consistent chrome (border, radius, shadow), size mode, collapse, fullscreen, and internal scrolling.

## Table of Contents

- [Selector](#selector)
- [Basic usage](#basic-usage)
- [Content projection](#content-projection)
- [Inputs](#inputs)
- [Size behaviour](#size-behaviour)
- [Collapsed behaviour](#collapsed-behaviour)
- [Fullscreen behaviour](#fullscreen-behaviour)
- [Padding options](#padding-options)
- [Scroll behaviour](#scroll-behaviour)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-module-container>` — standalone component exported from `@cobranza-apps/ui`.

## Basic usage

### Template (HTML)

```html
<cba-module-container
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  [padding]="padding">

  <cba-module-header
    cbaModuleContainerHeader
    title="Customer Module"
    [size]="size"
    [isCollapsed]="isCollapsed"
    [isFullscreen]="isFullscreen"
    status="loaded"
    (collapseToggle)="onCollapse()"
    (sizeToggle)="onSizeChange($event)"
    (fullscreenToggle)="onFullscreen()"
    (remove)="onRemove()">
  </cba-module-header>

  <!-- Projected MFE body content -->
  <app-customers-mfe></app-customers-mfe>
</cba-module-container>
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import {
  ModuleHeaderComponent,
  ModuleContainerComponent,
  ModuleContainerSize,
  ModuleContainerPadding,
} from '@cobranza-apps/ui';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ModuleHeaderComponent, ModuleContainerComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  size: ModuleContainerSize = '100%';
  isCollapsed = false;
  isFullscreen = false;
  padding: ModuleContainerPadding = 'sm';

  onCollapse(): void { this.isCollapsed = !this.isCollapsed; }
  onSizeChange(target: ModuleContainerSize): void { this.size = target; }
  onFullscreen(): void { this.isFullscreen = !this.isFullscreen; }
  onRemove(): void { /* Shell handles removal */ }
}
```

## Content projection

| Slot | Selector | Purpose |
| --- | --- | --- |
| Header | `[cbaModuleContainerHeader]` attribute | Projects the module header (typically `<cba-module-header>`). Rendered in a fixed, non-scrollable flex band. |
| Body | default `<ng-content>` | Projects the MFE content. This region is the internal scroll container while expanded. |

## Inputs

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| size | `'50%' \| '100%'` | `'100%'` | no | Workspace width mode. Drives the `cba-module-container--size-50` / `--size-100` host modifier. |
| isCollapsed | `boolean` | `false` | no | When `true` the body region is removed from the DOM (no layout box, no scroll). Adds the `--collapsed` host modifier. |
| isFullscreen | `boolean` | `false` | no | When `true` module chrome (border-radius, shadow) is suppressed; the Shell fullscreen view owns the outer chrome. Adds the `--fullscreen` host modifier. |
| padding | `'none' \| 'sm' \| 'md'` | `'sm'` | no | Internal padding of the body region. Drives the `--padding-none/sm/md` host modifiers. |

The container never mutates these values — the Shell owns the source of truth and re-binds state on every change.

## Size behaviour

| Value | Host modifier | Layout |
| --- | --- | --- |
| `'100%'` (default) | `cba-module-container--size-100` | Container takes the full available width of its parent row/cell. |
| `'50%'` | `cba-module-container--size-50` | Container takes half of the available width (Shell row handles the other half). |

Size is applied via CSS classes on the host element so the Shell layout can rely on a stable contract.

## Collapsed behaviour

When `isCollapsed === true`:

- The body region (`.cba-module-container__body`) is removed from the DOM via Angular `@if` control flow.
- No layout box is rendered and no scroll area exists while collapsed.
- The host receives the `cba-module-container--collapsed` modifier.
- The header band remains rendered and never scrolls.

## Fullscreen behaviour

When `isFullscreen === true`:

- The host receives the `cba-module-container--fullscreen` modifier.
- **Border-radius and module shadow are suppressed** (`box-shadow: var(--cba-shadow-module)` and `border-radius` are only applied under `:host(:not(.cba-module-container--fullscreen))`). Background and border are also removed.
- The Shell fullscreen view owns the outer chrome.
- The container still hosts both the projected header and the body.

## Padding options

Padding applies to the **body region only** (the header band is unaffected).

| Value | Suggested padding | Host modifier |
| --- | --- | --- |
| `none` | `0` | `cba-module-container--padding-none` |
| `sm` (default) | `var(--cba-space-2)` | `cba-module-container--padding-sm` |
| `md` | `var(--cba-space-4)` | `cba-module-container--padding-md` |

All values come from `--cba-*` spacing tokens (see `src/lib/theme/_variables.scss`).

## Scroll behaviour

- Scroll exists **only** while the module is expanded (`isCollapsed === false`).
- The body region (`.cba-module-container__body`) is the scroll container: `overflow-y: auto`, `flex: 1 1 auto`, `min-height: 0`, and `overscroll-behavior: contain`.
- Scroll never bubbles outside the body; the Shell workspace scrolls independently.
- Scrollbar styling is CSS-only and thin by default; the WebKit thumb widens on hover. Optional top/bottom jump buttons are out of scope for this phase.

## Accessibility

- The container itself introduces no interactive controls; interactive elements live in the projected `cba-module-header`.
- `:focus-visible` indicators (via `--cba-focus-ring`) come from the projected header buttons.
- `prefers-reduced-motion: reduce` keeps the hover scrollbar at its default (thin) width.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
- [MODULE_HEADER.md](./MODULE_HEADER.md)
```

> File is ~150 lines — within the documentation exemption (not a `src/` file). TOC anchor IDs are lowercase-kebab of headings.

### 3.2 NEW — `src/lib/components/module-container/module-container.component.spec.ts`

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleContainerComponent } from './module-container.component';

describe('ModuleContainerComponent', () => {
  let fixture: ComponentFixture<ModuleContainerComponent>;

  function setup(): void {
    fixture = TestBed.createComponent(ModuleContainerComponent);
    fixture.detectChanges();
  }

  function hostHasClass(name: string): boolean {
    return fixture.nativeElement.classList.contains(name);
  }

  function bodyRegion(): Element | null {
    return fixture.nativeElement.querySelector('.cba-module-container__body');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleContainerComponent],
    }).compileComponents();
  });

  it('applies the size-100 host modifier by default and switches to size-50', () => {
    setup();
    expect(hostHasClass('cba-module-container--size-100')).toBe(true);
    expect(hostHasClass('cba-module-container--size-50')).toBe(false);

    fixture.componentRef.setInput('size', '50%');
    fixture.detectChanges();

    expect(hostHasClass('cba-module-container--size-50')).toBe(true);
    expect(hostHasClass('cba-module-container--size-100')).toBe(false);
  });

  it('renders the body by default and removes it when isCollapsed is true', () => {
    setup();
    expect(bodyRegion()).not.toBeNull();
    expect(hostHasClass('cba-module-container--collapsed')).toBe(false);

    fixture.componentRef.setInput('isCollapsed', true);
    fixture.detectChanges();

    expect(bodyRegion()).toBeNull();
    expect(hostHasClass('cba-module-container--collapsed')).toBe(true);
  });

  it('applies the fullscreen host modifier that suppresses module chrome', () => {
    setup();
    expect(hostHasClass('cba-module-container--fullscreen')).toBe(false);

    fixture.componentRef.setInput('isFullscreen', true);
    fixture.detectChanges();

    // Chrome (border-radius + box-shadow) is suppressed under
    // :host(:not(.cba-module-container--fullscreen)); the host modifier is the
    // verifiable contract at the unit level (jsdom does not compute CSS).
    expect(hostHasClass('cba-module-container--fullscreen')).toBe(true);
  });

  it('applies the expected padding modifier for none sm and md', () => {
    setup();
    expect(hostHasClass('cba-module-container--padding-sm')).toBe(true);

    fixture.componentRef.setInput('padding', 'none');
    fixture.detectChanges();
    expect(hostHasClass('cba-module-container--padding-none')).toBe(true);

    fixture.componentRef.setInput('padding', 'md');
    fixture.detectChanges();
    expect(hostHasClass('cba-module-container--padding-md')).toBe(true);
  });
});
```

> ~75 lines — well under the 200-line src limit. Each test body ≤ 50 lines. No helper exceeds 2 params. No nesting > 2 levels.

### 3.3 EDIT — `README.md` (Documentation section)

Current block (lines 182–184):

```markdown
- [`/docs/USAGE.md`](/docs/USAGE.md) — Patterns and examples for consuming the library.
- [`/docs/THEME.md`](/docs/THEME.md) — Theme import, tokens, and utility classes.
- [`/docs/MODULE_HEADER.md`](/docs/MODULE_HEADER.md) — `ModuleHeader` selector, API, status values, fullscreen & drag notes.
```

Insert one new bullet right after the `MODULE_HEADER.md` bullet (component docs stay grouped):

```markdown
- [`/docs/MODULE_CONTAINER.md`](/docs/MODULE_CONTAINER.md) — `ModuleContainer` selector, API, size/collapse/fullscreen/padding behaviour, scroll & chrome notes.
```

Resulting ordered list: `USAGE.md`, `THEME.md`, `MODULE_HEADER.md`, `MODULE_CONTAINER.md`, `brief.md`, `product.md`, `architecture.md`, `tech.md`, JSDoc bullet. No other README lines change.

## 4. Implementation Steps (atomic + verifiable)

Each step is a discrete edit. Verify with the listed check.

### Step C.1 — Verify JSDoc completeness (read-only)

- Re-read `src/lib/components/module-container/module-container.component.ts`.
- Confirm JSDoc exists on: class (with `@usageNotes`), `size`, `isCollapsed`, `isFullscreen`, `padding`.
- **Check:** if all present → no edit. If any missing → restore from Block A (the class doc block lines 11–58 and input docs 78–123 are the reference).

### Step C.2 — Create `docs/MODULE_CONTAINER.md`

- Use `vscode-mcp-server_create_file_code` with `ignoreIfExists: true`.
- Content: §3.1 exactly (real newlines, no literal `\n`).
- **Verify:** `docs/MODULE_CONTAINER.md` exists; `grep -c "^## " docs/MODULE_CONTAINER.md` returns ≥ 11.

### Step C.3 — Create the spec file

- Path: `src/lib/components/module-container/module-container.component.spec.ts`
- Use `vscode-mcp-server_create_file_code` with `ignoreIfExists: true`.
- Content: §3.2 exactly.
- **Verify:** file exists; `grep -c "it(" ...spec.ts` returns 4.

### Step C.4 — Update README Documentation section

- Use `vscode-mcp-server_replace_lines_code` on the `MODULE_HEADER.md` bullet line, replacing it with the two bullets (header + new container).
- Preserve surrounding lines and indentation exactly.
- **Verify:** `grep "MODULE_CONTAINER.md" README.md` returns the new line; `grep -c "MODULE_HEADER.md" README.md` still returns 1 (Component Inventory + Documentation).

### Step C.5 — Run verification commands (single cmds each, no chaining)

1. `npm test` — expect: 4 ModuleContainer tests pass + existing ModuleHeader tests pass; total failures = 0.
2. `npm run lint` — expect: no errors in `src/**/*.ts` (includes the new spec).
3. `npm run build` — expect: ng-packagr build to `dist/` succeeds (no public-API change; doc-only build impact).

If any command fails, stop and report to caller — do not self-remediate beyond the plan.

### Step C.6 — Diagnostics check

- Run `vscode-mcp-server_get_diagnostics_code` on the new spec file path (severities `[0,1]`).
- Expect 0 errors, 0 warnings.

## 5. Git Actions

After all steps green:

1. `git status` — confirm staged set is exactly:
   - `docs/MODULE_CONTAINER.md` (new)
   - `src/lib/components/module-container/module-container.component.spec.ts` (new)
   - `README.md` (modified)
   - Optionally `.kilo/plans/20260730-phase3-blockc.md` (this plan) if plans are tracked on this branch.
2. `gitignore-compliance`: confirm no `dist/`, `node_modules/`, or coverage artefacts staged.
3. Commit message:

```
docs(module-container): add docs and focused unit tests

- docs/MODULE_CONTAINER.md: selector, usage, inputs, size/collapse/
  fullscreen/padding behaviour, scroll & chrome-suppression notes.
- module-container.component.spec.ts: 4 focused tests for size modifier,
  body removal on collapse, fullscreen chrome modifier, padding modifiers.
- README.md: link MODULE_CONTAINER.md in Documentation section.
```

Do **not** push (Step 5 of the critical workflow handles push to `origin` only, later). Do **not** mark TODO Task 10 done — that is Block C.6 / Step 4.6, a separate sub-task.

## 6. Acceptance Mapping (TODO Task 10 → this plan)

| TODO Task 10 bullet | Where addressed |
| --- | --- |
| JSDoc on every public member | Step C.1 (verification; already complete from Block A) |
| New docs file under `/docs`, linked from README + related docs | §3.1 (`MODULE_CONTAINER.md`) + §3.3 (README) + Related docs links in §3.1 |
| Selector + usage with projected header + body | §3.1 Selector + Basic usage |
| Full inputs table | §3.1 Inputs |
| Size / collapsed / fullscreen behaviour | §3.1 Size/Collapsed/Fullscreen sections |
| Padding options | §3.1 Padding options |
| Note scroll is internal to body when expanded | §3.1 Scroll behaviour |
| Note border/shadow suppressed in fullscreen | §3.1 Fullscreen behaviour |
| Test: size class for 50%/100% | §3.2 test 1 |
| Test: hides body when collapsed | §3.2 test 2 |
| Test: no chrome when fullscreen | §3.2 test 3 |
| Test: padding class none/sm/md | §3.2 test 4 |
| Small suite, clarity over exhaustiveness | 4 tests total |

## 7. Out of Scope (do NOT do in this block)

- Modify `module-container.component.ts` / `.html` / `.scss` / `.types.ts` / `index.ts` / `public-api.ts` (component logic is final from Block B).
- Mark TODO Task 10 as `[DONE]` (handled by Step 4.6).
- Merge branch / push (handled by Step 5).
- Update `docs/USAGE.md` — it already references ModuleContainer and stays the curated patterns file; `MODULE_CONTAINER.md` is the detailed API doc.
- Add `MODULE_CONTAINER.md` link to `MODULE_HEADER.md` (it already cross-links to README/USAGE/THEME; the new doc carries the reverse link to `MODULE_HEADER.md`).
- Update `.agent/project-structure.md` (no new folders).

## 8. Risks / Edge Cases

- **JSDOM computes no CSS.** Tests assert host modifier classes (the deterministic contract), not computed `box-shadow`/`width`. Each test states the visual effect it maps to, keeping the suite honest and stable.
- **Signal inputs must be set via `componentRef.setInput`** (not `component.size = ...`). The header spec already uses this pattern; the new spec follows it.
- **`detectChanges` after each `setInput`** is required for host class bindings to update. Every test in §3.2 calls `fixture.detectChanges()` after changing an input.
- **README replace** must not alter the separate `MODULE_HEADER.md` reference in the Component Inventory table (line 123 area) — only the Documentation list bullet is replaced/extended.

## 9. Deliverables Summary

- Plan file: `.kilo/plans/20260730-phase3-blockc.md` (this file).
- 3 file changes for implementation:
  1. `docs/MODULE_CONTAINER.md` (new)
  2. `src/lib/components/module-container/module-container.component.spec.ts` (new)
  3. `README.md` (one bullet added)
- Verification: `npm test`, `npm run lint`, `npm run build` all green.