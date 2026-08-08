# Code Simplification Report — Fix Solid Button Hover/Active State Visibility

**Date:** 2026-08-07
**Task:** Step 4.3 (Code Simplification) of Critical Workflow for TODO `.agent/todos/20260807/20260807-todo-0.md`
**Branch:** `feat/fix-solid-button-states`

## Scope

Reviewed the implementation produced in step 4.2. The goal was to identify opportunities to reduce duplication, improve readability, or improve maintainability while preserving exact behavior and respecting project rules.

Files reviewed:

- `src/theme/_variables.scss`
- `src/components/testing/theme-fixtures.ts`
- `src/components/button/cba-button.component.scss`
- `docs/theme-preview.html`
- `docs/theme-preview.css`
- `docs/CONSUMER_GUIDE.md`
- `.agent/project-info/brief.md`
- `CHANGELOG.md`
- `src/theme/preview-html.spec.ts`
- `src/theme/tokens.spec.ts`

## Findings

### 1. `src/components/button/cba-button.component.scss` — consolidate solid variant state blocks with a mixin

The `primary`, `danger`, and `success` variant blocks (lines 36–47, 76–87, and 89–100) are identical except for the accent `background-color` token. Extracting a mixin removes ~35 lines of duplication and makes the solid-vs-non-solid split explicit.

**Current (lines 36–47, 76–87, 89–100):**

```scss
.cba-button--primary .cba-button__control {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse));
  }
}

/* identical hover/active blocks repeated for danger and success */
```

**Recommended change:**

Add a local mixin after the base `.cba-button__control` block (around line 22). A local mixin is preferred for this component-specific pattern; alternatively, it could live in `src/theme/_mixins.scss` and be imported via `@use`.

```scss
@mixin cba-solid-button($accent-color) {
  background-color: $accent-color;
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse));
  }
}
```

Then replace the three solid blocks with:

```scss
.cba-button--primary .cba-button__control {
  @include cba-solid-button(var(--cba-accent-primary));
}

.cba-button--danger .cba-button__control {
  @include cba-solid-button(var(--cba-accent-danger));
}

.cba-button--success .cba-button__control {
  @include cba-solid-button(var(--cba-accent-success));
}
```

**Impact:**

- Emitted CSS remains identical (SCSS inlines the mixin before Angular encapsulation).
- Future solid variants become one-line additions.
- Respects `max-arguments-per-method.md` (one parameter).
- Keeps the file under the `max-lines-per-file.md` limit and reduces its size.

### 2. `src/theme/preview-html.spec.ts` — parameterize duplicate alpha-difference tests

The `hover and active alphas differ by at least 0.05` assertion is duplicated for regular and inverse tokens (lines 135–139 and 147–151). Using Jest's `it.each` removes duplication without reducing coverage.

**Current (lines 135–151):**

```ts
  it('hover and active alphas differ by at least 0.05', () => {
    const hoverAlpha = parseAlpha(EXPECTED_TOKENS['--cba-hover']);
    const activeAlpha = parseAlpha(EXPECTED_TOKENS['--cba-active']);
    expect(activeAlpha - hoverAlpha).toBeGreaterThanOrEqual(0.05);
  });

  // ...

  it('inverse hover and active alphas differ by at least 0.05', () => {
    const hoverAlpha = parseAlpha(EXPECTED_TOKENS['--cba-hover-inverse']);
    const activeAlpha = parseAlpha(EXPECTED_TOKENS['--cba-active-inverse']);
    expect(activeAlpha - hoverAlpha).toBeGreaterThanOrEqual(0.05);
  });
```

**Recommended change:**

```ts
  it.each([
    ['--cba-hover', '--cba-active'],
    ['--cba-hover-inverse', '--cba-active-inverse'],
  ])('%s and %s alphas differ by at least 0.05', (hoverToken, activeToken) => {
    const hoverAlpha = parseAlpha(EXPECTED_TOKENS[hoverToken]);
    const activeAlpha = parseAlpha(EXPECTED_TOKENS[activeToken]);
    expect(activeAlpha - hoverAlpha).toBeGreaterThanOrEqual(0.05);
  });
```

**Impact:**

- Reduces ~10 lines in a file that is already 181 lines (close to the 200-line `max-lines-per-file.md` limit).
- Keeps both test cases and scales cleanly if more overlay pairs are added.
- Respects `max-arguments-per-method.md` (two parameters).

### 3. Other files — no advisable simplifications

- `src/theme/_variables.scss` and `src/components/testing/theme-fixtures.ts`: the new tokens are single-line additions; no duplication.
- `docs/theme-preview.html`: the inline CSS must mirror the component selector split using plain CSS (no SCSS mixins available). The six current rules are already minimal.
- `docs/theme-preview.css`: auto-generated output; do not hand-edit.
- `docs/CONSUMER_GUIDE.md`, `.agent/project-info/brief.md`, `CHANGELOG.md`: documentation is clear and follows project style. No unnecessary verbosity.
- `src/theme/tokens.spec.ts`: the new `declares inverse overlay tokens for solid accent buttons` test (lines 42–45) is redundant with the canonical-value loop, but it is intentional hardening for clearer failure messages per the implementation plan. Recommend keeping it.

## Rule Compliance Check

| Rule | Status |
|------|--------|
| `max-lines-per-file.md` | `preview-html.spec.ts` is 181 lines (under 200). `cba-button.component.scss` is 127 lines (under 200). Both simplifications reduce file size. |
| `max-lines-per-method.md` | All TS test functions and the proposed mixin body are short. |
| `max-depth.md` | SCSS nesting is ≤2 levels. Test `describe` nesting is unchanged by this task. |
| `max-arguments-per-method.md` | Proposed mixin has 1 parameter; `it.each` callback has 2 parameters. |
| `single-section-boolean-conditions.md` | No complex boolean conditions introduced. |

## What Was NOT Done

- No files were modified. This report is for review only.
- No simplifications were applied. The Plan Agent should delegate fixes/simplifications to the implementer in a follow-up sub-task if approved.

## Recommendation

Apply simplifications **1** and **2**. Both reduce duplication without changing behavior, tests, or documentation, and align with the project's maintainability goals.
