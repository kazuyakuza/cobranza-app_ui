# CbaModal — Front-end Technical Specification

> **Task:** Phase 5 — Task 1 — `CbaModal` thin ng-bootstrap modal wrapper  
> **Source TODO:** `.agent/todos/20260730/20260730-todo-3.md`  
> **Source Global Plan:** `.kilo/plans/20260730-phase5-modal-form-wrappers.md`  
> **Branch:** `feat/phase5-modal-form-wrappers`

---

## 1. Target Framework & TypeScript Configuration

- **Framework:** Angular 22, standalone components only (no NgModules).
- **Language:** TypeScript ~6.0.3, strict mode as configured in `tsconfig.lib.json`.
- **Change detection:** `ChangeDetectionStrategy.OnPush` for the modal content shell.
- **Signals:** Angular signals (`input()`, `output()`) for all component inputs/outputs.
- **Base dependency:** `@ng-bootstrap/ng-bootstrap` v21 (`NgbModal`, `NgbModalRef`, `NgbModalOptions`, `NgbModalConfig`, `NgbActiveModal`).
- **Styling:** SCSS with CSS custom properties (`--cba-*` tokens from `src/theme/_variables.scss`) and BEM-ish naming.

---

## 2. Component Boundaries & Structure

### 2.1 Public units

| Symbol | File | Role |
| --- | --- | --- |
| `CbaModalComponent` | `src/components/modal/cba-modal.component.ts` | Modal **content shell** — renders projected header, optional title, projected body, and projected footer inside ng-bootstrap modal markup. |
| `CbaModalService` | `src/components/modal/cba-modal.service.ts` | Thin convenience service wrapping `NgbModal.open()`. Consumers call this to open a `CbaModalComponent`. |
| `CbaModalSize` | `src/components/modal/cba-modal.types.ts` | Union type `'sm' \| 'md' \| 'lg'`. |
| `CbaModalOptions` | `src/components/modal/cba-modal.types.ts` | Options object passed to `CbaModalService.open()`. Encapsulates size, centered, dismissible, and ng-bootstrap extras. |
| `CbaModalDismissReason` | `src/components/modal/cba-modal.types.ts` | Lightweight union used for result typing (`'backdrop' \| 'escape' \| 'close' \| string`). |
| Barrel `index.ts` | `src/components/modal/index.ts` | Re-exports public symbols only. |

### 2.2 Folder placement

Actual project structure places components directly under `src/components/` (not `src/lib/components/`). Therefore:

- `src/components/modal/cba-modal.component.ts`
- `src/components/modal/cba-modal.component.html`
- `src/components/modal/cba-modal.component.scss`
- `src/components/modal/cba-modal.service.ts`
- `src/components/modal/cba-modal.types.ts`
- `src/components/modal/cba-modal.component.spec.ts`
- `src/components/modal/index.ts`

### 2.3 Consumer API

```ts
import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { CbaModalComponent, CbaModalService } from '@cobranza-apps/ui';

@Component({ … })
export class MyComponent {
  private readonly modalService = inject(CbaModalService);

  openSettings(): void {
    const ref = this.modalService.open(CbaModalComponent, {
      title: 'Settings',
      size: 'lg',
      centered: true,
      dismissible: true,
    });

    ref.closed.subscribe(result => console.log('Closed with', result));
    ref.dismissed.subscribe(reason => console.log('Dismissed', reason));
  }
}
```

Template projection is done via ng-template references supplied as component properties or directly inside the content component that hosts `CbaModalComponent`. Because `NgbModal.open()` accepts a component type, the recommended pattern is to create a small host component that projects content into `<cba-modal>` slots and pass that host component to `CbaModalService.open()`.

```html
<!-- my-confirmation.component.html -->
<cba-modal title="Confirm deletion">
  <ng-container cbaModalBody>
    This action cannot be undone.
  </ng-container>
  <ng-container cbaModalFooter>
    <cba-button variant="ghost" (cbaClick)="activeModal.dismiss()">Cancel</cba-button>
    <cba-button variant="danger" (cbaClick)="activeModal.close(true)">Delete</cba-button>
  </ng-container>
</cba-modal>
```

```ts
// my-confirmation.component.ts
import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalComponent, CbaButtonComponent } from '@cobranza-apps/ui';

@Component({
  standalone: true,
  imports: [CbaModalComponent, CbaButtonComponent],
  templateUrl: './my-confirmation.component.html',
})
export class MyConfirmationComponent {
  readonly activeModal = inject(NgbActiveModal);
}
```

### 2.4 Data passing

For the initial implementation, data is passed through the host component's own inputs. `CbaModalService.open()` returns `NgbModalRef`, and the consumer can set inputs on the opened component via `ref.componentInstance`:

```ts
const ref = this.modalService.open(MyConfirmationComponent, { size: 'sm' });
ref.componentInstance.itemName = 'Invoice #123';
```

A future iteration may add a `data` generic on `CbaModalOptions` and inject it via a custom token, but that is **out of scope** for this task.

---

## 3. Contracts

### 3.1 `CbaModalComponent`

Selector: `cba-modal`  
Standalone: `true`  
Imports: `NgbActiveModal` (injected), optionally `CbaButtonComponent` is **not** imported by the modal itself — footer buttons are projected by the consumer.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | Optional convenience title rendered in the modal header when no custom header is projected. |
| `size` | `CbaModalSize` | `'md'` | Width variant. Mapped to ng-bootstrap `NgbModalOptions.size`. |
| `centered` | `boolean` | `false` | Vertically centers the modal dialog. |
| `dismissible` | `boolean` | `true` | When `true`, backdrop click and ESC dismiss the modal. Maps to `backdrop: 'static'` and `keyboard: false` when `false`. |

#### Content projection slots

| Slot selector | Purpose |
| --- | --- |
| `[cbaModalHeader]` | Replaces the default title/header region entirely. |
| default / `[cbaModalBody]` | Modal body content. |
| `[cbaModalFooter]` | Action buttons, typically `cba-button`. |

If `cbaModalHeader` is projected, the `title` input is ignored. If neither `title` nor `cbaModalHeader` is provided, the header region is omitted.

#### Outputs

None directly on `CbaModalComponent`. Open/close/dismiss semantics are handled by `NgbModalRef` / `NgbActiveModal`.

#### Internal state

- Injects `NgbActiveModal` privately.
- No additional component-level state.

### 3.2 `CbaModalService`

Injectable in `root`.

```ts
@Injectable({ providedIn: 'root' })
export class CbaModalService {
  private readonly ngbModal = inject(NgbModal);

  open<T>(content: Type<T>, options?: CbaModalOptions): NgbModalRef<T>;
}
```

- Accepts the same `content` argument as `NgbModal.open()` (component type or `TemplateRef`).
- Merges `CbaModalOptions` into `NgbModalOptions`:
  - `size` → `NgbModalOptions.size`
  - `centered` → `NgbModalOptions.centered`
  - `dismissible` → `backdrop: dismissible ? true : 'static'` and `keyboard: dismissible`
- Forwards all other `NgbModalOptions` keys untouched so consumers can still set `windowClass`, `modalDialogClass`, `scrollable`, `beforeDismiss`, etc.
- Returns the raw `NgbModalRef` so consumers can use `result`, `closed`, `dismissed`, `componentInstance`, and `close()` / `dismiss()`.

### 3.3 `CbaModalOptions`

```ts
export interface CbaModalOptions extends Pick<NgbModalOptions, 'ariaLabelledBy' | 'ariaDescribedBy' | 'windowClass' | 'modalDialogClass' | 'backdropClass' | 'scrollable' | 'beforeDismiss'> {
  /** Optional convenience title forwarded to CbaModalComponent when content is CbaModalComponent. */
  title?: string;

  /** Modal width variant. */
  size?: CbaModalSize;

  /** Vertically center the dialog. */
  centered?: boolean;

  /** Allow backdrop click and ESC to dismiss. */
  dismissible?: boolean;
}
```

### 3.4 Type mappings

| CbaModal input | NgbModalOptions key | Notes |
| --- | --- | --- |
| `size` | `size` | `'sm' \| 'md' \| 'lg'`. ng-bootstrap also supports `'xl'` and fullscreen, but CbaModal limits the public API to the three values above. |
| `centered` | `centered` | Boolean. |
| `dismissible` | `backdrop` + `keyboard` | `true` → `backdrop: true`, `keyboard: true`. `false` → `backdrop: 'static'`, `keyboard: false`. |

---

## 4. Routing & Navigation

No routing or navigation changes. `CbaModal` is an overlay primitive opened imperatively via `CbaModalService`.

---

## 5. Styling Architecture

### 5.1 Approach

- Component-scoped SCSS with `ViewEncapsulation.Emulated` (default).
- BEM-ish class names: block `cba-modal`, elements `cba-modal__dialog`, `cba-modal__content`, `cba-modal__header`, `cba-modal__body`, `cba-modal__footer`, `cba-modal__title`, `cba-modal__close`.
- Modifiers mapped from inputs: `cba-modal--sm`, `cba-modal--md`, `cba-modal--lg`, `cba-modal--centered`.
- Host bindings apply size/centered modifier classes to the component host.

### 5.2 Design tokens

| Visual concern | Token |
| --- | --- |
| Modal surface background | `--cba-bg-elevated` |
| Modal border | `--cba-border-subtle` |
| Overlay/backdrop | `--cba-bg-overlay` (target; override Bootstrap `.modal-backdrop` opacity/background where practical) |
| Title text | `--cba-text-primary` |
| Body text | `--cba-text-secondary` |
| Border radius — dialog | `--cba-radius-lg` |
| Border radius — internal surfaces | `--cba-radius-md` |
| Box shadow | `--cba-shadow-elevated` |
| Header/body/footer spacing | `--cba-space-*` scale (`--cba-space-4`, `--cba-space-5`) |
| Focus ring for close button | `--cba-focus-ring` |

### 5.3 Backdrop override strategy

Because ng-bootstrap renders the backdrop outside the component host, apply the overlay token by adding a `cba-modal-backdrop` class to `backdropClass` in `CbaModalService.open()` and styling `.modal-backdrop.cba-modal-backdrop` in the component SCSS (using `::ng-deep` or a dedicated global theme rule). The preferred approach for this phase is a single `::ng-deep` rule inside `cba-modal.component.scss` scoped to `.modal-backdrop.cba-modal-backdrop` so the token stays co-located with the modal component.

### 5.4 Layout rules

- Header: flex row, space-between, align-center. Close button aligned right when `dismissible === true` and no custom header is projected.
- Body: `padding: var(--cba-space-4);`.
- Footer: flex row, justify-end, gap `var(--cba-space-3)`.
- Max-width follows ng-bootstrap/Bootstrap defaults for `sm`, `md`, `lg`.

---

## 6. Responsive Behavior

- **Desktop-only** per project constraints.
- Modal sizes (`sm`/`md`/`lg`) map directly to Bootstrap dialog widths.
- No custom mobile breakpoint behavior required. ng-bootstrap handles viewport overflow and scrolling.

---

## 7. API Integration

No HTTP/API integration. The modal is a pure UI overlay primitive.

---

## 8. Accessibility

- Uses native ng-bootstrap focus trap and focus management — **do not reimplement**.
- `aria-modal="true"`, `role="dialog"`, and `aria-labelledby` are provided by ng-bootstrap when `ariaLabelledBy` is set.
- When the default header/title is used, generate a stable `id` for the title element and pass it as `ariaLabelledBy` automatically in `CbaModalService.open()`.
- Close button (when rendered) uses `aria-label="Close"` and visible `×` text with `aria-hidden="true"`.
- Projected content authors remain responsible for labelling form controls inside the modal body.
- Focus ring for interactive elements uses `--cba-focus-ring`.

---

## 9. Performance & Bundle

- Change detection: `OnPush` on `CbaModalComponent`.
- Service is tree-shakable via `providedIn: 'root'`.
- No additional runtime dependencies beyond `@ng-bootstrap/ng-bootstrap`.
- Do **not** import `CbaButtonComponent` into `CbaModalComponent`; buttons are projected, keeping the modal bundle lean.

---

## 10. Public API Export

Update `src/public-api.ts` alphabetically under Components:

```ts
export * from './components/badge';
export * from './components/button';
export * from './components/card';
export * from './components/empty-state';
export * from './components/modal';
export * from './components/module-container';
export * from './components/module-header';
export * from './components/skeleton';
```

The barrel `src/components/modal/index.ts` must export:

```ts
export * from './cba-modal.component';
export * from './cba-modal.service';
export * from './cba-modal.types';
```

---

## 11. Tests

File: `src/components/modal/cba-modal.component.spec.ts`

Use Jest + `jest-preset-angular` + `TestBed`. Test only wrapper concerns; do **not** test ng-bootstrap internals.

### 11.1 Test cases

1. **Projected regions**
   - Projects `[cbaModalHeader]` into the header region and ignores `title`.
   - Projects default content into the body region.
   - Projects `[cbaModalFooter]` into the footer region.
   - Falls back to rendering `title` input when no custom header is projected.

2. **Size mapping**
   - `size='sm'` applies `cba-modal--sm` host class and forwards `'sm'` to `NgbModalOptions`.
   - `size='md'` (default) applies `cba-modal--md`.
   - `size='lg'` applies `cba-modal--lg`.

3. **Service open/close**
   - `CbaModalService.open(CbaModalComponent)` calls `NgbModal.open()` with merged options.
   - `dismissible=false` maps to `backdrop: 'static'` and `keyboard: false`.
   - `centered=true` maps to `centered: true`.
   - Returned ref exposes `close()` and `dismiss()`.

4. **Dismiss button**
   - Close button is rendered when `dismissible === true` and no custom header is projected.
   - Clicking close calls `activeModal.dismiss('close')`.

### 11.2 Mocks

- Mock `NgbModal` via `TestBed.overrideProvider(NgbModal, { useValue: modalSpy })` or provide a stub service. Use `NgbActiveModal` stub where needed.

---

## 12. Documentation

- JSDoc on `CbaModalComponent`, every public input, `CbaModalService`, and public types.
- `docs/CBA_MODAL.md` covering:
  - Selector and import.
  - How to open and dismiss (host component pattern).
  - Projection slots (`cbaModalHeader`, default body, `cbaModalFooter`).
  - Size options.
  - Explicit note that open/close, backdrop, ESC, and focus trap behaviour come from `@ng-bootstrap/ng-bootstrap`.

---

## 13. Acceptance Criteria

- [ ] `CbaModalComponent`, `CbaModalService`, and `CbaModalOptions` compile.
- [ ] `CbaModalService.open()` delegates to `NgbModal.open()` without reimplementing modal behaviour.
- [ ] Modal surface uses `--cba-bg-elevated` and `--cba-border-subtle`.
- [ ] Backdrop uses `--cba-bg-overlay` where practical.
- [ ] Title uses `--cba-text-primary`; body uses `--cba-text-secondary`.
- [ ] Footer actions work with projected `cba-button`.
- [ ] All public symbols exported from `src/components/modal/index.ts` and `src/public-api.ts`.
- [ ] `npm run build` succeeds.
- [ ] JSDoc present on public API.
- [ ] `docs/CBA_MODAL.md` created.
- [ ] Minimal wrapper-only tests pass.
