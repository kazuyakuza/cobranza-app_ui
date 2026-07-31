# Front-end Implementation Verification — `CbaAccordion`

**Task:** Task 1 — Implement `CbaAccordion`  
**Front-end spec:** `.kilo/plans/20260731-phase7-task1-frontend-spec.md`  
**Implementation plan:** `.kilo/plans/20260731-phase7-task1-plan.md`  
**Branch:** `feat/phase7-accordion-spanish-delivery`  
**Date:** 2026-07-31  

---

## 1. Verification summary

The implementation of `CbaAccordion` follows the **Option A** approach documented in the implementation plan: a single host-directive wrapper (`CbaAccordionComponent`) around `NgbAccordionDirective`, with consumers authoring the full ng-bootstrap item markup as projected content. This deviates from the original front-end spec, which proposed a two-component API (`CbaAccordionComponent` + `CbaAccordionItemComponent` + `[cbaAccordionTitle]` projection). The deviation is **intentional and technically required** because ng-bootstrap v21's `NgbAccordionItem._collapse` is a `@ContentChild({ static: true })` query that cannot cross a component view boundary.

All files listed in the implementation plan are present, the build succeeds, unit tests pass, lint passes, and the documentation is consistent with the actual API.

---

## 2. Diffs between spec and implementation

### 2.1 Component architecture

| Spec requirement | Implementation | Status | Notes |
|---|---|---|---|
| `CbaAccordionComponent` + `CbaAccordionItemComponent` with `[cbaAccordionTitle]` slots | Only `CbaAccordionComponent`; no item wrapper, no title directive | **Deviation — acceptable** | Required by ng-bootstrap v21 static `ContentChild` constraints; documented in implementation plan §0 and JSDoc. |
| `CbaAccordionComponent` imports `NgbAccordionModule` | `imports: []` | **Deviation — acceptable** | Template contains only `<ng-content />`; projected directives live in the consumer's view and are imported by the consumer. |
| `public-api.ts` not updated in spec (deferred to Task 3) | `public-api.ts` exports `./components/accordion` | **Deviation — acceptable** | The implementation plan explicitly required this export in §4 so the component is consumable from `@cobranza-apps/ui`. |

### 2.2 Input/output contract

| Spec requirement | Implementation | Status |
|---|---|---|
| `closeOthers` default `false` | default `false` | Match |
| `destroyOnHide` default `false` | default `true` | **Deviation — acceptable**; matches `NgbAccordionConfig` default and implementation plan §2.2. Docs are consistent with `true`. |
| `animation` default `true` | default `true` | Match |
| Container outputs `show`, `shown`, `hide`, `hidden` (`string`) | All four outputs present, re-emit `NgbAccordionDirective` events | Match |
| Item outputs `shown`/`hidden` (`void`) | Not exposed (consumer binds directly on `ngbAccordionItem`) | **Deviation — acceptable**; no item component exists. |

### 2.3 Test strategy

| Spec requirement | Implementation | Status |
|---|---|---|
| Host rendering with three items | Test exists: `applies the cba-accordion host class`; projection count test covers three items | Match |
| Toggle behaviour: `aria-expanded` click cycle | **Missing**; no dedicated click + `aria-expanded` test | Minor gap; `closeOthers` integration test exercises `expand()`/`isExpanded()` and indirectly proves the static `ContentChild` resolves. Acceptable for "minimal wrapper tests". |
| `closeOthers` passthrough | Test exists via `it.each` + integration test | Match |
| Disabled item | Test exists: `reflects the item disabled state on the accordion button` | Match |
| Input forwarding | Test exists: `it.each` over all three inputs with reactive re-forwarding | Match |
| Outputs re-emit | Test exists | Match |

---

## 3. Front-end quality assessment

### 3.1 SCSS token usage

All tokens used in `src/theme/_accordion.scss` are declared in `src/theme/_variables.scss`:

- `--cba-bg-secondary`
- `--cba-bg-tertiary`
- `--cba-border-subtle`
- `--cba-text-primary`
- `--cba-text-muted`
- `--cba-hover`
- `--cba-active`
- `--cba-focus-ring`
- `--cba-radius-md`
- `--cba-space-3`
- `--cba-space-4`

Token usage is correct and consistent with the spec/plan. The global SCSS split (host-only component styles + global `_accordion.scss` for projected surfaces) matches the established pattern used by `_popover.scss`, `_modal.scss`, etc.

### 3.2 Component API completeness

- Selector: `cba-accordion` ✓
- Standalone component ✓
- `ChangeDetectionStrategy.OnPush` ✓
- `hostDirectives: [NgbAccordionDirective]` ✓
- Signal inputs: `closeOthers`, `destroyOnHide`, `animation` ✓
- Signal outputs: `show`, `shown`, `hide`, `hidden` ✓
- Reactive forwarding via `effect()` ✓
- Output re-emission via subscriptions ✓
- Host class `cba-accordion` set ✓

### 3.3 Accessibility

- The wrapper does not override `aria-expanded`, `aria-controls`, `aria-labelledby`, or generated ids; ng-bootstrap owns these.
- Toggle is a native `<button ngbAccordionButton>` (consumer-authored), so it is keyboard focusable and operable with Enter/Space.
- `[disabled]` on `ngbAccordionItem` disables the native button automatically.
- No extraneous `role` is added to the host container.
- Reduced-motion media query disables transitions.

### 3.4 Theme alignment

- `src/theme/_accordion.scss` is included in `src/theme/theme.scss` via `@use 'accordion';`.
- File structure and doc-comment style mirror `_popover.scss`.
- Container surface uses `--cba-bg-secondary`, `--cba-border-subtle`, `--cba-radius-md` — aligned with cards/surfaces.
- Button hover/active/focus/disabled states use the same state tokens as other components.
- Body spacing and typography follow the established 14px / 1.5 line-height pattern.

### 3.5 Documentation accuracy

- `docs/CBA_ACCORDION.md`: selector, imports, inputs/outputs, usage example, theming notes, accessibility, and non-goals all match the implementation.
- `README.md`: component inventory row and documentation link added.
- `docs/USAGE.md`: TOC entry, subsection, imports, inputs/outputs, projection contract, and example added.
- Examples use the actual API (`<div ngbAccordionItem>`, `<button ngbAccordionButton>`, etc.) and not the spec's dropped `[cbaAccordionTitle]` API.

---

## 4. Tooling verification

| Command | Result | Notes |
|---|---|---|
| `npm test -- --testPathPattern=accordion` | 16 suites passed, 146 tests passed | Accordion spec included. |
| `npm run lint` | Passed with no errors | New TS files are clean. |
| `npm run build` | Passed | `dist/fesm2022/cobranza-apps-ui.mjs` exports `CbaAccordionComponent`; `dist/theme/_accordion.scss` present. |

---

## 5. Issues / follow-ups

1. **Missing `aria-expanded` click-cycle test** (low severity). The spec's test strategy §2 included a dedicated toggle-behaviour test clicking the button and asserting `aria-expanded` + body visibility. The implementation omits it in favour of directive-level `expand()`/`isExpanded()` tests. This is acceptable for "minimal wrapper tests" but could be added later for stronger a11y regression coverage.

2. **No custom chevron**. The spec allowed an optional CSS-only themable chevron; the implementation keeps Bootstrap's default SVG. This is documented as a v1 decision in the implementation plan and docs.

3. **No `CbaAccordionItemComponent`**. This is by design (Option A) and fully documented; future maintainers should not reintroduce an item component without first confirming ng-bootstrap removes the static `ContentChild` constraint.

---

## 6. Conclusion

The implementation satisfies the **spirit and acceptance criteria** of Task 1. The architectural deviations from the original front-end spec are justified by ng-bootstrap v21 internals and are explicitly documented in the implementation plan, JSDoc, and component docs. The component is buildable, testable, lint-clean, theme-aligned, and accessible.

**Verdict:** Acceptable with minor follow-up opportunity (optional `aria-expanded` click test).
