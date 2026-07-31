# CbaModal — Front-end Implementation Verification

> **Task:** Phase 5 — Task 1 — `CbaModal` verification (step 4.5a)
> **Branch:** `feat/phase5-modal-form-wrappers`
> **Spec:** `.kilo/plans/20260730-phase5-modal-frontend-spec.md`
> **Date:** 2026-07-30

---

## 1. Verification summary

| Criterion | Result |
| --- | --- |
| Component compiles | ✅ |
| Service compiles | ✅ |
| Public barrel exports (`src/components/modal/index.ts`) | ✅ |
| `src/public-api.ts` alphabetical export | ✅ |
| `npm run build` | ✅ |
| Modal unit tests | ✅ 53/53 passed |
| JSDoc on public API | ✅ |
| `docs/CBA_MODAL.md` created and complete | ✅ |
| Design token usage | ✅ |

Overall: **implementation matches the spec for the majority of functional, styling, and API-surface requirements**, with a few deviations detailed below. The most notable functional issue is the interaction between `[cbaModalHeader]` projection and the default `title` / close button.

---

## 2. Spec ↔ implementation diffs

### 2.1 `[cbaModalHeader]` projection does not suppress `title` and close button

**Spec (§3.1, §5.1, §11.1):**

- "If `cbaModalHeader` is projected, the `title` input is ignored."
- Close button should render "when `dismissible === true` and **no custom header** is projected."

**Implementation (`cba-modal.component.html`):**

```html
<div class="cba-modal__header">
  <ng-content select="[cbaModalHeader]"></ng-content>
  @if (title()) {
    <h2 class="cba-modal__title" [id]="titleId">{{ title() }}</h2>
  }
  @if (dismissible()) {
    <button class="cba-modal__close" ...>
  }
</div>
```

There is no `@ContentChild` query for the header slot, so `title()` and `dismissible()` are evaluated independently. If a consumer projects `[cbaModalHeader]` **and** sets `title="..."`, both the custom header and the default title render. Likewise, the close button renders even when a custom header is present.

**Impact:** medium — violates the documented contract and can produce duplicated/confusing header content.

**Recommended fix:** add a `header` content-child query and guard the title/close button with it, or document explicitly that consumers must not combine them.

---

### 2.2 `aria-labelledby` is wired in the component, not in the service

**Spec (§8):** "When the default header/title is used, generate a stable id for the title element and pass it as `ariaLabelledBy` automatically in `CbaModalService.open()`."

**Implementation:** the id is generated in `CbaModalComponent`, and `activeModal.update({ ariaLabelledBy: this.titleId })` is called in `ngOnInit()`.

**Impact:** low — the accessible outcome is the same (`aria-labelledby` is set on the modal), but the spec placed the responsibility in `CbaModalService.open()`. The current approach also only works for component-based content (where `ngOnInit` runs), which is the intended pattern anyway.

---

### 2.3 Backdrop token override lives in a global theme file, not `::ng-deep` in the component

**Spec (§5.3):** "The preferred approach for this phase is a single `::ng-deep` rule inside `cba-modal.component.scss` scoped to `.modal-backdrop.cba-modal-backdrop` so the token stays co-located with the modal component."

**Implementation:** `src/theme/_modal.scss` contains global rules for `.modal-backdrop.cba-modal-backdrop` and `.cba-modal-window .modal-content`, and `CbaModalService` defaults `windowClass`/`backdropClass` to scope them.

**Impact:** low — the visual result is correct and arguably more maintainable because it avoids `::ng-deep` (deprecated). It is, however, an architectural deviation from the spec. Verify that `src/theme/_modal.scss` is imported by the consumer/global stylesheets; otherwise the backdrop/surface tokens will not apply at runtime.

---

### 2.4 `CbaModalService.open` lacks a generic type parameter

**Spec (§3.2):** `open<T>(content: Type<T>, options?: CbaModalOptions): NgbModalRef<T>`

**Implementation:** `open(content: Type<unknown> | TemplateRef<unknown>, options?: CbaModalOptions): NgbModalRef`

Differences:

1. No `<T>` generic, so `ref.componentInstance` and `ref.closed` / `ref.dismissed` payloads are not typed.
2. Return type is `NgbModalRef` (untyped) instead of `NgbModalRef<T>`.
3. Signature accepts `TemplateRef<unknown>`, which is broader than the spec signature but consistent with the surrounding text that says it accepts the same `content` as `NgbModal.open()`.

**Impact:** medium for API ergonomics — consumers lose type safety on `componentInstance` and result payloads. A host-component pattern can still be typed explicitly via `ref.componentInstance as MyHostComponent`, but this is less ergonomic than a generic service method.

---

### 2.5 Header/footer DOM hiding uses `:empty` instead of conditional rendering

**Spec (§3.1):** "If neither `title` nor `cbaModalHeader` is provided, the header region is omitted."

**Implementation:** the `.cba-modal__header` and `.cba-modal__footer` elements are always rendered in the DOM and hidden with `:empty { display: none; }` when they have no content.

**Impact:** low — visual behavior is equivalent, but the DOM is slightly heavier and the assertion "header region is omitted" is not literally true. Tests confirm the elements exist but are empty.

---

## 3. Front-end quality issues

| Issue | Severity | Notes |
| --- | --- | --- |
| Custom header + title/close-button interaction | Medium | Real UX defect; spec explicitly says title is ignored and close button only shown without custom header. |
| Missing generic on `CbaModalService.open` | Medium | Reduces type safety for consumers. |
| `aria-labelledby` wiring location | Low | Works correctly, but differs from spec. |
| Global theme file vs `::ng-deep` | Low | Better practice, but verify stylesheet is globally imported. |
| Header/footer always in DOM | Low | Cosmetic / semantic difference only. |

No accessibility, security, or build-blocking issues were found.

---

## 4. Verification commands

```bash
npm run test -- --testPathPattern=src/components/modal/cba-modal.component.spec.ts --no-coverage
# Test Suites: 8 passed, 8 total
# Tests:       53 passed, 53 total

npm run build
# Built @cobranza-apps/ui successfully
```

---

## 5. Conclusion

The `CbaModal` implementation is **functionally complete and build-verified**. The deviations from the spec are minor except for the `[cbaModalHeader]` / `title` / close-button interaction and the missing generic on `CbaModalService.open`. These should be addressed before considering the component fully spec-compliant.
