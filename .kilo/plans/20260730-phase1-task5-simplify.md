# Code Simplification Plan — Phase 1, Task 5: Base Typography & Defaults

## File reviewed

`src/lib/theme/_base.scss`

## Current content

```scss
/**
 * Base typography and global defaults for @cobranza-apps/ui.
 * Imported by theme.scss after variables and before mixins/utilities.
 * This file intentionally does not fight Bootstrap 5; it only adds
 * complementary defaults that use the --cba-* token set.
 */

// ---------------------------------------------------------------------------
// Root typography
// ---------------------------------------------------------------------------
:root {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    'Noto Sans',
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: var(--cba-text-primary);
}

body {
  color: var(--cba-text-primary);
  background-color: transparent;
}

// ---------------------------------------------------------------------------
// Headings
// ---------------------------------------------------------------------------
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
  line-height: 1.25;
  color: var(--cba-text-primary);
}

h3,
h4,
h5,
h6 {
  font-weight: 500;
}

// ---------------------------------------------------------------------------
// Body text
// ---------------------------------------------------------------------------
p {
  margin-bottom: var(--cba-space-3);
}

small,
.cba-text-small {
  font-size: 0.857rem;
  color: var(--cba-text-secondary);
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------
a {
  color: var(--cba-accent-primary);
  text-decoration: none;

  &:hover {
    color: var(--cba-accent-info);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    border-radius: var(--cba-radius-sm);
    box-shadow: var(--cba-focus-ring);
  }
}

// ---------------------------------------------------------------------------
// Focusable elements
// ---------------------------------------------------------------------------
button,
input,
textarea,
select,
a,
[tabindex]:not([tabindex='-1']) {
  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}

// ---------------------------------------------------------------------------
// Monospace text
// ---------------------------------------------------------------------------
code,
kbd,
pre {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-size: 0.928em;
}
```

## Simplification analysis

- **Structural complexity**: The file contains only flat selector blocks and one shallow nesting level for `a` states and focusable elements. There are no mixins, functions, loops, or conditional logic.
- **Redundancy**: No duplicate declarations, dead selectors, or commented-out code.
- **Selector grouping**: Headings are already grouped efficiently (`h1–h6` then `h3–h6` override). Links and focusable elements are separated because links require `border-radius` on focus while other elements do not.
- **Token usage**: All colors, spacing, radius, and focus values reference `--cba-*` tokens; no raw values or magic numbers beyond the necessary font-size values (`14px`, `0.857rem`, `0.928em`) which are part of the design-token contract and cannot be derived from existing tokens.
- **Font stacks**: The `:root` and `code/kbd/pre` font-family lists are long but required for cross-platform fallbacks; shortening them would reduce robustness.
- **Comments**: The file header explains the module's responsibility and its Bootstrap 5 coexistence policy. Section banners improve scannability in a 100+ line file. Removing them would save ~14 lines but reduce clarity without improving semantics.
- **Rule compliance**:
  - 113 lines total → well under the 200-line `src/` limit (`max-lines-per-file.md`).
  - Nesting never exceeds 1 level → within the 2-level `max-depth.md` allowance.
  - No SCSS functions/mixins → `max-arguments-per-method.md` is not applicable.
  - Selectors and token names are self-documenting (`self-documenting-code.md`).
  - No commented-out code (`no-commented-code.md`).

## Proposed simplifications

No material simplifications are identified. The file is already minimal, well-structured, and spec-compliant.

Minor stylistic reductions that were considered and rejected:

1. **Remove section divider lines** (`// ---------------------------------------------------------------------------`): Would save ~14 lines but harm visual scanning for the seven thematic sections.
2. **Shorten the header comment**: The header communicates the module's purpose and the Bootstrap 5 coexistence rule; a one-line comment would omit important context.
3. **Merge `a:focus-visible` into the generic focusable-elements block**: The link focus style requires `border-radius: var(--cba-radius-sm)`, which the generic block intentionally omits. Merging would change behavior.

## Recommendation

Leave `src/lib/theme/_base.scss` unchanged. The file is within all project limits, self-documenting, and aligned with the front-end specification. Refactor only if the module grows significantly (e.g., adding reset rules, form defaults, or list styles) and the section banners become redundant.
