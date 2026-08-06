# Task A — Code Simplification Report

**Date:** 2026-08-05  
**Scope:** Phase 9 token tuning and theme preview update  
**Files reviewed:**
- `src/theme/_variables.scss`
- `docs/theme-preview.html`

**Overall verdict:** PASS with minor optional simplifications.

Both files are functionally sound, well-structured, and consistent with the project's design-token discipline. No simplification is required to preserve functionality, but two small opportunities in `docs/theme-preview.html` would reduce duplication and improve maintainability without affecting the visual verification purpose.

---

## 1. `src/theme/_variables.scss`

### Findings

- Token values are already consolidated into CSS custom properties; no hard-coded duplicates inside `:root`.
- Group comments are concise and describe the token purpose.
- The header doc-block is large (~44 lines) and partially duplicates `brief.md` §5, but it contains project-specific rules that are important for AI agents (e.g., "Do NOT rename tokens", coral discipline, surface usage guidance).
- RGBA overlays (`--cba-hover`, `--cba-active`) use the same base color as `--cba-text-primary` (#2B2620). Converting them to `color-mix()` would add browser-support complexity without a readability gain, so the current explicit RGBA values are preferable.

### Simplification proposed

None required.

**Rationale:** The file already follows the principle of single-source-of-truth for tokens. Trimming the header comment further would reduce context for future agents; the existing documentation-to-code ratio is acceptable for a design-token source file.

---

## 2. `docs/theme-preview.html`

### Findings

- The page fulfills its purpose: it renders the four-surface hierarchy, text hierarchy, accents, buttons, and a role map for visual verification.
- CSS custom properties in `.preview` and the JS `tokens` object contain the same values. This duplication is defensible because the CSS values provide the initial paint before JS executes and act as a fallback if JS fails.
- The `resolve(theme)` helper is a one-line wrapper around `theme.tokens` and is only used inside `applyTheme`.
- The `roleMap.innerHTML` assignment concatenates nine lines of string literals; this is the most verbose and error-prone part of the script.

### Simplifications proposed

#### 2.1 Remove the redundant `resolve` helper

**Current:**
```js
const resolve=theme=>theme.tokens;

function applyTheme(theme){
  const tokens=resolve(theme);
  // ...
}
```

**Simplified:**
```js
function applyTheme(theme){
  const tokens=theme.tokens;
  // ...
}
```

**Rationale:** The wrapper adds no abstraction. Removing it eliminates an indirection and makes the data flow explicit.

#### 2.2 Generate the role map from a data array

**Current:**
```js
  roleMap.innerHTML=
    'canvas   ' + tokens['--canvas'] + '   (--cba-bg-primary)<br>' +
    'panel    ' + tokens['--panel'] + '    (--cba-bg-secondary)<br>' +
    // ... seven more lines
```

**Simplified:**
```js
  const roles = [
    ['canvas',  '--canvas',  '--cba-bg-primary'],
    ['panel',   '--panel',   '--cba-bg-secondary'],
    ['elevated','--elevated','--cba-bg-elevated'],
    ['inset',   '--inset',   '--cba-bg-tertiary'],
    ['text',    '--text',    '--cba-text-primary'],
    ['border',  '--border',  '--cba-border-default'],
    ['accent',  '--accent',  '--cba-accent-primary'],
    ['warning', '--warning', '--cba-accent-warning'],
    ['danger',  '--danger',  '--cba-accent-danger']
  ];
  roleMap.innerHTML = roles
    .map(([name, token, cba]) => `${name.padEnd(9)} ${tokens[token].padEnd(7)} (${cba})`)
    .join('<br>');
```

**Rationale:** A data-driven map removes repetitive string concatenation, makes it trivial to add or reorder roles, and keeps the formatting logic in one place. The visual output is unchanged.

---

## Summary

| File | Verdict | Action |
|------|---------|--------|
| `src/theme/_variables.scss` | PASS | No changes required. |
| `docs/theme-preview.html` | PASS with optional simplifications | Remove `resolve()` helper and generate `roleMap` from an array. |

No functional defects were found. The proposed changes are cosmetic and aimed at reducing low-value duplication in the preview script.
