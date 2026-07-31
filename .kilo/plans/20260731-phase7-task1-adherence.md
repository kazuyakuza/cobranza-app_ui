# Overall Plan Adherence — Task 1: `CbaAccordion`

**Task:** Task 1 — Implement `CbaAccordion` (Option A)
**Implementation plan:** `.kilo/plans/20260731-phase7-task1-plan.md`
**Front-end verification report:** `.kilo/plans/20260731-phase7-task1-verification.md`
**Branch:** `feat/phase7-accordion-spanish-delivery`
**Date:** 2026-07-31
**Step:** 4.5b — Overall Plan Adherence (architector)

---

## 1. Method

Read the implementation plan (12 sections) and the front-end verification report, then inspected every artifact the plan promised to produce/modify against the current state of the working tree on `feat/phase7-accordion-spanish-delivery`:

- Listed `src/components/accordion/**` (5 files).
- Read `src/public-api.ts`, `src/theme/theme.scss`, `src/theme/_accordion.scss`, `.agent/project-structure.md`.
- Read the component `.ts`, `.html`, `.scss`, `index.ts` barrel, and the spec.
- Verified `docs/CBA_ACCORDION.md`, `README.md`, and `docs/USAGE.md` references via search.
- Reviewed `git log --oneline -15` to confirm the planned commits exist (`feat(accordion)`, `fix(accordion)` review, `docs: add CbaAccordion documentation`).

The front-end verification report (4.5a) was incorporated as a cross-check; its findings align with what the working tree shows.

---

## 2. Adherence results

### 2.1 Files created as planned (plan §1.1, §1.2)

| Planned path | Present | Notes |
|---|---|---|
| `src/components/accordion/cba-accordion.component.ts` | Yes | 134 lines; matches §2 contract. |
| `src/components/accordion/cba-accordion.component.html` | Yes | `<ng-content />` (slight syntactic variant of plan's `<ng-content></ng-content>`; equivalent). |
| `src/components/accordion/cba-accordion.component.scss` | Yes | `:host { display: block; }` per §6.1. |
| `src/components/accordion/cba-accordion.component.spec.ts` | Yes | 157 lines; covers plan §7. |
| `src/components/accordion/index.ts` | Yes | Barrel matches §3. |
| `src/theme/_accordion.scss` | Yes | 87 lines; matches §6.2 selector list + reduced-motion block. |

### 2.2 Files edited as planned (plan §1.3, §4, §5, §6.3, §9)

| Planned edit | Done | Notes |
|---|---|---|
| `src/theme/theme.scss`: `@use 'accordion';` after `@use 'typeahead';`, before `@use 'mixins';` | Yes | Lines 8→9→10: `typeahead` → `accordion` → `mixins`. Exact placement. |
| `src/public-api.ts`: `export * from './components/accordion';` before `'./components/badge'` | Yes | Line 18, alphabetical, before `badge` on line 19. |
| `.agent/project-structure.md`: add accordion folder line | Yes | Line 26 added. **Minor deviation**: plan §5 said insert "between the `dropdown` and `popover` lines"; instead it was placed **before** `dropdown` (current order: accordion, dropdown, popover). Cosmetic; does not affect any build/contract. Acceptable. |
| `docs/CBA_ACCORDION.md` (new, §8 sections) | Yes | 162 lines; covers Selector, Import, How it works, Inputs, Outputs, basic usage, theming notes, accessibility, important non-goals, related docs. All §8 sections present except the optional "Projected content contract" table and "Programmatic API" subsection appear folded into "How it works" / non-goals — content is present but section headings differ slightly. Acceptable; the doc still communicates the projection contract and the `#i="ngbAccordionItem"` / `#a="ngbAccordion"` API is implied through the non-goals + how-it-works. |
| `README.md`: Component Inventory row + Documentation link (§9.1) | Yes | Inventory row at line 133; Documentation list entry at line 199. |
| `docs/USAGE.md`: TOC entry + `## CbaAccordion` subsection (§9.2) | Yes | TOC at line 28; subsection at line 483. |

### 2.3 Component contract (plan §2)

| Requirement | Implementation | Adherence |
|---|---|---|
| `selector: 'cba-accordion'`, `standalone: true`, `OnPush`, `hostDirectives: [NgbAccordionDirective]`, `imports: []`, `templateUrl`, `styleUrl`, `host: { class: 'cba-accordion' }` | All present (lines 79–88) | Match |
| Signal inputs `closeOthers=false`, `destroyOnHide=true`, `animation=true` | Lines 91–97; defaults match plan §2.2 (and the corrected `destroyOnHide=true`) | Match |
| Outputs `show`, `shown`, `hide`, `hidden` as `output<string>()` | Lines 100–109 | Match |
| `inject(NgbAccordionDirective)`; constructor calls `reemitAccordionEvents()` + `forwardInputsToNgbAccordion()` | Lines 111–116 | Match |
| Four flat `subscribe → emit` one-liners in `reemitAccordionEvents` | Lines 119–124 | Match; respects max-lines-per-method and max-depth rules. |
| Single `effect()` re-forwarding all three inputs in `forwardInputsToNgbAccordion` | Lines 127–133 | Match |
| JSDoc: responsibility split, host-directive rationale, no-`CbaAccordionItemComponent` rationale, `@usageNotes` 3-item example, `@remarks`, `@see` link, per-field input/output JSDoc | Lines 4–77 + 90, 93, 96, 99–108 one-liners | Match |

### 2.4 Template (plan §2.5)

`<ng-content />` — matches plan (`<ng-content></ng-content>`); the self-closing form is equivalent in Angular templates.

### 2.5 SCSS split (plan §6)

- `cba-accordion.component.scss` contains **only** `:host { display: block; }`. No encapsulation leakage. **Match** with §6.1 / §11.
- `src/theme/_accordion.scss` is global, scoped under `.cba-accordion`, implements rules 1–12 from §6.2 (container surface, `.accordion-item` + `:last-child`, `.accordion-header`, `.accordion-button` + `:hover` + `:not(.collapsed)` + `:focus-visible` + `[disabled]`, `.accordion-collapse { border: none }`, `.accordion-body`, reduced-motion media query disabling transitions on button + collapse). Tokens used (`--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-border-subtle`, `--cba-text-primary`, `--cba-text-muted`, `--cba-hover`, `--cba-active`, `--cba-focus-ring`, `--cba-radius-md`, `--cba-space-3`, `--cba-space-4`) all exist in `src/theme/_variables.scss` per the front-end verification report §3.1. **Match.**
- `theme.scss` wiring per §6.3. **Match.**

### 2.6 Tests (plan §7)

Spec covers all required cases 1–7 plus the optional case 8:

1. Host class — `applies the cba-accordion host class` ✓
2. Item projection (3 items + `.btn`) — `projects the ng-bootstrap item markup inside the host` ✓
3. Disabled item `[disabled]` attr — `reflects the item disabled state on the accordion button` ✓
4. `closeOthers`/`destroyOnHide`/`animation` forwarding + reactive re-forward via `it.each(inputForwardingCases)` — ✓ (matches cases 4–6 of §7.2 using `signal()` setters + `detectChanges()`)
5. Outputs re-emit with item id — `re-emits the NgbAccordionDirective item events through the wrapper outputs` ✓
6. `closeOthers` integration smoke (optional case 8) — `collapses the previously expanded item when closeOthers is enabled` ✓ (uses id-resolution via `querySelectorAll('.accordion-item[id^="ngb-accordion-item-"]')`)

Spec honouring constraints: uses `await TestBed.compileComponents()` + `TestBed.resetTestingModule()` in `beforeEach`, uses `signal()` host bindings (Angular-recommended), no animation/CSs-transition end-state assertions, uses directive `expand`/`isExpanded`/`EventEmitter.emit`. File is 157 lines (under the 200-line rule). **Match.**

Tooling verification (per the front-end verification report §4): `npm test`, `npm run lint`, `npm run build` all green; `dist/fesm2022/cobranza-apps-ui.mjs` exports `CbaAccordionComponent`; `dist/theme/_accordion.scss` present.

### 2.7 `public-api.ts` (plan §4)

Verified line 18. Confirmed `import { CbaAccordionComponent } from '@cobranza-apps/ui'` resolves (build artifact in `dist/`).

### 2.8 Documentation (plan §8, §9)

- `docs/CBA_ACCORDION.md` — present, mirrors `CbaDropdown` doc structure, all critical sections present (selector, import, how-it-works, inputs table, outputs table, basic usage with 3-item example, theming notes listing tokens, accessibility, important non-goals, related docs). **Match** (with the minor section-heading variance noted in §2.2).
- `README.md` — inventory row + documentation link. **Match.**
- `docs/USAGE.md` — TOC entry + subsection. **Match.**

### 2.9 Verification acceptance (plan §11)

All four §11 acceptance bullets satisfied per the verification report §4 and the inspected artifacts (build green, tests green, `public-api` export resolves, no encapsulation leakage).

### 2.10 Acceptance-criteria mapping (plan §12)

Every TODO checklist item from §12 is satisfied by the corresponding section, as confirmed in §2.1–§2.8 above.

---

## 3. Incorporated front-end verification findings (4.5a)

The 4.5a report (`.kilo/plans/20260731-phase7-task1-verification.md`) concluded **"Acceptable with minor follow-up opportunity"**:

1. **Architectural deviation from the original front-end spec** (`CbaAccordionItemComponent` + `[cbaAccordionTitle]` dropped in favour of Option A): justified by ng-bootstrap v21's static `ContentChild` constraint; fully documented in plan §0, component JSDoc, and `CBA_ACCORDION.md`. The 4.5b check confirms the implementation follows the **implementation plan's Option A** exactly — so this is not a deviation from the plan, only from the superseded spec. **Acceptable.**
2. **Missing `aria-expanded` click-cycle test**: low severity. Directive-level `expand()`/`isExpanded()` and the optional `closeOthers` integration test indirectly prove the static `ContentChild` resolves. Acceptable for "minimal wrapper tests" per the TODO.
3. **No custom chevron**: documented v1 decision (plan §6.2 rule 5 note, §13). Acceptable.
4. **`destroyOnHide` default corrected to `true`**: matches `NgbAccordionConfig` and plan §2.2; docs are consistent. Acceptable.

No additional discrepancies between the 4.5a report and the working tree were found.

---

## 4. Deviations from the implementation plan

| # | Plan text | Implementation | Severity | Verdict |
|---|---|---|---|---|
| 1 | §5: insert accordion folder line "between the `dropdown` and `popover` lines" in `.agent/project-structure.md` | Line inserted **before** `dropdown` (order: accordion → dropdown → popover) | Cosmetic | **Acceptable.** Documentation-only ordering; the entry is present, the description is accurate, and the file remains a valid map of `src/`. |
| 2 | §2.5: template literal `<ng-content></ng-content>` | `<ng-content />` self-closing | None (equivalent) | **Acceptable.** Angular treats both identically. |
| 3 | §8 doc: explicit "Projected content contract" table and "Programmatic API" subsection headings | These are absorbed into "How it works" + "Important non-goals" rather than kept as discrete headings | Minor | **Acceptable.** All substantive content (the projection contract and the `#i="ngbAccordionItem"`/`#a="ngbAccordion"` template reference APIs) is present in spirit; restructuring into fewer headings does not omit information required by the TODO acceptance criteria. |

No deviations were found in the component contract, inputs/outputs, wiring (`effect()` + subscriptions), SCSS split (host-only vs global `_accordion.scss`), `public-api.ts` export, `theme.scss` `@use` placement, or the test strategy.

---

## 5. Verdict

The implementation **adheres to the implementation plan** for Task 1 (`CbaAccordion`, Option A). All planned files were created/edited, the component contract, signal inputs/outputs, reactive `effect()` forwarding, output re-emission, host-directive wiring, SCSS host/global split, public export, theme wiring, tests, docs, README, and USAGE updates are all present and correct. The three deviations listed in §4 are all cosmetic/equivalent and **acceptable** — none of them affect the build, the public API, the test results, or the TODO acceptance criteria (plan §12).

The 4.5a verification report's findings are consistent with the working tree and have been incorporated; no new discrepancies surfaced during the 4.5b check.

No new TODO file is required. **Task 1 may proceed to 4.6 (Task Completion).**