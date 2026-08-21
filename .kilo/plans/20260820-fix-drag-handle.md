# Global Plan — Fix: Remove incorrectly added built-in drag handle from ModuleHeader

## Pre-analysis

The `ModuleHeader` component currently renders both:
1. An optional `<ng-content select="[cbaModuleDragHandle]">` projection slot (correct).
2. A hardcoded no-op drag `<button>` with `faUpDownLeftRight` icon immediately after the slot (incorrect).

The library component must NOT include a drag handle by default — drag handles are Shell-owned and projected via the slot. The prior work (20260820-fix-demo-bugs) accidentally re-introduced the built-in button after it had been removed in an earlier phase (20260809-phase11-drag-handle). This plan removes the built-in button again, updates the demo to project its own drag handle, and fixes tests/docs.

## Task breakdown

| Step | Sub-agent | Description |
|------|-----------|-------------|
| 2 | implementer | Git feature branch setup (`feat/fix-moduleheader-drag-handle`). |
| 3 | implementer | Bump version to `0.18.6`. |
| 4.1a | frontend-specialist | Front-end technical specification (not strictly UI-heavy, but component-level). |
| 4.1b | architector | Detailed implementation plan per files. |
| 4.2 | implementer | Remove built-in drag button from `ModuleHeader`, update demo to project drag handle, fix tests, update docs, update changelog. |
| 4.3 | code-reviewer & code-simplifier | Review and simplify. |
| 4.4 | docs-specialist | Final doc/comments pass. |
| 4.5a | frontend-specialist | Front-end verification. |
| 4.5b | architector | Overall plan adherence. |
| 4.6 | implementer | Mark task done, commit. |
| 5 | implementer | Merge feature branch to `main`, push to `origin`. |

## Front-end related

Yes — this task modifies an Angular component template, SCSS references, demo component, and component docs.
