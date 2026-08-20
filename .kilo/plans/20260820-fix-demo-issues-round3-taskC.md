<!--
  FILE: 20260820-fix-demo-issues-round3-taskC.md
  PURPOSE: Implementation plan for Task C — Demo/UI styling fixes round 3.
  SCOPE: Sub-task 1 form overflow, Sub-task 2 input field styling,
         Sub-task 3 cancel button + button variant contrast, Sub-task 4 typography scale bump.
  AUDIENCE: Implementer (Junior, 50% restriction), Code Reviewer, Code Simplifier, Architector.
  INPUT SPEC: .kilo/plans/20260820-fix-demo-issues-round3-taskC-frontend-spec.md
  TODO SOURCE: .agent/todos/20260820/20260820-todo-1.md (sections: form overflow, input field styling, cancel button, typography)
-->

# Task C — Implementation Plan

## 0. Reference & Constraints

- **Front-end spec (source of truth for visual intent):** `.kilo/plans/20260820-fix-demo-issues-round3-taskC-frontend-spec.md`
- **TODO source:** `.agent/todos/20260820/20260820-todo-1.md` (four sections: form overflow, redesign input fields, add cancel button + button variant contrast, increase typography scale).
- **Implementer profile:** JUNIOR developer, 50% restriction. ZERO authority over scope, architecture, or unrelated files. Only minor local latitude (e.g., local var names). Every structural/architectural decision is encoded below; do not deviate.
- **Rules to obey:**
  - `.kilo/rules/tool-selection-priority.md` — prefer `vscode-mcp-server_replace_lines_code` / `vscode-mcp-server_create_file_code` and `Bifrost_*` over `edit`/`bash` for code edits.
  - `.kilo/rules/gitignore-compliance.md` — read `.gitignore`, run `git status` before commit, never stage `node_modules/`, `dist/`, etc.
  - `.kilo/rules/changelog-versioning.md` — NEVER introduce an `[Unreleased]` section. Entries go under the existing dated `[0.18.4] — 2026-08-20` header.
  - `.kilo/rules/max-arguments-per-method.md`, `max-depth.md`, `max-lines-per-file.md` (≤200), `max-lines-per-method.md` (≤50), `prefer-private-members.md`, `no-commented-code.md`, `self-documenting-code.md`, `single-section-boolean-conditions.md` — SCSS/HTML edits below are declarative and trivially comply; do not invent extra logic.
  - `AGENTS.md` §Component authoring: host modifiers — secondary button variant already uses `:host(.cba-button--secondary) .cba-button__control { }`; keep that pattern (do NOT switch to plain descendant selectors).
- **Branch / version / push restrictions:** This is step 4.1b (Analysis & Planning) ONLY. Do NOT create/switch branches, do NOT bump `package.json`, do NOT run `git push`, do NOT write code. Output = this plan file only. The implementer in step 4.2 will execute the edits.

## 1. Project status & verification (already performed by Architector)

Current state of every affected file was read and matches the spec's "Current state" snippets exactly. Line numbers below are 1-based and verified against the working tree as of 2026-08-20:

| File | Verified current state |
| --- | --- |
| `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss` | 16 lines; `.demo-customer-form` at lines 7–11 lacks `max-width`/`box-sizing`. |
| `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html` | 19 lines; single primary button at lines 13–18, no actions wrapper, no Cancel button. |
| `src/components/form-field/cba-field.component.scss` | 72 lines; `.cba-field__control` at 17–28 (bg `--cba-bg-secondary`, focus border `--cba-accent-primary`); valid/error blocks at 49–56 use `border-color`. |
| `src/theme/_mixins.scss` | 42 lines; `%cba-native-control` at 16–24 lacks `box-sizing: border-box`. |
| `src/components/button/cba-button.component.scss` | 179 lines; secondary variant at 66–78 uses `--cba-bg-elevated` + `--cba-border-subtle`. |
| `src/theme/_variables.scss` | 146 lines; typography tokens at 130–135 (old scale) and line-heights at 140–145 (caption `1.333`). |
| `docs/CBA_INPUT.md` | 193 lines; visual state matrix 129–137 + theming table 158–175 still reference old tokens. |
| `docs/CBA_FORM_FIELD.md` | 234 lines; shared field state classes 164–170 + theming 182–197 reference old tokens. |
| `docs/THEME.md` | 268 lines; typography scale table 141–149 + main token group bullet 70. |
| `.agent/project-info/brief.md` | typography token block at 175–188; prose "Base size: 14px" at line 199. |
| `CHANGELOG.md` | `[0.18.4] — 2026-08-20` header at line 33, currently empty (no `### Added/Changed/Fixed`). |
| Demo SCSS audit | `grep font-size projects/demo/src/**/*.scss` returned 21 hits, ALL using `var(--cba-font-size-*)` tokens. No hard-coded `px`/`rem` font sizes exist. Spec §4.3 confirmed. |

**No ambiguities.** Spec is exhaustive; this plan encodes it verbatim into ordered, verifiable steps.

## 2. High-level approach

Four independent SCSS/HTML/docs sub-tasks, executed in spec order, each followed by a build verification, with a single combined commit at the end of the implementer step (step 4.2 owns the commit). No TypeScript contracts, selectors, inputs, or outputs change. The typography bump propagates automatically through existing token references in component SCSS and demo SCSS; only docs and `brief.md` need manual sync.

Execution order:

1. Sub-task 1 — form overflow (3 files).
2. Sub-task 2 — input field styling (1 SCSS file + 2 docs files).
3. Sub-task 3 — cancel button + secondary variant (1 HTML + 1 demo SCSS + 1 lib SCSS).
4. Sub-task 4 — typography scale (1 SCSS file + 2 docs files + `brief.md` + `CHANGELOG.md`).
5. Cross-file verification grep (token sync).
6. Build + lint + test.
7. Single commit (instructions only — implementer executes).

---

## 3. Detailed atomic steps

### Step 1 — Sub-task 1: form overflow

#### 1.1 `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`

Replace lines 7–11.

**Original (exact):**

```scss
.demo-customer-form {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}
```

**New (exact):**

```scss
.demo-customer-form {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
  max-width: 100%;
  box-sizing: border-box;
}
```

Tool: `vscode-mcp-server_replace_lines_code` with `startLine: 7`, `endLine: 11`, `originalCode` = the original block above, `content` = the new block.

#### 1.2 `src/components/form-field/cba-field.component.scss`

Replace the `.cba-field__control` rule (lines 17–28). This edit ALSO carries the Sub-task 2 background and focus-border changes (single edit avoids touching the same block twice).

**Original (exact, lines 17–28):**

```scss
.cba-field__control {
  display: block;
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: var(--cba-accent-primary);
    box-shadow: var(--cba-focus-ring);
  }
}
```

**New (exact):**

```scss
.cba-field__control {
  display: block;
  box-sizing: border-box;
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: var(--cba-accent-info);
    box-shadow: var(--cba-focus-ring);
  }
}
```

Three changes folded in: add `box-sizing: border-box`; `background-color` `--cba-bg-secondary` → `--cba-bg-elevated`; `:focus-within` `border-color` `--cba-accent-primary` → `--cba-accent-info`. `box-shadow: var(--cba-focus-ring)` unchanged.

#### 1.3 `src/theme/_mixins.scss`

Replace the `%cba-native-control` placeholder (lines 16–24).

**Original (exact):**

```scss
%cba-native-control {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}
```

**New (exact):**

```scss
%cba-native-control {
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}
```

Tool: `vscode-mcp-server_replace_lines_code` with `startLine: 16`, `endLine: 24`.

### Step 2 — Sub-task 2: input field styling (valid/invalid borders + docs)

The `.cba-field__control` background and focus-border edits were already performed in Step 1.2. Only the valid/invalid border thickness + the two docs remain here.

#### 2.1 `src/components/form-field/cba-field.component.scss` — valid border

Replace lines 49–51.

**Original (exact):**

```scss
.cba-field--valid .cba-field__control {
  border-color: var(--cba-state-valid-border);
}
```

**New (exact):**

```scss
.cba-field--valid .cba-field__control {
  border: 2px solid var(--cba-state-valid-border);
}
```

#### 2.2 `src/components/form-field/cba-field.component.scss` — error/invalid border

Replace lines 53–56.

**Original (exact):**

```scss
.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  border-color: var(--cba-state-invalid-border);
}
```

**New (exact):**

```scss
.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  border: 2px solid var(--cba-state-invalid-border);
}
```

#### 2.3 `docs/CBA_INPUT.md` — Visual state matrix (lines 129–137)

Replace the table rows that still reference the old background / focus / invalid / valid tokens.

**Original (exact, lines 131–137):**

```markdown
| default | No interaction | `--cba-border-default` | `--cba-bg-secondary` | `--cba-text-primary` |
| hover | `:hover` | `--cba-border-default` | `--cba-bg-secondary` | `--cba-text-primary` |
| focus-visible | `:focus-visible` | `--cba-accent-primary` + `--cba-focus-ring` | `--cba-bg-secondary` | `--cba-text-primary` |
| disabled | `disabled` input or `setDisabledState` | `--cba-border-default` | `--cba-state-disabled-bg` | `--cba-state-disabled-text` |
| readonly | `readonly` input | `--cba-border-default` | `--cba-bg-tertiary` | `--cba-text-primary` |
| invalid | `error` input truthy | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| valid | `valid` input `true` (and no `error`) | `--cba-state-valid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
```

**New (exact):**

```markdown
| default | No interaction | `--cba-border-default` | `--cba-bg-elevated` | `--cba-text-primary` |
| hover | `:hover` | `--cba-border-default` | `--cba-bg-elevated` | `--cba-text-primary` |
| focus-visible | `:focus-visible` | `--cba-accent-info` + `--cba-focus-ring` | `--cba-bg-elevated` | `--cba-text-primary` |
| disabled | `disabled` input or `setDisabledState` | `--cba-border-default` | `--cba-state-disabled-bg` | `--cba-state-disabled-text` |
| readonly | `readonly` input | `--cba-border-default` | `--cba-bg-tertiary` | `--cba-text-primary` |
| invalid | `error` input truthy | `2px solid --cba-state-invalid-border` | `--cba-bg-elevated` | `--cba-text-primary` |
| valid | `valid` input `true` (and no `error`) | `2px solid --cba-state-valid-border` | `--cba-bg-elevated` | `--cba-text-primary` |
```

Use `vscode-mcp-server_replace_lines_code` with `startLine: 131`, `endLine: 137`. (Disabled/readonly rows are intentionally unchanged; include them in the matched block only because they sit between the changed rows — keep their text identical.)

#### 2.4 `docs/CBA_INPUT.md` — Theming table (lines 160 & 162)

Two single-line edits inside the Theming table.

Line 160:

**Original:** `| Control background | \`--cba-bg-secondary\` |`
**New:** `| Control background | \`--cba-bg-elevated\` |`

Line 162:

**Original:** `| Focus border | \`--cba-accent-primary\` |`
**New:** `| Focus border | \`--cba-accent-info\` |`

Use `edit` tool (or two `vscode-mcp-server_replace_lines_code` calls) — these two lines are unique enough for `edit` with `oldString` = the full row line.

#### 2.5 `docs/CBA_FORM_FIELD.md` — Shared field state classes (lines 168–170)

Three table rows share the same `--cba-bg-secondary` background cell for invalid / valid / error; all three change to `--cba-bg-elevated`.

**Original (exact, lines 168–170):**

```markdown
| `.cba-field--invalid` | `error` input truthy | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| `.cba-field--valid` | `valid` input `true` (and no `error`) | `--cba-state-valid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| `.cba-field--error` | `error` input truthy (legacy alias) | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
```

**New (exact):**

```markdown
| `.cba-field--invalid` | `error` input truthy | `2px solid --cba-state-invalid-border` | `--cba-bg-elevated` | `--cba-text-primary` |
| `.cba-field--valid` | `valid` input `true` (and no `error`) | `2px solid --cba-state-valid-border` | `--cba-bg-elevated` | `--cba-text-primary` |
| `.cba-field--error` | `error` input truthy (legacy alias) | `2px solid --cba-state-invalid-border` | `--cba-bg-elevated` | `--cba-text-primary` |
```

#### 2.6 `docs/CBA_FORM_FIELD.md` — Theming table (lines 187 & 188)

Line 187:

**Original:** `| Control background | \`--cba-bg-secondary\` |`
**New:** `| Control background | \`--cba-bg-elevated\` |`

Line 188:

**Original:** `| Focus ring | \`--cba-accent-primary\` border, \`--cba-focus-ring\` shadow |`
**New:** `| Focus ring | \`--cba-accent-info\` border, \`--cba-focus-ring\` shadow |`

Additionally, append border-thickness notes to the existing Invalid/Valid border rows. Lines 189 and 191:

Line 189:

**Original:** `| Invalid border | \`--cba-state-invalid-border\` |`
**New:** `| Invalid border | `2px solid --cba-state-invalid-border` |`

Line 191:

**Original:** `| Valid border | \`--cba-state-valid-border\` |`
**New:** `| Valid border | `2px solid --cba-state-valid-border` |`

### Step 3 — Sub-task 3: cancel button + secondary variant

#### 3.1 `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`

Replace the whole file content (19 lines) with the new markup. Use `vscode-mcp-server_create_file_code` with `overwrite: true`, OR `vscode-mcp-server_replace_lines_code` with `startLine: 1`, `endLine: 19`.

**Original (exact, full file):**

```html
<form class="demo-customer-form" novalidate>
  <cba-input
    label="Name"
    placeholder="Juan Pérez" />
  <cba-input
    label="Document"
    placeholder="20-12345678-9" />
  <cba-input
    label="Email"
    type="email"
    placeholder="juan@example.com" />
  <p class="demo-customer-form__hint cba-text-small">All fields are required for new customers.</p>
  <cba-button
    variant="primary"
    type="button"
    [icon]="faPlus">
    Add customer
  </cba-button>
</form>
```

**New (exact, full file):**

```html
<form class="demo-customer-form" novalidate>
  <cba-input
    label="Name"
    placeholder="Juan Pérez" />
  <cba-input
    label="Document"
    placeholder="20-12345678-9" />
  <cba-input
    label="Email"
    type="email"
    placeholder="juan@example.com" />
  <p class="demo-customer-form__hint cba-text-small">All fields are required for new customers.</p>
  <div class="demo-customer-form__actions">
    <cba-button
      variant="secondary"
      type="button">
      Cancel
    </cba-button>
    <cba-button
      variant="primary"
      type="button"
      [icon]="faPlus">
      Add customer
    </cba-button>
  </div>
</form>
```

Key requirements:
- New wrapper `<div class="demo-customer-form__actions">` wraps both buttons.
- Cancel button is FIRST (left), `variant="secondary"`, `type="button"`, label text `Cancel`, NO `[icon]` binding, NO click handler.
- Add customer button keeps its existing `variant`, `type`, `[icon]="faPlus"`, and label unchanged; it moves INSIDE the wrapper as the second child.
- Indentation inside the wrapper is +2 spaces relative to the wrapper (matches the file's existing 2-space indent style).

#### 3.2 `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`

Append the actions row style after line 16 (end of file). Use `vscode-mcp-server_replace_lines_code` to replace lines 13–16 (the hint block) with the hint block + the new actions block, preserving the hint block exactly.

**Original (exact, lines 13–16):**

```scss
.demo-customer-form__hint {
  margin: 0;
  color: var(--cba-text-muted);
}
```

**New (exact):**

```scss
.demo-customer-form__hint {
  margin: 0;
  color: var(--cba-text-muted);
}

.demo-customer-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--cba-space-3);
}
```

#### 3.3 `src/components/button/cba-button.component.scss` — secondary variant

Replace lines 66–78.

**Original (exact):**

```scss
:host(.cba-button--secondary) .cba-button__control {
  background-color: var(--cba-bg-elevated);
  border-color: var(--cba-border-subtle);
  color: var(--cba-text-primary);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

**New (exact):**

```scss
:host(.cba-button--secondary) .cba-button__control {
  background-color: var(--cba-bg-secondary);
  border-color: var(--cba-border-default);
  color: var(--cba-text-primary);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

Only two property values change: `background-color` `--cba-bg-elevated` → `--cba-bg-secondary`; `border-color` `--cba-border-subtle` → `--cba-border-default`. Hover/active overlays stay `--cba-hover` / `--cba-active` (the secondary button now sits on the panel surface, so dark overlays remain correct). Keep the `:host(.cba-button--secondary) .cba-button__control { }` host-modifier selector pattern — do NOT flatten to a plain descendant selector.

#### 3.4 Ghost variant — verification only, NO code change

The spec §3.4 requires visual verification of the ghost variant on `--cba-bg-secondary`, `--cba-bg-elevated`, and `--cba-bg-primary`. The implementer does NOT change ghost variant SCSS. If, during the visual verification (step 4.5a/4.5b or the demo run), `--cba-text-primary` on `--cba-bg-primary` is found insufficient, the implementer MUST STOP and return the question to the caller. Do not edit `:host(.cba-button--ghost)` unilaterally.

### Step 4 — Sub-task 4: typography scale

#### 4.1 `src/theme/_variables.scss` — font-size tokens (lines 130–135)

Replace the six-token block.

**Original (exact, lines 130–135):**

```scss
  --cba-font-size-display: 1.25rem;
  --cba-font-size-heading-lg: 1.125rem;
  --cba-font-size-heading-md: 1rem;
  --cba-font-size-body: 0.875rem;
  --cba-font-size-small: 0.8125rem;
  --cba-font-size-caption: 0.75rem;
```

**New (exact):**

```scss
  --cba-font-size-display: 1.5rem;
  --cba-font-size-heading-lg: 1.25rem;
  --cba-font-size-heading-md: 1.125rem;
  --cba-font-size-body: 1rem;
  --cba-font-size-small: 0.875rem;
  --cba-font-size-caption: 0.8125rem;
```

Also update the comment on line 129 which still says "Base stays Inter / 14px / 1.5." Update to reflect the new base.

**Original (line 129):**

```scss
   /* Typography scale — six steps paired with line-heights.
      Base stays Inter / 14px / 1.5. Utility classes in _utilities.scss. */
```

**New (line 129):**

```scss
   /* Typography scale — six steps paired with line-heights.
      Base stays Inter / 16px / 1.5. Utility classes in _utilities.scss. */
```

These two edits can be done as a single `vscode-mcp-server_replace_lines_code` call spanning lines 128–135 (include the comment opening line `/* Typography scale...` so the match is unique). Reconstruct the full original block from lines 128–135 and replace with the new block.

#### 4.2 `src/theme/_variables.scss` — line-height-caption (line 145)

Replace line 145 only.

**Original:** `  --cba-line-height-caption: 1.333;`
**New:** `  --cba-line-height-caption: 1.385;`

All other line-heights (lines 140–144) stay unchanged.

#### 4.3 `src/theme/_utilities.scss` — verify only, NO code change

The spec §4.2 confirms utility classes already reference tokens directly via `var(--cba-font-size-#{$step})` / `var(--cba-line-height-#{$step})` and `$typography-steps` contains all six steps. The implementer reads the file to confirm, edits nothing. If the verification fails (e.g., a step is missing or a hard-coded value exists), STOP and return the question to the caller.

#### 4.4 Demo SCSS audit — verify only, NO code change

The Architector's grep already confirmed all 21 `font-size` declarations in `projects/demo/src/**/*.scss` use `var(--cba-font-size-*)` tokens. The implementer re-runs the grep to confirm no hard-coded `px`/`rem` font sizes exist before committing. If any hard-coded font size is found, replace it with the matching `--cba-font-size-*` token (and the `--cba-line-height-*` token if both are needed), then continue. This is the ONLY judgment call permitted in this plan, and it is bounded to a token swap.

Verification command (implementer, after edits):

```
grep -rn "font-size" projects/demo/src --include="*.scss"
```

Expected: every hit contains `var(--cba-font-size-`. No `px`/`rem` literal.

#### 4.5 `docs/THEME.md` — Typography Scale table (lines 143–148)

Replace the six table rows.

**Original (exact, lines 143–148):**

```markdown
| display | `--cba-font-size-display` (1.25rem / 20px) | `--cba-line-height-display` (1.2) | 600 | Rare — large page titles |
| heading-lg | `--cba-font-size-heading-lg` (1.125rem / 18px) | `--cba-line-height-heading-lg` (1.222) | 600 | Module title (prominent) |
| heading-md | `--cba-font-size-heading-md` (1rem / 16px) | `--cba-line-height-heading-md` (1.25) | 600 | Module title, section title |
| body | `--cba-font-size-body` (0.875rem / 14px) | `--cba-line-height-body` (1.5) | 400 | Default body text |
| small | `--cba-font-size-small` (0.8125rem / 13px) | `--cba-line-height-small` (1.385) | 400–600 | Table header (semibold), metadata |
| caption | `--cba-font-size-caption` (0.75rem / 12px) | `--cba-line-height-caption` (1.333) | 400 | Hints, tertiary metadata |
```

**New (exact):**

```markdown
| display | `--cba-font-size-display` (1.5rem / 24px) | `--cba-line-height-display` (1.2) | 600 | Rare — large page titles |
| heading-lg | `--cba-font-size-heading-lg` (1.25rem / 20px) | `--cba-line-height-heading-lg` (1.222) | 600 | Module title (prominent) |
| heading-md | `--cba-font-size-heading-md` (1.125rem / 18px) | `--cba-line-height-heading-md` (1.25) | 600 | Module title, section title |
| body | `--cba-font-size-body` (1rem / 16px) | `--cba-line-height-body` (1.5) | 400 | Default body text |
| small | `--cba-font-size-small` (0.875rem / 14px) | `--cba-line-height-small` (1.385) | 400–600 | Table header (semibold), metadata |
| caption | `--cba-font-size-caption` (0.8125rem / 13px) | `--cba-line-height-caption` (1.385) | 400 | Hints, tertiary metadata |
```

Also update the lead sentence on line 139 which says "Base stays Inter / 14px / 1.5.".

**Original (line 139):**

```markdown
Six-step scale exposed as `--cba-font-size-*` + `--cba-line-height-*` tokens. Base stays Inter / 14px / 1.5.
```

**New (line 139):**

```markdown
Six-step scale exposed as `--cba-font-size-*` + `--cba-line-height-*` tokens. Base stays Inter / 16px / 1.5.
```

These two edits can be a single `vscode-mcp-server_replace_lines_code` call spanning lines 139–148 (the lead line + the table). Reconstruct the original block exactly and replace.

The Main Token Groups bullet on line 70 ("base `14px`") — per spec §4.4, NO change is required to that summary sentence. Leave it as-is. (Re-reading the spec: it explicitly says "No change needed to that summary sentence." Do NOT edit line 70.)

#### 4.6 `.agent/project-info/brief.md` — typography token block (lines 175–188)

Replace the 14-line token block.

**Original (exact, lines 175–188):**

```scss
  /* Typography scale — six steps paired with line-heights */
  --cba-font-size-display: 1.25rem;
  --cba-font-size-heading-lg: 1.125rem;
  --cba-font-size-heading-md: 1rem;
  --cba-font-size-body: 0.875rem;
  --cba-font-size-small: 0.8125rem;
  --cba-font-size-caption: 0.75rem;

  --cba-line-height-display: 1.2;
  --cba-line-height-heading-lg: 1.222;
  --cba-line-height-heading-md: 1.25;
  --cba-line-height-body: 1.5;
  --cba-line-height-small: 1.385;
  --cba-line-height-caption: 1.333;
```

**New (exact):**

```scss
  /* Typography scale — six steps paired with line-heights */
  --cba-font-size-display: 1.5rem;
  --cba-font-size-heading-lg: 1.25rem;
  --cba-font-size-heading-md: 1.125rem;
  --cba-font-size-body: 1rem;
  --cba-font-size-small: 0.875rem;
  --cba-font-size-caption: 0.8125rem;

  --cba-line-height-display: 1.2;
  --cba-line-height-heading-lg: 1.222;
  --cba-line-height-heading-md: 1.25;
  --cba-line-height-body: 1.5;
  --cba-line-height-small: 1.385;
  --cba-line-height-caption: 1.385;
```

#### 4.7 `.agent/project-info/brief.md` — typography prose (line 199)

Replace line 199.

**Original:** `- Base size: 14px`
**New:** `- Base size: 16px (body step)`

Leave lines 198, 200, 201 (primary font, line-height, headings) unchanged.

#### 4.8 `CHANGELOG.md` — fill the empty `[0.18.4] — 2026-08-20` header

Replace lines 33–34 (the empty header + the blank line before the next header) with the populated header.

**Original (exact, lines 33–34):**

```markdown
## [0.18.4] — 2026-08-20

```

**New (exact):**

```markdown
## [0.18.4] — 2026-08-20

### Changed

- Typography scale bumped by one step: `--cba-font-size-display` is now `1.5rem`, `--cba-font-size-heading-lg` `1.25rem`, `--cba-font-size-heading-md` `1.125rem`, `--cba-font-size-body` `1rem`, `--cba-font-size-small` `0.875rem`, `--cba-font-size-caption` `0.8125rem`. `--cba-line-height-caption` aligned to `1.385`. See `src/theme/_variables.scss`, `docs/THEME.md`, and `.agent/project-info/brief.md` §5.
- Input field visual refresh: control background is now `--cba-bg-elevated`, focus border is `--cba-accent-info`, and valid/invalid borders render at `2px solid`. See `src/components/form-field/cba-field.component.scss`, `docs/CBA_INPUT.md`, and `docs/CBA_FORM_FIELD.md`.
- Secondary button variant now uses `--cba-bg-secondary` background with `--cba-border-default` border for clearer distinction on panel surfaces. See `src/components/button/cba-button.component.scss`.

### Fixed

- "New customer" demo form no longer overflows in 50% modules: `.demo-customer-form`, `.cba-field__control`, and `%cba-native-control` all receive `box-sizing: border-box`, and the form receives `max-width: 100%`. See `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`.
- Added Cancel button to the "New customer" demo form, right-aligned with the primary Add customer button. See `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`.

```

Compliance check (implementer MUST verify before commit):
- NO `[Unreleased]` section is introduced.
- The new entries live directly under the existing dated `[0.18.4] — 2026-08-20` header.
- `package.json` version is NOT bumped in this plan (step 4.2 implementer must not bump; version bump is owned by step 3 of the Critical Workflow, already done at 0.18.4 per the existing empty header). If `package.json` shows a version < 0.18.4, STOP and return the question to the caller — do not bump unilaterally.

### Step 5 — Cross-file token sync verification (implementer, after all edits)

Run these greps to confirm no stale references remain. All must return zero matches unless noted.

```
grep -rn "cba-bg-secondary" docs/CBA_INPUT.md docs/CBA_FORM_FIELD.md
```
Expected: zero matches inside the control-background / state-class table cells. (Other rows referencing `--cba-bg-secondary` for unrelated surfaces are allowed; only the control-background and invalid/valid/error background cells were changed.)

```
grep -rn "cba-accent-primary" docs/CBA_INPUT.md docs/CBA_FORM_FIELD.md
```
Expected: zero matches in the focus-border / focus-ring rows. (Other `--cba-accent-primary` references for neutral badges etc. are out of scope and allowed.)

```
grep -rn "0.875rem\|0.8125rem\|0.75rem\|1.25rem\|1.125rem" docs/THEME.md
```
Expected: only the NEW typography values (`1.5rem`, `1.25rem`, `1.125rem`, `1rem`, `0.875rem`, `0.8125rem`) appear in the Typography Scale table; no stale `0.75rem` caption value remains in that table.

```
grep -rn "Base size: 14px\|base .14px\|14px / 1.5" .agent/project-info/brief.md docs/THEME.md src/theme/_variables.scss
```
Expected: zero matches.

### Step 6 — Build, lint, test (implementer, after edits & verification)

Run each command separately (no chaining, per `tool-selection-priority.md`). Stop and report on first failure.

1. `npm run build:lib`
2. `npm run build:demo`
3. `npm run lint`
4. `npm run test`

Acceptance gates (from TODO §Acceptance criteria relevant to Task C):
- `npm run test` passes with zero failures.
- `npm run build:lib` passes with zero errors.
- `npm run build:demo` passes with zero errors.
- `npm run lint` passes with zero errors.

If any existing spec asserts the OLD typography token values (e.g., `tokens.spec.ts` pinning `--cba-font-size-body` to `0.875rem`) and now fails, STOP and report — do NOT edit the spec unilaterally. The spec asserts authoritative values; a failure means the test was pinning the old value and needs an update, but that decision belongs to the caller / step 4.3 review. (Note: `src/theme/tokens.spec.ts` pins canonical values; the implementer should expect this may fail and must surface it rather than guessing.)

### Step 7 — Git commit (implementer; single commit)

Before commit:
- Read `.gitignore`.
- Run `git status`.
- Confirm `node_modules/`, `dist/`, and any other gitignored paths are NOT staged. Unstage if found.
- Confirm only the files listed in §4 "Files affected" are staged.

Stage exactly these files (relative to repo root `C:\projects\cobranza-app\front\ui`):

```
projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html
projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss
src/components/form-field/cba-field.component.scss
src/components/button/cba-button.component.scss
src/theme/_mixins.scss
src/theme/_variables.scss
docs/CBA_INPUT.md
docs/CBA_FORM_FIELD.md
docs/THEME.md
.agent/project-info/brief.md
CHANGELOG.md
```

Commit message (single line, conventional-commits style matching repo history):

```
fix(demo): form overflow, input styling, cancel button, typography scale (v0.18.4)
```

Do NOT push. Push is restricted to Critical Workflow step 5.

## 4. Files affected summary

| File | Change type | Sub-task(s) |
| --- | --- | --- |
| `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html` | Modify (full rewrite) | 3 |
| `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss` | Modify (2 blocks) | 1, 3 |
| `src/components/form-field/cba-field.component.scss` | Modify (3 blocks) | 1, 2 |
| `src/components/button/cba-button.component.scss` | Modify (1 block) | 3 |
| `src/theme/_mixins.scss` | Modify (1 block) | 1 |
| `src/theme/_variables.scss` | Modify (2 blocks: comment+font-sizes, line-height-caption) | 4 |
| `src/theme/_utilities.scss` | Verify only | 4 |
| `docs/CBA_INPUT.md` | Modify (2 tables) | 2 |
| `docs/CBA_FORM_FIELD.md` | Modify (2 tables) | 2 |
| `docs/THEME.md` | Modify (lead sentence + table) | 4 |
| `.agent/project-info/brief.md` | Modify (token block + prose line) | 4 |
| `CHANGELOG.md` | Modify (populate `[0.18.4]` header) | 4 |

No new files. No TypeScript files. No `package.json` (version already at 0.18.4 per existing empty CHANGELOG header — verify, do not bump).

## 5. Acceptance criteria mapping (Task C subset of TODO §Acceptance)

| TODO criterion | Verified by |
| --- | --- |
| "New customer" form fits within the module without horizontal scrolling. | Step 1 edits + `npm run build:demo` + visual check (step 4.5a). |
| Input fields have a distinct background (`--cba-bg-elevated`) against the module body. | Step 1.2 / 2 edits. |
| Input focus border uses `--cba-accent-info` (blue-gray), not brown/red. | Step 1.2 edit. |
| Valid/invalid input states have 2px colored borders. | Step 2.1 / 2.2 edits. |
| "New customer" form has both "Add customer" (primary) and "Cancel" (secondary) buttons. | Step 3.1 edit. |
| Secondary button is visually distinct from the module body background. | Step 3.3 edit + visual check. |
| All text is readable on 2240×1400 (body font ≥ 16px). | Step 4.1 edit (`--cba-font-size-body: 1rem`). |
| `npm run test` passes with zero failures. | Step 6.4 (may surface `tokens.spec.ts` pin — escalate, do not patch). |
| `npm run build:lib` / `build:demo` / `lint` pass. | Step 6.1–6.3. |
| No `[Unreleased]` section introduced in `CHANGELOG.md`. | Step 4.8 compliance check. |

## 6. Out of scope (do NOT touch)

- Any component TypeScript file (`*.component.ts`, `*.directive.ts`, etc.) — no selector/input/output/contract changes.
- Form validation logic — `error` / `valid` stay visual-only.
- Primary, danger, success button variants — only secondary changes; ghost is verify-only.
- Any `--cba-*` token rename or removal.
- `package.json` version bump (owned by Critical Workflow step 3).
- Branch creation/switch, `git push` (owned by steps 2 and 5).
- Any demo component other than `demo-customer-form`.
- Any docs file other than `CBA_INPUT.md`, `CBA_FORM_FIELD.md`, `THEME.md`.
- Any `*.spec.ts` file — if a spec fails because it pinned an old token value, STOP and escalate; do not edit the spec here.
- Token-compliance audit test (`demo-token-compliance.spec.ts`) — that belongs to a different TODO task (the "Verify demo app uses library tokens exclusively" section), NOT Task C.

## 7. Risk notes for the implementer

1. **`src/theme/tokens.spec.ts` may pin the old font-size values.** This is the single most likely build/test failure. If `npm run test` fails on a token-value assertion after Step 4.1/4.2, the implementer MUST stop and return the question to the caller with the exact failing assertion. Do NOT edit `tokens.spec.ts` in this step.
2. **`box-sizing` on `.cba-field__control` changes border-box math.** Combined with the valid/invalid `2px solid` border, the control's total width stays at 100% (border-box), so no overflow is introduced. This is the intended fix.
3. **Secondary button now sits on `--cba-bg-secondary` (panel).** On a module body (also `--cba-bg-secondary`) the secondary button's NEW background matches the panel — but the `--cba-border-default` border provides the structural distinction required by the spec. This is the spec-mandated tradeoff; do not second-guess it.
4. **Indentation in HTML** — the new wrapper adds one nesting level. Keep the existing 2-space indent convention; the Cancel/Add buttons inside the wrapper are indented +2 spaces relative to the wrapper (i.e., 4 spaces from the `<form>` column).
5. **`CHANGELOG.md` edit must preserve the trailing blank line** so the `[0.18.3]` header below is not glued to the new `### Fixed` block. The "New" block in §3.8 ends with a blank line; ensure the replacement preserves it.

## 8. Plan vs. original task verification (Architector self-check)

- TODO §"Fix New customer form overflow": covered by Step 1 (demo form `max-width`/`box-sizing`, `cba-field__control` `box-sizing`, `%cba-native-control` `box-sizing`). ✅
- TODO §"Redesign input field styling": covered by Step 1.2 (bg + focus) and Step 2.1/2.2 (valid/invalid 2px borders) + Step 2.3–2.6 (docs). ✅
- TODO §"Add cancel button + button variant contrast": covered by Step 3.1 (HTML), Step 3.2 (actions SCSS), Step 3.3 (secondary variant), Step 3.4 (ghost verify-only). ✅
- TODO §"Increase typography scale": covered by Step 4.1/4.2 (variables), Step 4.3 (utilities verify), Step 4.4 (demo audit verify), Step 4.5 (THEME.md), Step 4.6/4.7 (brief.md), Step 4.8 (CHANGELOG). ✅
- No other TODO sections are touched (rebuild/dist, failing tests, token-compliance audit belong to other tasks). ✅
- Plan is fully deterministic for a JUNIOR developer under 50% restriction: every edit is given as exact original → exact new, with file path and line range. The only bounded judgment call is the demo SCSS audit token-swap, which is constrained to a `--cba-font-size-*` substitution. ✅

Plan is complete and ready for the implementer (step 4.2).
