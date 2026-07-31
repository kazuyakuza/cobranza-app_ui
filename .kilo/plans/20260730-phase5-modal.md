# Implementation Plan — Task 1: CbaModal (thin ng-bootstrap wrapper)

> **Source TODO:** `.agent/todos/20260730/20260730-todo-3.md` (Task 1)
> **Front-end spec:** `.kilo/plans/20260730-phase5-modal-frontend-spec.md`
> **Global plan:** `.kilo/plans/20260730-phase5-modal-form-wrappers.md`
> **Branch:** `feat/phase5-modal-form-wrappers`
> **Sub-agent:** `architector` (4.1b) → plan handed to `implementer` (4.2)

---

## 0. Ambiguities Resolved & Deviations from the Front-end Spec

The front-end spec is authoritative for the public API shape. The following points are technically-correct refinements required by the real ng-bootstrap v21 API and by the project rules. The implementer MUST follow these decisions (they are part of this plan), not the literal spec wording where the two differ.

| # | Spec wording | Reality / Rule | Decision in this plan |
|---|---|---|---|
| D1 | `CbaModalService.open<T>(content, options): NgbModalRef<T>` (spec §3.2 / §2.3) | `NgbModalRef` in `@ng-bootstrap/ng-bootstrap@21` is **non-generic** (`node_modules/@ng-bootstrap/ng-bootstrap/types/ng-bootstrap-ng-bootstrap-modal.d.ts`). | `CbaModalService.open(content, options): NgbModalRef` — **non-generic**. Consumers still get `componentInstance`, `close()`, `dismiss()`, `closed`, `dismissed`. |
| D2 | `CbaModalOptions.title` forwarded to `CbaModalComponent` by the service (spec §3.3 "Optional convenience title forwarded to CbaModalComponent when content is CbaModalComponent"). | Angular 22 signal inputs are **readonly properties** and **cannot** be set via `ref.componentInstance.title = ...` (assignment to a signal property throws at runtime). `NgbModalRef` does not expose `componentRef.setInput()`. | **Remove `title` from `CbaModalOptions`.** `title` is a normal `<cba-modal>` host input set in the host component's template (the documented consumer pattern in spec §2.3). The service only owns ng-bootstrap behaviour options. Documented in docs. |
| D3 | `ariaLabelledBy` auto-wired by the service (spec §8: "pass it as `ariaLabelledBy` automatically in `CbaModalService.open()`"). | The service opens arbitrary content (`Type<unknown> \| TemplateRef`) and cannot know whether the default title is rendered. Components own the title element. | `CbaModalComponent.ngOnInit()` calls `NgbActiveModal.update({ ariaLabelledBy: this.titleId })` **only when `title()` is truthy**. `NgbModalUpdatableOptions` includes `ariaLabelledBy`, so this is a single thin call. Consumers using a custom `[cbaModalHeader]` set `ariaLabelledBy` via `CbaModalOptions`. |
| D4 | Backdrop + modal surface themed with `--cba-bg-overlay` / `--cba-bg-elevated` via `::ng-deep` inside `cba-modal.component.scss` (spec §5.3). | ng-bootstrap renders `.modal`, `.modal-dialog`, `.modal-content`, and `.modal-backdrop` in a portal **outside** the `CbaModalComponent` host. Component-emulated `::ng-deep` rules only match **descendants** of the host; they cannot reach the portal-rendered backdrop/surface. | Backdrop + modal-surface theming lives in a **new global theme partial** `src/theme/_modal.scss` (imported by `theme.scss`). The service defaults `backdropClass: 'cba-modal-backdrop'` and `windowClass: 'cba-modal-window'` so global rules are scoped to Cba modals only. The component SCSS still styles its own projected chrome (header/body/footer/title/close). |
| D5 | "If `cbaModalHeader` is projected, the `title` input is ignored. If neither … header region is omitted." (spec §3.1) | Detecting projected `[cbaModalHeader]` without a directive requires either a public directive (extra API surface) or fragile logic — against the "keep wrappers thin / APIs small" TODO constraint. The existing `CbaCard` pattern uses `ng-content` + `:empty` with no detection. | Mirror the `CbaCard` pattern: render `[cbaModalHeader]`, `@if (title())`, and `@if (dismissible())` close button inside one header region; apply `:empty` to hide the header/footer regions when nothing is projected. Document the convention: **do not set `title` when projecting a custom header** — the consumer owns the entire header in that case. |
| D6 | Close button "rendered when `dismissible === true` **and no custom header is projected**" (spec test §11.1 #4). | Same detection issue as D5. | Close button renders when `dismissible()` is `true`, with or without a custom header (consistent dismiss affordance). Minor, documented deviation favourable to UX. |
| D7 | `size: 'md'` forwarded to `NgbModalOptions.size` (spec §3.4 / §2.3 consumer example). | `NgbModalOptions.size` is `'sm' \| 'lg' \| 'xl' \| string`; Bootstrap has **no** `modal-md` class (default medium = no size class). Passing `'md'` makes ng-bootstrap add a no-op `modal-md` class. | Forward `size` as-is (harmless). The host modifier classes (`cba-modal--md`, etc.) on the component are for visual/test hooks; actual dialog width is controlled by ng-bootstrap from the service options. Document that `'md'` is the default and adds no Bootstrap size class. |

All other spec contracts (selectors, inputs, slots, mapping table, exports, tests, docs) are followed verbatim.

---

## 1. High-Level Approach

`CbaModal` is a **thin wrapper**, not a modal engine. ng-bootstrap owns behaviour
(open/close, backdrop, ESC, focus trap, sizing classes). `CbaModal` owns:

1. **`CbaModalComponent`** (`<cba-modal>`) — a projected content shell (header / body /
   footer) plus a default title and a themed close (×) button. Injects `NgbActiveModal`
   to dismiss itself and to auto-wire `aria-labelledby` for the default-title case.
2. **`CbaModalService`** (`providedIn: 'root'`) — one `open(content, options)` method
   that maps `CbaModalOptions` → `NgbModalOptions` (`dismissible` → `backdrop` + `keyboard`)
   and calls `NgbModal.open()`, returning the raw `NgbModalRef`.
3. **`CbaModalSize` / `CbaModalOptions` / `CbaModalDismissReason`** types.
4. **Barrel** `src/components/modal/index.ts` re-exports public symbols.
5. **`src/public-api.ts`** gains `export * from './components/modal'` (alphabetical).
6. **Global modal theming** in a new `src/theme/_modal.scss` partial (D4).
7. **Minimal wrapper-only tests** in `src/components/modal/cba-modal.component.spec.ts`
   (+ optional `cba-modal.service.spec.ts` only if the single file would exceed 200 lines).
8. **Docs** `docs/CBA_MODAL.md`.

Build order: types → component (ts/html/scss) → service → global theme partial →
barrel → public-api → docs → tests → build/test/lint.

---

## 2. Files To Create / Modify

| Action | Path | Purpose |
|---|---|---|
| Modify | `src/components/modal/index.ts` | Replace `export {}` with public re-exports. |
| Create | `src/components/modal/cba-modal.types.ts` | `CbaModalSize`, `CbaModalOptions`, `CbaModalDismissReason`. |
| Create | `src/components/modal/cba-modal.component.ts` | `<cba-modal>` content shell. |
| Create | `src/components/modal/cba-modal.component.html` | Projected slots + title + close button. |
| Create | `src/components/modal/cba-modal.component.scss` | Emulated chrome styling. |
| Create | `src/components/modal/cba-modal.service.ts` | Thin `CbaModalService` wrapping `NgbModal.open()`. |
| Create | `src/components/modal/cba-modal.component.spec.ts` | Wrapper-only tests. |
| (Conditional) Create | `src/components/modal/cba-modal.service.spec.ts` | Only if component spec > 200 lines. |
| Create | `src/theme/_modal.scss` | Global ng-bootstrap modal theming with `--cba-*` tokens (D4). |
| Modify | `src/theme/theme.scss` | `@use 'modal';` after `base`. |
| Modify | `src/public-api.ts` | Add `export * from './components/modal';` (alphabetical, between `empty-state` and `module-container`). |
| Modify | `.agent/project-structure.md` | Update `modal/` line description (already says "thin wrapper around ng-bootstrap modal" — keep, no change needed unless review requests). |
| Create | `docs/CBA_MODAL.md` | Public API + usage docs. |

No existing functionality is removed.

---

## 3. Detailed Atomic Steps

### Step 3.1 — Create `src/components/modal/cba-modal.types.ts`

**Rules check:** ≤2 args/feed; self-documenting names; private n/a; no commented code.

```ts
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

/** Width variant supported by {@link CbaModalComponent} and {@link CbaModalService}. */
export type CbaModalSize = 'sm' | 'md' | 'lg';

/** Reason values that may be returned when a `CbaModal` is dismissed. */
export type CbaModalDismissReason = 'backdrop' | 'escape' | 'close' | string;

/**
 * Options for {@link CbaModalService.open}.
 *
 * Thin layer over `NgbModalOptions`. The wrapper-specific keys
 * (`size`, `centered`, `dismissible`) are translated by the service into the
 * corresponding ng-bootstrap keys. Every other `NgbModalOptions` key picked
 * here is forwarded untouched.
 */
export interface CbaModalOptions
  extends Pick<
    NgbModalOptions,
    | 'ariaLabelledBy'
    | 'ariaDescribedBy'
    | 'windowClass'
    | 'modalDialogClass'
    | 'backdropClass'
    | 'scrollable'
    | 'beforeDismiss'
  > {
  /** Width variant forwarded to ng-bootstrap `size`. */
  size?: CbaModalSize;

  /** Vertically center the dialog (ng-bootstrap `centered`). */
  centered?: boolean;

  /**
   * Allow backdrop click and ESC to dismiss.
   * `false` → ng-bootstrap `backdrop: 'static'` + `keyboard: false`.
   * Defaults to `true` when omitted.
   */
  dismissible?: boolean;
}
```

> **Note (implementer):** Do NOT include a `title` key here (D2). Verify the `Pick` keys
> all exist on `NgbModalOptions` — they do (see `node_modules/@ng-bootstrap/ng-bootstrap/types/ng-bootstrap-ng-bootstrap-modal.d.ts`).

**Verify:** `npm run typecheck` (later, after the barrel + public-api step).

---

### Step 3.2 — Create `src/components/modal/cba-modal.component.ts`

**Rules:** standalone; `OnPush`; signal `input()`; private `inject`/members; ≤2 method
args; method bodies ≤50 lines; single-section boolean condition (`if (this.title())`);
host bindings via string expressions matching the `CbaButton` style.

```ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalSize } from './cba-modal.types';

let cbaModalTitleUid = 0;

/**
 * Themed modal content shell backed by `@ng-bootstrap/ng-bootstrap`.
 *
 * Renders projected header / body / footer regions inside ng-bootstrap's
 * `.modal-content`. Open/close, backdrop, ESC and focus management are owned
 * by ng-bootstrap; this component only provides a stable, token-styled
 * structure, an optional convenience `title`, and a themed close button.
 *
 * Inject `NgbActiveModal` in a host component to call `close()` / `dismiss()`
 * from footer buttons (see `docs/CBA_MODAL.md`).
 *
 * @usageNotes
 * ```html
 * <cba-modal title="Confirm deletion">
 *   <ng-container cbaModalBody>This action cannot be undone.</ng-container>
 *   <ng-container cbaModalFooter>
 *     <cba-button variant="ghost" (cbaClick)="activeModal.dismiss()">Cancel</cba-button>
 *     <cba-button variant="danger" (cbaClick)="activeModal.close(true)">Delete</cba-button>
 *   </ng-container>
 * </cba-modal>
 * ```
 *
 * @see [CBA_MODAL.md](/docs/CBA_MODAL.md)
 */
@Component({
  selector: 'cba-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-modal.component.html',
  styleUrl: './cba-modal.component.scss',
  host: {
    class: 'cba-modal',
    '[class.cba-modal--sm]': "size() === 'sm'",
    '[class.cba-modal--md]': "size() === 'md'",
    '[class.cba-modal--lg]': "size() === 'lg'",
    '[class.cba-modal--centered]': 'centered()',
  },
})
export class CbaModalComponent implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);

  /** Optional convenience title rendered in the default header. Ignored visually when a `[cbaModalHeader]` is projected — do not set both. */
  readonly title = input<string | undefined>(undefined);

  /** Width variant. Host modifier only; dialog width is driven by `CbaModalService.open` options. */
  readonly size = input<CbaModalSize>('md');

  /** Vertically-centered host modifier. Dialog centering is driven by `CbaModalService.open` options. */
  readonly centered = input<boolean>(false);

  /** When `true`, renders a themed close (×) button that dismisses the modal. */
  readonly dismissible = input<boolean>(true);

  /** Stable id for the default title element, used as `aria-labelledby`. */
  private readonly titleId = `cba-modal-title-${cbaModalTitleUid++}`;

  /** Wires `aria-labelledby` for the default-title case (spec §8). */
  ngOnInit(): void {
    if (this.title()) {
      this.activeModal.update({ ariaLabelledBy: this.titleId });
    }
  }

  /** Dismiss the modal via ng-bootstrap when the close button is clicked. */
  protected onClose(): void {
    this.activeModal.dismiss('close');
  }
}
```

**Rules verification:**
- Method bodies: `ngOnInit` ≈3 lines, `onClose` ≈1 line. ✅
- Args: `ngOnInit` 0, `onClose` 0. ✅
- Nesting ≤2. ✅
- Private members by default (`activeModal`, `titleId`); public only signal inputs. ✅
- File length ≈90 lines incl. JSDoc. ✅ (< 200)

---

### Step 3.3 — Create `src/components/modal/cba-modal.component.html`

Uses Angular 22 control-flow `@if`. Mirrors the `CbaCard` slot convention. The default
`<ng-content>` (no `select`) captures both plain body content and `[cbaModalBody]`
nodes (since no selector claims the attribute, they fall to the default slot).

```html
<div class="cba-modal__header">
  <ng-content select="[cbaModalHeader]"></ng-content>
  @if (title()) {
    <h2 class="cba-modal__title" [id]="titleId">{{ title() }}</h2>
  }
  @if (dismissible()) {
    <button
      type="button"
      class="cba-modal__close"
      aria-label="Close"
      (click)="onClose()">
      <span aria-hidden="true">&times;</span>
    </button>
  }
</div>

<div class="cba-modal__body">
  <ng-content></ng-content>
</div>

<div class="cba-modal__footer">
  <ng-content select="[cbaModalFooter]"></ng-content>
</div>
```

> Header & footer omission uses `:empty` in the SCSS (Step 3.4), matching `CbaCard`.
> The `[cbaModalHeader]` slot and `title` are mutually-exclusive by convention (D5).

---

### Step 3.4 — Create `src/components/modal/cba-modal.component.scss`

Component-emulated chrome only. Global surface/backdrop theming is in `theme/_modal.scss`
(D4). No `::ng-deep` here (it cannot reach the portal backdrop/surface).

```scss
:host {
  display: block;
}

.cba-modal__header {
  display: flex;
  align-items: center;
  gap: var(--cba-space-3);
  padding: var(--cba-space-4) var(--cba-space-5);
  border-bottom: 1px solid var(--cba-border-subtle);

  &:empty {
    display: none;
  }
}

.cba-modal__title {
  flex: 1 1 auto;
  margin: 0;
  color: var(--cba-text-primary);
  font-size: var(--cba-space-5);
  font-weight: 600;
}

.cba-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--cba-space-6);
  height: var(--cba-space-6);
  padding: 0;
  border: none;
  border-radius: var(--cba-radius-sm);
  background: transparent;
  color: var(--cba-text-secondary);
  cursor: pointer;

  &:hover {
    background: var(--cba-hover);
    color: var(--cba-text-primary);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}

.cba-modal__body {
  padding: var(--cba-space-4) var(--cba-space-5);
  color: var(--cba-text-secondary);
}

.cba-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--cba-space-3);
  padding: var(--cba-space-4) var(--cba-space-5);
  border-top: 1px solid var(--cba-border-subtle);

  &:empty {
    display: none;
  }
}
```

**Rules:** only `--cba-*` tokens; no magic numbers (sizes via `--cba-space-*`); ≤200 lines. ✅

---

### Step 3.5 — Create `src/components/modal/cba-modal.service.ts`

**Rules:** `providedIn: 'root'`; `inject`; `open` has exactly 2 args; helper has 1 arg;
destructure-and-spread keeps `toNgbOptions` short; single-section conditionals only.
`title` is intentionally absent (D2). Default `backdropClass`/`windowClass` enable the
global theming scoping (D4) but stay overridable via `CbaModalOptions`.

```ts
import { Injectable, TemplateRef, Type, inject } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { CbaModalOptions } from './cba-modal.types';

/**
 * Thin convenience wrapper around {@link NgbModal.open}.
 *
 * Translates {@link CbaModalOptions} into `NgbModalOptions` and delegates to
 * ng-bootstrap. Open/close, backdrop, ESC and focus management are owned by
 * ng-bootstrap. Returns the raw {@link NgbModalRef} so consumers can read
 * `closed` / `dismissed` and call `close()` / `dismiss()`.
 *
 * @see [CBA_MODAL.md](/docs/CBA_MODAL.md)
 */
@Injectable({ providedIn: 'root' })
export class CbaModalService {
  private readonly ngbModal = inject(NgbModal);

  /**
   * Open `content` (component type or `TemplateRef`) as a themed modal.
   * @param content Component type or `TemplateRef` to render as modal content.
   * @param options Wrapper options; forwarded/translated to ng-bootstrap.
   */
  open(
    content: Type<unknown> | TemplateRef<unknown>,
    options?: CbaModalOptions,
  ): NgbModalRef {
    return this.ngbModal.open(content, this.toNgbOptions(options));
  }

  /** Translate wrapper options into ng-bootstrap options (D1/D2/D4). */
  private toNgbOptions(options?: CbaModalOptions): NgbModalOptions {
    if (!options) {
      return { backdropClass: 'cba-modal-backdrop', windowClass: 'cba-modal-window' };
    }
    const { size, centered, dismissible, ...rest } = options;
    return {
      ...rest,
      size,
      centered,
      backdrop: dismissible === false ? 'static' : true,
      keyboard: dismissible !== false,
      backdropClass: rest.backdropClass ?? 'cba-modal-backdrop',
      windowClass: rest.windowClass ?? 'cba-modal-window',
    };
  }
}
```

**Verification:**
- `open` 2 params ✅; `toNgbOptions` 1 param ✅.
- No multi-section booleans ✅.
- `size` (`'sm'|'md'|'lg'`) assignable to `NgbModalOptions.size` (`'sm'|'lg'|'xl'|string`) ✅.
- `dismissible === false` → `backdrop:'static'`, `keyboard:false`; omitted/`true` → `backdrop:true`, `keyboard:true` ✅.
- Default `backdropClass`/`windowClass` scoping, overridable ✅.

> **Note:** The implicit `title`-forwarding described in spec §3.3 is intentionally
> not implemented (D2). The consumer sets `title` on `<cba-modal>` in the host template.

---

### Step 3.6 — Create `src/theme/_modal.scss` (global ng-bootstrap modal theming — D4)

Renders outside the component host → must be global. Imported by `theme.scss`, so
consumers that load the library theme (`@use '@cobranza-apps/ui/theme'`) get themed modals.

```scss
/**
 * Global theming for ng-bootstrap modals driven by @cobranza-apps/ui tokens.
 *
 * Reaches elements rendered by ng-bootstrap OUTSIDE any CbaModalComponent host
 * (`.modal-content`, `.modal-backdrop`), which component-emulated `::ng-deep`
 * cannot target. Scoped to Cba modals via the default `windowClass`/`backdropClass`
 * set in CbaModalService so non-Cba ng-bootstrap modals stay on Bootstrap defaults.
 *
 * Requires Bootstrap 5 CSS (peer dependency) for `.modal-dialog` sizing classes.
 */
.modal-backdrop.cba-modal-backdrop {
  background-color: var(--cba-bg-overlay);
  opacity: 1;
}

.cba-modal-window .modal-content {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-lg);
  box-shadow: var(--cba-shadow-elevated);
  color: var(--cba-text-primary);
}
```

---

### Step 3.7 — Modify `src/theme/theme.scss`

Add `@use 'modal';` after `base` (maintains the existing alphabetical-ish order;
`modal` is a component theme partial, placed after `base` and before `mixins`/`utilities`).

Replace the file body with:

```scss
@use 'variables';
@use 'base';
@use 'modal';
@use 'mixins';
@use 'utilities';
```

(Only the new `@use 'modal';` line is added; everything else unchanged.)

---

### Step 3.8 — Replace `src/components/modal/index.ts` barrel

The existing file is an empty placeholder (`export {};`). Replace its full body with:

```ts
/**
 * Barrel for the CbaModal wrapper.
 *
 * Re-exports the public API of the ng-bootstrap-backed modal wrapper so
 * `public-api.ts` and consumers can import from `components/modal`.
 */
export * from './cba-modal.component';
export * from './cba-modal.service';
export * from './cba-modal.types';
```

> Do NOT export `cba-modal.component.spec.ts` internals or any future test helpers.

---

### Step 3.9 — Modify `src/public-api.ts`

Insert the modal export alphabetically between `empty-state` and `module-container`.
The only change is adding one line:

```ts
export * from './components/empty-state';
export * from './components/modal';
export * from './components/module-container';
```

(Previously `empty-state` was followed directly by `module-container`.)

---

### Step 3.10 — Create `docs/CBA_MODAL.md`

Follow the `CBA_BUTTON.md` / `CBA_CARD.md` structure (ToC, Selector, Import, Inputs, Slots,
Usage, Size, Accessibility, ng-bootstrap note, Related docs). Outline:

```markdown
# CbaModal

Themed modal wrapper around @ng-bootstrap/ng-bootstrap. ng-bootstrap owns open/close,
backdrop, ESC, and focus management; CbaModal owns the token-styled structure, an
optional convenience title, and a themed close button.

## Table of Contents
- [Selector](#selector)
- [Import](#import)
- [How it works](#how-it-works)
- [Inputs](#inputs)
- [Content projection slots](#content-projection-slots)
- [Opening a modal](#opening-a-modal)
- [Projection example](#projection-example)
- [Size options](#size-options)
- [Dismissing](#dismissing)
- [Accessibility](#accessibility)
- [Theming notes](#theming-notes)
- [Related docs](#related-docs)

## Selector
`<cba-modal>` — standalone, exported from `@cobranza-apps/ui`.

## Import
```ts
import { CbaModalComponent, CbaModalService } from '@cobranza-apps/ui';
```

## How it works
- CbaModalComponent is the modal CONTENT shell (header/body/footer + title + close).
- CbaModalService.open(content, options) delegates to NgbModal.open and returns NgbModalRef.
- Behaviour (backdrop, ESC, focus trap, sizing classes) comes from ng-bootstrap + Bootstrap CSS.
- Requires Bootstrap 5 CSS (peer dep) for .modal-dialog sizing classes.

## Inputs
| Name | Type | Default | Description |
| `title` | `string \| undefined` | `undefined` | Optional convenience title. Do not set when projecting `[cbaModalHeader]`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Host modifier; dialog width driven by CbaModalService size option. |
| `centered` | `boolean` | `false` | Host modifier; centering driven by CbaModalService centered option. |
| `dismissible` | `boolean` | `true` | Renders the close (×) button; dismisses the modal. |

## Content projection slots
| Slot | Selector | Required | Description |
| Header | `[cbaModalHeader]` | No | Custom header; takes over the header region. |
| Body | default (or `[cbaModalBody]`) | Yes | Modal body content. |
| Footer | `[cbaModalFooter]` | No | Action buttons (typically `cba-button`). |

## Opening a modal
- Create a host component that uses <cba-modal> and injects NgbActiveModal.
- Call CbaModalService.open(HostComponent, options).
- Read ref.closed / ref.dismissed; call ref.componentInstance inputs via host template.

(code: open-from-parent example + host component example from spec §2.3)

## Projection example
(code: <cba-modal title="..."> with cbaModalBody + cbaModalFooter containing cba-button, from spec §2.3)

## Size options
| size | ng-bootstrap class | effect |
'lg' → modal-lg (wider); 'sm' → modal-sm (narrower); 'md' (default) → no size class.

## Dismissing
- Close (×) button calls NgbActiveModal.dismiss('close').
- Footer buttons call activeModal.close(result) / activeModal.dismiss(reason).
- backdrop/ESC are owned by ng-bootstrap; control via CbaModalService `dismissible` option.
- dismissible:false → backdrop:'static', keyboard:false (no backdrop-click/ESC dismiss).

## Accessibility
- role=dialog, aria-modal, focus trap, focus restore come from ng-bootstrap.
- When title is set, CbaModalComponent auto-wires aria-labelledby to the title element via NgbActiveModal.update.
- When projecting [cbaModalHeader], pass ariaLabelledBy via CbaModalOptions.
- Close button uses aria-label="Close".

## Theming notes
- Surface: --cba-bg-elevated, --cba-border-subtle, --cba-radius-lg, --cba-shadow-elevated.
- Backdrop: --cba-bg-overlay (global theme/_modal.scss).
- Title: --cba-text-primary; body: --cba-text-secondary; focus ring: --cba-focus-ring.
- Applies because CbaModalService sets windowClass 'cba-modal-window' / backdropClass 'cba-modal-backdrop'.

## Related docs
- README, USAGE, THEME, CBA_BUTTON.
- ng-bootstrap modal docs: https://ng-bootstrap.github.io/#/components/modal
```

> Keep the doc focused; reuse the exact consumer snippets from spec §2.3. Add a ToC since
> the file will exceed 100 lines (RULE: split if > 100 lines / add index — this is one cohesive topic, ToC suffices).

---

### Step 3.11 — Create `src/components/modal/cba-modal.component.spec.ts`

**Testing approach (wrapper-only):**
- Provide a stub `NgbActiveModal` (for component tests) and a stub `NgbModal` (for the
  service test). Do NOT test ng-bootstrap internals.
- Use the existing `hostEl` / `queryByClass` helpers from `src/components/testing/test-helpers.ts`.
- Mirror the `CbaButton` spec structure (direct component + projected-content host).
- Keep ≤ 200 lines. If approaching the limit, extract the `CbaModalService` describe block
  into a new `src/components/modal/cba-modal.service.spec.ts` (conditional, noted in §2).

**Cases (map to spec §11.1):**

1. Projected regions:
   - `cbaModalHeader` projected → header region contains projected node; title not also
     asserted hidden (D5 documented convention; skip the "title ignored" assertion).
   - default content projected → body region contains it.
   - `cbaModalFooter` projected → footer region contains it.
   - `title` set (no header projection) → `.cba-modal__title` has the text and the `id`.
2. Size mapping (host classes):
   - default → `cba-modal--md`.
   - `size='sm'` → `cba-modal--sm`.
   - `size='lg'` → `cba-modal--lg`.
3. Service `open`/close:
   - `CbaModalService.open(CbaModalComponent, {...})` calls `NgbModal.open` once with merged options.
   - `dismissible:false` → `backdrop:'static'`, `keyboard:false`.
   - `centered:true` → `centered:true`.
   - `size:'lg'` → `size:'lg'`.
   - returned ref exposes `close`/`dismiss` (spy stub).
   - default `backdropClass`/`windowClass` set to `cba-modal-backdrop`/`cba-modal-window`.
4. Close button:
   - `dismissible:true` → `.cba-modal__close` rendered; clicking calls `activeModal.dismiss('close')`.
   - `dismissible:false` → `.cba-modal__close` absent.

**Skeleton (single file, kept tight):**

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalComponent } from './cba-modal.component';
import { CbaModalService } from './cba-modal.service';
import { CbaModalOptions } from './cba-modal.types';
import { hostEl } from '../testing/test-helpers';

function activeModalStub(): jasmine.SpyObj<NgbActiveModal> {
  return jasmine.createSpyObj<NgbActiveModal>('NgbActiveModal', ['close', 'dismiss', 'update']);
}

function modalRefStub(): NgbModalRef {
  return { close: jasmine.createSpy('close'), dismiss: jasmine.createSpy('dismiss') } as unknown as NgbModalRef;
}

@Component({
  standalone: true,
  imports: [CbaModalComponent],
  template: `<cba-modal title="Confirm">
    <div cbaModalHeader class="hdr"><h3>Custom</h3></div>
    <div cbaModalBody class="bdy">Body text</div>
    <div cbaModalFooter class="ftr"><button>OK</button></div>
  </cba-modal>`,
})
class ModalProjectionHost {}

describe('CbaModalComponent', () => {
  function setup(): ComponentFixture<CbaModalComponent> {
    TestBed.configureTestingModule({
      imports: [CbaModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: activeModalStub() }],
    });
    return TestBed.createComponent(CbaModalComponent);
  }

  describe('projected regions', () => {
    let hostFixture: ComponentFixture<ModalProjectionHost>;
    beforeEach(async () => {
      TestBed.configureTestingModule({ imports: [ModalProjectionHost] });
      hostFixture = TestBed.createComponent(ModalProjectionHost);
      hostFixture.detectChanges();
    });
    it('projects header/body/footer slots', () => {
      expect(hostFixture.nativeElement.querySelector('.hdr')).not.toBeNull();
      expect(hostFixture.nativeElement.querySelector('.bdy')).not.toBeNull();
      expect(hostFixture.nativeElement.querySelector('.ftr')).not.toBeNull();
    });
    it('renders the title when no custom header is projected', () => {
      // separate host without cbaModalHeader (template variant)
    });
  });

  describe('size host classes', () => {
    let fixture: ComponentFixture<CbaModalComponent>;
    beforeEach(() => (fixture = setup()));
    it('applies cba-modal--md by default', () => {
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--md')).toBe(true);
    });
    it('applies cba-modal--sm and cba-modal--lg', () => {
      fixture.componentRef.setInput('size', 'sm'); fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--sm')).toBe(true);
      fixture.componentRef.setInput('size', 'lg'); fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--lg')).toBe(true);
    });
  });

  describe('close button', () => {
    it('renders and dismisses when dismissible', () => {
      const stub = activeModalStub();
      TestBed.configureTestingModule({
        imports: [CbaModalComponent],
        providers: [{ provide: NgbActiveModal, useValue: stub }],
      });
      const fixture = TestBed.createComponent(CbaModalComponent);
      fixture.detectChanges();
      const closeBtn = fixture.nativeElement.querySelector('.cba-modal__close');
      expect(closeBtn).not.toBeNull();
      closeBtn.click();
      expect(stub.dismiss).toHaveBeenCalledWith('close');
    });
    it('is hidden when dismissible is false', () => {
      const fixture = setup();
      fixture.componentRef.setInput('dismissible', false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.cba-modal__close')).toBeNull();
    });
  });
});

describe('CbaModalService', () => {
  let ngbOpenSpy: jasmine.Spy;
  let ref: NgbModalRef;
  beforeEach(() => {
    ref = modalRefStub();
    ngbOpenSpy = jasmine.createSpy('open').and.returnValue(ref);
    TestBed.configureTestingModule({
      providers: [
        CbaModalService,
        { provide: NgbModal, useValue: { open: ngbOpenSpy } },
      ],
    });
  });
  function open(options?: CbaModalOptions): NgbModalRef {
    const service = TestBed.inject(CbaModalService);
    return service.open(CbaModalComponent, options);
  }
  it('delegates to NgbModal.open once and returns the ref', () => {
    expect(open()).toBe(ref);
    expect(ngbOpenSpy).toHaveBeenCalledTimes(1);
    expect(ngbOpenSpy).toHaveBeenCalledWith(CbaModalComponent, jasmine.any(Object));
  });
  it('maps dismissible:false to backdrop static + keyboard false', () => {
    open({ dismissible: false });
    const opts = ngbOpenSpy.calls.mostRecent().args[1];
    expect(opts.backdrop).toBe('static');
    expect(opts.keyboard).toBe(false);
  });
  it('maps centered:true and size:lg', () => {
    open({ centered: true, size: 'lg' });
    const opts = ngbOpenSpy.calls.mostRecent().args[1];
    expect(opts.centered).toBe(true);
    expect(opts.size).toBe('lg');
  });
  it('sets default backdrop/window classes', () => {
    open();
    const opts = ngbOpenSpy.calls.mostRecent().args[1];
    expect(opts.backdropClass).toBe('cba-modal-backdrop');
    expect(opts.windowClass).toBe('cba-modal-window');
  });
});
```

**Line budget:** The skeleton above is intentionally compact (~150 lines). The implementer
should flesh out the two `it` stubs (title-rendering case + body-only projection host) without
exceeding 200 lines. If exceeded, move the `describe('CbaModalService')` block to
`src/components/modal/cba-modal.service.spec.ts`.

**Rules:** no commented-out code (remove the inline `// separate host`/`// template variant`
comments before creating); self-documenting names; ≤200 lines.

---

## 4. Terminal Commands (implementer runs, in order)

Single commands only (no chaining — see `tool-selection-priority.md` / gitignore rule).

1. `npm run typecheck` — confirm types compile (component, service, barrel, public-api).
2. `npm run lint` — eslint on `src/components/modal/**` and `src/theme/**`.
3. `npm run format` — prettier (writes).
4. `npm run test` — Jest; confirm CbaModal specs pass and no existing specs break.
5. `npm run build` — ng-packagr; library must build successfully (acceptance criterion).

If `npm run build` fails due to public-api cycle or missing export, re-read
`src/public-api.ts` and the barrel ordering, then re-run.

---

## 5. Git / Commit Strategy (implementer)

Branch already created in step 2 of the global plan (`feat/phase5-modal-form-wrappers`).
Commit in logical, reviewable chunks. Before each commit the implementer MUST read
`.gitignore` and run `git status`, ensuring no `node_modules/`, `dist/`, or build artefacts
are staged.

Suggested commits (this task only):

1. `feat(modal): add CbaModal types, component and service`
   - `cba-modal.types.ts`, `cba-modal.component.{ts,html,scss}`, `cba-modal.service.ts`,
     `index.ts` barrel.
2. `feat(modal): theme ng-bootstrap modal surface with --cba tokens`
   - `src/theme/_modal.scss`, `src/theme/theme.scss`.
3. `feat(modal): export CbaModal from public-api`
   - `src/public-api.ts`.
4. `test(modal): add wrapper-only CbaModal component and service specs`
   - `cba-modal.component.spec.ts` (+ optional `cba-modal.service.spec.ts`).
5. `docs(modal): add CBA_MODAL.md`
   - `docs/CBA_MODAL.md`.

> Do NOT amend or push to non-`origin` remotes (git-remote-safety rule). The merge / push
> happens only in step 5 of the global plan, not in this task.

---

## 6. Acceptance Criteria Mapping (from spec §13 / TODO Task 1)

| Criterion | Where satisfied |
|---|---|
| `CbaModalComponent`, `CbaModalService`, `CbaModalOptions` compile | Steps 3.1, 3.2, 3.5 + `npm run typecheck`/`build` |
| `CbaModalService.open()` delegates to `NgbModal.open()` | Step 3.5; service spec §3.11 case group 3 |
| Modal surface uses `--cba-bg-elevated` + `--cba-border-subtle` | Step 3.6 (`_modal.scss`) |
| Backdrop uses `--cba-bg-overlay` | Step 3.6 |
| Title `--cba-text-primary`; body `--cba-text-secondary` | Steps 3.4, 3.6 |
| Footer actions work with projected `cba-button` | Projection slots (Step 3.3) + docs example (3.10) |
| Public symbols exported from barrel + `public-api.ts` | Steps 3.8, 3.9 |
| `npm run build` succeeds | Step 4.5 |
| JSDoc on public API | Steps 3.1, 3.2, 3.5 |
| `docs/CBA_MODAL.md` created | Step 3.10 |
| Minimal wrapper-only tests pass | Step 3.11 + Step 4.4 |

Objective-of-Task-1 checklist (TODO §Task 1 `[ ]` items) is fully covered by the above.

---

## 7. Technical & Architecture Decisions Recap

- **Thin wrapper discipline:** no custom modal engine; service forwards, component shells.
- **ng-bootstrap owns behaviour:** open/close, backdrop, ESC, focus trap, sizing classes; cba owns chrome + tokens.
- **Bootstrap 5 CSS is a peer dep** that the host app loads; needed for `.modal-dialog` sizing.
- **Two styling layers:**
  - Component-emulated SCSS → projected chrome (header/body/footer/title/close).
  - Global `theme/_modal.scss` → portal-rendered surface + backdrop (D4 rationale).
- **Signal inputs** for all `CbaModalComponent` inputs (Angular 22 style, matches `CbaButton`).
- **Service returns raw `NgbModalRef`** (non-generic, D1) — consumers read `closed` / `dismissed` / `componentInstance`.
- **`dismissible` mapping** is the only non-trivial translation; everything else passes through.
- **Auto `aria-labelledby`** via `NgbActiveModal.update` for the default-title case (D3) keeps a11y without content detection.
- **No new runtime deps;** `@ng-bootstrap/ng-bootstrap` already a peer dep.

---

## 8. Things Explicitly NOT Done in This Task (scope guardrails)

- No `CbaInput` / `CbaSelect` / `CbaDatepicker` / shared `CbaField` (Tasks 2–5).
- No `data` generic / `CbaModalOptions<T>` (out of scope per spec §2.4).
- No reimplementation of ng-bootstrap internals.
- No custom modal engine, validation, or BFF integration.
- No mobile/responsive breakpoint work (desktop-only per TODO constraints).
- No push/merge (handled by global plan step 5).
- This plan does NOT create any implementation file — it is a plan only.

---

## 9. Plan Verification Against Original Task

Task 1 (TODO) requires a thin `<cba-modal>` ng-bootstrap wrapper with: selector, base
deps, suggested API (`title`/`size`/`centered`/`dismissible` inputs + header/default/footer
slots), open/close ergonomics, visuals using `--cba-*` tokens, placement under
`src/components/modal/`, export from `public-api.ts`, build success, JSDoc, docs
(open/dismiss/projection/size + ng-bootstrap note), and minimal wrapper-only tests.

This plan delivers every item:
- Selector `cba-modal` ✅ (3.2)
- Base ng-bootstrap (`NgbModal`/`NgbActiveModal`/`NgbModalRef`/`NgbModalOptions`) ✅ (3.1, 3.2, 3.5)
- Inputs `title`/`size`/`centered`/`dismissible` with the exact suggested defaults ✅ (3.2)
- Header/default/body/footer projection ✅ (3.3)
- Open/close via `CbaModalService` + `NgbActiveModal` ✅ (3.5 + docs 3.10)
- `--cba-*` tokens for surface, border, overlay, radius, text ✅ (3.4, 3.6)
- Folder `src/components/modal/` ✅
- `public-api.ts` export ✅ (3.9)
- Build success verification ✅ (4.5)
- JSDoc ✅ (3.1, 3.2, 3.5)
- Docs open/dismiss/projection/size + ng-bootstrap note ✅ (3.10)
- Minimal wrapper-only tests ✅ (3.11)

Deviations (§0) are technically required and documented; none remove required functionality.
**Plan matches the task.**

---

## Code Review Fix Plan

Generated by code-reviewer sub-agent after Task 1, 4.2 implementation.

### Overall assessment

The implementation is faithful to the plan and the project conventions. There are no compile-time deviations, no missing public exports, and the docs are complete. The only actionable gaps are in unit-test coverage for the wrapper-specific behaviours that the plan explicitly listed in §3.11. No production code changes are required.

### Fix items

1. **Add `titleId` / `aria-labelledby` wiring assertions**
   - In `src/components/modal/cba-modal.component.spec.ts`, in the existing test `renders the title when no custom header is projected`, add assertions that:
     - the `.cba-modal__title` element has a non-empty `[id]`;
     - that `[id]` equals the component instance's `titleId`;
     - the stub `activeModal.update` was called once with `{ ariaLabelledBy: titleId }`.
   - Add a new test that when `title` is not set, `activeModal.update` is not called.
   - Rationale: `ngOnInit` wiring is the only wrapper logic for accessibility; it must be tested.

2. **Add `centered` host-class test**
   - In the `describe('size host classes')` block, add a test that sets `centered` to `true` and asserts `hostEl(fixture).classList.contains('cba-modal--centered')` is true.
   - Rationale: `centered` is a public input documented in the API and the host modifier is wrapper logic.

3. **Add header/footer `:empty` omission test**
   - Add a test using a host component that projects only body content (no header, no title, no footer, and `dismissible: false`) and asserts that `.cba-modal__header` and `.cba-modal__footer` are not present / hidden.
   - Rationale: mirrors the `CbaCard` pattern and confirms the component does not render empty chrome.

4. **Add close-button accessibility assertion**
   - In the existing `renders and dismisses when dismissible is true` test, assert that the `.cba-modal__close` button has `aria-label="Close"`.
   - Rationale: accessibility is part of the wrapper responsibility and is documented in the Accessibility section.

5. **Align `titleId` access modifier in the plan snippet**
   - The implementation uses `protected readonly titleId` (consistent with `CbaButton`, which uses `protected` for template/host-accessible members), whereas §3.2 of this plan shows `private readonly titleId`.
   - Update the §3.2 code snippet to `protected readonly titleId` so the plan matches the implementation and the project convention.
   - Rationale: `protected` is the correct choice here because the template binds `[id]="titleId"`; keeping the plan consistent avoids confusion during future reviews.

### What is NOT broken

- Public exports: `src/public-api.ts` and `src/components/modal/index.ts` export the correct symbols in the right order.
- Theming: `src/theme/_modal.scss` is imported in `src/theme/theme.scss` and targets the correct portal-rendered elements.
- Service mapping: `dismissible`, `centered`, `size`, default `backdropClass`/`windowClass` are all correctly translated.
- Docs: `docs/CBA_MODAL.md` covers selector, import, inputs, projection slots, opening/dismissing, size, accessibility, and theming.
- Rule compliance: no file exceeds 200 lines, no method exceeds 50 lines, no function has more than 2 arguments, no commented-out code, and boolean conditions are single-section.

---

## Simplification Plan

Generated by code-simplifier review after Task 1 implementation (4.3). Items are ordered by implementation effort; all preserve current public API and behaviour.

### 1. Unify `CbaModalService.toNgbOptions` default logic

**File:** `src/components/modal/cba-modal.service.ts`

**Issue:** `toNgbOptions` has an early `if (!options)` return that duplicates the default `backdropClass` and `windowClass` strings, and the main path repeats `rest.backdropClass ?? 'cba-modal-backdrop'` and `rest.windowClass ?? 'cba-modal-window'`.

**Simplification:**
- Normalize `options` with a default object first, then use a single return path.
- Extract the `dismissible === false` check into a named variable to avoid evaluating it twice and to make the mapping intent explicit.

**Example shape:**
```ts
private toNgbOptions(options?: CbaModalOptions): NgbModalOptions {
  const opts = options ?? {};
  const isStatic = opts.dismissible === false;
  return {
    ...opts,
    size: opts.size,
    centered: opts.centered,
    backdrop: isStatic ? 'static' : true,
    keyboard: !isStatic,
    backdropClass: opts.backdropClass ?? 'cba-modal-backdrop',
    windowClass: opts.windowClass ?? 'cba-modal-window',
  };
}
```

### 2. Remove redundant inline TestBed setup in component spec

**File:** `src/components/modal/cba-modal.component.spec.ts`

**Issue:** The "renders and dismisses when dismissible is true" test duplicates the `TestBed.resetTestingModule`, `configureTestingModule`, and `createComponent` calls that `createFixture()` already centralizes.

**Simplification:**
- Refactor that test to use `createFixture()` and inject the stub to make assertions.
- If the stub needs to be exposed from `createFixture`, return it alongside `fixture` and `activeModal` (already returned).

### 3. Drop unused `cbaModalBody` attribute in test host

**File:** `src/components/modal/cba-modal.component.spec.ts`

**Issue:** `ModalProjectionHost` projects `<div cbaModalBody class="bdy">`. There is no `<ng-content select="[cbaModalBody]">` in the component template, so the attribute is ignored and the content falls into the default slot.

**Simplification:**
- Remove the `cbaModalBody` attribute from the test host template to avoid implying a non-existent projection slot.

### 4. Consolidate header/footer shared styling

**File:** `src/components/modal/cba-modal.component.scss`

**Issue:** `.cba-modal__header` and `.cba-modal__footer` share `display: flex`, `align-items: center`, `gap: var(--cba-space-3)`, and `padding: var(--cba-space-4) var(--cba-space-5)`, plus identical `&:empty { display: none; }` rules.

**Simplification:**
- Introduce a small placeholder/mixin (or comma-grouped selector) for the shared flex chrome and `:empty` rule, then keep only the unique properties (`border-bottom`, `border-top`, `justify-content`) on each block.

### 5. Consider whether `cba-modal--md` default modifier adds value

**File:** `src/components/modal/cba-modal.component.ts`

**Issue:** The host binding `cba-modal--md` is applied whenever `size()` is the default `'md'`. Bootstrap has no `modal-md` class and the component style does not define specific `&--md` rules, so the class is currently a test-only hook.

**Simplification:**
- Either remove the `cba-modal--md` binding and update tests to assert only the non-default `sm`/`lg` classes, or add a small explicit style hook so the class has a real purpose.
- If kept, document that the modifier is for visual/test hooks and does not affect the dialog width.

### 6. Improve readability of service test option extraction

**File:** `src/components/modal/cba-modal.component.spec.ts`

**Issue:** Service tests use `ngbOpen.mock.calls[0][1]` and string indexing (`opts['backdrop']`) which is verbose and less type-safe than necessary.

**Simplification:**
- Capture the options with a typed variable, e.g.:
  ```ts
  const opts = ngbOpen.mock.calls[0][1] as NgbModalOptions;
  expect(opts.backdrop).toBe('static');
  ```
- Use `expect.objectContaining({ ... })` for the default-class assertion instead of indexing into the call array.

### 7. Verify `CbaModalDismissReason` public value

**File:** `src/components/modal/cba-modal.types.ts`

**Issue:** `CbaModalDismissReason` is exported but never used inside the component or service. It may be intended purely for consumers.

**Simplification:**
- Confirm it is intentionally public API; if so, keep it but add a JSDoc note that it is a consumer-facing type. If not needed, remove it to reduce API surface.

### 8. Standardise active-modal stub creation

**File:** `src/components/modal/cba-modal.component.spec.ts`

**Issue:** The same `{ close: jest.fn(), dismiss: jest.fn(), update: jest.fn() }` stub shape is repeated in the `ModalProjectionHost` providers and in `createFixture()`.

**Simplification:**
- Extract a small `createActiveModalStub()` helper (or use `jasmine.createSpyObj`) and reuse it in both places.

---

**Plan path:** `.kilo/plans/20260730-phase5-modal.md`
