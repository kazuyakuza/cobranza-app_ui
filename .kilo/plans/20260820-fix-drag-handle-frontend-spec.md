# Front-end Technical Specification — Fix ModuleHeader built-in drag handle

**Scope:** Remove the incorrectly re-added built-in drag button from the library `ModuleHeader` component, keep the optional `[cbaModuleDragHandle]` projection slot, and make the demo project its own drag handle. Update tests, docs, and changelog accordingly.

**Target framework:** Angular 22 standalone components, TypeScript ~6.0.3, Font Awesome via `@fortawesome/angular-fontawesome`.

**Affected files:**

- `src/components/module-header/module-header.component.html`
- `src/components/module-header/module-header.component.ts`
- `src/components/module-header/module-header.component.spec.ts`
- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
- `docs/CBA_MODULE_HEADER.md`
- `package.json` (verify version)
- `CHANGELOG.md`

## 1. Component changes

### 1.1 `ModuleHeaderComponent` template

Remove the hardcoded no-op drag `<button>` that appears immediately after the `<ng-content select="[cbaModuleDragHandle]">` slot. Keep the projection slot exactly as it is.

**Current markup to delete (lines 24–30 of `module-header.component.html`):**

```html
      <button
        type="button"
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo"
        title="Arrastrar módulo">
        <fa-icon [icon]="faDrag" aria-hidden="true" />
      </button>
```

**Resulting actions nav must contain only:**

1. `<ng-content select="[cbaModuleDragHandle]"></ng-content>`
2. Collapse / expand button
3. Size-toggle button
4. Fullscreen button
5. Remove button

No other markup changes are allowed.

### 1.2 `ModuleHeaderComponent` TypeScript

Remove the `faUpDownLeftRight` import from `@fortawesome/free-solid-svg-icons` and remove the `faDrag` property from `ModuleHeaderComponent`.

**Current import block (lines 10–24):**

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

**Required change:** Delete `faUpDownLeftRight,` (line 21). All other imports remain.

**Current property (line 165):**

```ts
  protected readonly faDrag = faUpDownLeftRight;
```

**Required change:** Delete this line.

The JSDoc already documents the slot-based drag-handle contract and does not need modification. The component must continue to export the same public API (`title`, `size`, `isCollapsed`, `isFullscreen`, `status`, and the four outputs).

### 1.3 `ModuleHeaderComponent` SCSS

No changes. Keep `.cba-module-header__action--drag` so any consumer-projected drag handle can still reuse the library's grab/grabbing cursor and 32 × 32 px hit target.

## 2. Demo changes

### 2.1 `DemoModuleCardComponent`

Project a drag-handle button inside `<cba-module-header>` so the demo continues to show a drag handle. The library no longer renders one by default.

**Required imports (add to existing `@cobranza-apps/ui` imports):**

```ts
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
```

**Required `imports` array change:**

```ts
imports: [
  ModuleContainerComponent,
  ModuleHeaderComponent,
  CbaModuleFooterComponent,
  FaIconComponent,
],
```

**Template change:** Convert the self-closing `<cba-module-header ... />` into a paired tag and project the drag handle as its first child. The drag handle must appear exactly where the slot is rendered (first child of the actions nav).

```html
        <cba-module-header
          cbaModuleContainerHeader
          [title]="title"
          [size]="size"
          [isCollapsed]="isCollapsed"
          [isFullscreen]="false"
          [status]="status"
          (collapseToggle)="noop()"
          (sizeToggle)="noop()"
          (fullscreenToggle)="noop()"
          (remove)="noop()">
          <button
            type="button"
            cbaModuleDragHandle
            class="cba-module-header__action cba-module-header__action--drag"
            aria-label="Arrastrar módulo">
            <fa-icon [icon]="faUpDownLeftRight" aria-hidden="true" />
          </button>
        </cba-module-header>
```

Add a `protected readonly faUpDownLeftRight = faUpDownLeftRight;` field to `DemoModuleCardComponent` so the template binding resolves.

No other demo functionality changes.

## 3. Test changes

### 3.1 `module-header.component.spec.ts`

Update the two count assertions to reflect the removal of the built-in drag button.

**Current test at lines 112–116:**

```ts
  it('renders the five built-in action buttons when no drag handle is projected (empty slot)', () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(5);
  });
```

**Required change:** Rename to `renders the four built-in action buttons when no drag handle is projected (empty slot)` and expect `4`.

**Current test at lines 133–144:**

```ts
  it('projects the drag handle into the actions nav before the built-in buttons', () => {
    const hostFixture = setupHost();

    const nav = hostFixture.nativeElement.querySelector('nav');
    const navButtons = nav.querySelectorAll('button');
    const dragHandle = nav.querySelector('button[aria-label="Arrastrar módulo"]');

    expect(nav).not.toBeNull();
    expect(dragHandle).not.toBeNull();
    expect(navButtons).toHaveLength(6);
    expect(navButtons[0]).toBe(dragHandle);
  });
```

**Required change:** Expect `5` total buttons (1 projected drag handle + 4 built-in action buttons). Keep the assertion that `navButtons[0]` is the projected drag handle.

The `ACTION_CASES` table and the `it.each` emission tests remain unchanged (four built-in outputs: collapse, size, remove, fullscreen).

## 4. Documentation changes

### 4.1 `docs/CBA_MODULE_HEADER.md`

**Icon order table (currently positions 0–5):** Replace with a table that lists only the four built-in actions and shows the optional projected drag handle before them.

```markdown
| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 0 (optional, projected) | Drag handle (Shell-owned) | Shell-provided | — |
| 0 / 1 | Collapse / expand | `chevron-up` / `chevron-down` | `collapseToggle` |
| 1 / 2 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` / `arrows-left-right` | `sizeToggle` |
| 2 / 3 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 3 / 4 | Remove | `xmark` | `remove` |
```

> The dual position notation means: when a drag handle is projected it occupies position 0 and the built-ins shift right; otherwise the built-ins start at position 0.

Remove the old note block that says “position 1 is always rendered as a no-op drag affordance.” Replace it with:

```markdown
> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered before the
> built-in action buttons. The library renders nothing at that position when the
> slot is empty; only the four built-in action buttons are shown.
```

**Drag handle slot section:** Update the bullet list so it no longer says the built-in no-op drag button is always rendered. Required wording:

```markdown
- The projected element is rendered **before** the built-in action buttons.
- The slot is hidden in fullscreen mode (title-only), exactly like the other actions.
- When nothing is projected, no empty gap is left; only the four built-in action buttons are rendered.
- Apply `class="cba-module-header__action cba-module-header__action--drag"` on the
  projected element to inherit the library's 32 × 32 px hit target, hover/active
  states, focus ring, and `grab`/`grabbing` cursor without any `::ng-deep` piercing.
```

No other sections change.

## 5. Version and changelog

### 5.1 `package.json`

Verify the version is `0.18.6`. If it is still `0.18.5`, bump it to `0.18.6`.

### 5.2 `CHANGELOG.md`

Add a new dated header directly under `# Changelog`, immediately before the existing `## [0.18.5] — 2026-08-20` section:

```markdown
## [0.18.6] — 2026-08-20

### Fixed

- Removed the incorrectly re-added built-in drag button from `ModuleHeader`. The library no longer renders a drag handle by default; consumers must project one via the `[cbaModuleDragHandle]` slot. See `docs/CBA_MODULE_HEADER.md` §Drag handle slot.
- Updated the Angular demo app (`projects/demo/`) to project its own drag handle (`faUpDownLeftRight`) inside `<cba-module-header>` so the visual reference continues to show the handle.
```

No `[Unreleased]` section is allowed per `.kilo/rules/changelog-versioning.md`.

## 6. Accessibility

- The library must not render an unowned drag button with a hardcoded `aria-label`.
- Any projected drag handle must provide its own accessible name (e.g. `aria-label="Arrastrar módulo"`). The library does not supply the accessible name for projected content.
- The four remaining built-in action buttons keep their dynamic `aria-label` + `title` attributes.
- Keyboard operability and `:focus-visible` focus rings remain unchanged.

## 7. Acceptance criteria

- [ ] `module-header.component.html` contains no built-in drag `<button>` and still contains `<ng-content select="[cbaModuleDragHandle]"></ng-content>`.
- [ ] `module-header.component.ts` no longer imports `faUpDownLeftRight` and no longer declares `faDrag`.
- [ ] `module-header.component.spec.ts` expects 4 built-in buttons when the slot is empty and 5 total buttons when a drag handle is projected.
- [ ] `demo-module-card.component.ts` imports `FaIconComponent` and `faUpDownLeftRight`, adds `FaIconComponent` to `imports`, and projects a `<button cbaModuleDragHandle>` with the `faUpDownLeftRight` icon.
- [ ] `docs/CBA_MODULE_HEADER.md` Icon order table and Drag handle slot description no longer refer to a built-in no-op drag button and describe the slot as the only source of a drag handle.
- [ ] `CHANGELOG.md` contains `## [0.18.6] — 2026-08-20` with a `Fixed` entry describing the removal and demo update.
- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

## 8. Out of scope

- No changes to `CBA_UI_MESSAGES` (the `drag` key was already removed in v0.13.0).
- No changes to `module-header.component.scss`.
- No changes to component inputs, outputs, or public API.
- No new dependencies.
- No routing or state-management changes.
