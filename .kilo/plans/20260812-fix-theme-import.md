# Global Plan — Fix @cobranza-apps/ui theme import for Angular dev-server compatibility

**TODO File:** `.agent/todos/20260812/20260812-todo-1.md`
**Date:** 2026-08-12

---

## Global Pre-Analysis

**Problem:** `@use '@cobranza-apps/ui/theme';` fails in `ng serve` because Angular's internal Sass importer does not resolve the library's `package.json` `exports["./theme"]` conditions. The importer looks for literal files (`theme.scss` or `theme/_index.scss`) at the package root — neither exists. The actual theme entry is at `dist/theme/theme.scss`, exposed only via the `exports` map which Angular ignores.

**Fix Strategy (Option A):** Create a root-level `theme.scss` re-export file that Angular's bare-bones Sass resolver can find without package-export conditions. This is backward-compatible with the existing `exports["./theme"]` map and requires zero consumer changes.

**Scope:**
1. Add `theme.scss` at the project root (forwarding `./theme/theme.scss`).
2. Configure `ng-package.json` to copy `theme.scss` to `dist/` root during build.
3. Bump `package.json` version (patch bump — bug fix).
4. Update `CHANGELOG.md` with dated entry.
5. Update `context.md` "Recent Changes".
6. Verify `npm run build` produces `dist/theme.scss` and the forward resolves.

**Not in scope:**
- Changes to consumer projects (Shell/MFEs). They can remove the `stylePreprocessorOptions.includePaths` workaround after this library fix is published and they upgrade.
- Changes to `exports["./theme"]` map (kept as-is for bundlers that DO honor it).
- New components or tokens.

---

## Task Breakdown

### Task: Fix theme import + docs/changelog

#### Steps

| Step | Description | Sub-Agent |
|------|-------------|-----------|
| 2 | Git Feature Branch Setup | implementer |
| 3 | Version Update | implementer |
| 4.1b | Analysis & Planning | architector |
| 4.2 | Implementation | implementer |
| 4.3 | Code Review & Simplification | code-reviewer + code-simplifier |
| 4.3-fix | Apply review fixes | implementer |
| 4.4 | Documentation | docs-specialist |
| 4.5b | Overall Plan Adherence | architector |
| 4.6 | Task Completion | implementer |
| 5 | TODO File Completion | implementer |

---

## Constraints

- Do NOT remove existing `exports["./theme"]` map — keep backward compatibility.
- Follow `.kilo/rules/changelog-versioning.md`: no `[Unreleased]` section; dated header only.
- Follow `brief.md` §8.1 Token Change Checklist if any token files touched (none expected for this fix).
- `npm run build` must pass; `npm run lint` must pass.
- Root-level `theme.scss` must use `@forward './theme/theme.scss'` so Sass resolves relative to the package root.
