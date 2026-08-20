# Simplification Plan — Fix `cba-button--secondary` background color (Task 1, Step 4.3)

## Verdict

**Simplifications proposed** (two minor clarity improvements). The SCSS fix itself is already minimal and correct; no structural changes are needed there.

## Findings

### 1. `CHANGELOG.md` — remove empty `Changed` section

The `[0.18.5]` entry ends with a `Changed` section containing only `- (none)`. Keep a Changelog does not require sections with no entries, and the placeholder adds visual noise without information.

**Current block (lines 40–42):**

```markdown
### Changed

- (none)
```

**Simplification:** delete the entire `### Changed` section (heading and placeholder bullet). The `Fixed` section remains directly under the `## [0.18.5]` header.

**Rationale:**
- Removes unnecessary boilerplate.
- Consistent with previous releases (e.g., `[0.18.3]`) which omit categories that have no entries.
- No behavior or release content changes.

---

### 2. `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts` — replace `switch` with a readonly lookup record

The `buttonTokenInfo` function repeats each variant name twice: once in the `case` label and once in the returned string (e.g., `case 'secondary':` and `.cba-button--secondary`). This duplication creates drift risk if a variant is ever renamed or if a new variant is added inconsistently.

**Current code (lines 46–59):**

```typescript
function buttonTokenInfo(variant: CbaButtonVariant): string {
  switch (variant) {
    case 'primary':
      return '.cba-button--primary · var(--cba-accent-primary) · inverse overlay';
    case 'secondary':
      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)';
    case 'ghost':
      return '.cba-button--ghost · transparent · dark overlay';
    case 'danger':
      return '.cba-button--danger · var(--cba-accent-danger) · inverse overlay';
    case 'success':
      return '.cba-button--success · var(--cba-accent-success) · inverse overlay';
  }
}
```

**Simplification:** replace the `switch` with a `readonly Record<CbaButtonVariant, string>` lookup and a one-line accessor. The variant name is then declared exactly once per entry.

```typescript
const BUTTON_TOKEN_CAPTIONS: Readonly<Record<CbaButtonVariant, string>> = {
  primary: '.cba-button--primary · var(--cba-accent-primary) · inverse overlay',
  secondary: '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)',
  ghost: '.cba-button--ghost · transparent · dark overlay',
  danger: '.cba-button--danger · var(--cba-accent-danger) · inverse overlay',
  success: '.cba-button--success · var(--cba-accent-success) · inverse overlay',
};

function buttonTokenInfo(variant: CbaButtonVariant): string {
  return BUTTON_TOKEN_CAPTIONS[variant];
}
```

**Implementation details for the implementer:**
- Insert the `BUTTON_TOKEN_CAPTIONS` constant immediately before the `buttonTokenInfo` function (between lines 44 and 45).
- Replace the function body (lines 47–58) with the one-line `return BUTTON_TOKEN_CAPTIONS[variant];`.
- Preserve the existing JSDoc comment on line 45.
- Preserve the middle-dot separators (`·`, U+00B7) and the exact caption strings; only the control structure changes.
- Do not change the exported/public surface of the component; `buttonTokenInfo` remains a module-private function and `DemoButtonMatrixComponent.buttonTokenInfo` continues to expose it to the template.

**Rationale:**
- Eliminates duplicated variant names, reducing drift risk.
- Declarative mapping is easier to scan than a switch statement.
- TypeScript exhaustiveness is preserved because `Record<CbaButtonVariant, string>` requires a key for every enum/union member.
- No runtime behavior change; output strings are identical.

---

## Out of scope / no action

- `src/components/button/cba-button.component.scss`: the one-line token change at line 67 is already the minimal correct fix. The surrounding variant blocks are consistent and readable; no mixin extraction or restructuring is justified by this change.
- No demo build, visual verification, or commit is required in this simplification step; those were completed in Step 4.2. After applying the simplifications, the implementer should run `npm run lint` and the existing demo build (`npm run build:demo`) as a sanity check, because the TypeScript refactor must remain type-safe.
