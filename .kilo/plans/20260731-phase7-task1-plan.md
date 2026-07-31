# Implementation Plan — Task 1: `CbaAccordion` (Option A)

**Source TODO:** `.agent/todos/20260730/20260730-todo-5.md` → Task 1 (`### 1. Implement CbaAccordion`)
**Global plan:** `.kilo/plans/20260731-phase7-accordion-spanish-delivery.md`
**Front-end spec (superseded on structure):** `.kilo/plans/20260731-phase7-task1-frontend-spec.md`
**Approved direction:** **Option A** — single container component; consumers author ng-bootstrap accordion item markup directly.

---

## 0. Decided approach (Option A) — why

The front-end spec proposed two components (`CbaAccordionComponent` + `CbaAccordionItemComponent` with a `[cbaAccordionTitle]` projection API). That design is **unworkable** on ng-bootstrap v21:

- `NgbAccordionItem._collapse` is a **`@ContentChild(NgbAccordionCollapse, { static: true })`** (verified in `node_modules/@ng-bootstrap/ng-bootstrap/fesm2022/ng-bootstrap-ng-bootstrap-accordion.mjs` line 378/390-392).
- A static ContentChild **cannot cross a component view boundary**. Wrapping `ngbAccordionCollapse` inside a child component template (`CbaAccordionItemComponent`) makes the static query resolve against the *child component's* template lookup context at construction — which never contains the projected `ngbAccordionCollapse`, so expand/collapse wiring silently breaks.

**Option A) keeps a single container and lets consumers place the full ng-bootstrap item markup directly as projected content.** This is feasible and empirically consistent with the existing `CbaDropdown` host-directive wrapper, because:

- `NgbAccordionDirective._items` is `@ContentChildren(NgbAccordionItem)` (line 551/562-563, non-static). ContentChildren on a host directive resolve against the **projected content of the host element** — i.e. consumer-authored `<div ngbAccordionItem>` placed inside `<cba-accordion>` (projected via `<ng-content>`).
- Each projected `div ngbAccordionItem` is authored in the **consumer's view**, in the same view as its `div ngbAccordionCollapse`, `div ngbAccordionHeader`, `button ngbAccordionButton`, and `div ngbAccordionBody` children. The static ContentChild `_collapse` therefore resolves inside the consumer's view with no boundary crossing.
- `NgbAccordionItem` constructor does `inject(NgbAccordionDirective)` (line 224). The injector chain from the projected `<div ngbAccordionItem>` walks up through the `<cba-accordion>` host element, where `NgbAccordionDirective` lives as a `hostDirective` → resolves. (Identical to the proven `CbaDropdown`/`NgbDropdown` wiring.)

Per the original TODO (lines 39-43): *"Exact structure may follow ng-bootstrap's standalone accordion API, but the public usage must be documented as `cba-*` and theme-aligned."* Option A honours this; `CbaAccordionItemComponent` and `[cbaAccordionTitle]` are dropped.

---

## 1. Files to create / edit

### 1.1 New files (all under `src/components/accordion/`)

| Path | Purpose |
|---|---|
| `src/components/accordion/cba-accordion.component.ts` | Standalone `CbaAccordionComponent`: hosts `NgbAccordionDirective`, forwards inputs/outputs. |
| `src/components/accordion/cba-accordion.component.html` | Template: a single `<ng-content></ng-content>`. |
| `src/components/accordion/cba-accordion.component.scss` | `:host` container surface (host-level only). |
| `src/components/accordion/cba-accordion.component.spec.ts` | Minimal wrapper tests. |
| `src/components/accordion/index.ts` | Barrel re-exporting `CbaAccordionComponent`. |

### 1.2 New theme file (global — required for projected items)

| Path | Purpose |
|---|---|
| `src/theme/_accordion.scss` | Global theme for the **projected** ng-bootstrap item surfaces (`.accordion-item`, `.accordion-button`, `.accordion-body`) scoped under the `.cba-accordion` host class. Component-emulated SCSS cannot reach projected content, so this must be global. |

### 1.3 Edited existing files

| Path | Change |
|---|---|
| `src/theme/theme.scss` | Add `@use 'accordion';` (insert after `@use 'typeahead';`, before `@use 'mixins';`). |
| `src/public-api.ts` | Add `export * from './components/accordion';` in the components block (alphabetical: before `'./components/badge'`). |
| `.agent/project-structure.md` | Add a `src/components/accordion/` line under `# Folders in src/`. |
| `docs/CBA_ACCORDION.md` | New component doc (selector, import, how-it-works, inputs/outputs, projection contract, minimal 2–3 item example, theming notes, accessibility, important ng-bootstrap behavioural note, related docs). |
| `README.md` | Add `CbaAccordion` row to the **Component Inventory** table; add `CBA_ACCORDION.md` link under **Documentation**. |
| `docs/USAGE.md` | Add a `CbaAccordion` usage-patterns subsection under **Component Usage Patterns** and a TOC entry. |

> **Note for implementer:** Steps touching `docs/` and `README.md` are listed here for completeness; per the Critical Workflow they are normally performed in **4.4 (Documentation)** by the docs-specialist. The implementer in 4.2 only needs the component + theme + `public-api.ts` + `project-structure.md` updates to satisfy build. Documentation work is itemized here so the plan is complete and the docs agent can execute from one source.

---

## 2. `CbaAccordionComponent` — exact contract

### 2.1 Selector / metadata

- `selector: 'cba-accordion'`
- `standalone: true`
- `changeDetection: ChangeDetectionStrategy.OnPush`
- `hostDirectives: [NgbAccordionDirective]` — places the directive on the `<cba-accordion>` host so projected `ngbAccordionItem` instances inject it and the `_items` ContentChildren query discovers them.
- `imports: []` (template uses only `<ng-content>`; the projected ng-bootstrap directives live in the **consumer's** view and are imported by the consumer).
- `templateUrl: './cba-accordion.component.html'`
- `styleUrl: './cba-accordion.component.scss'`
- `host: { class: 'cba-accordion' }` — provides the `.cba-accordion` scope anchor the global theme relies on.

### 2.2 Inputs (signal inputs)

| Input | Type | Default | Forwards to |
|---|---|---|---|
| `closeOthers` | `boolean` | `false` | `NgbAccordionDirective.closeOthers` |
| `destroyOnHide` | `boolean` | `true` | `NgbAccordionDirective.destroyOnHide` (note ng-bootstrap's own default is `true` per `NgbAccordionConfig`) |
| `animation` | `boolean` | `true` | `NgbAccordionDirective.animation` |

> Defaults match the existing wrapper convention (ng-bootstrap's documented config defaults; `destroyOnHide` default `true` per `NgbAccordionConfig` in the source). The original front-end spec's `destroyOnHide` default `false` is **corrected** here to match ng-bootstrap. Keep `true`.

### 2.3 Outputs (signal-output style)

| Output | Payload | Re-emits from |
|---|---|---|
| `show` | `string` (item id) | `NgbAccordionDirective.show` |
| `shown` | `string` (item id) | `NgbAccordionDirective.shown` |
| `hide` | `string` (item id) | `NgbAccordionDirective.hide` |
| `hidden` | `string` (item id) | `NgbAccordionDirective.hidden` |

### 2.4 Wiring (constructor) — mirrors `CbaPopoverComponent`

```
private readonly ngbAccordion = inject(NgbAccordionDirective);
constructor() {
  this.reemitAccordionEvents();
  this.forwardInputsToNgbAccordion();
}
```

- `reemitAccordionEvents()`: subscribe each of `show`/`shown`/`hide`/`hidden` on `ngbAccordion` and `this.<output>.emit(id)` in the callback.
  - Keep as a single private method with four subscriptions (or four one-line subscriptions in one method). Respect the **max-lines-per-method** rule (≤50 body lines) and **max-depth** rule (≤2 nesting levels): no nested blocks; subscriptions are flat one-liners.
- `forwardInputsToNgbAccordion()`: a single `effect(() => { this.ngbAccordion.closeOthers = this.closeOthers(); this.ngbAccordion.destroyOnHide = this.destroyOnHide(); this.ngbAccordion.animation = this.animation(); })`. Signal reads inside `effect()` register reactive dependencies, so later input changes re-forward (same reason `CbaPopover`/`CbaDropdown` use `effect()`, because `hostDirectives` input forwarding does not reliably react to later input changes).

### 2.5 Template (`cba-accordion.component.html`)

```html
<ng-content></ng-content>
```

That is the entire template. All ng-bootstrap item markup is consumer-authored.

### 2.6 JSDoc on the component class

JSDoc block must state (self-documenting, minimal):

- Component is a thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` accordion.
- Behaviour split: ng-bootstrap owns expand/collapse, keyboard/focus, `aria-*`, animation, `closeOthers`/`destroyOnHide` semantics; this component owns the Cobranza gray theme + stable `cba-accordion` selector + thin passthrough of three inputs and four outputs.
- **Why `hostDirectives: [NgbAccordionDirective]`:** projected `div ngbAccordionItem` must `inject(NgbAccordionDirective)` and the directive's `_items` `ContentChildren` query must see projected items; only a host-directive on `<cba-accordion>` satisfies both (an inner `<div ngbAccordion>` inside the component view is rejected: projected `ngbAccordionItem` could not inject it across the view boundary, and `_items` could not cross the view boundary either).
- **Why there is no `CbaAccordionItemComponent`:** `NgbAccordionItem._collapse` is `@ContentChild({ static: true })` and static content queries cannot cross component view boundaries; consumers therefore author the ng-bootstrap item markup directly so the static query resolves inside the consumer's own view.
- `@usageNotes` code block with the minimal 3-item example from §5.
- Cross-link: `@see [CBA_ACCORDION.md](/docs/CBA_ACCORDION.md)`.

Plus JSDoc on each `@Input` / `@Output` field (one-liners consistent with `CbaDropdown`/`CbaPopover`).

---

## 3. `index.ts` (accordion barrel)

```ts
/**
 * Barrel for `CbaAccordion`. Re-exports the public API so `public-api.ts`
 * and consumers import from `components/accordion`.
 */
export * from './cba-accordion.component';
```

---

## 4. `public-api.ts` edit

Insert in the components block (after the header comment, before `export * from './components/badge';`) — alphabetical ordering:

```ts
export * from './components/accordion';
```

Do not remove or reorder existing lines.

---

## 5. `.agent/project-structure.md` edit

Add a new bullet under `# Folders in src/`, between the `dropdown` and `popover` lines (alphabetical by slug), keeping the established ` - <path>/ - <comment>` format:

```
- src/components/accordion/ - CbaAccordion component: thin ng-bootstrap accordion wrapper with projected ngbAccordionItem/item markup and Cobranza theme
```

---

## 6. SCSS — host vs global split (rationale)

`.accordion-item`, `.accordion-button`, `.accordion-header`, `.accordion-body`, `.accordion-collapse` are **Bootstrap classes applied to projected elements authored by the consumer**. With `ViewEncapsulation.Emulated`, component SCSS attribute-scopes the terminal selector of each rule to the component's template elements only; projected elements keep the **consumer's** encapsulation attribute. Therefore projected item surfaces **cannot** be themed from `cba-accordion.component.scss`.

The established remedy (see `src/theme/_popover.scss`, `_modal.scss`, `_datepicker.scss`, `_typeahead.scss`) is a **global theme partial** keyed off a stable sentinel class. The host class `cba-accordion` is that sentinel.

- `cba-accordion.component.scss` → `:host` (the `<cba-accordion>` element) only.
- `src/theme/_accordion.scss` → everything targeting `.accordion-*` descendants, scoped under `.cba-accordion`.

### 6.1 `cba-accordion.component.scss` (host only)

```scss
:host {
  display: block;
}
```

(One rule. Intentionally minimal — container surface handled in the global partial alongside item theming so there is a single source of truth for accordion visuals.)

### 6.2 `src/theme/_accordion.scss` (global, projected + container)

Tokens reused from `src/lib/theme/_variables.scss` (a.k.a. `src/theme/_variables.scss`): `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-border-subtle`, `--cba-text-primary`, `--cba-text-muted`, `--cba-hover`, `--cba-active`, `--cba-focus-ring`, `--cba-radius-md`, `--cba-space-3`, `--cba-space-4`.

Selectors to implement (all descendant of `.cba-accordion`, so unrelated `.accordion-*` markup outside a `CbaAccordion` keeps Bootstrap defaults):

1. `.cba-accordion` — container surface:
   - `background-color: var(--cba-bg-secondary)`
   - `border: 1px solid var(--cba-border-subtle)`
   - `border-radius: var(--cba-radius-md)`
   - `overflow: hidden`

2. `.cba-accordion .accordion-item`:
   - `background-color: var(--cba-bg-secondary)`
   - `color: var(--cba-text-primary)`
   - `border-bottom: 1px solid var(--cba-border-subtle)`
   - Not rounded (outer container radius clips via `overflow:hidden`).

3. `.cba-accordion .accordion-item:last-child` — `border-bottom: none`.

4. `.cba-accordion .accordion-header`:
   - `margin: 0` (clear Bootstrap default margin).

5. `.cba-accordion .accordion-button` (the toggle `<button>` from `NgbAccordionButton`; Bootstrap already sets `class="accordion-button"`, width 100%, flex, text-align left, and the chevron background-image):
   - `padding: var(--cba-space-3) var(--cba-space-4)`
   - `background-color: var(--cba-bg-tertiary)`
   - `color: var(--cba-text-primary)`
   - `font-size: 0.875rem` (14px)
   - `font-weight: 500`
   - `border: none`
   - `box-shadow: none` (override Bootstrap's focus/additive shadow to let us own the focus ring)
   - `transition: background-color 120ms ease, color 120ms ease`
   - After-section chevron colour: keep Bootstrap's default SVG chevron (do not override for v1) — document this.

6. `.cba-accordion .accordion-button:hover` — `background-color: var(--cba-hover)`.

7. `.cba-accordion .accordion-button:not(.collapsed)` (Bootstrap adds/removes `collapsed`):
   - `background-color: var(--cba-active)`
   - `color: var(--cba-text-primary)`
   - Keep Bootstrap's chevron rotation (it owns `::after`).

8. `.cba-accordion .accordion-button:focus-visible`:
   - `outline: none`
   - `box-shadow: inset var(--cba-focus-ring)` (treat `--cba-focus-ring` as the inset shadow value as in `CbaDropdown`).

9. `.cba-accordion .accordion-button[disabled]` (ng-bootstrap sets `[disabled]` when the item `disabled` input is true):
   - `color: var(--cba-text-muted)`
   - `cursor: not-allowed`
   - `opacity: 0.65`
   - `background-color: var(--cba-bg-tertiary)`

10. `.cba-accordion .accordion-collapse` — no-op rule needed (Bootstrap/`NgbCollapse` controls height); ensure it does not add visible borders: `border: none`.

11. `.cba-accordion .accordion-body`:
    - `padding: var(--cba-space-4)`
    - `background-color: var(--cba-bg-secondary)`
    - `color: var(--cba-text-primary)`
    - `font-size: 0.875rem`
    - `line-height: 1.5`

12. Reduced-motion:
    ```scss
    @media (prefers-reduced-motion: reduce) {
      .cba-accordion .accordion-button { transition: none; }
      .cba-accordion .accordion-collapse { transition: none; }
    }
    ```
    (Bootstrap/ng-bootstrap animations are also governed by the `animation` input; this block covers the CSS-transition layer.)

**File header comment** (mirror `_popover.scss`): one doc comment block explaining that this themes ng-bootstrap accordion markup projected into `<cba-accordion>`, scoped via the `cba-accordion` host class, and depends on Bootstrap 5 CSS for `.accordion-*` base structure/chevron.

### 6.3 `src/theme/theme.scss` edit

Add a single line, alphabetically/logically near the ng-bootstrap-theming partials:

```scss
@use 'accordion';
```

Insert it after `@use 'typeahead';` and before `@use 'mixins';`. Do not modify other `@use` lines.

---

## 7. Test strategy — `cba-accordion.component.spec.ts`

Minimal wrapper tests, focused on the stable API and ng-bootstrap passthrough. Follow the established pattern (`cba-popover.component.spec.ts`, `cba-dropdown.component.spec.ts`): a `@Component()` host fixture that imports `CbaAccordionComponent` **and** `NgbAccordionModule`, with a template using a `class` hook on each projected element for assertions.

### 7.1 Host fictures

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAccordionDirective, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CbaAccordionComponent } from './cba-accordion.component';

@Component({
  standalone: true,
  imports: [CbaAccordionComponent, NgbAccordionModule],
  template: `<cba-accordion
    [closeOthers]="closeOthers"
    [destroyOnHide]="destroyOnHide"
    [animation]="animation"
    (show)="onShow($event)"
    (shown)="onShown($event)"
    (hide)="onHide($event)"
    (hidden)="onHidden($event)">
    <div class="item" ngbAccordionItem>
      <div ngbAccordionHeader>
        <button class="btn" ngbAccordionButton>Detalles del cliente</button>
      </div>
      <div ngbAccordionCollapse>
        <div ngbAccordionBody>
          <ng-template>Contenido 1</ng-template>
        </div>
      </div>
    </div>
    <div class="item" ngbAccordionItem [disabled]="true">
      <div ngbAccordionHeader>
        <button class="btn btn-disabled" ngbAccordionButton>Histórico de pagos</button>
      </div>
      <div ngbAccordionCollapse>
        <div ngbAccordionBody>
          <ng-template>Contenido 2</ng-template>
        </div>
      </div>
    </div>
    <div class="item" ngbAccordionItem>
      <div ngbAccordionHeader>
        <button class="btn" ngbAccordionButton>Documentación</button>
      </div>
      <div ngbAccordionCollapse>
        <div ngbAccordionBody>
          <ng-template>Contenido 3</ng-template>
        </div>
      </div>
    </div>
  </cba-accordion>`,
})
class AccordionHost {
  closeOthers = false;
  destroyOnHide = true;
  animation = true;
  onShow = jest.fn();
  onShown = jest.fn();
  onHide = jest.fn();
  onHidden = jest.fn();
}

function getNgbAccordion(fixture: ComponentFixture<unknown>): NgbAccordionDirective {
  return fixture.debugElement
    .query(By.directive(CbaAccordionComponent))
    .injector.get(NgbAccordionDirective);
}

function configureTestBed(): void {
  TestBed.configureTestingModule({ imports: [CbaAccordionComponent, AccordionHost] });
}
```

### 7.2 Test cases

1. **Host class** (standalone render): instantiate `CbaAccordionComponent`; assert `nativeElement.classList.contains('cba-accordion') === true`.
2. **Item projection**: render `AccordionHost`; `detectChanges()`; assert `querySelectorAll('.item').length === 3` and `querySelector('.btn')` exists. (Verifies consumers can author ng-bootstrap item markup inside `<cba-accordion>` and the static ContentChild resolves enough to render.)
3. **Disabled item attr**: assert `querySelector('.btn-disabled').hasAttribute('disabled') === true` (ng-bootstrap `NgbAccordionButton` host binding `'[disabled]': 'item.disabled'`).
4. **`closeOthers` forwarding**: `hostFixture.componentInstance.closeOthers = true; detectChanges();` → `getNgbAccordion(fixture).closeOthers === true`. Then set back to `false` → `false` (verifies reactive `effect()` re-forwards on later change — the exact reason we use `effect()`).
5. **`destroyOnHide` forwarding**: set `destroyOnHide = false` → `getNgbAccordion(fixture).destroyOnHide === false`.
6. **`animation` forwarding**: set `animation = false` → `getNgbAccordion(fixture).animation === false`.
7. **Outputs re-emit with item id**: get `NgbAccordionDirective` instance; call `ngbAccordion.show.emit('demo-1')`, `ngbAccordion.shown.emit('demo-1')`, `ngbAccordion.hide.emit('demo-1')`, `ngbAccordion.hidden.emit('demo-1')`; assert the four host `jest.fn()` callbacks were each called with `'demo-1'`. (Mirrors the popover output test, sidestepping animation timing.)
8. **`closeOthers` behaviour (integration smoke)**: set `closeOthers = true`; expand item 1 via `getNgbAccordion(fixture).expand(<id of item 1>)`; expand item 2's id; assert `getNgbAccordion(fixture).isExpanded(<item1 id>) === false`. Use `AccordionHost` again orhips a second fixture capturing ids after `detectChanges()` by querying `querySelectorAll('[id^="ngb-accordion-item-"]')`. Keep this test **optional/last** — if the id-resolution timing makes it flaky in jsdom, drop it; cases 1-7 fully satisfy the "minimal wrapper tests only" TODO requirement.

> **Constraints for the implementer:**
> - Tests must compile (`await TestBed.compileComponents()`) and call `TestBed.resetTestingModule()` in `beforeEach`, exactly as `CbaPopover`/`CbaDropdown` specs do.
> - Do **not** assert transition/animation end states (jsdom does not run CSS transitions). Use the directive's `EventEmitter.emit()` and public `expand`/`collapse`/`isExpanded` APIs.
> - Keep the spec file under the project's line/method limits.

---

## 8. `docs/CBA_ACCORDION.md`

Mirror `docs/CBA_DROPDOWN.md` structure. Sections:

1. **Title** — Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` accordion. ng-bootstrap owns expand/collapse, keyboard/focus, aria, animation; `CbaAccordion` owns the Cobranza gray theme + stable `cba-accordion` selector + passthrough of three inputs/four outputs.
2. **Table of Contents**
3. **Selector** — `<cba-accordion>` standalone from `@cobranza-apps/ui`.
4. **Import**:
   ```ts
   import { CbaAccordionComponent } from '@cobranza-apps/ui';
   import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
   ```
   Note that consumers **must** import `NgbAccordionModule` themselves — the projected `ngbAccordionItem`/`ngbAccordionHeader`/`ngbAccordionButton`/`ngbAccordionCollapse`/`ngbAccordionBody` directives are applied to elements authored in the consumer's view and therefore resolve from the consumer's `imports`.
5. **How it works** — three bullets: host-directive wiring; behaviour split; Bootstrap 5 CSS + `@ng-bootstrap/ng-bootstrap` ^21 peer deps required.
6. **Inputs** table: `closeOthers`, `destroyOnHide`, `animation` (types, defaults `false`/`true`/`true`, forwarding target).
7. **Outputs** table: `show`, `shown`, `hide`, `hidden` (payload `string` = item id, re-emitted from `NgbAccordionDirective`).
8. **Projected content contract** — table mapping the ng-bootstrap structural directives the consumer must author inside `<cba-accordion>`:

   | Element | Directive | Required | Role |
   |---|---|---|---|
   | Item wrapper | `<div ngbAccordionItem>` | Yes | Registers the item; gets `accordion-item` + auto id `ngb-accordion-item-XX`. Bind `[disabled]`, `[collapsed]`, `[ngbAccordionItem]="id"`, `(shown)/(hidden)/(show)/(hide)` here. |
   | Header | `<div ngbAccordionHeader>` | Yes | Wraps the toggle; gets `accordion-header`. |
   | Toggle button | `<button ngbAccordionButton>` | Yes | Native button; ng-bootstrap wires click/keyboard/aria. `[disabled]` mirrors the item `disabled` automatically. |
   | Collapse region | `<div ngbAccordionCollapse>` | Yes | Builds on `NgbCollapse`; gets `accordion-collapse`. |
   | Body region | `<div ngbAccordionBody>` | Yes | Hosts the lazy body; gets `accordion-body`. |
   | Body template | `<ng-template>` inside `.accordion-body` | Yes | Lazy content template created/destroyed per `destroyOnHide`. |

9. **Basic usage** — minimal 3-item example (matches the test fixture marketing copy):

   ```html
   <cba-accordion [closeOthers]="true" (shown)="onShown($event)">
     <div ngbAccordionItem>
       <div ngbAccordionHeader>
         <button ngbAccordionButton>Detalles del cliente</button>
       </div>
       <div ngbAccordionCollapse>
         <div ngbAccordionBody>
           <ng-template>
             <p>Contenido del primer panel.</p>
           </ng-template>
         </div>
       </div>
     </div>

     <div ngbAccordionItem [disabled]="true">
       <div ngbAccordionHeader>
         <button ngbAccordionButton>Histórico de pagos</button>
       </div>
       <div ngbAccordionCollapse>
         <div ngbAccordionBody>
           <ng-template>
             <p>Contenido deshabilitado.</p>
           </ng-template>
         </div>
       </div>
     </div>

     <div ngbAccordionItem>
       <div ngbAccordionHeader>
         <button ngbAccordionButton>Documentación</button>
       </div>
       <div ngbAccordionCollapse>
         <div ngbAccordionBody>
           <ng-template>
             <p>Contenido del tercer panel.</p>
           </ng-template>
         </div>
       </div>
     </div>
   </cba-accordion>
   ```

   Plus the host component TS showing `imports: [CbaAccordionComponent, NgbAccordionModule]`.
10. **Programmatic API** — short note that within the host template the consumer can grab an item reference via `#i="ngbAccordionItem"` to call `i.toggle()`/`i.expand()`/`i.collapse()` or read `i.collapsed`; and the container-level `NgbAccordionDirective` APIs `expandAll`/`collapseAll`/`isExpanded` are accessible on `<cba-accordion #a="ngbAccordion">`.
11. **Theming notes** — enumerate tokens used (list from §6.2); note all visuals live in `src/theme/_accordion.scss` global partial loaded via `@use '@cobranza-apps/ui/theme'`; note chevron is Bootstrap's default SVG for v1.
12. **Accessibility** — ng-bootstrap `NgbAccordionButton` manages `aria-expanded`, `aria-controls`, ids, `aria-labelledby`; the wrapper must not override these; the toggle is a native `<button>` (keyboard/Enter/Space); for icon-only projected headers the consumer adds `aria-label`.
13. **Important notes**:
    - Behaviour (expand/collapse, keyboard, aria, animation, id generation) comes from `@ng-bootstrap/ng-bootstrap`; `CbaAccordion` only adds theming + a stable selector + thin passthroughs.
    - Consumers **must** import `NgbAccordionModule` and author the `div ngbAccordionItem`…`div ngbAccordionBody` + `ng-template` structure themselves — `CbaAccordion` deliberately does not wrap items in its own component because ng-bootstrap v21's `NgbAccordionItem._collapse` is a `static: true` `ContentChild` that cannot cross a component view boundary (per the project's frontend analysis).
    - `hostDirectives: [NgbAccordionDirective]` is required so projected `ngbAccordionItem`s can `inject(NgbAccordionDirective)` and the directive's `_items` ContentChildren query sees them.
14. **Related docs** — README, USAGE, THEME, CBA_DROPDOWN (same wrapper family), and the ng-bootstrap accordion docs link.

---

## 9. `README.md` + `docs/USAGE.md` updates

### 9.1 `README.md`

- **Component Inventory** table — add a row (placed between `CbaTypeahead` and `CbaModuleFooter`, or alphabetically after `CbaModal`/before `CbaDropdown`; the existing table is loosely grouped — insert before the `CbaDropdown` row to keep the ng-bootstrap-wrapper cluster together):

  `| CbaAccordion | Thin wrapper around ng-bootstrap accordion; consumers author ngbAccordionItem markup inside. |`

  (Keep the table's existing one-line description style.)

- **Documentation** list — add:
  `- [/docs/CBA_ACCORDION.md](/docs/CBA_ACCORDION.md) — CbaAccordion selector, API, projection contract, minimal example, ng-bootstrap behaviour notes.`

Do not alter other README content.

### 9.2 `docs/USAGE.md`

- Add `CbaAccordion` to the **Table of Contents** under `Component Usage Patterns` (e.g. `- [CbaAccordion](#cbaccordion)`).
- Add a `## CbaAccordion` subsection near the `CbaDropdown`/`CbaPopover` cluster. Content: one paragraph (thin ng-bootstrap accordion wrapper; consumers author the ng-bootstrap item markup), the imports snippet, and the 2-item condensed example from `CBA_ACCORDION.md` §8. Keep it concise (USAGE is the patterns hub; full reference lives in `CBA_ACCORDION.md`).

---

## 10. Execution order (implementer, 4.2)

Each step ends with a meaningful commit message. Follow `.kilo/rules/gitignore-compliance.md` (read `.gitignore`, run `git status`) before the first commit.

1. Confirm on branch `feat/phase7-accordion-spanish-delivery` (created in Step 2 of the global plan). If not, stop and ask the caller.
2. Create `src/components/accordion/` directory.
3. Create `src/components/accordion/cba-accordion.component.ts` per §2.
4. Create `src/components/accordion/cba-accordion.component.html` per §2.5.
5. Create `src/components/accordion/cba-accordion.component.scss` per §6.1.
6. Create `src/components/accordion/index.ts` per §3.
7. Edit `src/public-api.ts` per §4.
8. Create `src/theme/_accordion.scss` per §6.2.
9. Edit `src/theme/theme.scss` per §6.3.
10. Create `src/components/accordion/cba-accordion.component.spec.ts` per §7.
11. Edit `.agent/project-structure.md` per §5.
12. Run `npm run build` (single command; allowed by bash allow-rules). Expect success. If it fails, read the error, fix within scope, re-run. Do not touch unrelated files.
13. Run `npm test` — focus on the accordion spec; whole suite should pass. If an existing test fails due to a change you made, fix within scope; otherwise stop and ask the caller.
14. Run `npm run lint` — no new errors in the new/edited files.
15. Commit component + theme + public-api + project-structure + spec: `feat(accordion): add CbaAccordion ng-bootstrap wrapper (option A)`.
16. Documentation steps (§9) may be deferred to the 4.4 Documentation sub-task; if executing as part of 4.2 by caller instruction, commit docs separately: `docs(accordion): add CBA_ACCORDION.md, README + USAGE entries`.

> **Scope discipline:** Do NOT create `CbaAccordionItemComponent`, the `[cbaAccordionTitle]` directive, or any `nba-*` selector. Do NOT add i18n strings or modify other components (those belong to Task 2). Do NOT touch `package.json` version or branch/merge (handled by Steps 2/3 and Step 5 of the global plan).

---

## 11. Verification (4.5 / build acceptance)

- `npm run build` exits 0; `dist/` contains `cba-accordion.component.*` artifacts and `theme/_accordion.scss` is copied into `dist/theme/`.
- `npm test` — `CbaAccordionComponent` describe block passes (cases 1-7 at minimum).
- `public-api.ts` export resolves: `import { CbaAccordionComponent } from '@cobranza-apps/ui'` compiles in a scratch consumer.
- No view-encapsulation leakage: the component's `.scss` contains only `:host`; all `.accordion-*` theming lives in `_accordion.scss` (global, `.cba-accordion`-scoped).

---

## 12. Acceptance-criteria mapping (TODO Task 1)

| TODO checklist item | Satisfied by |
|---|---|
| Build on ng-bootstrap accordion; do not reimplement collapse | §2 (`hostDirectives: [NgbAccordionDirective]`, passthrough inputs/outputs only) |
| Header/button surface uses theme tokens | §6.2 rules 5-9 |
| Expanded/collapsed body uses calm spacing and readable text tokens | §6.2 rule 11 |
| Borders/radius aligned with cards/surfaces | §6.2 rules 1-3 (`--cba-radius-md`, `--cba-border-subtle`) |
| Place under `src/components/accordion/` | §1.1 |
| Export from `src/public-api.ts` | §4 |
| Build must succeed | §10.12, §11 |
| JSDoc + usage example with 2–3 items | §2.5/§2.6 JSDoc, §8 doc §9 |
| Explicit note that behaviour comes from ng-bootstrap | §2.6, §8 §13, README row |
| Minimal wrapper tests only | §7 |

---

## 13. Risks / notes

- **ng-bootstrap v21 `static: true` ContentChild** — re-confirmed in source (lines 378, 390-392 of the accordion bundle). Reinforces why Option B (item-wrapper component) was dropped. Document in JSDoc + docs so future maintainers do not reintroduce it.
- **`effect()` for re-forwarding** — required because `hostDirectives` input forwarding is compile-time only and does not react to later input signal changes; same pattern as `CbaPopover`/`CbaDropdown`.
- **Bootstrap chevron** — kept as default SVG for v1 to avoid regenerating the asset with token colours. If design later requires a colour-matched chevron, override `.accordion-button::after` background-image in `_accordion.scss` using currentColor, and set the button `color` token (already themed).
- **`disable` state naming** — ng-bootstrap uses `disabled` on `NgbAccordionItem`; the wrapper does not expose an item-level API (consumers bind `[disabled]` directly on `<div ngbAccordionItem>`). The container-level `disabled` concept does not exist on ng-bootstrap accordion, so no container `disabled` input is exposed (unlike `CbaDropdown`).