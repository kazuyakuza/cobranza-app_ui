<!--
  FILE: CHANGELOG.md — Release changelog for @cobranza-apps/ui
  FORMAT: Keep a Changelog (https://keepachangelog.com/en/1.1.0/)
  VERSIONING: Semantic Versioning (https://semver.org/spec/v2.0.0.html)

  HOW TO UPDATE:
    1. Add entries under [Unreleased] as work lands on main.
    2. Before a release, rename [Unreleased] to [x.y.z] with the release date.
    3. Create a new empty [Unreleased] section above it.
    4. Use categories: Added, Changed, Fixed, Deprecated, Removed, Security.
    5. Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries
       touch design tokens, components, or integration patterns.

  AUDIENCE: Consumers, maintainers, and AI agents tracking release history.
  RELATIONSHIPS:
    - brief.md §5 — Design Tokens (Theme) source of truth.
    - docs/THEME.md — Theme import, tokens, and utility classes guide.
    - docs/USAGE.md — Consumer usage patterns and examples.
    - context.md — Current work status and recent changes log.
-->

# Changelog

All notable changes to `@cobranza-apps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.

## [0.9.0] - 2026-08-04

### Changed

- Replaced the intermediate-gray palette with the **Minimal Yet Warm** system across
  `src/theme/_variables.scss`: warm sand/cream/taupe surfaces (canvas `#EAE7DC`,
  panel `#F3F1E9`, elevated `#FCFBF6`, inset `#D8C3A5`), warm near-black/taupe text,
  warm border steps, warm-tinted shadows and hover/active overlays.
- `--cba-accent-primary` is now a warm taupe `#6B5B4F` (was blue `#3b82f6`). Coral
  (`#E98074` / `#E85A4F`) is reserved for warning/danger/focus accents only.
- `--cba-focus-ring` is now a warm coral ring (`rgba(232,90,79,0.45)`) to stay visible
  on warm light surfaces.
- `--cba-border-subtle` is now a dedicated `#E7E5DE` separator (was an alias of
  `--cba-bg-elevated`).
- Module header surface switched to `--cba-bg-elevated`; module footer to
  `--cba-bg-tertiary` (inset) to expose the four-level surface hierarchy.
- `docs/theme-preview.html` reduced to a single Minimal Yet Warm theme (theme-list UI
  retained for future themes).

### Added

- Inline accent-discipline guidance in `src/theme/_variables.scss` (coral reserved for
  status/focus/small accents; primary CTAs use warm taupe).
- Muted-text restriction now documented against the warm inset surface
  (`--cba-bg-tertiary`, ~3.86:1).

### Fixed

- Accordion disabled button text contrast: `--cba-text-muted` on `--cba-bg-tertiary`
  (~3.86:1, below WCAG AA) replaced with `--cba-text-secondary` (passes AA). See
  `src/theme/_accordion.scss`.
- Theme preview (`docs/theme-preview.html`) no longer demonstrates the restricted
  muted-on-inset pair; `.search` chip uses `--text-2` (`--cba-text-secondary`).
- Theme preview now uses static token values matching `--cba-*` exactly, replacing
  dynamic color-derivation logic that produced slightly different shadows/overlays.

### Notes

- **No token names were renamed, added, or removed** — only values, component
  surface-role token references, and documentation changed. Build/lint pass; this is
  not a breaking API change for consumers of `--cba-*` tokens.
- See `.agent/project-info/brief.md` §5 for the authoritative token table and
  `docs/THEME.md` for the theme quick reference.

## [0.8.1] - 2026-08-03

### Added

- Added a complete Design Tokens reference to `docs/USAGE.md`, with value tables for
  backgrounds, text, borders, accents, interactive states, and shadows.
- Added grouped section comments inside `src/theme/_variables.scss` documenting each token group.

### Changed

- **Lightened the intermediate-gray theme palette** (see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)).
  Background surfaces shifted to a lighter medium-gray scale (`#2a2d32` → `#7a838d`).
- Updated text tokens to near-black (`#e8eaed` → `#0f1115`) for stronger legibility on lighter
  backgrounds.
- Adjusted interactive `hover`/`active` states from white overlays to subtle dark overlays.
- Reduced shadow opacity for module and elevated surfaces.
- Reduced the modal/overlay backdrop from `0.55` to `0.32` opacity.
- Reorganized `src/theme/_variables.scss` with section comments and deduplicated the
  `--cba-border-subtle` token (now aliases `--cba-bg-elevated`). **No token names changed**,
  so this is a drop-in update.
- Updated theme documentation (`docs/THEME.md`, `docs/USAGE.md`, `README.md`, and the project
  brief) to reflect the lightened token values and renamed `#5-design-tokens-theme` anchors.

### Fixed

- Fixed text-contrast compliance: darkened `--cba-text-secondary` to `#15181c` and
  `--cba-text-muted` to `#212429` so intended text/background pairs meet WCAG AA 4.5:1.
  - `--cba-text-secondary` on `--cba-bg-primary`: 4.63:1.
  - `--cba-text-muted` on `--cba-bg-secondary`: 5.13:1.
  - Intentional exception: `--cba-text-muted` on `--cba-bg-primary` is 4.05:1; library
    components must not use this pair. Use `--cba-text-secondary` on `--cba-bg-primary` for
    lower-emphasis text.

---

## Cross-Reference (AI Agents)

- [Project Brief §5 — Design Tokens](.agent/project-info/brief.md#5-design-tokens-theme) — Source of truth for token values.
- [Theme Guide](docs/THEME.md) — Theme import, tokens, and utility classes.
- [Usage Guide](docs/USAGE.md) — Consumer patterns and examples.
- [Context](.agent/project-info/context.md) — Current work status and recent changes.
- [Architecture](.agent/project-info/architecture.md) — Build strategy and integration patterns.
