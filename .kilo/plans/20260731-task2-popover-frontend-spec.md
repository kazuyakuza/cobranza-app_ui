# CbaPopover — Front-end Technical Specification

**Task:** Phase 6 — Task 2 — Implement `CbaPopover`  
**Project:** `@cobranza-apps/ui`  
**Date:** 2026-07-31  
**Author:** Frontend Specialist (Critical Workflow 4.1a)

---

## 1. Component vs Directive Decision

### Decision

`CbaPopover` is implemented as a **standalone component** with element selector `cba-popover` and `hostDirectives: [NgbPopover]`.

### Rationale

| Approach | Pros | Cons |
| --- | --- | --- |
| **Component (`cba-popover`)** | Stable element selector consistent with `CbaModal`, `CbaDropdown`; natural projection slot for the trigger element; room for future projected body slot via structural directive; `hostDirectives` keeps the wrapper thin. | Adds a wrapper element in the DOM; positioning target is the host, not the inner trigger, unless `positionTarget` is used. |
| **Directive (`[cbaPopover]`)** | Zero extra DOM element; positions directly on the trigger; very close to raw `ngbPopover`. | Selector is an attribute (`[cbaPopover]`), not `cba-popover`; less room for future projection; inconsistent with existing `CbaModal`/`CbaDropdown` patterns; rich body content requires `ng-template` references. |

The component approach is chosen because:

1. **Project consistency** — every other ng-bootstrap wrapper (`CbaModal`, `CbaDropdown`, form controls) is a component.
2. **Stable selector** — consumers use `<cba-popover>`, matching the requested selector.
3. **Trigger projection** — the trigger element is projected inside the component, so consumers are not forced to apply a directive to every trigger.
4. **No DI boundary problem** — unlike `CbaDropdown`, the projected trigger does **not** need to inject `NgbPopover`. The directive lives on the component host and binds its own event listeners. Projected content is only rendered inside the popover window as an embedded view, which does not require cross-boundary DI.
5. **Future extensibility** — a projected body slot (`*cbaPopoverBody`) can be added later without changing the public API.

### How `hostDirectives` is used

`NgbPopover` is attached to the `<cba-popover>` host element. Component inputs are forwarded to the directive inputs via Angular host-directive bindings:

- `body` -> `ngbPopover`
- `title` -> `popoverTitle`
- `placement` -> `placement`
- `triggers` -> `triggers`
- `disabled` -> `disablePopover`

Outputs `shown` and `hidden` are forwarded directly.

---

## 2. API Surface

### 2.1 Component metadata

| Property | Value |
| --- | --- |
| Selector | `cba-popover` |
| Standalone | `true` |
| Change detection | `OnPush` |
| Host directive | `NgbPopover` |
| Host class | `cba-popover` |
| Host display | `inline-block` |

### 2.2 Inputs

| Name | Type | Default | Maps to `NgbPopover` | Description |
| --- | --- | --- | --- | --- |
| `body` | `string \| TemplateRef<any> \| null \| undefined` | `undefined` | `ngbPopover` | Popover body content. Plain text or an `ng-template` for rich HTML. If both `body` and `title` are falsy, the popover does not open. |
| `title` | `string \| TemplateRef<any> \| null \| undefined` | `undefined` | `popoverTitle` | Optional popover title. |
| `placement` | `CbaPopoverPlacement` (`PlacementArray`) | `'auto'` | `placement` | Preferred placement (e.g. `'top'`, `'bottom'`, `'left'`, `'right'`, `'auto'` or an array of fallbacks). |
| `triggers` | `string` | `'hover focus'` | `triggers` | Space-separated event names. `'hover focus'` opens on mouseenter and keyboard focus; `'click'` opens on click. |
| `disabled` | `boolean` | `false` | `disablePopover` | When `true`, the popover does not open. |

### 2.3 Outputs

| Name | Type | Maps to `NgbPopover` | Description |
| --- | --- | --- | --- |
| `shown` | `EventEmitter<void>` | `shown` | Emitted after the popover opening animation finishes. |
| `hidden` | `EventEmitter<void>` | `hidden` | Emitted after the popover closing animation finishes and the window is removed from the DOM. |

### 2.4 Content projection

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Trigger | default `<ng-content>` | Yes | Any focusable element (button, link, icon button) that triggers the popover. Events are bound to the host element; the projected element receives focus/hover naturally through bubbling. |

No dedicated body projection slot in v1. Body is passed through the `body` input, which accepts a `TemplateRef` for rich content.

### 2.5 Type aliases

```ts
export type CbaPopoverPlacement = PlacementArray;
```

---

## 3. Styling Rules

### 3.1 Design tokens

| Token | Usage |
| --- | --- |
| `--cba-bg-elevated` | Popover window background. |
| `--cba-border-subtle` | Border and arrow color. |
| `--cba-radius-md` | Border radius of the popover window. |
| `--cba-shadow-elevated` | Drop shadow of the floating surface. |
| `--cba-text-primary` | Title and primary body text. |
| `--cba-text-secondary` | Body text. |
| `--cba-space-3` | Title vertical padding. |
| `--cba-space-4` | Body padding and title horizontal padding. |

### 3.2 BEM naming

- Host block: `cba-popover`
- Popover window theme scope: `cba-popover-window` (applied via `popoverClass`)

No additional component-level BEM elements are needed because the popover window is rendered outside the component host.

### 3.3 Global theme file

Create `src/theme/_popover.scss` and import it in `src/theme/theme.scss`.

The popover window is appended to `body` by `NgbPopover` (`container: 'body'`), so it cannot be styled with component-scoped `::ng-deep`. Global theming is required, scoped to the `.cba-popover-window` class set via `popoverClass`.

Required overrides:

- `.cba-popover-window.popover` background, border, radius, shadow.
- `.cba-popover-window .popover-header` background, border-bottom, color, padding, font-weight.
- `.cba-popover-window .popover-body` color, padding.
- `.cba-popover-window .popover-arrow::before` / `::after` border colors so the arrow matches the surface border.
- `@media (prefers-reduced-motion: reduce)` disable transitions if Bootstrap adds any.

### 3.4 Component styles

`src/components/popover/cba-popover.component.scss` contains only:

```scss
:host {
  display: inline-block;
}
```

This ensures the host element forms a sensible positioning box around the projected trigger.

---

## 4. Interaction Patterns

### 4.1 Trigger behavior

- The `NgbPopover` directive is hosted on `<cba-popover>` and listens for the configured `triggers`.
- Default triggers are `'hover focus'`: mouse hover and keyboard focus both open the popover.
- Consumers can override with `triggers="click"`, `triggers="hover click"`, etc.
- `autoClose` is not exposed in v1; ng-bootstrap default (`true`) applies.

### 4.2 Open / close lifecycle

- `open()` / `close()` / `toggle()` are owned by `NgbPopover`.
- The wrapper does **not** reimplement these methods in v1.
- If future consumers need programmatic control, the component can inject `NgbPopover` and expose delegate methods without breaking the API.

### 4.3 Hover usage for Shell footer

```html
<cba-popover
  title="Module sections"
  placement="top"
  triggers="mouseenter:mouseleave focus:blur"
  [body]="footerSectionsTemplate">
  <button class="shell-footer__item">Modules</button>
</cba-popover>

<ng-template #footerSectionsTemplate>
  <ul class="shell-footer__popover-list">
    <li><a href="/modules/a">Section A</a></li>
    <li><a href="/modules/b">Section B</a></li>
  </ul>
</ng-template>
```

Note: exact `triggers` syntax follows ng-bootstrap semantics; the spec default is `'hover focus'`, but explicit `mouseenter:mouseleave` may be used when precise hover-out behavior is required.

---

## 5. Accessibility Notes

- The trigger element projected inside `<cba-popover>` must be focusable (`<button>`, `<a>`, or element with `tabindex="0"`).
- With default `'hover focus'` triggers, keyboard focus opens the popover, satisfying keyboard operability.
- `NgbPopover` manages `role="tooltip"` / `role="popover"`, `aria-describedby`, and focus behavior inside the popover window.
- When `disabled="true"`, `disablePopover` prevents the window from opening.
- The wrapper does not add extra ARIA attributes in v1; it relies on ng-bootstrap.
- Ensure body content uses semantic markup (e.g. `<ul>` for lists of links) so screen-reader users can navigate projected content.

---

## 6. Test Strategy

### 6.1 What to test

1. Host class `cba-popover` is applied.
2. Inputs are forwarded to the underlying `NgbPopover` instance:
   - `body` -> `ngbPopover`
   - `title` -> `popoverTitle`
   - `placement` -> `placement`
   - `triggers` -> `triggers`
   - `disabled` -> `disablePopover`
3. Outputs `shown` and `hidden` re-emit `NgbPopover` events.
4. Trigger element is projected into the host.
5. `disabled="true"` prevents opening (delegate assertion on `disablePopover`).

### 6.2 What NOT to test

- Popover positioning, Popper integration, or arrow rendering.
- Animation timing.
- `autoClose` internals.
- Bootstrap CSS class presence on the popover window (theme is verified visually / by build, not by unit tests).

### 6.3 Test helpers

Use `TestBed` with a host component that imports `CbaPopoverComponent`. Inject `NgbPopover` from the host fixture's debug element to verify forwarded properties.

---

## 7. Example Usage

### 7.1 Basic string body

```html
<cba-popover body="This action opens the selected module." title="Hint">
  <cba-button variant="ghost" size="sm">?</cba-button>
</cba-popover>
```

### 7.2 Rich body via template

```html
<cba-popover
  title="Account options"
  placement="bottom"
  triggers="click"
  [body]="accountMenuTemplate">
  <cba-button variant="secondary">Account</cba-button>
</cba-popover>

<ng-template #accountMenuTemplate>
  <div class="account-popover">
    <p><strong>User:</strong> admin</p>
    <p><strong>Role:</strong> Operator</p>
  </div>
</ng-template>
```

### 7.3 Shell footer hover sub-sections

```html
<nav class="shell-footer">
  <cba-popover
    *ngFor="let section of footerSections"
    [title]="section.title"
    placement="top"
    triggers="mouseenter:mouseleave focus:blur"
    [body]="section.template">
    <button class="shell-footer__trigger">
      <fa-icon [icon]="section.icon"></fa-icon>
      <span>{{ section.label }}</span>
    </button>
  </cba-popover>
</nav>
```

```ts
@Component({
  standalone: true,
  imports: [CbaPopoverComponent, CbaButtonComponent, FontAwesomeModule, NgFor],
  templateUrl: './shell-footer.component.html',
})
export class ShellFooterComponent {
  footerSections = [
    {
      label: 'Modules',
      title: 'Modules',
      icon: faThLarge,
      template: this.modulesTemplate,
    },
    // ...
  ];
}
```

---

## 8. File Structure

```text
src/
  components/
    popover/
      cba-popover.component.ts
      cba-popover.component.html
      cba-popover.component.scss
      cba-popover.component.spec.ts
      index.ts
  theme/
    _popover.scss   (new global theme file)
    theme.scss      (add @use 'popover')
  public-api.ts     (add export * from './components/popover')
docs/
  CBA_POPOVER.md    (usage docs, behavior note, hover example)
```

---

## 9. Implementation Notes

- Keep `CbaPopoverComponent` under 200 lines and methods under 50 lines per project rules.
- Declare only one class per file; place `CbaPopoverPlacement` type alias in a separate `cba-popover.types.ts` if it grows, otherwise inline in the component file.
- Use `input<T>()` and `output<T>()` signals for Angular 22 compatibility.
- `hostDirectives` bindings must use the exact input names of `NgbPopover`:
  ```ts
  hostDirectives: [
    {
      directive: NgbPopover,
      inputs: [
        'ngbPopover: body',
        'popoverTitle: title',
        'placement',
        'triggers',
        'disablePopover: disabled',
      ],
      outputs: ['shown', 'hidden'],
    },
  ],
  ```
- Set `popoverClass` to `'cba-popover-window'` by default. Because `popoverClass` is a directive input, it can be forwarded the same way or set programmatically by injecting `NgbPopover` in `ngOnInit`. Prefer forwarding via `hostDirectives` with a default input value if Angular allows; otherwise inject `NgbPopover` and assign in the constructor.
- Do not import `NgbPopoverModule` as a module; import only `NgbPopover` for `hostDirectives` (standalone component).
- The component template is a single `<ng-content></ng-content>`.

---

## 10. Acceptance Criteria

- [ ] `cba-popover` component exists under `src/components/popover/`.
- [ ] Component is standalone and exported from `src/public-api.ts`.
- [ ] `hostDirectives: [NgbPopover]` is used with input/output forwarding.
- [ ] Inputs `body`, `title`, `placement`, `triggers`, `disabled` work as specified.
- [ ] Outputs `shown` / `hidden` are wired.
- [ ] `src/theme/_popover.scss` themes the popover window using `--cba-*` tokens.
- [ ] `src/theme/theme.scss` imports `_popover.scss`.
- [ ] `docs/CBA_POPOVER.md` is created with JSDoc, behavior note, and Shell-footer hover example.
- [ ] Minimal wrapper unit tests are present and pass.
- [ ] `npm run build` succeeds with no errors.
