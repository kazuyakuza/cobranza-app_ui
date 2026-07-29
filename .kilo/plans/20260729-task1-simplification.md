# Simplification Plan — Task 1: Initialize Project Info

**Scope:** Review only the four newly created `.agent/project-info/*.md` files for redundancy, verbosity, and duplication. Do not modify `brief.md` (source of truth) or other files.

**Files reviewed:**
- `.agent/project-info/product.md`
- `.agent/project-info/context.md`
- `.agent/project-info/architecture.md`
- `.agent/project-info/tech.md`

---

## 1. Critical Fix: `context.md` — Immediate Next Steps Out of Sync

**Issue:** The file lists 5 next steps (Tasks 2–6), but the TODO file only defines 4 tasks. Tasks 5 and 6 ("Implement ModuleHeader/ModuleContainer") do not exist yet.

**Suggested edit:**

```markdown
## Immediate Next Steps

1. **Task 2**: Update `README.md` for `@cobranza-apps/ui` consumers.
2. **Task 3**: Define project structure (create folders under `src/lib/`).
3. **Task 4**: Create `package.json` + `ng-package.json`, install dependencies.
```

Remove the non-existent Task 5 and Task 6 lines. The TODO file is the single source of truth for active tasks.

---

## 2. `product.md` — Tighten Wording and Remove Redundancy

### 2.1 Problem Definition

**Current:**

```markdown
The Company Back-office consists of a Shell hosting multiple Micro-frontends (MFEs). Each team (Shell and MFE) independently implements visual components and theme tokens, causing:

- Duplicated effort across teams for common UI primitives.
- Inconsistent intermediate-gray theme rendering across back-office modules.
- Lack of a single source of truth for shared UI, eroding visual coherence.
```

**Simplified:**

```markdown
The Company Back-office Shell hosts multiple MFEs. Each team independently implements visual components and theme tokens, causing duplicated effort, inconsistent intermediate-gray rendering, and no single source of truth for shared UI.
```

Reason: Converts three near-redundant bullets into one compact sentence.

### 2.2 Product Goals

**Current:**

```markdown
- Provide a coherent, calm, professional gray design system via `--cba-` CSS custom properties.
- Ship reusable layout primitives (`ModuleHeader`, `ModuleContainer`) tailored to the floating workspace pattern.
- Keep wrappers thin and low-coupling around Bootstrap 5 / ng-bootstrap — no business logic leaks into the library.
- Encapsulate the theme so each consumer (Shell or MFE) controls import and avoids global style conflicts.
```

**Simplified:**

```markdown
- Provide a calm, professional gray design system via `--cba-` CSS custom properties.
- Ship reusable layout primitives (`ModuleHeader`, `ModuleContainer`) for the floating workspace.
- Keep Bootstrap 5 / ng-bootstrap wrappers thin and business-logic-free.
- Encapsulate the theme so each consumer controls its own import.
```

Reason: Removes filler words (`coherent`, `tailored to`, `low-coupling`, `and avoids global style conflicts`) without losing meaning.

### 2.3 Target Consumers

**Current:**

```markdown
Two distinct layers:

1. **Library consumers** — Company Back-office **Shell** team and every **MFE** team. They depend on `@cobranza-apps/ui` for visual primitives and theme.
2. **End users** — Back-office operators using the Shell-hosted interface. Desktop-only, desktop-first.
```

**Simplified:**

```markdown
- **Library consumers** — Shell and MFE teams that depend on `@cobranza-apps/ui` for visual primitives and theme.
- **End users** — Back-office operators using the Shell-hosted interface (desktop-only).
```

Reason: Removes the "Two distinct layers" framing and the redundant "desktop-first" phrase.

### 2.4 UX Focus

**Current:**

```markdown
- **Modern professional, calm, friendly** — not classic rigid corporate.
- **Order and clarity** without feeling cold or aggressive.
- **Balanced spacing** — neither sparse empty regions nor cramped density.
- **High readability** with strong contrast and clear hierarchy.
- **Desktop-only** — no mobile considerations for now.
- **Encapsulated theme** — each consumer imports and controls the theme; prefer `ViewEncapsulation.Emulated`.
- **Thin wrappers first** — start simple, extend only when needed.
```

**Simplified:**

```markdown
- **Modern professional, calm, friendly** — not rigid corporate.
- **Order and clarity** without feeling cold or aggressive.
- **Balanced spacing** — neither sparse nor cramped.
- **High readability** with strong contrast and clear hierarchy.
- **Desktop-only** — no mobile considerations.
- **Encapsulated theme** — consumers import and control the theme.
- **Thin wrappers first** — start simple, extend only when needed.
```

Reason: Removes redundant qualifiers (`classic`, `for now`, `prefer ViewEncapsulation.Emulated` is an implementation detail better left to `architecture.md`).

### 2.5 Accessibility Goals

**Current:**

```markdown
- WCAG AA target for readability (high contrast text and interactive elements).
- Visible focus rings using `--cba-focus-ring`.
- Meaningful `aria-*` attributes on interactive `ModuleHeader` controls.
- Keyboard-operable buttons.
```

**Simplified:**

```markdown
- WCAG AA readability target.
- Visible focus rings via `--cba-focus-ring`.
- Meaningful `aria-*` attributes on interactive `ModuleHeader` controls.
- Keyboard-operable buttons.
```

Reason: Parenthetical expansion is redundant with the first bullet itself.

---

## 3. `architecture.md` — Reduce Duplication and Detail

### 3.1 Folder / Layout Tree

**Current:** Full tree with `docs/`, `USAGE.md`, and many nested folders.

**Simplified:** Replace the large tree with a compact list:

```markdown
## Folder / Layout

```
src/lib/
  components/   - module-header, module-container, button, card, badge, empty-state, skeleton, modal, ...
  theme/        - variables, utilities, mixins, theme.scss
  directives/   - autofocus, click-outside, ...
  public-api.ts
```

Concrete folder creation happens in Task 3.
```

Reason: The original tree includes project-level files (`README.md`, `docs/`, `USAGE.md`) that are not part of the `src/lib/` layout and may never be created. The simplified version focuses only on the library source.

### 3.2 Token Categories

**Current:** Lists all token categories in detail.

**Simplified:**

```markdown
- Token categories (backgrounds, text, borders, accents, interactive states, layout constants, radius, shadows, spacing) are defined in [brief.md](brief.md) section 5.
```

Reason: `brief.md` is the source of truth for token values; listing categories here duplicates the brief and adds maintenance surface.

### 3.3 Primary Font Details

**Current:** `Primary font: Inter (system-ui fallback), base size 14px, line-height 1.5.`

**Suggestion:** Remove this line entirely. Font details are token values and belong in `brief.md`, not architecture.

### 3.4 Component Contracts

**Current:** Full input/output tables for `ModuleHeader` and `ModuleContainer`.

**Simplified:** Keep a summary paragraph plus a minimal table of names only, or move the full tables to `brief.md` if they are not already there. Example:

```markdown
### ModuleHeader

Inputs: `title`, `size`, `isCollapsed`, `isFullscreen`, `status`.  
Outputs: `collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`.  
Minimum height: 40px.

### ModuleContainer

Inputs: `size`, `isCollapsed`, `isFullscreen`, `padding`.  
Responsibilities: apply size classes, hide body on collapse, apply border-radius + shadow when not fullscreen, provide internal scroll.
```

Reason: Full type/default/description tables duplicate the brief and bloat the architecture file. A summary is sufficient for architectural context.

### 3.5 Other Components

**Current:** Lists variants and features for each component.

**Simplified:**

```markdown
### Other Components

`CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`, and thin form-control wrappers. Details per brief.md section 6.3.
```

Reason: Variant names and feature lists are spec-level details, not architecture.

### 3.6 Related Libraries

**Current:** Table includes `@cobranza-apps/ui` as its own row.

**Simplified:**

```markdown
## Related Libraries

| Library | Role |
| --- | --- |
| `@cobranza-apps/entities` | Shared domain models (already on npm) |
| `@cobranza-apps/mfe-events` | Typed event contracts Shell ↔ MFE (not yet published) |
```

Reason: A file does not need to list itself as a related library.

---

## 4. `tech.md` — Remove Repeated Notes and Reference Rules

### 4.1 Duplicate Exact-Pins Note

**Current:**

```markdown
> **Note**: Exact minor/patch versions are finalized in Task 4 when `package.json` is created. This file records the major version choices only.
```

and later:

```markdown
Exact pins are set in Task 4 (`package.json`).
```

**Simplified:** Keep only the first note; remove the second sentence.

### 4.2 Code Rules List

**Current:** Lists 5 specific `.kilo/rules/` constraints.

**Simplified:**

```markdown
- Code rules from `.kilo/rules/` apply (max file/method length, parameter limits, nesting depth, private members by default).
```

Reason: The rules are already enforced by `.kilo/rules/`; duplicating them here adds maintenance burden.

---

## 5. Cross-File Consistency

### 5.1 "Desktop-only" Mention

- `product.md` says desktop-only in Target Consumers and UX Focus.
- `tech.md` says desktop-only in Tooling Constraints.
- `architecture.md` does not need a separate mention if `product.md` owns this.

**Suggestion:** Keep desktop-only in `product.md` and `tech.md`. Remove the standalone line from `architecture.md` if added later; current file is fine.

### 5.2 "Not Yet Published" Note

- `context.md` and `architecture.md` both mention `@cobranza-apps/mfe-events` not being published.

**Suggestion:** Keep the note in both files; they serve different audiences (context = status tracker, architecture = integration dependency). Keep wording consistent.

### 5.3 Component Lists

- `product.md` In Scope lists components.
- `architecture.md` Folder / Layout and Other Components also list components.

**Suggestion:** `product.md` should keep the high-level list. `architecture.md` should reference the brief or product.md for the full list, as suggested in section 3.5 above.

---

## 6. Summary of Expected Impact

- `product.md`: ~66 lines → ~50 lines.
- `context.md`: 36 lines → ~30 lines after removing non-existent tasks.
- `architecture.md`: ~133 lines → ~90 lines after removing duplicate tables and token lists.
- `tech.md`: 70 lines → ~60 lines after removing duplicate notes and rule list.

Overall impact: reduced duplication, sharper focus per file, and alignment with the TODO file.

---

## 7. Files to Modify

1. `.agent/project-info/context.md`
2. `.agent/project-info/product.md`
3. `.agent/project-info/architecture.md`
4. `.agent/project-info/tech.md`

**No other files are touched.**
