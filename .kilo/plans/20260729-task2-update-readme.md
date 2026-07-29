# Plan — Task 2: Update README File

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md` — line 2: "update readme file"
> **Global plan:** `.kilo/plans/20260729-ui-library-setup.md`
> **Branch:** `feat/ui-library-setup`
> **Source of truth:** `.agent/project-info/brief.md`
> **Step scope:** 4.1 Analysis & Planning ONLY. Do NOT modify `README.md` or create `/docs/USAGE.md` in this step.

---

## 1. Pre-Analysis

### 1.1 Current README State

`README.md` (111 lines) currently holds the **base-project template** text — it describes the AI-agent driven development template, the Critical Workflow, AI agent plans, and how to start a task. None of this content is relevant to consumers of `@cobranza-apps/ui`. The entire file must be replaced with library-consumer-facing documentation.

### 1.2 Target Audience

Per `brief.md` and `product.md`, the README's primary readers are:

- **Shell developers** — host MFEs using `ModuleHeader` + `ModuleContainer` and import the encapsulated theme.
- **MFE developers** — import the theme and use basic components (`CbaButton`, `CbaCard`, etc.).

Secondary readers: AI agents onboarding to the project (linked to `AGENTS.md`, not duplicated here).

The README must be a **consumer-facing** document, not an internal agent-workflow doc.

### 1.3 Information Inventory (from project-info)

| Need | Source in brief/product/tech |
| ---- | ---------------------------- |
| What is this library? | brief §1 Purpose; product §Problem Definition / Product Goals |
| Target consumers | brief line 15; product §Target Consumers |
| Scope (in / out) | brief §2.1 / §2.2; product §Scope |
| Install + peer deps | tech §Peer Dependencies; brief §4 peerDependencies block; global plan Task 4 (versions finalized there) |
| Quick-start: theme import | brief §5 + §7 (theme.scss); architecture §Theme Encapsulation |
| Component inventory | brief §6.1 ModuleHeader, §6.2 ModuleContainer, §6.3 Other Components |
| Design tokens overview | brief §5 (categories: backgrounds, text, borders, accents, interactive states, layout constants, radius, shadows, spacing) |
| Usage / patterns doc | brief §10; tech Development Setup line 4 — planned `/docs/USAGE.md` (NOT created this step, only referenced) |
| Contributing / AI onboarding | `AGENTS.md` (existing) — linked, not duplicated |
| License | No LICENSE file exists in repo (verified via glob). |

### 1.4 Ambiguities / Missing Info

1. **Exact package versions** (e.g. `@angular/core@^22.x.x`, `@ng-bootstrap/ng-bootstrap@^21.x.x`, Bootstrap `5.x`) are NOT yet pinned — they are finalized in **Task 4** (`package.json`). README install snippets must therefore show **major-version ranges** (e.g. `@cobranza-apps/ui`, `@angular/*@^22`, `@ng-bootstrap/ng-bootstrap@^21`, `bootstrap@^5`) and include a note that exact versions are declared as peer dependencies in `package.json`. The README should be written so it does NOT need re-editing for patch-version bumps.
2. **Single entry point vs secondary entry points**: brief §7 says single `public-api.ts` for now. Theme import path: `@cobranza-apps/ui/theme` (SCSS) — but architecture.md §Public API Strategy notes secondary entry points are a "later" concern. To avoid promising an API shape that doesn't exist yet, the README quick-start should use the **primary package import** for components and the **SCSS theme file** (`@cobranza-apps/ui/theme` style import OR a referenced path) — flagged as "tentative until Task 3/4 finalize structure". Plan recommends README show the canonical intended import (`import '@cobranza-apps/ui/theme';` for global styles + component imports) and reference `/docs/USAGE.md` for full patterns once created.
3. **License**: no LICENSE file. Plan recommends the README include a **license placeholder section** ("Proprietary — © <company>. All rights reserved." or "See LICENSE") flagged so Docs Specialist / user can confirm in step 4.4. No LICENSE file is created in this step.
4. **`package.json` does not exist yet** (created in Task 4). README references install commands that will only work after Task 4. This is acceptable — README documents intended usage; it will be valid once the package is published / linked.
5. **`@cobranza-apps/mfe-events`** not yet published — README should NOT advertise it; only mention this library is UI-only and that workspace events are owned elsewhere (brief §8).

### 1.5 Technical & Content Decisions

- **Replace** `README.md` entirely (do not preserve base-project text; it is unrelated to this library).
- **Keep README focused**: ~120–160 lines target. If it exceeds 100 lines, include a **Table of Contents** (per global plan 4.4 instruction and brief §10).
- **No emoji** (per repo rules) unless explicitly requested — none requested.
- **Code examples** use SCSS / TypeScript fenced blocks.
- **Links**:
  - `AGENTS.md` (AI agent onboarding / contributing reference).
  - `.agent/project-info/brief.md` (source of truth).
  - `/docs/USAGE.md` (planned — referenced even though not yet created; mark clearly as "planned / see step 4.4").
  - Related libraries table (brief §11): `@cobranza-apps/entities`, `@cobranza-apps/mfe-events` (note the latter is not yet published).
- **Peer deps table** mirrors tech.md §Peer Dependencies.
- **Components table** mirrors brief §6.3 (plus ModuleHeader / ModuleContainer from §6.1 / §6.2 as the two flagship layout primitives).
- **Design tokens section** lists token *categories* with the `--cba-` prefix note; full token values live in brief §5 / `src/lib/theme/_variables.scss` (referenced, not duplicated) to keep README short and avoid drift.
- **Installation**: `npm install @cobranza-apps/ui <peer deps>` with a note that consumers must install peer deps themselves.

---

## 2. Implementation Plan (for step 4.2 — implementer)

The implementer will rewrite `README.md` with the following structure. Section content & snippets are specified below so 4.2 is mechanical.

### 2.1 README structure (top to bottom)

1. **Title + one-line tagline**
   ```
   # @cobranza-apps/ui
   Shared Angular component library & intermediate-gray design system for the Cobranza App Company Back-office.
   ```

2. **Table of Contents** (required if file > 100 lines — it will be).

3. **Overview / Purpose**
   - 1 short paragraph from brief §1 + product §Problem Definition.
   - Bullet list of what it provides (layout primitives, theme, basic components, thin Bootstrap/ng-bootstrap wrappers, Font Awesome icons).
   - Bullet list of what it is NOT (no business logic, no BFF, no advanced tables, no drag-and-drop, no workspace state, no mobile) — adapted from brief §2.2.

4. **Target Consumers**
   - Shell developers + MFE developers (from product §Target Consumers).

5. **Installation**
   - `npm install @cobranza-apps/ui`
   - Note: consumers must also install peer dependencies (never jQuery).
   - Peer dependencies table (name → purpose).
   - Note: exact versions declared as `peerDependencies` in `package.json` (finalized in Task 4); install majors: Angular `^22`, `@ng-bootstrap/ng-bootstrap` `^21`, Bootstrap `^5`, `@fortawesome/*`.

6. **Quick Start — Theme Import**
   - SCSS snippet: how to import the theme (e.g. in a global styles file `@use '@cobranza-apps/ui/theme';` or `@import` according to final `theme.scss`).
   - TS component import snippet:
     ```ts
     import { ModuleHeader, ModuleContainer, CbaButton } from '@cobranza-apps/ui';
     ```
   - Note pointing to `/docs/USAGE.md` for full patterns (planned doc).

7. **Component Inventory**
   - Table: Component | Description.
   - Flagship layout primitives first: `ModuleHeader`, `ModuleContainer`.
   - Then brief §6.3 list: `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`, Form controls (thin ng-bootstrap wrappers).
   - One-line note that full Input/Output contracts live in brief §6 + JSDoc.

8. **Design Tokens (Theme)**
   - One paragraph: all tokens under `--cba-` prefix; categories listed (backgrounds, text, borders, accents, interactive states, layout constants, radius, shadows, spacing).
   - Typography bullet (Inter, 14px base, line-height 1.5, headings 500–600) from brief §5.
   - Utility classes examples (`.cba-bg-primary`, `.cba-text-secondary`, …).
   - Link to brief §5 / `src/lib/theme/_variables.scss` for full token values.

9. **Related Libraries**
   - Table from brief §11: `@cobranza-apps/ui` (this), `@cobranza-apps/entities` (shared domain, on npm), `@cobranza-apps/mfe-events` (typed events Shell↔MFE — *not yet published*).

10. **Integration Notes (Shell ↔ MFE)** — brief §8
    - Short bullets: Shell hosts MFEs via ModuleHeader/ModuleContainer; each MFE imports the theme; size/collapse/fullscreen via component inputs + custom events (mfe-events, not this lib); this lib emits only pure UI events; drag-and-drop NOT here.

11. **Documentation**
    - Link to planned `/docs/USAGE.md` (patterns & examples). Mark as planned/pending step 4.4.

12. **Contributing & AI Agent Onboarding**
    - Short paragraph referencing `AGENTS.md` and the Critical Workflow. Do NOT duplicate the base-project README workflow content — just link.

13. **License**
    - Placeholder line: "License: Proprietary — © <company>. See `LICENSE`." Mark as TODO/placeholder to confirm with maintainer. No LICENSE file created in this step.

### 2.2 Concrete snippets to include (verbatim in plan for implementer)

**Peer dependencies table:**

| Package | Purpose |
| --- | --- |
| `@angular/core`, `@angular/common`, `@angular/forms` | Angular runtime (v22, standalone) |
| `bootstrap` | CSS-only framework (never jQuery) |
| `@ng-bootstrap/ng-bootstrap` | Forms & overlays (v21) |
| `@fortawesome/angular-fontawesome` | Icon rendering |
| `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons` | Icon packs (solid + regular) |

**Quick-start SCSS theme import:**
```scss
/* global-styles.scss */
@use '@cobranza-apps/ui/theme';
```

**Quick-start component import:**
```ts
import { ModuleHeader, ModuleContainer, CbaButton } from '@cobranza-apps/ui';
```

**Component inventory table:**

| Component | Description |
| --- | --- |
| `ModuleHeader` | Shell-injected header above each MFE module (title, size, collapse, fullscreen, status). |
| `ModuleContainer` | Wraps `ModuleHeader` + MFE content; handles size, collapse, padding, scroll. |
| `CbaButton` | Variants: primary, secondary, ghost, danger, success; sizes sm/md; loading; icon support. |
| `CbaCard` | Optional header & footer; no forced hover elevation. |
| `CbaBadge` | Semantic colours; solid/outline styles. |
| `CbaEmptyState` | Slots: icon, title, description, primary action. |
| `CbaSkeleton` | Variants: text, avatar, card, table-row, generic. |
| `CbaModal` | Thin wrapper around ng-bootstrap modal. |
| Form controls | Thin wrappers around ng-bootstrap/Bootstrap inputs, selects, datepickers. |

### 2.3 Steps for the implementer (4.2)

1. Verify still on branch `feat/ui-library-setup`.
2. Read this plan fully before editing.
3. Replace entire `README.md` content with the structure in §2.1, using the verbatim snippets in §2.2.
4. Keep file under ~160 lines; include `## Table of Contents`.
5. Do NOT create `/docs/USAGE.md` (planned for step 4.4).
6. Do NOT modify any other file.
7. Verify no `.gitignore`-matching files staged; commit with message: `docs: rewrite README for @cobranza-apps/ui consumers`.

---

## 3. Deliverables of this 4.1 step

- This plan file: `.kilo/plans/20260729-task2-update-readme.md`.
- No changes to `README.md` or any source file.

---

## 4. Cross-References

- Source of truth: [brief.md](../../.agent/project-info/brief.md) §1 (purpose), §2 (scope), §4 (stack/peer deps), §5 (tokens), §6 (components), §7 (structure), §8 (integration), §10 (docs), §11 (related libs).
- [product.md](../../.agent/project-info/product.md) §Target Consumers, §Scope, §Accessibility Goals.
- [tech.md](../../.agent/project-info/tech.md) §Peer Dependencies.
- [architecture.md](../../.agent/project-info/architecture.md) §Theme Encapsulation, §Integration Patterns.
- Global plan: [.kilo/plans/20260729-ui-library-setup.md](./20260729-ui-library-setup.md) — Task 2 cycle.

---

## 5. Open Items / Questions for Caller (if any)

- **License text**: which license applies (proprietary vs. internal-use)? Plan uses a placeholder until confirmed. If a specific license is required, please advise; otherwise Docs Specialist (4.4) or the user confirms the placeholder.
- **Theme import syntax** (`@use` vs `@import`): the README assumes `@use '@cobranza-apps/ui/theme';`. This will be finalized when `src/lib/theme/theme.scss` exists (Task 3) and `package.json` `stylePath` is set (Task 4). The snippet is the intended canonical form; flag if a different convention is preferred.

---

## Completion Summary

**Done:**
- Read `README.md`, `brief.md`, `product.md`, plus `tech.md` / `architecture.md` / global plan and verified no LICENSE file exists.
- Analyzed consumer needs and extracted all info required for a consumer-facing README.
- Identified 4 ambiguities/missing-info items (unpinned patch versions, single vs secondary entry points, missing LICENSE, not-yet-published `mfe-events`).
- Produced a detailed, verbatim implementation plan for rewriting `README.md` (structure, snippets, tables, steps for 4.2) including peer deps, component inventory, design tokens overview, integration notes, and a contributing/AI-onboarding link.
- Saved the plan to `.kilo/plans/20260729-task2-update-readme.md`.
- Did NOT modify `README.md`.
- Did NOT create `/docs/USAGE.md` (only referenced as a planned doc).

**Not done (out of scope for 4.1):**
- Actual rewrite of `README.md` (deferred to 4.2 implementer).
- Creation of `/docs/USAGE.md`.
- License file creation.
- Verification, documentation polish, and task completion (steps 4.3–4.6).
```