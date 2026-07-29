# Simplification Plan — Task 2: Update README File

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md` — line 2: "update readme file"
> **Global plan:** `.kilo/plans/20260729-ui-library-setup.md`
> **Per-task plan:** `.kilo/plans/20260729-task2-update-readme.md`
> **Branch:** `feat/ui-library-setup`
> **Step scope:** 4.3 Code Simplification ONLY. Do NOT modify `README.md` in this step.

---

## 1. Summary

`README.md` (152 lines) is already well-structured and within the 120–160 line target. The main simplification opportunities are:

- Reduce repeated concepts between the Overview and Component Inventory.
- Tighten verbose sentences in Installation, Quick Start, and Integration Notes.
- Remove internal workflow references that are not relevant to library consumers.
- Consolidate the License placeholder into a single line.

No structural changes are proposed; the Table of Contents and section order remain unchanged.

---

## 2. Suggested Edits

### 2.1 Overview — tighten opening paragraph

**Current:**

```markdown
`@cobranza-apps/ui` provides a shared visual foundation for all Company Back-office applications — the Shell and every Micro-frontend (MFE). It eliminates duplicated UI effort and establishes a single source of truth for the intermediate-gray design system.
```

**Simplified:**

```markdown
`@cobranza-apps/ui` is the shared visual foundation for the Company Back-office Shell and every MFE. It provides a single source of truth for the intermediate-gray design system and removes duplicated UI effort.
```

**Rationale:** Removes redundant "shared visual foundation" / "single source of truth" overlap and uses active voice.

---

### 2.2 Installation — remove redundant phrasing

**Current:**

```markdown
Consumers must also install peer dependencies (never jQuery). Exact versions are declared as `peerDependencies` in `package.json`; install the following major ranges:
```

**Simplified:**

```markdown
Install peer dependencies separately (jQuery is never required). Exact versions are declared in `package.json`; use these major ranges:
```

**Rationale:** "Consumers must also install" and "install the following major ranges" say the same thing twice.

---

### 2.3 Quick Start — shorten pointer to planned docs

**Current:**

```markdown
For full usage patterns and examples, see the [planned `/docs/USAGE.md`](#documentation).
```

**Simplified:**

```markdown
For usage patterns and examples, see [`/docs/USAGE.md`](#documentation) (planned).
```

**Rationale:** "Full" is implied; "planned" is clearer as a parenthetical.

---

### 2.4 Component Inventory — shorten contract reference

**Current:**

```markdown
Full Input/Output contracts for each component are documented inline via JSDoc and in the [project brief](.agent/project-info/brief.md#6-core-components-proposal).
```

**Simplified:**

```markdown
Full Input/Output contracts are in JSDoc and the [project brief](.agent/project-info/brief.md#6-core-components-proposal).
```

**Rationale:** "for each component" and "documented inline via" add words without adding meaning.

---

### 2.5 Design Tokens — tighten lead sentence

**Current:**

```markdown
All design tokens live under the `--cba-` prefix and are published as SCSS via `@cobranza-apps/ui/theme`. Token categories:
```

**Simplified:**

```markdown
Design tokens are published as SCSS via `@cobranza-apps/ui/theme` and use the `--cba-` prefix:
```

**Rationale:** Replaces "All design tokens live under" with a direct statement and removes the redundant "Token categories" label.

---

### 2.6 Integration Notes — remove implied details

**Current:**

```markdown
- The **Shell** imports the library and uses `ModuleHeader` + `ModuleContainer` to host every remote MFE.
- Each **MFE** imports the encapsulated theme and may use basic components.
```

**Simplified:**

```markdown
- The **Shell** uses `ModuleHeader` and `ModuleContainer` to host each remote MFE.
- Each **MFE** imports the theme and may use basic components.
```

**Rationale:** "imports the library" is implied by using its components; "encapsulated" is already stated in the architecture and does not need repeating here.

---

### 2.7 Documentation — remove internal workflow reference

**Current:**

```markdown
- `/docs/USAGE.md` — Patterns and examples for consuming the library (planned, see step 4.4).
```

**Simplified:**

```markdown
- `/docs/USAGE.md` — Patterns and examples for consuming the library (planned).
```

**Rationale:** "step 4.4" is an internal workflow detail, not relevant to README consumers.

---

### 2.8 Contributing & AI Agent Onboarding — shorten

**Current:**

```markdown
This project follows the workflows defined in [AGENTS.md](AGENTS.md) and the [Critical Workflow](.kilo/commands/critical-workflow.md). AI agents and contributors should review these before making changes. The project info files under `.agent/project-info/` are the source of truth for scope, architecture, tech stack, and status.
```

**Simplified:**

```markdown
Review [AGENTS.md](AGENTS.md) and the project info files under `.agent/project-info/` before making changes.
```

**Rationale:** The link to AGENTS.md already implies workflow guidance; the second sentence repeats the same instruction.

---

### 2.9 License — consolidate placeholder

**Current:**

```markdown
**License: Proprietary — © Cobranza App Company. All rights reserved.** See `LICENSE`.

> TODO: Confirm license terms with the maintainer. This is a placeholder until a `LICENSE` file is added.
```

**Simplified:**

```markdown
**License: Proprietary — © Cobranza App Company. All rights reserved.** See `LICENSE` (TODO: confirm license terms).
```

**Rationale:** Two lines convey the same placeholder status; combine into one.

---

## 3. Optional Consolidation (to consider)

### 3.1 Merge "What this library provides" with Component Inventory

The Overview's "What this library provides" list and the Component Inventory table overlap (layout primitives, theme, basic components, form controls, icons). Consider removing the bulleted "What this library provides" section and letting the Component Inventory table and Design Tokens section carry that information.

**Trade-off:** Removing the list makes the Overview shorter but also removes a high-level summary for readers who skim. Recommended action: keep the list, but shorten it to avoid restating details already in the tables.

**Suggested shorter list:**

```markdown
- **Layout primitives** — `ModuleHeader`, `ModuleContainer`.
- **Theme** — intermediate-gray tokens, utilities, and optional SCSS mixins.
- **Basic components** — `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`.
- **Form controls** — thin wrappers around ng-bootstrap / Bootstrap inputs, selects, and datepickers.
- **Icons** — Font Awesome Free via `@fortawesome/angular-fontawesome`.
```

---

## 4. What Is NOT Proposed

- No changes to the Table of Contents or section order.
- No removal of peer-dependency table, component inventory table, or design token categories.
- No rewrite of code snippets or import paths (those remain tentative as documented).
- No modification to `README.md` in this step.

---

## 5. Deliverables of this 4.3 step

- This simplification plan: `.kilo/plans/20260729-task2-simplification.md`.
- No changes to `README.md` or any source file.

---

## Completion Summary

**Done:**
- Read `README.md` and the per-task plan.
- Identified nine specific simplification opportunities ( Overview, Installation, Quick Start, Component Inventory, Design Tokens, Integration Notes, Documentation, Contributing, License).
- Proposed optional consolidation of the "What this library provides" list with the Component Inventory table.
- Saved the simplification plan to `.kilo/plans/20260729-task2-simplification.md`.
- Did NOT modify `README.md`.
- Did NOT push to remote.

**Not done (out of scope for 4.3):**
- Applying any simplifications to `README.md` (deferred to the implementer sub-step).
- Code review for correctness or plan adherence (handled by code-reviewer sub-agent).
- Documentation, verification, and task completion (steps 4.4–4.6).
