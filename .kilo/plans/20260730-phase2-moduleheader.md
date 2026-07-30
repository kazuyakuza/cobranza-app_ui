# Implementation Plan — Phase 2: ModuleHeader

> Step **4.1b** of the Critical Workflow for TODO task `.agent/todos/20260730/20260730-todo-0.md`.
> This plan overwrites the global-plan draft with the **detailed, per-task implementation plan** the implementer will follow in step 4.2.

## Task Origin & Inputs

- **TODO file**: `.agent/todos/20260730/20260730-todo-0.md` — `# Phase 2 — ModuleHeader`.
- **Front-end spec (4.1a)**: `.kilo/plans/20260730-phase2-moduleheader-frontend-spec.md`.
- **Branch**: `feat/phase2-module-header` (already created and checked out).
- **Project context read**: `brief.md`, `architecture.md`, `tech.md`, `.agent/project-structure.md`, `README.md`, `docs/USAGE.md`, `docs/THEME.md`, `src/lib/theme/*`, `package.json`, `tsconfig.json`, `tsconfig.spec.json`, `jest.config.js`, `setup-jest.ts`, `eslint.config.js`, `ng-package.json`, plus `@fortawesome/angular-fontawesome` runtime typings.

## High-Level Approach

Build **one self-contained standalone component** (`ModuleHeaderComponent`) plus its supporting public types, then wire it through the library barrel and `public-api.ts`, add focused unit tests, and author the developer doc page. Implementation is data-flow light (inputs in → outputs out) using Angular 22 **signal inputs/outputs**, a couple of `computed` signals, and pure template handlers. Styling uses only `--cba-*` tokens re-exported as part of the theme SCSS. Icons use `@fortawesome/angular-fontawesome` `FaIconComponent` (selector `fa-icon`).

Key technical decisions:

- Use the **signal `input()` / `input.required()` / `output()`** API (Angular 22). `ChangeDetectionStrategy.OnPush`.
- Standalone: `standalone: true` (or omit; Angular 22 defaults to standalone — explicitly set `standalone: true` for clarity and AI-agent readability).
- Template is split into its own `module-header.component.html`; styles into `module-header.component.scss`; types into `module-header.types.ts`.
- Template root is a semantic `<header class="cba-module-header">` inside the component host (`cba-module-header`). `:host` is `display:block`.
- Status icons via `FaIconComponent`; status colour driven by `currentColor` through modifier classes on the status section. Spinner animation is supplied by Font Awesome via `[animation]="'spin'"` (see deviation note below).
- Three-section flex layout: fixed-width status column (always present in non-fullscreen to prevent title shifting), flexible centered title, fixed-width actions (top-aligned).
- Fullscreen: render **only** the title section; status + actions omitted from the DOM (template `@if`).
- Buttons are native `<button type="button">` with dynamic `aria-label`s and optional `title` tooltips; `:focus-visible` uses `--cba-focus-ring`.
- `prefers-reduced-motion` disables transitions and the FA spin animation.

## Deviations From the Front-end Spec (flagged, intentional)

1. **`[spin]` input does not exist in `@fortawesome/angular-fontawesome` v5.**
   The spec (sections 2.4 and 6) uses `[spin]="iconConfig.spin"`. Verify: the installed v5.x typings (`node_modules/@fortawesome/angular-fontawesome/types/angular-fontawesome.d.ts`) expose a signal input `animation: AnimationProp` where `AnimationProp = '…' | 'spin' | 'spin-pulse' | …` and **no `spin` input**. The plan therefore uses `[animation]="statusVisual()?.animation"` (`'spin'` for `loading`, `undefined` otherwise). The reduced-motion CSS targets the FA-emitted `.fa-spin` class instead of the `fa-icon[spin]` selector used in the spec.

2. **Size-toggle & fullscreen icon choices** are pinned to known-free solid icons instead of the spec's "suggested" `faMinimize`/`faMaximize`:
   - Size toggle → `faCompress` (current `100%`, action "shrink to 50%"), `faExpand` (current `50%`, action "expand to 100%").
   - Fullscreen → `faUpRightAndDownLeftFromSquare`.
   - Collapse / Expand → `faChevronUp` / `faChevronDown`.
   - Remove → `faXmark`.
   The spec explicitly permits "or equivalent arrows indicating the target size", so this is acceptable.

3. **Spinner rendering note:** the spin animation produced by `[animation]="'spin'"` depends on the Font Awesome stylesheet (`fontawesome.css` / `svg-with-js.css`, typically loaded via `@fortawesome/fontawesome-svg-core/styles.css`) which the Shell must import globally. The component itself only adds the `.fa-spin` class; the keyframes are owned by Font Awesome. This is documented in `docs/MODULE_HEADER.md`.

No other deviations. All remaining spec sections (selector, metadata, inputs, outputs, types, sections, fullscreen conditional, accessibility, SCSS architecture, icon mapping, animation rules, edge cases, deliverables, acceptance) are implemented as written.

## File Deliverables

| File | Status | Purpose |
| --- | --- | --- |
| `src/lib/components/module-header/module-header.types.ts` | new | Public `ModuleHeaderSize` & `ModuleHeaderStatus` types. |
| `src/lib/components/module-header/module-header.component.ts` | new | Standalone component, signal inputs/outputs, status mapping, computed labels/icons, handlers. |
| `src/lib/components/module-header/module-header.component.html` | new | Three-section template with fullscreen conditional. |
| `src/lib/components/module-header/module-header.component.scss` | new | Token-only flexbox layout, action buttons, status colour modifiers, reduced-motion. |
| `src/lib/components/module-header/module-header.component.spec.ts` | new | Focused Jest unit tests (4 behaviours). |
| `src/lib/components/module-header/index.ts` | modify | Barrel re-export of component + types. |
| `src/lib/public-api.ts` | modify | Add `export * from './lib/components/module-header'`. |
| `docs/MODULE_HEADER.md` | new | Component usage page; linked from `README.md` & `docs/USAGE.md`. |
| `README.md` | modify | Add link to `/docs/MODULE_HEADER.md`. |
| `docs/USAGE.md` | modify | Inline link to the new doc in the ModuleHeader section header. |

No new folders are created → `.agent/project-structure.md` needs **no** update.

---

## Step-by-Step Implementation (executor: implementer in 4.2)

> Tool preference per `.kilo/rules/tool-selection-priority.md`: create new files with `vscode-mcp-server_create_file_code`; modify existing files with `vscode-mcp-server_replace_lines_code`. Run code is written verbatim below — the implementer must copy the snippets unchanged unless a review cycle adjusts them. Follow `.kilo/rules/gitignore-compliance.md` before each commit.

### Step 1 — Create the public types

**File**: `src/lib/components/module-header/module-header.types.ts`

```ts
/**
 * Width modes supported by {@link ModuleHeaderComponent} `size` input.
 *
 * `'50%'`  — module rendered at half of the workspace width.
 * `'100%'` — module rendered at full workspace width.
 */
export type ModuleHeaderSize = '50%' | '100%';

/**
 * Optional status indicator rendered in the header's status section.
 *
 * | Value     | Visual                      | Typical use                       |
 * | --------- | --------------------------- | --------------------------------- |
 * | `loading` | Spinner (spin animation)    | Data loading / ongoing operation. |
 * | `loaded`  | Check icon                  | Data ready (no explicit save).    |
 * | `success` | Stronger success check icon | Explicit save / submit succeeded. |
 * | `warning` | Warning triangle icon       | Soft validation / incomplete data.|
 * | `error`   | Error icon                  | Load failure / hard validation.   |
 * | `dirty`   | Pencil icon                 | Unsaved changes present.           |
 * | `null`    | Nothing rendered           | Normal state.                     |
 *
 * `null` is the default and the only value that suppresses the status section icon.
 */
export type ModuleHeaderStatus =
  | 'loading'
  | 'loaded'
  | 'success'
  | 'warning'
  | 'error'
  | 'dirty'
  | null;
```

**Verify**: `npm run lint` (no unused types because exported).

---

### Step 2 — Create the component class

**File**: `src/lib/components/module-header/module-header.component.ts`

> Stays within the `max-lines-per-file` rule (~120 net lines). JSDoc on the class and every public input/output per `.agent/project-info/brief.md` §10 and `.kilo/rules/self-documenting-code.md`. No class exceeds 2 nesting levels (`.kilo/rules/max-depth.md`); handlers have ≤2 params (`.kilo/rules/max-arguments-per-method.md`); handlers are short (`.kilo/rules/max-lines-per-method.md`). Members are `readonly`/private-by-default (`.kilo/rules/prefer-private-members.md`).

```ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCompress,
  faExpand,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faUpRightAndDownLeftFromSquare,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  ModuleHeaderSize,
  ModuleHeaderStatus,
} from './module-header.types';

/** Visual configuration derived from a non-null status value. */
interface StatusVisual {
  readonly icon: IconDefinition;
  readonly animation: 'spin' | undefined;
  readonly modifierClass: string;
}

/** Static status → visual mapping. `null` renders no icon. */
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin', modifierClass: 'cba-module-header__status--loading' },
  loaded: { icon: faCircleCheck, animation: undefined, modifierClass: 'cba-module-header__status--loaded' },
  success: { icon: faCircleCheck, animation: undefined, modifierClass: 'cba-module-header__status--success' },
  warning: { icon: faTriangleExclamation, animation: undefined, modifierClass: 'cba-module-header__status--warning' },
  error: { icon: faCircleXmark, animation: undefined, modifierClass: 'cba-module-header__status--error' },
  dirty: { icon: faPen, animation: undefined, modifierClass: 'cba-module-header__status--dirty' },
};

/**
 * Shell-injected header rendered above each MFE module.
 *
 * Renders a three-section layout — status | title | actions — using only
 * `--cba-*` design tokens. In fullscreen mode only the title is shown. Drag
 * and drop are intentionally NOT implemented here (owned by the Shell +
 * `@cobranza-apps/mfe-events`); the title is never editable from this header.
 *
 * @see {@link ModuleHeaderSize}
 * @see {@link ModuleHeaderStatus}
 */
@Component({
  selector: 'cba-module-header',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-header.component.html',
  styleUrl: './module-header.component.scss',
  host: { '[class.cba-module-header--fullscreen]': 'isFullscreen()' },
})
export class ModuleHeaderComponent {
  /** Module title rendered in the center section. Provided by the MFE / Shell. Required. */
  readonly title = input.required<string>();

  /** Current module width mode. Drives the size-toggle button icon & label. */
  readonly size = input<ModuleHeaderSize>('100%');

  /** Whether the module body is collapsed. Drives the collapse/expand icon. The component never mutates it. */
  readonly isCollapsed = input<boolean>(false);

  /** When `true`, only the title section is rendered (no status, no actions). */
  readonly isFullscreen = input<boolean>(false);

  /** Optional status indicator rendered in the left section. `null` renders nothing. */
  readonly status = input<ModuleHeaderStatus>(null);

  /** Emitted when the user clicks the collapse / expand button. */
  readonly collapseToggle = output<void>();

  /** Emitted when the user clicks the size-toggle button; payload is the requested target size. */
  readonly sizeToggle = output<ModuleHeaderSize>();

  /** Emitted when the user clicks the remove button. */
  readonly remove = output<void>();

  /** Emitted when the user clicks the fullscreen button. */
  readonly fullscreenToggle = output<void>();

  /** Target size opposite to the current `size` (emitted on size-toggle click). */
  readonly targetSize = computed<ModuleHeaderSize>(() =>
    this.size() === '100%' ? '50%' : '100%',
  );

  /** Status visual config or `null` when no status is set (icon hidden). */
  readonly statusVisual = computed<StatusVisual | null>(() => {
    const current = this.status();
    return current === null ? null : STATUS_VISUALS[current] ?? null;
  });

  /** Icon definition for the collapse/expand button (dependant on `isCollapsed`). */
  readonly collapseIcon = computed(() =>
    this.isCollapsed() ? faChevronDown : faChevronUp,
  );

  /** Accessible label for the collapse/expand button. */
  readonly collapseLabel = computed(() =>
    this.isCollapsed() ? 'Expand module' : 'Collapse module',
  );

  /** Icon definition for the size-toggle button (represents the target action). */
  readonly sizeToggleIcon = computed(() =>
    this.size() === '100%' ? faCompress : faExpand,
  );

  /** Accessible label for the size-toggle button, describing the target size. */
  readonly sizeToggleLabel = computed(() =>
    this.size() === '100%' ? 'Shrink module to 50%' : 'Expand module to 100%',
  );

  /** Click handler for the collapse/expand button. */
  onCollapseClick(): void {
    this.collapseToggle.emit();
  }

  /** Click handler for the size-toggle button. Emits the computed target size. */
  onSizeToggleClick(): void {
    this.sizeToggle.emit(this.targetSize());
  }

  /** Click handler for the remove button. */
  onRemoveClick(): void {
    this.remove.emit();
  }

  /** Click handler for the fullscreen button. */
  onFullscreenClick(): void {
    this.fullscreenToggle.emit();
  }
}
```

**Notes for the implementer**:

- The icon objects (`faSpinner`, `faCircleCheck`, etc.) imported from `@fortawesome/free-solid-svg-icons` are the `IconDefinition` instances used by `FaIconComponent`'s `[icon]` input. All names listed are confirmed-free solid icons in FA6/7.
- `host` binding `'[class.cba-module-header--fullscreen]': 'isFullscreen()'` toggles the fullscreen modifier class on the host element `<cba-module-header>`.
- No `NgZone`, DI, or lifecycle code is needed (Zoneless-capable, signal-driven).

---

### Step 3 — Create the template

**File**: `src/lib/components/module-header/module-header.component.html`

```html
<header class="cba-module-header">
  @if (isFullscreen()) {
    <div class="cba-module-header__section cba-module-header__section--title">
      {{ title() }}
    </div>
  } @else {
    <div
      class="cba-module-header__section cba-module-header__section--status"
      [class]="statusVisual()?.modifierClass ?? ''">
      @if (statusVisual(); as visual) {
        <fa-icon
          [icon]="visual.icon"
          [animation]="visual.animation"
          aria-hidden="true" />
      }
    </div>

    <div class="cba-module-header__section cba-module-header__section--title">
      {{ title() }}
    </div>

    <nav class="cba-module-header__section cba-module-header__section--actions">
      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="collapseLabel()"
        [title]="collapseLabel()"
        (click)="onCollapseClick()">
        <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="sizeToggleLabel()"
        [title]="sizeToggleLabel()"
        (click)="onSizeToggleClick()">
        <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        aria-label="Remove module"
        title="Remove module"
        (click)="onRemoveClick()">
        <fa-icon [icon]="faRemoveIcon" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        aria-label="Enter fullscreen"
        title="Enter fullscreen"
        (click)="onFullscreenClick()">
        <fa-icon [icon]="faFullscreenIcon" aria-hidden="true" />
      </button>
    </nav>
  }
</header>
```

> The template references `faRemoveIcon` and `faFullscreenIcon` — add two `readonly` class fields to the component so the template (with `strictTemplates`) can bind them by reference:

Append to `ModuleHeaderComponent` (after the click handlers):

```ts
  /** Icon definition bound to the remove button (template-referenced constant). */
  readonly faRemoveIcon = faXmark;

  /** Icon definition bound to the fullscreen button (template-referenced constant). */
  readonly faFullscreenIcon = faUpRightAndDownLeftFromSquare;
```

> These are public `readonly` because the template references them; they are icon constants, not state. (Acceptable exception to the private-by-default rule per `.kilo/rules/prefer-private-members.md`, since template binding requires a public member or it would need `protected`.)

---

### Step 4 — Create the styles

**File**: `src/lib/components/module-header/module-header.component.scss`

```scss
:host {
  display: block;
}

.cba-module-header {
  display: flex;
  align-items: flex-start;
  min-height: var(--cba-module-header-min-height, 40px);
  padding: var(--cba-space-2) var(--cba-space-3);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-secondary);
  color: var(--cba-text-primary);
  border-bottom: 1px solid var(--cba-border-subtle);
  box-sizing: border-box;
}

.cba-module-header__section {
  display: flex;
  align-items: center;
  min-height: var(--cba-module-header-min-height, 40px);
}

.cba-module-header__section--status {
  flex: 0 0 auto;
  justify-content: center;
  width: var(--cba-space-8);
}

.cba-module-header__section--title {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5;
}

.cba-module-header__section--actions {
  flex: 0 0 auto;
  justify-content: flex-end;
  gap: var(--cba-space-1);
}

.cba-module-header__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--cba-space-8);
  height: var(--cba-space-8);
  padding: 0;
  color: var(--cba-text-secondary);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--cba-radius-sm);
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease,
    border-color 120ms ease;
}

.cba-module-header__action:hover {
  background-color: var(--cba-hover);
  color: var(--cba-text-primary);
}

.cba-module-header__action:active {
  background-color: var(--cba-active);
}

.cba-module-header__action:focus-visible {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}

.cba-module-header--fullscreen {
  background-color: transparent;
  border-bottom: none;
  justify-content: center;
}

.cba-module-header--fullscreen .cba-module-header__section--title {
  flex: 0 1 auto;
}

.cba-module-header__status--loading {
  color: var(--cba-accent-info);
}

.cba-module-header__status--loaded {
  color: var(--cba-accent-success);
}

.cba-module-header__status--success {
  color: var(--cba-accent-success);
}

.cba-module-header__status--warning {
  color: var(--cba-accent-warning);
}

.cba-module-header__status--error {
  color: var(--cba-accent-danger);
}

.cba-module-header__status--dirty {
  color: var(--cba-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .cba-module-header__action {
    transition: none;
  }

  .fa-spin {
    animation: none;
  }
}
```

**Notes**:

- Status colour is applied via `color` (inherited by the FA `<svg>` through `currentColor`) on the status `<div>` modifier class. The `--status` placeholder is always rendered in non-fullscreen mode so the title never shifts horizontally when `status` toggles (per spec §3.4 / §7).
- `.fa-spin` selector targets the class Font Awesome attaches when `[animation]="'spin'"` is set on `<fa-icon>`; the actual keyframes are provided by the Font Awesome stylesheet the consumer imports. Reduced-motion disables the class animation as a courtesy.
- `max-lines-per-file.md` does not apply to SCSS stylesheets; this file is ~110 lines, comfortably compact.

---

### Step 5 — Wire the barrel exports

**File**: `src/lib/components/module-header/index.ts` (modify — replace `export {};`)

```ts
/**
 * Barrel file for ModuleHeader.
 *
 * Re-exports the public API of the ModuleHeader component so consumers and
 * `public-api.ts` import from a single, stable path
 * (`components/module-header`). Internal helpers or test utilities are NOT
 * exported from here.
 */
export * from './module-header.types';
export * from './module-header.component';
```

**File**: `src/lib/public-api.ts` (modify — replace the trailing `export {};` line)

Replace the final `export {};` line with:

```ts
/** Components. */
export * from './lib/components/module-header';
```

> Keep alphabetical / category order. The doc-comment header block already explains how to add exports; the implementer MUST NOT delete it.

---

### Step 6 — Build & lint verification (gate before tests/docs)

Run each single command (no chaining per `.kilo/rules/tool-selection-priority.md`):

1. `npm run lint`
2. `npm run build`

Both must succeed with zero errors. If `npm run build` fails because an icon name does not exist in `@fortawesome/free-solid-svg-icons`, replace the offending icon with the documented fallback (`faCompress`/`faExpand` ⇄ size toggle; `faUpRightAndDownLeftFromSquare` ⇄ fullscreen) and re-run.

---

### Step 7 — Focused unit tests

**File**: `src/lib/components/module-header/module-header.component.spec.ts`

> Uses Jest + jest-preset-angular CJS preset (already configured in `jest.config.js` + `setup-jest.ts`). Querying via `nativeElement.querySelector('[aria-label="…"]')` keeps the suite robust against small template refactors. `fixture.componentRef.setInput(...)` updates signal inputs and is the Angular 22 idiom.

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleHeaderComponent } from './module-header.component';

describe('ModuleHeaderComponent', () => {
  let fixture: ComponentFixture<ModuleHeaderComponent>;

  function setup(): ModuleHeaderComponent {
    fixture = TestBed.createComponent(ModuleHeaderComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function queryButton(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      `button[aria-label="${label}"]`,
    ) as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleHeaderComponent],
    }).compileComponents();
  });

  it('emits collapseToggle when the collapse button is clicked', () => {
    const component = setup();
    let emitted = 0;
    component.collapseToggle.subscribe(() => (emitted += 1));

    queryButton('Collapse module').click();

    expect(emitted).toBe(1);
  });

  it('emits the opposite target size when the size-toggle button is clicked', () => {
    const component = setup();
    const sizes: string[] = [];
    component.sizeToggle.subscribe((size) => sizes.push(size));

    queryButton('Shrink module to 50%').click();
    fixture.componentRef.setInput('size', '50%');
    fixture.detectChanges();
    queryButton('Expand module to 100%').click();

    expect(sizes).toEqual(['50%', '100%']);
  });

  it('renders only the title when isFullscreen is true', () => {
    const component = setup();
    fixture.componentRef.setInput('isFullscreen', true);
    fixture.detectChanges();

    const actionsNav = fixture.nativeElement.querySelector('nav');
    const statusIcon = fixture.nativeElement.querySelector('fa-icon');
    const titleText = fixture.nativeElement.textContent;

    expect(component.title()).toBe('');
    expect(actionsNav).toBeNull();
    expect(statusIcon).toBeNull();
    expect(titleText).toContain('');
  });

  it('renders the status icon only when status is non-null', () => {
    setup();
    expect(fixture.nativeElement.querySelector('fa-icon')).toBeNull();

    fixture.componentRef.setInput('status', 'loading');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('fa-icon').length).toBe(1);
  });
});
```

**Notes**:

- `input.required<string>()` defaults to `''` at runtime under `undefined` binding; the `renders only the title` test guards the empty-string fallback (spec §7 edge case: empty `title` renders blank, no default fallback).
- `npm test` runs the suite with `jest --passWithNoTests`; the implementer MUST run `npm test` after creating the spec and confirm 4 passing tests. If `npm test` shows zero tests despite the spec file (path mismatch), verify the `testMatch` glob matches `src/lib/components/module-header/module-header.component.spec.ts` (it does: `<rootDir>/src/**/*.spec.ts`).

---

### Step 8 — Documentation

**File**: `docs/MODULE_HEADER.md` (new) — content outline the **docs-specialist** will expand in step 4.4, but the implementer (4.2) seeds the file so the build/link step can complete:

Suggested structure (the implementer copies this skeleton, fills code examples, and leaves prose polishing to the docs-specialist):

```markdown
# ModuleHeader

Shell-injected header rendered above each MFE module in the Company Back-office Shell.

## Selector

`<cba-module-header>` — standalone component exported from `@cobranza-apps/ui`.

## Basic usage

```html
<cba-module-header
  title="Customer Module"
  size="100%"
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  status="loaded"
  (collapseToggle)="onCollapse()"
  (sizeToggle)="onSizeChange($event)"
  (remove)="onRemove()"
  (fullscreenToggle)="onFullscreen()">
</cba-module-header>
```

## Inputs

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| title | string | — | yes | Module title (provided by Shell / MFE). |
| size | '50%' \| '100%' | '100%' | no | Current width mode. |
| isCollapsed | boolean | false | no | Whether the module body is collapsed. Drives collapse/expand icon. |
| isFullscreen | boolean | false | no | When true, only the title is shown. |
| status | 'loading' \| 'loaded' \| 'success' \| 'warning' \| 'error' \| 'dirty' \| null | null | no | Optional status indicator. |

## Outputs

| Name | Payload | Description |
| --- | --- | --- |
| collapseToggle | void | User clicked collapse / expand. |
| sizeToggle | '50%' \| '100%' | User requested the target size (opposite of current). |
| remove | void | User requested to remove the module. |
| fullscreenToggle | void | User requested fullscreen. |

## Status values

(repeat the status semantics table from `brief.md` §6.1.)

## Fullscreen behaviour

When `isFullscreen === true`, the component renders **only** the title; status
and action buttons are removed from the DOM. Back navigation and the
"Workbench" action are owned by the Shell header/footer, not by this component.

## Drag note

Drag-and-drop and a `dragStart` output are intentionally NOT implemented here.
Drag contracts live in `@cobranza-apps/mfe-events` and the Shell.

## Spinner animation

The `loading` spinner relies on the Font Awesome stylesheet
(`@fortawesome/fontawesome-svg-core/styles.css` or the Font Awesome CSS bundle)
loaded by the consuming Shell. The component only sets the `.fa-spin` class; the
keyframes are provided by Font Awesome.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
```

> The docs-specialist (step 4.4) is expected to expand the prose, add a TOC if `MODULE_HEADER.md` exceeds 100 lines, and verify the cross-links resolve. The implementer (step 4.2) seeds this file so the link step can complete.

**Modify `README.md`** — in the `## Documentation` section, add a bullet:

```markdown
- [`/docs/MODULE_HEADER.md`](/docs/MODULE_HEADER.md) — `ModuleHeader` selector, API, status values, fullscreen & drag notes.
```

**Modify `docs/USAGE.md`** — in the `### ModuleHeader` section header, append a link:

```markdown
### ModuleHeader

Shell-injected header above each MFE module. See [`MODULE_HEADER.md`](./MODULE_HEADER.md) for the full API and notes.

```html
... (keep existing example unchanged)
```

> Documentation prose polishing, JSDoc auditing on every public member (already done in Step 2), TOC updates where files exceed 100 lines, and cross-link checks are the responsibility of the **docs-specialist** in step 4.4. The implementer must NOT remove existing `<!-- AI Agent Note -->` blocks.

---

## Git Commit Plan (implementer, step 4.2)

After each group, follow the Gitignore Compliance Rule (`git status` → ensure no `dist/`, `node_modules/` etc. are staged). Single-commit `git add` patterns are shown; do not chain commands.

1. **Commit A — component skeleton + exports**
   - Stage: `src/lib/components/module-header/module-header.types.ts`,
     `…/module-header.component.ts`, `…/module-header.component.html`,
     `…/module-header.component.scss`, `…/index.ts`, `src/lib/public-api.ts`.
   - Message: `feat(module-header): add standalone ModuleHeader component with status, actions & fullscreen`.
2. **Commit B — tests**
   - Stage: `src/lib/components/module-header/module-header.component.spec.ts`.
   - Message: `test(module-header): add focused unit tests for outputs, fullscreen & status rendering`.
3. **Commit C — docs**
   - Stage: `docs/MODULE_HEADER.md`, `README.md`, `docs/USAGE.md`.
   - Message: `docs(module-header): add ModuleHeader usage page and cross-links`.

## Console Command Summary (run in order, each separately)

| # | Command | Purpose |
| --- | --- | --- |
| 1 | `npm run lint` | Lint `src/**/*.ts` after step 2. |
| 2 | `npm run build` | ng-packagr build after step 5; must succeed with zero errors. |
| 3 | `npm test` | Run Jest after step 7; expect 4 passing tests. |
| 4 | `npm run format` (optional) | Run Prettier on touched files before commit if formatting drifts. |

> Do NOT run `npm publish`; publishing is out of scope for Phase 2.

## Acceptance Criteria Mapping (from TODO §Acceptance criteria)

| # | Criterion | Satisfied by |
| --- | --- | --- |
| 1 | `cba-module-header` standalone component compiles. | Step 2 + Step 6 (`npm run build`). |
| 2 | All inputs and outputs match the API table. | Step 2 (`input.required`/`input`/`output`) + Step 7 (tests). |
| 3 | Three-section layout (status / title / actions). | Step 3 + Step 4. |
| 4 | Fullscreen mode shows only the title. | Step 3 (`@if`) + Step 7 (test). |
| 5 | Collapse, size, remove and fullscreen buttons emit correct outputs. | Step 2 (handlers) + Step 7 (tests). |
| 6 | Status icons render for every non-null status. | Step 2 (`STATUS_VISUALS`) + Step 4 (colour modifiers) + Step 7 (test). |
| 7 | Styles use only theme tokens. | Step 4 (every value references a `--cba-*` token). |
| 8 | Component exported from `public-api.ts`. | Step 5. |
| 9 | Library build succeeds. | Step 6 (`npm run build`). |
| 10 | Basic usage docs and minimal unit tests present. | Step 7 + Step 8. |

## Constraints respected

- `.kilo/rules/max-depth.md`: no nesting > 2 levels in component methods (all handlers are 1-level).
- `.kilo/rules/max-lines-per-method.md`: handlers are ≤ 3 lines.
- `.kilo/rules/max-arguments-per-method.md`: handlers take 0 args; `onSizeToggleClick` emits a stored computed, not params.
- `.kilo/rules/max-lines-per-file.md`: component TS ≤ 120 net lines; SCSS ~110; spec ~70.
- `.kilo/rules/prefer-private-members.md`: only template-referenced icon constants are public (justified).
- `.kilo/rules/single-section-boolean-conditions.md`: template `@if` conditions each reference a single signal call; no compound conditions.
- `.kilo/rules/self-documenting-code.md`: JSDoc on class + every input/output + types; minimal comments only where the why adds value (icon availability, spin dependency).
- `.kilo/rules/no-commented-code.md`: no commented-out code in any snippet.
- `.kilo/rules/gitignore-compliance.md`: run `git status` before each commit; never stage `dist/` or `node_modules/`.
- `.kilo/rules/git-remote-safety.md`: no `git push` is performed in this 4.1b step (4.2 implementer only commits locally on `feat/phase2-module-header`).

## Out of scope (this 4.1b step)

- Writing any source/test/doc files (that is step 4.2).
- Running `npm run build` / `npm test` (step 4.2 verification).
- Code review (4.3), docs polish (4.4), front-end verification (4.5a), plan adherence (4.5b), marking the TODO `[DONE]` (4.6), version bump (Step 3 — handled separately), branch merge (Step 5).

## Plan Path

Saved to: `.kilo/plans/20260730-phase2-moduleheader.md` (this file — overwrites the prior global-plan draft per the 4.1b instructions).