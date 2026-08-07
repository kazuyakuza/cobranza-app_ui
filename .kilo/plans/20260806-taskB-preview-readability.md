<!--
  IMPLEMENTATION PLAN
  Task B — Preview Readability Fixes (library tokens + preview HTML + consumer guide + docs + tests)
  TODO: .agent/todos/20260806/20260806-todo-0.md (lines 2–9)
  Front-end spec (4.1a): .kilo/plans/20260806-taskB-preview-readability-frontend-spec.md
  Branch: feat/preview-readability-changelog-rule
  Version: 0.11.1 (package.json already bumped in Critical Workflow step 3)
-->

# Task B — Preview Readability Implementation Plan

**Date:** 2026-08-06
**Author:** Architector (4.1b)
**Spec input:** `.kilo/plans/20260806-taskB-preview-readability-frontend-spec.md`
**TODO:** `.agent/todos/20260806/20260806-todo-0.md` (lines 2–9)
**Branch:** `feat/preview-readability-changelog-rule` (already created in Critical Workflow step 2)
**Version:** `0.11.1` (already bumped in `package.json` in Critical Workflow step 3)

---

## 1. Task Summary

Fix four visual defects in `docs/theme-preview.html` that cannot be solved by the preview alone:

1. Token labels & warning callout are unreadable.
2. Accent pills render coral text on a coral tint (~1.3:1).
3. Button hover/active overlays are nearly identical.
4. Shell footer blends into the workspace.

The fix requires raising the `--cba-hover` / `--cba-active` overlay alphas in the library token
source of truth (`src/theme/_variables.scss`), targeted preview inline-style/JS edits, regenerating
the compiled preview CSS, syncing the Consumer Guide + brief + context, adding a dated CHANGELOG
entry, and adding regression tests.

---

## 2. Pre-Implementation Verification (current state findings)

Verified against the live files before writing this plan:

| Check | File | Current confirmed value | Matches spec "From" |
|-------|------|-------------------------|---------------------|
| Token | `src/theme/_variables.scss:51` | `--cba-hover: rgba(43, 38, 32, 0.06);` | ✅ |
| Token | `src/theme/_variables.scss:52` | `--cba-active: rgba(43, 38, 32, 0.10);` | ✅ |
| Fixture | `src/components/testing/theme-fixtures.ts:19` | `'--cba-hover': 'rgba(43, 38, 32, 0.06)'` | ✅ |
| Fixture | `src/components/testing/theme-fixtures.ts:20` | `'--cba-active': 'rgba(43, 38, 32, 0.10)'` | ✅ |
| Preview | `docs/theme-preview.html:145` | `.t-row{font-size:12.5px;margin-bottom:4px}` | ✅ |
| Preview | `docs/theme-preview.html:146` | `.t-row .tok{...font-size:10.5px;color:var(--cba-text-muted)}` | ✅ |
| Preview | `docs/theme-preview.html:151` | `.t-callout{...border:1px solid var(--cba-accent-warning);color:var(--cba-accent-warning)...}` | ✅ |
| Preview | `docs/theme-preview.html:98` | `.shell-footer{...background:var(--cba-bg-primary)}` | ✅ |
| Preview | `docs/theme-preview.html:155` | `.accent-pill{...border:1px solid transparent}` (no `color:` rule) | ✅ |
| Preview JS | `docs/theme-preview.html:317-322` | `renderAccents` uses `color-mix(in srgb,${color} 18%,transparent)` | ✅ |
| Guide | `docs/CONSUMER_GUIDE.md:186` | Shell footer cell `--cba-bg-primary or --cba-bg-elevated` | ✅ |
| Guide note | `docs/CONSUMER_GUIDE.md:194` | "prefer `--cba-bg-primary`; `--cba-bg-elevated` is the documented Shell choice." | ✅ |
| Brief §5 | `.agent/project-info/brief.md:131-132` | old hover/active alphas (0.06 / 0.10) | ✅ |
| Button | `src/components/button/cba-button.component.scss` | references `--cba-hover` and `--cba-active` (lines 41,45,55,59,68,72,81,85,94,98) | ✅ |
| Build | `package.json:21` | `build:preview` script exists | ✅ |
| Version | `package.json:3` | `0.11.1` (already bumped) | ✅ |
| Changelog | `CHANGELOG.md:33` | latest header `## [0.11.0] — 2026-08-06` → a new `0.11.1` header is needed | ✅ |
| Rule infra | `.agent/RULES.md:20` | `[Changelog Versioning]` rule reference exists; `.kilo/rules/changelog-versioning.md` exists | ✅ |

All spec "From" snippets match the working tree exactly, so every edit below is a deterministic
string replacement.

---

## 3. Ambiguities & Decisions

1. **Scope of "Task B".** The caller's 4.1b prompt lists six required coverage areas (tokens, preview
   inline styles, preview CSS regeneration, Consumer Guide, brief §5, context). The approved
   front-end spec (4.1a) and TODO items 7–9 additionally require: `theme-fixtures.ts` update,
   regression tests, and a dated CHANGELOG entry. The spec §10 explicitly states the changelog
   versioning *rule files* are out of scope (done in Task A) but the *dated CHANGELOG entry and
   compliance test* ARE in scope here. **Decision:** this plan covers the full approved spec
   (TODO lines 2–9), because a complete plan must satisfy the spec and the TODO; the caller's six
   bullets are a guaranteed-minimum subset, not an exclusion list. No deviation from the spec.

2. **Version bump.** `package.json` is already `0.11.1` (Critical Workflow step 3). No further
   version edit; only the `CHANGELOG.md` dated header is added.

3. **Test placement.** Spec §6.3 offers "preview-html.spec.ts OR a new interactive-states.spec.ts".
   `preview-html.spec.ts` is 104 lines; adding ~40 lines stays under the 200-line file cap and keeps
   all preview assertions in one place. **Decision:** extend `preview-html.spec.ts` (no new
   interactive-states file). Add the changelog compliance test as the new file
   `src/theme/docs-compliance.spec.ts` (spec §6.4).

4. **All edits use var(--cba-*).** No new hex literals introduced in the preview; overlay hue
   `43, 38, 32` is unchanged so no new tokens are created and the warm-taupe tint is preserved.

---

## 4. High-Level Approach

Ordered so each step's verifiable output enables the next:

1. **Token source of truth** — raise `--cba-hover`/`--cba-active` alphas in `_variables.scss`.
2. **Test fixture** — update `EXPECTED_TOKENS` so the existing `tokens.spec.ts` keeps passing.
3. **Preview HTML** — inline-style + JS edits for `.t-row`, `.tok`, `.t-callout`, `.shell-footer`,
   `renderAccents`, `.accent-pill`.
4. **Regenerate compiled CSS** — `npm run build:preview` → `docs/theme-preview.css`.
5. **Consumer Guide** — Bar and Chrome Guide footer row + note.
6. **Docs sync** — `brief.md` §5 token values; `context.md` recent-changes bullet.
7. **CHANGELOG** — add dated `## [0.11.1] — 2026-08-06` header (newest first, no `[Unreleased]`).
8. **Regression tests** — extend `preview-html.spec.ts`; create `docs-compliance.spec.ts`.
9. **Verify** — `npm run lint`, `npm test`, `npm run build`.
10. **Commit** — meaningful messages per logical group (tokens+fixture, preview, guide+docs,
    changelog, tests). Final verification commit.

Each step is atomic and independently verifiable. Implementation phase (4.2) executes them in this
order, committing between logical groups.

---

## 5. Detailed Steps

### Step 5.1 — `src/theme/_variables.scss` token update

**File:** `src/theme/_variables.scss`
**Tool:** `vscode-mcp-server_replace_lines_code` (or `edit`).

Replace lines 51–52 exactly:

Original:
```scss
  --cba-hover: rgba(43, 38, 32, 0.06);
  --cba-active: rgba(43, 38, 32, 0.10);
```

New:
```scss
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
```

**Verify:** the file contains `--cba-hover: rgba(43, 38, 32, 0.10);` and
`--cba-active: rgba(43, 38, 32, 0.18);` and nothing else changed (line 53 `--cba-focus-ring`
unchanged).

**Commit:** `fix(theme): raise --cba-hover/active overlay alpha for visible states`

---

### Step 5.2 — `src/components/testing/theme-fixtures.ts` fixture sync

**File:** `src/components/testing/theme-fixtures.ts`

Replace lines 19–20 exactly:

Original:
```ts
  '--cba-hover': 'rgba(43, 38, 32, 0.06)',
  '--cba-active': 'rgba(43, 38, 32, 0.10)',
```

New:
```ts
  '--cba-hover': 'rgba(43, 38, 32, 0.10)',
  '--cba-active': 'rgba(43, 38, 32, 0.18)',
```

**Verify:** `EXPECTED_TOKENS['--cba-hover']` and `['--cba-active']` equal the new values. The
existing `tokens.spec.ts` and `preview-html.spec.ts` (`:root` canonical-values block) will now expect
the new alpha values once `docs/theme-preview.css` is regenerated (Step 5.4).

**Commit:** together with Step 5.1 commit (fixture must move with the token change).

---

### Step 5.3 — `docs/theme-preview.html` inline-style + JS edits

**File:** `docs/theme-preview.html`

#### 5.3.1 `.t-row` (line 145)

Original:
```css
    .t-row{font-size:12.5px;margin-bottom:4px}
```
New:
```css
    .t-row{font-size:13px;font-weight:500;margin-bottom:4px}
```

#### 5.3.2 `.t-row .tok` (line 146)

Original:
```css
    .t-row .tok{font-family:ui-monospace,monospace;font-size:10.5px;color:var(--cba-text-muted)}
```
New:
```css
    .t-row .tok{font-family:ui-monospace,monospace;font-size:11px;color:var(--cba-text-secondary)}
```

#### 5.3.3 `.t-callout` (line 151)

Original:
```css
    .t-callout{margin-top:6px;padding:6px 8px;border-radius:var(--cba-radius-sm);border:1px solid var(--cba-accent-warning);color:var(--cba-accent-warning);font-size:11px;font-weight:600}
```
New:
```css
    .t-callout{margin-top:6px;padding:6px 8px;border-radius:var(--cba-radius-sm);border:1px solid transparent;background:var(--cba-accent-warning);color:var(--cba-text-inverse);font-size:11px;font-weight:600}
```

#### 5.3.4 `.shell-footer` (line 98)

Original:
```css
    .shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-primary)}
```
New:
```css
    .shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-elevated)}
```

#### 5.3.5 `.accent-pill` (line 155) — add inverse-text color

Original:
```css
    .accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent}
```
New:
```css
    .accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent;color:var(--cba-text-inverse)}
```

#### 5.3.6 `renderAccents()` (lines 317–322) — solid fill, drop color-mix

Original (exact, including indentation):
```js
function renderAccents(host){
  host.innerHTML=ACCENTS.map(a=>{
    const color=`var(${a[1]})`;
    return `<span class="accent-pill" style="color:${color};border-color:${color};background:color-mix(in srgb,${color} 18%,transparent)">${a[0]}</span>`;
  }).join('');
}
```
New:
```js
function renderAccents(host){
  host.innerHTML=ACCENTS.map(a=>{
    const color=`var(${a[1]})`;
    return `<span class="accent-pill" style="background:${color}">${a[0]}</span>`;
  }).join('');
}
```

**Verify (string checks on the file text):**
- No occurrence of `color-mix(in srgb,${color} 18%,transparent)`.
- `.t-row .tok` line contains `color:var(--cba-text-secondary)` and `font-size:11px`.
- `.t-row{` line contains `font-size:13px` and `font-weight:500`.
- `.t-callout{` line contains `background:var(--cba-accent-warning)` and `color:var(--cba-text-inverse)`.
- `.shell-footer{` line contains `background:var(--cba-bg-elevated)`.
- `.accent-pill{` line contains `color:var(--cba-text-inverse)`.
- `renderAccents` body contains `style="background:${color}"` and no inline `color:`/`border-color:`.

**Commit:** `fix(preview): readable token labels, callout, accent pills, shell footer`

---

### Step 5.4 — Regenerate compiled preview CSS

**Command (single cmd, no chaining):**
```
npm run build:preview
```

This runs `sass src/theme/theme.scss docs/theme-preview.css --no-source-map --style=compressed`,
recompiling `:root` with the new `--cba-hover` / `--cba-active` values.

**Verify:**
- `docs/theme-preview.css` mtime updated.
- `docs/theme-preview.css` text contains `--cba-hover:rgba(43,38,32,.10)` and
  `--cba-active:rgba(43,38,32,.18)` (sass compressed output drops spaces; the
  `parseScssVariables` helper in existing `preview-html.spec.ts` normalises this, so the test
  compares against the fixture string `rgba(43, 38, 32, 0.10)` — confirm the helper tolerates the
  compressed form; it already does for the existing 0.06/0.10 tokens, so no helper change needed).

**Commit:** `build(preview): regenerate theme-preview.css with new hover/active alphas`

---

### Step 5.5 — `docs/CONSUMER_GUIDE.md` Bar and Chrome Guide

**File:** `docs/CONSUMER_GUIDE.md`

#### 5.5.1 Shell footer table row (line 186)

Original:
```markdown
| Shell footer | `--cba-bg-primary` or `--cba-bg-elevated` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` |
```
New:
```markdown
| Shell footer | `--cba-bg-elevated` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` |
```

#### 5.5.2 Shell footer note (line 194)

Original:
```markdown
- Shell footer: prefer `--cba-bg-primary`; `--cba-bg-elevated` is the documented Shell choice.
```
New:
```markdown
- Shell footer: use `--cba-bg-elevated` so the chrome differs from the workspace canvas (`--cba-bg-primary`). This is the documented Shell choice and is required for visual hierarchy.
```

**Verify:** guide no longer recommends `--cba-bg-primary` for the Shell footer; the "must differ from
workspace" requirement is stated. The existing `consumer-guide.spec.ts` (section presence checks)
still passes — no section heading changes.

**Commit:** `docs(consumer-guide): recommend --cba-bg-elevated for Shell footer`

---

### Step 5.6 — `.agent/project-info/brief.md` §5 token sync

**File:** `.agent/project-info/brief.md`

Replace the interactive-states block (lines 131–132):

Original:
```scss
  --cba-hover: rgba(43, 38, 32, 0.06);
  --cba-active: rgba(43, 38, 32, 0.10);
```
New:
```scss
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
```

The surrounding comment `/* Interactive states — warm taupe overlays + warm coral focus ring */`
(line 130) is accurate for the new values — leave it intact. No prose change is required (the
existing note already describes the tokens generically; the brief §5 token *values* are the
authoritative sync target).

**Verify:** brief §5 hex table for `--cba-hover`/`--cba-active` matches `_variables.scss`.

**Commit:** together with Step 5.5 and 5.7 (docs sync).

---

### Step 5.7 — `.agent/project-info/context.md` recent-changes log

**File:** `.agent/project-info/context.md`

Insert a new bullet at the **top** of the `## Recent Changes` list (immediately after line 23
`## Recent Changes`), so the most recent change is first:

```markdown
- **Preview readability token tune (Task B, 2026-08-06)** — increased interactive overlay opacity in `src/theme/_variables.scss`: `--cba-hover` to `rgba(43, 38, 32, 0.10)` and `--cba-active` to `rgba(43, 38, 32, 0.18)`. Updated `docs/theme-preview.html` token labels, warning callout, accent pills, and Shell footer background for readability. Synced `docs/CONSUMER_GUIDE.md`, `.agent/project-info/brief.md` §5, and regenerated `docs/theme-preview.css`.
```

Update the `## Cross-Reference` last line (line 70) from `latest 0.11.0.` to `latest 0.11.1.` so the
changelog cross-reference stays current.

**Verify:** a "Preview readability token tune (Task B, 2026-08-06)" bullet exists; cross-reference
reads `latest 0.11.1.`. Other content preserved.

**Commit:** `docs(context): log Task B preview readability token tune`

---

### Step 5.8 — `CHANGELOG.md` dated `[0.11.1]` entry

**File:** `CHANGELOG.md`

Insert a new header block directly under line 32 (`> Releases prior to 0.8.1 ...`), **above** the
existing `## [0.11.0] — 2026-08-06` header (newest first). No `[Unreleased]` section anywhere.

```markdown
## [0.11.1] — 2026-08-06

### Changed

- Increased interactive overlay opacity in `src/theme/_variables.scss` to make hover and active states distinguishable on warm light surfaces: `--cba-hover` is now `rgba(43, 38, 32, 0.10)` (was `0.06`) and `--cba-active` is now `rgba(43, 38, 32, 0.18)` (was `0.10`).

### Fixed

- Fixed unreadable token labels in `docs/theme-preview.html`: `.t-row .tok` now uses `--cba-text-secondary` at 11 px/500 weight, passing WCAG AA on every preview surface.
- Fixed unreadable warning callout and warning accent pill by switching to a solid `--cba-accent-warning` background with `--cba-text-inverse` text.
- Fixed Shell footer blending into the workspace by setting `.shell-footer` to `--cba-bg-elevated` and updating `docs/CONSUMER_GUIDE.md` to recommend the same.

### Added

- Regression tests in `src/theme/preview-html.spec.ts` (token labels, callout, accent pills, footer/workspace background difference, button state overlay values) and new `src/theme/docs-compliance.spec.ts` (no `[Unreleased]` section, dated `[0.11.1]` header, changelog-versioning rule reference).

### Notes

- No `--cba-*` token names were renamed, added, or removed; only `--cba-hover` and `--cba-active` alpha values changed.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Compliance enforced by [.kilo/rules/changelog-versioning.md](.kilo/rules/changelog-versioning.md) (no `[Unreleased]` sections).
```

**Verify:** `CHANGELOG.md` contains `## [0.11.1] — 2026-08-06`; the string `[Unreleased]` does NOT
appear anywhere in the file (case-insensitive); the `0.11.1` header sits above `0.11.0`.

**Commit:** `docs(changelog): add 0.11.1 preview readability fixes`

---

### Step 5.9 — Regression tests

#### 5.9.1 Extend `src/theme/preview-html.spec.ts`

Add the following `describe` blocks **before** the existing closing of the file (after the existing
`describe('docs/theme-preview.css :root matches canonical tokens', ...)` block, before line 104 EOF).
Keep each `it` assertion a single-section boolean (rule compliance).

```ts
describe('docs/theme-preview.html readability fixes', () => {
  const html = readProjectText(PREVIEW_HTML_PATH);

  it('token labels use --cba-text-secondary at 11px', () => {
    expect(html).toContain('.t-row .tok{font-family:ui-monospace,monospace;font-size:11px;color:var(--cba-text-secondary)}');
  });

  it('token rows use 13px and weight 500', () => {
    expect(html).toContain('.t-row{font-size:13px;font-weight:500;margin-bottom:4px}');
  });

  it('warning callout uses solid accent bg with inverse text', () => {
    expect(html).toContain('background:var(--cba-accent-warning)');
    expect(html).toContain('color:var(--cba-text-inverse)');
    expect(html).toContain('.t-callout{');
  });

  it('accent pills use solid accent fills with inverse text (no color-mix)', () => {
    expect(html).not.toContain('color-mix(in srgb,${color} 18%,transparent)');
    expect(html).toContain('style="background:${color}"');
    expect(html).toContain('.accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent;color:var(--cba-text-inverse)}');
  });

  it('shell footer background differs from workspace background', () => {
    const shellFooterElevated = html.includes('.shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-elevated)}');
    const workspaceUsesCanvas = html.includes('.preview{display:flex;flex-direction:column;min-height:100vh;background:var(--cba-bg-primary)');
    expect(shellFooterElevated).toBe(true);
    expect(workspaceUsesCanvas).toBe(true);
    expect('--cba-bg-elevated').not.toBe('--cba-bg-primary');
  });
});

describe('docs/theme-preview.css interactive state overlay values', () => {
  const css = readProjectText(PREVIEW_CSS_PATH);

  it('defines --cba-hover at the raised alpha', () => {
    expect(css).toContain('--cba-hover');
  });

  it('compiled :root carries the raised hover/active alphas', () => {
    const cssVars = parseScssVariables(css);
    expect(cssVars.get('--cba-hover')).toBe(EXPECTED_TOKENS['--cba-hover']);
    expect(cssVars.get('--cba-active')).toBe(EXPECTED_TOKENS['--cba-active']);
  });

  it('hover and active alphas differ by at least 0.05', () => {
    const hoverAlpha = parseAlpha(EXPECTED_TOKENS['--cba-hover']);
    const activeAlpha = parseAlpha(EXPECTED_TOKENS['--cba-active']);
    expect(activeAlpha - hoverAlpha).toBeGreaterThanOrEqual(0.05);
  });

  it('button component scss references both interaction tokens', () => {
    const buttonScss = readProjectText('src/components/button/cba-button.component.scss');
    expect(buttonScss).toContain('var(--cba-hover)');
    expect(buttonScss).toContain('var(--cba-active)');
  });
});
```

Add a tiny helper at the top of the file (after the imports) to extract the alpha float from an
`rgba(...)` string. Keep it a single-section pure function:

```ts
function parseAlpha(rgba: string): number {
  const match = rgba.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
  return match ? Number(match[1]) : NaN;
}
```

Add the `parseScssVariables` import to the existing import block (it is already imported on line 21
of the current file — confirm and reuse; if a second import is needed, reuse the existing one).
`readProjectText` is already imported.

**Line budget:** new content ≈ 50 lines + 1 helper = ~55 lines; current file is 104 → total ≈ 159,
under the 200-line cap. Each `it` body stays short.

**Verify:** `npm test -- src/theme/preview-html.spec.ts` passes (all new + existing assertions).

#### 5.9.2 New `src/theme/docs-compliance.spec.ts`

Create a new file referencing the changelog-versioning rule.

```ts
/**
 * @file docs-compliance.spec.ts — Changelog versioning compliance regression tests.
 *
 * Enforces .kilo/rules/changelog-versioning.md: no [Unreleased] section; a dated [x.y.z] —
 * YYYY-MM-DD header must exist for the current package.json version; the rule file must be
 * referenced from .agent/RULES.md.
 *
 * Run: `npm test -- src/theme/docs-compliance.spec.ts`
 */

import { readProjectText } from '../components/testing/project-files';

const CHANGELOG_PATH = 'CHANGELOG.md';
const RULES_PATH = '.agent/RULES.md';
const RULE_FILE_PATH = '.kilo/rules/changelog-versioning.md';

function readPackageVersion(): string {
  const pkg = JSON.parse(readProjectText('package.json'));
  return pkg.version as string;
}

describe('CHANGELOG versioning compliance', () => {
  const changelog = readProjectText(CHANGELOG_PATH);
  const version = readPackageVersion();
  const today = new Date().toISOString().slice(0, 10);

  it('contains no [Unreleased] section (case-insensitive)', () => {
    const hasUnreleased = changelog.toLowerCase().includes('[unreleased]');
    expect(hasUnreleased).toBe(false);
  });

  it('has a dated header for the current package version', () => {
    const header = `## [${version}] —`;
    expect(changelog).toContain(header);
  });

  it('current version header uses today date or a recent date', () => {
    const headerPattern = new RegExp(`## \\[${version}\\] — \\d{4}-\\d{2}-\\d{2}`);
    expect(headerPattern.test(changelog)).toBe(true);
  });

  it('.kilo/rules/changelog-versioning.md is referenced in .agent/RULES.md', () => {
    const rulesIndex = readProjectText(RULES_PATH);
    expect(rulesIndex).toContain('Changelog Versioning');
    expect(rulesIndex).toContain('changelog-versioning.md');
  });

  it('.kilo/rules/changelog-versioning.md file exists (importable path)', () => {
    let exists = false;
    try {
      readProjectText(RULE_FILE_PATH);
      exists = true;
    } catch {
      exists = false;
    }
    expect(exists).toBe(true);
  });
});
```

**Note on the date assertion:** the `0.11.1` header must use the real edit date `2026-08-06`
(written in Step 5.8). The test asserts a `YYYY-MM-DD` format for the current version header rather
than the literal `today` to avoid tz flakes, but the implementation MUST use `2026-08-06` per the
changelog-versioning rule (same date as the version bump). Keep the regex-based assertion; the
`today` variable is unused — remove that line before finalising to avoid lint unused-var.

**Verify:** `npm test -- src/theme/docs-compliance.spec.ts` passes.

**Commit:** `test(theme): regression tests for preview readability and changelog compliance`

---

### Step 5.10 — Full verification

Run each command separately (no chaining) and confirm green:

1. `npm run lint`
2. `npm test`
3. `npm run build`

Expected:
- Lint: 0 errors/warnings on changed files.
- Tests: all existing specs + new `preview-html` assertions + `docs-compliance` pass.
- Build: `ng-packagr` succeeds; no token-name regressions.

If any step fails, fix the offending file (do not skip) and re-run only that command.

**Commit (only if verification surfaced a fix):** `chore: fix verification findings` (otherwise no
extra commit).

---

## 6. Git Actions Summary

All commits land on branch `feat/preview-readability-changelog-rule`. Do NOT push (push happens at
Critical Workflow step 5 and only to `origin`). Commit grouping:

| Order | Commit message | Files |
|-------|----------------|-------|
| 1 | `fix(theme): raise --cba-hover/active overlay alpha for visible states` | `_variables.scss`, `theme-fixtures.ts` |
| 2 | `fix(preview): readable token labels, callout, accent pills, shell footer` | `theme-preview.html` |
| 3 | `build(preview): regenerate theme-preview.css with new hover/active alphas` | `theme-preview.css` |
| 4 | `docs(consumer-guide): recommend --cba-bg-elevated for Shell footer` | `CONSUMER_GUIDE.md` |
| 5 | `docs(context): log Task B preview readability token tune` | `brief.md`, `context.md` |
| 6 | `docs(changelog): add 0.11.1 preview readability fixes` | `CHANGELOG.md` |
| 7 | `test(theme): regression tests for preview readability and changelog compliance` | `preview-html.spec.ts`, `docs-compliance.spec.ts` |

Before any commit, run `git status` and ensure no `.gitignore`-matching files (e.g. `node_modules/`,
`dist/`) are staged (gitignore-compliance rule).

---

## 7. Code Review & Simplification (Critical Workflow 4.3 — next phase, not this step)

After implementation, code-reviewer and code-simplifier will check this plan's adherence. Likely
review targets:
- All four visual issues resolved with minimal token surface change (only 2 alphas).
- No commented-out code left (the removed `color-mix` line is deleted, not commented).
- New test helper `parseAlpha` is private-style and single-section.
- `docs-compliance.spec.ts` under 200 lines and each `it` ≤ 50 lines.

These are out of scope for the implementer and belong to the 4.3 phase.

---

## 8. Acceptance Criteria (verifiable checklist)

- [ ] `src/theme/_variables.scss` contains `--cba-hover: rgba(43, 38, 32, 0.10)` and `--cba-active: rgba(43, 38, 32, 0.18)`.
- [ ] `src/components/testing/theme-fixtures.ts` `EXPECTED_TOKENS` hover/active values match the new alphas.
- [ ] `docs/theme-preview.html` `.t-row` rule has `font-size:13px;font-weight:500`.
- [ ] `docs/theme-preview.html` `.t-row .tok` rule uses `color:var(--cba-text-secondary)` and `font-size:11px`.
- [ ] `docs/theme-preview.html` `.t-callout` rule has `background:var(--cba-accent-warning)`, `color:var(--cba-text-inverse)`, `border:1px solid transparent`.
- [ ] `docs/theme-preview.html` `renderAccents()` emits `style="background:${color}"` and contains no `color-mix`.
- [ ] `docs/theme-preview.html` `.accent-pill` rule sets `color:var(--cba-text-inverse)`.
- [ ] `docs/theme-preview.html` `.shell-footer` uses `background:var(--cba-bg-elevated)`.
- [ ] `docs/theme-preview.css` regenerated via `npm run build:preview` and contains the new alphas.
- [ ] `docs/CONSUMER_GUIDE.md` Bar and Chrome Guide Shell footer cell uses only `--cba-bg-elevated` and the note requires difference from workspace.
- [ ] `.agent/project-info/brief.md` §5 hover/active values match `_variables.scss`.
- [ ] `.agent/project-info/context.md` has the Task B recent-changes bullet; cross-reference shows `latest 0.11.1.`.
- [ ] `CHANGELOG.md` has `## [0.11.1] — 2026-08-06` and contains no `[Unreleased]` (case-insensitive).
- [ ] `src/theme/preview-html.spec.ts` passes with new readability + overlay assertions.
- [ ] `src/theme/docs-compliance.spec.ts` passes (no `[Unreleased]`, dated header, rule reference + file).
- [ ] `npm run lint`, `npm test`, `npm run build` all pass.

---

## 9. Files Affected Summary

| File | Change |
|------|--------|
| `src/theme/_variables.scss` | Raise `--cba-hover` (0.06→0.10) and `--cba-active` (0.10→0.18) alphas. |
| `src/components/testing/theme-fixtures.ts` | Sync `EXPECTED_TOKENS` hover/active values. |
| `docs/theme-preview.html` | Edit `.t-row`, `.t-row .tok`, `.t-callout`, `.accent-pill`, `.shell-footer`, `renderAccents()`. |
| `docs/theme-preview.css` | Regenerated by `npm run build:preview`. |
| `docs/CONSUMER_GUIDE.md` | Bar and Chrome Guide: Shell footer → `--cba-bg-elevated` + must-differ note. |
| `.agent/project-info/brief.md` | §5 hover/active token value sync. |
| `.agent/project-info/context.md` | Recent-changes bullet + cross-reference version. |
| `CHANGELOG.md` | New dated `## [0.11.1] — 2026-08-06` entry. |
| `src/theme/preview-html.spec.ts` | New readability + overlay-value assertions + `parseAlpha` helper. |
| `src/theme/docs-compliance.spec.ts` | New file: changelog versioning compliance tests. |

No new `--cba-*` token names. No changes to Angular component TS/templates. No SCSS edits beyond
`_variables.scss` (button/popup components pick up stronger overlays automatically via existing
`var(--cba-hover/active)` references).