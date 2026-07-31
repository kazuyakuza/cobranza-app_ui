# Front-end Technical Specification — `CbaAccordion`

**Scope:** Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` v21 accordion for `@cobranza-apps/ui`.

**Source:** Phase 7 TODO — `.agent/todos/20260730/20260730-todo-5.md`  
**Global Plan:** `.kilo/plans/20260731-phase7-accordion-spanish-delivery.md`

---

## 1. Component name, selectors, and standalone imports

| Component | Class | Selector | Standalone imports |
|---|---|---|---|
| Accordion container | `CbaAccordionComponent` | `cba-accordion` | `NgbAccordionModule` |
| Accordion item | `CbaAccordionItemComponent` | `cba-accordion-item` | `NgbAccordionModule` |

- Both components are **standalone** Angular components.
- `CbaAccordionComponent` imports `NgbAccordionModule` so it can reference `ngbAccordionHeader`, `ngbAccordionButton`, `ngbAccordionCollapse`, and `ngbAccordionBody` in its internal template.
- `CbaAccordionItemComponent` imports `NgbAccordionModule` for the same internal directives.
- The public barrel `index.ts` re-exports both components.
- `public-api.ts` will be updated in Task 3 to include the accordion barrel.

---

## 2. Exact ng-bootstrap APIs and version compatibility

- **Dependency:** `@ng-bootstrap/ng-bootstrap` `^21.0.0` (currently installed `21.0.0`).
- **Module:** `NgbAccordionModule` exposes `NgbAccordionDirective`, `NgbAccordionItem`, `NgbAccordionHeader`, `NgbAccordionButton`, `NgbAccordionCollapse`, `NgbAccordionBody`, and `NgbAccordionToggle`.
- **Host-directive wiring:**
  - `CbaAccordionComponent` uses `hostDirectives: [NgbAccordionDirective]` so the directive lives on the `<cba-accordion>` host and can discover projected `NgbAccordionItem` instances.
  - `CbaAccordionItemComponent` uses `hostDirectives: [NgbAccordionItem]` so each item is registered with the parent `NgbAccordionDirective`.
- **Manual forwarding:** `NgbAccordionDirective` and `NgbAccordionItem` inputs/outputs are forwarded reactively via `effect()` and `EventEmitter` subscriptions, following the same pattern used by `CbaDropdown` and `CbaPopover`. Angular `hostDirectives` input/output forwarding is not used because it does not reliably react to later input changes.

**Important:** All expand/collapse behaviour, keyboard handling, focus management, and `aria-*` wiring comes from `ng-bootstrap`. `CbaAccordion` only adds the Cobranza theme and a stable selector/projection API.

---

## 3. Input/output contract

### `CbaAccordionComponent`

| Input | Type | Default | Description |
|---|---|---|---|
| `closeOthers` | `boolean` | `false` | If `true`, only one item can be expanded at a time. Thin passthrough to `NgbAccordionDirective.closeOthers`. |
| `destroyOnHide` | `boolean` | `false` | If `true`, item bodies are removed from the DOM when collapsed. Thin passthrough to `NgbAccordionDirective.destroyOnHide`. |
| `animation` | `boolean` | `true` | Enables accordion animation. Thin passthrough to `NgbAccordionDirective.animation`. |

| Output | Payload | Description |
|---|---|---|
| `show` | `string` | Emitted before an item starts expanding. Payload is the item id. |
| `shown` | `string` | Emitted after an item finishes expanding. Payload is the item id. |
| `hide` | `string` | Emitted before an item starts collapsing. Payload is the item id. |
| `hidden` | `string` | Emitted after an item finishes collapsing. Payload is the item id. |

### `CbaAccordionItemComponent`

| Input | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | `false` | Disables the item toggle. Programmatic expand/collapse still works. |
| `collapsed` | `boolean` | `true` | Initial collapsed state. |
| `id` | `string \| undefined` | `undefined` | Optional unique id. If omitted, `ng-bootstrap` auto-generates `ngb-accordion-item-XX`. |

| Output | Payload | Description |
|---|---|---|
| `shown` | `void` | Emitted after this item finishes expanding. |
| `hidden` | `void` | Emitted after this item finishes collapsing. |

The `id` setter is forwarded to `NgbAccordionItem.id`; `disabled` and `collapsed` are forwarded via `effect()` to the underlying directive.

---

## 4. Content projection API

### `cba-accordion-item` slots

| Slot | Selector | Purpose |
|---|---|---|
| Title / header | `[cbaAccordionTitle]` | Projected content is rendered inside the toggle button. |
| Body | default `<ng-content>` | Projected content is wrapped automatically in an `<ng-template>` so `ngbAccordionBody` can show/hide it. |

### Consumer example

```html
<cba-accordion [closeOthers]="true">
  <cba-accordion-item>
    <span cbaAccordionTitle>Detalles del cliente</span>
    <p>Contenido del primer panel.</p>
  </cba-accordion-item>

  <cba-accordion-item [disabled]="true">
    <span cbaAccordionTitle>Histórico de pagos</span>
    <p>Contenido deshabilitado.</p>
  </cba-accordion-item>

  <cba-accordion-item>
    <span cbaAccordionTitle>Documentación</span>
    <p>Contenido del tercer panel.</p>
  </cba-accordion-item>
</cba-accordion>
```

The wrapper internally produces the markup required by `ng-bootstrap`:

```html
<!-- cba-accordion-item.component.html -->
<div class="cba-accordion-item__header" ngbAccordionHeader>
  <button class="cba-accordion-item__button" ngbAccordionButton>
    <ng-content select="[cbaAccordionTitle]"></ng-content>
  </button>
</div>
<div class="cba-accordion-item__collapse" ngbAccordionCollapse>
  <div class="cba-accordion-item__body" ngbAccordionBody>
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  </div>
</div>
```

---

## 5. SCSS theming details

All styles use `--cba-*` design tokens from `src/theme/_variables.scss`.

### `cba-accordion` host

- `display: block`
- `background-color: var(--cba-bg-secondary)`
- `border: 1px solid var(--cba-border-subtle)`
- `border-radius: var(--cba-radius-md)`
- `overflow: hidden`

### `cba-accordion-item` host

- `border-bottom: 1px solid var(--cba-border-subtle)`
- Last item has `border-bottom: none`.
- Modifier `cba-accordion-item--disabled` dims the item (`opacity: 0.65`, `pointer-events: none` on the host is avoided; disabled state is forwarded to the underlying `ng-bootstrap` button).

### Header button

- Full width, flex layout, text aligned left.
- `padding: var(--cba-space-3) var(--cba-space-4)`
- `background-color: var(--cba-bg-tertiary)`
- `color: var(--cba-text-primary)`
- `font-size: 0.875rem` (14px)
- `font-weight: 500`
- `border: none`
- `cursor: pointer`
- Hover: `background-color: var(--cba-hover)`
- Active: `background-color: var(--cba-active)`
- Focus-visible: `outline: none; box-shadow: inset var(--cba-focus-ring)`
- Disabled: `color: var(--cba-text-muted)`, `cursor: not-allowed`, `opacity: 0.65`
- A CSS-only chevron indicator via `::after` pseudo-element is optional; it must be themable via current token colours.

### Body

- `padding: var(--cba-space-4)`
- `background-color: var(--cba-bg-secondary)`
- `color: var(--cba-text-primary)`
- `font-size: 0.875rem`
- `line-height: 1.5`

### Motion

- Respect `prefers-reduced-motion: reduce` by disabling transitions.

---

## 6. Accessibility considerations

- `ng-bootstrap` `NgbAccordionButton` / `NgbAccordionToggle` automatically manage:
  - `aria-expanded` on the toggle button,
  - `aria-controls` pointing to the body region,
  - `id` generation for the button and the collapsible region,
  - `aria-labelledby` relationship between the body region and its button.
- The wrapper **must not override** these `aria-*` attributes.
- The projected title should be plain text (or text + decorative icons with `aria-hidden="true"`). If a title is icon-only, the consumer is responsible for adding an `aria-label` on the projected element.
- The `disabled` input is forwarded to `NgbAccordionItem.disabled`, which disables the native button and adds the correct `disabled` attribute.
- The toggle button is a native `<button>`, so it is keyboard focusable and operable with Enter/Space.
- No additional `role` is needed on the host container.

---

## 7. Test strategy

Tests are minimal wrappers that verify the stable API and the ng-bootstrap passthrough.

1. **Host rendering**
   - Render a `cba-accordion` with three `cba-accordion-item` elements.
   - Assert the host has the `cba-accordion` class.
   - Assert each item host has the `cba-accordion-item` class.

2. **Toggle behaviour**
   - Assert the first item button has `aria-expanded="false"`.
   - Click the button.
   - Assert `aria-expanded="true"` and the body content is visible.
   - Click again.
   - Assert `aria-expanded="false"` and the body content is hidden.

3. **`closeOthers` passthrough**
   - Render with `[closeOthers]="true"`.
   - Expand the first item.
   - Expand the second item.
   - Assert the first item is now collapsed.

4. **Disabled item**
   - Render one item with `[disabled]="true"`.
   - Assert the button is disabled.
   - Click the button and assert the item does not expand.

5. **Input forwarding**
   - Assert `NgbAccordionDirective.closeOthers` matches the `closeOthers` input.
   - Assert `NgbAccordionItem.disabled` and `NgbAccordionItem.collapsed` match the item inputs.

6. **Outputs**
   - Assert `shown` and `hidden` outputs on the container emit the correct item id.

---

## 8. File list to create

```text
src/components/accordion/
  cba-accordion.component.ts
  cba-accordion.component.html
  cba-accordion.component.scss
  cba-accordion.component.spec.ts
  cba-accordion-item.component.ts
  cba-accordion-item.component.html
  cba-accordion-item.component.scss
  cba-accordion-item.component.spec.ts
  index.ts

docs/
  CBA_ACCORDION.md
```

`public-api.ts` is **not** updated in this step; it will be handled during Task 3.
