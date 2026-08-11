import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import {
  ModuleContainerSize,
  ModuleContainerPadding,
} from './module-container.types';

/**
 * Wrapper that hosts a projected module header + the MFE body inside the
 * Shell workspace.
 *
 * Visual state (size, collapse, fullscreen, padding) is driven entirely by
 * inputs and reflected on the host element as modifier classes. The
 * component never mutates these values; the Shell owns the source of
 * truth and re-binds state on every change.
 *
 * Content projection:
 * - Header slot: any element carrying the `[cbaModuleContainerHeader]`
 *   attribute (typically `<cba-module-header cbaModuleContainerHeader>`).
 * - Body slot:   the default `<ng-content>` projection.
 *
 * The body region is removed from the DOM while `isCollapsed` is `true`,
 * so it never participates in layout or scroll. In fullscreen mode the
 * container still hosts header + body; the chrome (border-radius, shadow)
 * modifiers are suppressed via the `cba-module-container--fullscreen`
 * host class (styled in Block B).
 *
 * Styling of size / chrome / padding / scroll is intentionally handled in
 * Block B. Block A wires the host modifier classes only.
 *
 * Exported from `@cobranza-apps/ui` via `src/public-api.ts`.
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
    '[class.cba-module-container--scroll-chaining]': 'scrollChaining()',
  },
})
export class ModuleContainerComponent {
  /**
   * Workspace width mode.
   *
   * Drives the host modifier class:
   * - `'50%'`  → `cba-module-container--size-50`
   * - `'100%'` → `cba-module-container--size-100` (default)
   *
   * @default '100%'
   */
  readonly size = input<ModuleContainerSize>('100%');

  /**
   * Controls body visibility and scroll participation.
   *
   * When `true`:
   * - The body region is removed from the DOM.
   * - The host receives `cba-module-container--collapsed`.
   * - No layout box is rendered; no scroll area exists.
   *
   * @default false
   */
  readonly isCollapsed = input<boolean>(false);

  /**
   * Suppresses module chrome (border-radius, shadow).
   *
   * When `true`:
   * - The host receives `cba-module-container--fullscreen`.
   * - Block B styles suppress `border-radius` and `box-shadow`.
   * - The Shell fullscreen view owns the outer chrome.
   *
   * @default false
   */
  readonly isFullscreen = input<boolean>(false);

  /**
   * Body internal padding.
   *
   * Drives the host modifier class applied to the body region:
   * - `'none'` → `cba-module-container--padding-none` (0 padding)
   * - `'sm'`   → `cba-module-container--padding-sm` (small, balanced)
   * - `'md'`   → `cba-module-container--padding-md` (medium spacing)
   *
   * @default 'sm'
   */
  readonly padding = input<ModuleContainerPadding>('sm');

  /**
   * Allows scroll gestures to chain to the parent workspace container.
   *
   * When `false` (default), the module body uses `overscroll-behavior: contain`
   * so wheel events stay inside the module. When `true`, the body uses
   * `overscroll-behavior: auto` so the workspace can scroll once the module
   * body reaches its edge.
   *
   * Drives the host modifier class `cba-module-container--scroll-chaining`.
   *
   * @default false
   */
  readonly scrollChaining = input<boolean>(false);
}
