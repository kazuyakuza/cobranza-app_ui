# Simplification Plan — Task 3: Define Project Structure

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md`
> **Task:** 3 — Define Project Structure
> **Step:** 4.3 Code Review & Simplification
> **Branch:** `feat/ui-library-setup`

---

## Files Reviewed

- `.agent/project-structure.md`
- `src/lib/public-api.ts`
- `src/lib/components/modal/index.ts`
- `src/lib/components/skeleton/index.ts`
- `src/lib/components/empty-state/index.ts`
- `src/lib/components/badge/index.ts`
- `src/lib/components/card/index.ts`
- `src/lib/components/button/index.ts`
- `src/lib/components/module-container/index.ts`
- `src/lib/components/module-header/index.ts`

---

## Findings

### 1. Verbose placeholder JSDoc in `public-api.ts`

The header explains ng-packagr, MFE consumption, and lists every future component/directive/theme export in a `@todo` block. This inventory duplicates the folder list recorded in `.agent/project-structure.md` and the per-component barrels.

### 2. Repeated placeholder JSDoc in component barrels

All 8 component `index.ts` files share the same multi-line JSDoc shape. Only the component name changes. The `@todo` and example `export *` line are redundant once the barrel convention is established.

### 3. Minor verbosity in `.agent/project-structure.md`

A few folder comments carry more detail than needed. They can be tightened without losing AI-agent context.

---

## Proposed Edits

### A. Simplify `src/lib/public-api.ts`

Replace the current header with a concise description that does not duplicate the component inventory.

```ts
/**
 * Public entry point for @cobranza-apps/ui.
 * Re-exports components, directives and theme once implemented.
 */
export {};
```

### B. Simplify all component `index.ts` files

Replace the multi-line JSDoc with a single-line placeholder comment. Apply to every component folder, substituting only the component name.

Example for `src/lib/components/button/index.ts`:

```ts
/** Barrel placeholder for CbaButton. */
export {};
```

Apply the same pattern to:

- `src/lib/components/module-header/index.ts` → `ModuleHeader`
- `src/lib/components/module-container/index.ts` → `ModuleContainer`
- `src/lib/components/button/index.ts` → `CbaButton`
- `src/lib/components/card/index.ts` → `CbaCard`
- `src/lib/components/badge/index.ts` → `CbaBadge`
- `src/lib/components/empty-state/index.ts` → `CbaEmptyState`
- `src/lib/components/skeleton/index.ts` → `CbaSkeleton`
- `src/lib/components/modal/index.ts` → `CbaModal`

### C. Tighten `.agent/project-structure.md` comments

Update the following lines to remove redundancy:

- `src/lib/theme/`: change comment to `SCSS theme variables, utilities, mixins and entry file`
- `src/lib/directives/`: change comment to `attribute directives created on demand`
- `src/lib/components/module-header/`: shorten to `ModuleHeader component: title, size/collapse/fullscreen actions and status indicator`
- `src/lib/components/module-container/`: shorten to `ModuleContainer component: wraps header + MFE content with size, collapse, fullscreen and scroll`

---

## Rationale

- Removes duplication between `public-api.ts`, per-component barrels, and `.agent/project-structure.md`.
- Keeps barrel files self-documenting without placeholder noise.
- Preserves the intent and AI-agent context.
- All files remain well under the 200-line limit.

---

## Out of Scope

- No folder structure changes.
- No actual export statements added (components are not yet implemented).
- No file deletions.
- No git push.
