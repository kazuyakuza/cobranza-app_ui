# Task 4 — Regression Tests: Simplification Plan

**Source:** Step 4.3 (part B) Code Simplification review  
**Scope:** 6 test helpers in `src/components/testing/` + 5 spec files in `src/theme/`  
**Date:** 2026-08-06  
**Outcome:** SIMPLIFICATIONS PROPOSED

---

## 1. Review Summary

All 11 files compile, stay within project rules (≤200 lines, ≤50-line methods, ≤2 params, ≤2 nesting depth), and contain no commented-out code. Test coverage is complete and assertions are correct. The proposed changes are **strictly maintainability improvements** — no test coverage is removed and no assertion values change.

---

## 2. Proposed Simplifications

### 2.1 Eliminate duplicated hex values in `src/components/testing/theme-fixtures.ts`

**Problem:** `CONTRAST_PAIRS`, `SURFACE_GAPS`, and `SURFACE_LIGHTNESS_ORDER` all hard-code hex values that already exist in `EXPECTED_TOKENS`. If a token value changes, three places need updating, increasing drift risk.

**Change:** Reference `EXPECTED_TOKENS` for every duplicated colour.

- `CONTRAST_PAIRS` text/background values become `EXPECTED_TOKENS['--cba-text-primary']`, `EXPECTED_TOKENS['--cba-bg-secondary']`, etc.
- `SURFACE_GAPS` lower/higher values become `EXPECTED_TOKENS['--cba-bg-primary']`, etc.
- `SURFACE_LIGHTNESS_ORDER` hex values become `EXPECTED_TOKENS['--cba-bg-primary']`, etc.

**Impact:** Same assertion values at runtime; single source of truth for token values; fewer lines of duplicated data.

---

### 2.2 Share repeated lightness computation in `src/theme/surfaces.spec.ts`

**Problem:** The `lightness` array is computed twice:

```ts
const lightness = SURFACE_LIGHTNESS_ORDER.map((s) => srgbToLab(s.hex).L);
```

**Change:** Move the `lightness` array to the outer `describe` scope and reuse it in both ordering tests.

**Impact:** Removes redundant `srgbToLab` calls; keeps assertions identical.

---

### 2.3 Share repeated CSS parsing in `src/theme/preview-html.spec.ts`

**Problem:** `docs/theme-preview.css` is parsed twice:

1. Inside `it('TOKEN_ROLES hex values match canonical token values')`.
2. Inside `describe('docs/theme-preview.css :root matches canonical tokens')`.

**Change:** Parse the CSS once at the outer `describe` scope and reuse the resulting map in both places.

**Impact:** Fewer file reads and regex passes; same assertions.

---

### 2.4 (Optional) Collapse token set assertions in `src/theme/tokens.spec.ts`

**Problem:** Two separate tests (`contains every expected token`, `introduces no unexpected --cba-* token`) assert set equality in two directions.

**Change (optional):** Replace them with a single assertion:

```ts
it('has exactly the expected --cba-* tokens', () => {
  expect(new Set(tokens.keys())).toEqual(new Set(Object.keys(EXPECTED_TOKENS)));
});
```

**Impact:** One less test and one less loop. Failure messages from Jest show the diff directly. If the team prefers granular failure messages, skip this change.

---

## 3. What Is NOT Proposed

- Removing `deltaE` from `color-math.ts` even though it is currently unused — it is a generic helper listed in the implementation plan and may be used by future specs.
- Removing the `swatch labels` test in `preview-html.spec.ts` — it verifies label presence, which is distinct from hex-value presence.
- Changing any assertion threshold, expected value, or token name.
- Flattening the two-level `describe` blocks — they keep related tests grouped without exceeding the max-depth rule.

---

## 4. Verification After Applying

1. Run `npm test` — all existing tests must pass.
2. Run `npm run lint` (if available) — no new warnings.
3. Confirm every file remains ≤200 lines and ≤125 ideal lines.
4. Confirm no function exceeds 2 parameters or 50 body lines.
5. Confirm no nested block exceeds 2 levels of depth.

---

## 5. Conclusion

The regression test suite is already clean and rule-compliant. The four proposed simplifications reduce duplication and repeated computation while preserving every assertion and all coverage. Recommended priority: apply 2.1, 2.2, and 2.3; consider 2.4 only if the team values conciseness over granular test names.
