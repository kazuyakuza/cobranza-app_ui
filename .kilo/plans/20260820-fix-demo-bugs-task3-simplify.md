# Task 3 — Code Simplification Suggestions

Files reviewed in `projects/demo/src/app/`:
- `components/demo-button-matrix/demo-button-matrix.component.ts`
- `components/demo-button-matrix/demo-button-matrix.component.scss`
- `components/demo-pill-matrix/demo-pill-matrix.component.ts`
- `components/demo-pill-matrix/demo-pill-matrix.component.scss`
- `components/demo-nav-items/demo-nav-items.component.ts`
- `components/demo-nav-items/demo-nav-items.component.scss`
- `app.component.ts`
- `app.component.html`
- `app.component.scss`

## 1. Extract shared matrix styles into an SCSS partial

**Rationale**: `demo-button-matrix.component.scss` and `demo-pill-matrix.component.scss` share ~69 identical lines (`.demo-matrix`, `.demo-surface`, `.demo-matrix-table`, etc.).

**Action**:
1. Create `projects/demo/src/app/components/_demo-matrix-core.scss`.
2. Move the shared rules into it:
   - `:host { display: block; }`
   - `.demo-matrix`
   - `.demo-surface`, `.demo-surface--secondary`, `.demo-surface--elevated`, `.demo-surface--primary`
   - `.demo-matrix-table` and all `&__*` element rules
   - Keep `$matrix-status-width` inside the partial or pass it as a variable.
3. In `demo-button-matrix.component.scss` and `demo-pill-matrix.component.scss`, replace the duplicated block with `@use '../demo-matrix-core' as matrix;` and keep only component-specific rules (pill colors/sizes in pill matrix; button matrix has no extra rules).

**Result**: ~60 lines of duplication removed; future matrix components reuse the same core.

## 2. Unwrap `pillClassFn` delegating method

**File**: `demo-pill-matrix.component.ts`

**Rationale**: `pillClassFn` only forwards to the standalone `pillClass` function. It adds a public method and an extra indirection.

**Action**:
- Remove `protected pillClassFn(...)` method.
- Change template from `[class]="pillClassFn(cell, row.state)"` to `[class]="pillClass(cell, row.state)"`.
- Expose the standalone helper on the class: `protected readonly pillClass = pillClass;` (same pattern already used for `pillTokenInfo`).

## 3. Generate matrix table headers from constants

**Files**: `demo-button-matrix.component.ts`, `demo-pill-matrix.component.ts`

**Rationale**: The `<thead>` lists variants as hard-coded strings (`primary`, `secondary`, `ghost`, `danger`, `success`). If a variant is renamed/added, the header and data can drift.

**Action**:
- Add a `protected readonly variants` array on each component derived from the existing constants (`VARIANTS` for buttons, `PILL_VARIANTS.map(c => c.modifier)` for pills).
- Replace the five hard-coded `<th scope="col">...</th>` cells with `@for (variant of variants; track variant) { <th scope="col">{{ variant }}</th> }`.
- Keep the first `status` column as a static `<th>`.

## 4. Share generic matrix interfaces and builders

**Files**: `demo-button-matrix.component.ts`, `demo-pill-matrix.component.ts`

**Rationale**: `ButtonMatrixBlock` / `PillMatrixBlock`, `ButtonMatrixRow` / `PillMatrixRow`, `buildBlock` / `buildPillBlock`, and the surface block list are structurally identical.

**Action**:
1. Create `projects/demo/src/app/components/demo-matrix.model.ts` with generic interfaces and builders:
   ```ts
   export interface DemoMatrixRow<TCell> { readonly state: string; readonly cells: readonly TCell[]; }
   export interface DemoMatrixBlock<TCell> { readonly surfaceTitle: string; readonly surfaceClass: string; readonly rows: readonly DemoMatrixRow<TCell>[]; }
   export const SURFACE_BLOCKS = [
     { title: 'bg-secondary', className: 'demo-surface--secondary' },
     { title: 'bg-elevated', className: 'demo-surface--elevated' },
     { title: 'bg-primary', className: 'demo-surface--primary' },
   ] as const;
   export function buildMatrixRows<TCell>(
     states: readonly string[],
     cellsFactory: (state: string) => readonly TCell[],
   ): readonly DemoMatrixRow<TCell>[] { ... }
   export function buildMatrixBlocks<TCell>(
     surfaces: readonly { title: string; className: string }[],
     states: readonly string[],
     cellsFactory: (state: string) => readonly TCell[],
   ): readonly DemoMatrixBlock<TCell>[] { ... }
   ```
2. Import the helpers in both matrix components and delete the duplicated interfaces/builders.
3. Keep component-specific cell types (`ButtonMatrixCell`, `PillCell`) and token-info helpers in their respective files.

## 5. Remove no-op SCSS variable aliases in app.component.scss

**File**: `app.component.scss`

**Rationale**: `$preview-bar-padding` and `$preview-bar-font-size` are used once each and only alias CSS custom properties. They add indirection without improving readability.

**Action**:
- Delete `$preview-bar-padding` and `$preview-bar-font-size`.
- In `.preview-bar`, use `padding: var(--cba-space-2) var(--cba-space-3);` and `font-size: var(--cba-font-size-caption);` directly.

## 6. Inline the verbose `COLOR_TOKEN_SOURCE` type

**File**: `app.component.ts`

**Rationale**: The inline `readonly { readonly name: string; readonly tag: string; readonly hex: string }[]` type is noisy and duplicates `ColorToken` minus `variable`.

**Action**:
- Define `type ColorTokenSource = Omit<ColorToken, 'variable'>;`.
- Change `COLOR_TOKEN_SOURCE` type to `readonly ColorTokenSource[]`.

## 7. Centralize duplicated pill variant styles

**Files**: `app.component.scss`, `demo-pill-matrix.component.scss`

**Rationale**: `.demo-pill--primary`, `.demo-pill--secondary`, `.demo-pill--ghost`, `.demo-pill--danger`, `.demo-pill--success` are declared in both files with identical declarations. The app file adds `sm/md` sizing; the matrix file adds `selected/disabled` state modifiers.

**Action**:
1. Create `projects/demo/src/app/components/_demo-pill-variants.scss` containing the five base variant rules and the shared `.demo-pill` base rule.
2. In `app.component.scss` and `demo-pill-matrix.component.scss`, import the partial and keep only the file-specific modifiers (`--sm`, `--md` in app; `--selected`, `--disabled` in matrix).

## 8. Consider generating the size-matrix rows

**File**: `app.component.html`

**Rationale**: The button and pill size tables repeat 5 variant columns × 2 size rows of nearly identical markup.

**Action** (optional, lower priority):
- Add a small array of variants in `app.component.ts`: `protected readonly sizeVariants = ['primary', 'secondary', 'ghost', 'danger', 'success'] as const;`.
- Replace the static `<tr>` rows in both size tables with `@for` loops over `['sm', 'md']` and `sizeVariants`.
- If the markup for buttons and pills differs too much, at least generate the inner variant cells with `@for`.

## 9. Remove unused `:host(.demo-nav--large)` descendant selector risk

**File**: `demo-nav-items.component.scss`

**Rationale**: The host modifier `.demo-nav--large` is applied from `app.component.html` (`<demo-nav-items class="... demo-nav--large">`). Under Angular emulated encapsulation, the modifier lands on the host element. The current rule `:host(.demo-nav--large) .demo-nav-item` is correct, but the nested descendant selector `.demo-nav-item` inside `:host(...)` is safe because `:host()` scopes to the host. No change required; document that this pattern is intentional.

## Suggested execution order

1. Create shared model (`demo-matrix.model.ts`) and SCSS partial (`_demo-matrix-core.scss`).
2. Refactor both matrix components to use the shared model/partial and generate headers from constants.
3. Create shared pill variant partial (`_demo-pill-variants.scss`) and update both consumers.
4. Simplify `app.component.scss` aliases and `app.component.ts` token source type.
5. Optionally generate size-matrix rows in `app.component.html`.

## What was NOT reviewed

- Library components in `projects/ui/` are out of scope.
- Other demo components not listed in the task context were not read.
- No functional behavior was changed; these are structural simplification suggestions only.
