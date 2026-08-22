# Task 1 Code Simplification Report

**Component:** `ModuleContainerComponent`
**Files reviewed:**
- `src/components/module-container/module-container.component.ts`
- `src/components/module-container/module-container.component.scss`
- `src/components/module-container/module-container.component.spec.ts`
- `docs/CBA_MODULE_CONTAINER.md`

## Overall assessment

The implementation is already small and well-structured. The main simplification opportunities are **documentation noise** (overly verbose JSDoc in the TypeScript file and task/round markers in the SCSS file) and **minor test boilerplate** (repeated `setup()` calls and input-change patterns). No structural or architectural changes are needed.

---

## 1. `src/components/module-container/module-container.component.ts`

### Issue: class-level JSDoc is ~77 lines and largely duplicates `docs/CBA_MODULE_CONTAINER.md`

The long block before `@Component` repeats content projection rules, fullscreen behaviour, scroll behaviour, and API details that already live in the dedicated doc. This makes the file harder to scan and increases maintenance surface.

**Suggestion:** Compress the class JSDoc to a short summary, a minimal usage example, and `@see` links. Keep the per-input JSDoc, but make each one a single paragraph.

**Concrete change:**
- Remove lines 20–43 (content projection / fullscreen / scroll detail) and lines 72–76 (`@see` list can stay, but trimmed).
- Keep the one-paragraph summary (lines 11–19) and the usage example (lines 46–70).
- Per-input JSDoc: keep the first paragraph and the `@default` line; remove bullet lists that map values to host classes (the doc file already covers this).

**Target state example:**

```ts
/**
 * Wrapper that hosts a projected module header, MFE body, and optional footer
 * inside the Shell workspace. State is driven by inputs and reflected as host
 * modifier classes; the Shell owns the source of truth.
 *
 * @usageNotes
 * ```html
 * <cba-module-container
 *   [size]="size"
 *   [isCollapsed]="isCollapsed"
 *   [isFullscreen]="isFullscreen"
 *   [padding]="padding"
 *   [scrollChaining]="scrollChaining"
 *   [showHeader]="showHeader">
 *
 *   <cba-module-header cbaModuleContainerHeader title="Customers"></cba-module-header>
 *   <app-customers-mfe></app-customers-mfe>
 *   <cba-module-footer cbaModuleContainerFooter status="loaded"></cba-module-footer>
 * </cba-module-container>
 * ```
 *
 * @see [CBA_MODULE_CONTAINER.md](/docs/CBA_MODULE_CONTAINER.md)
 */
```

Then each input becomes:

```ts
/** Workspace width mode. @default '100%' */
readonly size = input<ModuleContainerSize>('100%');
```

This should reduce the file from ~170 lines to roughly 80–90 lines without losing API discoverability.

---

## 2. `src/components/module-container/module-container.component.scss`

### Issue: SCSS contains implementation-tracking comments (`Task 3`, `Task 4`, `Round 2`, etc.)

Comments like `/* Task 3 — width mode driven by Shell. */`, `/* Task 4 — chrome applied only when NOT fullscreen. */`, `/* Round 2 — footer band never scrolls... */` are leftover process markers. They do not help future readers and become stale as task numbers lose meaning.

**Suggestion:** Replace task/round comments with neutral section headers that describe what the rules do.

**Concrete change:**

| Current | Replacement |
|---------|-------------|
| `/* Task 3 — width mode driven by Shell. */` | `/* Width modes */` |
| `/* Task 4 — chrome applied only when NOT fullscreen. */` | `/* Module chrome (suppressed in fullscreen) */` |
| `/* Task 7 — header band never scrolls, never shrinks. */` | `/* Header band */` |
| `/* Task 6 — body is the internal scroll container while expanded. */` | `/* Body scroll container */` |
| `/* Round 2 — footer band never scrolls... */` | `/* Footer band */` |
| `/* Task 5 — padding modifiers (body only, host-driven). */` | `/* Body padding modifiers */` |
| `/* Task 1 (Round 2) — opt-in scroll chaining. */` | `/* Scroll chaining modifier */` |
| `/* Task 1 — visual header visibility toggle... */` | `/* Header visibility modifier */` |

### Optional: hover scrollbar width change

Lines 65–68 widen the WebKit scrollbar from `6px` to `9px` on hover. This can cause a small layout shift. If the design system does not require it, simplify to a single width and only change thumb color on hover.

**If approved, change:**

```scss
&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

&::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
}

&:hover::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-strong);
}
```

And remove the `&:hover::-webkit-scrollbar` block and the associated `prefers-reduced-motion` media query (lines 83–89), since the width no longer changes.

**Only do this if the spec/brief confirms hover width change is not required.** If uncertain, leave it as-is and note it for the caller.

---

## 3. `src/components/module-container/module-container.component.spec.ts`

### Issue: every test calls `setup()` explicitly

The `setup()` helper is called at the start of every `it` block. This is repetitive and easy to forget when adding new tests.

**Suggestion:** Move `setup()` into `beforeEach` and remove the `setup()` calls from individual tests.

**Concrete change:**

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ModuleContainerComponent],
  }).compileComponents();
});

beforeEach(() => {
  fixture = TestBed.createComponent(ModuleContainerComponent);
  fixture.detectChanges();
});
```

Then remove `setup();` from each `it` block.

### Issue: repeated `fixture.componentRef.setInput(...)` + `fixture.detectChanges()` pattern

This two-line pattern appears six times.

**Suggestion:** Add a small typed helper.

**Concrete change:**

```ts
function setInput<T extends keyof ModuleContainerComponent>(
  name: T,
  value: ModuleContainerComponent[T] extends InputSignal<infer V> ? V : never,
): void {
  fixture.componentRef.setInput(name, value);
  fixture.detectChanges();
}
```

If inferring the input type is too complex for a junior implementer, use a simpler object helper:

```ts
function setInputs(inputs: Partial<Record<string, unknown>>): void {
  Object.entries(inputs).forEach(([name, value]) => {
    fixture.componentRef.setInput(name, value);
  });
  fixture.detectChanges();
}
```

Then replace patterns like:

```ts
fixture.componentRef.setInput('size', '50%');
fixture.detectChanges();
```

with:

```ts
setInput('size', '50%');
// or
setInputs({ size: '50%' });
```

### Issue: `bodyIsRendered()` is only used once

It is a thin wrapper around `bodyRegion() !== null` and is only called in the collapse test. Inlining it removes an unnecessary helper.

**Concrete change:**
- Replace `expect(bodyIsRendered()).toBe(true);` with `expect(bodyRegion()).not.toBeNull();`
- Replace `expect(bodyIsRendered()).toBe(false);` with `expect(bodyRegion()).toBeNull();`
- Remove the `bodyIsRendered()` helper.

---

## 4. `docs/CBA_MODULE_CONTAINER.md`

### Issue: the "container never mutates state" statement is repeated

It appears in the `Inputs` section (line 109) and again in `Non-goals` (line 178). Repetition does not add value in a single doc page.

**Suggestion:** Keep the sentence in `Inputs` and remove the third bullet from `Non-goals`, or vice versa. The `Inputs` paragraph is the more natural place.

### Issue: the TypeScript host example includes unrelated handler (`onRemove`) and a `status` input bound to `cba-module-header`

These details are about `ModuleHeaderComponent`, not `ModuleContainerComponent`, and can distract from the container usage example.

**Suggestion:** Remove `onRemove()`, the `status="loaded"` binding on the header, and the `(remove)` event. Keep only the inputs and handlers that are actually used by the container example (`size`, `isCollapsed`, `isFullscreen`, `padding`, `onCollapse`, `onSizeChange`, `onFullscreen`).

---

## Recommended execution order

1. **SCSS cleanup** — lowest risk, removes stale comments.
2. **Spec refactor** — `beforeEach` + helper + inline single-use helper; run tests after.
3. **TS JSDoc trim** — cosmetic, no behaviour change.
4. **Docs minor tightening** — remove duplicate sentence and trim host example.

## What should NOT be changed

- Do not change the host binding logic in the TypeScript file; the current string expressions are the idiomatic Angular way for this component.
- Do not extract mixins or maps for the two size classes or three padding classes; the current explicit selectors are easier to read and search.
- Do not change the template HTML (it was not in the changed-files list and is already minimal).
- Do not change the public API (input names, types, defaults, or host class names).

## Report path

`.kilo/plans/20260821-task1-simplify.md`
