<!-- AI Agent Note: This file provides usage patterns for consuming @cobranza-apps/ui.
     Keep examples aligned with brief.md component contracts and design tokens.
     When adding new components, update both this file and README.md Component Inventory. -->

# @cobranza-apps/ui — Usage Guide

Patterns and examples for consuming the shared Angular component library and design system.

## Table of Contents

- [Development Setup](#development-setup)
- [Installation](#installation)
- [Peer Dependencies](#peer-dependencies)
- [Theme Import](#theme-import)
- [Quick Start](#quick-start)
- [Component Usage Patterns](#component-usage-patterns)
  - [ModuleHeader](#moduleheader)
  - [ModuleContainer](#modulecontainer)
  - [CbaButton](#cbabutton)
  - [CbaCard](#cbacard)
  - [CbaBadge](#cbabadge)
  - [CbaEmptyState](#cbaemptystate)
  - [CbaSkeleton](#cbaskeleton)
  - [CbaModal](#cbamodal)
  - [CbaInput](#cbainput)
  - [CbaSelect](#cbaselect)
  - [CbaDatepicker](#cbadatepicker)
  - [CbaDropdown](#cbadropdown)
  - [CbaPopover](#cbapopover)
  - [CbaTypeahead](#cbatypeahead)
  - [CbaAccordion](#cbaaccordion)
  - [CbaModuleFooter](#cbamodulefooter)
- [Design Tokens Reference](#design-tokens-reference)
- [AI Agent Guidelines](#ai-agent-guidelines)

## Development Setup

<!-- AI Agent Note: This section is for developers working ON the library (not consumers).
     Commands map to package.json scripts. Requires Node.js ^22.22.3 || ^24.15.0 || >=26.0.0. -->

### Prerequisites

- **Node.js**: `^22.22.3 || ^24.15.0 || >=26.0.0` (see `package.json` engines)
- **npm**: comes with Node.js

### Install

```sh
npm install
```

### Build

Compiles the library via ng-packagr using `ng-package.json` and `tsconfig.lib.json`. Output goes to `dist/`.

```sh
npm run build
```

### Test

Runs Jest unit tests with jest-preset-angular. Uses `--passWithNoTests` so the command succeeds even when no spec files exist yet.

```sh
npm test
```

### Lint

Runs ESLint with angular-eslint recommended rules against `src/**/*.ts`.

```sh
npm run lint
```

### Format

Runs Prettier on all source files (TS, SCSS, CSS, JSON, MD). Configured in `.prettierrc.json` (100 char width, single quotes, trailing commas, LF line endings).

```sh
npm run format
```

### Configuration Files

| File | Purpose |
| --- | --- |
| `package.json` | Dependencies, scripts, engine requirements |
| `ng-package.json` | ng-packagr config — entry file and output directory |
| `tsconfig.json` | Base TypeScript config (strict mode, ES2022) |
| `tsconfig.lib.json` | Library build — partial compilation, emits declarations |
| `tsconfig.spec.json` | Test compilation — CommonJS for Jest compatibility |
| `jest.config.js` | Jest config — CJS preset, test matching, setup file |
| `setup-jest.ts` | Angular Zone.js test environment bootstrap |
| `eslint.config.js` | Flat ESLint config — angular-eslint for Angular 22 |
| `.prettierrc.json` | Prettier formatting rules |
| `.prettierignore` | Paths excluded from formatting (dist, node_modules) |

---

## Installation

```sh
npm install @cobranza-apps/ui
```

## Peer Dependencies

Install the following peer dependencies separately. **Never install jQuery** — Bootstrap is used CSS-only.

| Package | Version | Purpose |
| --- | --- | --- |
| `@angular/core` | `^22` | Angular runtime |
| `@angular/common` | `^22` | Angular common module |
| `@angular/forms` | `^22` | Angular forms |
| `bootstrap` | `^5` | CSS framework (no jQuery) |
| `@ng-bootstrap/ng-bootstrap` | `^21` | Angular Bootstrap components |
| `@fortawesome/angular-fontawesome` | latest | Icon rendering |
| `@fortawesome/free-solid-svg-icons` | latest | Solid icon pack |
| `@fortawesome/free-regular-svg-icons` | latest | Regular icon pack |

```sh
npm install @angular/core@^22 @angular/common@^22 @angular/forms@^22 \
  bootstrap@^5 @ng-bootstrap/ng-bootstrap@^21 \
  @fortawesome/angular-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons
```

## Theme Import

Import the theme in your global styles file to apply the Minimal Yet Warm design tokens.

**SCSS import (recommended):**

```scss
/* global-styles.scss or styles.scss */
@use '@cobranza-apps/ui/theme';
```

> **Note:** The theme is shipped as Sass only — no compiled `theme.css` artifact is published. Import via `@use '@cobranza-apps/ui/theme';`. Custom CSS properties (`--cba-*`) and opt-in `.cba-*` utility classes emit on `:root` after the `@use`.

The theme provides CSS custom properties with the `--cba-` prefix (e.g., `--cba-bg-primary`, `--cba-text-primary`, `--cba-accent-primary`).

## Quick Start

### 1. Shell Application (hosting MFEs)

```ts
// app.component.ts
import { Component } from '@angular/core';
import { ModuleHeaderComponent, ModuleContainerComponent } from '@cobranza-apps/ui';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ModuleHeaderComponent, ModuleContainerComponent],
  template: `
    <cba-module-container [size]="size" [isCollapsed]="isCollapsed" [isFullscreen]="isFullscreen">
      <cba-module-header
        title="Customer Module"
        [size]="size"
        [isCollapsed]="isCollapsed"
        [isFullscreen]="isFullscreen"
        status="loaded"
        (collapseToggle)="onCollapseToggle()"
        (sizeToggle)="onSizeToggle($event)"
        (fullscreenToggle)="onFullscreenToggle()"
        (remove)="onRemove()">
      </cba-module-header>

      <!-- MFE content goes here -->
      <div class="mfe-content">
        <p>Module content</p>
      </div>
    </cba-module-container>
  `
})
export class AppComponent {
  size: '50%' | '100%' = '100%';
  isCollapsed = false;
  isFullscreen = false;

  onCollapseToggle(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onSizeToggle(size: '50%' | '100%'): void {
    this.size = size;
  }

  onFullscreenToggle(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  onRemove(): void {
    // Handle module removal
  }
}
```

### 2. MFE Application (using basic components)

```ts
// mfe-dashboard.component.ts
import { Component } from '@angular/core';
import { CbaButtonComponent, CbaCardComponent, CbaBadgeComponent } from '@cobranza-apps/ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CbaButtonComponent, CbaCardComponent, CbaBadgeComponent],
  template: `
    <cba-card>
      <cba-badge variant="success">Active</cba-badge>
      <h3>Dashboard</h3>
      <p>Welcome to the dashboard</p>
      <cba-button variant="primary" (cbaClick)="onSave()">Save</cba-button>
    </cba-card>
  `
})
export class DashboardComponent {
  onSave(): void {
    // Save logic
  }
}
```

### Spanish-only defaults

Library-owned default chrome strings are Spanish by default. See the
[Spanish-only UI defaults](../README.md#spanish-only-ui-defaults) section in
[README.md](../README.md) for the canonical policy.

## Component Usage Patterns

### ModuleHeader

Shell-injected header above each MFE module. See [`CBA_MODULE_HEADER.md`](./CBA_MODULE_HEADER.md) for the full API and notes.

```html
<cba-module-header
  title="Module Title"
  size="100%"
  [isCollapsed]="false"
  [isFullscreen]="false"
  status="loading"
  (collapseToggle)="onCollapse()"
  (sizeToggle)="onSizeChange($event)"
  (fullscreenToggle)="onFullscreen()"
  (remove)="onRemove()">
</cba-module-header>
```

**Status values:** `loading` | `loaded` | `success` | `warning` | `error` | `dirty` | `null`

**Outputs:** `collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`

**Optional drag-handle slot:** Project a `[cbaModuleDragHandle]` element as a child
of `<cba-module-header>` to let the Shell wire `cdkDrag` / `cdkDragHandle`. The
library renders nothing when the slot is empty and does not depend on
`@angular/cdk`. See [`CBA_MODULE_HEADER.md` §Drag handle slot](./CBA_MODULE_HEADER.md#drag-handle-slot)
for the full Shell wiring example.

> The basic example above intentionally omits the drag handle so the simplest
> usage stays simple.

### ModuleContainer

Wraps `ModuleHeader` + MFE content.

```html
<cba-module-container
  size="100%"
  [isCollapsed]="false"
  [isFullscreen]="false"
  padding="sm">
  <!-- Content here -->
</cba-module-container>
```

**Padding options:** `none` | `sm` | `md` (default: `sm`)

### CbaButton

Variants: `primary`, `secondary`, `ghost`, `danger`, `success`. Sizes: `sm` | `md`.

```html
<cba-button variant="primary" size="md" [loading]="isSaving" (cbaClick)="onSave()">
  Save
</cba-button>

<cba-button [icon]="faTrash" iconPosition="leading" variant="danger" (cbaClick)="onDelete()">
  Delete
</cba-button>
```

See [`CBA_BUTTON.md`](./CBA_BUTTON.md) for the full API.

### CbaCard

Optional header & footer via content projection attributes.

```html
<cba-card>
  <div cbaCardHeader>Card Header</div>
  <p>Card content</p>
  <div cbaCardFooter>Card Footer</div>
</cba-card>
```

See [`CBA_CARD.md`](./CBA_CARD.md) for the full API.

### CbaBadge

Semantic colours: `primary`, `success`, `warning`, `danger`, `info`, `neutral`. Appearances: `solid` | `outline`.

```html
<cba-badge variant="success" appearance="solid">Active</cba-badge>
<cba-badge variant="warning" appearance="outline">Pending</cba-badge>
```

See [`CBA_BADGE.md`](./CBA_BADGE.md) for the full API.

### CbaEmptyState

Slots: icon, title, description, primary action. Title is a required string input; icon and action are content-projected.

```html
<cba-empty-state
  title="No items found"
  description="Try adjusting your filters">
  <fa-icon cbaEmptyStateIcon [icon]="['fas', 'inbox']" aria-hidden="true"></fa-icon>
  <cba-button cbaEmptyStateAction variant="primary" (cbaClick)="onReset()">Reset Filters</cba-button>
</cba-empty-state>
```

See [`CBA_EMPTY_STATE.md`](./CBA_EMPTY_STATE.md) for the full API.

### CbaSkeleton

Variants: `text`, `avatar`, `card`, `table-row`, `generic`. Optional `width` and `height` inputs override defaults.

```html
<cba-skeleton variant="card"></cba-skeleton>
<cba-skeleton variant="text" [width]="'80%'"></cba-skeleton>
<cba-skeleton variant="avatar" [width]="'3rem'" [height]="'3rem'"></cba-skeleton>
<cba-skeleton variant="table-row"></cba-skeleton>
```

See [`CBA_SKELETON.md`](./CBA_SKELETON.md) for the full API.

### CbaModal

Thin wrapper around ng-bootstrap modal.

```ts
import { CbaModalComponent } from '@cobranza-apps/ui';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [CbaModalComponent],
  template: `
    <cba-modal title="Confirm Action">
      <p>Are you sure?</p>
      <ng-container cbaModalFooter>
        <cba-button variant="secondary" (cbaClick)="activeModal.dismiss()">Cancel</cba-button>
        <cba-button variant="primary" (cbaClick)="activeModal.close('confirmed')">Confirm</cba-button>
      </ng-container>
    </cba-modal>
  `
})
export class ConfirmModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
```

### CbaInput

Thin wrapper around a native `<input>` rendered inside the shared field layout (label / hint / error).

Selector: `cba-input`

```ts
import { CbaInputComponent } from '@cobranza-apps/ui';
```

```html
<cba-input
  label="Email"
  type="email"
  hint="We never share your email."
  [error]="emailInvalid ? 'Email is required' : undefined"
  [(ngModel)]="email" />
```

Supports the `CbaInputType` control types (`text | email | password | number | url | tel`) and
`ControlValueAccessor` integration (`ngModel` / `formControlName`).

Full API: [`CBA_INPUT.md`](./CBA_INPUT.md).

The `label` / `hint` / `error` / `disabled` contract is shared with `CbaSelect` and
`CbaDatepicker` via [`CBA_FORM_FIELD.md`](./CBA_FORM_FIELD.md).

### CbaSelect

Thin wrapper around the native `<select>` using the shared field layout; options are content-projected.

Selector: `cba-select`

```ts
import { CbaSelectComponent } from '@cobranza-apps/ui';
```

```html
<cba-select
  label="Country"
  hint="Choose the billing country."
  [error]="countryInvalid ? 'Country is required' : undefined"
  [(ngModel)]="country">
  <option value="">Choose...</option>
  <option value="ar">Argentina</option>
  <option value="br">Brazil</option>
</cba-select>
```

The browser's native `<select>` handles the dropdown, keyboard navigation, and option rendering;
the component adds the shared field layout and `ControlValueAccessor` integration.

Full API: [`CBA_SELECT.md`](./CBA_SELECT.md).

The `label` / `hint` / `error` / `disabled` contract is shared with `CbaInput` and
`CbaDatepicker` via [`CBA_FORM_FIELD.md`](./CBA_FORM_FIELD.md).

### CbaDatepicker

Thin themed wrapper around ng-bootstrap's `NgbInputDatepicker` with the shared field layout
and a calendar toggle button.

Selector: `cba-datepicker`

```ts
import { CbaDatepickerComponent } from '@cobranza-apps/ui';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
```

```html
<cba-datepicker
  label="Due date"
  hint="YYYY-MM-DD"
  [error]="dueDateInvalid ? 'Due date is required' : undefined"
  [(ngModel)]="dueDate" />
```

Calendar popup, keyboard navigation, and date parsing come from ng-bootstrap
(`NgbInputDatepicker`); the control value type is `NgbDateStruct | null` and the toggle button
aria-label defaults to Spanish ("Abrir selector de fecha").

Full API: [`CBA_DATEPICKER.md`](./CBA_DATEPICKER.md).

The `label` / `hint` / `error` / `disabled` contract is shared with `CbaInput` and
`CbaSelect` via [`CBA_FORM_FIELD.md`](./CBA_FORM_FIELD.md).

### CbaDropdown

Thin wrapper around ng-bootstrap dropdown. ng-bootstrap owns open/close, keyboard, and positioning; `CbaDropdown` adds themed menu surface and a stable projection API.

```html
<cba-dropdown [disabled]="isDisabled" (openChange)="onOpen($event)">
  <cba-button cbaDropdownToggle ngbDropdownToggle variant="secondary"
              [disabled]="isDisabled">
    Options
  </cba-button>
  <button ngbDropdownItem (click)="onEdit()">Edit</button>
  <button ngbDropdownItem (click)="onDuplicate()">Duplicate</button>
  <div class="dropdown-divider"></div>
  <button ngbDropdownItem [disabled]="true">Delete</button>
</cba-dropdown>
```

**Inputs:** `placement` (PlacementArray), `disabled` (boolean)
**Outputs:** `openChange` (boolean)
**Projection:** `[cbaDropdownToggle]` for toggle, default slot for menu items (each with `ngbDropdownItem`)

See [`CBA_DROPDOWN.md`](./CBA_DROPDOWN.md) for the full API.

### CbaPopover

Thin wrapper around ng-bootstrap popover. ng-bootstrap owns open/close, positioning, and animation; `CbaPopover` adds a themed popover window surface and a stable API.

```html
<cba-popover body="This action opens the selected module." title="Hint">
  <cba-button variant="ghost" size="sm">?</cba-button>
</cba-popover>
```

**Inputs:** `body` (string | TemplateRef), `title` (string | TemplateRef), `placement` (PlacementArray, default `'auto'`), `triggers` (string, default `'hover focus'`), `disabled` (boolean)
**Outputs:** `shown` (void), `hidden` (void)
**Projection:** default slot for the trigger element (must be focusable)

**Hover trigger (Shell-footer pattern):**

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

See [`CBA_POPOVER.md`](./CBA_POPOVER.md) for the full API.

### CbaTypeahead

Thin wrapper around ng-bootstrap typeahead. ng-bootstrap owns the popup list, filtering,
keyboard navigation, and selection; `CbaTypeahead` adds themed input surface, themed popup,
and a stable form-field API (label / hint / error).

```html
<cba-typeahead
  label="State"
  placeholder="Start typing a state..."
  hint="Choose from the list or type freely."
  [search]="searchStates"
  [(ngModel)]="selectedState"
  (itemSelected)="onStateSelected($event)" />
```

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CbaTypeaheadComponent } from '@cobranza-apps/ui';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

const US_STATES = ['Alabama', 'Alaska', 'Arizona', /* ... */];

@Component({
  standalone: true,
  imports: [FormsModule, CbaTypeaheadComponent],
  templateUrl: './state-picker.component.html',
})
export class StatePickerComponent {
  selectedState: string | null = null;

  searchStates: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : US_STATES.filter((s) => s.toLowerCase().includes(term.toLowerCase())),
      ),
    );

  onStateSelected(event: NgbTypeaheadSelectItemEvent): void {
    console.log('Selected:', event.item);
  }
}
```

**Inputs:** `label` (string), `placeholder` (string), `disabled` (boolean), `hint` (string), `error` (string), `search` (OperatorFunction, **required**), `resultFormatter` (function), `inputFormatter` (function), `editable` (boolean, default `true`), `focusFirst` (boolean, default `true`), `showHint` (boolean), `selectOnExact` (boolean), `placement` (PlacementArray), `popupClass` (string)
**Outputs:** `itemSelected` (NgbTypeaheadSelectItemEvent)
**Forms:** Control value is the string in the input. Use `itemSelected` to access the selected object.

See [`CBA_TYPEAHEAD.md`](./CBA_TYPEAHEAD.md) for the full API.

### CbaAccordion

Thin wrapper around ng-bootstrap accordion. ng-bootstrap owns expand/collapse, keyboard, focus,
and `aria-*` wiring; `CbaAccordion` adds a themed surface and thin passthrough inputs/outputs.
Consumers author the ng-bootstrap item markup directly as projected content.

```html
<cba-accordion [closeOthers]="true" (shown)="onShown($event)">
  <div ngbAccordionItem>
    <div ngbAccordionHeader>
      <button ngbAccordionButton>Detalles del cliente</button>
    </div>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <ng-template><p>Contenido del primer panel.</p></ng-template>
      </div>
    </div>
  </div>

  <div ngbAccordionItem [disabled]="true">
    <div ngbAccordionHeader>
      <button ngbAccordionButton>Histórico de pagos</button>
    </div>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <ng-template><p>Contenido deshabilitado.</p></ng-template>
      </div>
    </div>
  </div>

  <div ngbAccordionItem>
    <div ngbAccordionHeader>
      <button ngbAccordionButton>Documentación</button>
    </div>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <ng-template><p>Contenido del tercer panel.</p></ng-template>
      </div>
    </div>
  </div>
</cba-accordion>
```

**Inputs:** `closeOthers` (boolean), `destroyOnHide` (boolean), `animation` (boolean)
**Outputs:** `show`, `shown`, `hide`, `hidden` (all `string` — item id)
**Projection:** ng-bootstrap item markup directly (`ngbAccordionItem`, `ngbAccordionHeader`, `ngbAccordionButton`, `ngbAccordionCollapse`, `ngbAccordionBody`)

See [`CBA_ACCORDION.md`](./CBA_ACCORDION.md) for the full API.

### CbaModuleFooter

Optional plain footer bar for a module. Status text aligned with `ModuleHeaderStatus` plus a
default projection slot for auxiliary content.

```html
<cba-module-container [size]="'100%'" [isCollapsed]="false">
  <cba-module-header title="Invoice Editor" [status]="headerStatus"></cba-module-header>
  <div class="module-body"><!-- MFE content --></div>
  <cba-module-footer [status]="'dirty'"></cba-module-footer>
</cba-module-container>
```

**Inputs:** `status` (`ModuleHeaderStatus`, default `null`), `statusText` (`string | undefined`, default `undefined`)

**Content projection:** default slot for auxiliary content after the status region.

**Status text mapping:** `loading` → "Cargando…", `loaded` → "Listo", `success` → "Guardado",
`warning` → "Requiere atención", `error` → "Error", `dirty` → "Cambios sin guardar", `null` → no status region.

See [`CBA_MODULE_FOOTER.md`](./CBA_MODULE_FOOTER.md) for the full API and examples.

## Design Tokens Reference

All tokens use the `--cba-` prefix. Full reference in [brief.md §5](../.agent/project-info/brief.md#5-design-tokens-theme).
Source file: [`src/theme/_variables.scss`](../src/theme/_variables.scss).

The palette is **Minimal Yet Warm** (warm sand / cream / taupe + controlled coral): canvas `#BCB5A4` (warm sand floor), panel `#F2F0E8` (clean cream), elevated `#FDFCF8` (warm near-white), inset `#D8C3A5` (warm sand). Coral is reserved for accent/status/focus — not for primary CTAs or large fills.

> **Note:** The tables below are a summary. [brief.md §5](../.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](../src/theme/_variables.scss) are the authoritative sources for token values.

### Backgrounds

| Token | Value | Usage |
| --- | --- | --- |
| `--cba-bg-primary` | `#BCB5A4` | Canvas / workspace floor |
| `--cba-bg-secondary` | `#F2F0E8` | Panel / module body / cards |
| `--cba-bg-tertiary` | `#D8C3A5` | Inset — table headers, wells, module footer |
| `--cba-bg-elevated` | `#FDFCF8` | Module header, dropdowns, popovers |
| `--cba-bg-overlay` | `rgba(43, 38, 32, 0.45)` | Modal / backdrop overlay |

### Text

| Token | Value | Usage |
| --- | --- | --- |
| `--cba-text-primary` | `#2B2620` | Body text, headings |
| `--cba-text-secondary` | `#4A4640` | Lower-emphasis text |
| `--cba-text-muted` | `#625C55` | De-emphasized text (NOT on canvas or inset) |
| `--cba-text-inverse` | `#FDFCF8` | Light text on dark accents / overlays |

> **`--cba-text-muted` restriction:** Do not use on the darker canvas `--cba-bg-primary` (`#BCB5A4`, ~3.6:1) or on inset `--cba-bg-tertiary` (`#D8C3A5`, ~3.86:1) — both fail WCAG AA. Prefer `--cba-text-secondary` on those surfaces.

### Borders

| Token | Value | Usage |
| --- | --- | --- |
| `--cba-border-subtle` | `#E8E5DB` | Separators, dividers |
| `--cba-border-default` | `#A29D94` | Input borders, card borders |
| `--cba-border-strong` | `#6B665E` | Focus borders, footer pills, emphasis |

### Accents

| Token | Value | Usage |
| --- | --- | --- |
| `--cba-accent-primary` | `#6B5B4F` | Primary CTA (warm taupe, NOT coral) |
| `--cba-accent-success` | `#3E6B4F` | Success states |
| `--cba-accent-warning` | `#E98074` | Warning states |
| `--cba-accent-danger` | `#B93E36` | Danger / error states |
| `--cba-accent-info` | `#56717E` | Info states |

### Interactive States

| Token | Value | Notes |
| --- | --- | --- |
| `--cba-hover` | `rgba(43, 38, 32, 0.10)` | Dark overlay for light surfaces (secondary/ghost) |
| `--cba-active` | `rgba(43, 38, 32, 0.18)` | Dark overlay for light surfaces (secondary/ghost) |
| `--cba-hover-inverse` | `rgba(253, 252, 248, 0.12)` | Light overlay for dark accent fills (solid variants) |
| `--cba-active-inverse` | `rgba(253, 252, 248, 0.22)` | Light overlay for dark accent fills (solid variants) |
| `--cba-focus-ring` | `0 0 0 3px rgba(232, 90, 79, 0.45)` | Warm coral ring, visible on all surfaces |

### Shadows (warm-tinted)

| Token | Value |
| --- | --- |
| `--cba-shadow-module` | `0 6px 24px rgba(43, 34, 28, 0.18)` |
| `--cba-shadow-elevated` | `0 10px 32px rgba(43, 34, 28, 0.26)` |

### Layout, Radius & Spacing

- **Layout:** `--cba-header-height` (56px), `--cba-footer-height` (64px), `--cba-module-header-min-height` (40px)
- **Radius:** `--cba-radius-sm` (6px), `--cba-radius-md` (10px), `--cba-radius-lg` (14px)
- **Spacing:** `--cba-space-1` (4px) through `--cba-space-8` (32px)

### Utility Classes

`.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`, `.cba-bg-elevated`, `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`, `.cba-text-inverse`, `.cba-border-subtle`, `.cba-border-default`, `.cba-border-strong`

## AI Agent Guidelines

<!-- AI Agent Note: This section helps future agents understand how to consume and contribute to the library. -->

**Consuming the library:**

- Import theme globally in `global-styles.scss` or `styles.scss`.
- Import components individually in standalone components: `import { CbaButtonComponent } from '@cobranza-apps/ui'`.
- Use design tokens via CSS variables or utility classes for consistency.
- Follow the component contracts in [brief.md §6](../.agent/project-info/brief.md#6-core-components-proposal).

**Contributing to the library:**

- Read [AGENTS.md](../AGENTS.md) and `.agent/project-info/` before making changes.
- Follow workflows in `.agent/WORKFLOWS.md` and rules in `.kilo/rules/`.
- All components are standalone (no NgModules).
- Use JSDoc on every public `@Input()`, `@Output()`, and component class.
- Update this USAGE.md when adding new components or patterns.
- Keep examples aligned with brief.md contracts.

**Cross-references:**

- [README.md](../README.md) — Library overview and component inventory.
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Shell & MFE integration rules: surface ownership map, checklists, anti-patterns.
- [brief.md](../.agent/project-info/brief.md) — Source of truth for scope, tokens, and component specs.
- [architecture.md](../.agent/project-info/architecture.md) — Build strategy and folder layout.
- [tech.md](../.agent/project-info/tech.md) — Exact versions and dependencies.
