# Implementation Plan — Task Group A (Demo Bug Fixes, Tasks 1–4)

**Date:** 2026-08-20
**TODO file:** `.agent/todos/20260820/20260820-todo-0.md`
**Front-end spec:** `.kilo/plans/20260820-fix-demo-bugs-taskA-frontend-spec.md`
**Plan file:** `.kilo/plans/20260820-fix-demo-bugs-taskA.md`
**Scope:** Bugs 1–4 from the TODO (the first four `##` sections). Tasks 5–6 (New customer form, Payment schedule redesign) are OUT OF SCOPE — do not touch them.
**Target implementer:** JUNIOR developer under 50% restriction. Follow each step verbatim. Do not make architectural decisions, do not edit files outside the list below, do not rename selectors or tokens.

---

## 0. Prerequisites & boundaries

- Work on the feature branch already created in Critical Workflow Step 2. **Do NOT create or switch branches.**
- **Do NOT bump `package.json` version** — that is restricted to Critical Workflow Step 3.
- **Do NOT run `git push`** — that is restricted to Critical Workflow Step 5.
- All token names must be copied verbatim from the spec; do not invent new `--cba-*` tokens.
- Use the structured editors (`vscode-mcp-server_replace_lines_code` / `vscode-mcp-server_create_file_code`) for every code change. Fall back to `edit` only if a structured editor cannot match the target.
- Before any commit, follow `.kilo/rules/gitignore-compliance.md`: read `.gitignore` and run `git status`; never stage `node_modules/`, `dist/`, `.angular/`, or any other ignored path.
- Commit after each logical bug fix with the exact message given in each step.

### Files in scope (modify only these)

| # | File | Type of change |
|---|------|----------------|
| 1 | `src/components/module-container/module-container.component.html` | Add footer slot (Bug 1) |
| 2 | `src/components/module-container/module-container.component.scss` | Add `__footer` styles (Bug 1) |
| 3 | `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` | Move footer to new slot (Bug 1) |
| 4 | `docs/CBA_MODULE_CONTAINER.md` | Document footer slot (Bug 1) |
| 5 | `src/components/module-footer/module-footer.component.scss` | Add `justify-content: flex-end` (Bug 3) |
| 6 | `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss` | Change grid columns (Bug 4) |
| 7 | `CHANGELOG.md` | Add dated entries for the lib changes |

### Files to READ-ONLY verify (Bug 2 — no edits expected)

| File | What to verify |
|------|----------------|
| `src/components/module-header/module-header.component.ts` | `faUpDownLeftRight` imported (line 21) and `protected readonly faDrag = faUpDownLeftRight;` present (line 165). |
| `src/components/module-header/module-header.component.html` | Drag button rendered unconditionally inside `@if (!isFullscreen())` with `<fa-icon [icon]="faDrag" aria-hidden="true" />`. |
| `src/components/module-header/module-header.component.scss` | `.cba-module-header__action--drag` has only `cursor: grab` / `:active { cursor: grabbing }`; no `display:none`, `visibility:hidden`, `opacity:0`, or `width:0`. |

### Execution order

Bug 1 (lib template → lib SCSS → demo usage → docs) → Bug 2 (verify + clean build) → Bug 3 (SCSS) → Bug 4 (SCSS) → CHANGELOG → final verification builds.

---

## BUG 1 — Module container footer projection slot

### Step 1.1 — Edit `src/components/module-container/module-container.component.html`

**Current content (entire file):**

```html
<div class="cba-module-container__header">
  <ng-content select="[cbaModuleContainerHeader]"></ng-content>
</div>

@if (!isCollapsed()) {
  <div class="cba-module-container__body">
    <ng-content></ng-content>
  </div>
}
```

**Replace the whole file with:**

```html
<div class="cba-module-container__header">
  <ng-content select="[cbaModuleContainerHeader]"></ng-content>
</div>

@if (!isCollapsed()) {
  <div class="cba-module-container__body">
    <ng-content></ng-content>
  </div>

  <div class="cba-module-container__footer">
    <ng-content select="[cbaModuleContainerFooter]"></ng-content>
  </div>
}
```

Rules (verbatim from spec §3.1.2):
- The footer `<div>` MUST be a sibling of `.cba-module-container__body`, both inside the same `@if (!isCollapsed())` block.
- The slot selector MUST be `[cbaModuleContainerFooter]` (exact casing).
- The footer wrapper MUST always render when expanded, even with no projected content.

### Step 1.2 — Edit `src/components/module-container/module-container.component.scss`

Insert a new block **immediately after** the closing `}` of `.cba-module-container__body` (i.e. after line 90, before the `/* Task 5 — padding modifiers */` comment on line 92).

**Insert exactly:**

```scss
/* Round 2 — footer band never scrolls, never shrinks; separated from body. */
.cba-module-container__footer {
  flex: 0 0 auto;
  min-width: 0;
  border-top: 1px solid var(--cba-border-default);
  background-color: var(--cba-bg-tertiary);
}
```

Rules:
- Use `--cba-border-default` (NOT `--cba-border-subtle` — the spec §3.1.3 final text uses `--cba-border-default`; the TODO body mentions `--cba-border-subtle` but the frontend spec §3.1.3 is the authoritative resolution and explicitly chooses `--cba-border-default` to match the existing module frame separator).
- Use `--cba-bg-tertiary` so the footer band matches `CbaModuleFooterComponent`'s own background (no visible seam).
- `flex: 0 0 auto` + `min-width: 0` mirrors the `__header` band semantics.
- Do NOT add padding, height, or scroll rules here — the projected `cba-module-footer` owns its own height/padding.

### Step 1.1/1.2 verification

Run:
```
npm run build:lib
```
Expected: zero errors. If errors mention an unknown token, re-check the token spelling against `src/theme/_variables.scss` (do not change the token name; fix the spelling to match the variables file).

### Step 1.3 — Edit `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

Only the inline template changes. The class body, inputs, `hasFooter` getter, and `noop()` stay untouched.

**Current template fragment (lines 44–47):**

```html
        <ng-content />
        @if (hasFooter) {
          <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
        }
```

**Replace with:**

```html
        <ng-content />
        @if (hasFooter) {
          <cba-module-footer
            cbaModuleContainerFooter
            [status]="footerStatus"
            [statusText]="footerText" />
        }
```

Rules:
- Keep the `@if (hasFooter)` guard exactly as-is.
- Keep `[status]` and `[statusText]` bindings unchanged.
- Add ONLY the `cbaModuleContainerFooter` attribute on the `cba-module-footer` element.
- Do NOT move the element out of `<cba-module-container>`.
- The `<ng-content />` line stays on its own line above the `@if` (it feeds the body slot).

### Step 1.4 — Edit `docs/CBA_MODULE_CONTAINER.md`

Three precise edits:

**(a) Content projection table** — replace the 2-row table (lines 84–87):

Current:
```markdown
| Slot | Selector | Purpose |
| --- | --- | --- |
| Header | `[cbaModuleContainerHeader]` attribute | Projects the module header (typically `<cba-module-header>`). Rendered in a fixed, non-scrollable flex band. |
| Body | default `<ng-content>` | Projects the MFE content. This region is the internal scroll container while expanded. |
```

Replace with:
```markdown
| Slot | Selector | Purpose |
| --- | --- | --- |
| Header | `[cbaModuleContainerHeader]` attribute | Projects the module header (typically `<cba-module-header>`). Rendered in a fixed, non-scrollable flex band. |
| Body | default `<ng-content>` | Projects the MFE content. This region is the internal scroll container while expanded. |
| Footer | `[cbaModuleContainerFooter]` attribute | Projects an optional footer band (typically `<cba-module-footer>`). Rendered below the body, inside the same `@if (!isCollapsed())` block, so it is removed together with the body when collapsed. Non-scrollable, never shrinks. |
```

**(b) Basic usage example** — replace the example block (lines 27–49) so a footer is shown. Replace:

```html
<cba-module-container
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  [padding]="padding">

  <cba-module-header
    cbaModuleContainerHeader
    title="Customer Module"
    [size]="size"
    [isCollapsed]="isCollapsed"
    [isFullscreen]="isFullscreen"
    status="loaded"
    (collapseToggle)="onCollapse()"
    (sizeToggle)="onSizeChange($event)"
    (fullscreenToggle)="onFullscreen()"
    (remove)="onRemove()">
  </cba-module-header>

  <!-- Projected MFE body content -->
  <app-customers-mfe></app-customers-mfe>
</cba-module-container>
```

With:

```html
<cba-module-container
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  [padding]="padding">

  <cba-module-header
    cbaModuleContainerHeader
    title="Customer Module"
    [size]="size"
    [isCollapsed]="isCollapsed"
    [isFullscreen]="isFullscreen"
    status="loaded"
    (collapseToggle)="onCollapse()"
    (sizeToggle)="onSizeChange($event)"
    (fullscreenToggle)="onFullscreen()"
    (remove)="onRemove()">
  </cba-module-header>

  <!-- Projected MFE body content -->
  <app-customers-mfe></app-customers-mfe>

  <!-- Optional footer band; removed from the DOM when the module is collapsed. -->
  <cba-module-footer
    cbaModuleContainerFooter
    status="loaded"
    statusText="3 customers · total debt $ 1,730,000">
  </cba-module-footer>
</cba-module-container>
```

**(c) Collapsed behaviour section** — append one bullet to the list under `## Collapsed behaviour` (after the existing "The header band remains rendered and never scrolls." bullet, line 117). Add:

```markdown
- The footer region (`.cba-module-container__footer`) is removed from the DOM together with the body via the same `@if` control flow; no footer band is rendered while collapsed.
```

Do not change any other section of the doc.

### Step 1.5 — Commit Bug 1

```
git add src/components/module-container/module-container.component.html src/components/module-container/module-container.component.scss projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts docs/CBA_MODULE_CONTAINER.md
git commit -m "fix(module-container): add dedicated footer projection slot"
```

---

## BUG 2 — Module header drag icon visibility

No code change is expected. This is a verification + clean-build step. If a regression is found, STOP and ask the caller — do NOT invent a fix beyond the actions listed below.

### Step 2.1 — Read-only verification (use `read` / `vscode-mcp-server_read_file_code`)

1. Open `src/components/module-header/module-header.component.ts`.
   - Confirm line 21: `faUpDownLeftRight,` is in the import block from `@fortawesome/free-solid-svg-icons`.
   - Confirm line 165: `protected readonly faDrag = faUpDownLeftRight;`.
   - If either is missing, STOP and report to caller (this contradicts the spec's "current state" and is out of scope to redesign).

2. Open `src/components/module-header/module-header.component.html`.
   - Confirm the drag button (lines 24–30) is present inside `@if (!isFullscreen())` and renders `<fa-icon [icon]="faDrag" aria-hidden="true" />`.
   - Confirm it is the FIRST icon in the `__section--actions` nav (it is — the only thing before it is the `<ng-content select="[cbaModuleDragHandle]">` projection slot, and the demo projects nothing into that slot, so the built-in drag button is the first rendered icon).

3. Open `src/components/module-header/module-header.component.scss`.
   - Confirm `.cba-module-header__action--drag` (lines 74–81) sets ONLY `cursor: grab` and `:active { cursor: grabbing; background-color: transparent; }`.
   - Confirm there is NO `display: none`, `visibility: hidden`, `opacity: 0`, `width: 0`, or `height: 0` anywhere that targets `__action--drag`.

### Step 2.2 — Clean build (the most likely fix for a stale/chunk issue)

Run, in this exact order, as single commands (do not chain):

```
npm run build:lib
```
```
npm run build:demo
```

Both must complete with zero errors.

### Step 2.3 — Runtime verification (optional, only if a browser is available)

If a dev server can be started (`npm run start:demo`) and inspected:
- Open the demo in the browser.
- In DevTools Elements panel, locate any `<cba-module-header>`.
- Confirm `<button class="... cba-module-header__action--drag">` is in the DOM and contains an `<svg>` child.
- Confirm the drag icon is the first icon in the action row.

If the `<svg>` is missing inside the button, run a clean rebuild (`rm -rf dist` equivalent on Windows: remove the `dist` folder via the file explorer or `Remove-Item` is disallowed by tool-selection rules — instead just re-run `npm run build:lib` and `npm run build:demo`; if still missing, STOP and report to caller).

### Step 2.4 — Bug 2 commit

Only commit if a change was made. If no change was needed (the expected case), skip this step and add nothing to the commit. If a regression fix was applied, commit with:

```
git commit -m "fix(module-header): ensure drag icon renders in demo"
```

---

## BUG 3 — Module footer status alignment

### Step 3.1 — Edit `src/components/module-footer/module-footer.component.scss`

Only one rule changes: `.cba-module-footer__status` (lines 17–23). Add a single declaration `justify-content: flex-end;`.

**Current block:**

```scss
.cba-module-footer__status {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-2);
  font-size: var(--cba-font-size-body);
  line-height: var(--cba-line-height-body);
}
```

**Replace with:**

```scss
.cba-module-footer__status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--cba-space-2);
  font-size: var(--cba-font-size-body);
  line-height: var(--cba-line-height-body);
}
```

Rules (verbatim from spec §3.3.1):
- Add ONLY `justify-content: flex-end;` to `.cba-module-footer__status`.
- Do NOT change the parent `.cba-module-footer` rule (it already has `justify-content: flex-end` — leave it).
- Do NOT change the `gap` value (`var(--cba-space-2)` stays).
- Do NOT change `display` or `align-items`.

### Step 3.2 — Verify template order (read-only)

Open `src/components/module-footer/module-footer.component.html`. Confirm the status region renders the `<span class="cba-module-footer__text">` BEFORE the `<fa-icon>` (lines 9–14). It does — no change needed.

### Step 3.3 — Commit Bug 3

```
git add src/components/module-footer/module-footer.component.scss
git commit -m "fix(module-footer): align status text+icon to the right edge"
```

---

## BUG 4 — 50% single module / empty space parity

### Step 4.4 — Edit `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`

Only the `.workspace__row--single-50` rule (lines 17–19) changes.

**Current:**

```scss
.workspace__row--single-50 {
  grid-template-columns: 50% 1fr;
}
```

**Replace with:**

```scss
.workspace__row--single-50 {
  grid-template-columns: repeat(2, 1fr);
}
```

Rules (verbatim from spec §3.4.1):
- Change ONLY the `grid-template-columns` value.
- Do NOT touch `.workspace__row` (already `repeat(2, 1fr)` — leave it).
- Do NOT touch `.demo-actions`.
- No HTML change — `.workspace__row--single-50` is already applied in `demo-workspace.component.html` rows 5 and 6.

### Step 4.2 — Verify width chain (read-only)

Open `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`. Confirm `.demo-module-card--size-50 > cba-module-container { width: 100%; }` is present (lines 10–12). It is — no change needed. This ensures the 50% container fills its grid cell, so the module cell and the empty cell are equal `1fr` columns.

### Step 4.3 — Commit Bug 4

```
git add projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss
git commit -m "fix(demo-workspace): make single 50% row columns equal width"
```

---

## CHANGELOG update

Per `.kilo/rules/changelog-versioning.md`: every change MUST be documented under a dated `[x.y.z] — YYYY-MM-DD` header; NO `[Unreleased]` section is allowed.

The current `package.json` version is `0.18.3` (already bumped by Critical Workflow Step 3). The latest dated header in `CHANGELOG.md` is `## [0.18.2] — 2026-08-20`.

### Step C.1 — Add entries under a new `0.18.3` header

Open `CHANGELOG.md`. Insert a new section **immediately above** the `## [0.18.2] — 2026-08-20` line (line 33), using this exact content:

```markdown
## [0.18.3] — 2026-08-20

### Added

- `ModuleContainerComponent` now exposes a dedicated footer projection slot `[cbaModuleContainerFooter]`, rendered below the body and removed together with the body when the module is collapsed. See `docs/CBA_MODULE_CONTAINER.md`.

### Fixed

- `CbaModuleFooterComponent` status region (`__status`) now aligns its text+icon group to the right edge via `justify-content: flex-end`.
- Demo `demo-workspace` single 50% row (`.workspace__row--single-50`) now uses `grid-template-columns: repeat(2, 1fr)` so the module cell and the empty cell have equal widths.

```

Rules:
- Do NOT add an `[Unreleased]` section.
- Do NOT modify the `0.18.2` entries or any earlier history.
- Do NOT bump `package.json` here (restricted to Step 3).
- If a `## [0.18.3]` header already exists (added by a parallel task), append the entries above under the existing header instead of creating a duplicate — STOP and ask the caller which header to use if a conflict is detected.

### Step C.2 — Commit CHANGELOG

```
git add CHANGELOG.md
git commit -m "docs(changelog): record 0.18.3 footer slot and demo fixes"
```

---

## Final verification (MUST run before signalling completion)

Run each as a single command, in order:

1. **Library build:**
   ```
   npm run build:lib
   ```
   Expected: `Build successful` / zero errors, zero warnings about unknown tokens.

2. **Demo build:**
   ```
   npm run build:demo
   ```
   Expected: zero errors. The demo consumes the rebuilt library from `dist/` (note `@cobranza-apps/ui: file:./dist` in `package.json`), so `build:lib` MUST run before `build:demo`.

3. **Lint:**
   ```
   npm run lint
   ```
   Expected: zero errors, zero warnings. (Lint targets `src/**/*.ts`; no TS file in this task group changes logic, so lint should pass unchanged. If lint flags the demo-module-card template change, re-check that only the `cbaModuleContainerFooter` attribute was added.)

### Acceptance criteria checklist (verify each before done)

- [ ] `npm run build:lib` passes with zero errors.
- [ ] `npm run build:demo` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] `module-container.component.html` renders `.cba-module-container__footer` with `[cbaModuleContainerFooter]` slot inside `@if (!isCollapsed())`, as a sibling of `__body`.
- [ ] `.cba-module-container__footer` SCSS uses `flex: 0 0 auto`, `min-width: 0`, `border-top: 1px solid var(--cba-border-default)`, `background-color: var(--cba-bg-tertiary)`.
- [ ] `demo-module-card` places `cbaModuleContainerFooter` on its `cba-module-footer` and keeps the `@if (hasFooter)` guard.
- [ ] `docs/CBA_MODULE_CONTAINER.md` lists the Footer slot, shows a footer in basic usage, and notes footer removal on collapse.
- [ ] Module header `faDrag` import + template + SCSS verified; no hiding rule exists; drag button is the first icon in the action row.
- [ ] `.cba-module-footer__status` has `justify-content: flex-end`; text renders before icon (template unchanged).
- [ ] `.workspace__row--single-50` uses `grid-template-columns: repeat(2, 1fr);`.
- [ ] `CHANGELOG.md` has a `## [0.18.3] — 2026-08-20` header with Added + Fixed entries; no `[Unreleased]` section exists anywhere in the file.

---

## Out of scope (do NOT do)

- Do NOT create `demo-customer-form` or `demo-payment-schedule` (those are Task Group B).
- Do NOT modify `demo-workspace.component.html` content rows for "New customer" / "Payment schedule" modules.
- Do NOT add new inputs/outputs to `ModuleContainerComponent` or any other library component.
- Do NOT modify `module-header.component.ts/.html/.scss` (Bug 2 is verify-only).
- Do NOT modify `module-footer.component.html` or `module-footer.component.ts`.
- Do NOT change `package.json` version or run `git push`.
- Do NOT create tmp folders outside the working directory.

---

## Summary to return on completion

After all steps and the final verification pass, report:
- What was changed (file list per bug).
- What was verified but not changed (Bug 2 files).
- Build/lint command results (pass/fail per command).
- The commit hashes/messages created.
- Anything that was NOT done or any blocker encountered.
