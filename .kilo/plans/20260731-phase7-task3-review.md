# Task 3 — Code Review Findings

## Checks performed

- Read implementation plan `.kilo/plans/20260731-phase7-task3-plan.md`.
- Verified `src/public-api.ts` was not changed in the Task 3 commit range.
- Verified no files under `src/` were changed in Task 3.
- Ran `npm run lint` — passed.
- Ran `npm test` — 16 suites, 135 tests passed.
- Ran `npm run build` — built `@cobranza-apps/ui` successfully.
- Verified `dist/` is gitignored and not staged.
- Checked all links in `README.md` §Documentation and `docs/INDEX.md` against existing files.

## Issues found

### 1. Import snippets use non-exported friendly class names (blocker)

The public API exports component classes with the `Component` suffix (confirmed in `dist/types/cobranza-apps-ui.d.ts`). Several import statements added in Task 3 use the short friendly names (`ModuleContainer`, `CbaButton`, `CbaModal`, etc.) that are **not** exported. Consumers copying these snippets will get TypeScript errors.

Affected locations:

- `README.md` line 86:
  - `import { ModuleHeaderComponent, ModuleContainer, CbaButton } from '@cobranza-apps/ui';`
  - Fix: `ModuleContainer` → `ModuleContainerComponent`, `CbaButton` → `CbaButtonComponent`.
- `docs/USAGE.md` line 157:
  - `import { ModuleHeaderComponent, ModuleContainer } from '@cobranza-apps/ui';`
  - Fix: `ModuleContainer` → `ModuleContainerComponent`.
- `docs/USAGE.md` line 212:
  - `import { CbaButton, CbaCard, CbaBadge } from '@cobranza-apps/ui';`
  - Fix: `CbaButtonComponent, CbaCardComponent, CbaBadgeComponent`.
- `docs/USAGE.md` line 354:
  - `import { CbaModal } from '@cobranza-apps/ui';`
  - Fix: `CbaModal` → `CbaModalComponent`.
- `docs/USAGE.md` line 674:
  - `import { CbaButton } from '@cobranza-apps/ui';`
  - Fix: `CbaButton` → `CbaButtonComponent`.

### 2. Component-doc audit did not fully satisfy the explicit Non-goals requirement

Implementation plan §F required every public component doc to contain a Non-goals section. Several docs rely on scattered bullets inside `## Important notes` or styling sections instead of a clear `## Non-goals` heading:

- `docs/CBA_CARD.md` — non-goal is a bullet under styling notes.
- `docs/CBA_BADGE.md` — no explicit non-goal.
- `docs/CBA_DROPDOWN.md`, `docs/CBA_POPOVER.md`, `docs/CBA_TYPEAHEAD.md` — ownership disclaimers are under `## Important notes`.
- `docs/MODULE_HEADER.md` — drag ownership is in a `## Drag note` section.

Note: the code-simplifier plan `.kilo/plans/20260731-phase7-task3-simplify.md` already proposes standardizing these sections into `## Non-goals`; apply that proposal to satisfy the audit requirement.

## What passed

- `src/public-api.ts` unchanged in Task 3; no public API leaks.
- No source code edits in `src/`.
- README quick-start template added and uses correct selectors.
- README missing component-doc links (`CBA_INPUT.md`, `CBA_SELECT.md`, `CBA_DATEPICKER.md`) added.
- `docs/INDEX.md` created and links to all existing doc files.
- Agent-meta docs moved to `.agent/docs/`; `.agent/project-structure.md` updated.
- `CBA_MODAL.md` and `CBA_DATEPICKER.md` include Spanish aria-label notes.
- Build, test, and lint are green.
- `dist/` is untracked and gitignored.

## Recommended fix commit

`docs: correct exported class names in import snippets and standardize Non-goals sections`
