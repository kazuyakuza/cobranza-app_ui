# Global Plan — Lighten Gray Theme (2026-08-03)

**Source TODO:** `.agent/todos/20260803/20260803-todo-0.md`
**Date:** 2026-08-03

## Overview

The current `@cobranza-apps/ui` theme uses very dark grays (`#2a2d32` primary background) with light text (`#e8eaed`). The user finds this too dark and wants a lighter palette, with special attention to background tones and text legibility.

This is a **front-end related** task (theme tokens / SCSS).

## Pre-Analysis

### Technical Decisions
- The change is confined to `src/theme/_variables.scss` and potentially `src/theme/_base.scss` if any hard-coded fallback colors exist.
- Utility classes (`_utilities.scss`) reference tokens by name; they will auto-adapt once token values change.
- Contrast ratios must remain WCAG AA compliant (minimum 4.5:1 for normal text).
- The shift should move the theme from a near-black "dark mode" to a lighter "gray mode" while keeping the professional calm aesthetic defined in the brief.

### Proposed New Token Direction (to be finalized in 4.1a/4.1b)
- Backgrounds: shift up ~25–35% lightness (e.g., `#2a2d32` → `#d0d4da` or similar light gray).
- Text: shift down to darker grays to maintain contrast on lighter backgrounds.
- Borders: lighten accordingly.
- Overlay: reduce opacity or lighten color so modals/backdrops do not feel too heavy.

## Task List

- Task 1: Lighten gray theme colors — 4.1a Front-end Spec → 4.1b Plan → 4.2 Implementation → 4.3 Review & Simplify → 4.4 Documentation → 4.5a FE Verification → 4.5b Plan Adherence → 4.6 Task Completion

## Steps

- Step 2: Git Feature Branch Setup => implementer
- Step 3: Version Update => implementer
- Task 1: 4.1a Front-end Technical Specification => frontend-specialist
- Task 1: 4.1b Analysis & Planning => architector
- Task 1: 4.2 Implementation => implementer
- Task 1: 4.3 Code Review & Simplification => code-reviewer & code-simplifier; 4.3-fix => implementer
- Task 1: 4.4 Documentation => docs-specialist
- Task 1: 4.5a Front-end Implementation Verification => frontend-specialist
- Task 1: 4.5b Overall Plan Adherence => architector
- Task 1: 4.6 Task Completion => implementer
- Step 5: TODO File Completion => implementer
