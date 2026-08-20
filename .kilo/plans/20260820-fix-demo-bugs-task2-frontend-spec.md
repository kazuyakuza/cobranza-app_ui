# Front-end Technical Specification — Demo Header Search Input Centering

## Scope

Center the header search input inside the demo app shell header bar while keeping its current width behavior.

- **TODO reference**: `.agent/todos/20260819/20260819-todo-1.md` — *header search input*
- **Affected files**:
  - `projects/demo/src/app/app.component.scss`
  - `projects/demo/src/app/app.component.html` (no markup change required)

## Target Framework

- Angular 22 standalone demo app (`projects/demo/`)
- SCSS with existing `--cba-*` design tokens

## Root Cause

`.shell-header` uses `justify-content: space-between` and `.shell-header__center` uses `margin: 0 auto` on a `flex: 0 0 50%` item.

`auto` margins on a flex item center that item inside the **remaining free space**, not inside the full header viewport. Because the left group (`Back` + brand text) is wider than the right group (two icon-only buttons), the search container is visually shifted to the right of the true center.

To align the search input with the geometric center of the header, the left and right groups must act as equal-width gutters.

## Approach

Use **flexbox with equal side gutters**:

- Remove `justify-content: space-between` from `.shell-header`.
- Make `.shell-header__left` and `.shell-header__right` equal-width flex items (`flex: 1 1 0; min-width: 0;`).
- Keep left content left-aligned and right content right-aligned with `justify-content`.
- Keep `.shell-header__center` as a non-growing, shrinkable item capped at the existing `$search-max-width` (600 px) and `width: 50%`.
- Remove `margin: 0 auto` from the center column; centering is now produced by the equal-width side groups.

No grid, absolute positioning, or transform is needed.

## Exact Changes

### `projects/demo/src/app/app.component.scss`

Update only the `.shell-header` and its three child blocks. Leave all other demo styles untouched.

```scss
.shell-header {
  height: $header-height;
  display: flex;
  align-items: center;
  padding: 0 var(--cba-space-3);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
}

.shell-header__left,
.shell-header__right {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
  flex: 1 1 0;
  min-width: 0;
}

.shell-header__left {
  justify-content: flex-start;
}

.shell-header__right {
  justify-content: flex-end;
}

.shell-header__center {
  flex: 0 1 $search-max-width;
  width: 50%;
  max-width: $search-max-width;
}

.shell-header__search {
  width: 100%;
}
```

Notes:
- `$header-height` and `$search-max-width` are the existing SCSS variables in the file.
- `--cba-space-3`, `--cba-bg-elevated`, and `--cba-border-default` are the existing theme tokens already in use.
- `cba-input` already renders its host as `display: block`, so `width: 100%` on `.shell-header__search` fills the center column.

### `projects/demo/src/app/app.component.html`

No changes required. The existing three-column markup (`shell-header__left`, `shell-header__center`, `shell-header__right`) remains valid.

## Responsive / Layout Behavior

- Desktop-only, per `brief.md` §2.2 / §3.
- At viewports where `50%` is narrower than 600 px, the search input shrinks proportionally.
- At wider viewports, the input caps at 600 px and stays centered because the left/right gutters grow equally.
- Left and right groups remain at the far edges; their content does not wrap because the brand text is short and the buttons are icon-only.

## Accessibility

No markup or ARIA changes. The existing `aria-label="Search"` on `<cba-input>` is preserved.

## Acceptance Criteria

- [ ] The visual center of the search input aligns with the geometric center of the header bar.
- [ ] The left group stays left and the right group stays right.
- [ ] Search input width is still 50% of the header, capped at 600 px.
- [ ] No new `--cba-*` tokens are introduced.
- [ ] No changes are made to `projects/demo/src/app/app.component.html`.
- [ ] `npm run lint` and `npm run build` remain passing.
