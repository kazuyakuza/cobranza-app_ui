# Front-end Technical Specification — Phase 11: ModuleHeader optional drag-handle projection slot

**Library:** `@cobranza-apps/ui`  
**Task:** Allow the Shell to project an optional drag-handle control into `ModuleHeader` so `@angular/cdk/drag-drop` (`cdkDragHandle`) can be applied by the Shell without the UI library depending on CDK or owning drag-and-drop behaviour.  
**Version target:** `0.13.0`  
**Date:** `2026-08-09`

## 1. Framework and stack context

| Item | Value |
|------|-------|
| Framework | Angular 22 standalone components |
| Language | TypeScript 6.0 / strict mode |
| Styling | SCSS + `--cba-*` design tokens |
| Icons | Font Awesome Free via `@fortawesome/angular-fontawesome` |
| Testing | Jest + jest-preset-angular |
| Build | `ng-packagr` (`npm run build`) |

No new peer dependency may be added; in particular `@angular/cdk` is **forbidden**.

## 2. Component contract

`ModuleHeaderComponent` keeps its existing public API exactly as it is today.

### 2.1 Inputs / outputs (unchanged)

| Input | Type | Default | Required |
|-------|------|---------|----------|
| `title` | `string` | — | yes |
| `size` | `ModuleHeaderSize` | `'100%'` | no |
| `isCollapsed` | `boolean` | `false` | no |
| `isFullscreen` | `boolean` | `false` | no |
| `status` | `ModuleHeaderStatus` | `null` | no |

| Output | Payload |
|--------|---------|
| `collapseToggle` | `void` |
| `sizeToggle` | `ModuleHeaderSize` |
| `remove` | `void` |
| `fullscreenToggle` | `void` |

### 2.2 Content projection slot (new)

| Selector | Required | Placement | Notes |
|----------|----------|-----------|-------|
| `[cbaModuleDragHandle]` | No | First child of the actions `<nav>` | Attribute marker only; no directive required |

The library renders **nothing** when the slot is empty. The Shell owns the projected element, the CDK wiring, and any accessible name.

## 3. Template diff

**File:** `src/components/module-header/module-header.component.html`

### Current state (lines 3–19)

```html
  <nav class="cba-module-header__section cba-module-header__section--actions">
    <button type="button" class="cba-module-header__action cba-module-header__action--drag" [attr.aria-label]="aria.drag" [title]="aria.drag">
      <fa-icon [icon]="faDrag" aria-hidden="true" />
    </button>
    <button type="button" class="cba-module-header__action" ...collapse...>
      ...
    </button>
    ...
  </nav>
```

### Target state

Remove the hardcoded drag `<button>` and replace it with the optional projection slot **before** the built-in action buttons. The slot must live inside the `@else` branch of `isFullscreen()` so it is removed from the DOM in fullscreen mode.

```html
@if (isFullscreen()) {
  <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">
    {{ title() }}
  </div>
} @else {
  <div class="cba-module-header__section cba-module-header__section--status" [class]="statusClass() ?? ''">
    @if (statusVisual(); as visual) {
      <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true" />
    }
  </div>
  <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">
    {{ title() }}
  </div>
  <nav class="cba-module-header__section cba-module-header__section--actions">
    <ng-content select="[cbaModuleDragHandle]"></ng-content>
    <button type="button" class="cba-module-header__action" ...collapse...>
      ...
    </button>
    ...
  </nav>
}
```

### Template rules

1. The `<ng-content select="[cbaModuleDragHandle]">` element must be the **first child** of the actions `<nav>`.
2. It must appear **only** inside the `@else` block (non-fullscreen branch).
3. No default button, icon, or placeholder is rendered when the slot is empty.

## 4. Styling strategy

**File:** `src/components/module-header/module-header.component.scss`

No new wrapper element is required around the slot. `ng-content` renders nothing when no matching content is projected, and the existing `gap: var(--cba-space-1)` on `.cba-module-header__section--actions` naturally handles spacing between action buttons.

### Keep

- `.cba-module-header__action` — base action button sizing / hover / focus styles.
- `.cba-module-header__action--drag` — keep the `cursor: grab` / `cursor: grabbing` modifier available for consumer-projected drag handles.
- `.cba-module-header__section--actions` — keep `gap: var(--cba-space-1)`.

### Do not add

- No `::ng-deep` piercing selector.
- No extra wrapper `<div>` solely for flex alignment (the `<nav>` already is a flex container).
- No CDK-related class references.

### Consumer styling contract

The Shell projects a native `<button>` (or equivalent focusable element) with:

```html
<button
  type="button"
  cbaModuleDragHandle
  cdkDragHandle
  class="cba-module-header__action cba-module-header__action--drag"
  aria-label="Arrastrar módulo">
  <!-- Shell-provided icon, e.g. Font Awesome grip -->
</button>
```

By applying `class="cba-module-header__action cba-module-header__action--drag"`, the handle inherits the library's 32 × 32 px hit target, transparent background, hover/active states, focus ring, and grab cursor without any ViewEncapsulation piercing.

## 5. TypeScript cleanup

**File:** `src/components/module-header/module-header.component.ts`

### Remove

1. Import of `faUpDownLeftRight` from `@fortawesome/free-solid-svg-icons`.
2. The `faDrag` property declaration:

```ts
/** Drag handle icon (visual only; drag is owned by the Shell). Template-referenced. */
protected readonly faDrag = faUpDownLeftRight;
```

### Keep unchanged

- All other icon properties, inputs, outputs, and computed signals.
- JSDoc intro comment; optionally update the sentence about drag-and-drop ownership to say the Shell projects the handle instead of the library rendering a visual-only icon. The existing note that drag-and-drop is owned by the Shell remains accurate.

## 6. i18n cleanup

**File:** `src/i18n/ui-messages.ts`

Remove the `drag` key from `CBA_UI_MESSAGES.moduleHeader.aria`:

```ts
moduleHeader: {
  aria: {
    collapse: { expand: 'Expandir módulo', collapse: 'Colapsar módulo' },
    size: { shrink: 'Reducir módulo a 50%', expand: 'Expandir módulo a 100%' },
    remove: 'Quitar módulo',
    fullscreen: 'Pantalla completa',
  },
},
```

Spanish copy rules for library-owned strings are unchanged. The accessible name of the projected handle is the consumer's responsibility.

## 7. Unit-test plan

**File:** `src/components/module-header/module-header.component.spec.ts`

Add exactly three focused tests. No CDK import or drag behaviour testing.

### 7.1 Empty slot preserves layout

When `cbaModuleDragHandle` content is **not** projected, the actions `<nav>` still renders the four built-in action buttons exactly as before.

- Arrange: create the component with default inputs.
- Act: detect changes.
- Assert: `querySelectorAll('nav button')` has length `4`; existing action cases still pass.

### 7.2 Projected handle appears in actions

When a projected element with `cbaModuleDragHandle` is provided, it appears inside the actions `<nav>` **before** the built-in buttons.

Implementation approach in test: use a test host component that renders `ModuleHeaderComponent` in its template and projects a `<button cbaModuleDragHandle>`. Assert the handle is present in `nav` and precedes the collapse button.

```ts
@Component({
  standalone: true,
  imports: [ModuleHeaderComponent],
  template: `
    <cba-module-header title="Host Module">
      <button type="button" cbaModuleDragHandle class="cba-module-header__action cba-module-header__action--drag" aria-label="Arrastrar módulo"></button>
    </cba-module-header>
  `,
})
class TestHostComponent {}
```

- Arrange: configure testing module with `TestHostComponent` and `ModuleHeaderComponent`.
- Act: create host fixture, detect changes.
- Assert: the drag handle button is inside `nav`; `nav.querySelectorAll('button')` length is `5`; the drag handle is the first `button` child.

### 7.3 Fullscreen hides the slot

When `isFullscreen` is `true`, the projected drag handle is **not** rendered (same rule as other actions).

- Arrange: use the test host component and set `isFullscreen` to `true`.
- Act: detect changes.
- Assert: `querySelector('nav')` is `null`; the drag handle is not in the DOM.

### Existing tests

Keep all existing tests, but update assertions if the existing test count assumed the hardcoded drag button. In particular, the existing action-case table currently contains four actions (collapse, size toggle at 100%, remove, fullscreen) and should remain four; no drag case is added.

## 8. Documentation changes

### 8.1 `docs/MODULE_HEADER.md`

Update the following sections:

1. **Table of Contents** — replace `Drag note` with `Drag handle slot` (or add it).
2. **Icon order** — remove the "Drag handle" row from the fixed built-in order table. The new order is collapse → size toggle → fullscreen → remove. Add a note that a projected drag handle, when used, is rendered **before** the built-in actions and is not part of the library's fixed set.
3. **Drag handle slot** (new section) — describe:
   - Attribute selector `[cbaModuleDragHandle]`.
   - Optional projection; no default handle.
   - Slot lives in the actions area, before built-in buttons.
   - Slot is hidden in fullscreen.
   - Library does **not** depend on `@angular/cdk`; Shell owns DnD.
   - Full Shell example with `cdkDrag` on the module wrapper and `cdkDragHandle` on the projected button.
   - Accessibility: Shell must provide `aria-label` (Spanish in product UI); library does not supply the accessible name.

Example to include:

```html
<div cdkDrag>
  <cba-module-container [size]="size">
    <cba-module-header
      [title]="title"
      [status]="status"
      [size]="size"
      [isCollapsed]="isCollapsed"
      [isFullscreen]="false"
      (collapseToggle)="..."
      (sizeToggle)="..."
      (remove)="..."
      (fullscreenToggle)="...">
      <button
        type="button"
        cbaModuleDragHandle
        cdkDragHandle
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo">
        <!-- Shell-provided icon -->
      </button>
    </cba-module-header>
  </cba-module-container>
</div>
```

4. **Accessibility** — update the drag handle note to state the projected handle's accessible name is provided by the Shell.

### 8.2 `docs/CONSUMER_GUIDE.md`

Add a short **ModuleHeader drag handle** subsection under the Shell checklist (or anti-patterns) that states:

- Shell can project `[cbaModuleDragHandle]` into `cba-module-header`.
- Apply `cdkDrag` on an ancestor the Shell controls and `cdkDragHandle` on the projected element.
- Use `class="cba-module-header__action cba-module-header__action--drag"` for consistent visuals.
- Anti-pattern: asking the UI library to implement drag behaviour or add `@angular/cdk` as a dependency.

### 8.3 `docs/USAGE.md`

In the `ModuleHeader` usage pattern section:

- Mention the optional `[cbaModuleDragHandle]` projection slot.
- Add a one-line link to `MODULE_HEADER.md` for the full Shell wiring example.
- Keep the basic example unchanged (without a drag handle) so the simplest usage remains simple.

## 9. Changelog entry

**File:** `CHANGELOG.md`

Add under the existing dated header:

```markdown
## [0.13.0] — 2026-08-09

### Added

- **ModuleHeader optional drag-handle projection slot** — consumers can project a `[cbaModuleDragHandle]` element into the header actions area. The library does not render a default handle when the slot is empty, and the slot is hidden in fullscreen mode along with other actions. Enables Shell-owned `@angular/cdk/drag-drop` integration without adding CDK as a library dependency. See `docs/MODULE_HEADER.md` §Drag handle slot.
```

No `[Unreleased]` section is introduced; the entry goes directly under `[0.13.0] — 2026-08-09` as required by `.kilo/rules/changelog-versioning.md`.

## 10. Acceptance criteria mapping

| # | Criterion | How the spec satisfies it |
|---|-----------|---------------------------|
| 1 | Optional `[cbaModuleDragHandle]` projection slot exists in actions area. | §2.2, §3, §7.2 |
| 2 | Empty slot does not break layout or add a default handle. | §3, §4, §7.1 |
| 3 | Slot is omitted in fullscreen (title-only) mode. | §3, §7.3 |
| 4 | No CDK dependency added to the library. | §1, §8.1, §8.2 |
| 5 | No drag outputs added on `ModuleHeader`. | §2.1 |
| 6 | Docs include Shell wiring example and ownership note. | §8.1, §8.2 |
| 7 | Minimal unit tests for projection present / absent / fullscreen. | §7 |
| 8 | Library build succeeds. | §1 (`npm run build`) |

## 11. Out of scope

- Implementing drag-and-drop inside `@cobranza-apps/ui`.
- Adding `@angular/cdk` as a peer dependency.
- Adding generic header action slots.
- Changing `ModuleContainer` API.
- Shell repo implementation (only documented contract).

## 12. Verification checklist for later 4.5a

- [ ] `npm run build` passes.
- [ ] `npm test` passes (including the 3 new tests).
- [ ] `npm run lint` passes.
- [ ] Template contains `<ng-content select="[cbaModuleDragHandle]"></ng-content>` inside the actions `<nav>` and only inside the `@else` branch.
- [ ] Hardcoded drag `<button>` and `faDrag` property are removed.
- [ ] `drag` key is removed from `CBA_UI_MESSAGES.moduleHeader.aria`.
- [ ] Docs updated in `docs/MODULE_HEADER.md`, `docs/CONSUMER_GUIDE.md`, and `docs/USAGE.md`.
- [ ] Changelog entry added under `[0.13.0] — 2026-08-09`.
