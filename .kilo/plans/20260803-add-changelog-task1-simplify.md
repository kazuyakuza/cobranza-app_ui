# CHANGELOG.md Simplification Plan

## File

`CHANGELOG.md`

## Proposed Improvements

### 1. Tighten verbose bullet phrasing

Several entries carry filler words and explanatory clauses that can be removed without losing meaning.

**Current:**
- Added a complete Design Tokens reference to `docs/USAGE.md`, with full value tables for backgrounds, text, borders, accents, interactive states, and shadows so consumers can adopt the lightened palette without inspecting source SCSS.
- Added grouped section comments inside `src/theme/_variables.scss` documenting each token group (backgrounds, text, borders, accents, interactive, layout, radius, shadows, spacing) for easier navigation by humans and AI agents.

**Simpler:**
- Added a complete Design Tokens reference to `docs/USAGE.md` with value tables for backgrounds, text, borders, accents, interactive states, and shadows.
- Added grouped section comments inside `src/theme/_variables.scss` documenting each token group.

### 2. Condense changed entries

Combine related theme adjustments and remove redundant justification.

**Current:**
- **Lightened the intermediate-gray theme palette.** Background surfaces moved from near-dark grays to a lighter medium-gray scale (`#7a838d` → `#aeb6bf`), giving the back-office a calmer, brighter feel while staying within the gray design language.
- Switched text tokens to near-black (`#0f1115` → `#212429`) so body and secondary text keep strong legibility on the lighter backgrounds.
- Adjusted interactive states (`hover`/`active`) from white overlays to subtle dark overlays to match the new light surfaces.
- Reduced shadow opacity for module and elevated surfaces so depth reads softer on light gray.

**Simpler:**
- **Lightened the intermediate-gray theme palette.** Background surfaces shifted to a lighter medium-gray scale (`#7a838d` → `#aeb6bf`).
- Updated text tokens to near-black (`#0f1115` → `#212429`) for stronger legibility on lighter backgrounds.
- Adjusted interactive `hover`/`active` states from white overlays to subtle dark overlays.
- Reduced shadow opacity for module and elevated surfaces.

### 3. Simplify fixed/contrast section

The contrast note is wordy and repeats the standard.

**Current:**
- Fixed text-contrast compliance: darkened `--cba-text-secondary` to `#15181c` and `--cba-text-muted` to `#212429` so all intended text/background pairs meet WCAG AA 4.5:1.
  - `--cba-text-secondary` on `--cba-bg-primary`: 4.63:1 (passes AA).
  - `--cba-text-muted` on `--cba-bg-secondary`: 5.13:1 (passes AA).
  - Known, documented intentional exception: `--cba-text-muted` on `--cba-bg-primary` (4.05:1) remains below AA and is restricted — library components must not pair them; use `--cba-text-secondary` on `--cba-bg-primary` for lower-emphasis text instead.

**Simpler:**
- Fixed text-contrast compliance: darkened `--cba-text-secondary` to `#15181c` and `--cba-text-muted` to `#212429` so intended text/background pairs meet WCAG AA 4.5:1.
  - `--cba-text-secondary` on `--cba-bg-primary`: 4.63:1.
  - `--cba-text-muted` on `--cba-bg-secondary`: 5.13:1.
  - Intentional exception: `--cba-text-muted` on `--cba-bg-primary` is 4.05:1; library components must not use this pair. Use `--cba-text-secondary` on `--cba-bg-primary` for lower-emphasis text.

### 4. Formatting improvement

- Keep the Keep a Changelog section headings and `[Unreleased]` placeholder.
- Maintain backticks for file paths and token names.
- Remove redundant phrases such as "so consumers can adopt", "for easier navigation by humans and AI agents", "giving the back-office a calmer, brighter feel while staying within the gray design language", and "so depth reads softer on light gray".

## Out of scope

- Version/date accuracy (e.g., whether the release should be `0.8.0` or `0.8.1`) is not a simplification concern and should be handled by the implementation reviewer.

## Summary

The changelog is well-structured but the entries are wordier than necessary. Applying the above changes would reduce line count, improve scannability, and keep the same factual content.
