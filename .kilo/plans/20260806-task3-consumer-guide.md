# Implementation Plan — Task 3: Consumer Guide Enhancement

**TODO Source:** `.agent/todos/20260805/20260805-todo-1.md` (line 18)
**Global Plan:** `.kilo/plans/20260806-theme-tokens-preview-guide.md`
**Front-end Spec:** `.kilo/plans/20260806-task3-consumer-guide-frontend-spec.md`
**Branch:** `feat/theme-refinement-tokens-preview-guide`
**Step:** 4.1b — Analysis & Planning (architector)
**Date:** 2026-08-06

---

## 1. Scope & Constraints

This task is **documentation-only**. It adds prescriptive sections to
`docs/CONSUMER_GUIDE.md` and updates cross-references in three other files.
No token values, token names, component SCSS, or TS source are touched.

**Hard constraints (from the spec §10 and the task prompt):**
- Do NOT change token values.
- Do NOT rename tokens.
- The guide must NEVER re-declare hex values — it references `--cba-*` tokens by name only.
- Do NOT modify component SCSS.
- Verify all token names used in the new content exist in `src/theme/_variables.scss`.

**Token-name verification (done during planning):** every `--cba-*` token referenced in the
spec — `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-bg-elevated`,
`--cba-bg-overlay`, `--cba-text-primary`, `--cba-text-secondary`, `--cba-text-muted`,
`--cba-text-inverse`, `--cba-border-subtle`, `--cba-border-default`, `--cba-border-strong`,
`--cba-accent-primary`, `--cba-accent-danger`, `--cba-accent-success`, `--cba-hover`,
`--cba-active`, `--cba-focus-ring`, `--cba-header-height`, `--cba-footer-height`,
`--cba-module-header-min-height` — is present in `src/theme/_variables.scss`. ✓

> Note: Task 1 already adjusted `--cba-bg-secondary` to `#E6DDC6` and `--cba-bg-elevated`
> to `#FBF7ED`. Since the guide never re-declares hex, these adjustments do not affect the
> guide content.

---

## 2. Current State (verified during planning)

### 2.1 `docs/CONSUMER_GUIDE.md` (124 lines)
- Lines 1–14: HTML comment (AI Agent Note).
- Lines 16–24: Title + introduction (ends with `... applies which token where.`).
- Lines 25–33: `## Table of Contents` block (7 entries).
- Lines 35–59: `## Theme load (once)` section.
- Lines 61–76: `## Surface ownership map` section.
- Lines 78–87: `## Shell checklist` section.
- Lines 89–95: `## MFE checklist` section.
- Lines 97–105: `## Anti-patterns` section.
- Lines 107–116: `## Quick verify` section.
- Lines 118–124: `## Cross-References` section.

### 2.2 `docs/THEME.md` (114 lines)
- Lines 46–53: `### Surface hierarchy` subsection. Last sentence (line 53):
  `See the [Consumer Guide](CONSUMER_GUIDE.md) for the ownership map and checklists.`

### 2.3 `docs/INDEX.md` (63 lines)
- Line 17: `CONSUMER_GUIDE.md` description under `## Getting started`.

### 2.4 `README.md` (263 lines)
- Lines 213–216: bullet under `## Integration Notes (Shell ↔ MFE)`.
- Line 226: `CONSUMER_GUIDE.md` bullet under `## Documentation`.

---

## 3. Resolved ambiguity in section placement

The front-end spec §4 wording says "Add a new section after the mandate" for the
**Button Color Guide**, while the proposed TOC in spec §8 places the Button Color Guide
**after** `Surface ownership map` (with `Theme load (once)` and `Surface ownership map`
between the mandate and the Button Color Guide).

The spec §11 acceptance criterion states: *"Existing sections ... are preserved and
**reordered only by the new TOC**."* Therefore the **TOC is authoritative** for the
section order, and the "after the mandate" wording in §4 is loose language.

**Authoritative final section order (from TOC §8):**
1. Token Compliance Mandate *(new)*
2. Theme load (once) *(existing)*
3. Surface ownership map *(existing)*
4. Button Color Guide *(new)*
5. Surface Decision Tree *(new)*
6. Text Color Rules *(new)*
7. Bar and Chrome Guide *(new)*
8. Shell checklist *(existing)*
9. MFE checklist *(existing)*
10. Anti-patterns *(existing)*
11. Quick verify *(existing)*
12. Cross-References *(existing)*

The implementer MUST follow this order. No question to caller is needed because the
spec internally resolves the ambiguity via the TOC + acceptance criterion.

---

## 4. High-Level Approach

1. Update the TOC in `docs/CONSUMER_GUIDE.md` to the new 12-entry list.
2. Insert `## Token Compliance Mandate` as the first content section (after the TOC,
   before `## Theme load (once)`).
3. Insert `## Button Color Guide` immediately after the `## Surface ownership map` section.
4. Insert `## Surface Decision Tree` immediately after the Button Color Guide.
5. Insert `## Text Color Rules` immediately after the Surface Decision Tree.
6. Insert `## Bar and Chrome Guide` immediately after the Text Color Rules.
7. Update the cross-reference sentence in `docs/THEME.md`.
8. Update the `CONSUMER_GUIDE.md` description line in `docs/INDEX.md`.
9. Update two cross-references in `README.md`.
10. Run `npm run lint` and `npm run build` as sanity checks (docs-only changes; both must
    still pass).
11. Commit the documentation work in a single commit.
12. Compare plan against TODO line 18 + front-end spec acceptance criteria.

`npm run lint` targets `src/**/*.ts` only; `npm run build` builds the library. Both are
unaffected by docs edits, but the task prompt requires running them as sanity checks.

---

## 5. Detailed Implementation Steps

> **Matching strategy:** Each edit below is expressed as an exact `oldString → newString`
> replacement (content-anchor based) so it is robust to small line shifts.
> The line numbers are reference aids captured at planning time.
> Implementer MUST preserve verbatim the surrounding content and indentation.

### Step 5.0 — Pre-flight

- **Command:** `git status`
  - Confirm branch is `feat/theme-refinement-tokens-preview-guide`.
  - Confirm working tree has no staged docs changes yet (untracked `.kilo/plans/*` files
    are expected and should NOT be staged for this task's code commit; they are plan files).
- **Verification:** `git branch --show-current` prints `feat/theme-refinement-tokens-preview-guide`.
  If a different branch is shown, STOP and return a question to the caller — do not switch
  branches (only the Plan Agent orchestrates branch setup).

### Step 5.1 — Update TOC in `docs/CONSUMER_GUIDE.md`

**File:** `docs/CONSUMER_GUIDE.md`

**oldString** (current lines 25–33, the full TOC block):

```markdown
## Table of Contents

- [Theme load (once)](#theme-load-once)
- [Surface ownership map](#surface-ownership-map)
- [Shell checklist](#shell-checklist)
- [MFE checklist](#mfe-checklist)
- [Anti-patterns](#anti-patterns)
- [Quick verify](#quick-verify)
- [Cross-References](#cross-references)
```

**newString** (from spec §8):

```markdown
## Table of Contents

- [Token Compliance Mandate](#token-compliance-mandate)
- [Theme load (once)](#theme-load-once)
- [Surface ownership map](#surface-ownership-map)
- [Button Color Guide](#button-color-guide)
- [Surface Decision Tree](#surface-decision-tree)
- [Text Color Rules](#text-color-rules)
- [Bar and Chrome Guide](#bar-and-chrome-guide)
- [Shell checklist](#shell-checklist)
- [MFE checklist](#mfe-checklist)
- [Anti-patterns](#anti-patterns)
- [Quick verify](#quick-verify)
- [Cross-References](#cross-references)
```

### Step 5.2 — Insert `## Token Compliance Mandate` (first content section)

**File:** `docs/CONSUMER_GUIDE.md`

Insert the new section between the TOC and `## Theme load (once)`.

**oldString** (anchor: the end of the TOC + the start of the Theme load heading):

```markdown
- [Cross-References](#cross-references)

## Theme load (once)
```

**newString:**

```markdown
- [Cross-References](#cross-references)

## Token Compliance Mandate

AI agents generating Shell or MFE code MUST use `--cba-*` tokens for at least 90 % of all
color and style declarations.

- Prefer `var(--cba-*)` or the opt-in `.cba-*` utility classes.
- Hard-coded hex values, RGB/RGBA literals, or Bootstrap default colors are not allowed
  except for one-off edge cases.
- Every edge-case hard-coded value MUST be documented with a `TODO` comment explaining why
  the token cannot be used and linking to this guide.
- If a needed color does not exist as a token, do not invent a new hex value — open a task
  to extend the theme.

Token values are authoritative in
[`src/theme/_variables.scss`](../src/theme/_variables.scss) and
[`.agent/project-info/brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme).
This guide references tokens only; it never re-declares hex values.

## Theme load (once)
```

### Step 5.3 — Insert `## Button Color Guide` after `## Surface ownership map`

**File:** `docs/CONSUMER_GUIDE.md`

The `## Surface ownership map` section currently ends at the paragraph (planning lines 73–76):
`Module cards lift off the canvas via ... the Shell does not need to add those.`
The next heading is `## Shell checklist`.

**oldString** (anchor: the tail of Surface ownership map + the Shell checklist heading):

```markdown
Reading order on screen (light → dark, by intent): elevated (header band, dropdowns) →
panel (module body) → inset (table header, wells) → canvas (workspace floor). Module
cards lift off the canvas via `border-default` + `shadow-module` from the library; the
Shell does not need to add those.

## Shell checklist
```

**newString** (insert the four new sections contiguously — Button Color Guide,
Surface Decision Tree, Text Color Rules, Bar and Chrome Guide — then keep the
Shell checklist heading last):

```markdown
Reading order on screen (light → dark, by intent): elevated (header band, dropdowns) →
panel (module body) → inset (table header, wells) → canvas (workspace floor). Module
cards lift off the canvas via `border-default` + `shadow-module` from the library; the
Shell does not need to add those.

## Button Color Guide

Use `CbaButton` from `@cobranza-apps/ui` whenever possible. When custom buttons are
unavoidable, map every state to the tokens below. Hover and active states use the same
base tokens plus an overlay (`--cba-hover` or `--cba-active`). Disabled and loading
states share one treatment: `opacity: 0.6` and `cursor: not-allowed`.

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

### State overlays

| State | Solid variants (`primary`, `danger`, `success`) | `secondary` | `ghost` |
|-------|--------------------------------------------------|-------------|---------|
| normal | base tokens only | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `background-image: linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | same as solid variants | `background-color: var(--cba-hover)` |
| active | `background-image: linear-gradient(var(--cba-active), var(--cba-active))` over base bg | same as solid variants | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same as solid variants | same as solid variants |

### Focus ring

All button variants MUST use
`:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }`.

## Surface Decision Tree

| You are styling... | Use this background token | Semantic name |
|--------------------|---------------------------|---------------|
| Shell workspace / workbench floor / page body behind modules | `--cba-bg-primary` | canvas |
| Module card body / floating panel / dialog body | `--cba-bg-secondary` | panel |
| Module header / Shell header / dropdown menu / popover / modal surface / active/selected control fill | `--cba-bg-elevated` | elevated |
| Table header (`thead th`) / recessed well / module footer / status band | `--cba-bg-tertiary` | inset |
| Modal/dropdown backdrop | `--cba-bg-overlay` | overlay |

**Decision rule:**

1. Is the element the lowest visible layer behind modules? → **canvas**.
2. Is it a module card, floating panel, or dialog body? → **panel**.
3. Is it a header band, dropdown, popover, modal, or selected/active fill that must read
   lighter than its container? → **elevated**.
4. Is it recessed, a table header, or a footer/status bar inside a module? → **inset**.
5. Never use the same background token for two adjacent hierarchical layers (e.g. do not
   make the workspace canvas the same color as the module panel).

## Text Color Rules

### Allowed text tokens by surface

| Surface | `--cba-text-primary` | `--cba-text-secondary` | `--cba-text-muted` | `--cba-text-inverse` |
|---------|----------------------|------------------------|--------------------|----------------------|
| canvas (`--cba-bg-primary`) | allowed | allowed | **RESTRICTED** — fails WCAG AA | allowed on accent bg only |
| panel (`--cba-bg-secondary`) | allowed | allowed | allowed | allowed on accent bg only |
| elevated (`--cba-bg-elevated`) | allowed | allowed | allowed | allowed on accent bg only |
| inset (`--cba-bg-tertiary`) | allowed | allowed | **RESTRICTED** — fails WCAG AA | allowed on accent bg only |
| accent bg (`--cba-accent-*`) | not used | not used | not used | **required** |

### Usage guidance

- Default body text: `--cba-text-primary`.
- Labels, meta-data, placeholders: `--cba-text-secondary`.
- Disabled hints, captions, tertiary meta-data: `--cba-text-muted` **only on panel or
  elevated**.
- Text on top of `--cba-accent-primary`, `--cba-accent-danger`, or `--cba-accent-success`:
  `--cba-text-inverse`.
- On canvas and inset, do not use `--cba-text-muted`. Use `--cba-text-secondary` for
  lower-emphasis text instead.

## Bar and Chrome Guide

| Chrome element | Background | Border | Text | Height / min-height | Notes |
|----------------|------------|--------|------|---------------------|-------|
| Shell header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for brand, `--cba-text-secondary` for muted items | `--cba-header-height` (56px) | Use `--cba-focus-ring` for focusable items. |
| Shell footer | `--cba-bg-primary` (recommended) OR `--cba-bg-elevated` (documented Shell choice) | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` (64px) | Footer section pills: bg `--cba-bg-secondary`, border `--cba-border-strong`, active pill border `--cba-accent-primary`. |
| Module header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for title, `--cba-text-secondary` for actions | `--cba-module-header-min-height` (40px) | Implemented by `cba-module-header`; do not recreate with custom CSS. |
| Module footer | `--cba-bg-tertiary` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-secondary` or status accent | auto | Implemented by `cba-module-footer` if used; otherwise apply same tokens. |
| Footer section pill | `--cba-bg-secondary` | `border: 1px solid var(--cba-border-strong)` | `--cba-text-secondary` | auto | Active pill: `border-color: var(--cba-accent-primary)`, `color: var(--cba-text-primary)`. |

## Shell checklist
```

### Step 5.4 — Update cross-reference in `docs/THEME.md`

**File:** `docs/THEME.md`

**oldString** (planning line 53):

```markdown
 survives only if **each surface is painted by its owner** (Shell / Lib / MFE). See the
  [Consumer Guide](CONSUMER_GUIDE.md) for the ownership map and checklists.
```

> Note: the exact current text is one paragraph; match the trailing sentence only.
> Use the unique trailing sentence as the anchor.

**Precise oldString (match exactly):**

```text
See the
  [Consumer Guide](CONSUMER_GUIDE.md) for the ownership map and checklists.
```

Wait — the actual current text (lines 52–53) is:

```text
 survives only if **each surface is painted by its owner** (Shell / Lib / MFE). See the
  [Consumer Guide](CONSUMER_GUIDE.md) for the ownership map and checklists.
```

To avoid whitespace ambiguity, use this exact **oldString** spanning the sentence break:

```text
 (Shell / Lib / MFE). See the
  [Consumer Guide](CONSUMER_GUIDE.md) for the ownership map and checklists.
```

**newString:**

```text
 (Shell / Lib / MFE). See the
  [Consumer Guide](CONSUMER_GUIDE.md) for the token compliance mandate,
  surface ownership map, button color guide, surface decision tree, text color rules,
  and bar/chrome guide.
```

### Step 5.5 — Update description line in `docs/INDEX.md`

**File:** `docs/INDEX.md`

**oldString** (planning line 17):

```markdown
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Shell & MFE integration rules: theme load (once), surface ownership map, checklists, anti-patterns, quick verify.
```

**newString:**

```markdown
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Shell & MFE integration rules: token compliance mandate, theme load (once), surface ownership map, button color guide, surface decision tree, text color rules, bar/chrome guide, checklists, anti-patterns, quick verify.
```

### Step 5.6 — Update two cross-references in `README.md`

**File:** `README.md`

#### 5.6.1 — Integration Notes bullet (planning lines 213–216)

**oldString:**

```markdown
- **Surface hierarchy is a shared contract** — Shell, Lib, and MFE each own specific
  surfaces (canvas / panel / elevated / inset). Follow the
  [Consumer Guide](./docs/CONSUMER_GUIDE.md) so the four-level hierarchy reads in the
  running Shell.
```

**newString:**

```markdown
- **Surface hierarchy and token usage are shared contracts** — Shell, Lib, and MFE each own specific
  surfaces (canvas / panel / elevated / inset). Follow the
  [Consumer Guide](./docs/CONSUMER_GUIDE.md) for the token compliance mandate, exact token mappings
  for buttons, surfaces, text, and chrome.
```

#### 5.6.2 — Documentation bullet (planning line 226)

**oldString:**

```markdown
- [`./docs/CONSUMER_GUIDE.md`](./docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules: theme load (once), surface ownership map, Shell/MFE checklists, anti-patterns, quick verify.
```

**newString:**

```markdown
- [`./docs/CONSUMER_GUIDE.md`](./docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules: token compliance mandate, theme load (once), surface ownership map, button color guide, surface decision tree, text color rules, bar/chrome guide, checklists, anti-patterns, quick verify.
```

---

## 6. Verification Steps (run after all edits)

### 6.1 Visual / structural checks on `docs/CONSUMER_GUIDE.md`

- Read the file fully and confirm, in order, these headings exist AND only these top-level
  (`## `) headings appear between the TOC and `## Cross-References`:
  1. `## Token Compliance Mandate`
  2. `## Theme load (once)`
  3. `## Surface ownership map`
  4. `## Button Color Guide`
  5. `## Surface Decision Tree`
  6. `## Text Color Rules`
  7. `## Bar and Chrome Guide`
  8. `## Shell checklist`
  9. `## MFE checklist`
  10. `## Anti-patterns`
  11. `## Quick verify`
  12. `## Cross-References`
- Confirm the TOC has exactly the 12 entries listed in Step 5.1.
- Confirm **no hex values** (`#XXXXXX` / `#XXX`) were introduced anywhere in the new
  sections. Run a search for the regex `#[0-9A-Fa-f]{3,8}` inside the file's lines that
  are part of the new sections — MUST match zero (the existing AI Agent Note line 10 says
  "value tables live in brief.md §5 ... NOT here", so the pre-existing file already has
  no hex; the new content must keep it that way).
- Confirm every `--cba-*` token referenced in the new sections exists in
  `src/theme/_variables.scss` (already verified at planning time; implementer re-verifies).

### 6.2 Sanity build & lint (per task prompt)

- **Command:** `npm run lint`
  - Expected: passes with no new errors (lint scope is `src/**/*.ts`; docs untouched by
    linter). If lint reports pre-existing failures unrelated to this task, note them but
    do not fix in this task.
- **Command:** `npm run build`
  - Expected: builds successfully (library build is independent of docs). If it fails,
    the failure MUST be unrelated to docs; if it appears related, STOP and return a
    question to the caller.
- Do NOT run `npm run build:preview` — preview regen is a Task 2 concern.

### 6.3 Cross-reference spot checks

- Open `docs/THEME.md` and confirm the Surface hierarchy paragraph ends with the new
  expanded sentence naming mandate, surface ownership map, button color guide, surface
  decision tree, text color rules, and bar/chrome guide.
- Open `docs/INDEX.md` line for `CONSUMER_GUIDE.md` and confirm the new description lists
  the new sections.
- Open `README.md` Integration Notes bullet and Documentation bullet and confirm both were
  updated.

---

## 7. Git Commit

After all edits pass verification, stage ONLY the documentation files (do NOT stage
`.kilo/plans/*` files in this commit — they are tracked separately by the workflow):

- **Stage:**
  - `docs/CONSUMER_GUIDE.md`
  - `docs/THEME.md`
  - `docs/INDEX.md`
  - `README.md`
- **Do NOT stage:** any `.kilo/plans/*` file, any `src/**` file.
- **Gitignore compliance:** run `git status` before committing; ensure no
  `.gitignore`-matching files (e.g. `node_modules/`, `dist/`) are staged.
- **Commit command:**

```text
git add docs/CONSUMER_GUIDE.md docs/THEME.md docs/INDEX.md README.md
git commit -m "docs(consumer-guide): add token compliance mandate, button/surface/text/chrome guides

- Add Token Compliance Mandate (90% rule) to CONSUMER_GUIDE.md
- Add Button Color Guide (variant x surface x state tables + focus ring)
- Add Surface Decision Tree
- Add Text Color Rules (with muted restriction on canvas/inset)
- Add Bar and Chrome Guide
- Update TOC; preserve existing sections, reordered only by new TOC
- Update cross-references in THEME.md, INDEX.md, README.md
- No token values/names changed; no hex re-declared in the guide"
```

> Single commit. Do not push (push happens at Step 5 of the Critical Workflow, to
> `origin` only).

---

## 8. Acceptance Criteria Mapping (spec §11)

| Spec criterion | Plan step |
|----------------|-----------|
| Guide contains the 5 new sections | Steps 5.2–5.3 |
| All color refs use `--cba-*` names; no hex introduced | Step 6.1 (regex search) + planning token verification |
| Existing sections preserved, reordered only by new TOC | Step 5.1 + Step 3 resolved order |
| Cross-references in THEME.md, INDEX.md, README.md updated | Steps 5.4–5.6 |
| `npm run lint` and `npm run build` still pass | Step 6.2 |

---

## 9. Out of Scope (NOT done in this step)

- Implementation of code changes (Step 4.2 — implementer).
- Code review / simplification (Step 4.3).
- Documentation polish beyond the spec's text (Step 4.4 — docs-specialist).
- Front-end implementation verification (Step 4.5a) — N/A for docs.
- Overall plan adherence (Step 4.5b — architector).
- Task completion / TODO marking / branch merge (Steps 4.6 & 5 — implementer/Plan Agent).
- Any change to `src/theme/_variables.scss` or component SCSS.
- Any change to `docs/theme-preview.html` (Task 2).
- Any regression test (Task 4).

---

## 10. Summary

- **What this step produces:** this plan file at
  `.kilo/plans/20260806-task3-consumer-guide.md`.
- **Next step owner:** the Plan Agent presents this plan to the user for approval, then
  delegates Step 4.2 to an implementer.
- **No code files were written.** No git commands were run. No non-`.md` files touched.
  This step conforms to the architector boundary (plan only).