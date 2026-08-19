# Phase 12 — Part A: Host Encapsulation Audit & Fix — Implementation Plan

## 0. Reference

- TODO task: `.agent/todos/20260818/20260818-todo-0.md` → Part A (lines 30–71).
- Front-end spec (input): `.kilo/plans/20260818-phase12-frontend-spec-partA.md`.
- Scope of this plan: **Part A only** (encapsulation audit & fix). Parts B/C are out of scope.

## 1. High-level approach

Angular emulated `ViewEncapsulation` puts `_nghost-*` on the component host and
`_ngcontent-*` on internal elements. A SCSS rule `.modifier .child` compiles to
`.modifier[_ngcontent-*] .child[_ngcontent-*]`, which never matches when
`modifier` is bound on the host. Fix pattern: rewrite every such rule as
`:host(.modifier) .child`. Keep emulated encapsulation. No `::ng-deep`.

The 5 components with broken selectors (per spec §4) are, in execution order:

1. `CbaButton` (largest, highest visual impact — primary button is the trigger bug).
2. `CbaInput`
3. `CbaSelect`
4. `CbaDatepicker`
5. `CbaTypeahead`

Strategy: fix `CbaButton` first, build + lint + test + compiled-CSS review, confirm
the primary-button selector is now `:host(...)`-wrapped, then fix the remaining four
form controls in one batch and re-run all gates. Finally extend unit tests with
missing host-class assertions, add the authoring note to docs, bump version +
changelog, commit.

## 2. Pre-flight (no code changes)

1. Confirm clean tree: `git status`. Expected: only the new spec file
   `.kilo/plans/20260818-phase12-frontend-spec-partA.md` untracked (created by
   step 4.1a). Do NOT commit it as part of this plan; the implementer will
   handle commits per the critical workflow.
2. Confirm working directory: `C:\projects\cobranza-app\front\ui`.
3. Baseline gates (capture current state for comparison):
   - `npm run lint`
   - `npm run test`
   - `npm run build`
   Record pass/fail. If any already fails, stop and return to caller.

## 3. Change order & exact edits

All edits below use `vscode-mcp-server_replace_lines_code` (preferred per
`.kilo/rules/tool-selection-priority.md`). Line numbers are 1-based and match the
current file contents read during planning.

### 3.1 CbaButton — `src/components/button/cba-button.component.scss`

**Batch B1: size modifiers (lines 43–52).**

Before (lines 44–52):
```scss
.cba-button--sm .cba-button__control {
  padding: var(--cba-space-1) var(--cba-space-3);
  font-size: var(--cba-font-size-small);
}

.cba-button--md .cba-button__control {
  padding: var(--cba-space-2) var(--cba-space-4);
  font-size: var(--cba-font-size-body);
}
```
After:
```scss
:host(.cba-button--sm) .cba-button__control {
  padding: var(--cba-space-1) var(--cba-space-3);
  font-size: var(--cba-font-size-small);
}

:host(.cba-button--md) .cba-button__control {
  padding: var(--cba-space-2) var(--cba-space-4);
  font-size: var(--cba-font-size-body);
}
```

**Batch B2: variant rules (lines 54–92).** Five separate `replace_lines` calls
(or one contiguous replace of lines 55–92) converting each leading
`.cba-button--<variant> .cba-button__control` → `:host(.cba-button--<variant>) .cba-button__control`.
Bodies unchanged.

- Line 55: `.cba-button--primary .cba-button__control {` → `:host(.cba-button--primary) .cba-button__control {`
- Line 59: `.cba-button--secondary .cba-button__control {` → `:host(.cba-button--secondary) .cba-button__control {`
- Line 73: `.cba-button--ghost .cba-button__control {` → `:host(.cba-button--ghost) .cba-button__control {`
- Line 86: `.cba-button--danger .cba-button__control {` → `:host(.cba-button--danger) .cba-button__control {`
- Line 90: `.cba-button--success .cba-button__control {` → `:host(.cba-button--success) .cba-button__control {`

**Batch B3: disabled/loading grouped selector (lines 94–99).**

Before (lines 95–99):
```scss
.cba-button--disabled .cba-button__control,
.cba-button--loading .cba-button__control {
  cursor: not-allowed;
  opacity: 0.6;
}
```
After:
```scss
:host(.cba-button--disabled) .cba-button__control,
:host(.cba-button--loading) .cba-button__control {
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Batch B4: truncate (lines 121–130).**

Before (lines 122–130):
```scss
.cba-button--truncate .cba-button__control {
  min-width: 0;
}

.cba-button--truncate .cba-button__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```
After:
```scss
:host(.cba-button--truncate) .cba-button__control {
  min-width: 0;
}

:host(.cba-button--truncate) .cba-button__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Batch B5: icon-only (lines 132–148).** Five replacements:

- Line 133: `.cba-button--icon-only .cba-button__control {` → `:host(.cba-button--icon-only) .cba-button__control {`
- Line 138: `.cba-button--icon-only.cba-button--sm .cba-button__control {` → `:host(.cba-button--icon-only.cba-button--sm) .cba-button__control {`
- Line 142: `.cba-button--icon-only.cba-button--md .cba-button__control {` → `:host(.cba-button--icon-only.cba-button--md) .cba-button__control {`
- Line 146: `.cba-button--icon-only .cba-button__label {` → `:host(.cba-button--icon-only) .cba-button__label {`

**Batch B6: block (lines 150–161).** Keep line 151 `:host(.cba-button--block) { ... }`
as-is (already correct). Fix the two descendant rules:

- Line 156: `.cba-button--block .cba-button__control {` → `:host(.cba-button--block) .cba-button__control {`
- Line 160: `.cba-button--block.cba-button--ghost .cba-button__control {` → `:host(.cba-button--block.cba-button--ghost) .cba-button__control {`

**Unchanged (do NOT touch):**
- Lines 1–3 `:host { display: inline-block; }`
- Lines 5–22 `.cba-button__control { ... }` (base control, no host modifier)
- Lines 24–41 `@mixin cba-solid-button` (mixin definition)
- Lines 101–109 `.cba-button__icon`, `.cba-button__label` (internal element base styles)
- Lines 111–119 `@media (prefers-reduced-motion)` block (no host modifier; the
  existing `:host ::ng-deep .fa-spin` is pre-existing and out of scope for Part A
  — do not introduce new `::ng-deep`, do not remove this one)
- Lines 151–154 `:host(.cba-button--block) { ... }` (already correct)

**After B1–B6, run gate checkpoint G1 (see §4).** Do not proceed to other
components until G1 passes.

### 3.2 CbaInput — `src/components/input/cba-input.component.scss`

Before (lines 11–17):
```scss
.cba-input--disabled .cba-input__control {
  cursor: not-allowed;
}

.cba-input--readonly .cba-input__control {
  cursor: default;
}
```
After:
```scss
:host(.cba-input--disabled) .cba-input__control {
  cursor: not-allowed;
}

:host(.cba-input--readonly) .cba-input__control {
  cursor: default;
}
```
Leave lines 1–9 (`@use`, `:host`, `.cba-input__control` `@extend`) untouched.

### 3.3 CbaSelect — `src/components/select/cba-select.component.scss`

Before (lines 11–17):
```scss
.cba-select--disabled .cba-select__control {
  cursor: not-allowed;
}

.cba-select--readonly .cba-select__control {
  cursor: default;
}
```
After:
```scss
:host(.cba-select--disabled) .cba-select__control {
  cursor: not-allowed;
}

:host(.cba-select--readonly) .cba-select__control {
  cursor: default;
}
```
Leave lines 1–9 untouched.

### 3.4 CbaDatepicker — `src/components/datepicker/cba-datepicker.component.scss`

Before (lines 42–53):
```scss
.cba-datepicker--disabled .cba-datepicker__toggle,
.cba-datepicker--disabled .cba-datepicker__control {
  cursor: not-allowed;
}

.cba-datepicker--readonly .cba-datepicker__control {
  cursor: default;
}

.cba-datepicker--readonly .cba-datepicker__toggle {
  cursor: pointer;
}
```
After:
```scss
:host(.cba-datepicker--disabled) .cba-datepicker__toggle,
:host(.cba-datepicker--disabled) .cba-datepicker__control {
  cursor: not-allowed;
}

:host(.cba-datepicker--readonly) .cba-datepicker__control {
  cursor: default;
}

:host(.cba-datepicker--readonly) .cba-datepicker__toggle {
  cursor: pointer;
}
```
Leave lines 1–40 (`@use`, `:host`, wrapper/control/toggle base styles) untouched.

### 3.5 CbaTypeahead — `src/components/typeahead/cba-typeahead.component.scss`

Before (lines 11–13):
```scss
.cba-typeahead--disabled .cba-typeahead__control {
  cursor: not-allowed;
}
```
After:
```scss
:host(.cba-typeahead--disabled) .cba-typeahead__control {
  cursor: not-allowed;
}
```
Leave lines 1–9 untouched.

## 4. Gate checkpoints (terminal commands)

Run each as a **single** command (no chaining, per tool-selection rule). All
commands run from `C:\projects\cobranza-app\front\ui`.

### G1 — after CbaButton only
1. `npm run build`
2. `npm run lint`
3. `npm run test`

### G2 — after CbaInput + CbaSelect + CbaDatepicker + CbaTypeahead
1. `npm run build`
2. `npm run lint`
3. `npm run test`

### G3 — final, after unit-test additions + docs + version/changelog
1. `npm run build`
2. `npm run lint`
3. `npm run test`

On any failure: stop, do not patch around it, return to caller with the failure
output.

## 5. Compiled CSS regression review

After G1 and again after G2/G3, inspect emitted CSS. ng-packagr outputs component
CSS at `dist/components/<name>/<name>.component.css` (`ng-package.json` `dest:
./dist`). Use `grep` (the dedicated Grep tool) — not `bash` — to search.

### 5.1 Positive checks (must find matches)

Search `dist/` for `:host(`-wrapped rules. Expected present after fix:

- `:host(.cba-button--primary)` … `.cba-button__control`
- `:host(.cba-button--danger)`, `:host(.cba-button--success)`, `:host(.cba-button--secondary)`, `:host(.cba-button--ghost)`
- `:host(.cba-button--sm)`, `:host(.cba-button--md)`
- `:host(.cba-button--disabled)`, `:host(.cba-button--loading)`
- `:host(.cba-button--truncate)`
- `:host(.cba-button--icon-only)`, `:host(.cba-button--icon-only.cba-button--sm)`, `:host(.cba-button--icon-only.cba-button--md)`
- `:host(.cba-button--block)`, `:host(.cba-button--block.cba-button--ghost)`
- `:host(.cba-input--disabled)`, `:host(.cba-input--readonly)`
- `:host(.cba-select--disabled)`, `:host(.cba-select--readonly)`
- `:host(.cba-datepicker--disabled)`, `:host(.cba-datepicker--readonly)`
- `:host(.cba-typeahead--disabled)`

### 5.2 Negative checks (must find ZERO matches)

Search `dist/**/*.css` for bare descendant host-modifier selectors. Regex pattern
(per spec §8.2), applied with the Grep tool:

```
\.cba-(button|input|select|datepicker|typeahead)--[a-z-]+\s+\.cba-(button|input|select|datepicker|typeahead)__
```

This must return **no** results across all emitted component CSS. (It will still
match internal-element-to-internal-element rules where the first class is NOT a
host modifier — but the alternation above is restricted to known host modifier
prefixes, so any hit indicates a missed fix.)

Additionally grep for any newly introduced `::ng-deep` in the five edited SCSS
files (should be none):
```
::ng-deep
```
in `src/components/{button,input,select,datepicker,typeahead}/*.scss` — only the
pre-existing `:host ::ng-deep .fa-spin` in `cba-button.component.scss` line 116 is
allowed; no new occurrences.

Record the grep results in the implementation summary.

## 6. Unit-test additions

Existing specs already cover most host-class assertions (verified during
planning):

- `cba-button.component.spec.ts`: variant, size (sm/md), truncate, iconOnly,
  block, and disabled/loading indirectly via no-emit. ✅ already present.
- `cba-input.component.spec.ts` line 110–118: `disabled` → `cba-input--disabled`
  on host. ✅ present. **Missing:** `readonly` host class assertion.
- `cba-select.component.spec.ts` line 113–120: `disabled` →
  `cba-select--disabled` on host. ✅ present. **Missing:** `readonly` host class.
- `cba-datepicker.component.spec.ts` line 84–93: disables input+toggle but
  **does not assert** `cba-datepicker--disabled` host class, and has **no**
  `readonly` host-class test.
- `cba-typeahead.component.spec.ts` line 76–82: `disabled` →
  `cba-typeahead--disabled` on host. ✅ present.

Add the following assertions only (do not rewrite existing tests; append within
the existing `describe` blocks). Reuse the `hostEl` helper from
`src/components/testing/test-helpers.ts` where the spec already imports it;
otherwise use `fixture.nativeElement.classList` (the pattern already used in
input/select/typeahead specs).

### 6.1 `cba-input.component.spec.ts` — append

```ts
it('applies the readonly host modifier class when readonly', () => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [CbaInputComponent] });
  const f = TestBed.createComponent(CbaInputComponent);
  f.componentRef.setInput('readonly', true);
  f.detectChanges();
  expect(f.nativeElement.classList.contains('cba-input--readonly')).toBe(true);
});
```

### 6.2 `cba-select.component.spec.ts` — append

```ts
it('applies the readonly host modifier class when readonly', () => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [CbaSelectComponent] });
  const f = TestBed.createComponent(CbaSelectComponent);
  f.componentRef.setInput('readonly', true);
  f.detectChanges();
  expect(f.nativeElement.classList.contains('cba-select--readonly')).toBe(true);
});
```

### 6.3 `cba-datepicker.component.spec.ts` — append two assertions

```ts
it('applies the disabled host modifier class when disabled', () => {
  fixture = TestBed.createComponent(CbaDatepickerComponent);
  fixture.componentRef.setInput('disabled', true);
  fixture.detectChanges();
  expect(fixture.nativeElement.classList.contains('cba-datepicker--disabled')).toBe(true);
});

it('applies the readonly host modifier class when readonly', () => {
  fixture = TestBed.createComponent(CbaDatepickerComponent);
  fixture.componentRef.setInput('readonly', true);
  fixture.detectChanges();
  expect(fixture.nativeElement.classList.contains('cba-datepicker--readonly')).toBe(true);
});
```

### 6.4 `cba-typeahead.component.spec.ts`

No new test needed — `disabled` host class already asserted. `--error` has no
SCSS selector (spec §3.5), so no host-class CSS regression is possible; skip.

### 6.5 `cba-button.component.spec.ts`

No new test needed — all host modifiers already asserted. Optionally add an
explicit `loading` host-class assertion to mirror the no-emit test, but this is
optional and not required for acceptance. Skip to keep scope tight.

Run `npm run test` after additions (this is part of G3).

## 7. Documentation note (acceptance criterion 9)

Per spec §9, add the authoring rule. The repo already has per-component docs under
`docs/CBA_*.md` and a top-level `AGENTS.md` (only 20 lines, mostly links). Best
placement: a new short section in `AGENTS.md` referencing the rule, plus a brief
note in `docs/CBA_BUTTON.md` (the canonical example) since the button is the
trigger component.

### 7.1 `AGENTS.md` — append a new section after the Rules link (after line 20)

```markdown
## Component authoring: host modifiers

When a modifier class is bound to the component host via `host: { '[class.foo--bar]': ... }`
or `@HostBinding('class.foo--bar')`, style internal children with `:host(.foo--bar) .child { }`.
Plain descendant selectors such as `.foo--bar .child { }` are broken under Angular emulated
encapsulation: the modifier lands on the `_nghost-*` element while the selector compiles to
`[_ngcontent-*]`, so it never matches. See `docs/CBA_BUTTON.md` for the canonical example.
```

### 7.2 `docs/CBA_BUTTON.md` — append a short "Host modifiers" note at the end

Read the file first (do not assume content), then append:

```markdown
## Host modifiers and encapsulation

`<cba-button>` binds variant/size/state/layout modifier classes on its host
(`cba-button--primary`, `--sm`, `--disabled`, etc.). The component SCSS therefore
uses `:host(.cba-button--primary) .cba-button__control { … }` rather than
`.cba-button--primary .cba-button__control { … }`. Under Angular emulated
encapsulation the host carries `_nghost-*` while internals carry `_ngcontent-*`;
a bare descendant selector compiles to `[_ngcontent-*]` and never matches the
host. Apply the same `:host(.modifier)` pattern to any new host-bound modifier.
```

Do not edit other component docs unless they currently contain a wrong
`.modifier .child` snippet — verify with Grep before editing; if none found, skip.

## 8. Version & changelog (acceptance criterion 8)

Per `.kilo/rules/changelog-versioning.md`: no `[Unreleased]` section; bump
`package.json` version and add a dated header in the same change.

- Current version: `0.16.0` (`package.json` line 3).
- This is a **bugfix** for consumers (visual encapsulation fix) → **patch** bump
  to `0.16.1`.

### 8.1 `package.json` line 3
```json
  "version": "0.16.1",
```

### 8.2 `CHANGELOG.md`
Read current `CHANGELOG.md` first. Add a new dated header directly under the
intro (above the most recent existing version header). Do NOT add an
`[Unreleased]` section.

```markdown
## [0.16.1] — 2026-08-18

### Fixed
- Host-bound modifier classes (`cba-button--primary`, `--secondary`, `--ghost`,
  `--danger`, `--success`, `--sm`, `--md`, `--disabled`, `--loading`,
  `--truncate`, `--icon-only`, `--block`, and the `--disabled`/`--readonly`
  modifiers on `cba-input`, `cba-select`, `cba-datepicker`, `cba-typeahead`) now
  use `:host(.modifier)` selectors so styles apply under Angular emulated
  encapsulation. Previously the primary button (and other variants) rendered
  without their accent fill in consumer apps like the Shell because the modifier
  lives on the `_nghost-*` element while the SCSS targeted `_ngcontent-*`. See
  `docs/CBA_BUTTON.md` "Host modifiers and encapsulation".

### Added
- Component-authoring note in `AGENTS.md` documenting the `:host(.modifier)` rule
  for host-bound classes.
- Unit-test assertions for `readonly`/`disabled` host classes on
  `cba-input`, `cba-select`, `cba-datepicker`.
```

Verify after edit: no `[Unreleased]` string appears anywhere in `CHANGELOG.md`
(Grep the file).

## 9. Consumer-context verification (acceptance criterion 2)

Part A does not include the demo app (Part B). To verify the primary button
renders correctly in a consumer context **within Part A's scope**, use one of:

- **Preferred (no new app):** After `npm run build`, the implementer visually
  confirms by inspecting the emitted `dist/components/button/cba-button.component.css`
  and asserting the primary rule is `:host(.cba-button--primary)[_nghost-cba-button-…] .cba-button__control[_ngcontent-…]`
  shape (the compiled selector will carry the `_nghost` attribute on the
  `:host(...)` portion). This is the "compiled CSS review" of §5 and is
  acceptable per TODO A.3 ("manual review of emitted CSS is acceptable once").
- **If a Shell/consumer checkout is available locally:** build the lib, point the
  consumer at `dist`, render `<cba-button variant="primary">Save</cba-button>`,
  and confirm a solid `--cba-accent-primary` fill with inverse text. This is
  optional for Part A; the demo app in Part B is the canonical visual truth.

Record which path was used in the implementation summary. Part A is accepted on
the compiled-CSS evidence + unit-test gates; full visual sign-off is deferred to
Part B's demo per TODO "Proposed execution order" step 2 ("Verify fix in a quick
Shell or temporary harness").

## 10. Git actions (implementer, step 4.2)

The critical workflow step 2 (feature branch) and step 3 (version bump) are
handled by separate sub-tasks. Within this plan's implementation step (4.2), the
implementer commits in logical batches:

1. `feat(button): fix host encapsulation for variant/size/state modifiers`
   — `src/components/button/cba-button.component.scss` only. (After G1.)
2. `fix(form-controls): fix host encapsulation for disabled/readonly modifiers`
   — input, select, datepicker, typeahead SCSS. (After G2.)
3. `test(components): assert readonly/disabled host classes`
   — the four spec files edited in §6.
4. `docs(components): document :host(.modifier) authoring rule`
   — `AGENTS.md`, `docs/CBA_BUTTON.md`.
5. `chore(release): bump version to 0.16.1 + changelog`
   — `package.json`, `CHANGELOG.md`. (After G3.)

Before each commit:
- `git status` (verify only intended files staged).
- Read `.gitignore`; ensure no `node_modules/`, `dist/`, or other ignored paths
  are staged. `dist/` is build output — confirm it is gitignored; if not, flag
  to caller (per gitignore-compliance rule) and do NOT commit `dist/`.

Do NOT push. Push happens only at critical workflow step 5, to `origin` only.

## 11. Acceptance-criteria mapping

| TODO / Spec criterion | Covered by |
|------------------------|------------|
| 1. All `src/components/` audited | Spec §3 + §5 (already-correct list); this plan fixes the 5 broken ones. |
| 2. `:host(...)` rewrite for every broken selector | §3.1–3.5 (exact before/after). |
| 3. Chained host classes kept inside `:host(...)` | §3.1 B5/B6 (icon-only+sm/md, block+ghost). |
| 4. No new `::ng-deep` | §5.2 negative grep; only pre-existing line 116 retained. |
| 5. build/lint/test pass | §4 G1/G2/G3. |
| 6. Emitted CSS review | §5. |
| 7. Unit tests assert host modifiers | §6 (fills the gaps; existing cover the rest). |
| 8. Visual verification in consumer | §9 (compiled-CSS evidence; full visual deferred to Part B). |
| 9. Authoring doc updated | §7. |
| Changelog records fix | §8. |

## 12. Out of scope (do NOT do in Part A)

- Part B (demo app), Part C (remove HTML preview).
- Switching any component to `ViewEncapsulation.None`.
- Editing components beyond the 5 listed (spec §5 confirms others are correct).
- Removing the pre-existing `:host ::ng-deep .fa-spin` reduced-motion rule.
- Pushing to any remote.
- Any PowerShell commands.

## 13. Ambiguities / decisions logged

- **Datepicker readonly toggle behavior:** spec §3.4 lists `.cba-datepicker--readonly .cba-datepicker__toggle { cursor: pointer; }`
  as broken and to be fixed to `:host(.cba-datepicker--readonly) .cba-datepicker__toggle`.
  This is a pure selector-scope fix; the `cursor: pointer` value is preserved as-is
  (intentional per existing behavior — toggle remains clickable in readonly). No
  behavioral change.
- **`--valid`/`--error`/`--invalid` host classes on input/select/datepicker:** spec
  §3.2/3.3/3.4 explicitly states no SCSS selector targets them (visual states
  handled by internal `cba-field` wrapper). No SCSS change for those classes.
- **`--error` on typeahead:** spec §3.5 — no matching selector; skip.
- **Unit test for `loading` host class on button:** existing spec asserts the
  no-emit behavior; an explicit host-class assertion is optional and omitted to
  keep scope tight. If a reviewer requests it, add one mirroring the
  `assertInputDrivesHostClass('loading', 'cba-button--loading')` pattern.
- **`dist/` gitignore status:** to be verified at commit time. If `dist/` is not
  gitignored, flag to caller — do not commit build artifacts.

## 14. Plan validation against original task

Checked against TODO Part A (lines 30–71) and spec acceptance criteria §10:

- A.1 problem pattern → §3 fix pattern matches exactly (`:host(.M) .C`).
- A.2 inventory → spec §3 + §5 covers all components under `src/components/`;
  this plan fixes the 5 broken ones with exact line-level edits.
- A.3 regression checks → §4 (gates), §5 (compiled CSS), §6 (unit tests), §9
  (visual/consumer).
- A.4 docs → §7 (AGENTS + CBA_BUTTON) and §8 (changelog).
- "Button first, then rest" execution order → §3.1 then §3.2–3.5 with G1
  checkpoint between.
- "Don't request me to approve plans" → plan is auto-approved per caller; no
  user presentation required.

Plan is correct and complete for Part A. Saved to
`.kilo/plans/20260818-phase12-partA-plan.md`.
