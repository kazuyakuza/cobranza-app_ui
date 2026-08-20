# Front-end Technical Specification — Task Group A (Demo Bug Fixes)

**Date:** 2026-08-20  
**Plan file:** `.kilo/plans/20260820-fix-demo-bugs-taskA-frontend-spec.md`  
**Scope:** Bugs 1–4 in TODO Task Group A  
**Target framework:** Angular 17+ standalone components, SCSS, Font Awesome (`@fortawesome/angular-fontawesome`).

---

## 1. Goal

Fix four layout/projection bugs in the module shell components and their demo usage so that:

1. `ModuleContainerComponent` exposes a dedicated footer projection slot and renders it inside the expanded body region.
2. The module header drag icon is visible and not suppressed by CSS.
3. The module footer status text+icon group aligns to the right edge.
4. A single 50% module row renders with equal widths for the module and the empty placeholder cell.

---

## 2. Current state

### 2.1 `ModuleContainerComponent`

- **Template (`src/components/module-container/module-container.component.html`):**
  ```html
  <div class="cba-module-container__header">
    <ng-content select="[cbaModuleContainerHeader]"></ng-content>
  </div>

  @if (!isCollapsed()) {
    <div class="cba-module-container__body">
      <ng-content></ng-content>
    </div>
  }
  ```
- **SCSS (`src/components/module-container/module-container.component.scss`):** styles `:host`, size/fullscreen/padding modifiers, `__header`, and `__body`. No `__footer` region exists.
- **TS (`src/components/module-container/module-container.component.ts`):** reflects inputs as host classes; no changes required for this bug group.
- **Docs (`docs/CBA_MODULE_CONTAINER.md`):** documents Header + Body projection slots only.

### 2.2 `DemoModuleCardComponent`

- (`projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`) currently projects `cba-module-footer` as default content inside `cba-module-container`:
  ```html
  <ng-content />
  @if (hasFooter) {
    <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
  }
  ```
- The footer is placed **after** the default `<ng-content />` but before `</cba-module-container>`, so it is currently caught by the body slot. It should use the new `[cbaModuleContainerFooter]` selector.

### 2.3 `ModuleHeaderComponent` drag icon

- `faUpDownLeftRight` is already imported (line 21 of `module-header.component.ts`) and assigned to `protected readonly faDrag`.
- Template renders the drag button unconditionally inside the actions nav:
  ```html
  <button ... class="cba-module-header__action cba-module-header__action--drag">
    <fa-icon [icon]="faDrag" aria-hidden="true" />
  </button>
  ```
- SCSS has `.cba-module-header__action--drag` rules for cursor only; no `display: none` or `visibility: hidden`.

### 2.4 `CbaModuleFooterComponent` status alignment

- (`src/components/module-footer/module-footer.component.scss`) `.cba-module-footer__status` uses `display: inline-flex; align-items: center;` but no horizontal justification, so the status group sits at the start edge of the footer.

### 2.5 `DemoWorkspaceComponent` 50% single row

- (`projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`) `.workspace__row--single-50` uses `grid-template-columns: 50% 1fr;`, making the empty cell fill the remaining space instead of matching the module width.

---

## 3. Detailed specification per bug

### Bug 1 — Module container footer slot

#### 3.1.1 DOM / projection contract

Add a third named projection slot to `ModuleContainerComponent`:

| Slot | Selector | Purpose | Render condition |
|------|----------|---------|------------------|
| Footer | `[cbaModuleContainerFooter]` attribute | Projects an optional footer band (typically `<cba-module-footer>`) below the body. | Only while `isCollapsed() === false`, i.e. inside the existing `@if (!isCollapsed())` block. |

#### 3.1.2 Required template change

`src/components/module-container/module-container.component.html` must become:

```html
<div class="cba-module-container__header">
  <ng-content select="[cbaModuleContainerHeader]"></ng-content>
</div>

@if (!isCollapsed()) {
  <div class="cba-module-container__body">
    <ng-content></ng-content>
  </div>

  <div class="cba-module-container__footer">
    <ng-content select="[cbaModuleContainerFooter]"></ng-content>
  </div>
}
```

Rules:

- The footer `<div>` must be a sibling of `.cba-module-container__body`.
- The footer `<div>` must remain inside the same `@if (!isCollapsed())` block as the body.
- The footer slot must use `<ng-content select="[cbaModuleContainerFooter]">`.
- The footer wrapper must always render when expanded, even if the projected content is empty.

#### 3.1.3 Required SCSS change

In `src/components/module-container/module-container.component.scss`, add a footer band style block after `.cba-module-container__body`:

```scss
.cba-module-container__footer {
  flex: 0 0 auto;
  min-width: 0;
  border-top: 1px solid var(--cba-border-default);
  background-color: var(--cba-bg-tertiary);
}
```

Token rationale:

- `--cba-bg-tertiary` matches the existing `CbaModuleFooterComponent` background, so adjacent colors are identical.
- `--cba-border-default` matches the existing module frame separator and provides the top edge line.
- `flex: 0 0 auto` keeps the footer from growing/shrinking (same treatment as `__header`).
- `min-width: 0` prevents flex overflow.

#### 3.1.4 Accessibility

- The container itself still introduces no interactive controls.
- `cba-module-footer` already exposes `role="status"`, `aria-live="polite"`, `aria-atomic="true"`; keep that as-is.
- `prefers-reduced-motion` rules in the body and footer remain unchanged.

#### 3.1.5 Docs update

Update `docs/CBA_MODULE_CONTAINER.md`:

- In the **Content projection** table, add a third row for Footer.
- In the **Basic usage** example, add `<cba-module-footer cbaModuleContainerFooter>` below the MFE body.
- In **Collapsed behaviour**, note that the footer slot is also removed when collapsed.

#### 3.1.6 Demo usage update

In `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`:

- Remove `cba-module-footer` from the default body content.
- Add `cbaModuleContainerFooter` attribute to the footer element.
- Keep the `@if (hasFooter)` guard.
- Keep all inputs (`status`, `statusText`) and bindings unchanged.

Expected resulting template:

```html
<cba-module-container [size]="size" [padding]="padding" [isCollapsed]="isCollapsed">
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
    (remove)="noop()"
  />
  <ng-content />
  @if (hasFooter) {
    <cba-module-footer
      cbaModuleContainerFooter
      [status]="footerStatus"
      [statusText]="footerText" />
  }
</cba-module-container>
```

---

### Bug 2 — Module header drag icon

#### 3.2.1 Import verification

Confirm in `src/components/module-header/module-header.component.ts`:

- `faUpDownLeftRight` is imported from `@fortawesome/free-solid-svg-icons`.
- `protected readonly faDrag = faUpDownLeftRight;` exists.

Current file already satisfies this. No TS change required unless a regression is found.

#### 3.2.2 Template verification

Confirm in `src/components/module-header/module-header.component.html`:

- The drag button is rendered unconditionally inside `@if (!isFullscreen())`.
- `<fa-icon [icon]="faDrag" aria-hidden="true" />` is present.

Current file already satisfies this. No template change required unless a regression is found.

#### 3.2.3 CSS verification

Confirm in `src/components/module-header/module-header.component.scss`:

- `.cba-module-header__action--drag` does **not** set `display: none`, `visibility: hidden`, `opacity: 0`, or `width: 0`.
- Current file only sets `cursor: grab` / `:active { cursor: grabbing; }`. No hiding rule exists.

No SCSS change required unless a regression is found.

#### 3.2.4 Debug / build-output step

If the icon is still missing at runtime:

1. Run the library build and inspect the generated chunk for `faUpDownLeftRight` / `faDrag` references.
2. Check the browser DevTools Elements panel:
   - `<button class="...cba-module-header__action--drag">` must be in the DOM.
   - Inside it, `<svg>` must exist. If the `<fa-icon>` tag is empty, the icon reference was tree-shaken or the library chunk is stale.
3. If the `<button>` is present but the SVG is missing, run a clean build (`ng build ui` and `ng build demo`) and re-test.
4. If the issue persists, verify that `module-header.component.ts` imports the icon explicitly (not via re-export) and that `FaIconComponent` is imported.

---

### Bug 3 — Module footer status alignment

#### 3.3.1 Required SCSS change

In `src/components/module-footer/module-footer.component.scss`, add `justify-content: flex-end;` to `.cba-module-footer__status`:

```scss
.cba-module-footer__status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--cba-space-2);
  font-size: var(--cba-font-size-body);
  line-height: var(--cba-line-height-body);
}
```

Rules:

- Only add `justify-content: flex-end` to `.cba-module-footer__status`.
- Do not change the parent `.cba-module-footer` `justify-content: flex-end` rule; it already aligns the whole status group to the right of the footer.
- The `gap` between text and icon must remain `var(--cba-space-2)`.

#### 3.3.2 Rationale

`.cba-module-footer` is a flex container with `justify-content: flex-end`, which places the status group at the right edge of the footer. Inside the group, `.cba-module-footer__status` is also a flex container but previously had no justification, so text+icon hugged the left side of that group. The new rule aligns the inner items to the right edge of the group, producing a clean right-edge status presentation.

---

### Bug 4 — 50% single module / empty space parity

#### 3.4.1 Required SCSS change

In `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`, change:

```scss
.workspace__row--single-50 {
  grid-template-columns: 50% 1fr;
}
```

to:

```scss
.workspace__row--single-50 {
  grid-template-columns: repeat(2, 1fr);
}
```

#### 3.4.2 Rationale

The workspace row is a two-column grid. When a single 50% module sits in one column and the other column is empty, `50% 1fr` makes the empty column occupy the remaining 50%, but the module cell is explicitly 50% while the empty cell flexes — this can create sub-pixel parity issues when gap/padding is present and does not semantically express "two equal columns". Using `repeat(2, 1fr)` makes both implicit columns equal, so the module (which itself is 50% width inside its cell) and the empty placeholder are visually balanced.

No HTML change is required; the class is already applied in `demo-workspace.component.html`.

---

## 4. Files to modify

| File | Change |
|------|--------|
| `src/components/module-container/module-container.component.html` | Add `__footer` wrapper + `[cbaModuleContainerFooter]` slot inside `@if (!isCollapsed())`. |
| `src/components/module-container/module-container.component.scss` | Add `.cba-module-container__footer` block with theme tokens. |
| `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` | Move `cba-module-footer` to the `[cbaModuleContainerFooter]` slot. |
| `docs/CBA_MODULE_CONTAINER.md` | Document the new Footer slot and update examples. |
| `src/components/module-footer/module-footer.component.scss` | Add `justify-content: flex-end` to `.cba-module-footer__status`. |
| `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss` | Change `grid-template-columns` for `.workspace__row--single-50`. |
| `src/components/module-header/module-header.component.ts` | Verify `faUpDownLeftRight` import; no expected change. |
| `src/components/module-header/module-header.component.scss` | Verify no hiding rule; no expected change. |

---

## 5. Files to read-only verify

- `src/components/module-header/module-header.component.html` — confirm drag button template.
- `src/components/module-footer/module-footer.component.html` — confirm status region markup.
- `src/theme/_variables.scss` — confirm token names.

---

## 6. Acceptance criteria

1. `cba-module-container` renders a `.cba-module-container__footer` band only when expanded.
2. The footer slot projects content carrying `[cbaModuleContainerFooter]`; unslotted footer content no longer appears in the body.
3. `demo-module-card` uses `cbaModuleContainerFooter` on its `cba-module-footer`.
4. `docs/CBA_MODULE_CONTAINER.md` lists the Footer slot and includes a footer in the basic usage example.
5. The module header drag icon is visible in the demo and renders an SVG inside the drag button.
6. `.cba-module-footer__status` has `justify-content: flex-end` and the status text+icon sit at the right edge of the footer band.
7. `.workspace__row--single-50` uses `grid-template-columns: repeat(2, 1fr);` and the module cell + empty cell have equal widths.
8. Library build and demo build complete without errors.
9. No `[Unreleased]` section is introduced in `CHANGELOG.md`; a dated version entry is used per project rule.

---

## 7. Notes for the implementer

- Do not introduce new inputs, outputs, or TypeScript logic in `ModuleContainerComponent`.
- Do not modify unrelated component files (e.g., `ModuleHeaderComponent` beyond verification, `CbaModuleFooterComponent` TS/template).
- Use only existing `--cba-*` tokens; do not hard-code colors or dimensions.
- Keep the footer wrapper present even when empty; Angular `<ng-content>` will leave it blank if no matching content is projected.
- Follow the existing BEM naming and comment style in the SCSS files.
