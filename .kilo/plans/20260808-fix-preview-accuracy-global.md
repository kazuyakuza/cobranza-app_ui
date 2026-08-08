# Global Plan — Fix Preview HTML Accuracy (2026-08-08)

**TODO File:** `.agent/todos/20260808/20260808-todo-1.md`
**Detailed Plan:** `.kilo/plans/20260808-fix-preview-accuracy.md`
**Task:** Align `docs/theme-preview.html` module header mockup with actual Angular components
**Front-end Related:** Yes

---

## Global Pre-Analysis

This is a **front-end focused, documentation/preview fix** — no runtime component code changes. The goal is to make the standalone `docs/theme-preview.html` render the module header and container exactly as the compiled Angular components would, using the same CSS classes, icons, and token values.

Key technical decisions:
- **Font Awesome CDN** is required because the preview is a standalone HTML file (no Angular runtime to render `<fa-icon>` components). Using the CDN with `<i class="fa-solid fa-*">` tags is the closest approximation.
- **SCSS duplication** into the preview's inline `<style>` is unavoidable since Angular component styles are encapsulated and not emitted into the standalone preview CSS. A prominent comment will mark the copied sections.
- **No token or component source changes** — this is purely aligning the preview mockup. `npm run build:preview` should produce zero diff.

---

## Step 2: Git Feature Branch Setup

**Agent:** implementer
**Branch:** `feat/fix-preview-accuracy`

1. `git status` — verify clean working tree (the untracked plan files from Phase 10 are expected).
2. Switch to `main` (already there).
3. Create and switch to `feat/fix-preview-accuracy`.

---

## Step 3: Version Update

**Agent:** implementer
**Current Version:** 0.12.0
**New Version:** 0.12.1 (patch — preview fix, no API changes)

1. Bump `package.json` version to `0.12.1`.
2. Add `[0.12.1] — 2026-08-08` header to `CHANGELOG.md` under `Fixed` category.
3. Commit as `chore: bump version to 0.12.1`.

---

## Task 1: Align theme-preview.html with actual components

### 4.1a. Front-end Technical Specification
**Agent:** frontend-specialist
**Output:** `.kilo/plans/20260808-fix-preview-accuracy-frontend-spec.md`

Produce a concise front-end spec covering:
- Font Awesome CDN version and integrity strategy
- Exact HTML structure mapping from `module-header.component.html` to preview markup
- Exact CSS selector mapping from `module-header.component.scss` and `module-container.component.scss` to preview inline styles
- Token substitution table (hardcoded px → `var(--cba-*)`)
- Aria-label values (Spanish, from `CBA_UI_MESSAGES`)
- Density strip (`renderDensityStrip`) update requirements

### 4.1b. Analysis & Planning
**Agent:** architector
**Input:** Read the front-end spec from 4.1a
**Output:** `.kilo/plans/20260808-fix-preview-accuracy-task1.md`

Generate detailed implementation plan with tiny steps covering:
1. Add Font Awesome CDN to `<head>`
2. Copy `module-header.component.scss` selectors into preview `<style>`
3. Copy `module-container.component.scss` selectors into preview `<style>`
4. Replace `.module-header` mockup with `<header class="cba-module-header">` structure
5. Replace `.module` container classes with `.cba-module-container`
6. Fix hardcoded px values (12px → `--cba-radius-lg`, 42px → `--cba-module-header-min-height`, 15px → `--cba-font-size-heading-md`, etc.)
7. Update `renderDensityStrip()` JS function to use new component structure
8. Run `npm run build:preview` and verify zero diff
9. Run `npm test` and `npm run lint`
10. Update `CHANGELOG.md`
11. Commit

**Plan Agent will present this plan to user for approval.**

### 4.2. Implementation
**Agent:** implementer

Execute the approved plan step-by-step. Commit after each logical chunk (CDN addition, SCSS copy, HTML replacement, hardcoded fixes, density strip, verification).

### 4.3. Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)

**code-reviewer:** Check for:
- Incorrect icon names or order
- Missing CSS selectors from component SCSS
- Hardcoded values still present
- Test breakages (`preview-html.spec.ts`)
- Accessibility (aria-labels in Spanish)

**code-simplifier:** Check for:
- Duplicate CSS that can be consolidated
- Unnecessary complexity in density strip update
- Opportunities to use utility classes instead of inline styles

Both save fix/simplification plans to `.kilo/plans/20260808-fix-preview-accuracy-task1-review.md`.

**Plan Agent reviews and assigns fix/simplification plans to implementer.**

### 4.4. Documentation
**Agent:** docs-specialist

1. Add prominent HTML comment in preview `<style>` marking copied SCSS sections: `/* Copied from src/components/module-header/module-header.component.scss — keep in sync */`
2. Update `docs/theme-preview.html` file header comment to note Font Awesome CDN dependency.
3. Verify `CHANGELOG.md` entry is complete and references related docs.

### 4.5a. Front-end Implementation Verification
**Agent:** frontend-specialist

Verify against the spec from 4.1a:
- Icon order: drag → collapse → size toggle → fullscreen → remove
- Icon names match Font Awesome 6/7 solid pack
- CSS classes match component BEM naming exactly
- No hardcoded values where tokens exist
- Density strip uses same structure
- Preview renders correctly in browser

### 4.5b. Overall Plan Adherence
**Agent:** architector

Check implementation plan adherence:
- All steps from 4.1b executed
- `npm test` and `npm run lint` pass
- `preview-html.spec.ts` stable (TOKEN_ROLES length 9, required IDs present)
- No unintended changes to `src/theme/*` or component source files
- `npm run build:preview` produces expected output

### 4.6. Task Completion
**Agent:** implementer

1. Add `[DONE]` to task in `.agent/todos/20260808/20260808-todo-1.md`
2. Mark sub-items as done (`[x]`)
3. Commit with meaningful message.

---

## Step 5: TODO File Completion

**Agent:** implementer

1. Rename TODO file to `20260808-todo-1-DONE.md`.
2. Ensure all files committed in `feat/fix-preview-accuracy`.
3. Switch to `main`, merge feature branch.
4. On success: delete feature branch.
5. Push `main` to `origin` only.

---

## Step 6: Finish

Provide short resume of work done.
