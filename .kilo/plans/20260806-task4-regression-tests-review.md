# Task 4 — Regression Tests: Code Review Report & Fix Plan

**Review date:** 2026-08-06
**Reviewer:** code-reviewer (Step 4.3 part A)
**Scope:** 11 files created in Step 4.2
**Result:** ISSUES FOUND

---

## Executive Summary

All `npm test` and `npm run lint` checks pass (184 tests green, no lint errors). The new helpers are pure, deterministic, and respect project file/line/param/depth rules. However, two issues were found:

1. **preview-html.spec.ts does not actually validate the `TOKEN_ROLES` role→hex mapping** — it only checks that canonical hex strings appear somewhere in the HTML and that the compiled CSS `:root` matches. A regression in the HTML's `TOKEN_ROLES` array would not be caught.
2. **`deltaE` in `color-math.ts` is exported but never used** — dead code in the test helper surface.

Both are fixable without touching any non-test file or any token value.

---

## Verification Results

| Check | Result | Notes |
|-------|--------|-------|
| `npm test` | PASS | 21 suites, 184 tests, 0 failures |
| `npm run lint` | PASS | No ESLint errors on `src/**/*.ts` |
| `git status` | Clean for source files | Only plan files are untracked; the 11 new source files are already committed from Step 4.2 |

---

## File-by-File Review

### Test helpers (`src/components/testing/`)

#### 1. `project-files.ts`
- **Status:** OK
- Single-responsibility Node IO helper. Deterministic for a given checkout. JSDoc is present.
- No unused imports.

#### 2. `color-math.ts`
- **Status:** ISSUE (minor)
- Pure, deterministic, well-documented. WCAG and CIELAB math match the Task 1 front-end spec.
- Functions respect `max-arguments-per-method` (≤2 params) and `max-lines-per-method`.
- **Issue:** `deltaE` is exported but never imported or asserted. It is dead code.

#### 3. `scss-tokens.ts`
- **Status:** OK
- Regex `/(--cba-[a-z0-9-]+)\s*:\s*([^;}]+)[;}]\s*/g` correctly handles both multiline SCSS and compressed CSS `:root` blocks.
- `Map` is used as the global, no bogus import.

#### 4. `html-loader.ts`
- **Status:** OK
- Simple jsdom wrapper. Returns a detached `div`, which is sufficient for `querySelector` assertions.

#### 5. `markdown-headings.ts`
- **Status:** OK
- Pure ATX-heading parser. `CONSUMER_GUIDE.md` uses only ATX headings, so coverage is adequate.

#### 6. `theme-fixtures.ts`
- **Status:** OK
- Canonical token map matches `src/theme/_variables.scss` exactly.
- Contrast-pair and surface-gap tables align with the implementation plan §4.
- No unused constants.

### Test specs (`src/theme/`)

#### 7. `tokens.spec.ts`
- **Status:** OK
- Asserts presence, canonical values, no unexpected tokens, and `:root` wrapper.
- Correctly treats `src/theme/_variables.scss` as the source of truth.

#### 8. `contrast.spec.ts`
- **Status:** OK
- 11 pass pairs + 2 restricted-fail pairs. WCAG AA threshold is `4.5`.
- Deterministic; no flakiness risk.

#### 9. `surfaces.spec.ts`
- **Status:** OK
- L* ordering and gap thresholds are asserted against `SURFACE_GAPS` and `SURFACE_LIGHTNESS_ORDER`.
- Matches the Task 1 spec targets with margin.

#### 10. `preview-html.spec.ts`
- **Status:** ISSUE (significant)
- Required IDs, CSS link, title, swatch labels, muted callout, and compiled-CSS drift guard are all correctly asserted.
- **Issue:** The test `TOKEN_ROLES hex values match canonical token values` only loops over `Object.values(SWATCH_ROLE_TOKEN)` (the token names), checks `cssVars.get(token) === canonical`, and checks `html.contains(canonical)`. It never extracts the `TOKEN_ROLES` array from the HTML `<script>` and therefore never verifies that each role label is paired with the correct hex. A regression where `TOKEN_ROLES` maps `panel` to `#FBF7ED` and `elevated` to `#E6DDC6` would still pass because both canonical hex values appear elsewhere in the file and the CSS `:root` is unchanged.

#### 11. `consumer-guide.spec.ts`
- **Status:** OK
- All 11 mandated sections are present in `docs/CONSUMER_GUIDE.md`.
- `h.includes(section)` tolerates minor heading wording variations.

---

## Edge-Case Coverage Assessment

| Edge case | Covered? | Notes |
|-----------|----------|-------|
| Missing `src/theme/_variables.scss` | Indirectly | `readProjectText` throws; test fails fast |
| Extra/unexpected `--cba-*` token | Yes | `introduces no unexpected --cba-* token` |
| Renamed `:root` wrapper | Yes | `keeps the file as a :root block` |
| WCAG AA borderline (4.5) | Yes | `>= 4.5` and `< 4.5` are correctly split |
| Surface inversion | Yes | L* ordering + min/max assertions |
| Preview CSS drift | Yes | `docs/theme-preview.css :root matches canonical tokens` |
| Missing preview section | Yes | 5 required IDs |
| Wrong hex inside `TOKEN_ROLES` | **No** | See Issue #1 below |
| Missing consumer-guide section | Yes | 11 required headings |

---

## Rule Compliance

| Rule | Compliance | Notes |
|------|------------|-------|
| `max-lines-per-file` (200 / ideal 125) | PASS | Longest file is `color-math.ts` at 80 lines |
| `max-lines-per-method` (50) | PASS | All functions and `it` callbacks are short |
| `max-arguments-per-method` (2) | PASS | All functions ≤2 params |
| `max-depth` (2) | PASS | No nested blocks exceed 2 levels |
| `no-commented-code` | PASS | No commented-out code |
| `prefer-private-members` | N/A | No classes |
| `self-documenting-code` | PASS | Clear names and JSDoc |

---

## Issues & Fix Plan

### Issue 1 — `preview-html.spec.ts` does not validate `TOKEN_ROLES` role→hex mapping

**Severity:** Significant (test name promises coverage it does not provide)

**Current test:**

```ts
it('TOKEN_ROLES hex values match canonical token values', () => {
  const cssVars = parseScssVariables(readProjectText(PREVIEW_CSS_PATH));
  for (const token of Object.values(SWATCH_ROLE_TOKEN)) {
    const canonical = EXPECTED_TOKENS[token];
    expect(cssVars.get(token)).toBe(canonical);
    expect(html).toContain(canonical);
  }
});
```

**Problem:** It ignores the role keys in `SWATCH_ROLE_TOKEN` and does not parse the `TOKEN_ROLES` array in the HTML. The canonical hex assertion is satisfied if the hex appears anywhere in the document.

**Fix:**

1. Add a helper in `src/components/testing/html-loader.ts` (or a new helper) that extracts the `TOKEN_ROLES` array from the HTML `<script>` block:

   ```ts
   export function extractTokenRoles(html: string): Array<[string, string, string]> {
     const match = html.match(/const TOKEN_ROLES\s*=\s*(\[[\s\S]*?\]);/);
     if (!match) return [];
     // Safe eval alternative: parse the JS literal with a small regex.
     const entries: Array<[string, string, string]> = [];
     const rowPattern = /\['([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\]/g;
     for (const row of match[1].matchAll(rowPattern)) {
       entries.push([row[1], row[2], row[3]]);
     }
     return entries;
   }
   ```

2. Add a new assertion in `preview-html.spec.ts` (replace the misleading test or add alongside it):

   ```ts
   it('TOKEN_ROLES array maps every role to the correct token and canonical hex', () => {
     const roles = extractTokenRoles(html);
     expect(roles.length).toBe(Object.keys(SWATCH_ROLE_TOKEN).length);
     for (const [role, token, hex] of roles) {
       expect(SWATCH_ROLE_TOKEN[role]).toBe(token);
       expect(EXPECTED_TOKENS[token]).toBe(hex);
     }
   });
   ```

3. Keep the compiled-CSS drift guard as a separate `it` block for clarity.

**Files to modify:**
- `src/components/testing/html-loader.ts` — add `extractTokenRoles`
- `src/theme/preview-html.spec.ts` — replace/extend the TOKEN_ROLES test

### Issue 2 — `deltaE` is exported but unused

**Severity:** Minor (dead code)

**Fix:** Remove the `deltaE` function from `src/components/testing/color-math.ts`. If a future task needs ΔE, it can be restored from git history.

**File to modify:**
- `src/components/testing/color-math.ts`

---

## Acceptance Criteria for Fix Sub-Task

After fixes:

1. `npm test` still passes with the same or higher test count.
2. `npm run lint` still passes.
3. The new `TOKEN_ROLES` test fails if any `[role, token, hex]` triple in `docs/theme-preview.html` is incorrect.
4. `color-math.ts` no longer exports `deltaE`.
5. No non-test file is modified.
6. All modified files still respect `max-lines-per-file`, `max-lines-per-method`, `max-arguments-per-method`, and `max-depth` rules.

---

## Recommendation

Return **ISSUES FOUND** and assign the fix plan above to the implementer sub-agent as Step 4.3-fix.
