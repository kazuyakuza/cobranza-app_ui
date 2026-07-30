# Block C.3 — Code Simplification Suggestions

## Scope

Review `README.md`, `docs/MODULE_CONTAINER.md`, and `module-container.component.spec.ts` for
conciseness and clarity while preserving required content.

## Files reviewed

- `README.md`
- `docs/MODULE_CONTAINER.md`
- `src/lib/components/module-container/module-container.component.spec.ts`

---

## README.md

### 1. Remove redundant peer-dependency paragraph (line 69)

The table already lists the packages and their purposes. The paragraph below repeats every
package and version range.

**Current:**

> Install the major ranges declared in package.json peerDependencies: `@angular/core@^22`,
> `@angular/common@^22`, `@angular/forms@^22`, `bootstrap@^5`, `@ng-bootstrap/ng-bootstrap@^21`,
> plus the latest compatible `@fortawesome/angular-fontawesome` and icon packs.

**Suggestion:** Delete this paragraph. The table plus the preceding sentence is sufficient.

### 2. Merge duplicated theme references (lines 155-157)

Two consecutive sentences point to the theme docs. Combine into one.

**Current:**

> For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/lib/theme/`.
>
> For a quick reference, see [`/docs/THEME.md`](/docs/THEME.md).

**Suggested:**

> For the full token reference see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and `src/lib/theme/`; for a quick reference see [`/docs/THEME.md`](/docs/THEME.md).

### 3. Remove duplicated Input/Output contract reference (line 132 and line 190)

The same pointer appears in Component Inventory and Documentation.

**Suggestion:** Keep the reference in the Documentation section (line 190) and remove it from
Component Inventory (line 132), where it distracts from the table.

---

## docs/MODULE_CONTAINER.md

### 1. Tighten the input-value ownership sentence (line 98)

**Current:**

> The container never mutates these values — the Shell owns the source of truth and re-binds state on every change.

**Suggested:**

> The container is stateless; the Shell owns these values and re-binds them on every change.

### 2. Shorten the fullscreen chrome-suppression bullet (line 123)

The CSS detail is long and largely implied by the modifier name and the preceding description.

**Current:**

> **Border-radius and module shadow are suppressed** (`box-shadow: var(--cba-shadow-module)` and `border-radius` are only applied under `:host(:not(.cba-module-container--fullscreen))`). Background and border are also removed.

**Suggested:**

> **Module chrome (border, border-radius, shadow) is suppressed** via `:host(:not(.cba-module-container--fullscreen))`; the Shell fullscreen view owns the outer chrome.

This also removes the need for the separate bullet on line 124-125.

### 3. Rename padding table column header (line 131)

"Suggested padding" can simply be "Padding".

---

## module-container.component.spec.ts

The test file is already concise. Only minor readability improvements are suggested.

### 1. Replace null assertions with a boolean helper

Instead of `expect(bodyRegion()).not.toBeNull()` and `expect(bodyRegion()).toBeNull()`, add:

```ts
function bodyIsRendered(): boolean {
  return bodyRegion() !== null;
}
```

Then tests read:

```ts
expect(bodyIsRendered()).toBe(true);
// ...
expect(bodyIsRendered()).toBe(false);
```

This removes the `toBeNull()` / `not.toBeNull()` asymmetry and improves clarity.

### 2. Shorten the fullscreen test comment

**Current:**

```ts
// Chrome (border-radius + box-shadow) is suppressed under
// :host(:not(.cba-module-container--fullscreen)); the host modifier is the
// verifiable contract at the unit level (jsdom does not compute CSS).
```

**Suggested:**

```ts
// CSS chrome suppression is not testable in jsdom; the host modifier is the contract.
```

---

## Summary

- **README.md**: 3 redundancy/compression opportunities.
- **docs/MODULE_CONTAINER.md**: 3 opportunities to tighten prose and table headers.
- **module-container.component.spec.ts**: 2 minor readability improvements; no structural changes.
