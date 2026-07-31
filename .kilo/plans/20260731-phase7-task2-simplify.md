# Simplification Plan — Phase 7 Task 2 (Spanish UI Copy)

## Scope

Review the Spanish-only UI copy implementation across:

- `src/i18n/ui-messages.ts`
- `src/components/module-footer/module-footer.component.ts`
- `src/components/module-header/module-header.component.ts` + `.html`
- `src/components/modal/cba-modal.component.ts` + `.html`
- `src/components/datepicker/cba-datepicker.component.ts` + `.html`
- Spec files for footer, header, modal, datepicker
- `docs/USAGE.md`, `docs/CBA_MODULE_FOOTER.md`, `README.md`
- `src/public-api.ts`

## Findings & Simplification Opportunities

### 1. `ui-messages.ts` — flatten nested `aria` groups

**Current problem:** The `moduleHeader.aria.collapse` and `moduleHeader.aria.size` objects use nested `expand`/`collapse` keys that are confusing to read and map to template ternaries. The `aria` nesting is also repeated for every component.

**Proposed simplification:** Flatten keys so each component has a single-level map of string values. This removes the `aria` wrapper and makes direct binding in templates trivial.

**Example target structure:**

```ts
export const CBA_UI_MESSAGES = {
  moduleFooter: {
    loading: 'Cargando…',
    loaded: 'Listo',
    success: 'Guardado',
    warning: 'Requiere atención',
    error: 'Error',
    dirty: 'Cambios sin guardar',
  },
  moduleHeader: {
    expandModule: 'Expandir módulo',
    collapseModule: 'Colapsar módulo',
    shrinkModule: 'Reducir módulo a 50%',
    expandModuleSize: 'Expandir módulo a 100%',
    removeModule: 'Quitar módulo',
    fullscreen: 'Pantalla completa',
  },
  modal: {
    close: 'Cerrar',
  },
  datepicker: {
    open: 'Abrir selector de fecha',
  },
} as const;
```

**Impact:** Component classes bind to a single string constant instead of nested objects, and templates no longer need chained property access.

### 2. `module-header.component.html` — replace inline ternaries with component methods/computed

**Current problem:** The template repeats ternaries for `aria-label`, `title`, `[icon]`, and emitted size values. This hurts readability and makes the template harder to maintain.

**Proposed simplification:** Add small computed properties / methods in `ModuleHeaderComponent`:

- `collapseIcon(): IconDefinition`
- `collapseLabel(): string`
- `sizeToggleIcon(): IconDefinition`
- `sizeToggleLabel(): string`
- `sizeToggleTarget(): ModuleHeaderSize`

Then simplify the template to single bindings:

```html
<button ... [attr.aria-label]="collapseLabel()" [title]="collapseLabel()" (click)="collapseToggle.emit()">
  <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
</button>
<button ... [attr.aria-label]="sizeToggleLabel()" [title]="sizeToggleLabel()" (click)="sizeToggle.emit(sizeToggleTarget())">
  <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
</button>
```

**Impact:** Template becomes declarative; logic is unit-testable in isolation; no inline ternaries remain.

### 3. `module-header.component.ts` — remove redundant icon aliases

**Current problem:** The class exposes both `faExpand` and `faFullscreenIcon` (same value) and both `faXmark` and `faRemoveIcon` (same value). This is redundant.

**Proposed simplification:** Keep one name per icon. Use `faExpand` for both the size-toggle expand icon and the fullscreen button, and use `faXmark` for the remove button. Remove the duplicate `faFullscreenIcon` and `faRemoveIcon` aliases.

**Impact:** Fewer class members, no duplicated icon references.

### 4. `module-footer.component.ts` — simplify `displayText` and remove unused null guard

**Current problem:**

- `statusText` input is typed `string | undefined`, so the `hasExplicitText` method checks for `null` which cannot be produced by a typed signal input.
- The component stores `statusTexts` as a protected member just to index it in one computed.

**Proposed simplification:**

- Inline the default text lookup using `CBA_UI_MESSAGES.moduleFooter.status[...]` directly in `displayText`, or keep a private local constant.
- Replace `hasExplicitText` with a simple `this.statusText() !== undefined` check.
- Consider merging `statusClass` and `displayText` logic if they both branch on `status() === null`, but keep separate signals for readability.

**Impact:** Smaller component, fewer indirections, no impossible null branch.

### 5. Spec files — consolidate repetitive tests

#### 5.1 `module-header.component.spec.ts`

**Current problem:** Four near-identical tests for collapse, size, remove, fullscreen buttons each create a component, subscribe, query by Spanish label, click, and assert count.

**Proposed simplification:** Parameterize the action-button tests:

```ts
const ACTION_CASES = [
  { label: 'Colapsar módulo', output: 'collapseToggle' },
  { label: 'Reducir módulo a 50%', output: 'sizeToggle', payload: '50%' },
  { label: 'Quitar módulo', output: 'remove' },
  { label: 'Pantalla completa', output: 'fullscreenToggle' },
];

it.each(ACTION_CASES)('emits $output when the $label button is clicked', (...) => { ... });
```

The size-toggle case will need to set initial size to `'100%'` and assert payload `'50%'`.

**Impact:** ~60 lines reduced to ~25 lines; adding future action buttons requires one table row.

#### 5.2 `module-footer.component.spec.ts`

**Current problem:** Three separate `it.each(STATUS_SCENARIOS)` describe blocks for text, icon, and modifier class.

**Proposed simplification:** Combine them into one parameterized test that asserts text, icon presence, and modifier class per scenario:

```ts
it.each(STATUS_SCENARIOS)('renders status region for $status', ({ status, text, modifier }) => {
  render();
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();

  expect(statusText()).toBe(text);
  expect(statusRegion()?.classList.contains(modifier)).toBe(true);
  expect(fixture.nativeElement.querySelector('.cba-module-footer__status fa-icon')).not.toBeNull();
});
```

**Impact:** Fewer test cases, less fixture churn, faster tests.

#### 5.3 `cba-modal.component.spec.ts`

**Current problem:** The size host classes tests use three separate `it` blocks with manual fixture mutation.

**Proposed simplification:** Parameterize the size class tests:

```ts
it.each(['sm', 'md', 'lg'])('applies cba-modal--%s when size is %s', (size) => {
  const { fixture } = createFixture();
  fixture.componentRef.setInput('size', size);
  fixture.detectChanges();
  expect(hostEl(fixture).classList.contains(`cba-modal--${size}`)).toBe(true);
});
```

**Impact:** Removes the special-cased default test and keeps one table-driven test.

#### 5.4 `cba-datepicker.component.spec.ts`

**Current problem:** Every test calls `fixture = TestBed.createComponent(...)` and `fixture.detectChanges()` inline.

**Proposed simplification:** Use a shared `beforeEach` to create the fixture and detect changes, and reset `TestBed` only when necessary. Provide a helper to set inputs.

**Impact:** Removes ~15 lines of repeated fixture setup.

### 6. Documentation — remove duplicated "Spanish-only defaults" sections

**Current problem:** `README.md` and `USAGE.md` both contain a nearly identical "Spanish-only defaults" paragraph explaining that library-owned strings are Spanish, centralized in `CBA_UI_MESSAGES`, and not i18n.

**Proposed simplification:**

- Keep the canonical explanation in `README.md` (it is the primary entry point).
- In `USAGE.md`, replace the full paragraph with a one-line note and a link to the README section, or move the section to a shared snippet referenced by both files.

**Impact:** Eliminates drift risk; single source of truth for the i18n policy.

### 7. `USAGE.md` — fix CbaModal projection example

**Current problem:** The CbaModal example uses `<div footer>` instead of the actual `[cbaModalFooter]` attribute selector supported by the component.

**Proposed simplification:** Change the example to match the component's `ng-content select="[cbaModalFooter]"`:

```html
<ng-container cbaModalFooter>
  ...
</ng-container>
```

**Impact:** Docs match component contract.

## Files to Modify

| File | Change |
| --- | --- |
| `src/i18n/ui-messages.ts` | Flatten message structure; remove nested `aria` objects |
| `src/components/module-header/module-header.component.ts` | Add computed helpers; remove duplicate icon aliases; update `aria` bindings |
| `src/components/module-header/module-header.component.html` | Replace inline ternaries with helper bindings |
| `src/components/module-footer/module-footer.component.ts` | Simplify `displayText`; remove impossible null guard; use constants directly |
| `src/components/module-header/module-header.component.spec.ts` | Parameterize action-button tests |
| `src/components/module-footer/module-footer.component.spec.ts` | Consolidate status scenario tests |
| `src/components/modal/cba-modal.component.spec.ts` | Parameterize size class tests |
| `src/components/datepicker/cba-datepicker.component.spec.ts` | Centralize fixture setup in `beforeEach` |
| `docs/USAGE.md` | Cross-reference README for Spanish defaults; fix CbaModal footer example |
| `README.md` | Keep canonical Spanish-only defaults section (minor wording polish only) |

## Out of Scope / No Simplification Needed

- `cba-modal.component.ts` and `cba-datepicker.component.ts` — simple, one-label components; no meaningful simplification beyond the spec updates.
- `public-api.ts` — already minimal and alphabetically grouped.
- `docs/CBA_MODULE_FOOTER.md` — well scoped; no redundant content identified.

## Risks

- Flattening `ui-messages.ts` is a breaking change for consumers importing `CBA_UI_MESSAGES` directly from `@cobranza-apps/ui`. Because the symbol is exported publicly, the plan should be executed as a coordinated change or documented as a public API change.
- Removing `hasExplicitText` relies on the signal input contract; verify that `input<string | undefined>()` never emits `null`.
