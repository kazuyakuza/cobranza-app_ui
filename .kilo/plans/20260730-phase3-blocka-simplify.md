<!--
  FILE: 20260730-phase3-blocka-simplify.md
  PURPOSE: Simplification suggestions for Block A implementation of
           ModuleContainerComponent.
  AUDIENCE: Code Reviewer, Implementer (4.3-fix), Plan Adherence (4.5b).
  SCOPE: Files produced by Block A implementation (4.2) of
         .kilo/plans/20260730-phase3-blocka.md.
-->

# Block A Simplification Suggestions

## Files reviewed

- `src/lib/components/module-container/module-container.component.ts`
- `src/lib/components/module-container/module-container.component.html`
- `src/lib/components/module-container/module-container.component.scss`
- `src/lib/components/module-container/module-container.types.ts`
- `src/lib/components/module-container/index.ts`
- `src/lib/public-api.ts`

## Overall assessment

The implementation is clean, follows the plan, and complies with the project
rules. Only two simplifications are proposed; both are optional and do not
change public API or behaviour.

---

## Suggestion 1: Flatten the DOM by removing the inner `<section>` wrapper

### Current state

```html
<!-- module-container.component.html -->
<section class="cba-module-container">
  <div class="cba-module-container__header">
    <ng-content select="[cbaModuleContainerHeader]"></ng-content>
  </div>

  @if (!isCollapsed()) {
    <div class="cba-module-container__body">
      <ng-content></ng-content>
    </div>
  }
</section>
```

```scss
/* module-container.component.scss */
:host {
  display: flex;
  flex-direction: column;
}

.cba-module-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
```

The host element (`<cba-module-container>`) and the inner `<section>` both set
`display: flex; flex-direction: column;`. The section exists only to carry the
block class `cba-module-container`. This is one DOM layer more than necessary.

### Proposed change

Move the `cba-module-container` class to the host element and remove the
`<section>` wrapper.

**`module-container.component.ts`** — add the host class binding:

```ts
@Component({
  selector: 'cba-module-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-container.component.html',
  styleUrl: './module-container.component.scss',
  host: {
    'class': 'cba-module-container',
    '[class.cba-module-container--size-50]': "size() === '50%'",
    '[class.cba-module-container--size-100]': "size() === '100%'",
    '[class.cba-module-container--collapsed]': 'isCollapsed()',
    '[class.cba-module-container--fullscreen]': 'isFullscreen()',
    '[class.cba-module-container--padding-none]': "padding() === 'none'",
    '[class.cba-module-container--padding-sm]': "padding() === 'sm'",
    '[class.cba-module-container--padding-md]': "padding() === 'md'",
  },
})
```

**`module-container.component.html`** — remove the wrapper:

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

**`module-container.component.scss`** — combine into a single host rule:

```scss
/**
 * ModuleContainer component styles.
 *
 * Block A scope: only the host layout rule needed for the projected
 * header + body to render sensibly. All size / chrome / padding / scroll
 * behaviour is implemented in Block B using the host modifier classes
 * bound in module-container.component.ts:
 *
 *   .cba-module-container--size-50 / --size-100
 *   .cba-module-container--collapsed
 *   .cba-module-container--fullscreen
 *   .cba-module-container--padding-none / --padding-sm / --padding-md
 */
:host {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
```

### Why this is simpler

- Removes one DOM element per module instance.
- Eliminates duplicated `display: flex; flex-direction: column;` declarations.
- Places the BEM block class and its modifiers on the same element, which is
the standard BEM pattern and makes Block B selectors more direct:
  `:host(.cba-module-container--size-50)` instead of
  `:host(.cba-module-container--size-50) .cba-module-container`.

### Caveats / migration notes

- Block B will need to target `:host` instead of the inner `.cba-module-container`
  element for layout rules.
- The public selector, inputs, and projection slots remain unchanged.

---

## Suggestion 2: Trim the class JSDoc

### Current state

The class-level JSDoc is informative but contains redundant paragraphs that
overlap with the JSDoc already present on the individual inputs.

### Proposed change

Keep the required `@usageNotes` and `@see` tags, but condense the narrative
section:

```ts
/**
 * Wrapper that hosts a projected module header + the MFE body inside the
 * Shell workspace.
 *
 * State is driven entirely by inputs and reflected on the host as modifier
 * classes for Block B to style. The header slot is projected via
 * `[cbaModuleContainerHeader]`; the default slot hosts the body. When
 * `isCollapsed` is `true`, the body is removed from the DOM.
 *
 * @usageNotes
 * ```html
 * <cba-module-container
 *   [size]="size"
 *   [isCollapsed]="isCollapsed"
 *   [isFullscreen]="isFullscreen"
 *   [padding]="padding">
 *
 *   <cba-module-header
 *     cbaModuleContainerHeader
 *     title="Customers"
 *     [size]="size"
 *     [isCollapsed]="isCollapsed"
 *     [isFullscreen]="isFullscreen">
 *   </cba-module-header>
 *
 *   <app-customers-mfe></app-customers-mfe>
 * </cba-module-container>
 * ```
 *
 * @see {@link ModuleContainerSize}
 * @see {@link ModuleContainerPadding}
 * @see {@link ModuleHeaderComponent}
 */
```

### Why this is simpler

- Reduces the class JSDoc from ~40 lines to ~25 lines without losing the
  usage example, projection contract, or cross-references.
- Removes the redundant "Exported from `@cobranza-apps/ui`..." sentence.
- Keeps the input-level JSDoc as the authoritative source for each input's
  purpose.

---

## Suggestion 3: No changes

The following files are already minimal and need no simplification:

- `module-container.types.ts` — compact type aliases with clear documentation.
- `module-container/index.ts` — standard barrel re-export.
- `src/lib/public-api.ts` — alphabetical, single-line addition; no duplication.

The host modifier class map in `module-container.component.ts` is repetitive
but explicit. Collapsing it into a computed class object would add more code
(computed signal + helper) and reduce readability, so it is not recommended.

---

## Recommended action

Apply Suggestion 1 (DOM flattening) and Suggestion 2 (JSDoc trim) if the team
agrees they are within Block A scope. Both preserve the public API, inputs,
projection slots, and all host modifier classes.
