# Front-end Technical Specification — Task 3: Consumer Guide Enhancement

**TODO Source:** `.agent/todos/20260805/20260805-todo-1.md` (line 18)
**Global Plan:** `.kilo/plans/20260806-theme-tokens-preview-guide.md`
**Branch:** `feat/theme-refinement-tokens-preview-guide`
**Date:** 2026-08-06

---

## 1. Scope

This specification defines the content and structure updates for `docs/CONSUMER_GUIDE.md` so that AI agents generating Shell or MFE code can apply the `--cba-*` design tokens correctly and consistently.

It does **not** change any token values, token names, or component SCSS. It only adds prescriptive written guidance, reference tables, and cross-references.

---

## 2. Target framework and files

| Item | Value |
|------|-------|
| Project framework | Angular 22 (library `@cobranza-apps/ui`) |
| Theme technology | CSS custom properties (`--cba-*`) emitted from `src/theme/theme.scss` |
| Authoritative token values | `src/theme/_variables.scss` and `.agent/project-info/brief.md §5` |
| Files to update | `docs/CONSUMER_GUIDE.md` (primary), `docs/THEME.md`, `docs/INDEX.md`, `README.md` (cross-references only) |

---

## 3. Token Compliance Mandate

Add a new section immediately after the introduction, before "Theme load (once)".

**Proposed heading:** `## Token Compliance Mandate`

**Proposed wording:**

> AI agents generating Shell or MFE code MUST use `--cba-*` tokens for at least 90 % of all color and style declarations.
>
> - Prefer `var(--cba-*)` or the opt-in `.cba-*` utility classes.
> - Hard-coded hex values, RGB/RGBA literals, or Bootstrap default colors are not allowed except for one-off edge cases.
> - Every edge-case hard-coded value MUST be documented with a `TODO` comment explaining why the token cannot be used and linking to this guide.
> - If a needed color does not exist as a token, do not invent a new hex value — open a task to extend the theme.
>
> Token values are authoritative in [`src/theme/_variables.scss`](../src/theme/_variables.scss) and [`.agent/project-info/brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme). This guide references tokens only; it never re-declares hex values.

---

## 4. Button Color Guide

Add a new section after the mandate.

**Proposed heading:** `## Button Color Guide`

**Intro text:**

> Use `CbaButton` from `@cobranza-apps/ui` whenever possible. When custom buttons are unavoidable, map every state to the tokens below. Hover and active states use the same base tokens plus an overlay (`--cba-hover` or `--cba-active`). Disabled and loading states share one treatment: `opacity: 0.6` and `cursor: not-allowed`.

### 4.1 Variant × surface base mapping

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

**Rationale for `secondary` on elevated:** the component's default secondary fill is `--cba-bg-elevated`. When the button sits on an already-elevated surface, swap the fill to `--cba-bg-secondary` and strengthen the border to `--cba-border-default` so the button remains visible.

### 4.2 State overlays

| State | Solid variants (`primary`, `danger`, `success`) | `secondary` | `ghost` |
|-------|--------------------------------------------------|-------------|---------|
| normal | base tokens only | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `background-image: linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | same as solid variants | `background-color: var(--cba-hover)` |
| active | `background-image: linear-gradient(var(--cba-active), var(--cba-active))` over base bg | same as solid variants | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same as solid variants | same as solid variants |

### 4.3 Focus ring

All button variants MUST use `:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }`.

---

## 5. Surface Decision Tree

Add a new section after the Button Color Guide.

**Proposed heading:** `## Surface Decision Tree`

**Proposed table:**

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
3. Is it a header band, dropdown, popover, modal, or selected/active fill that must read lighter than its container? → **elevated**.
4. Is it recessed, a table header, or a footer/status bar inside a module? → **inset**.
5. Never use the same background token for two adjacent hierarchical layers (e.g. do not make the workspace canvas the same color as the module panel).

---

## 6. Text Color Rules

Add a new section after the Surface Decision Tree.

**Proposed heading:** `## Text Color Rules`

### 6.1 Allowed text tokens by surface

| Surface | `--cba-text-primary` | `--cba-text-secondary` | `--cba-text-muted` | `--cba-text-inverse` |
|---------|----------------------|------------------------|--------------------|----------------------|
| canvas (`--cba-bg-primary`) | allowed | allowed | **RESTRICTED** — fails WCAG AA | allowed on accent bg only |
| panel (`--cba-bg-secondary`) | allowed | allowed | allowed | allowed on accent bg only |
| elevated (`--cba-bg-elevated`) | allowed | allowed | allowed | allowed on accent bg only |
| inset (`--cba-bg-tertiary`) | allowed | allowed | **RESTRICTED** — fails WCAG AA | allowed on accent bg only |
| accent bg (`--cba-accent-*`) | not used | not used | not used | **required** |

### 6.2 Usage guidance

- Default body text: `--cba-text-primary`.
- Labels, meta-data, placeholders: `--cba-text-secondary`.
- Disabled hints, captions, tertiary meta-data: `--cba-text-muted` **only on panel or elevated**.
- Text on top of `--cba-accent-primary`, `--cba-accent-danger`, or `--cba-accent-success`: `--cba-text-inverse`.
- On canvas and inset, do not use `--cba-text-muted`. Use `--cba-text-secondary` for lower-emphasis text instead.

---

## 7. Bar and Chrome Guide

Add a new section after the Text Color Rules.

**Proposed heading:** `## Bar and Chrome Guide`

| Chrome element | Background | Border | Text | Height / min-height | Notes |
|----------------|------------|--------|------|---------------------|-------|
| Shell header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for brand, `--cba-text-secondary` for muted items | `--cba-header-height` (56px) | Use `--cba-focus-ring` for focusable items. |
| Shell footer | `--cba-bg-primary` (recommended) OR `--cba-bg-elevated` (documented Shell choice) | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` (64px) | Footer section pills: bg `--cba-bg-secondary`, border `--cba-border-strong`, active pill border `--cba-accent-primary`. |
| Module header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for title, `--cba-text-secondary` for actions | `--cba-module-header-min-height` (40px) | Implemented by `cba-module-header`; do not recreate with custom CSS. |
| Module footer | `--cba-bg-tertiary` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-secondary` or status accent | auto | Implemented by `cba-module-footer` if used; otherwise apply same tokens. |
| Footer section pill | `--cba-bg-secondary` | `border: 1px solid var(--cba-border-strong)` | `--cba-text-secondary` | auto | Active pill: `border-color: var(--cba-accent-primary)`, `color: var(--cba-text-primary)`. |

---

## 8. Proposed updated Table of Contents

Update the existing TOC in `docs/CONSUMER_GUIDE.md` to include the new sections:

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

---

## 9. Cross-reference updates

The following files only need small link or description updates; no token values or code.

### 9.1 `docs/THEME.md`

In the `### Surface hierarchy` subsection under `## Importing the Theme`, replace the existing cross-reference sentence with:

```markdown
See the [Consumer Guide](CONSUMER_GUIDE.md) for the token compliance mandate,
surface ownership map, button color guide, surface decision tree, text color rules,
and bar/chrome guide.
```

### 9.2 `docs/INDEX.md`

Update the `CONSUMER_GUIDE.md` description line under `## Getting started`:

```markdown
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Shell & MFE integration rules: token compliance mandate, theme load (once), surface ownership map, button color guide, surface decision tree, text color rules, bar/chrome guide, checklists, anti-patterns, quick verify.
```

### 9.3 `README.md`

In `## Integration Notes (Shell ↔ MFE)`, update the sentence referencing the Consumer Guide:

```markdown
- **Surface hierarchy and token usage are shared contracts** — Shell, Lib, and MFE each own specific
  surfaces (canvas / panel / elevated / inset). Follow the
  [Consumer Guide](./docs/CONSUMER_GUIDE.md) for the token compliance mandate, exact token mappings
  for buttons, surfaces, text, and chrome.
```

In `## Documentation`, update the `CONSUMER_GUIDE.md` bullet:

```markdown
- [`./docs/CONSUMER_GUIDE.md`](./docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules: token compliance mandate, theme load (once), surface ownership map, button color guide, surface decision tree, text color rules, bar/chrome guide, checklists, anti-patterns, quick verify.
```

---

## 10. Constraints and non-goals

- **Do not change token values.** All proposed content references `--cba-*` tokens by name only.
- **Do not rename tokens.** Use the exact token names from `src/theme/_variables.scss`.
- **Do not re-declare hex values** in the guide. Point readers to `brief.md §5` and `src/theme/_variables.scss`.
- **Do not modify component SCSS.** This task is documentation-only.
- Keep the guide concise but comprehensive enough for an AI agent to generate concrete SCSS/CSS.

---

## 11. Acceptance criteria

- [ ] `docs/CONSUMER_GUIDE.md` contains the Token Compliance Mandate, Button Color Guide, Surface Decision Tree, Text Color Rules, and Bar and Chrome Guide.
- [ ] All color references in the new sections use `--cba-*` token names; no hex values are introduced.
- [ ] Existing sections (Theme load, Surface ownership map, Shell/MFE checklists, Anti-patterns, Quick verify, Cross-References) are preserved and reordered only by the new TOC.
- [ ] Cross-references in `docs/THEME.md`, `docs/INDEX.md`, and `README.md` are updated.
- [ ] `npm run lint` and `npm run build` still pass after documentation-only changes.
