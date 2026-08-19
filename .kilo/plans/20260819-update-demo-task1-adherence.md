# Overall Plan Adherence — Update Demo App (Task 1)

**TODO:** `.agent/todos/20260819/20260819-todo-0.md`
**Plan:** `.kilo/plans/20260819-update-demo-task1-plan.md`
**Front-end spec:** `.kilo/plans/20260819-update-demo-frontend-spec.md`
**Front-end verification:** `.kilo/plans/20260819-update-demo-task1-verification.md`
**Implementation branch:** `feat/update-demo-project`
**Date:** 2026-08-19

## Verdict

**Conditional pass.** The implementation fulfills every functional/visual requirement of the TODO and front-end spec, builds successfully, and uses real library components throughout. One unauthorized architectural deviation (`DemoWorkspaceComponent`) must be either reverted or explicitly waived by the caller before task completion. The form-validation fix (commit `e0c4e58`) is sufficient.

## Build Verification (re-run this step)

| Command | Result |
|---------|--------|
| `npm run build:demo` | Pass — bundle generated in `dist/demo` (5.117s) |
| `git status` | Clean working tree on `feat/update-demo-project` |

## Checklist Answers

### 1. Does the implementation fulfill the TODO requirements?

**Yes — all 14 TODO items are satisfied visually and behaviorally.**

| TODO requirement | Status |
|------------------|--------|
| Header bar: back btn (English "Back", primary), brand label, centered search ~50%, notifications + profile icons | Pass |
| Workspace row 1: expanded 100% with header + footer | Pass |
| Workspace row 2: collapsed 100% | Pass |
| Workspace row 3: two expanded 50% with header + footer | Pass |
| Workspace row 4: two collapsed 50% with header + footer | Pass |
| Workspace row 5: expanded 50% with empty space at right | Pass |
| Workspace row 6: collapsed 50% with empty space at right | Pass |
| Token color grid: color, name, tag, hex | Pass (20 tokens, exact order/values) |
| Button section: variants × bkg × status with name/tag/status/bkg | Pass (5 × 3 × 3, caption format matches spec §7.5) |
| Pills section: same as buttons | Pass |
| Sizes section: btn/pill size variants | Pass (sm/md) |
| Predefined icons section | Pass (15 icons, English labels + aria-labels) |
| Texts/fonts/labels over bkg/status | Pass (4 surfaces, type scale, status colors only on light) |
| Complete table example | Pass (header, body, selected row, status badges) |
| Navigation items example | Pass (normal/selected/disabled, ARIA) |
| Inputs variants over bkg | Pass (4 surfaces, input/select/datepicker) |
| Form example | Pass after fix `e0c4e58` (see §3) |
| Footer centered | Pass |
| English only | Pass (brand + sample company names excepted per spec) |

### 2. Are the deviations from the plan acceptable?

Three deviations identified. Acceptability assessed below.

#### Deviation A — `DemoWorkspaceComponent` created (NOT acceptable without caller waiver)

**What happened:** The implementer extracted the workspace markup (plan step 12, the `<main class="workspace">` block with 6 rows) out of `app.component.html` into a new `DemoWorkspaceComponent` (`projects/demo/src/app/components/demo-workspace/`), with separate `demo-workspace.component.html` and `demo-workspace.component.scss` files. `AppComponent` now renders `<demo-workspace />` and imports `DemoWorkspaceComponent`.

**Why it is a deviation:**
- Plan step 12 explicitly places the workspace markup inline in `app.component.html` inside `<main class="workspace">`.
- Plan decision A5 mandates inline `template` + inline `styles` for ALL new demo components. `DemoWorkspaceComponent` uses `templateUrl` + `styleUrl` (separate files), violating A5.
- `DemoWorkspaceComponent` is NOT listed in the plan's component breakdown (steps 3–10) nor in the front-end spec §6 component list.
- The implementer is under the 75% restriction, which hard-blocks creating new components not in the plan (architectural decision).

**Impact:**
- Visual output: identical (verification §3 confirms; workspace markup preserved verbatim in `demo-workspace.component.html`).
- Line-count compliance: the extraction helps `app.component.html` stay lean (144 lines vs. ~240 if inlined). Inlining would still be under the 200-line hard limit but above the 125-line ideal.
- Styles: `.workspace`, `.workspace__row`, `.workspace__row--single-50`, `.demo-actions` were moved from `app.component.scss` to `demo-workspace.component.scss`. The split is self-consistent (no duplicate/orphan styles in `app.component.scss`).

**Required action:** One of:
- **Option A (strict plan adherence — recommended):** Revert the extraction. Remove the 3 `demo-workspace` files, remove the `DemoWorkspaceComponent` import from `app.component.ts`, move the workspace markup back inline into `app.component.html` (replacing `<demo-workspace />`), and restore the `.workspace*` / `.demo-actions` styles to `app.component.scss`. Re-run `npm run build:demo`.
- **Option B (caller waiver):** Caller explicitly approves the deviation as acceptable and updates the plan/spec to record the new component. Without this waiver, the deviation stands as a 75%-restriction violation.

This decision belongs to the caller, not the implementer.

#### Deviation B — `AppComponent` import surface differs from spec (acceptable)

**What happened:** `AppComponent` imports `CbaButtonComponent`, `CbaCardComponent`, `CbaDatepickerComponent`, `CbaInputComponent`, `CbaSelectComponent` only. The spec §6 list also names `CbaBadgeComponent`, `CbaModuleFooterComponent`, `ModuleContainerComponent`, `ModuleHeaderComponent`, `FaIconComponent` — these are imported in the child components that actually use them.

**Why acceptable:** Angular standalone `imports` must be used by the component's own template; importing unused components is a compile error / lint violation. The review file (`20260819-update-demo-task1-review.md` §"Acceptable deviations") classified this as build-required. No functional or visual impact.

**Required action:** None.

#### Deviation C — Lint script does not cover demo code (acceptable, out of scope)

**What happened:** `npm run lint` targets `src/**/*.ts` only; demo code is not linted by the project script.

**Why acceptable:** This is a pre-existing condition of `package.json`, unrelated to the demo content task. Extending the lint script would modify a file outside the `projects/demo/` scope boundary set by the plan ("modify ONLY files inside `projects/demo/`. Do NOT touch `src/`"). Per-component TS diagnostics on all demo files showed no errors (verification §Lint).

**Required action:** None for this task. Recommend a separate future task to add a `lint:demo` script.

### 3. Is the form fix (commit `e0c4e58`) sufficient to address the verification failure?

**Yes — sufficient for the visible acceptance criterion.**

The fix added the two missing `error` bindings to `app.component.html`:

```html
<cba-input label="Customer name" hint="Full business name." error="Customer name is required." [(ngModel)]="formModel.customerName" />
<cba-input label="Email" hint="Billing contact email." type="email" error="Enter a valid email." [(ngModel)]="formModel.email" />
```

- Error text matches spec §7.13 exactly: "Customer name is required." and "Enter a valid email." ✓
- Build passes after the fix. ✓

**On the missing `[required]` binding:** The verification report also flagged the absence of a `[required]` binding on the customer-name input. This is **infeasible within the task scope**:
- `CbaInputComponent` (verified in `src/components/input/cba-input.component.ts` and its base `CbaFieldControlValueAccessor` / `CbaFieldComponent`) exposes inputs: `label`, `hint`, `error`, `valid`, `readonly`, `disabled`, `placeholder`, `value`, `type`. There is **no `required` input**.
- The plan's scope boundary forbids modifying `src/` (library source).
- Binding `[required]` on `<cba-input>` would either target a non-existent input or require library changes to support `NG_VALIDATORS` forwarding — both out of scope.
- The spec wording "required error 'Customer name is required.'" is satisfied by the `error` input text, which communicates the required nature of the field to the viewer.

Conclusion: the `error`-only fix is the maximum feasible correction within scope and satisfies the visible acceptance criterion. The `[required]` binding is recorded as an infeasible-within-scope item, not a remaining defect.

### 4. Should `DemoWorkspaceComponent` be reverted, or is it an acceptable deviation?

**Recommend revert (Option A in §2-Deviation A) unless the caller explicitly waives.**

Rationale:
- The 75% restriction is a hard rule; the implementer cannot make architectural decisions, and creating an unplanned component is exactly that.
- The plan encoded the inline-workspace decision explicitly (step 12) and the inline-template/styles decision for new components (A5). Both are violated.
- The verification report classified the extraction as an "unauthorized architectural refactor."
- Reverting is low-risk: the workspace markup already exists verbatim in `demo-workspace.component.html` and can be moved back with a copy; the styles already exist in `demo-workspace.component.scss` and can be moved back to `app.component.scss`. Inlined `app.component.html` would be ~240 lines (~197 content lines), under the 200-line hard limit.

The caller may waive if they judge the visual-identity + line-count benefit outweighs the process violation. That is a caller decision.

### 5. Any other concerns before task completion?

1. **Shared interfaces location:** Spec §5 lists shared interfaces (`SurfaceTextItem`, `TextSurface`, `TableRow`, `NavItem`) in `AppComponent`; implementation defines them inside their respective child components. The review classified this as Low severity (no runtime impact). Acceptable; no action required.
2. **`demo-table` used twice:** Row 1 of the workspace and section 10 both render `<demo-table />` with the same fixed data. The plan explicitly permits this (step 12 notes). No action.
3. **No `src/` modifications:** Confirmed clean — `git status -- src/` shows no changes. Scope boundary respected.
4. **Commits:** History is logical and granular (`chore(demo): switch lang`, `feat(demo): ...` per component, `fix(demo): ...` for build errors and form fix, `refactor(demo): apply code review and simplification fixes`). Commit messages follow repo convention.

## Summary of Required Actions

| # | Action | Owner | Blocks completion? |
|---|--------|-------|--------------------|
| 1 | Revert `DemoWorkspaceComponent` (Option A) OR obtain caller waiver (Option B) | Caller decision → implementer executes revert if Option A | Yes — must be resolved before 4.6 |

No other blocking actions. The form fix is accepted as sufficient. Deviations B and C are accepted as non-blocking.

## Final Verdict

**Conditional pass.** Proceed to task completion (4.6) only after the caller resolves Required Action #1.
