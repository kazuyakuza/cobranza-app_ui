# Changelog

All notable changes to `@cobranza-apps/ui` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.

## [Unreleased]

## [0.8.1] - 2026-08-03

### Added

- Added a complete Design Tokens reference to `docs/USAGE.md`, with full value tables for
  backgrounds, text, borders, accents, interactive states, and shadows so consumers can adopt
  the lightened palette without inspecting source SCSS.
- Added grouped section comments inside `src/theme/_variables.scss` documenting each token group
  (backgrounds, text, borders, accents, interactive, layout, radius, shadows, spacing) for easier
  navigation by humans and AI agents.

### Changed

- **Lightened the intermediate-gray theme palette.** Background surfaces moved from near-dark
  grays to a lighter medium-gray scale (`#7a838d` → `#aeb6bf`), giving the back-office a calmer,
  brighter feel while staying within the gray design language.
- Switched text tokens to near-black (`#0f1115` → `#212429`) so body and secondary text keep
  strong legibility on the lighter backgrounds.
- Adjusted interactive states (`hover`/`active`) from white overlays to subtle dark overlays to
  match the new light surfaces.
- Reduced shadow opacity for module and elevated surfaces so depth reads softer on light gray.
- Reduced the modal/overlay backdrop from `0.55` to `0.32` opacity for a less heavy dimming.
- Reorganized `src/theme/_variables.scss` with section comments and deduplicated the
  `--cba-border-subtle` token (now aliases `--cba-bg-elevated`). **No token names changed**,
  so this is a drop-in update for existing consumers.
- Updated theme documentation (`docs/THEME.md`, `docs/USAGE.md`, `README.md`, and the project
  brief) to reflect the lightened token values and renamed `#5-design-tokens-theme` anchors.

### Fixed

- Fixed text-contrast compliance: darkened `--cba-text-secondary` to `#15181c` and
  `--cba-text-muted` to `#212429` so all intended text/background pairs meet WCAG AA 4.5:1.
  - `--cba-text-secondary` on `--cba-bg-primary`: 4.63:1 (passes AA).
  - `--cba-text-muted` on `--cba-bg-secondary`: 5.13:1 (passes AA).
  - Known, documented intentional exception: `--cba-text-muted` on `--cba-bg-primary` (4.05:1)
    remains below AA and is restricted — library components must not pair them; use
    `--cba-text-secondary` on `--cba-bg-primary` for lower-emphasis text instead.
