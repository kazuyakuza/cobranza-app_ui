# Cluster 2 Implementation Plan — Phase 10 Theme Hardening (Component Wiring & Verification)

**TODO source:** `.agent/todos/20260807/20260807-todo-1.md`
**Branch:** `feat/phase10-theme-hardening`
**Front-end spec:** `.kilo/plans/20260807-phase10-cluster2-frontend-spec.md`
**Scope:** TODO §5 (Focus ring stress test), §12 (ModuleHeader icons & order), Work B (Component/style wiring).
**Token dependency:** Cluster 1 already landed (`--cba-selected-*`, `--cba-state-*`, `--cba-font-size-*`, `--cba-text-*` utility classes) in `src/theme/_variables.scss` and `src/theme/_utilities.scss`.

---

## Pre-Analysis

### Current state verified from source files

**`module-header.component.ts` (178 lines):**
- Imports `faCompress`, `faExpand` (both used for size-toggle + fullscreen). These must be removed and replaced.
- Missing icons: `faUpDownLeftRight`, `faArrowsLeftRightToLine`, `faArrowsLeftRight`, `faWindowMaximize`.
- Exposes protected icon fields: `faChevronUp`, `faChevronDown`, `faCompress`, `faExpand`, `faXmark` + computed `collapseIcon`, `sizeToggleIcon`.
- No drag handle button, no drag icon field, no drag aria-label.
- Fullscreen button uses `faExpand` (`<fa-icon [icon]="faExpand" ...>`).

**`module-header.component.html` (17 lines):**
- Order is currently: collapse, size-toggle, remove, fullscreen.
- Spec order: drag, collapse/expand, size-toggle, fullscreen, remove.
- Title span has no typography class.

**`module-header.component.scss` (116 lines):**
- `.cba-module-header` uses `border-bottom: 1px solid var(--cba-border-subtle);` — must change to `--cba-border-default`.
- `.cba-module-header__section--title` uses `line-height: 1.5;` — must use `.cba-text-heading-md` token + `font-weight: 600;`.

**`module-container.component.scss` (102 lines):**
- `:host(:not(.cba-module-container--fullscreen))` uses `border: 1px solid var(--cba-border-subtle);` — must change to `--cba-border-default`.
- Body scrollbar uses `--cba-border-default` / `--cba-border-strong` already (internal, file-scoped — keep).

**`cba-field.component.ts` (43 lines):**
- Inputs: `label`, `hint`, `error`, `disabled`, `controlId`. Missing: `readonly`, `valid`.

**`cba-field.component.html` (20 lines):**
- Host modifier bindings: `.cba-field--disabled`, `.cba-field--error`. Missing: `.cba-field--readonly`, `.cba-field--valid`.

**`cba-field.component.scss` (57 lines):**
- `.cba-field__control` focus uses `:focus-within` → `--cba-accent-primary` + `--cba-focus-ring` (keep).
- `.cba-field--error .cba-field__control` uses `--cba-accent-danger` — must use `--cba-state-invalid-border`.
- `.cba-field--error` text uses `--cba-accent-danger` → `--cba-state-invalid-text`.
- `.cba-field--disabled` uses `opacity: 0.6` + `--cba-bg-tertiary` — must use `--cba-state-disabled-bg`, `--cba-state-disabled-text`, no opacity per spec matrix (`opacity: 1`).
- Missing rules: `.cba-field--readonly`, `.cba-field--valid`.

**`cba-field-control-value-accessor.ts` (44 lines):**
- Shared inputs: `label`, `disabled`, `hint`, `error`. Missing: `readonly`, `valid`.
- `isDisabled = computed(() => this.disabled() || this.disabledFromCva())`.

**`cba-input.component.ts` / `cba-select.component.ts` / `cba-datepicker.component.ts`:**
- Host bindings have `[class.cba-input--disabled]`, `[class.cba-input--error]`. Missing: `--readonly`, `--valid`.
- HTML templates bind `[disabled]` only (and datepicker binds `[readOnly]="isDisabled()"`).
- Each `.scss` only has `.cba-X--disabled .cba-X__control { cursor: not-allowed; }`.

**`cba-dropdown.component.scss` (64 lines):**
- `[ngbDropdownItem].active` uses `--cba-active`. No selected pattern CSS.
- Structure: `.cba-dropdown__menu [ngbDropdownItem]`.

**`ui-messages.ts` (45 lines):**
- `moduleHeader.aria`: `collapse.{expand,collapse}`, `size.{shrink,expand}`, `remove`, `fullscreen`. Missing: `drag`.

**Font Awesome availability:** `@fortawesome/free-solid-svg-icons` v7.x — `faUpDownLeftRight`, `faArrowsLeftRightToLine`, `faArrowsLeftRight`, `faWindowMaximize` are all valid exported icons in v6+ free-solid (verified naming). Implementer must confirm import resolves at build time; if a name is unavailable, escalate.

### Technical & architecture decisions

1. **Token-first discipline:** All new colors come from `--cba-*` tokens (already defined by Cluster 1). No hex literals in components.
2. **State token usage:** Invalid → `--cba-state-invalid-*`; valid → `--cba-state-valid-*`; disabled → `--cba-state-disabled-*` (+ `--cba-border-subtle`); readonly → `--cba-bg-tertiary` + `--cba-border-subtle` + `--cba-text-secondary` (no token set, per Cluster 1 spec note); focus ring unchanged (`--cba-focus-ring`).
3. **Backward compatibility:** Keep `.cba-field--error` class (used by host bindings today) AND add `.cba-field--invalid` (same styling). Spec says "rename concept OR keep both for backwards compatibility". Decision: **keep both** classes mapped to the same invalid style block. This avoids breaking existing consumers using `[error]` input and host class `--error`; the new `--invalid` class is added for naming alignment. Same approach for `cba-input--error` / `cba-input--invalid` host classes on each form control.
4. **Readonly vs disabled distinction:** readonly is NOT opacity-faded (spec `opacity: 1`); disabled is no longer opacity-faded either (uses `--cba-state-disabled-*` tokens for distinction). `cursor: not-allowed` stays on disabled; readonly keeps default cursor.
5. **Max arguments per method:** All affected methods stay ≤ 2 params. New inputs are signal `input<T>()` — no method signature changes.
6. **Max lines per file:** `_variables.scss` already 134 lines (cluster 1 done, under 200). Component files stay under 200 lines. `module-header.component.ts` is 178 lines — adding a few icon fields + computed stays ≤ 200. `cba-field.component.scss` is 57 lines — adding readonly/valid blocks stays well under 200.
7. **Form control native readonly:** `CbaInputComponent` native `<input>` gets `[readOnly]="readonly()"`. `CbaSelectComponent` native `<select readonly>` is invalid for selects — instead apply `[class.cba-select__control--readonly]` for visual only and do NOT add native `readonly` attr (native select has no readonly; use `disabled` for native lock; visual readonly = inset bg via host class). `CbaDatepickerComponent` already sets `[readOnly]="isDisabled()"` — change to also respect `readonly()` input on the `<input>` (keep toggle button enabled in readonly so calendar can still be opened; readonly locks typed text only). **Decision:** For datepicker, set `[readOnly]="readonly() || isDisabled()"`. Keep toggle enabled when readonly.
8. **Dropdown selected:** ng-bootstrap `NgbDropdownItem` does not expose a "selected" state. Per spec §B, add a documented CSS rule for a consumer-applied class `.cba-dropdown__item--selected` using `--cba-selected-bg` + `--cba-selected-text`. No TS wiring (thin wrapper principle).
9. **Focus ring verification:** No code change unless a failure is found. Verification is a documented checklist run via the preview `docs/theme-preview.html` (Cluster 3 builds the preview samples) or via the component Storybook-style inspection. **Decision for this cluster:** Add a `docs/focus-ring-checklist.md` note is OUT OF SCOPE (docs step is 4.4). Cluster 2 only produces the verification approach (a checklist table) and any required code adjustment IF a failure is found during implementation. Since preview samples are built in Cluster 3, the actual visual verification step is: (a) ensure `:focus-visible` uses `--cba-focus-ring` token on every target surface (audit existing CSS), and (b) if any target surface lacks a `:focus-visible` rule, add `@include cba-focus-ring` on `:focus-visible`. This is the actionable artifact Cluster 2 produces.
10. **Commit points:** Granular commits per logical unit (icons, border, form wiring, dropdown, focus audit) so review/revert is clean.

### Ambiguities / gaps — decisions

- **Should `.cba-field--error` be renamed to `.cba-field--invalid`?** → No; keep `.cba-field--error` AND add `.cba-field--invalid` sharing the same style block (backward compat).
- **Should `CbaInputComponent` add `framereadonly` proper for native input?** → Yes, bind native `[readOnly]`.
- **Should `CbaSelectComponent` add native `readonly` attr?** → No (invalid on `<select>`); visual-only via host class.
- **Should `CbaDropdownComponent` get TS for selected?** → No; CSS-only documented pattern.

---

## High-Level Approach

1. **Step A — ModuleHeader icons & order:** swap Font Awesome imports, add drag handle field/button, reorder template, remove `faCompress`/`faExpand`, add `moduleHeader.aria.drag` message.
2. **Step B — ModuleHeader title typography:** apply `.cba-text-heading-md` + `font-weight: 600` to title section.
3. **Step C — Border audit:** change `border-subtle` → `border-default` on `ModuleContainer` outer edge and `ModuleHeader` bottom divider.
4. **Step D — Form control state wiring:** add `readonly` + `valid` inputs to `CbaFieldControlValueAccessor`; add `readonly` to native `CbaInput`/`CbaDatepicker`; propagate host classes (`--readonly`, `--valid`, `--invalid`) across `CbaInput`/`CbaSelect`/`CbaDatepicker`; update `cba-field` host + template bindings; retune `cba-field.component.scss` invalid/disabled + add readonly/valid blocks + per-component `--disabled`/`--readonly`/`--valid`/`--invalid` SCSS.
5. **Step E — Dropdown selected pattern:** add `.cba-dropdown__item--selected` CSS rule to `cba-dropdown.component.scss`.
6. **Step F — Focus ring audit:** grep all `:focus-visible` / `:focus` in `src/`; verify each uses `--cba-focus-ring`; add the mixin where missing (audit list below). Document the verification matrix result in this plan's verification section.
7. **Step G — Build/lint/test:** run `npm run lint`, `npm test`, `npm run build` (or project build script). Fix any failing tests that assert old icon names / class names.
8. **Step H — Commit** per logical unit.

---

## Detailed Steps

### Step A — ModuleHeader icons & order

#### A.1 — Update `src/i18n/ui-messages.ts`

Add `drag` to `moduleHeader.aria`.

Locate:
```ts
moduleHeader: {
    aria: {
      collapse: {
        expand: 'Expandir módulo',
        collapse: 'Colapsar módulo',
      },
      size: {
        shrink: 'Reducir módulo a 50%',
        expand: 'Expandir módulo a 100%',
      },
      remove: 'Quitar módulo',
      fullscreen: 'Pantalla completa',
    },
  },
```

Replace `remove: 'Quitar módulo',` line block with (keep existing order, add `drag` after `fullscreen`):
```ts
      remove: 'Quitar módulo',
      fullscreen: 'Pantalla completa',
      drag: 'Arrastrar módulo',
```

(Placement: `drag` added as last key of `moduleHeader.aria` to keep diff minimal.)

#### A.2 — Update `src/components/module-header/module-header.component.ts` imports

Replace the Font Awesome import block:

Current:
```ts
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCompress,
  faExpand,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

New (remove `faCompress`, `faExpand`; add `faArrowsLeftRight`, `faArrowsLeftRightToLine`, `faUpDownLeftRight`, `faWindowMaximize`):
```ts
import {
  faArrowsLeftRight,
  faArrowsLeftRightToLine,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faUpDownLeftRight,
  faWindowMaximize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

#### A.3 — Replace icon fields in `module-header.component.ts`

Remove these protected field declarations:
```ts
  /** Icon for the size-toggle button when current size is `100%` (action: shrink to 50%). Template-referenced. */
  protected readonly faCompress = faCompress;

  /** Icon for the size-toggle button when current size is `50%` (action: expand to 100%) and for the fullscreen button. Template-referenced. */
  protected readonly faExpand = faExpand;
```

Add in their place (keep JSDoc style; group drag + fullscreen + new size-toggle icons):
```ts
  /** Drag handle icon (visual only; drag is owned by the Shell). Template-referenced. */
  protected readonly faDrag = faUpDownLeftRight;

  /** Fullscreen button icon. Template-referenced. */
  protected readonly faFullscreen = faWindowMaximize;

  /** Icon for the size-toggle button when current size is `100%` (action: shrink to 50%). Template-referenced. */
  protected readonly faShrink = faArrowsLeftRightToLine;

  /** Icon for the size-toggle button when current size is `50%` (action: expand to 100%). Template-referenced. */
  protected readonly faGrow = faArrowsLeftRight;
```

#### A.4 — Update `sizeToggleIcon` computed in `module-header.component.ts`

Current:
```ts
  readonly sizeToggleIcon = computed<IconDefinition>(() =>
    this.isFullSize() ? faCompress : faExpand,
  );
```

New:
```ts
  readonly sizeToggleIcon = computed<IconDefinition>(() =>
    this.isFullSize() ? this.faShrink : this.faGrow,
  );
```

#### A.5 — Verify file stays under 200 lines & max-args / max-depth rules

After edits, `module-header.component.ts` should remain ~178 lines (net +0: removed 2 fields, added 4 fields, plus computed change). Confirm with `read`/line count. If exceeding 200, extract icon registry to a separate file `src/components/module-header/module-header.icons.ts` (decision defer to review). Expected: stays under 200.

#### A.6 — Update `src/components/module-header/module-header.component.html` (reorder + drag + fullscreen icon + title typography class)

Current `<nav>` block:
```html
  <nav class="cba-module-header__section cba-module-header__section--actions">
    <button type="button" class="cba-module-header__action" [attr.aria-label]="collapseLabel()" [title]="collapseLabel()" (click)="collapseToggle.emit()">
      <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="sizeToggleLabel()" [title]="sizeToggleLabel()" (click)="sizeToggle.emit(sizeToggleTarget())">
      <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="aria.remove" [title]="aria.remove" (click)="remove.emit()">
      <fa-icon [icon]="faXmark" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="aria.fullscreen" [title]="aria.fullscreen" (click)="fullscreenToggle.emit()">
      <fa-icon [icon]="faExpand" aria-hidden="true" />
    </button>
  </nav>
```

New `<nav>` block (order: drag → collapse → size-toggle → fullscreen → remove; drag has no click handler, has `aria.drag` label + `aria-disabled`-style `disabled` attr is NOT set since it's a visual handle; use `type="button"` + no emitter):
```html
  <nav class="cba-module-header__section cba-module-header__section--actions">
    <button type="button" class="cba-module-header__action cba-module-header__action--drag" [attr.aria-label]="aria.drag" [title]="aria.drag">
      <fa-icon [icon]="faDrag" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="collapseLabel()" [title]="collapseLabel()" (click)="collapseToggle.emit()">
      <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="sizeToggleLabel()" [title]="sizeToggleLabel()" (click)="sizeToggle.emit(sizeToggleTarget())">
      <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="aria.fullscreen" [title]="aria.fullscreen" (click)="fullscreenToggle.emit()">
      <fa-icon [icon]="faFullscreen" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" [attr.aria-label]="aria.remove" [title]="aria.remove" (click)="remove.emit()">
      <fa-icon [icon]="faXmark" aria-hidden="true" />
    </button>
  </nav>
```

#### A.7 — Add drag-handle SCSS modifier to `module-header.component.scss`

Add after `.cba-module-header__action:active { ... }` block (before `:focus-visible` rule):
```scss
.cba-module-header__action--drag {
  cursor: grab;
}

.cba-module-header__action--drag:active {
  cursor: grabbing;
  background-color: transparent;
}
```

(Visual handle: `grab` cursor signals drag affordance. No hover/active bg since no click action.)

#### A.8 — Commit Step A

Command:
```bash
git add -A
git commit -m "feat(module-header): swap icons + add drag handle + reorder actions per phase10 spec"
```

---

### Step B — ModuleHeader title typography

#### B.1 — Update `module-header.component.html` title span (both occurrences: fullscreen + default)

Fullscreen title:
```html
<div class="cba-module-header__section cba-module-header__section--title"> {{ title() }} </div>
```
New:
```html
<div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md"> {{ title() }} </div>
```

Default title (the second `<div>` after status):
```html
<div class="cba-module-header__section cba-module-header__section--title"> {{ title() }} </div>
```
New:
```html
<div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md"> {{ title() }} </div>
```

#### B.2 — Update `.cba-module-header__section--title` in `module-header.component.scss`

Current:
```scss
.cba-module-header__section--title {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.5;
}
```

New (drop hardcoded `line-height: 1.5;`; rely on `.cba-text-heading-md` utility for font-size + line-height; add `font-weight: 600;` for heading emphasis per Cluster 1 spec table):
```scss
.cba-module-header__section--title {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  font-weight: 600;
}
```

(No `@use` needed — `.cba-text-heading-md` is a global utility class from `_utilities.scss`, applied in template.)

#### B.3 — Commit Step B

```bash
git add -A
git commit -m "feat(module-header): apply heading-md type scale + semibold to title"
```

---

### Step C — Border audit (ModuleContainer + ModuleHeader)

#### C.1 — `src/components/module-container/module-container.component.scss`

Current structural-edge rule:
```scss
:host(:not(.cba-module-container--fullscreen)) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  /* Clip projected header to the rounded corners. */
  overflow: hidden;
}
```

New (change `border-subtle` → `border-default` for structural module frame; update the inline comment to note border = primary separator):
```scss
:host(:not(.cba-module-container--fullscreen)) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  /* Border is the primary separator; shadow is secondary depth. */
  overflow: hidden;
}
```

#### C.2 — `src/components/module-header/module-header.component.scss`

Current:
```scss
.cba-module-header {
  display: flex;
  align-items: flex-start;
  min-height: var(--cba-module-header-min-height, 40px);
  padding: var(--cba-space-2) var(--cba-space-3);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-elevated);
  color: var(--cba-text-primary);
  border-bottom: 1px solid var(--cba-border-subtle);
  box-sizing: border-box;
}
```

New (change divider `border-subtle` → `border-default` to separate elevated header from panel body):
```scss
.cba-module-header {
  display: flex;
  align-items: flex-start;
  min-height: var(--cba-module-header-min-height, 40px);
  padding: var(--cba-space-2) var(--cba-space-3);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-elevated);
  color: var(--cba-text-primary);
  border-bottom: 1px solid var(--cba-border-default);
  box-sizing: border-box;
}
```

#### C.3 — Audit other `border-subtle` structural uses

Run grep:
```bash
rg "cba-border-subtle" src/components
```
Review each hit. `cba-dropdown.component.scss` uses `--cba-border-subtle` for the **dropdown menu outline** (line 12). The dropdown menu is a floating elevated surface — per Cluster 1 spec, dropdown menus are `--cba-shadow-elevated` floating chrome. Spec table: `border-default` = "module frame, cards, **inputs**". A dropdown menu is closer to a menu/popover. **Decision:** leave dropdown menu border as `--cba-border-subtle` (it is an elevated popover, not a structural module edge; shadow-elevated is the primary depth cue). Document this decision in cluster-3 docs. The `dropdown-divider` (internal separator) also correctly stays `--cba-border-subtle`.

No other structural-edge violations expected. If review finds a module/card frame using `border-subtle`, change to `border-default`.

#### C.4 — Commit Step C

```bash
git add -A
git commit -m "fix(module): use border-default for structural module edges (container + header)"
```

---

### Step D — Form control state wiring (readonly, valid, invalid retune)

#### D.1 — `src/components/form-field/cba-field-control-value-accessor.ts`

Add `readonly` + `valid` inputs after `error` input.

Current:
```ts
  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);
```

Add after:
```ts
  /** Visual readonly state applied to the field wrapper. Distinct from disabled. */
  readonly readonly = input<boolean>(false);

  /** Visual valid/confirmed state applied to the field wrapper (no validation logic). */
  readonly valid = input<boolean>(false);
```

#### D.2 — `src/components/form-field/cba-field.component.ts`

Add `readonly` + `valid` inputs after `disabled` input.

Current:
```ts
  /** Visual disabled state applied to the field wrapper. */
  readonly disabled = input<boolean>(false);
```

Add after:
```ts
  /** Visual readonly state applied to the field wrapper. Distinct from disabled. */
  readonly readonly = input<boolean>(false);

  /** Visual valid/confirmed state applied to the field wrapper (no validation logic). */
  readonly valid = input<boolean>(false);
```

#### D.3 — `src/components/form-field/cba-field.component.html`

Update the root `<div>` host class bindings.

Current:
```html
<div
  class="cba-field"
  [class.cba-field--disabled]="disabled()"
  [class.cba-field--error]="error()">
```

New (add `--readonly`, `--valid`, `--invalid`; keep `--error` for backward compat — both map to invalid styling):
```html
<div
  class="cba-field"
  [class.cba-field--disabled]="disabled()"
  [class.cba-field--readonly]="readonly()"
  [class.cba-field--valid]="valid()"
  [class.cba-field--error]="error()"
  [class.cba-field--invalid]="error()">
```

#### D.4 — `src/components/form-field/cba-field.component.scss`

Retune invalid + disabled; add readonly + valid.

Current error + disabled blocks:
```scss
.cba-field--error .cba-field__control {
  border-color: var(--cba-accent-danger);
}

.cba-field--disabled {
  opacity: 0.6;

  .cba-field__control {
    background-color: var(--cba-bg-tertiary);
    cursor: not-allowed;
  }
}

.cba-field__hint {
  color: var(--cba-text-muted);
  font-size: 0.8125rem;
}

.cba-field__error {
  color: var(--cba-accent-danger);
  font-size: 0.8125rem;
}
```

New (replace error block with invalid+error combined; replace disabled block to use state tokens; add readonly + valid blocks; retune error text token):
```scss
.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  border-color: var(--cba-state-invalid-border);
}

.cba-field--disabled {
  .cba-field__control {
    background-color: var(--cba-state-disabled-bg);
    border-color: var(--cba-border-subtle);
    color: var(--cba-state-disabled-text);
    cursor: not-allowed;
  }

  .cba-field__label {
    color: var(--cba-state-disabled-text);
  }
}

.cba-field--readonly .cba-field__control {
  background-color: var(--cba-bg-tertiary);
  border-color: var(--cba-border-subtle);
  color: var(--cba-text-secondary);
}

.cba-field--valid .cba-field__control {
  border-color: var(--cba-state-valid-border);
}

.cba-field__hint {
  color: var(--cba-text-muted);
  font-size: var(--cba-font-size-small);
}

.cba-field__error {
  color: var(--cba-state-invalid-text);
  font-size: var(--cba-font-size-small);
}
```

Notes:
- `disabled` no longer uses `opacity: 0.6`; uses `--cba-state-disabled-*` tokens per Cluster 1 spec matrix (`opacity: 1`).
- `.cba-field__label` font-size left at `0.875rem` (body) — could retune to `--cba-font-size-body`; **decision:** change to `var(--cba-font-size-body)` for consistency with the new type scale. Update the existing `.cba-field__label` rule:
```scss
.cba-field__label {
  color: var(--cba-text-secondary);
  font-size: var(--cba-font-size-body);
  font-weight: 500;
}
```

#### D.5 — `src/components/input/cba-input.component.ts`

Add host class bindings for `readonly`, `valid`, `invalid`.

Current host:
```ts
  host: {
    class: 'cba-input',
    '[class.cba-input--disabled]': 'isDisabled()',
    '[class.cba-input--error]': 'error()',
  },
```

New:
```ts
  host: {
    class: 'cba-input',
    '[class.cba-input--disabled]': 'isDisabled()',
    '[class.cba-input--readonly]': 'readonly()',
    '[class.cba-input--valid]': 'valid()',
    '[class.cba-input--error]': 'error()',
    '[class.cba-input--invalid]': 'error()',
  },
```

#### D.6 — `src/components/input/cba-input.component.html`

Pass `readonly` + `valid` to `<cba-field>`; bind native `[readOnly]` on `<input>`.

Current:
```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <input
    [id]="controlId"
    [type]="type()"
    [placeholder]="placeholder() ?? ''"
    [disabled]="isDisabled()"
    [value]="value() ?? ''"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="cba-input__control" />
</cba-field>
```

New:
```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [readonly]="readonly()"
  [valid]="valid()"
  [controlId]="controlId">
  <input
    [id]="controlId"
    [type]="type()"
    [placeholder]="placeholder() ?? ''"
    [readOnly]="readonly()"
    [disabled]="isDisabled()"
    [value]="value() ?? ''"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="cba-input__control" />
</cba-field>
```

#### D.7 — `src/components/input/cba-input.component.scss`

Add valid cursor default for readonly; keep disabled.

Current:
```scss
.cba-input--disabled .cba-input__control {
  cursor: not-allowed;
}
```

New (add readonly + valid passthrough; readonly keeps default cursor):
```scss
.cba-input--disabled .cba-input__control {
  cursor: not-allowed;
}

.cba-input--readonly .cba-input__control {
  cursor: default;
}
```

#### D.8 — `src/components/select/cba-select.component.ts`

Update host bindings (same pattern as input):
```ts
  host: {
    class: 'cba-select',
    '[class.cba-select--disabled]': 'isDisabled()',
    '[class.cba-select--readonly]': 'readonly()',
    '[class.cba-select--valid]': 'valid()',
    '[class.cba-select--error]': 'error()',
    '[class.cba-select--invalid]': 'error()',
  },
```

#### D.9 — `src/components/select/cba-select.component.html`

Pass `readonly` + `valid` to `<cba-field>`. Note: `<select>` has no native `readonly` attribute — do NOT add `[readOnly]` to the `<select>` element (invalid HTML). Visual readonly handled by host class → `cba-field--readonly` styling on the wrapper.

Current:
```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <select
    [id]="controlId"
    [disabled]="isDisabled()"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null"
    (change)="onSelectChange($event)"
    (blur)="onBlur()"
    class="cba-select__control">
    <ng-content select="option"></ng-content>
  </select>
</cba-field>
```

New:
```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [readonly]="readonly()"
  [valid]="valid()"
  [controlId]="controlId">
  <select
    [id]="controlId"
    [disabled]="isDisabled()"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null"
    (change)="onSelectChange($event)"
    (blur)="onBlur()"
    class="cba-select__control">
    <ng-content select="option"></ng-content>
  </select>
</cba-field>
```

#### D.10 — `src/components/select/cba-select.component.scss`

Current:
```scss
.cba-select--disabled .cba-select__control {
  cursor: not-allowed;
}
```

New:
```scss
.cba-select--disabled .cba-select__control {
  cursor: not-allowed;
}

.cba-select--readonly .cba-select__control {
  cursor: default;
}
```

#### D.11 — `src/components/datepicker/cba-datepicker.component.ts`

Update host bindings (same pattern):
```ts
  host: {
    class: 'cba-datepicker',
    '[class.cba-datepicker--disabled]': 'isDisabled()',
    '[class.cba-datepicker--readonly]': 'readonly()',
    '[class.cba-datepicker--valid]': 'valid()',
    '[class.cba-datepicker--error]': 'error()',
    '[class.cba-datepicker--invalid]': 'error()',
  },
```

#### D.12 — `src/components/datepicker/cba-datepicker.component.html`

Pass `readonly` + `valid` to `<cba-field>`. Change native `<input>` `[readOnly]` from `isDisabled()` to `readonly() || isDisabled()`. Keep toggle button `[disabled]="isDisabled()"` (toggle stays enabled when readonly so the calendar popup can still be opened — readonly locks typed text only; per spec decision §7).

Current:
```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <div class="cba-datepicker__input-wrapper">
    <input
      [id]="controlId"
      [placeholder]="placeholder() ?? ''"
      [disabled]="isDisabled()"
      [readOnly]="isDisabled()"
      [ngModel]="value()"
      (ngModelChange)="onDateChange($event)"
      (blur)="onBlur()"
      ngbDatepicker
      #dp="ngbDatepicker"
      [datepickerClass]="'cba-datepicker-popup'"
      [attr.aria-describedby]="describedBy()"
      [attr.aria-invalid]="error() ? 'true' : null"
      class="cba-datepicker__control" />

    <button
      type="button"
      class="cba-datepicker__toggle"
      [attr.aria-label]="toggleAriaLabel"
      [disabled]="isDisabled()"
      (click)="dp.toggle()">
      <fa-icon [icon]="faCalendar" aria-hidden="true" />
    </button>
  </div>
</cba-field>
```

New:
```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [readonly]="readonly()"
  [valid]="valid()"
  [controlId]="controlId">
  <div class="cba-datepicker__input-wrapper">
    <input
      [id]="controlId"
      [placeholder]="placeholder() ?? ''"
      [disabled]="isDisabled()"
      [readOnly]="readonly() || isDisabled()"
      [ngModel]="value()"
      (ngModelChange)="onDateChange($event)"
      (blur)="onBlur()"
      ngbDatepicker
      #dp="ngbDatepicker"
      [datepickerClass]="'cba-datepicker-popup'"
      [attr.aria-describedby]="describedBy()"
      [attr.aria-invalid]="error() ? 'true' : null"
      class="cba-datepicker__control" />

    <button
      type="button"
      class="cba-datepicker__toggle"
      [attr.aria-label]="toggleAriaLabel"
      [disabled]="isDisabled()"
      (click)="dp.toggle()">
      <fa-icon [icon]="faCalendar" aria-hidden="true" />
    </button>
  </div>
</cba-field>
```

#### D.13 — `src/components/datepicker/cba-datepicker.component.scss`

Current disabled block:
```scss
.cba-datepicker--disabled .cba-datepicker__toggle,
.cba-datepicker--disabled .cba-datepicker__control {
  cursor: not-allowed;
}
```

New (add readonly block; readonly keeps toggle enabled with default cursor):
```scss
.cba-datepicker--disabled .cba-datepicker__toggle,
.cba-datepicker--disabled .cba-datepicker__control {
  cursor: not-allowed;
}

.cba-datepicker--readonly .cba-datepicker__control {
  cursor: default;
}

.cba-datepicker--readonly .cba-datepicker__toggle {
  cursor: pointer;
}
```

#### D.14 — Audit existing tests for icon/class name assertions

Run:
```bash
rg "faCompress|faExpand|cba-field--error|cba-input--error" src
```
Focus on `*.spec.ts` files. If any test asserts the removed `faCompress`/`faExpand` icon fields or the renamed-to-invalid class, update the test to the new icon names (`faDrag`/`faFullscreen`/`faShrink`/`faGrow`) and add `--readonly`/`--valid`/`--invalid` coverage. If no tests exist for these, skip (not in scope to author new tests beyond fixing broken ones). Report findings.

#### D.15 — Commit Step D

```bash
git add -A
git commit -m "feat(form-controls): wire readonly + valid + invalid state tokens across field/input/select/datepicker"
```

---

### Step E — Dropdown selected option pattern

#### E.1 — `src/components/dropdown/cba-dropdown.component.scss`

Add a selected-pattern rule after the `.active` block (after lines 38-41). This is a CSS-only documented pattern — consumers apply `.cba-dropdown__item--selected` to a `NgbDropdownItem` they want to mark as chosen.

After:
```scss
.cba-dropdown__menu [ngbDropdownItem]:active,
.cba-dropdown__menu [ngbDropdownItem].active {
  background-color: var(--cba-active);
}
```

Add:
```scss
/* Selected item — applied by consumers via [class.cba-dropdown__item--selected]
   on a NgbDropdownItem to mark the chosen option. selected ≠ active(pressed) ≠ focus. */
.cba-dropdown__menu [ngbDropdownItem].cba-dropdown__item--selected {
  background-color: var(--cba-selected-bg);
  color: var(--cba-selected-text);
}

.cba-dropdown__menu [ngbDropdownItem].cba-dropdown__item--selected:hover {
  background-color: var(--cba-selected-hover);
}
```

(No TS changes — thin wrapper. Pattern documentation is delivered in cluster 3 docs as `docs/CBA_DROPDOWN.md` per global plan 4.4.)

#### E.2 — Commit Step E

```bash
git add -A
git commit -m "feat(dropdown): add selected option CSS pattern using --cba-selected-* tokens"
```

---

### Step F — Focus ring audit

#### F.1 — Grep all focus rules in `src/`

```bash
rg ":focus|focus-visible|focus-within" src --type css --type scss
rg "focus-visible|focus-within|focus-ring|:focus" src -g "*.scss" -g "*.html"
```

Expected current `:focus-visible` / `:focus-within` occurrences (from files read):
- `module-header.component.scss`: `.cba-module-header__action:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }` ✓
- `cba-field.component.scss`: `.cba-field__control:focus-within { border-color: --cba-accent-primary; box-shadow: --cba-focus-ring; }` ✓
- `cba-dropdown.component.scss`: `[ngbDropdownItem]:focus-visible { outline: none; box-shadow: inset var(--cba-focus-ring); }` ✓
- `cba-datepicker.component.scss`: `.cba-datepicker__toggle:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }` ✓

#### F.2 — Audit verification matrix

Build a checklist (documented here as the audit result; no separate doc file — Cluster 3 owns docs). Verify each target surface has a `:focus-visible` rule using `--cba-focus-ring`:

| Surface / element | File | `:focus-visible` rule? | Uses `--cba-focus-ring`? | Action |
|-------------------|------|------------------------|-------------------------|--------|
| ModuleHeader action button | `module-header.component.scss` | yes | yes | none |
| Form field wrapper (input/select/datepicker) | `cba-field.component.scss` | `:focus-within` yes | yes | none |
| Dropdown menu item | `cba-dropdown.component.scss` | yes | yes (inset variant) | none |
| Datepicker toggle button | `cba-datepicker.component.scss` | yes | yes | none |

#### F.3 — Audit button components (outside the read files but in scope of focus-ring stress test)

```bash
rg ":focus-visible|:focus" src/components/button src/components/modal -g "*.scss"
```

If any button variant (`cba-button`, ghost, danger, success, icon button) lacks a `:focus-visible` rule, add `@include cba-focus-ring` on `:focus-visible`. For danger/success solid buttons where coral-on-red may be low-contrast, apply the inner-white-ring fallback per Cluster 1 spec §5:

```scss
&:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--cba-text-inverse),
    0 0 0 4px var(--cba-accent-danger); /* or --cba-accent-success for success variant */
}
```

Only apply this fallback IF visual verification in cluster 3 preview shows the standard ring fails on the colored button. **Default action:** leave button focus rules as-is unless the grep audit reveals a missing `:focus-visible` rule. Report findings; do not change button rules preemptively (acceptance criterion says "adjust only if failures appear").

#### F.4 — Native input/select focus

The native `<input>` / `<select>` are reset via `%cba-native-control` (`outline: none`) and rely on the parent `.cba-field__control:focus-within` ring. This is correct — no native `:focus` ring needed. Confirm by grep:
```bash
rg "outline" src/theme/_mixins.scss
```
Should show `%cba-native-control { outline: none; ... }`.

#### F.5 — Verification approach (for implementer + cluster 3 preview)

The actual visual pass happens in cluster 3 (`docs/theme-preview.html` form-state samples + button matrix). Cluster 2 deliverable: the audit table above + any missing `:focus-visible` rule added. Document the result in the implementation summary.

#### F.6 — Commit Step F (only if changes were made)

```bash
git add -A
git commit -m "fix(focus): ensure :focus-visible uses --cba-focus-ring on all interactive surfaces"
```

(Skip commit if no code changes — record the audit result in the completion summary instead.)

---

### Step G — Build / lint / test

#### G.1 — Lint

```bash
npm run lint
```
Fix any lint errors introduced (unused imports, line limits, max-depth, single-section boolean conditions). Re-run until clean.

#### G.2 — Build

```bash
npm run build
```
(If the build script is different, e.g. `npm run build:lib`, use that. Check `package.json` `scripts` for the exact build command before running.)

Verify:
- No Angular template errors (`faDrag`, `faFullscreen`, `faShrink`, `faGrow` resolve — confirms Font Awesome exports exist).
- No `readonly()` / `valid()` binding errors (inputs added to base CVAccessor + `CbaFieldComponent`).
- SCSS compiles (`--cba-state-*`, `--cba-selected-*`, `--cba-font-size-*` tokens all exist in `_variables.scss`).

#### G.3 — Test

```bash
npm test
```
If tests fail on icon names or class names (per D.14 audit), update the affected `*.spec.ts` to the new icon fields / host classes. Do not author new tests — that's not in the cluster-2 plan scope (preview samples are cluster 3). If a spec asserts `component.faCompress` exists, change to `component.faShrink` / `component.faGrow` and `component.faFullscreen` / `component.faDrag` accordingly.

#### G.4 — Final state check

```bash
git status
npm run lint
```
Ensure working tree clean (all committed) and lint green.

---

### Step H — Cluster 2 completion summary items (for caller / 4.6)

After all steps:
- Cluster 2 implementation plan steps A–G complete.
- Files modified:
  - `src/i18n/ui-messages.ts`
  - `src/components/module-header/module-header.component.ts`
  - `src/components/module-header/module-header.component.html`
  - `src/components/module-header/module-header.component.scss`
  - `src/components/module-container/module-container.component.scss`
  - `src/components/form-field/cba-field.component.ts`
  - `src/components/form-field/cba-field.component.html`
  - `src/components/form-field/cba-field.component.scss`
  - `src/components/form-field/cba-field-control-value-accessor.ts`
  - `src/components/input/cba-input.component.ts`
  - `src/components/input/cba-input.component.html`
  - `src/components/input/cba-input.component.scss`
  - `src/components/select/cba-select.component.ts`
  - `src/components/select/cba-select.component.html`
  - `src/components/select/cba-select.component.scss`
  - `src/components/datepicker/cba-datepicker.component.ts`
  - `src/components/datepicker/cba-datepicker.component.html`
  - `src/components/datepicker/cba-datepicker.component.scss`
  - `src/components/dropdown/cba-dropdown.component.scss`
  - Possibly `*.spec.ts` (only if tests broke from icon/class renames)
- Commits: per logical unit (A, B, C, D, E, F if changes).
- Focus ring audit: documented in F.2 + F.3; changes only if a failure was found.
- Out of scope (cluster 3 / docs 4.4):
  - `docs/theme-preview.html` form-state samples.
  - `docs/CBA_DROPDOWN.md` selected consumer note.
  - `docs/MODULE_HEADER.md` icon order + type scale.
  - `docs/CBA_INPUT.md` / `CBA_SELECT.md` / `CBA_DATEPICKER.md` state matrix.
  - `THEME.md` / `CONSUMER_GUIDE.md` selected/form-state/border sections.
- Out of scope (cluster 1 — already done):
  - Token definitions in `_variables.scss`.
  - Utility classes `.cba-text-*` in `_utilities.scss`.

---

## Verification against TODO §5, §12, Work B

| TODO item | Plan step | Verification |
|-----------|-----------|--------------|
| §5 Verify focus-visible on canvas/panel/elevated/inset/buttons/ghost/icon/text input | F.1–F.5 | Audit table confirms `:focus-visible` uses `--cba-focus-ring` on all in-lib surfaces; visual pass deferred to cluster 3 preview but no missing rule remains. |
| §5 Adjust ring alpha/spread only if failures | F.3 | Default: no change; fallback applied only if colored-button failure found. |
| §5 Document MFEs must use lib focus | (docs 4.4 — cluster 3) | Out of cluster 2; flag for docs step. |
| §12 drag icon → `up-down-left-right` | A.2/A.3/A.6 | `faDrag = faUpDownLeftRight` field + drag button in template. |
| §12 size toggle 100%→50% `arrows-left-right-to-line` | A.3/A.4 | `faShrink = faArrowsLeftRightToLine`; `sizeToggleIcon` returns `faShrink` when full. |
| §12 size toggle 50%→100% `arrows-left-right` | A.3/A.4 | `faGrow = faArrowsLeftRight`; `sizeToggleIcon` returns `faGrow` when half. |
| §12 fullscreen `window-maximize` | A.3/A.6 | `faFullscreen = faWindowMaximize` + template icon. |
| §12 order drag, collapse, size, fullscreen, remove | A.6 | Template `<nav>` order matches. |
| Work B ModuleContainer/ModuleHeader borders | C.1/C.2 | `border-subtle` → `border-default` on both. |
| Work B Form controls invalid/disabled/readonly/focus | D.1–D.13 | Inputs + host classes + SCSS wired across field/input/select/datepicker. |
| Work B Dropdown selected option | E.1 | `.cba-dropdown__item--selected` CSS rule added. |
| Work B ModuleHeader title type step | B.1/B.2 | `.cba-text-heading-md` + `font-weight: 600`. |

---

## Risk Notes

- **Font Awesome icon name availability:** `faArrowsLeftRightToLine` and `faArrowsLeftRight` are valid in free-solid v6.5+ / v7. If the build fails on import, escalate to caller (do not invent alternative names). The global plan risk note flagged this.
- **`module-header.component.ts` line count:** currently 178 lines; net change ~0 (−2 fields removed, +4 fields added, computed name change). Stays under 200 but close — review step (4.3) should monitor.
- **Test breakage:** icon-field tests (if any assert `faCompress`/`faExpand`) will fail. D.14 + G.3 handle this. Report any spec that cannot be trivially updated.
- **Disabled opacity removal:** removing `opacity: 0.6` from `.cba-field--disabled` is a visible change. This is per Cluster 1 spec matrix (`opacity: 1`, use state tokens). Confirms with the design constraint "Tune hex values; acceptance is visual hierarchy + state clarity".
- **Datepicker readonly + open calendar:** keeping toggle enabled when readonly is the intended UX (typists can't type but can pick from calendar). If caller disagrees, escalate — this plan does NOT lock the toggle when readonly.
- **Native `<select readonly>`:** invalid HTML; visual-only via host class. Consumer who needs a locked select must use `disabled` (native) — readonly on select is purely visual (bg/border) per this plan. Documented for cluster-3 docs.

---

## Out-of-scope flags for caller (NOT executed by this plan)

- `docs/theme-preview.html` form-state samples + density strip + selected samples + type scale sample → Cluster 3.
- `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, `docs/MODULE_HEADER.md`, `docs/CBA_*` state matrix updates → Step 4.4 docs-specialist.
- `CHANGELOG.md` entries finalized → Cluster 3 / step 5.
- New unit tests for readonly/valid inputs → not required by this plan (no new tests authored; only fixing broken ones). If code reviewer requests tests, plan a follow-up TODO.

---

**End of Cluster 2 Implementation Plan.**