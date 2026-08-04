# Plan — Task 1: Add CHANGELOG.md (Theme Lightening Release)

- **TODO file:** `.agent/todos/20260803/20260803-todo-1.md`
- **Task line:** `- Task 1: Add a CHANGELOG.md file documenting the theme lightening changes in version 0.8.0`
- **Plan file (this):** `.kilo/plans/20260803-add-changelog-task1-plan.md`
- **Sub-agent step:** 4.1b Analysis & Planning (architector)
- **Scope:** Plan only. No code files are edited in this step.

## 0. Pre-Analysis (technical & content decisions)

### 0.1 Discrepancy resolution — release version

- The TODO line text says "version 0.8.0", but the calling task prompt (authoritative) says
  "version 0.8.1 (the version we just bumped to)".
- Verified against git:
  - `package.json` version = `0.8.1`.
  - `b7b7722 chore: bump version to 0.8.1` (committed **2026-08-03 23:07:56 -0300**) is the
    most recent commit and is the release marker for the changelog.
  - `2d645de chore: bump version to 0.8.0` precedes the theme work (`ee026b3`).
  - All theme-lightening commits (`ee026b3`, `f992529`, `9919dca`, `066b556`) sit
    **between** the 0.8.0 bump and the 0.8.1 bump.
- **Decision:** The release entry is **`0.8.1`** dated **`2026-08-03`**. The 0.8.0 bump is not
  listed as its own release entry (version bumps are internal chores; per Keep a Changelog only
  user-facing changes populate categories, and the release marker itself is the version heading).
  This matches requirement #4's note: "chore: bump version to 0.8.0 (already documented as part
  of the release)".

### 0.2 Prior-versions decision

- Requirement #7: "Consider whether to include previous versions (0.8.0, 0.7.4, etc.) based on
  git history."
- Findings:
  - No git tags exist (`git tag` returns nothing) → no authoritative release points.
  - No prior `CHANGELOG.md` exists (this is the first one).
  - Version-bump commits exist for 0.2.0 → 0.8.0, but no associated per-release notes were ever
    authored; reconstructing them now would require inventing release narratives from commit
    archaeology.
- **Decision (evidence-based, no invention):** Document **only `0.8.1`** in detail plus an empty
  `Unreleased` section. Do NOT fabricate historical entries for 0.2.0–0.8.0. Add a one-line note
  in the file header stating that releases prior to 0.8.1 predate the changelog and are not
  retroactively reconstructed. This respects the "Verify Information / No assumptions" guideline.
  (If the user later wants retroactive history, that becomes a separate TODO.)

### 0.3 Format standard

- Follow **Keep a Changelog v1.1.0**: https://keepachangelog.com/en/1.1.0/
- Required header block:
  - One-line intro sentence.
  - Reference link to Keep a Changelog.
  - Reference link to SemVer (https://semver.org/spec/v2.0.0.html).
- Section ordering (newest first): `## [Unreleased]` then `## [0.8.1] - 2026-08-03`.
- Category headings used: `### Added`, `### Changed`, `### Fixed` (per requirement #6).

### 0.4 Commit → category mapping (technical → user-facing)

| Commit | Tech scope | Category | User-facing phrasing |
|---|---|---|---|
| `ee026b3` feat(theme): lighten gray token values | backgrounds, text, borders, overlays, hover/active, shadows | **Changed** | Lightened the intermediate-gray theme palette: backgrounds are now medium-gray, text is near-black for stronger contrast, interactive hover/active overlays switched from white to dark, and shadows were softened. Token names unchanged → drop-in update. |
| `f992529` refactor(theme): dedupe border-subtle + section comments | `_variables.scss` internal structure | (folded into Changed, internal cleanup — user-facing note: "Theme variable file reorganized with grouped section comments; no token names changed.") | Changed |
| `9919dca` docs: update documentation for lightened gray theme tokens | `docs/USAGE.md`, `docs/THEME.md`, `README.md`, `brief.md`, `_variables.scss` JSDoc | **Added** | Added a full Design Tokens reference (value tables for backgrounds, text, borders, accents, interactive, shadows) to `docs/USAGE.md`; updated theme docs and README anchors. |
| `066b556` fix(theme): darken secondary and muted text tokens to meet WCAG AA contrast | `--cba-text-secondary` → `#15181c`, `--cba-text-muted` → `#212429` | **Fixed** | Fixed text-contrast regression: secondary and muted text tokens darkened so all intended text/background pairs meet WCAG AA 4.5:1. (`--cba-text-muted` on `--cba-bg-primary` remains a documented intentional exception.) |
| `2d645de` / `b7b7722` chore: bump version | version only | (not listed as content; covered by the release heading) | — |

### 0.5 File placement & gitignore compliance

- Target file: `CHANGELOG.md` at repo root (`C:\projects\cobranza-app\front\ui\CHANGELOG.md`).
- Verified `.gitignore`: no pattern matches `CHANGELOG.md` → safe to commit.
- Root currently has no changelog (confirmed via glob `CHANGELOG*` → no results).
- This is a docs file at repo root, not a `src/` code file → max-lines-per-file rule does not apply.

### 0.6 Documentation cross-links (optional good practice)

- `README.md` has a `## Documentation` section (TOC line 21). Adding a one-line pointer to
  `CHANGELOG.md` improves discoverability but is NOT strictly required by the TODO line.
  Include it as a small, clearly-scoped optional step.

## 1. High-Level Approach

1. Create `CHANGELOG.md` at repo root following Keep a Changelog v1.1.0.
2. Populate it with: header (intro + format/semver links), empty `## [Unreleased]`,
   and a `## [0.8.1] - 2026-08-03` section containing `### Added`, `### Changed`, `### Fixed`
   in user-facing professional language.
3. Add a one-line note in the header that releases prior to 0.8.1 predate this changelog.
4. (Optional) Add a Changelog pointer to `README.md` `## Documentation` section.
5. Commit with a meaningful message.
6. No build/test needed (markdown-only). Verify diagnostics remain clean for any edited `.md`.
7. Verify against original TODO line and this plan.

## 2. Detailed Steps

### Step 2.1 — Author `CHANGELOG.md`

**Action:** Create new file `CHANGELOG.md` (repo root) with the exact content below.

```markdown
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
```

**Notes for implementer:**
- Use real newlines (newline-prevention rule) — the `create_file_code` content must contain
  actual line breaks, not `\n` escapes.
- Category order within a release: `Added` → `Changed` → `Fixed` (matches requirement #6 list
  order and Keep a Changelog conventions). Do not add empty `### Deprecated`, `### Removed`, or
  `### Security` sections (Keep a Changelog says to omit categories with no entries).
- Keep wording user-facing and professional; avoid raw commit hashes or internal sub-task
  references in the published file (those stay in the plan, not the changelog).

### Step 2.2 — (Optional) Point to the changelog from README

**Action:** In `README.md`, within the existing `## Documentation` section (referenced by TOC line
21), add one bullet linking to `CHANGELOG.md`. Use `read_file_code` first to locate the exact
existing bullets in that section, then use `replace_lines_code` to append the bullet without
removing existing content (preserve-existing-code rule).

Suggested bullet:
```markdown
- [CHANGELOG.md](./CHANGELOG.md) — Notable changes per release (Keep a Changelog format).
```

If the `## Documentation` section already ends with a list, append the bullet to that list. Do not
reorder or alter other bullets. This step is optional; if it risks ambiguous placement, skip it
and leave a note in the completion summary.

### Step 2.3 — Verify

- Re-open `CHANGELOG.md` with `read_file_code` to confirm newlines rendered correctly and the
  three category headings plus the version/date heading are present.
- Run `vscode-mcp-server_get_diagnostics_code` on `README.md` (if edited) and on
  `CHANGELOG.md` to confirm no errors/warnings introduced. (Markdown files rarely surface
  diagnostics; expect a clean result.)
- Confirm file is at repo root (not under `src/`), so max-lines rules don't apply.
- Confirm `.gitignore` does not match `CHANGELOG.md` (already verified in pre-analysis).

### Step 2.4 — Commit

**Action:** Stage and commit. Single `git` commands only (no chaining); follow gitignore-compliance.

1. `git status` — confirm only `CHANGELOG.md` (and optionally `README.md`) are added/modified;
   no `node_modules/`, `.kilo/agent-manager.json`, `.eslintcache`, `*.tsbuildinfo`, `dist/`, etc.
2. `git add CHANGELOG.md`
3. (If README edited) `git add README.md`
4. `git commit -m "docs: add CHANGELOG.md documenting 0.8.1 lightened gray theme release"`

**Commit message rules:** matches repo style (`type: subject`, lowercase, imperative).
Do NOT use `git push` (handled later by the Critical Workflow completion step, push to `origin`
only).

### Step 2.5 — Plan self-check

Re-read `CHANGELOG.md` and verify against:
- Requirement #1: file at root ✓
- Requirement #2: Keep a Changelog v1.1.0 format ✓ (header links, Unreleased, release heading)
- Requirement #3: documents 0.8.1 ✓
- Requirement #4: all five theme commits accounted for (feat→Changed, refactor→Changed,
  fix→Fixed, docs→Added, version bumps→release heading) ✓
- Requirement #5: user-facing, professional, no raw hashes ✓
- Requirement #6: Added / Changed / Fixed present ✓
- Requirement #7: prior versions decision documented in header note (not fabricated) ✓

## 3. Files Touched

| File | Action | Mandatory |
|---|---|---|
| `CHANGELOG.md` (root) | Create | Yes |
| `README.md` | Append changelog pointer in `## Documentation` | Optional |

No `src/` files are modified. No config/test files are modified.

## 4. Out of Scope (explicitly NOT done by this step)

- No retroactive changelog entries for versions 0.2.0–0.8.0.
- No git tags created (tagging is a release activity outside this plan).
- No `npm run build`/`test`/`lint` (markdown-only change; no code affected).
- No edits to `_variables.scss` or any theme SCSS.
- No edits to `.agent/*` info files.
- No merge to `main` or push (handled by Critical Workflow step 5).

## 5. Risks / Edge Cases

- **Markdown newline escaping:** The newline-prevention rule requires real line breaks in the
  written content. Implementer must verify after write.
- **README placement ambiguity:** If `## Documentation` bullet list structure is unclear, skip
  the optional README step rather than risk restructuring existing content.
- **Accidental scope creep:** Do not edit `_variables.scss` or other theme files even though
  their commits are referenced in the changelog text.
- **Category inflation:** Do not add empty `Removed`/`Security`/`Deprecated` sections.

## 6. Return to caller

- Plan path: `.kilo/plans/20260803-add-changelog-task1-plan.md`
- Plan verified against original TODO line and the 4.1b requirements.
- Ready for Plan-Agent presentation / approval, then 4.2 Implementation.