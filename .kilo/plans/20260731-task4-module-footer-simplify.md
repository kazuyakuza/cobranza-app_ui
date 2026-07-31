# Simplification Plan — `CbaModuleFooter`

- **Task:** Task 4 of `.agent/todos/20260730/20260730-todo-4.md` — Code Simplification review.
- **Component:** `src/components/module-footer/`
- **Date:** 2026-07-31
- **Scope:** Identify simplification opportunities. Do **not** apply changes.

---

## 1. Overview

The implementation is already small, readable, and rule-compliant. The opportunities below are low-risk refinements that reduce duplication, remove defensive dead code, and tighten the style surface without changing behaviour or public API.

---

## 2. Component logic (`module-footer.component.ts`)

### 2.1 Merge `STATUS_VISUALS` and `STATUS_TEXTS` into one record

**Current state:** two parallel `Readonly<Record<Exclude<ModuleHeaderStatus, null>, …>>` records keyed by the same six status values.

**Simplification:** combine them into a single `STATUS_CONFIG` record.

```ts
interface StatusConfig {
  readonly icon: IconDefinition;
  readonly text: string;
  readonly animation?: 'spin';
}

const STATUS_CONFIG: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusConfig>> = {
  loading: { icon: faSpinner, text: 'Loading…', animation: 'spin' },
  loaded:  { icon: faCheck, text: 'Ready' },
  success: { icon: faCircleCheck, text: 'Saved' },
  warning: { icon: faTriangleExclamation, text: 'Attention needed' },
  error:   { icon: faCircleXmark, text: 'Error' },
  dirty:   { icon: faPen, text: 'Unsaved changes' },
};
```

**Impact:**
- One source of truth per status.
- `StatusVisual` can be removed or derived from `StatusConfig`.
- `statusVisual` and `displayText` computeds read the same record.
- No change to inputs, outputs, template bindings, or default text.

### 2.2 Remove unreachable fallback expressions

**Current state:**
- `STATUS_VISUALS[current] ?? null` — the record is exhaustive for every non-null `ModuleHeaderStatus`, so `?? null` is never hit.
- `STATUS_TEXTS[current] ?? ''` — same; the record covers all non-null statuses.

**Simplification:** after merging to `STATUS_CONFIG`, use direct indexing:

```ts
readonly statusVisual = computed<StatusVisual | null>(() => {
  const current = this.status();
  return current === null ? null : STATUS_CONFIG[current];
});

readonly displayText = computed<string>(() => {
  const explicit = this.statusText();
  if (this.hasExplicitText(explicit)) {
    return explicit;
  }
  const current = this.status();
  return current === null ? '' : STATUS_CONFIG[current].text;
});
```

**Impact:** less defensive noise; TypeScript still proves exhaustiveness through the mapped type.

### 2.3 Evaluate `hasExplicitText` helper

**Current state:** a private type-guard method used once inside `displayText`.

**Options:**
1. **Keep it** — it documents the "explicit override present" intent and satisfies the single-section boolean rule.
2. **Inline it** — `explicit !== undefined && explicit !== null` is short and readable; however, the method improves clarity and typing.

**Recommendation:** keep the helper. It is not an unnecessary abstraction; it makes the empty-string-override edge case explicit.

---

## 3. Template (`module-footer.component.html`)

### 3.1 `[class]` binding vs. `class` attribute

**Current state:**
```html
<div
  class="cba-module-footer__status"
  [class]="statusClass() ?? ''"
```

**Simplification:** bind the dynamic modifier through a dedicated class input instead of overwriting the entire `class` attribute:

```html
<div
  class="cba-module-footer__status"
  [class.cba-module-footer__status--loading]="status() === 'loading'"
  [class.cba-module-footer__status--loaded]="status() === 'loaded'"
  ...
```

**Verdict:** not recommended. The current `[class]="statusClass() ?? ''"` is concise and avoids six reactive comparisons. Keep as-is.

### 3.2 Template structure

The template is already minimal: one `@if` for the region and two inner `@if` blocks for icon/text. No further simplification needed.

---

## 4. Styles (`module-footer.component.scss`)

### 4.1 Remove redundant reset declarations

**Current state:**
```scss
border-top: none;
box-shadow: none;
```

**Simplification:** delete both lines. They only reset defaults that were never applied by the component or Bootstrap in this context. Removing them keeps the "plain v1" intent without declaring non-existent borders/shadows.

**Impact:** visual output unchanged.

### 4.2 Replace hardcoded `font-size: 14px` with a token if available

**Current state:** `font-size: 14px;`

**Action:** check the token inventory (e.g., `--cba-font-size-sm`, `--cba-text-sm`, or similar). If a matching token exists, use it; if not, keep the pixel value and document it in the spec.

**Impact:** improves token consistency; no functional change.

### 4.3 Review `::ng-deep` usage for reduced-motion

**Current state:**
```scss
@media (prefers-reduced-motion: reduce) {
  :host ::ng-deep .fa-spin {
    animation: none;
  }
}
```

**Simplification:** `::ng-deep` is deprecated in Angular. Two alternatives:
1. Keep it for parity with `ModuleHeader` and accept the deprecation.
2. Disable spinner animation at the component level by conditionally setting `[animation]="null"` (or omitting the input) when `prefers-reduced-motion` matches.

**Recommendation:** keeping `::ng-deep` is the smaller change and matches the existing codebase. If a project-wide `::ng-deep` cleanup is later undertaken, this rule can be moved then. No action required for this task.

---

## 5. Tests (`module-footer.component.spec.ts`)

### 5.1 Add `iconPresent` to `Scenario` and merge icon test

**Current state:** a separate `describe('status icon')` with `it.each(STATUS_SCENARIOS)` checks only icon presence.

**Simplification:** extend `Scenario` with `iconPresent: boolean` and move the icon-presence assertion into the existing default-text table-driven test. Then remove the separate icon describe.

```ts
interface Scenario {
  status: Exclude<ModuleHeaderStatus, null>;
  text: string;
  modifier: string;
  iconPresent: boolean;
}
```

**Impact:** one loop instead of two; same coverage.

### 5.2 Use a minimal host component for pure projection test

**Current state:** `FooterHost` binds both `status` and `statusText` and is reused for the "projected content without status" test.

**Simplification:** for the null-status projection test, create a tiny inline host that only projects content:

```ts
@Component({
  standalone: true,
  imports: [ModuleFooterComponent],
  template: `<cba-module-footer [status]="null"><span class="proj">aux</span></cba-module-footer>`,
})
class MinimalFooterHost {}
```

**Impact:** the test focuses on projection only; `FooterHost` remains for mixed-status/projection cases.

### 5.3 Extract input helpers

**Current state:** tests repeat `fixture.componentRef.setInput('status', status); fixture.detectChanges();`.

**Simplification:** add a helper in the describe scope:

```ts
function setStatus(status: ModuleHeaderStatus): void {
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
}
```

**Impact:** reduces repetition; keeps tests readable.

### 5.4 Coverage retention

All acceptance-criteria cases from the implementation plan must remain covered after simplification:
- default text per status;
- `statusText` override;
- null status without projection;
- projected content with and without status;
- icon presence per status;
- decorative `aria-hidden="true"`;
- modifier class per status;
- live region attributes;
- neutral live region with `statusText` + `status=null`.

---

## 6. Barrel (`index.ts`)

No simplification needed. The named export plus `export type` for `ModuleHeaderStatus` is clean and avoids runtime re-export cycles.

---

## 7. Summary of recommended changes

| Priority | File | Change | Effort | Risk |
| --- | --- | --- | --- | --- |
| High | `module-footer.component.ts` | Merge `STATUS_VISUALS` + `STATUS_TEXTS` into `STATUS_CONFIG` | Small | Low |
| High | `module-footer.component.ts` | Remove unreachable `?? null` / `?? ''` fallbacks | Tiny | Low |
| Medium | `module-footer.component.scss` | Remove `border-top: none; box-shadow: none;` | Tiny | Low |
| Medium | `module-footer.component.scss` | Use token for `font-size: 14px` if one exists | Tiny | Low |
| Low | `module-footer.component.spec.ts` | Merge icon presence into `Scenario` table-driven test | Small | Low |
| Low | `module-footer.component.spec.ts` | Add minimal host for pure projection test + input helper | Small | Low |
| No action | `module-footer.component.ts` | Keep `hasExplicitText` helper | — | — |
| No action | `module-footer.component.scss` | Keep `::ng-deep` reduced-motion rule | — | — |
| No action | `module-footer.component.html` | Keep `[class]` binding | — | — |

---

## 8. Out of scope

- Public API changes.
- New features (footer slot in `ModuleContainer`, toolbar actions, etc.).
- Shared extraction of status config into a new cross-component file.
- Any change to `ModuleHeader` or `ModuleContainer`.
