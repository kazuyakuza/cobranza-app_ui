# Simplification Plan — Task 3: Consumer Guide Enhancement

**TODO Source:** `.agent/todos/20260805/20260805-todo-1.md` (line 18)
**Implementation Plan:** `.kilo/plans/20260806-task3-consumer-guide.md`
**Front-end Spec:** `.kilo/plans/20260806-task3-consumer-guide-frontend-spec.md`
**Step:** 4.3 (part B) — Code Simplification
**Date:** 2026-08-06
**Verdict:** SIMPLIFICATIONS PROPOSED

---

## 1. Scope

Reviewed four documentation files updated during Task 3:

- `docs/CONSUMER_GUIDE.md`
- `docs/THEME.md`
- `docs/INDEX.md`
- `README.md`

This plan proposes targeted simplifications inside `docs/CONSUMER_GUIDE.md`. Cross-reference updates in the other three files are already concise and are **not** changed.

---

## 2. Constraints compliance

- No required sections or tables are removed.
- No token values or names are changed.
- No hex values are added.
- All proposed edits stay within the four reviewed files.

---

## 3. Proposed simplifications

### 3.1 Token Compliance Mandate — active voice and tighter wording

**Location:** `docs/CONSUMER_GUIDE.md`, lines 45–56

**3.1.1 Replace passive prohibition with direct instruction.**

oldString:

```markdown
- Hard-coded hex values, RGB/RGBA literals, or Bootstrap default colors are not allowed
  except for one-off edge cases.
```

newString:

```markdown
- Do not use hard-coded hex values, RGB/RGBA literals, or Bootstrap default colors except
  for one-off edge cases.
```

**3.1.2 Replace "are authoritative in" with simpler "live in".**

oldString:

```markdown
Token values are authoritative in
[`src/theme/_variables.scss`](../src/theme/_variables.scss) and
[`.agent/project-info/brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme).
This guide references tokens only; it never re-declares hex values.
```

newString:

```markdown
Token values live in
[`src/theme/_variables.scss`](../src/theme/_variables.scss) and
[`.agent/project-info/brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme).
This guide references tokens only; it never re-declares hex values.
```

---

### 3.2 Button Color Guide — compact the variant × surface table

**Location:** `docs/CONSUMER_GUIDE.md`, lines 108–131

**Rationale:** `primary`, `danger`, `success`, and `ghost` use the same tokens on every surface. Only `secondary` changes by surface. The current 15-row table repeats the same rows. Collapsing surface-independent variants reduces visual noise while preserving every token mapping.

oldString:

```markdown
### Variant × surface base mapping

| Variant | Surface | Background | Border | Text |
|---------|---------|------------|--------|------|
| `primary` | panel | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `primary` | elevated | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `primary` | canvas | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `secondary` | panel | `--cba-bg-elevated` | `--cba-border-subtle` | `--cba-text-primary` |
| `secondary` | elevated | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` |
| `secondary` | canvas | `--cba-bg-elevated` | `--cba-border-subtle` | `--cba-text-primary` |
| `ghost` | panel | transparent | transparent | `--cba-text-primary` |
| `ghost` | elevated | transparent | transparent | `--cba-text-primary` |
| `ghost` | canvas | transparent | transparent | `--cba-text-primary` |
| `danger` | panel | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `danger` | elevated | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `danger` | canvas | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `success` | panel | `--cba-accent-success` | transparent | `--cba-text-inverse` |
| `success` | elevated | `--cba-accent-success` | transparent | `--cba-text-inverse` |
| `success` | canvas | `--cba-accent-success` | transparent | `--cba-text-inverse` |

**Rationale for `secondary` on elevated:** the component's default secondary fill is
`--cba-bg-elevated`. When the button sits on an already-elevated surface, swap the fill
to `--cba-bg-secondary` and strengthen the border to `--cba-border-default` so the button
remains visible.
```

newString:

```markdown
### Variant × surface base mapping

`primary`, `danger`, `success`, and `ghost` are surface-independent — use the same tokens
on panel, elevated, and canvas. Only `secondary` changes by surface.

| Variant | Surface | Background | Border | Text |
|---------|---------|------------|--------|------|
| `primary` | any | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `danger` | any | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `success` | any | `--cba-accent-success` | transparent | `--cba-text-inverse` |
| `secondary` | panel | `--cba-bg-elevated` | `--cba-border-subtle` | `--cba-text-primary` |
| `secondary` | elevated | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` |
| `secondary` | canvas | `--cba-bg-elevated` | `--cba-border-subtle` | `--cba-text-primary` |
| `ghost` | any | transparent | transparent | `--cba-text-primary` |

**Rationale for `secondary` on elevated:** the default secondary fill is `--cba-bg-elevated`.
On an already-elevated surface, swap the fill to `--cba-bg-secondary` and the border to
`--cba-border-default` so the button remains visible.
```

---

### 3.3 Button Color Guide — compact the state overlays table

**Location:** `docs/CONSUMER_GUIDE.md`, lines 133–145

**Rationale:** `secondary` mirrors the solid variants in every state. The current table repeats "same as solid variants" three times. Merging the columns removes redundancy.

oldString:

```markdown
### State overlays

| State | Solid variants (`primary`, `danger`, `success`) | `secondary` | `ghost` |
|-------|--------------------------------------------------|-------------|---------|
| normal | base tokens only | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `background-image: linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | same as solid variants | `background-color: var(--cba-hover)` |
| active | `background-image: linear-gradient(var(--cba-active), var(--cba-active))` over base bg | same as solid variants | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same as solid variants | same as solid variants |
```

newString:

```markdown
### State overlays

| State | Solid variants & `secondary` | `ghost` |
|-------|------------------------------|---------|
| normal | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | `background-color: var(--cba-hover)` |
| active | `linear-gradient(var(--cba-active), var(--cba-active))` over base bg | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same |
```

---

### 3.4 Surface Decision Tree — shorten long table cells

**Location:** `docs/CONSUMER_GUIDE.md`, lines 149–155

**Rationale:** The `elevated` row and the `overlay` row are unnecessarily long. Shortening them improves table readability without losing meaning.

oldString:

```markdown
| You are styling... | Use this background token | Semantic name |
|--------------------|---------------------------|---------------|
| Shell workspace / workbench floor / page body behind modules | `--cba-bg-primary` | canvas |
| Module card body / floating panel / dialog body | `--cba-bg-secondary` | panel |
| Module header / Shell header / dropdown menu / popover / modal surface / active/selected control fill | `--cba-bg-elevated` | elevated |
| Table header (`thead th`) / recessed well / module footer / status band | `--cba-bg-tertiary` | inset |
| Modal/dropdown backdrop | `--cba-bg-overlay` | overlay |
```

newString:

```markdown
| You are styling... | Use this background token | Semantic name |
|--------------------|---------------------------|---------------|
| Shell workspace / workbench floor / page body behind modules | `--cba-bg-primary` | canvas |
| Module card body / floating panel / dialog body | `--cba-bg-secondary` | panel |
| Module or Shell header / dropdown / popover / modal / active or selected control fill | `--cba-bg-elevated` | elevated |
| Table header (`thead th`) / recessed well / module footer / status band | `--cba-bg-tertiary` | inset |
| Modal or dropdown backdrop | `--cba-bg-overlay` | overlay |
```

---

### 3.5 Surface Decision Tree — tighten the decision rule

**Location:** `docs/CONSUMER_GUIDE.md`, lines 157–165

**Rationale:** Rule 3 is wordier than the other rules. The table already implies the "lighter than container" intent.

oldString:

```markdown
3. Is it a header band, dropdown, popover, modal, or selected/active fill that must read
   lighter than its container? → **elevated**.
```

newString:

```markdown
3. Is it a header band, dropdown, popover, modal, or selected/active fill? → **elevated**.
```

---

### 3.6 Text Color Rules — remove redundant guidance

**Location:** `docs/CONSUMER_GUIDE.md`, lines 179–188

**Rationale:** The table already marks `--cba-text-muted` as RESTRICTED on canvas and inset. The last bullet repeats the same rule. Removing it eliminates redundancy.

oldString:

```markdown
### Usage guidance

- Default body text: `--cba-text-primary`.
- Labels, meta-data, placeholders: `--cba-text-secondary`.
- Disabled hints, captions, tertiary meta-data: `--cba-text-muted` **only on panel or
  elevated**.
- Text on top of `--cba-accent-primary`, `--cba-accent-danger`, or `--cba-accent-success`:
  `--cba-text-inverse`.
- On canvas and inset, do not use `--cba-text-muted`. Use `--cba-text-secondary` for
  lower-emphasis text instead.
```

newString:

```markdown
### Usage guidance

- Default body text: `--cba-text-primary`.
- Labels, meta-data, placeholders: `--cba-text-secondary`.
- Disabled hints, captions, tertiary meta-data: `--cba-text-muted` **only on panel or
  elevated**.
- Text on top of `--cba-accent-primary`, `--cba-accent-danger`, or `--cba-accent-success`:
  `--cba-text-inverse`.
```

---

### 3.7 Bar and Chrome Guide — move notes out of the table

**Location:** `docs/CONSUMER_GUIDE.md`, lines 192–198

**Rationale:** The table has five columns, several with very long cells that wrap awkwardly. Moving explanatory notes below the table makes the mapping columns scannable and keeps all details.

oldString:

```markdown
| Chrome element | Background | Border | Text | Height / min-height | Notes |
|----------------|------------|--------|------|---------------------|-------|
| Shell header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for brand, `--cba-text-secondary` for muted items | `--cba-header-height` (56px) | Use `--cba-focus-ring` for focusable items. |
| Shell footer | `--cba-bg-primary` (recommended) OR `--cba-bg-elevated` (documented Shell choice) | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` (64px) | Footer section pills: bg `--cba-bg-secondary`, border `--cba-border-strong`, active pill border `--cba-accent-primary`. |
| Module header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for title, `--cba-text-secondary` for actions | `--cba-module-header-min-height` (40px) | Implemented by `cba-module-header`; do not recreate with custom CSS. |
| Module footer | `--cba-bg-tertiary` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-secondary` or status accent | auto | Implemented by `cba-module-footer` if used; otherwise apply same tokens. |
| Footer section pill | `--cba-bg-secondary` | `border: 1px solid var(--cba-border-strong)` | `--cba-text-secondary` | auto | Active pill: `border-color: var(--cba-accent-primary)`, `color: var(--cba-text-primary)`. |
```

newString:

```markdown
| Chrome element | Background | Border | Text | Height / min-height |
|----------------|------------|--------|------|---------------------|
| Shell header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-header-height` |
| Shell footer | `--cba-bg-primary` or `--cba-bg-elevated` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` |
| Module header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-module-header-min-height` |
| Module footer | `--cba-bg-tertiary` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-secondary` or status accent | auto |
| Footer section pill | `--cba-bg-secondary` | `border: 1px solid var(--cba-border-strong)` | `--cba-text-secondary` | auto |

Notes:

- Shell header: use `--cba-focus-ring` for focusable items.
- Shell footer: prefer `--cba-bg-primary`; `--cba-bg-elevated` is the documented Shell choice.
  Footer section pills use bg `--cba-bg-secondary`, border `--cba-border-strong`, and active
  border `--cba-accent-primary`.
- Module header: implemented by `cba-module-header`; do not recreate with custom CSS.
- Module footer: implemented by `cba-module-footer` if used; otherwise apply the same tokens.
- Footer section pill: active state uses `border-color: var(--cba-accent-primary)` and
  `color: var(--cba-text-primary)`.
```

---

## 4. Verification after implementation

After applying the edits:

1. Confirm the TOC still links to all 12 sections.
2. Confirm no hex values were introduced.
3. Confirm all referenced `--cba-*` token names remain unchanged.
4. Run `npm run lint` and `npm run build` as sanity checks (docs-only changes).

---

## 5. Summary

- **Files touched:** `docs/CONSUMER_GUIDE.md` only.
- **What improves:** tighter wording, fewer redundant table rows, readable chrome table, shorter decision-tree cells, less passive voice.
- **What is preserved:** all required sections, all tables, all token names/values, no added hex values.
- **Cross-references:** unchanged — they already accurately summarize the guide contents.
