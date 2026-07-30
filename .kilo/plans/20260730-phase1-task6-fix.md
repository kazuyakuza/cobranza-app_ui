# Phase 1 — Task 6 Fix Plan: README fallback claim is inaccurate

> Source todo: `.agent/todos/20260729/20260729-todo-2.md` (Task 6)
> Implementation plan: `.kilo/plans/20260730-phase1-task6-plan.md`
> Scope: README.md only. `ng-package.json` and `package.json` are correct.

---

## Issue found

`README.md` line 80 claims that an explicit fallback import is available:

```markdown
> ... a fallback explicit path `@use '@cobranza-apps/ui/theme/theme'` is also available.
```

This is **not true** given the current `package.json` `exports` field:

```json
"exports": {
  "./theme": {
    "sass": "./theme/theme.scss"
  }
}
```

Once `exports` is defined, Node / Sass package-importers treat it as an allow-list. Only `./theme` is exposed; the subpath `./theme/theme` is **not** exported, so `@use '@cobranza-apps/ui/theme/theme'` will fail for consumers using modern Sass/bundler resolution.

## Impact

- Consumers may copy the README's fallback import and get a build-time resolution error.
- The README contradicts the `package.json` contract.

## Fix

Edit `README.md` line 80 and remove the fallback claim. Keep the authoritative statement about the supported global import and the emitted CSS variables / utility classes.

**Current (line 80):**

```markdown
> The theme is published as SCSS via the `./theme` package subpath (see `package.json` `exports`). `@use '@cobranza-apps/ui/theme'` is the supported global import; a fallback explicit path `@use '@cobranza-apps/ui/theme/theme'` is also available. Loading the theme emits the `--cba-*` variables on `:root` and the opt-in `.cba-*` utility classes.
```

**Replace with:**

```markdown
> The theme is published as SCSS via the `./theme` package subpath (see `package.json` `exports`). `@use '@cobranza-apps/ui/theme'` is the supported global import. Loading the theme emits the `--cba-*` variables on `:root` and the opt-in `.cba-*` utility classes.
```

## Verification

1. `npm run build` exits `0`.
2. `dist/theme/theme.scss` and all four partials exist.
3. `dist/package.json` contains the `./theme` export with `sass` condition and the auto-generated root `.` export.
4. `npx prettier --check README.md` exits `0`.

## Notes

- Do **not** add `./theme/theme` or `./theme/*` to `package.json` `exports`. The implementation plan explicitly chose a single `./theme` subpath to keep the public surface minimal.
- No changes to `ng-package.json` or `package.json` are required.
