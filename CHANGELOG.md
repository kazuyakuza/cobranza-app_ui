<!--
  FILE: CHANGELOG.md — Release changelog for @cobranza-apps/ui
  FORMAT: Keep a Changelog (https://keepachangelog.com/en/1.1.0/)
  VERSIONING: Semantic Versioning (https://semver.org/spec/v2.0.0.html)

  HOW TO UPDATE:
    1. NEVER use an [Unreleased] section — every push to origin publishes the lib.
       Add entries directly under the current dated [x.y.z] — YYYY-MM-DD header.
    2. Bump package.json version and create the dated header in the same change.
    3. Use categories: Added, Changed, Fixed, Deprecated, Removed, Security.
    4. Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries
       touch design tokens, components, or integration patterns.

  RULE: See .kilo/rules/changelog-versioning.md (no [Unreleased] sections).

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

## [0.12.0] — 2026-08-07

### Added

- **Selected state tokens** in `src/theme/_variables.scss`: `--cba-selected-bg` (#E4DDD0), `--cba-selected-border` (aliases `--cba-accent-primary`), `--cba-selected-text` (aliases `--cba-text-primary`), `--cba-selected-hover` (#D8CFC0). Semantics: selected ≠ active(pressed) ≠ focus. Consumers: footer pills, nav tabs, table rows, dropdown options, filter chips. See `docs/THEME.md` §Selected State and `docs/CONSUMER_GUIDE.md` §Selected State Usage.
- **Form state tokens** in `src/theme/_variables.scss`: `--cba-state-invalid-border` (#B93E36), `--cba-state-invalid-text` (#8B3028), `--cba-state-valid-border` (#3E6B4F), `--cba-state-valid-text` (#2E523C), `--cba-state-disabled-bg` (#E0DCD4), `--cba-state-disabled-text` (#9A958D). Reuse warmed accent hues (no parallel reds/greens invented). See `docs/THEME.md` §Form State Matrix and `docs/CONSUMER_GUIDE.md` §Form State Matrix.
- **Typography scale tokens** in `src/theme/_variables.scss`: six-step scale as `--cba-font-size-{display,heading-lg,heading-md,body,small,caption}` + matching `--cba-line-height-*` pairs. Utility classes `.cba-text-display` through `.cba-text-caption` generated in `src/theme/_utilities.scss`. See `docs/THEME.md` §Typography Scale and `docs/CONSUMER_GUIDE.md` §Typography Scale Usage.
- **Radius and shadow rules** documented in `docs/THEME.md` and `docs/CONSUMER_GUIDE.md`: lg/md/sm/pill usage table; border-primary / shadow-secondary rule.

### Changed

- **Surface retuning** in `src/theme/_variables.scss` for multi-module density: canvas (`--cba-bg-primary`) darkened from #C5BFAE to #BCB5A4 (L* ~74); panel (`--cba-bg-secondary`) lightened from #E6DDC6 to #F2F0E8 (L* ~94); elevated (`--cba-bg-elevated`) lightened from #FBF7ED to #FDFCF8 (L* ~99); inset (`--cba-bg-tertiary`) unchanged at #D8C3A5 (L* ~81). New L* gaps: canvas→panel ≈ 20, panel→elevated ≈ 5, panel→inset ≈ 13. Modules now read as cards on a desk. See `docs/THEME.md` §Surface Hierarchy and [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme).
- **Border retuning** in `src/theme/_variables.scss`: `--cba-border-subtle` lightened from #DAD7CA to #E8E5DB (recedes on panel); `--cba-border-default` adjusted from #A7A6A2 to #A29D94 (visible structural edge); `--cba-border-strong` darkened from #8E8D8A to #6B665E (defines chrome shape). Three levels now visibly distinct on cream/sand. See `docs/THEME.md` §Border Roles.

### Notes

- **No existing `--cba-*` token names were renamed** — only values changed (surfaces, borders) and new tokens added (selected, form state, typography scale). Additive change.
- **Potential visual breaking change** for Shell layouts that depended on the previous surface values (canvas #C5BFAE, panel #E6DDC6, elevated #FBF7ED). After upgrade the canvas is clearly darker and modules lift more distinctly; Shell authors should review the updated [Consumer Guide](docs/CONSUMER_GUIDE.md) and verify in `docs/theme-preview.html`.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Front-end spec: [20260807-phase10-cluster1-frontend-spec.md](.kilo/plans/20260807-phase10-cluster1-frontend-spec.md).

## [0.11.2] — 2026-08-07

### Added

- New interactive-state tokens in `src/theme/_variables.scss` for solid accent buttons: `--cba-hover-inverse` (`rgba(253, 252, 248, 0.12)`) and `--cba-active-inverse` (`rgba(253, 252, 248, 0.22)`). Hue matches `--cba-text-inverse`; applied via `background-image: linear-gradient(token, token)` so the overlay composites over the base accent fill without replacing it. See `.agent/project-info/brief.md` §5 and `docs/CONSUMER_GUIDE.md` §Button Color Guide.

### Fixed

- Solid button variants (`primary`, `danger`, `success`) were nearly indistinguishable across normal/hover/active states because dark overlays (`--cba-hover`, `--cba-active`) on already-dark accent backgrounds produced imperceptible shifts. Solid variants now use the new light inverse overlays; `secondary` and `ghost` continue using the dark overlays (light surfaces). Mirrors the split in `docs/theme-preview.html` and regenerates `docs/theme-preview.css` via `npm run build:preview`. Token-key parity asserted by `src/theme/tokens.spec.ts` and `src/theme/preview-html.spec.ts`.

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

## [0.11.0] — 2026-08-06

### Changed

- Adjusted two **Minimal Yet Warm** surface tokens in `src/theme/_variables.scss` to widen
  the panel→elevated L*gap from ~4.2 to ~9.0: `--cba-bg-secondary` (panel) darkened from
  `#F2F0E8` to `#E6DDC6` (warm cream, L* 88.26); `--cba-bg-elevated` tinted from `#FDFCF8`
  to `#FBF7ED` (warm cream, lightest surface, L* 97.29). Canvas (`#C5BFAE`), inset
  (`#D8C3A5`), text, accent, and border tokens unchanged.
- Synced `docs/theme-preview.html`, `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, and
  `.agent/project-info/brief.md` §5 to the adjusted token values and updated L* gap
  descriptors (canvas→panel ≈11, panel→elevated ≈9, panel→inset ≈8, elevated→inset ≈17).
- `docs/theme-preview.html` now uses compiled library CSS (`docs/theme-preview.css` from
  `src/theme/theme.scss`) instead of mirrored inline custom properties. The preview resolves
  `--cba-*` tokens from `:root` exactly as the Shell does, eliminating token drift.

### Fixed

- Surface distinguishability: panel→elevated step is now the clearest in the stack (~9 L*),
  resolving the issue where `--cba-bg-elevated` (used by active/pressed secondary buttons)
  was visually indistinguishable from the panel surface it sits on.

### Added

- **Regression test suite** (11 files: 6 helpers + 5 specs) under `src/theme/` and
  `src/components/testing/` guarding theme integrity:
  - `tokens.spec.ts` — canonical `--cba-*` token names and values in `_variables.scss`.
  - `contrast.spec.ts` — WCAG AA contrast ratios for all intended text/background pairs.
  - `surfaces.spec.ts` — surface lightness ordering and minimum L* gaps between canvas,
    panel, elevated, and inset.
  - `preview-html.spec.ts` — `docs/theme-preview.html` structure (compiled CSS link,
    required sections, 9 token swatches, TOKEN_ROLES mapping, muted-text restriction) and
    `docs/theme-preview.css` `:root` canonical values.
  - `consumer-guide.spec.ts` — mandated sections in `docs/CONSUMER_GUIDE.md` (token
    compliance, button guide, surface tree, text rules, bar/chrome guide, checklists,
    anti-patterns, quick verify).
  - Shared test helpers: `color-math`, `scss-tokens`, `html-loader`, `markdown-headings`,
    `project-files`, `theme-fixtures`.
- Cross-reference comments in `src/theme/_utilities.scss`, `src/theme/_mixins.scss`, and
  `src/theme/theme.scss` pointing to brief.md §5 and docs/THEME.md for AI-agent navigation.
- `docs/theme-preview.html` overhaul: now links compiled `docs/theme-preview.css` (generated
  from `src/theme/theme.scss` via `npm run build:preview`) so the preview resolves real
  `--cba-*` tokens — zero drift from the library. Added 9 token swatches (canvas, panel,
  elevated, inset, text, border, accent, warning, danger) with hex + token labels, a button
  state matrix (5 variants × 4 states × 3 surfaces = 60 buttons), text-on-surfaces samples
  with muted-restriction callouts on canvas/inset, and a surface ownership demo (Shell
  mockup showing canvas → panel → elevated → inset hierarchy).
- `build:preview` npm script (`sass src/theme/theme.scss docs/theme-preview.css`) and `sass`
  devDependency for regenerating the preview stylesheet after token changes.
- `docs/CONSUMER_GUIDE.md` — five new prescriptive sections for Shell and MFE authors:
  **Token Compliance Mandate** (≥90 % `--cba-*` usage, no hard-coded hex without a `TODO`),
  **Button Color Guide** (variant × surface base mapping, state overlays, focus ring),
  **Surface Decision Tree** (canvas / panel / elevated / inset / overlay decision rule),
  **Text Color Rules** (allowed text tokens per surface, muted restriction on canvas and
  inset), and **Bar and Chrome Guide** (header, footer, module header/footer, footer pills
  with border and height tokens). Cross-references updated in `docs/INDEX.md`, `README.md`,
  and `docs/THEME.md`.

### Notes

- **No token names renamed, added, or removed** — only two values changed. Build/lint pass;
  consumers of `--cba-*` tokens get the refined hierarchy by upgrading.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)
  and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- Task 1 front-end spec: [20260806-task1-token-adjustments-frontend-spec.md](.kilo/plans/20260806-task1-token-adjustments-frontend-spec.md).
- Task 2 front-end spec: [20260806-task2-preview-html-frontend-spec.md](.kilo/plans/20260806-task2-preview-html-frontend-spec.md).
- Task 3 front-end spec: [20260806-task3-consumer-guide-frontend-spec.md](.kilo/plans/20260806-task3-consumer-guide-frontend-spec.md).

## [0.10.0] - 2026-08-05

### Changed

- Widened the **Minimal Yet Warm** surface hierarchy in `src/theme/_variables.scss` so
  all four surfaces are obviously distinct: canvas darkened to `#C5BFAE` (warm sand
  floor), panel refined to `#F2F0E8` (clean cream), elevated to `#FDFCF8` (warm
  near-white), inset kept at `#D8C3A5` (warm sand). Canvas → panel step ≈ 17 L*,
  panel → elevated ≈ 4 L*, inset sits ≈ 15 L* below panel.
- Strengthened borders on cream/sand: `--cba-border-subtle` now `#DAD7CA` (was
  `#E7E5DE`); `--cba-border-default` `#A7A6A2` and `--cba-border-strong` `#8E8D8A`
  confirmed for inputs, footer pills, and header icon-button outlines.
- Increased warm-tinted module shadows: `--cba-shadow-module` now
  `0 6px 24px rgba(43, 34, 28, 0.18)` (was `0 4px 16px ... 0.12`);
  `--cba-shadow-elevated` now `0 10px 32px rgba(43, 34, 28, 0.26)` (was
  `0 8px 24px ... 0.18`). Modules visibly lift off the warm canvas without harsh black
  bloom.
- README now refers to the design system as **Minimal Yet Warm** (was
  "intermediate-gray"); no behavioral change.

### Added

- `docs/CONSUMER_GUIDE.md` — normative Shell & MFE integration guide: theme load
  (once), surface ownership map (Shell / Lib / MFE), Shell checklist (6 items), MFE
  checklist (4 items), anti-patterns (5), quick visual verify (5 steps).
- `docs/THEME.md` surface-hierarchy note pointing to the Consumer Guide.
- Cross-links from `docs/INDEX.md`, `README.md` (Integration Notes + Documentation), and
  `docs/THEME.md` to the new Consumer Guide.

### Notes

- **No token names renamed, added, or removed** — only values and docs changed.
  Build/lint pass; consumers of `--cba-*` tokens get the new hierarchy by upgrading.
- **Potential visual breaking change for Shell layouts** that depended on near-identical
  surfaces (canvas vs panel both ~#EAE7DC/#F3F1E9). After upgrade the canvas is clearly
  sand and modules lift as cards; Shell authors should review the Consumer Guide and
  confirm the workspace uses `--cba-bg-primary`. See
  [docs/CONSUMER_GUIDE.md](docs/CONSUMER_GUIDE.md).
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)
  and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- `--cba-text-muted` is now RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) in
  addition to `--cba-bg-tertiary` (~3.86:1); use `--cba-text-secondary` on those
  surfaces.

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
