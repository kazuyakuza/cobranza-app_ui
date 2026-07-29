# Task 1 — Initialize Project Info — 4.3 Code Review Fix Plan

**Date:** 2026-07-29
**Branch:** `feat/ui-library-setup`
**Files reviewed:** `.agent/project-info/brief.md`, `product.md`, `context.md`, `architecture.md`, `tech.md`
**Source of truth:** `brief.md` (per `instructions.md`)
**Plan source:** `.kilo/plans/20260729-task1-init-project-info.md`

---

## Summary

The 4 newly created project-info files are structurally complete and internally consistent with `brief.md` for the most part. No factual errors or contradictions that would block the next workflow step were found.

However, several small deviations from the per-task plan and `brief.md` wording need correction before the task is finalized:

1. `context.md` lists **Task 5** and **Task 6** under *Immediate Next Steps*, but the per-task plan only requires **Task 2–4**.
2. `product.md` *Out of Scope* section is missing the phrase **"for now"** for the mobile/responsive item, differing from `brief.md` line 38.
3. `product.md` *In Scope* section is missing the phrase **"if needed"** for directives, differing from `brief.md` line 28.
4. `product.md` *UX Focus* specifies **`ViewEncapsulation.Emulated`**, whereas `brief.md` line 47 says only "prefer ViewEncapsulation." (the files are internally consistent with each other, but they narrow the source of truth).
5. `tech.md` *Tooling Constraints* re-lists the bodies of five `.kilo/rules/` rules, but the per-task plan instructs to **reference the rules, not re-list their bodies**.
6. `tech.md` paraphrases the max-params and max-depth rules slightly imprecisely.
7. Minor punctuation inconsistency: `product.md` line 47 ends "not classic rigid corporate." with a period, while `brief.md` line 42 does not.

---

## Detailed Fix Items

### Fix 1 — `context.md`: Remove extra TODO tasks from *Immediate Next Steps*

**Location:** `context.md` lines 17–23.

**Current:**

```markdown
## Immediate Next Steps

1. **Task 2**: Update `README.md` for `@cobranza-apps/ui` consumers.
2. **Task 3**: Define project structure (create folders under `src/lib/`).
3. **Task 4**: Create `package.json` + `ng-package.json`, install dependencies.
4. **Task 5**: Implement `ModuleHeader` component.
5. **Task 6**: Implement `ModuleContainer` component.
```

**Expected (per `.kilo/plans/20260729-task1-init-project-info.md` Step 2 section 5):**

```markdown
## Immediate Next Steps

1. **Task 2**: Update `README.md` for `@cobranza-apps/ui` consumers.
2. **Task 3**: Define project structure (create folders under `src/lib/`).
3. **Task 4**: Create `package.json` + `ng-package.json`, install dependencies.
```

**Rationale:** The per-task plan explicitly scopes `context.md` immediate next steps to the remaining TODO tasks **2–4**. Tasks 5 and 6 are not part of the current TODO file scope and should be added only when Task 4 is complete and the TODO file is updated.

---

### Fix 2 — `product.md`: Add "for now" to mobile/responsive out-of-scope item

**Location:** `product.md` line 43.

**Current:**

```markdown
- Mobile / responsive layouts (desktop-first and desktop-only).
```

**Expected (matches `brief.md` line 38):**

```markdown
- Mobile / responsive layouts (desktop-first and desktop-only for now).
```

**Rationale:** `brief.md` is the source of truth. The per-task plan (Step 1 section 5) requires mirroring `brief.md` sections 2.1 & 2.2 in summary form.

---

### Fix 3 — `product.md`: Add "if needed" to directives in-scope item

**Location:** `product.md` line 33.

**Current:**

```markdown
- Directives: lightweight helpers (e.g. autofocus, click-outside).
```

**Expected (matches `brief.md` line 28):**

```markdown
- Directives: lightweight helpers (e.g. autofocus, click-outside) if needed.
```

**Rationale:** Same as Fix 2 — preserve `brief.md` wording.

---

### Fix 4 — `product.md`: Align `ViewEncapsulation` wording with `brief.md`

**Location:** `product.md` line 52.

**Current:**

```markdown
- **Encapsulated theme** — each consumer imports and controls the theme; prefer `ViewEncapsulation.Emulated`.
```

**Expected (matches `brief.md` line 47):**

```markdown
- **Encapsulated theme** — each consumer imports and controls the theme; prefer ViewEncapsulation.
```

**Rationale:** `brief.md` intentionally leaves the exact encapsulation mode unspecified. `architecture.md` can still recommend `ViewEncapsulation.Emulated` as the implementation default, but the product-level principle should not be more specific than the source of truth.

**Note:** `architecture.md` line 61 currently says "Prefer `ViewEncapsulation.Emulated` per component". This is acceptable as an architecture-specific recommendation, but it should be worded to avoid contradicting the product principle. Consider rephrasing to:

```markdown
- Components default to `ViewEncapsulation.Emulated`; global styles only when strictly necessary.
```

---

### Fix 5 — `tech.md`: Replace rule-body list with a concise reference

**Location:** `tech.md` lines 59–65.

**Current:**

```markdown
- Code rules from `.kilo/rules/` apply:
  - Max 200 lines per source file in `src/`.
  - Max 50 lines per method.
  - Max 2 constructor / method parameters (use a config/options object beyond 2).
  - Max 2 levels of nesting (extract into methods beyond that).
  - Prefer private members by default.
```

**Expected (per per-task plan Step 4 section 7):**

```markdown
- Code rules from `.kilo/rules/` apply (e.g., line/method limits, parameter caps, nesting depth, and private-by-default members).
```

**Rationale:** The per-task plan says to *reference* the rules, not re-list every rule body. Keeping the constraint concise reduces duplication and avoids drift if `.kilo/rules/` are updated later.

---

### Fix 6 — `tech.md`: Correct max-params and max-depth phrasing

**Location:** `tech.md` lines 62–63 (if kept after Fix 5, otherwise optional).

If any rule examples are retained, rephrase as:

```markdown
- Max 2 method/function parameters; when more than 2 are required, encapsulate them in an options object or class.
- Max 2 levels of nested blocks; when a 3rd level is required, extract the logic into a separate method or function.
```

**Rationale:** Current phrasing "beyond 2" is ambiguous. The `.kilo/rules/` wording says "more than 2 params" and "when 3rd level of nesting is required".

---

### Fix 7 — `product.md`: Remove trailing period from "not classic rigid corporate"

**Location:** `product.md` line 47.

**Current:**

```markdown
- **Modern professional, calm, friendly** — not classic rigid corporate.
```

**Expected (matches `brief.md` line 42):**

```markdown
- **Modern professional, calm, friendly** — not classic rigid corporate
```

**Rationale:** Punctuation consistency with the source-of-truth brief.

---

## Out of Scope for This Fix

- No changes to `brief.md` unless the Plan Agent/user decides to update the source of truth.
- No changes to `README.md`, `package.json`, `ng-package.json`, or `src/` (these are Tasks 2–4).
- No factual corrections to Angular/ng-bootstrap/Font Awesome versions; exact pinning is deferred to Task 4.

---

## Recommended Commit Message

```
docs(project-info): align wording with brief.md and per-task plan

- context.md: limit immediate next steps to Tasks 2–4
- product.md: match brief.md wording for directives, mobile scope, and ViewEncapsulation
- product.md: fix trailing punctuation
- tech.md: reference .kilo/rules/ instead of re-listing rule bodies
```
