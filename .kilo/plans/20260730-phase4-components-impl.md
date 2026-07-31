# Phase 4 — Core Presentational Components — Implementation Plan

> Source of truth: `.kilo/plans/20260730-phase4-components-frontend-spec.md` (4.1a front-end spec) and `.agent/todos/20260730/20260730-todo-2.md` sections 1–5.
> Branch: `feat/phase4-core-components`. Source root: `src/` (already moved out of `src/lib/`).
> This plan is **Plan-only** (architector step 4.1b). No code is written here.

---

## 0. Reference facts gathered from the codebase

- Existing components live under `src/components/<name>/` and follow this file shape:
  - `<name>.component.ts`, `<name>.component.html`, `<name>.component.scss`, `<name>.component.spec.ts`, `<name>.types.ts`, `index.ts` (barrel).
  - `module-header/index.ts` exports `./module-header.types` AND `./module-header.component`. The five new `index.ts` barrels currently export `{}` — they must add `export * from './cba-<name>.component'` (and the `.types.ts` where present).
- Component class naming: spec defines class names `CbaButtonComponent`, `CbaCardComponent`, `CbaBadgeComponent`, `CbaEmptyStateComponent`, `CbaSkeletonComponent`. Note that README/USAGE currently reference short names `CbaButton`, `CbaCard`, etc. — those are doc-only aliases; the exported class is the `…Component` form. Docs step (§5) must keep the inventory aliases consistent with the real exported class names.
- Testing pattern (from `module-header.component.spec.ts`):
  - `TestBed.configureTestingModule({ imports: [...] }).compileComponents()`.
  - `fixture = TestBed.createComponent(...)`, `fixture.componentRef.setInput(...)`, `fixture.detectChanges()`.
  - Outputs are signal `output<T>()`; in tests subscribe with `component.<output>.subscribe(...)`.
  - DOM assertions use `fixture.nativeElement.querySelector(...)`.
  - Importing a component that depends on `FaIconComponent` requires adding `FaIconComponent` to the spec `imports` (the module-header spec does NOT import FaIconComponent explicitly because it imports the component which itself imports FaIconComponent; Angular standalone transitive imports are sufficient. The Button spec will import `CbaButtonComponent` only — `FaIconComponent` is transitively available. No `provideIcon`/library setup is required for these rendering tests because icons render via the component; tests assert presence/absence of host classes and emitted events, not icon SVG internals).
- Theme tokens actually available in `src/theme/_variables.scss` (used by every SCSS file below):
  - Bg: `--cba-bg-primary/secondary/tertiary/elevated/overlay`.
  - Text: `--cba-text-primary/secondary/muted/inverse`.
  - Border: `--cba-border-subtle/default/strong`.
  - Accent: `--cba-accent-primary/success/warning/danger/info`.
  - States: `--cba-hover`, `--cba-active`, `--cba-focus-ring` (a full `box-shadow` value).
  - Radius: `--cba-radius-sm/md/lg`.
  - Shadow: `--cba-shadow-module/elevated`.
  - Space: `--cba-space-1..8`.
- Mixins available in `src/theme/_mixins.scss`: `@include cba-focus-ring`, `@include cba-elevated-surface`, `@include cba-hover-surface`. Reuse `cba-focus-ring` in the Button SCSS.
- `src/public-api.ts` currently exports `./components/module-header` and `./components/module-container` only.
- FontAwesome already declared in `package.json` `peerDependencies` and `devDependencies` (`@fortawesome/angular-fontawesome` ^5.1.0 dev, peer ^5.0.0; `fontawesome-svg-core` ^7.3.0; `free-solid-svg-icons` ^7.3.1). **No new dependencies are required.** Only `CbaButton` imports `FaIconComponent` + `faSpinner`. `CbaEmptyState` uses content projection for the icon, so it does NOT import `FaIconComponent`.
- The 5 component folders already exist with placeholder `index.ts` (exporting `{}`). The implementer must NOT recreate the folders; just add the listed files and update the existing barrel.

### Key spec-vs-docs reconciliations (mandatory during the Documentation step §5)

The existing `docs/USAGE.md` was written before the front-end spec and contains examples that **contradict** the authoritative spec API. The Documentation step MUST correct:

| Doc (current) | Authoritative spec | Action |
| --- | --- | --- |
| `<cba-button ... (clicked)="...">` | output name is **`click`** (`output<void>()`) | Change `(clicked)` → `(click)` everywhere. |
| `<cba-badge variant="success" style="solid">` | input is **`appearance`** (`'solid'\|'outline'`) | Change `style="solid"` → `appearance="solid"`. Also add `neutral`/`primary`/`info` variants. |
| `<cba-card> <div header>…</div> <div footer>…</div> </cba-card>` | projection attributes are **`[cbaCardHeader]`** / **`[cbaCardFooter]`** | Change `header`/`footer` attributes to `cbaCardHeader`/`cbaCardFooter`. |
| `<cba-empty-state icon="inbox" title="…" description="…" >` | `title` and `description` are inputs; `icon` and `action` are content projection slots (`[cbaEmptyStateIcon]`, `[cbaEmptyStateAction]`) | Remove `icon="…"` attribute; show `<fa-icon cbaEmptyStateIcon …/>` inside; keep `title`/`description` as attributes. |
| `<cba-skeleton variant="text" [lines]="3">`, `[columns]="5"` | `CbaSkeleton` has NO `lines`/`columns` inputs (only `variant`, `width`, `height`) | Remove `[lines]`/`[columns]`; show `width`/`height` overrides instead. |
| Badge variant list `success, warning, danger, info, secondary` (docs) | Spec variants: `primary, success, warning, danger, info, neutral` | Update variant list in docs. |

These corrections belong to step 4.4 (Documentation, docs-specialist). They are recorded here so the implementer **does not** change docs and so later steps know the contract. The Implementation step (4.2) follows the spec exactly.

---

## 1. File structure (exact paths)

> Backslash paths are Windows; repo uses forward slashes inside source. Each folder already exists except `skeleton/` placeholder exists too.

```
src/components/button/
  cba-button.component.ts
  cba-button.component.html
  cba-button.component.scss
  cba-button.component.spec.ts
  button.types.ts
  index.ts                       (exists, update)
src/components/card/
  cba-card.component.ts
  cba-card.component.html
  cba-card.component.scss
  cba-card.component.spec.ts
  index.ts                       (exists, update)   — no .types.ts (no inputs)
src/components/badge/
  cba-badge.component.ts
  cba-badge.component.html
  cba-badge.component.scss
  cba-badge.component.spec.ts
  badge.types.ts
  index.ts                       (exists, update)
src/components/empty-state/
  cba-empty-state.component.ts
  cba-empty-state.component.html
  cba-empty-state.component.scss
  cba-empty-state.component.spec.ts
  index.ts                       (exists, update)   — no .types.ts (no union types)
src/components/skeleton/
  cba-skeleton.component.ts
  cba-skeleton.component.html
  cba-skeleton.component.scss
  cba-skeleton.component.spec.ts
  skeleton.types.ts
  index.ts                       (exists, update)

src/public-api.ts                (update — add 5 exports)
docs/
  CBA_BUTTON.md                  (new)
  CBA_CARD.md                    (new)
  CBA_BADGE.md                   (new)
  CBA_EMPTY_STATE.md             (new)
  CBA_SKELETON.md                (new)
  USAGE.md                       (update — reconcile with spec)
README.md                         (update — component inventory + docs links)
```

Notes:
- `card` and `empty-state` have no union-type inputs, so a separate `<name>.types.ts` is not strictly required. The spec lists no `*.types.ts` for `card` or `empty-state`. Do NOT create one for them (avoid dead files).
- Each component's template and styles are external files (`templateUrl` / `styleUrl`), matching `module-header` and `module-container`.

---

## 2. Implementation order

Recommended order (rationale):

1. **CBA Button** — Most inputs/outputs; introduces the `FaIconComponent` import + `faSpinner` pattern that later a11y/doc work depends on. Establishes the host-class modifier pattern used by Badge/Skeleton.
2. **CBA Badge** — Pure signal-input + host-class modifier pattern (no projection, no Fa). Cheapest; doubles as a sanity check for the host-class build pipeline and `public-api` export round-trip.
3. **CBA Card** — Introduces multi-slot content projection (`[cbaCardHeader]`, default, `[cbaCardFooter]`) and the `:empty` hide pattern reused by EmptyState. No inputs.
4. **CBA EmptyState** — Reuses Card's content-projection pattern, adds a `input.required()` (title) and optional input (description) for the first time in a projection-heavy component.
5. **CBA Skeleton** — Last because it is the only component with a template `@switch` (multiple DOM cases), inline style bindings, and a keyframe animation; depends on no other component and is the most template-heavy.

Commit after each component (TS+HTML+SCSS+SPEC+barrel+public-api line) so each is independently verifiable: `npm test -- <spec path>` then `npm run build` once at the end.

---

## 3. Per-component detailed steps

For every component, perform the same sub-sequence:

a. Create `<name>.types.ts` (when applicable).
b. Create `cba-<name>.component.ts` (the `@Component` + class).
c. Create `cba-<name>.component.html`.
d. Create `cba-<name>.component.scss`.
e. Create `cba-<name>.component.spec.ts`.
f. Update `index.ts` barrel (replace `export {}` body with the spec's export line(s)).
g. Add the `export * from './components/<name>'` line to `src/public-api.ts`.
h. Run `npm test -- src/components/<name>` green; commit.

Cross-cutting rules to apply to every file:
- `standalone: true`, `changeDetection: ChangeDetectionStrategy.OnPush`.
- Inputs: `input<T>(...)` / `input.required<T>()`; outputs: `output<T>()`.
- Host modifier classes via the `host` object (never `@HostBinding`).
- SCSS: only `--cba-*` tokens; reuse `@include cba-focus-ring;` mixin in Button. No hard-coded colors.
- Max 2 params per function/method, max 50-line method bodies, max 200-line source files.
- Private members by default; template-referenced icons are `protected readonly`.
- No commented-out code. Self-documenting names.
- JSDoc on the class and on every public input/output (see `module-header.component.ts` style).
- Keep one concept per file; do not exceed 200 lines.

---

### 3.1 CbaButton

#### a. `src/components/button/button.types.ts`
```ts
export type CbaButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type CbaButtonSize = 'sm' | 'md';
export type CbaButtonType = 'button' | 'submit' | 'reset';
export type CbaButtonIconPosition = 'leading' | 'trailing';
```
Add file-level JSDoc comment block describing the four unions and pointing to `docs/CBA_BUTTON.md`.

#### b. `src/components/button/cba-button.component.ts`
- Imports: `ChangeDetectionStrategy`, `Component`, `input`, `output` from `@angular/core`; `FaIconComponent` from `@fortawesome/angular-fontawesome`; `IconDefinition` from `@fortawesome/fontawesome-svg-core`; `faSpinner` from `@fortawesome/free-solid-svg-icons`; types from `./button.types`.
- `@Component({ selector: 'cba-button', standalone: true, imports: [FaIconComponent], changeDetection: OnPush, templateUrl: './cba-button.component.html', styleUrl: './cba-button.component.scss', host: { ... } })` with host bindings:
  - `'class': 'cba-button'`
  - `[class.cba-button--primary]`: `"variant() === 'primary'"`
  - `[class.cba-button--secondary]`: `"variant() === 'secondary'"`
  - `[class.cba-button--ghost]`: `"variant() === 'ghost'"`
  - `[class.cba-button--danger]`: `"variant() === 'danger'"`
  - `[class.cba-button--success]`: `"variant() === 'success'"`
  - `[class.cba-button--sm]`: `"size() === 'sm'"`
  - `[class.cba-button--md]`: `"size() === 'md'"`
  - `[class.cba-button--loading]`: `'loading()'`
  - `[class.cba-button--disabled]`: `'isDisabled()'`
- Class `CbaButtonComponent`:
  - `readonly variant = input<CbaButtonVariant>('primary');` + JSDoc.
  - `readonly size = input<CbaButtonSize>('md');` + JSDoc.
  - `readonly loading = input<boolean>(false);` + JSDoc.
  - `readonly disabled = input<boolean>(false);` + JSDoc.
  - `readonly type = input<CbaButtonType>('button');` + JSDoc.
  - `readonly icon = input<IconDefinition | null>(null);` + JSDoc.
  - `readonly iconPosition = input<CbaButtonIconPosition>('leading');` + JSDoc.
  - `readonly click = output<void>();` + JSDoc (an AI-agent note explaining this is a re-emission of the internal native `<button>` click so consumers get a single click channel).
  - `protected readonly isDisabled = () => this.disabled() || this.loading();` (arrow fn so the template can call it as `isDisabled()`; kept as a method, no extra params). JSDoc.
  - `protected readonly faSpinner = faSpinner;` (template-referenced). JSDoc.
- Add a JSDoc block on the class with `@usageNotes` showing each variant + loading + leading/trailing icon usage; link to `docs/CBA_BUTTON.md`.

> **Note on output name `click`:** custom DOM elements named `click` events are fine because Angular standalone components dispatch custom events; the native `click` still bubbles via the inner `<button>`. The component re-emits a normalized `click` output. This matches the spec exactly and is intentional. Do not rename it.

#### c. `src/components/button/cba-button.component.html`
Exact template from the spec (§1 template):
```html
<button
  type="button"
  class="cba-button__control"
  [attr.type]="type()"
  [disabled]="isDisabled()"
  [attr.aria-busy]="loading() || null"
  [attr.aria-disabled]="isDisabled() || null"
  (click)="click.emit()">
  @if (loading()) {
    <fa-icon class="cba-button__icon cba-button__icon--spinner" [icon]="faSpinner" animation="spin" aria-hidden="true" />
  }
  @if (!loading() && icon() && iconPosition() === 'leading') {
    <fa-icon class="cba-button__icon cba-button__icon--leading" [icon]="icon()" aria-hidden="true" />
  }
  <span class="cba-button__label">
    <ng-content></ng-content>
  </span>
  @if (!loading() && icon() && iconPosition() === 'trailing') {
    <fa-icon class="cba-button__icon cba-button__icon--trailing" [icon]="icon()" aria-hidden="true" />
  }
</button>
```
- Static `type="button"` prevents accidental form submit during hydration; `[attr.type]` then binds to `type()`.
- Loading spinner replaces the leading icon slot but the label stays so layout is stable.

#### d. `src/components/button/cba-button.component.scss`
Use the spec SCSS (§1 SCSS) verbatim — it already uses only `--cba-*` tokens and a `prefers-reduced-motion` block. One improvement: replace the manual `:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }` with `@include cba-focus-ring;` (from `src/theme/_mixins.scss`) by adding `@use '../../../theme/mixins' as cba-mixins;`? — **Decision**: do NOT introduce cross-folder SCSS `@use` (existing components did not). Keep the inline `box-shadow: var(--cba-focus-ring)` as in the spec to match the existing per-component SCSS convention (each `.scss` is self-contained, tokens are global CSS vars). This avoids ng-packagr SCSS path pitfalls. Keep the spec SCSS exactly.

Verify token usage: `--cba-space-2`, `--cba-radius-sm`, `--cba-focus-ring`, `--cba-space-1`, `--cba-space-3`, `--cba-space-4`, `--cba-accent-primary/danger/success`, `--cba-text-inverse`, `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-text-primary`, `--cba-hover`, `--cba-active`. All exist in `_variables.scss`. Good. Add the `prefers-reduced-motion` block that disables transitions and `.fa-spin`.

#### e. `src/components/button/cba-button.component.spec.ts`
Structure (mirrors `module-header.component.spec.ts`):
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent } from './cba-button.component';

describe('CbaButtonComponent', () => {
  let fixture: ComponentFixture<CbaButtonComponent>;

  function setup(): CbaButtonComponent {
    fixture = TestBed.createComponent(CbaButtonComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function control(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button.cba-button__control');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CbaButtonComponent] }).compileComponents();
  });

  it('renders the projected label inside the native button', () => { ... });
  it('emits click when the button is clicked and enabled', () => { ... });
  it('does not emit click when disabled is true', () => { ... });
  it('does not emit click when loading is true', () => { ... });
  it('applies the cba-button--primary class by default', () => { ... });
  it('applies the variant host class for each variant', () => { ... });
  it('applies the size host class for sm and md', () => { ... });
  it('renders a leading icon when icon is provided', () => { ... });
  it('replaces the leading icon with a spinner when loading', () => { ... });
  it('sets aria-busy while loading', () => { ... });
  it('sets the native button type from the type input', () => { ... });
});
```
Test bodies:
- Label: `const host = document.createElement('div'); host.innerHTML` is not used — instead set projected content via `fixture.componentInstance`? Projection in createComponent requires a host component. Use a tiny inline test wrapper component `<test-host><span>Save</span></test-host>` projected through `<cba-button><ng-content></ng-content></cba-button>`? Simpler: use `TestBed.createEnvironment`? The standard approach: create a small `@Component({ selector: 'test-host', imports:[CbaButtonComponent], template: '<cba-button><span>Save</span></cba-button>' })` wrapper, create that, then query. **Decision**: define a local `TestHostComponent` inside the spec (private) and use it as the fixture root, so projected content can be asserted. Tests then query via `fixture.nativeElement`.
  - TestHost:
    ```ts
    @Component({
      standalone: true,
      imports: [CbaButtonComponent],
      template: `<cba-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled" [type]="type" [icon]="icon" [iconPosition]="iconPosition" (click)="onClick()"><span class="label-host">Save</span></cba-button>`,
    })
    class TestHostComponent {
      variant = 'primary';
      size = 'md';
      loading = false;
      disabled = false;
      type = 'button';
      icon = null as IconDefinition | null;
      iconPosition = 'leading' as 'leading' | 'trailing';
      clicked = 0;
      onClick(): void { this.clicked += 1; }
    }
    ```
  - `setup()` creates `TestHostComponent`; `control()` queries `button.cba-button__control`; `button()` queries the host `cba-button` element.
- Emission enabled: `control().click();` → `hostInstance.clicked === 1`.
- Disabled true: set `host.disabled = true; fixture.detectChanges(); control().click();` → `clicked === 0` AND `control().disabled === true`.
- Loading true: set `host.loading = true; fixture.detectChanges();` → assert `control().disabled === true`, click → `clicked === 0`, assert an `fa-icon.cba-button__icon--spinner` exists.
- Variant classes: iterate `['primary','secondary','ghost','danger','success']`, set `host.variant = v; detectChanges;` assert `button().classList.contains(\`cba-button--${v}\`)`. Do all 5 in one test using a loop (each `it` covers one variant OR a single looped test — the TODO says minimal tests, one looped test is fine but counts 5 expectations).
- Size: assert default `--md`; set `sm`, assert `--sm`.
- Leading icon: set `host.icon = faTrashCan;` → assert `button` contains `fa-icon.cba-button__icon--leading`. Set loading true → that leading icon is removed and spinner class present.
- aria-busy: while loading, `control().getAttribute('aria-busy') === 'true'`; while not, attribute is null.
- type: set `host.type = 'submit'` → `control().getAttribute('type') === 'submit'`.

> Use a single looped test for variants to keep the spec file small (TODO: "minimal tests"). Each `it` body must stay ≤ 50 lines and ideally ≤ a handful.

#### f. `src/components/button/index.ts`
Replace `export {}` with:
```ts
export * from './button.types';
export * from './cba-button.component';
```
Keep the existing file-level JSDoc header (it already documents the barrel). Remove the "add `export * from ...`" instruction comment since it is now done.

#### g. `src/public-api.ts`
Add `export * from './components/button';` in alphabetical position (before `card`, after `badge`). See §4.

---

### 3.2 CbaBadge

#### a. `src/components/badge/badge.types.ts`
```ts
export type CbaBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type CbaBadgeAppearance = 'solid' | 'outline';
```
Add file-level JSDoc.

#### b. `src/components/badge/cba-badge.component.ts`
- Imports: `ChangeDetectionStrategy`, `Component`, `input` from `@angular/core`; types from `./badge.types`.
- `host` bindings:
  - `'class': 'cba-badge'`
  - `[class.cba-badge--primary]`: `"variant() === 'primary'"`
  - `[class.cba-badge--success]`, `--warning`, `--danger`, `--info`, `--neutral`
  - `[class.cba-badge--solid]`: `"appearance() === 'solid'"`
  - `[class.cba-badge--outline]`: `"appearance() === 'outline'"`
- Class `CbaBadgeComponent`:
  - `readonly variant = input<CbaBadgeVariant>('neutral');` + JSDoc.
  - `readonly appearance = input<CbaBadgeAppearance>('solid');` + JSDoc.
  - No outputs (non-interactive).
  - Class JSDoc with `@usageNotes` (solid + outline, neutral, primary example) link to `docs/CBA_BADGE.md`.

#### c. `src/components/badge/cba-badge.component.html`
```html
<span class="cba-badge__content" role="status">
  <ng-content></ng-content>
</span>
```

#### d. `src/components/badge/cba-badge.component.scss`
Use the spec SCSS verbatim. Verify tokens: `--cba-accent-primary/success/warning/danger/info`, `--cba-text-inverse`, `--cba-bg-elevated`, `--cba-text-secondary`, `--cba-border-default`, `--cba-text-muted`, `--cba-space-1`, `--cba-space-2` — all exist. `border-radius: 9999px` for the pill is a literal generic value (not a token) — acceptable (no token for full rounding). Keep as in spec.

#### e. `src/components/badge/cba-badge.component.spec.ts`
Use a `TestHostComponent` projecting text:
```ts
@Component({ standalone: true, imports: [CbaBadgeComponent], template: `<cba-badge [variant]="variant" [appearance]="appearance" class="host"><span class="badge-txt">Active</span></cba-badge>` })
class TestHostComponent { variant = 'neutral'; appearance = 'solid'; }
```
Tests (minimal):
- `it('renders the projected badge content')` — assert `.badge-txt` text is `Active`.
- `it('applies the variant host class for each variant')` — loop over the 6 variants, set + detectChanges, assert `classList` contains `cba-badge--<variant>`.
- `it('applies the solid and outline appearance classes')` — assert default `cba-badge--solid`; set `appearance='outline'` → assert `--outline` present and `--solid` absent.
- `it('sets role="status" on the content element')` — assert content `getAttribute('role') === 'status'`.

#### f. `src/components/badge/index.ts`
```ts
export * from './badge.types';
export * from './cba-badge.component';
```

#### g. public-api: `export * from './components/badge';`.

---

### 3.3 CbaCard

#### a. No `*.types.ts`.
#### b. `src/components/card/cba-card.component.ts`
- Imports: `ChangeDetectionStrategy`, `Component` from `@angular/core`.
- `host`: `'class': 'cba-card'` (no modifier classes).
- Class `CbaCardComponent` — empty body. JSDoc `@usageNotes` showing:
  - body-only
  - header+body
  - header+body+footer
  - link to `docs/CBA_CARD.md`.

#### c. `src/components/card/cba-card.component.html`
```html
<article class="cba-card__surface">
  <div class="cba-card__header">
    <ng-content select="[cbaCardHeader]"></ng-content>
  </div>
  <div class="cba-card__body">
    <ng-content></ng-content>
  </div>
  <div class="cba-card__footer">
    <ng-content select="[cbaCardFooter]"></ng-content>
  </div>
</article>
```

#### d. `src/components/card/cba-card.component.scss`
Spec SCSS verbatim. Verify tokens: `--cba-bg-secondary`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-space-3`, `--cba-space-4` — all exist. `:empty` hides header/footer. No hover elevation.

> Implementation note: `:empty` only matches when the element has NO child nodes (including text). Because `<ng-content>` is replaced by projected nodes, an unprojected slot yields an empty `<div>` → matched. Good. The implementer should NOT add whitespace text inside those divs in the HTML (Angular may render comments from `ng-content` — Angular emits comment anchors, which DO count as child nodes and break `:empty`!). **Mitigation**: Use a `@if`-guarded projection is not possible with `ng-content`. Alternative: instead of relying on `:empty`, add host-binding logic? The spec explicitly chose `:empty`. Need to verify behavior. **Decision**: Test empirically; if `:empty` fails due to Angular comment anchors, fall back to a `[hidden]`-style approach using a template reference and a `@if` with `@ContentChild`/`hasProjected` computed signal. But the spec mandates `:empty`. The recommended approach: test first; if jsdom/real Angular comments break `:empty`, escalate to caller (do not silently change the API). Record this as a known risk in the Verification step.

  → **Recommended lighter fix that keeps the spec API**: Wrap each slot's projected `ng-content` in `@if` with a content-child signal. Since `ng-content` cannot be conditional easily without `@ContentChild`, and to keep the component thin, prefer to keep `:empty` and verify. If verification shows comments break it, the implementer must report and request guidance. Do not improvise.

#### e. `src/components/card/cba-card.component.spec.ts`
```ts
@Component({ standalone: true, imports: [CbaCardComponent], template: `<div class="root"></div>` })
```
Better: three test host templates — one for body-only, one for header+body+footer. Use a single `TestHostComponent` with a `mode` input and `@if` in template, OR three separate host components (one per projection shape) — clearer. **Decision**: three minimal inline host components:
- `CardBodyOnlyHost` template: `<cba-card><p class="body">B</p></cba-card>`.
- `CardWithHeaderFooterHost` template: `<cba-card><div cbaCardHeader class="h">H</div><p class="body">B</p><div cbaCardFooter class="f">F</div></cba-card>`.

Tests:
- `it('projects the body via the default slot')` — render `CardBodyOnlyHost`, assert `.body` present inside `.cba-card__body`.
- `it('renders header and footer only when projected')` — render `CardWithHeaderFooterHost`, assert `.h` inside `.cba-card__header` and `.f` inside `.cba-card__footer`.
- `it('hides header/footer regions when nothing is projected')` — render `CardBodyOnlyHost`:
  - Resolve via `getComputedStyle(headerEl).display === 'none'` (the CSS `:empty` rule).
  - **Fallback assertion if `:empty` is broken by Angular anchors**: assert `headerEl.children.length === 0` (region empty of projected nodes) and add a JSDoc-style `// NOTE: see plan §3.3 risk` comment? NO — no commented code, no. Instead, if the test fails, escalate per the note above. The spec test says "header/footer regions are empty and hidden when no content is projected" — implementer writes the `getComputedStyle` assertion; if it fails, escalate.
- `it('renders the card surface with the expected class')` — assert `.cba-card__surface` present.

#### f. `src/components/card/index.ts`
```ts
export * from './cba-card.component';
```

#### g. public-api: `export * from './components/card';`.

---

### 3.4 CbaEmptyState

#### a. No `*.types.ts`.
#### b. `src/components/empty-state/cba-empty-state.component.ts`
- Imports: `ChangeDetectionStrategy`, `Component`, `input` from `@angular/core`.
- `host`: `'class': 'cba-empty-state'`.
- Class `CbaEmptyStateComponent`:
  - `readonly title = input.required<string>();` + JSDoc.
  - `readonly description = input<string>('');` + JSDoc.
  - Class JSDoc `@usageNotes` with icon (projected) + title + description + action example; link `docs/CBA_EMPTY_STATE.md`.

#### c. `src/components/empty-state/cba-empty-state.component.html`
```html
<div class="cba-empty-state__layout">
  <div class="cba-empty-state__icon">
    <ng-content select="[cbaEmptyStateIcon]"></ng-content>
  </div>
  <h3 class="cba-empty-state__title">{{ title() }}</h3>
  @if (description()) {
    <p class="cba-empty-state__description">{{ description() }}</p>
  }
  <div class="cba-empty-state__action">
    <ng-content select="[cbaEmptyStateAction]"></ng-content>
  </div>
</div>
```

#### d. `src/components/empty-state/cba-empty-state.component.scss`
Spec SCSS verbatim. Tokens: `--cba-space-4`, `--cba-space-8`, `--cba-text-muted`, `--cba-text-primary`, `--cba-space-2` — all present. `:empty` hides optional icon/action.

#### e. `src/components/empty-state/cba-empty-state.component.spec.ts`
Uses a `TestHostComponent`:
```ts
@Component({
  standalone: true,
  imports: [CbaEmptyStateComponent, FaIconComponent],
  template: `<cba-empty-state [title]="title" [description]="description">
    <fa-icon cbaEmptyStateIcon [icon]="icon" aria-hidden="true"></fa-icon>
    <cba-button cbaEmptyStateAction (click)="onClick()">Reset</cba-button>
  </cba-empty-state>`,
  imports: [CbaEmptyStateComponent, FaIconComponent, CbaButtonComponent],
})
class TestHostComponent {
  title = 'No items';
  description = '';
  icon = faInbox;
  clicked = 0;
  onClick(): void { this.clicked += 1; }
}
```
**(CbaButton is used inside the action slot — the host must import `CbaButtonComponent` too.)** To avoid coupling tests across components, the action projection can also project a plain `<button cbaEmptyStateAction>` instead. **Decision**: use a plain `<button cbaEmptyStateAction class="action-btn">Reset</button>` to keep the EmptyState spec independent of the Button spec. Icon projection uses `fa-icon cbaEmptyStateIcon` with `faInbox` (the host imports `FaIconComponent` — available since it is a peer/dev dep).

Tests (minimal):
- `it('renders the required title as an h3')` — assert `.cba-empty-state__title` text === input title, tagName === `H3`.
- `it('does not render the description element when description is empty')` — set `description=''`, detectChanges, assert `querySelector('.cba-empty-state__description')` is null.
- `it('renders the description element when provided')` — set `description='Try adjusting filters'`, assert text present.
- `it('projects the icon and action slots')` — assert `fa-icon[cbaEmptyStateIcon]` and `button[cbaEmptyStateAction]` are present.
- `it('hides the icon/action regions when not projected')` — a separate `TestHostComponent` rendering only `<cba-empty-state [title]="'X'"></cba-empty-state>` and asserting `getComputedStyle`. Apply same `:empty`-anchor risk as Card.

#### f. `src/components/empty-state/index.ts`
```ts
export * from './cba-empty-state.component';
```

#### g. public-api: `export * from './components/empty-state';`.

---

### 3.5 CbaSkeleton

#### a. `src/components/skeleton/skeleton.types.ts`
```ts
export type CbaSkeletonVariant = 'text' | 'avatar' | 'card' | 'table-row' | 'generic';
```
Add file-level JSDoc listing each variant's intent.

#### b. `src/components/skeleton/cba-skeleton.component.ts`
- Imports: `ChangeDetectionStrategy`, `Component`, `input` from `@angular/core`; type from `./skeleton.types`.
- `host` variant bindings for `text`, `avatar`, `card`, `table-row`, `generic` (per spec §5 host).
- Class `CbaSkeletonComponent`:
  - `readonly variant = input<CbaSkeletonVariant>('generic');` + JSDoc.
  - `readonly width = input<string | null>(null);` + JSDoc.
  - `readonly height = input<string | null>(null);` + JSDoc.
  - Class JSDoc `@usageNotes` with all five variants and `width`/`height` overrides; link `docs/CBA_SKELETON.md`.

#### c. `src/components/skeleton/cba-skeleton.component.html`
Spec template verbatim (`@switch (variant()) { @case ... }`). Inline `[style.width]`/`[style.height]` use `?? 'default'`. The template renders:
- `text`: 3 `.cba-skeleton__line` (3rd carries `--short`).
- `avatar`: 1 circular `.cba-skeleton__shape--avatar`.
- `card`: 1 `.cba-skeleton__shape--card`.
- `table-row`: 4 `.cba-skeleton__cell` (4th `--shrink`).
- `generic` (default): 1 `.cba-skeleton__shape--generic`.

#### d. `src/components/skeleton/cba-skeleton.component.scss`
Spec SCSS verbatim, including `@keyframes cba-skeleton-shimmer` and the `prefers-reduced-motion` block that disables the animation. Tokens: `--cba-bg-secondary`, `--cba-bg-elevated`, `--cba-radius-sm`, `--cba-radius-md`, `--cba-space-2`, `--cba-space-8` — all present. No hard-coded grays.

#### e. `src/components/skeleton/cba-skeleton.component.spec.ts`
```ts
@Component({ standalone: true, imports: [CbaSkeletonComponent], template: `<cba-skeleton [variant]="variant" [width]="width" [height]="height"></cba-skeleton>` })
class TestHostComponent { variant = 'generic'; width: string|null = null; height: string|null = null; }
```
Tests (minimal):
- `it('renders the generic variant by default')` — assert host has `cba-skeleton--generic` and `.cba-skeleton__shape--generic` present.
- `it('applies the variant host class for each variant')` — loop `['text','avatar','card','table-row','generic']`, set, assert `classList.contains('cba-skeleton--'+v)`.
- `it('renders three lines for the text variant')` — set `variant='text'`, assert 3 `.cba-skeleton__line`.
- `it('renders four cells for the table-row variant')` — set `variant='table-row'`, assert 4 `.cba-skeleton__cell`.
- `it('marks the content as aria-hidden and role=presentation')` — assert `.cba-skeleton__content` has `aria-hidden="true"` and `role="presentation"`.
- `it('honours width and height overrides via inline styles')` — set `width='12rem'`, `height='2rem'`, `variant='avatar'`, assert the shape element `style.width === '12rem'` and `style.height === '2rem'` (jsdom returns computed inline styles; assert on the `style` attribute / `el.style.width`).

#### f. `src/components/skeleton/index.ts`
```ts
export * from './skeleton.types';
export * from './cba-skeleton.component';
```

#### g. public-api: `export * from './components/skeleton';`.

---

## 4. Updates to `src/public-api.ts`

Target final content (alphabetical among all component folders):

```ts
/**
 * Single public entry point for @cobranza-apps/ui.
 * (existing header JSDoc kept verbatim)
 */
/** Components. */
export * from './components/badge';
export * from './components/button';
export * from './components/card';
export * from './components/empty-state';
export * from './components/module-container';
export * from './components/module-header';
export * from './components/skeleton';
```

Exact edit: insert five new lines (badge, button, card, empty-state, skeleton) and **reorder** the two existing `module-*` lines into alphabetical position (module-container before module-header). This keeps the file alphabetically sorted as the existing header comment already prescribes ("keeping alphabetical order and grouping by category"). Do not change the file-header JSDoc.

---

## 5. Documentation updates (step 4.4 — docs-specialist scope, listed here for completeness)

### 5.1 New docs files (one per component), each ≤ ~100 lines:

- `docs/CBA_BUTTON.md` — When to use, selector, API table (variant/size/loading/disabled/type/icon/iconPosition, output `click`), a11y notes (native `<button>`, `aria-busy`, focus ring), reduced-motion, one code example per variant, leading/trailing icon example, loading example. Include note that output is `click` (not `clicked`).
- `docs/CBA_CARD.md` — When to use, selector, projection slots (`[cbaCardHeader]`, default body, `[cbaCardFooter]`), `:empty` behavior, three examples (body-only, header+body, header+body+footer), no-hover note.
- `docs/CBA_BADGE.md` — When to use, selector, `variant` (6 values) + `appearance`, `role="status"`, code examples (solid/outline × several variants), non-interactive note.
- `docs/CBA_EMPTY_STATE.md` — When to use, selector, `title` (required) + `description` inputs, `[cbaEmptyStateIcon]` + `[cbaEmptyStateAction]` projection slots, hierarchy rule (icon→title→description→action), example.
- `docs/CBA_SKELETON.md` — When to use, selector, `variant` (5 values with intent table), `width`/`height` overrides, reduced-motion, aria-hidden/role=presentation, examples per variant.

Each new doc: add a small "AI Agent" callout block pointing to JSDoc as the authoritative runtime API (docs are descriptive; JSDoc wins on divergence).

### 5.2 `docs/USAGE.md` (update)

Apply the reconciliations in §0 of this plan:
- Replace every `(clicked)` with `(click)` in the Button examples (Quick Start + CbaButton sections).
- Replace `style="solid|outline"` with `appearance="solid|outline"` in CbaBadge examples; add `primary` and `neutral` examples.
- Replace `<div header>` / `<div footer>` with `<div cbaCardHeader>` / `<div cbaCardFooter>` in CbaCard examples.
- Replace the CbaEmptyState example with the projection-based API:
  ```html
  <cba-empty-state title="No items found" description="Try adjusting your filters">
    <fa-icon cbaEmptyStateIcon [icon]="['fas','inbox']" aria-hidden="true"></fa-icon>
    <cba-button cbaEmptyStateAction variant="primary" (click)="onReset()">Reset Filters</cba-button>
  </cba-empty-state>
  ```
- Replace CbaSkeleton example: remove `[lines]` and `[columns]`, show `width`/`height`:
  ```html
  <cba-skeleton variant="card"></cba-skeleton>
  <cba-skeleton variant="text"></cba-skeleton>
  <cba-skeleton variant="table-row"></cba-skeleton>
  <cba-skeleton variant="avatar" [width]="'3rem'" [height]="'3rem'"></cba-skeleton>
  ```
- Update Table of Contents anchors are already present — no change needed.
- Update Quick Start "2. MFE Application" snippet to `import { CbaButton, CbaCard, CbaBadge } from '@cobranza-apps/ui';` and `(click)="onSave()"`.

### 5.3 `README.md` (update)

- Component Inventory table already lists all five components. Verify descriptions match the spec API (e.g., `CbaBadge` description should mention `primary/success/warning/danger/info/neutral` and `solid/outline`); refine if needed.
- Documentation section: add links to the five new `/docs/CBA_*.md` files.
- Quick Start snippet: change `(clicked)` → `(click)` if present (none in README currently; double-check).

---

## 6. Verification steps (run after all five components are implemented)

1. `npm test` — all new specs + existing `module-header`/`module-container` specs must pass. Run targeted first:
   - `npx jest src/components/button`
   - `npx jest src/components/badge`
   - `npx jest src/components/card`
   - `npx jest src/components/empty-state`
   - `npx jest src/components/skeleton`
   - `npx jest` (full suite, must be green).
2. `npm run build` — ng-packagr must succeed and emit the five components to `dist/`. Check there are no "X is not exported from public-api" errors.
3. `npm run lint` — ESLint on `src/**/*.ts` must pass (no unused vars, max params, etc). Fix per rules (`max-arguments-per-method`, `max-lines-per-method`, `max-lines-per-file`).
4. `npm run format` — Prettier formatting pass (optional but recommended before commit).
5. Manual a11y/visual sanity (out of automated scope, recorded): each component must use only `--cba-*` tokens; `:focus-visible` ring on Button; `prefers-reduced-motion` disables Button transitions/spinner and Skeleton shimmer; Badge `role="status"`; Skeleton `aria-hidden`/`role=presentation`.

### Known risks to verify
- **`:empty` + Angular `ng-content` comment anchors** on Card/EmptyState optional slots. If `getComputedStyle(...).display === 'none'` test fails because jsdom/Chrome leaves comment anchors, this is a real product bug (the regions won't hide visually). The implementer must verify in a real browser and, if broken, ESCALATE to the caller (do not silently swap the API). Possible non-API-breaking mitigation (only if needed): add a CSS rule `.cba-card__header:not(:has(> *)) { display: none; }`? `:has` may not be parsed by Angular's emulated encapsulation cleanly; escalate instead.
- **Output name `click` shadowing**: confirm the `<cba-button (click)>` binding in a host component actually fires the Angular output (and the inner native button is `disabled` correctly under loading). This is covered by the Button spec emission tests.
- **FontAwesome v7 `faSpinner`**: confirm it still exists in `@fortawesome/free-solid-svg-icons` ^7.3.1 (it does). If an icon import path changed in v7, the implementer must use the correct import (escalate if the documented import fails).

---

## 7. Dependencies

No new dependencies. Confirmed:
- `@fortawesome/angular-fontawesome` (peer ^5.0.0, dev ^5.1.0) — used by `CbaButton`.
- `@fortawesome/fontawesome-svg-core` (^7.3.0) — `IconDefinition` type for `CbaButton.icon`.
- `@fortawesome/free-solid-svg-icons` (^7.3.1) — `faSpinner` (Button), `faInbox`/`faTrashCan` (only used in **tests**, still from this already-installed package).
- Angular `@angular/core` ^22 provides `input`, `output`, `ChangeDetectionStrategy`, `host` binding strings.
- No `bootstrap` / `@ng-bootstrap` usage by any of the five components.

---

## 8. Git actions (executed by the implementer in step 4.2, not here)

- One commit per component (recommended, meaningful messages):
  - `feat(button): add CbaButton component`
  - `feat(badge): add CbaBadge component`
  - `feat(card): add CbaCard component`
  - `feat(empty-state): add CbaEmptyState component`
  - `feat(skeleton): add CbaSkeleton component`
  - `feat(public-api): export phase 4 core components` (or fold into each component commit).
- Do NOT commit until `npm test`, `npm run build`, and `npm run lint` are green for the touched set.
- Respect `.kilo/rules/gitignore-compliance.md` (read `.gitignore` + `git status` before each commit; never stage `dist/`, `node_modules/`).
- Stay on branch `feat/phase4-core-components`. No merges/pushes in this step.

---

## 9. Verification of this plan against the original task

| TODO § requirement | Covered by |
| --- | --- |
| `CbaButton` selector + API (variant/size/loading/disabled/type/icon, output, content) | §3.1 (a–e) |
| Native `<button>`, loading spinner + disabled, variants mapped to tokens, sizes via spacing tokens, focus ring, hover/active | §3.1 d |
| Card: `[cbaCardHeader]` / body / `[cbaCardFooter]`, optional regions not rendered, no forced hover, radius `--cba-radius-md` | §3.3 b–d |
| Badge: 6 variants, `solid|outline`, `role="status"` | §3.2 a–d |
| EmptyState: icon/title/description/action slots, centered layout, muted description | §3.4 b–d |
| Skeleton: 5 variants, `width`/`height` overrides, shimmer, reduced-motion, `table-row` = row of cells, aria-hidden | §3.5 b–d |
| All standalone, OnPush, signal inputs, `--cba-*` tokens only | Cross-cutting rules §3 |
| Exported from `public-api.ts` | §4 |
| Docs + minimal unit tests | §5 + each §3.x e |
| Library build succeeds | §6 step 2 |
| No new deps | §7 |

All acceptance criteria (items 1–8 in TODO Acceptance criteria table) are addressed.

---

## 10. Summary of what this plan does NOT do

- Does NOT write code (architector step 4.1b — plan only).
- Does NOT run git/commits (deferred to implementer step 4.2).
- Does NOT touch `module-header` / `module-container` existing code (preserve existing functionality).
- Does NOT address TODO sections outside 1–5 (sections 0 is already `[DONE]`; "Important details for all components" / structure / styling / export / docs / tests are satisfied by this plan's instructions).
- Does NOT introduce a `*.types.ts` for `card` and `empty-state` (no union inputs).
- Does NOT rename the Button output `click` to `clicked` — follows the spec exactly.

---

**Plan saved to:** `.kilo/plans/20260730-phase4-components-impl.md`