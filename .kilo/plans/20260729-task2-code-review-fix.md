# Code Review Fix Plan — Task 2: Update README File

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md`
> **Global plan:** `.kilo/plans/20260729-ui-library-setup.md`
> **Per-task plan:** `.kilo/plans/20260729-task2-update-readme.md`
> **Branch:** `feat/ui-library-setup`
> **File reviewed:** `README.md`

## Overall Assessment

`README.md` is a complete, consumer-facing replacement for the base-project template. It matches the per-task plan's structure, covers all required sections, and is consistent with `brief.md`, `product.md`, `tech.md`, and `architecture.md`. No factual inaccuracies, typos, or broken internal links were found. Two minor deviations/incomplete items and one optional consistency improvement were identified.

## Issues Found

### Issue 1 — Major peer-dependency ranges are not shown in the install section

- **Location:** `README.md` lines 46–60 (Installation section).
- **Severity:** Low.
- **Description:** The text says "install the following major ranges" but the table only lists packages and purpose descriptions; it does not display the actual major-version ranges a consumer should install. The per-task plan explicitly listed Angular `^22`, `@ng-bootstrap/ng-bootstrap` `^21`, Bootstrap `^5`, and `@fortawesome/*`.
- **Recommended correction:** Add an explicit sentence or a `Range` column/table showing the recommended install ranges. Example sentence after the table:

  ```text
  Install the major ranges declared in package.json peerDependencies:
  @angular/core@^22, @angular/common@^22, @angular/forms@^22,
  bootstrap@^5, @ng-bootstrap/ng-bootstrap@^21, plus the latest
  compatible @fortawesome/angular-fontawesome and icon packs.
  ```

### Issue 2 — License placeholder deviates from the plan's generic form

- **Location:** `README.md` lines 148–152 (License section).
- **Severity:** Low.
- **Description:** The per-task plan specified the placeholder line: `License: Proprietary — © <company>. See LICENSE.` The README instead uses `© Cobranza App Company. All rights reserved.` and appends a TODO note. Using the concrete company name is not factually wrong (the name appears in `brief.md`), but it changes the intended placeholder semantics and adds wording not in the plan.
- **Recommended correction:** Revert to the plan's placeholder text to keep the TODO unambiguous:

  ```markdown
  ## License

  **License: Proprietary — © <company>. See `LICENSE`.**

  > TODO: Confirm license terms with the maintainer. This is a placeholder until a `LICENSE` file is added.
  ```

  If the maintainer confirms "Cobranza App Company" and "All rights reserved.", update both this section and the per-task plan to lock in that decision.

### Issue 3 — (Optional) Directives are omitted from the "What this library provides" list

- **Location:** `README.md` lines 23–29 (Overview / What this library provides).
- **Severity:** Optional / very low.
- **Description:** `brief.md` §2.1 and `product.md` list **Directives** as in-scope (lightweight helpers such as autofocus, click-outside). The README overview and component inventory do not mention them. The per-task plan's overview bullets and component table also omitted directives, so this is not a strict deviation, but adding the bullet improves consistency with the project-info source of truth.
- **Recommended correction:** Add a bullet to "What this library provides":

  - **Directives** — Lightweight helpers (e.g., autofocus, click-outside) when needed.

## No-Issue Areas

- Structure and section order match the per-task plan.
- Title, tagline, peer-dependencies table, quick-start snippets, component inventory table, design-token categories, integration notes, and contributing links are accurate and consistent with `brief.md` and `tech.md`.
- Table of Contents is present and links are valid.
- No typos or grammar issues were detected.
- No broken internal links (planned `/docs/USAGE.md` and `LICENSE` references are correctly flagged as pending).

## Next Step

Assign the fix plan to the implementer sub-agent (step 4.3-fix) to apply the recommended corrections to `README.md`.
