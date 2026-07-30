# Phase 1 — Task 1: `_variables.scss` Simplification Plan

## Current State

`src/lib/theme/_variables.scss` is already concise (64 lines, well under the 200-line limit). The file declares foundational CSS custom properties under `:root` with the `--cba-` prefix and matches the authoritative token values defined in `.agent/project-info/brief.md` §5.

## Findings

- No commented-out code.
- No redundant token declarations or duplicate values that require extraction.
- Token names are self-documenting (e.g., `--cba-bg-primary`, `--cba-text-muted`, `--cba-radius-md`).
- Comments are minimal and section-divider comments mostly repeat what the token prefix already conveys.

## Proposed Simplifications

### 1. Shorten the header doc block

The current 10-line header repeats context that already lives in the project-info files. Reduce it to a compact block that keeps the non-obvious constraints: global `:root` scope, `--cba-` prefix, and the rule that values are authoritative / must not be renamed.

### 2. Remove section divider comments

Token prefixes (`bg-`, `text-`, `border-`, `accent-`, `radius-`, `shadow-`, `space-`) already indicate grouping. Removing the `/* Category */` dividers makes the file more compact without losing meaning, in line with the self-documenting code rule.

### 3. Preserve all token values

No values should change. The simplification is limited to structure and comments.

## Expected Outcome

- File length reduced from ~64 lines to ~50 lines.
- Same CSS output (token values unchanged).
- Improved scannability due to less visual noise.

## Constraints & Risks

- Do not rename tokens.
- Do not change values (they are authoritative per the project brief).
- Do not introduce SCSS maps, loops, or derived variables; keep the file flat so tokens remain easy to search and diff.
