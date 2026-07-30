# Code Simplification Plan — ModuleHeader

**Scope**: review `src/lib/components/module-header/*` for readability and maintainability improvements while preserving the public API contract (inputs, outputs, and exported types).

**Finding**: the implementation is already concise. The simplification opportunities are minor and focused on reducing computed-signal boilerplate, removing trivial handlers, and tightening the SCSS selector list.

---

## 1. `src/lib/components/module-header/module-header.component.ts`

### Changes

1. **Remove trivial one-line click handlers.**
   - Delete `onCollapseClick`, `onSizeToggleClick`, `onRemoveClick`, and `onFullscreenClick`.
   - Emit directly from the template: `(click)="collapseToggle.emit()"`, `(click)="remove.emit()"`, `(click)="fullscreenToggle.emit()"`, and `(click)="sizeToggle.emit(size() === '100%' ? '50%' : '100%')"`.

2. **Remove single-use computed signals.**
   - Delete `targetSize` (only consumed by `onSizeToggleClick`).
   - Delete `collapseIcon`, `collapseLabel`, `sizeToggleIcon`, and `sizeToggleLabel`; inline the ternary expressions in the template. This moves presentation logic that is only used once out of the class.

3. **Simplify the status visual mapping.**
   - Drop `modifierClass` from the `StatusVisual` interface and from every `STATUS_VISUALS` entry; derive it from the status key (`cba-module-header__status--${status}`) in a dedicated `statusClass` computed.
   - Make `animation` optional in `StatusVisual` so non-loading entries no longer need an explicit `animation: undefined` property.

4. **Reduce public surface.**
   - Change `faRemoveIcon` and `faFullscreenIcon` from implicit `public` to `private readonly`. Angular templates can access private members of the component class, so these constants do not need to be public.

### Proposed component class (excerpt)

```ts
/** Visual configuration derived from a non-null status value. */
interface StatusVisual {
  readonly icon: IconDefinition;
  readonly animation?: 'spin';
}

/** Static status → visual mapping. `null` renders no icon. */
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin' },
  loaded: { icon: faCircleCheck },
  success: { icon: faCircleCheck },
  warning: { icon: faTriangleExclamation },
  error: { icon: faCircleXmark },
  dirty: { icon: faPen },
};

// ... component metadata unchanged ...

export class ModuleHeaderComponent {
  readonly title = input.required<string>();
  readonly size = input<ModuleHeaderSize>('100%');
  readonly isCollapsed = input<boolean>(false);
  readonly isFullscreen = input<boolean>(false);
  readonly status = input<ModuleHeaderStatus>(null);

  readonly collapseToggle = output<void>();
  readonly sizeToggle = output<ModuleHeaderSize>();
  readonly remove = output<void>();
  readonly fullscreenToggle = output<void>();

  /** Status visual config or `null` when no status is set (icon hidden). */
  readonly statusVisual = computed<StatusVisual | null>(() => {
    const current = this.status();
    return current === null ? null : STATUS_VISUALS[current] ?? null;
  });

  /** CSS modifier class for the status section, derived from the current status. */
  readonly statusClass = computed<string | null>(() => {
    const current = this.status();
    return current === null ? null : `cba-module-header__status--${current}`;
  });

  private readonly faRemoveIcon = faXmark;
  private readonly faFullscreenIcon = faUpRightAndDownLeftFromCenter;
}
```

**Expected result**: component TS drops from ~149 lines to ~110 lines, fewer computed signals, and no trivial methods.

---

## 2. `src/lib/components/module-header/module-header.component.html`

### Changes

- Emit outputs directly from the template click bindings.
- Inline the collapse/size icon and label ternaries.
- Bind the status modifier class from the new `statusClass()` computed.

### Proposed template

```html
<header class="cba-module-header">
  @if (isFullscreen()) {
    <div class="cba-module-header__section cba-module-header__section--title">
      {{ title() }}
    </div>
  } @else {
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

    <div class="cba-module-header__section cba-module-header__section--title">
      {{ title() }}
    </div>

    <nav class="cba-module-header__section cba-module-header__section--actions">
      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="isCollapsed() ? 'Expand module' : 'Collapse module'"
        [title]="isCollapsed() ? 'Expand module' : 'Collapse module'"
        (click)="collapseToggle.emit()">
        <fa-icon [icon]="isCollapsed() ? faChevronDown : faChevronUp" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        [attr.aria-label]="size() === '100%' ? 'Shrink module to 50%' : 'Expand module to 100%'"
        [title]="size() === '100%' ? 'Shrink module to 50%' : 'Expand module to 100%'"
        (click)="sizeToggle.emit(size() === '100%' ? '50%' : '100%')">
        <fa-icon [icon]="size() === '100%' ? faCompress : faExpand" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        aria-label="Remove module"
        title="Remove module"
        (click)="remove.emit()">
        <fa-icon [icon]="faRemoveIcon" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="cba-module-header__action"
        aria-label="Enter fullscreen"
        title="Enter fullscreen"
        (click)="fullscreenToggle.emit()">
        <fa-icon [icon]="faFullscreenIcon" aria-hidden="true" />
      </button>
    </nav>
  }
</header>
```

---

## 3. `src/lib/components/module-header/module-header.component.scss`

### Changes

- Group `.cba-module-header__status--loaded` and `.cba-module-header__status--success` because they share the same color token.

### Proposed change

Replace:

```scss
.cba-module-header__status--loaded {
  color: var(--cba-accent-success);
}

.cba-module-header__status--success {
  color: var(--cba-accent-success);
}
```

With:

```scss
.cba-module-header__status--loaded,
.cba-module-header__status--success {
  color: var(--cba-accent-success);
}
```

The rest of the SCSS remains unchanged.

---

## 4. Files with no simplification needed

- `src/lib/components/module-header/module-header.component.spec.ts` — tests are already focused and minimal.
- `src/lib/components/module-header/module-header.types.ts` — public types are already minimal and well documented.

---

## Public API contract

The externally visible API is unchanged:

- Same `@Input()` names, types, and defaults.
- Same `@Output()` names and payload types.
- Same exported types from `module-header.types.ts`.
- Same component selector and standalone metadata.

The only public-surface reduction is making the two icon constants private; they were never part of the intended API.
