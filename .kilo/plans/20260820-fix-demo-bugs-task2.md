# Implementation Plan — Task 2: Header Search Input Centering

- **TODO**: `.agent/todos/20260819/20260819-todo-1.md` — *header search input* section (line 16–18).
- **Front-end spec**: `.kilo/plans/20260820-fix-demo-bugs-task2-frontend-spec.md`.
- **Target**: JUNIOR developer under 50% restriction.

## Objective

Center the demo app shell header search input at the geometric center of the header bar, keeping its current width behavior (50% width, capped at 600px), with a pure CSS change. No HTML, no JS, no new tokens.

## Scope Boundaries (HARD)

- Modify ONLY: `projects/demo/src/app/app.component.scss`.
- DO NOT touch: `projects/demo/src/app/app.component.html`, `app.component.ts`, library files, tokens, other demo sections.
- DO NOT add new SCSS variables, new `--cba-*` tokens, or new selectors.
- DO NOT rename existing classes or selectors.
- DO NOT change `$search-max-width` or `$header-height` values.
- If any file/line differs from what this plan describes, STOP and return a question to the caller. Do NOT guess.

## Root Cause Recap

`.shell-header` uses `justify-content: space-between` and `.shell-header__center` uses `margin: 0 auto` on a `flex: 0 0 50%` item. `auto` margins center a flex item within the *remaining free space*, not the full header. Because the left group (Back button + brand text) is wider than the right group (two icon-only buttons), the search container is visually shifted right of the true center.

Fix: make the left and right groups equal-width flex gutters (`flex: 1 1 0; min-width: 0;`), remove `justify-content: space-between` from the header, and remove `margin: 0 auto` from the center column. Centering then emerges from the symmetric side gutters.

## Pre-Implementation Checks

1. Confirm `projects/demo/src/app/app.component.scss` exists and current content matches the snippets in step "Exact Edits" below. Read it with `vscode-mcp-server_read_file_code` (path: `projects/demo/src/app/app.component.scss`).
   - If the file does not exist or the `oldCode` blocks below do not match exactly, STOP and return a question to the caller.
2. Confirm `projects/demo/src/app/app.component.html` contains the three-column markup classes `shell-header__left`, `shell-header__center`, `shell-header__right`. Read it (path: `projects/demo/src/app/app.component.html`). Do NOT modify it; this is only a guard to confirm no markup change is needed.

## Exact Edits

All edits in a single file: `projects/demo/src/app/app.component.scss`.
Use `vscode-mcp-server_replace_lines_code` for each block. Line numbers refer to the current file state (147 total lines).

### Edit 1 — `.shell-header` block (lines 39–47)

Remove `justify-content: space-between;` so the header lays children out by their own flex basis rather than pushing left/right to the edges.

`originalCode`:
```scss
.shell-header {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--cba-space-3);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
}
```

`content`:
```scss
.shell-header {
  height: $header-height;
  display: flex;
  align-items: center;
  padding: 0 var(--cba-space-3);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
}
```

startLine: 39, endLine: 47.

### Edit 2 — `.shell-header__left, .shell-header__right` + center + brand (lines 48–65)

Split the shared left/right rule into a shared base plus individual `justify-content`, add equal-width flex gutters, and rewrite the center column to drop `margin: 0 auto` and use `flex: 0 1` instead of `flex: 0 0`.

`originalCode`:
```scss
.shell-header__left,
.shell-header__right {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
}
.shell-header__center {
  flex: 0 0 50%;
  max-width: $search-max-width;
  margin: 0 auto;
}
.shell-header__search {
  width: 100%;
}
.shell-header__brand {
  font-weight: 600;
  color: var(--cba-text-primary);
}
```

`content`:
```scss
.shell-header__left,
.shell-header__right {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
  flex: 1 1 0;
  min-width: 0;
}
.shell-header__left {
  justify-content: flex-start;
}
.shell-header__right {
  justify-content: flex-end;
}
.shell-header__center {
  flex: 0 1 $search-max-width;
  width: 50%;
  max-width: $search-max-width;
}
.shell-header__search {
  width: 100%;
}
.shell-header__brand {
  font-weight: 600;
  color: var(--cba-text-primary);
}
```

startLine: 48, endLine: 65.

## What NOT to Change

- Do NOT modify `.shell-header__brand` rules.
- Do NOT modify `.shell-header__search` (keep `width: 100%`).
- Do NOT touch `.preview-bar`, `.demo-swatch-grid`, `.demo-surface*`, `.demo-input-grid`, `.demo-size-row`, `.demo-pill*`, `.demo-form-grid`, `.demo-form-actions`, `.shell-footer*`, or the `:host` / `.demo-app` rules.
- Do NOT touch the SCSS variables block (lines 5–14).
- Do NOT add comments explaining the change.

## Rules Compliance Self-Check (before commit)

- `max-lines-per-file.md`: file stays at ~151 lines (well under 200). OK.
- `max-depth.md`: no nesting added; selectors stay flat. OK.
- `single-section-boolean-conditions.md`: N/A (no conditions).
- `prefer-private-members.md`: N/A (SCSS).
- `no-commented-code.md`: no comments added. OK.
- `self-documenting-code.md`: class names unchanged and self-descriptive. OK.
- `newline-prevention.md`: real newlines only. OK.
- `changelog-versioning.md`: handled in Step 3 of Critical Workflow (not this task). Do NOT bump version or changelog here.

## Verification Steps

Run each as a single `bash` command (not chained). Stop and report on first failure.

1. Lint:
   - Command: `npm run lint`
   - Expected: exits 0, no new warnings/errors.
2. Build demo:
   - Command: `npm run build:demo`
   - Expected: exits 0, demo build artifacts produced.
3. (Optional, only if a dev server is already available) Visual check: open the demo, confirm the search input's horizontal center aligns with the header bar's horizontal center, left group stays left, right group stays right, input width is ~50% capped at 600px. Skip if no dev server; the build + lint pass is the required gate.

## Acceptance Criteria (from front-end spec)

- [ ] The visual center of the search input aligns with the geometric center of the header bar.
- [ ] The left group stays left and the right group stays right.
- [ ] Search input width is still 50% of the header, capped at 600px.
- [ ] No new `--cba-*` tokens are introduced.
- [ ] No changes are made to `projects/demo/src/app/app.component.html`.
- [ ] `npm run lint` passes.
- [ ] `npm run build:demo` passes.

## Commit

After verification passes, commit ONLY `projects/demo/src/app/app.component.scss` with message:

```
fix(demo): center header search input via equal-width side gutters
```

Do NOT stage any other file. Do NOT amend previous commits. Do NOT push (push is restricted to Step 5 of the Critical Workflow).

## Out of Scope

- HTML changes.
- Library (`projects/cobranza-app-ui/`) changes.
- Any other TODO section (modules footer, modules header btns, 50% mode, color tokens, buttons/pills, icons, texts/fonts, footer bar btns, button/pill sizes).
- Version bump / changelog.
- Git branch creation / switch (restricted to Step 2).
- Git push (restricted to Step 5).
