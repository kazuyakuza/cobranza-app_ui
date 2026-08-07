# Changelog Versioning Rule

- `CHANGELOG.md` MUST NOT contain an `[Unreleased]` section. Every push to remote
  `origin` publishes the library, so every change MUST be documented under a dated
  `[x.y.z] — YYYY-MM-DD` header before it lands on `main`.
- Bump `package.json` version and create the dated `CHANGELOG.md` header in the
  same commit/PR that introduces the change.
- New entries go directly under the current in-progress version header (e.g.
  `## [0.11.1] — 2026-08-06`).
- Use [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) categories
  (Added, Changed, Fixed, Deprecated, Removed, Security) and
  [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- Historical entries predating this rule are NOT retroactively edited.
- AI agents MUST verify before committing that `CHANGELOG.md` introduces no new
  `[Unreleased]` section; if one exists, remove it and move its entries under the
  current dated header.
- Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries touch
  design tokens, components, or integration patterns.
