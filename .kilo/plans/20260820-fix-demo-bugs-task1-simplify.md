# Code Simplification Plan — Task 1: Module Layout Fixes

- **TODO**: `.agent/todos/20260819/20260819-todo-1.md`
- **Implementation plan**: `.kilo/plans/20260820-fix-demo-bugs-task1.md`
- **Scope**: Code simplification only. No behavior changes. No new features.

## Files reviewed

1. `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
2. `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`
3. `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`
4. `src/components/module-footer/module-footer.component.html`
5. `src/components/module-footer/module-footer.component.scss`
6. `src/components/module-header/module-header.component.ts`
7. `src/components/module-header/module-header.component.html`
8. `docs/CBA_MODULE_HEADER.md`

## Simplification items

### 1. `demo-module-card.component.ts` — Inline footer guard

**File**: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

**Issue**: `hasFooter` delegates to a one-line private method, creating unnecessary indirection.

**Current code (lines 69–75)**:

```ts
  protected get hasFooter(): boolean {
    return this.hasFooterContent();
  }

  private hasFooterContent(): boolean {
    return this.footerStatus !== null || this.footerText.length > 0;
  }
```

**Proposed change**:

```ts
  protected get hasFooter(): boolean {
    return this.footerStatus !== null || this.footerText.length > 0;
  }
```

**Rationale**: Removes one method and one call frame without changing the template or behavior.

**Verification**: `npm run lint` and `npm run build:demo` must pass. Footer visibility rules stay identical.

---

### 2. `demo-module-card.component.scss` — Remove redundant class from selector

**File**: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`

**Issue**: The selector repeats `.cba-module-container--size-50` even though `.demo-module-card--size-50` already implies the 50% context and `cba-module-container` is the only direct child.

**Current code (lines 10–12)**:

```scss
.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50 {
  width: 100%;
}
```

**Proposed change**:

```scss
.demo-module-card--size-50 > cba-module-container {
  width: 100%;
}
```

**Rationale**: Lower specificity, shorter selector, same match because the wrapper class encodes the size state and the container is the sole direct child.

**Verification**: Visual check that 50% modules still fill their grid cell; `npm run build:demo` passes.

---

### 3. `module-header.component.html` — Restructure to avoid duplicated title markup

**File**: `src/components/module-header/module-header.component.html`

**Issues**:
- Line 1 is a single very long line containing the `<header>` open tag, the fullscreen branch, and the `@else` branch start.
- The title `<div>` is duplicated in both `@if (isFullscreen())` and `@else` branches.
- Action button attributes are inline and hard to scan.

**Proposed change**: Replace the entire file with the following structure. The title is rendered once; status and actions are rendered only when not fullscreen.

```html
<header class="cba-module-header">
  @if (!isFullscreen()) {
    <div
      class="cba-module-header__section cba-module-header__section--status"
      [class]="statusClass() ?? ''">
      @if (statusVisual(); as visual) {
        <fa-icon
          [icon]="visual.icon"
          [animation]="visual.animation"
          aria-hidden="true" />
      }
    </div>
  }

  <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">
    {{ title() }}
  </div>

  @if (!isFullscreen()) {
    <nav class="cba-module-header__section cba-module-header__section--actions">
      <!-- Optional drag-handle projection slot. Shell projects a [cbaModuleDragHandle] element here (e.g. cdkDragHandle). Hidden in fullscreen mode. -->
      <ng-content select="[cbaModuleDragHandle]"></ng-content>

      <button
        type="button"
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo"
        title="Arrastrar módulo">
        <fa-icon [icon]="faDrag" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="collapseLabel()"
        [title]="collapseLabel()"
        (click)="collapseToggle.emit()">
        <fa-icon [icon]="collapseIcon()" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="sizeToggleLabel()"
        [title]="sizeToggleLabel()"
        (click)="sizeToggle.emit(sizeToggleTarget())">
        <fa-icon [icon]="sizeToggleIcon()" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="aria.fullscreen"
        [title]="aria.fullscreen"
        (click)="fullscreenToggle.emit()">
        <fa-icon [icon]="faFullscreen" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="aria.remove"
        [title]="aria.remove"
        (click)="remove.emit()">
        <fa-icon [icon]="faXmark" aria-hidden="true" />
      </button>
    </nav>
  }
</header>
```

**Rationale**:
- Eliminates duplicate title markup.
- Keeps the visual order (status | title | actions) unchanged.
- Splits long lines and attributes for readability without adding new imports or templates.
- No behavior change: fullscreen still renders only the title; normal mode renders status, title, and actions in the same order.

**Verification**: `npm run lint`, `npm run build:lib`, and `npm run build:demo` must pass. Manual visual check confirms drag/collapse/size/fullscreen/remove buttons remain in the same order.

---

### 4. `module-header.component.ts` — Remove unused icon fields and consolidate comments

**File**: `src/components/module-header/module-header.component.ts`

**Issues**:
- `faChevronUp` and `faChevronDown` protected fields are never referenced by the template; `collapseIcon()` already imports and uses the constants directly.
- `faShrink` and `faGrow` are only used inside `sizeToggleIcon()` and can be replaced by the imported constants directly.
- Per-field JSDoc comments for icon constants are repetitive.

**Proposed changes**:

#### 4a. Remove unused `faChevronUp` / `faChevronDown` fields

**Current code (lines 162–166)**:

```ts
  /** Icon for the collapse button (visible when `isCollapsed === false`). Template-referenced. */
  protected readonly faChevronUp = faChevronUp;

  /** Icon for the expand button (visible when `isCollapsed === true`). Template-referenced. */
  protected readonly faChevronDown = faChevronDown;
```

**Proposed change**: Delete these two fields and their JSDoc comments.

#### 4b. Inline `faShrink` / `faGrow` into `sizeToggleIcon()` and remove fields

**Current code (lines 171–175)**:

```ts
  /** Icon for the size-toggle button when current size is `100%` (action: shrink to 50%). Template-referenced. */
  protected readonly faShrink = faArrowsLeftRightToLine;

  /** Icon for the size-toggle button when current size is `50%` (action: expand to 100%). Template-referenced. */
  protected readonly faGrow = faArrowsLeftRight;
```

**Proposed change**: Delete these two fields.

Then update `sizeToggleIcon()` (current lines 205–208):

```ts
  /** Icon for the size-toggle button, derived from the current size. */
  protected readonly sizeToggleIcon = computed<IconDefinition>(() =>
    this.isFullSize() ? faArrowsLeftRightToLine : faArrowsLeftRight,
  );
```

#### 4c. Consolidate remaining icon field comments

**Current code (lines 168–181 after 4a/4b deletions would have shifted, but conceptually)**:

```ts
  /** Fullscreen button icon. Template-referenced. */
  protected readonly faFullscreen = faWindowMaximize;

  /** Icon for the remove button (`fa-xmark`). Template-referenced. */
  protected readonly faXmark = faXmark;

  /** Drag-handle icon shown as the first built-in action (no-op in this library). Template-referenced. */
  protected readonly faDrag = faUpDownLeftRight;
```

**Proposed change**:

```ts
  /** Icons referenced directly by the header template. */
  protected readonly faFullscreen = faWindowMaximize;
  protected readonly faXmark = faXmark;
  protected readonly faDrag = faUpDownLeftRight;
```

**Rationale**: Removes four unused/redundant class members, reduces public/protected surface, and reduces boilerplate comments. The computed properties remain the single source of truth for derived icons.

**Verification**: `npm run lint` and `npm run build:lib` must pass. Confirm no template references to removed fields remain.

---

## Out of scope / intentionally not simplified

The following files were reviewed and left unchanged because further simplification would add indirection, reduce clarity, or risk behavior change:

- `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss` — already minimal; grid rules are explicit and intentional.
- `src/components/module-footer/module-footer.component.html` — structure is already concise.
- `src/components/module-footer/module-footer.component.scss` — status color rules are already grouped where possible; a SCSS map would add abstraction without meaningful gain.
- `docs/CBA_MODULE_HEADER.md` — documentation should remain complete and explicit.

## Verification checklist

Before declaring simplification complete, the implementer must run:

1. `npm run lint`
2. `npm run build:lib`
3. `npm run build:demo`

All three commands must pass with no new errors.

## Summary of proposed changes

| File | Simplification |
| --- | --- |
| `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` | Inline `hasFooter` guard; remove `hasFooterContent()` helper. |
| `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss` | Drop redundant `.cba-module-container--size-50` class from selector. |
| `src/components/module-header/module-header.component.html` | Restructure template to render title once and split long lines. |
| `src/components/module-header/module-header.component.ts` | Remove unused icon fields; inline constants in `sizeToggleIcon()`; consolidate icon comments. |
