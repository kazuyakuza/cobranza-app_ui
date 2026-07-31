# CbaPopover — Implementation Plan

**Task:** Phase 6 — Task 2 — Implement `CbaPopover` (Critical Workflow step 4.1b)
**Source TODO:** `.agent/todos/20260730/20260730-todo-4.md` → Section "### 2. Implement CbaPopover"
**Front-end spec (4.1a):** `.kilo/plans/20260731-task2-popover-frontend-spec.md`
**Date:** 2026-07-31
**Author:** Architector (Critical Workflow 4.1b)
**Target branch:** `feat/phase6-controls` (created in step 2 of the global plan)

> This plan is consumed by the implementer (4.2) and the code-reviewer / code-simplifier (4.3).
> It is the single source of truth for the popover task scope. Do not expand to other Phase 6 tasks.

---

## 1. Pre-Analysis & Technical Decisions

### 1.1 Empirical verification of `hostDirectives: [NgbPopover]`

Verified against the installed ng-bootstrap v21 source
(`node_modules/@ng-bootstrap/ng-bootstrap/fesm2022/ng-bootstrap-ng-bootstrap-popover.mjs`):

- `NgbPopover` is a `@Directive({ selector: '[ngbPopover]' })`, **standalone**, `exportAs: 'ngbPopover'`.
- It has **no `@ContentChild` / `@ViewChild` queries** (unlike `NgbDropdown`, which needs its `_menu` linked via `ContentChild(NgbDropdownMenu)`). The popover body comes entirely from the `ngbPopover` **input** (string or `TemplateRef`); the window is a separate `NgbPopoverWindow` component instantiated by `PopupService.open(...)`.
- `ngOnInit` registers trigger listeners on `this._nativeElement` (the host element). With `hostDirectives`, that element is `<cba-popover>`, so hover/focus/click events on the projected trigger **bubble up** to open/close the popover.
- `_getPositionTargetElement()` returns `positionTarget` (if set) or `this._nativeElement` (the host), so positioning still anchors to `<cba-popover>` (which wraps the trigger) — acceptable.
- `NgbPopoverWindow` uses `ViewEncapsulation.None` and binds host `[class] = "popover" + popoverClass`. Setting `popoverClass = "cba-popover-window"` makes the global theme SCSS cleanly target it regardless of where the window is appended.

**Conclusion:** `hostDirectives: [NgbPopover]` is the **correct and simplest** approach. No `ViewChild`/`_menu` workaround is required (unlike `CbaDropdown`). The inner-template alternative (applying `NgbPopover` to a wrapper `<div>`) offers no benefit here, would lose the stable `cba-popover` element selector, and would force consumers to apply the directive to each trigger — so it is rejected. The front-end spec's choice is confirmed by this empirical evidence.

### 1.2 Default-value corrections vs the spec

The front-end spec assumed some ng-bootstrap defaults; verified truth differs and is handled by the component's own input defaults:

| ng-bootstrap config default | Front-end spec desired default | Handling |
| --- | --- | --- |
| `triggers = 'click'` | `'hover focus'` | Component signal input default `'hover focus'`, forwarded via `hostDirectives` input `triggers`. |
| `placement = 'auto'` | `'auto'` | Matches. Component signal default `'auto'` (still forwarded so the value is owned by the wrapper). |
| `disablePopover = false` | `false` | Matches. Component signal default `false`. |
| `container = undefined` (window renders **adjacent** to host, **not** appended to `<body>`) | Spec 3.3 asserts `container: 'body'` | Set `container = 'body'` **programmatically** in the constructor. Avoids clipping by `overflow: hidden` ancestors (common inside `CbaModuleContainer`/Shell footer) and matches the spec assumption. Positioning still anchors to the host because `positionTarget` defaults to the host native element. |
| `popoverClass` — not set by default | `'cba-popover-window'` | Set **programmatically** in the constructor (inject `NgbPopover`), so `popoverClass` is **not** added to the wrapper's public input API. |

### 1.3 Inputs / outputs forwarding strategy

- Use `hostDirectives` `inputs`/`outputs` mappings for everything the spec exposes
  (`body`→`ngbPopover`, `title`→`popoverTitle`, `placement`, `triggers`, `disabled`→`disablePopover`, and outputs `shown`/`hidden`).
- Do **not** re-declare `shown`/`hidden` as component-level `output()` fields. With `outputs: ['shown', 'hidden']` in the `hostDirectives` config, Angular automatically re-emits the directive's outputs through the host component. Re-declaring them as `output()` would create separate, never-fed outputs (this is the bug to avoid — `CbaDropdown` uses **manual** subscription because it did **not** list outputs in `hostDirectives`; `CbaPopover` **does** list them, so no manual wiring is needed).
- `popoverClass` and `container` are set by injecting `NgbPopover` in the constructor (kept private; not part of the public input API).

### 1.4 Constraints honored

- `src/` file ≤ 200 lines; method body ≤ 50 lines; ≤ 2 params (none here); max nesting depth 2; private members by default; standalone-only; Angular 22 signal `input`/`output`; JSDoc on public class + inputs.
- Theme uses only `--cba-*` tokens (all referenced tokens verified present in `src/theme/_variables.scss`).
- No business logic, no BFF, no custom popover engine — behaviour delegated to ng-bootstrap.

---

## 2. Files to Create / Modify (exact paths)

### 2.1 Create

| # | Path | Purpose |
| --- | --- | --- |
| 1 | `src/components/popover/cba-popover.types.ts` | `CbaPopoverPlacement` type alias (mirrors `cba-modal.types.ts` pattern). |
| 2 | `src/components/popover/cba-popover.component.ts` | Standalone wrapper component. |
| 3 | `src/components/popover/cba-popover.component.html` | Template — single `<ng-content></ng-content>` (projected trigger). |
| 4 | `src/components/popover/cba-popover.component.scss` | Component-scoped styles — `:host { display: inline-block; }` only. |
| 5 | `src/components/popover/cba-popover.component.spec.ts` | Minimal wrapper unit tests (Jest). |
| 6 | `src/components/popover/index.ts` | Barrel — re-exports the component and the type. |
| 7 | `src/theme/_popover.scss` | Global popover-window theming scoped to `.cba-popover-window`. |
| 8 | `docs/CBA_POPOVER.md` | Usage docs, behaviour note, Shell-footer hover example. |

### 2.2 Modify

| # | Path | Change |
| --- | --- | --- |
| 9 | `src/theme/theme.scss` | Add `@use 'popover';` (after `@use 'datepicker';`, before `@use 'mixins';`). |
| 10 | `src/public-api.ts` | Add `export * from './components/popover';` (alphabetical: after `module-header`, before `select`). |
| 11 | `.agent/project-structure.md` | Add one line under `# Folders in src/`: `- src/components/popover/ - CbaPopover component: thin ng-bootstrap NgbPopover wrapper with projected trigger and string/template body` |

> `docs/` is documentation only — created by the docs-specialist in 4.4 normally, but per the spec acceptance criteria the file must exist after this task. The implementer (4.2) creates the code files + theme + barrel + structure regen; the docs file is created in **4.4**. To keep 4.2 self-verifiable, 4.2 builds the library; the `docs/CBA_POPOVER.md` is produced in 4.4. (This plan still lists it so 4.4 knows what to write — see §5.)

---

## 3. Code Snippets

### 3.1 `src/components/popover/cba-popover.types.ts`

```ts
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/** Placement alias used by `CbaPopover`. Passthrough to ng-bootstrap's `PlacementArray`. */
export type CbaPopoverPlacement = PlacementArray;
```

### 3.2 `src/components/popover/cba-popover.component.ts`

```ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CbaPopoverPlacement } from './cba-popover.types';

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` popover.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns popover open/close, trigger listening, Popper positioning,
 *   animation, auto-close, and the rendered `.popover` window appended to `<body>`.
 * - This component owns the Cobranza gray theme applied to the popover window
 *   (via the `cba-popover-window` `popoverClass`), a stable `cba-popover` element
 *   selector, trigger projection, and a small passthrough API.
 *
 * Project any focusable trigger element (e.g. `<cba-button>`) inside the default
 * slot. The body is provided through the `body` input as plain text or an
 * `ng-template` for rich content.
 *
 * `NgbPopover` is wired as a `hostDirective` so the directive lives on the
 * `<cba-popover>` host; trigger events on the projected element bubble to the
 * host and open/close the popover. **No `ViewChild`/`_menu` linking is needed**
 * (unlike `CbaDropdown`), because `NgbPopover` has no projected-content content
 * queries — the popover body comes from the `ngbPopover` input.
 *
 * @usageNotes
 * ```html
 * <cba-popover body="Opens the selected module." title="Hint">
 *   <cba-button variant="ghost" size="sm">?</cba-button>
 * </cba-popover>
 * ```
 *
 * @remarks
 * Behaviour (open/close, positioning, animation, auto-close) comes from
 * `@ng-bootstrap/ng-bootstrap`; `CbaPopover` only adds theming and a stable API.
 *
 * @see [CBA_POPOVER.md](/docs/CBA_POPOVER.md)
 */
@Component({
  selector: 'cba-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgbPopover,
      inputs: [
        'ngbPopover: body',
        'popoverTitle: title',
        'placement',
        'triggers',
        'disablePopover: disabled',
      ],
      outputs: ['shown', 'hidden'],
    },
  ],
  templateUrl: './cba-popover.component.html',
  styleUrl: './cba-popover.component.scss',
  host: { class: 'cba-popover' },
})
export class CbaPopoverComponent {
  /** Popover body: plain text or an `ng-template` for rich HTML. If both `body` and `title` are falsy, the popover does not open. */
  readonly body = input<string | TemplateRef<unknown> | null | undefined>(undefined);

  /** Optional popover title: plain text or an `ng-template`. */
  readonly title = input<string | TemplateRef<unknown> | null | undefined>(undefined);

  /** Preferred placement, forwarded to `NgbPopover#placement` (e.g. `'top'`, `'bottom'`, `'auto'`, or an array of fallbacks). Defaults to `'auto'`. */
  readonly placement = input<CbaPopoverPlacement>('auto');

  /** Space-separated trigger events. Defaults to `'hover focus'` (opens on mouse hover and keyboard focus). Use `'click'` for click-only. */
  readonly triggers = input<string>('hover focus');

  /** When `true`, the popover does not open (forwards to `NgbPopover#disablePopover`). */
  readonly disabled = input<boolean>(false);

  constructor() {
    this.applyDefaultPopoverWindowConfig();
  }

  /** Sets `popoverClass` and `container` defaults on the host `NgbPopover` without widening the public input API. */
  private applyDefaultPopoverWindowConfig(): void {
    const popover = inject(NgbPopover);
    popover.popoverClass = 'cba-popover-window';
    popover.container = 'body';
  }
}
```

**Notes for implementer:**
- Do **not** declare `readonly shown = output<void>()` / `readonly hidden = output<void>()`. They are forwarded automatically by `hostDirectives` `outputs: ['shown', 'hidden']`. Consumers bind `(shown)`/`(hidden)` directly on `<cba-popover>`.
- The `inject(NgbPopover)` call is made inside a private method invoked from the constructor, which is still within the constructor injection context — this is valid.
- Estimated size: ~95 lines (well under the 200-line limit).
- JSDoc on the class covers the `shown`/`hidden` outputs narratively even though they are not fields.

### 3.3 `src/components/popover/cba-popover.component.html`

```html
<ng-content></ng-content>
```

### 3.4 `src/components/popover/cba-popover.component.scss`

```scss
:host {
  display: inline-block;
}
```

> Only host sizing. The popover window is a separate `NgbPopoverWindow` (with `ViewEncapsulation.None`) appended to `<body>`, so it **cannot** be themed via component-encapsulated SCSS. Theming lives in the global `src/theme/_popover.scss`.

### 3.5 `src/components/popover/index.ts`

```ts
/**
 * Barrel for `CbaPopover`. Re-exports the public API so `public-api.ts`
 * and consumers import from `components/popover`.
 */
export * from './cba-popover.component';
export * from './cba-popover.types';
```

---

## 4. Styling Plan

### 4.1 Theming strategy

- The popover window is a `NgbPopoverWindow` component appended to `<body>` (`container: 'body'`) and uses `ViewEncapsulation.None`. Component-emulated `::ng-deep` cannot reliably target it.
- Therefore theming is **global**, scoped to the **`.cba-popover-window`** class set via `popoverClass` (mirrors the `_modal.scss` / `_datepicker.scss` pattern: global file, scoped by a class so non-`Cba` ng-bootstrap popovers keep Bootstrap defaults).
- BEM: host block `cba-popover`; window scope `cba-popover-window` (applied by `popoverClass`; no custom component-level elements needed).

### 4.2 Tokens used (all verified present in `src/theme/_variables.scss`)

| Token | Usage |
| --- | --- |
| `--cba-bg-elevated` | Window background. |
| `--cba-border-subtle` | Window border + arrow border color. |
| `--cba-radius-md` | Window border radius. |
| `--cba-shadow-elevated` | Window drop shadow. |
| `--cba-text-primary` | Header (title) text. |
| `--cba-text-secondary` | Body text. |
| `--cba-space-3` | Header vertical padding. |
| `--cba-space-4` | Header horizontal padding + body padding. |

### 4.3 `src/theme/_popover.scss`

```scss
/**
 * Global theming for ng-bootstrap popovers driven by @cobranza-apps/ui tokens.
 *
 * Reaches the `.popover` window rendered by ng-bootstrap OUTSIDE any
 * CbaPopoverComponent host (it is appended to <body> and uses
 * ViewEncapsulation.None), which component-emulated SCSS cannot target.
 * Scoped to Cba popovers via the default `popoverClass` "cba-popover-window"
 * set in CbaPopoverComponent's constructor; non-Cba ng-bootstrap popovers keep
 * Bootstrap defaults.
 *
 * Requires Bootstrap 5 CSS (peer dependency) for `.popover` / `.popover-arrow`
 * base structure and placement classes (`.bs-popover-top`, etc.).
 */

.cba-popover-window {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-elevated);
  color: var(--cba-text-secondary);
}

.cba-popover-window .popover-header {
  padding: var(--cba-space-3) var(--cba-space-4);
  background-color: transparent;
  border-bottom: 1px solid var(--cba-border-subtle);
  border-top-left-radius: var(--cba-radius-md);
  border-top-right-radius: var(--cba-radius-md);
  color: var(--cba-text-primary);
  font-weight: 600;
}

.cba-popover-window .popover-body {
  padding: var(--cba-space-4);
  color: var(--cba-text-secondary);
}

/* Arrow border matches window border; arrow fill matches window background. */
.cba-popover-window .popover-arrow::before {
  border-color: var(--cba-border-subtle);
}

.cba-popover-window .popover-arrow::after {
  border-color: var(--cba-bg-elevated);
}

/* Per-placement arrow refinement (Bootstrap adds bs-popover-* classes). */
.cba-popover-window.bs-popover-top .popover-arrow::after,
.cba-popover-window.bs-popover-bottom .popover-arrow::before {
  border-top-color: var(--cba-bg-elevated);
}
.cba-popover-window.bs-popover-bottom .popover-arrow::after,
.cba-popover-window.bs-popover-top .popover-arrow::before {
  border-bottom-color: var(--cba-bg-elevated);
}
.cba-popover-window.bs-popover-start .popover-arrow::after,
.cba-popover-window.bs-popover-end .popover-arrow::before {
  border-left-color: var(--cba-bg-elevated);
}
.cba-popover-window.bs-popover-end .popover-arrow::after,
.cba-popover-window.bs-popover-start .popover-arrow::before {
  border-right-color: var(--cba-bg-elevated);
}

@media (prefers-reduced-motion: reduce) {
  .cba-popover-window {
    transition: none;
  }
  .cba-popover-window.fade {
    transition: none;
    opacity: 1;
  }
}
```

### 4.4 `src/theme/theme.scss` change

After `@use 'datepicker';` add:

```scss
@use 'popover';
```

Final order:
```scss
@use 'variables';
@use 'base';
@use 'modal';
@use 'datepicker';
@use 'popover';
@use 'mixins';
@use 'utilities';
```

> Implementer: use `vscode-mcp-server_replace_lines_code` to perform the exact insertion (or `edit`), preserving the existing content.

---

## 5. Documentation (created in step 4.4 by docs-specialist)

`docs/CBA_POPOVER.md` must mirror the `CBA_DROPDOWN.md` structure and include:

- Selector `<cba-popover>`; import example (`CbaPopoverComponent`, `CbaPopoverPlacement` from `@cobranza-apps/ui`).
- "How it works" — ng-bootstrap owns open/close/positioning/animation/auto-close; `CbaPopover` owns theming + stable API.
- Inputs table (`body`, `title`, `placement`, `triggers`, `disabled`) with defaults (`body`/`title` `undefined`, `placement` `'auto'`, `triggers` `'hover focus'`, `disabled` `false`).
- Outputs table (`shown`, `hidden`) — `EventEmitter<void>`.
- Content projection slot — default `<ng-content>` for the trigger (must be focusable).
- Examples: basic string body; rich body via `ng-template`; Shell-footer hover (`triggers="mouseenter:mouseleave focus:blur"`).
- Theming notes (tokens listed in §4.2).
- Accessibility: trigger must be focusable; default `hover focus` enables keyboard operability; ng-bootstrap owns `aria-describedby`/`role="tooltip"`; `disabled` prevents opening.
- Important notes: behaviour comes from ng-bootstrap; `hostDirectives: [NgbPopover]` is used and **no `ViewChild` linking is required** (contrast with `CbaDropdown`); `popoverClass` + `container='body'` are set by the wrapper.
- Related docs + ng-bootstrap popover link.
- TOC required (file > 100 lines).

---

## 6. Test Plan

### 6.1 Setup

- Jest + `jest-preset-angular` (already configured; `CbaDropdownComponent.spec.ts` is the reference).
- `TestBed` imports `CbaPopoverComponent` plus a host component that binds the wrapper.
- Inject `NgbPopover` from the fixture's debug element (same technique as the dropdown spec) to assert forwarded properties.

### 6.2 `src/components/popover/cba-popover.component.spec.ts` — exact test cases

```ts
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CbaPopoverComponent } from './cba-popover.component';

@Component({
  standalone: true,
  imports: [CbaPopoverComponent],
  template: `<cba-popover
    [body]="body"
    [title]="title"
    placement="bottom"
    triggers="click"
    [disabled]="disabled"
    (shown)="onShown()"
    (hidden)="onHidden()">
    <button class="trigger">Trigger</button>
  </cba-popover>`,
})
class PopoverHost {
  body = 'hint';
  title = 'Title';
  disabled = false;
  onShown = jest.fn();
  onHidden = jest.fn();
}

@Component({
  standalone: true,
  imports: [CbaPopoverComponent],
  template: `<ng-template #tpl><span>rich</span></ng-template>
    <cba-popover [body]="tpl"><button class="trigger">Trigger</button></cba-popover>`,
})
class TemplateBodyHost {
  @ViewChild('tpl') tpl!: TemplateRef<unknown>;
}

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [CbaPopoverComponent, PopoverHost, TemplateBodyHost],
  });
}

describe('CbaPopoverComponent', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
  });

  it('applies the cba-popover host class', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('cba-popover')).toBe(true);
  });

  it('forwards body to NgbPopover#ngbPopover', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.ngbPopover).toBe('hint');
  });

  it('forwards a TemplateRef body to NgbPopover#ngbPopover', () => {
    const fixture = TestBed.createComponent(TemplateBodyHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.ngbPopover instanceof TemplateRef).toBe(true);
  });

  it('forwards title to NgbPopover#popoverTitle', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.popoverTitle).toBe('Title');
  });

  it('forwards placement to NgbPopover#placement', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.placement).toBe('bottom');
  });

  it('forwards triggers to NgbPopover#triggers', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.triggers).toBe('click');
  });

  it('defaults triggers to "hover focus"', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    const popover = fixture.debugElement.injector.get(NgbPopover);
    expect(popover.triggers).toBe('hover focus');
  });

  it('forwards disabled to NgbPopover#disablePopover', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.disablePopover).toBe(true);
  });

  it('sets the default popoverClass window scope on NgbPopover', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    const popover = fixture.debugElement.injector.get(NgbPopover);
    expect(popover.popoverClass).toBe('cba-popover-window');
  });

  it('appends the popover window to body (container default)', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    const popover = fixture.debugElement.injector.get(NgbPopover);
    expect(popover.container).toBe('body');
  });

  it('re-emits NgbPopover shown and hidden through the wrapper outputs', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);

    popover.shown.emit();
    expect(fixture.componentInstance.onShown).toHaveBeenCalled();

    popover.hidden.emit();
    expect(fixture.componentInstance.onHidden).toHaveBeenCalled();
  });

  it('projects the trigger element inside the host', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.trigger')).not.toBeNull();
  });
});
```

### 6.3 What NOT to test

- Popper positioning, arrow rendering, or placement flipping.
- Animation timing / `.fade` transitions.
- `autoClose` internals (ng-bootstrap default `true`).
- Bootstrap CSS class presence on the popover window (theme verified by build + manual QA, not unit test).

---

## 7. Integration Steps

### 7.1 `src/public-api.ts`

Insert (alphabetical) between `export * from './components/module-header';` and `export * from './components/select';`:

```ts
export * from './components/popover';
```

Full resulting block:
```ts
export * from './components/modal';
export * from './components/module-container';
export * from './components/module-header';
export * from './components/popover';
export * from './components/select';
export * from './components/skeleton';
```

### 7.2 `.agent/project-structure.md`

Add under `# Folders in src/`, after the `dropdown` line (keep `gem` ordering by appearance; place near `dropdown` for organizational coherence):

```
- src/components/popover/ - CbaPopover component: thin ng-bootstrap NgbPopover wrapper with projected trigger and string/template body
```

### 7.3 `src/theme/theme.scss`

As described in §4.4 — add `@use 'popover';`.

### 7.4 Build & verification commands (run from repo root)

| Step | Command | Expected |
| --- | --- | --- |
| Unit tests (popover only) | `npx jest src/components/popover` | All 12 cases pass. |
| Full test suite | `npm test` | Green (no regressions). |
| Lint | `npm run lint` | No new errors. |
| Library build | `npm run build` | Build succeeds; `dist/` produced; `CbaPopoverComponent` + `CbaPopoverPlacement` exported. |

> The `npm run build` step is the spec's "Build must succeed" acceptance gate.

---

## 8. Git Handling (for the implementer in 4.2)

> This plan step (4.1b) does NOT execute git. The implementer (4.2) operates on branch `feat/phase6-controls` (created in global step 2) and:

1. Creates the 8 files in §2.1 on the feature branch.
2. Applies the 3 modifications in §2.2 (`theme.scss`, `public-api.ts`, `project-structure.md`).
3. Stages only intended files (verify with `git status`; follow `.kilo/rules/gitignore-compliance.md` — do not stage `node_modules/` or `dist/`).
4. Commits with message:
   `feat(popover): add CbaPopover thin ng-bootstrap popover wrapper`
5. Code-review/simplification (4.3), docs (4.4), verification (4.5), and task completion (4.6) follow the global plan.

---

## 9. Acceptance Criteria Checklist

- [ ] `cba-popover` component exists under `src/components/popover/`.
- [ ] Component is standalone and `hostDirectives: [NgbPopover]` is used with input/output forwarding (no manual `ViewChild`/`_menu` linking).
- [ ] Inputs `body`, `title`, `placement`, `triggers`, `disabled` work with spec defaults (`body`/`title` `undefined`, `placement` `'auto'`, `triggers` `'hover focus'`, `disabled` `false`).
- [ ] Outputs `shown` / `hidden` are forwarded via `hostDirectives` (not re-declared as component `output()`).
- [ ] `popoverClass = 'cba-popover-window'` and `container = 'body'` set programmatically (public input API stays minimal).
- [ ] Component is exported from `src/public-api.ts`.
- [ ] `src/theme/_popover.scss` themes `.cba-popover-window` (window, header, body, arrow, reduced-motion) using only `--cba-*` tokens.
- [ ] `src/theme/theme.scss` imports `_popover.scss`.
- [ ] `.agent/project-structure.md` documents the new `src/components/popover/` folder.
- [ ] `docs/CBA_POPOVER.md` created (step 4.4) with JSDoc, behaviour note, and Shell-footer hover example.
- [ ] Minimal wrapper unit tests present and pass (render, input forwarding incl. TemplateRef body, output passthrough, disabled, popoverClass/container defaults, trigger projection).
- [ ] `npm run build` succeeds with no errors.
- [ ] No custom popover engine introduced; behaviour delegated to ng-bootstrap.
- [ ] File ≤ 200 lines; methods ≤ 50 lines; ≤ 2 params; max depth 2; private members by default.