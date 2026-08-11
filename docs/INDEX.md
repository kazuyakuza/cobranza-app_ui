<!--
  AI Agent Note: This is the DOCUMENTATION INDEX for @cobranza-apps/ui.
  AUDIENCE: Consumers and AI agents navigating the library docs.
  PURPOSE: Single entry point — links to every doc page grouped by category.
  MAINTENANCE: When adding a new doc page, add it here AND in README.md §Documentation.
               Keep entries alphabetical within each section.
-->

# @cobranza-apps/ui — Documentation Index

> Single entry point for consumers and AI agents. Keep alphabetical within each section.

## Getting started

- [USAGE.md](./USAGE.md) — Install, peer deps, theme import, quick start, per-component usage patterns.
- [THEME.md](./THEME.md) — Theme import, design tokens, utility classes.
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Shell & MFE integration rules: token compliance mandate, theme load (once), surface ownership map, button color guide, surface decision tree, text color rules, bar/chrome guide, checklists, anti-patterns, quick verify.

## Workspace chrome

- [MODULE_HEADER.md](./MODULE_HEADER.md)
- [MODULE_CONTAINER.md](./MODULE_CONTAINER.md)
- [CBA_MODULE_FOOTER.md](./CBA_MODULE_FOOTER.md)

## Basic components

- [CBA_BADGE.md](./CBA_BADGE.md)
- [CBA_BUTTON.md](./CBA_BUTTON.md)
- [CBA_CARD.md](./CBA_CARD.md)
- [CBA_EMPTY_STATE.md](./CBA_EMPTY_STATE.md)
- [CBA_SKELETON.md](./CBA_SKELETON.md)

## Overlays

- [CBA_DROPDOWN.md](./CBA_DROPDOWN.md)
- [CBA_MODAL.md](./CBA_MODAL.md)
- [CBA_POPOVER.md](./CBA_POPOVER.md)

## Form controls

- [CBA_DATEPICKER.md](./CBA_DATEPICKER.md)
- [CBA_INPUT.md](./CBA_INPUT.md)
- [CBA_SELECT.md](./CBA_SELECT.md)
- [CBA_TYPEAHEAD.md](./CBA_TYPEAHEAD.md)

## Other components

- [CBA_ACCORDION.md](./CBA_ACCORDION.md)

## Internal architecture (NOT public API)

- [CBA_FORM_FIELD.md](./CBA_FORM_FIELD.md) — shared field layout + ControlValueAccessor base used by Input/Select/Datepicker. Do not import directly.

## Visual preview

- [theme-preview.html](./theme-preview.html) — Live Minimal Yet Warm theme preview: minimizable sidebar (state persisted in localStorage), Shell mockup (header + non-scrolling workspace + footer), 7 module examples (100%/50%, expanded/collapsed) using the exact library component CSS classes and Font Awesome icons, full style showcase (31 color-token swatches, button state matrix, labels & pills, icon list, text-on-surfaces, typography scale, border scale, selected states, form states, semantic status badges). Regenerate with `npm run build:preview` after token changes.

## Regression tests

- `src/theme/tokens.spec.ts` — canonical `--cba-*` token names and values.
- `src/theme/contrast.spec.ts` — WCAG AA contrast ratios for text/background pairs.
- `src/theme/surfaces.spec.ts` — surface lightness ordering and minimum L* gaps.
- `src/theme/preview-html.spec.ts` — `docs/theme-preview.html` structure and `docs/theme-preview.css` canonical values.
- `src/theme/consumer-guide.spec.ts` — mandated sections in `docs/CONSUMER_GUIDE.md`.
- Run all: `npm test`. Run one: `npm test -- src/theme/<name>.spec.ts`.

## Project & AI-agent context

- [Project brief](../.agent/project-info/brief.md)
- [Architecture](../.agent/project-info/architecture.md)
- [Tech stack](../.agent/project-info/tech.md)
- [CHANGELOG](../CHANGELOG.md) — Release history (Keep a Changelog format).
