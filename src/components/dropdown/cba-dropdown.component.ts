import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgbDropdownModule, PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/** Placement alias used by `CbaDropdown`. Passthrough to ng-bootstrap's `PlacementArray`. */
export type CbaDropdownPlacement = PlacementArray;

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` dropdown.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns menu open/close, keyboard navigation, focus management,
 *   auto-close, and Popper positioning.
 * - This component owns the Cobranza gray-theme surface, a stable `cba-dropdown`
 *   selector, and two thin passthrough inputs (`placement`, `disabled`) plus an
 *   `openChange` output.
 *
 * Project the toggle marked with both `cbaDropdownToggle` **and** `ngbDropdownToggle`
 * (the latter wires ng-bootstrap click handling). Project menu items inside the
 * default slot, each decorated with `ngbDropdownItem` so keyboard navigation works.
 *
 * @usageNotes
 * ```html
 * <cba-dropdown [disabled]="isDisabled" (openChange)="onOpen($event)">
 *   <cba-button cbaDropdownToggle ngbDropdownToggle variant="secondary"
 *              [disabled]="isDisabled">Options</cba-button>
 *   <button ngbDropdownItem (click)="onEdit()">Edit</button>
 *   <button ngbDropdownItem (click)="onDuplicate()">Duplicate</button>
 *   <div class="dropdown-divider"></div>
 *   <button ngbDropdownItem [disabled]="true">Delete</button>
 * </cba-dropdown>
 * ```
 *
 * @remarks
 * Behavior (open/close, positioning, keyboard) comes from `@ng-bootstrap/ng-bootstrap`.
 * `CbaDropdown` only adds theming and a stable projection API.
 *
 * @see [CBA_DROPDOWN.md](/docs/CBA_DROPDOWN.md)
 */
@Component({
  selector: 'cba-dropdown',
  standalone: true,
  imports: [NgbDropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-dropdown.component.html',
  styleUrl: './cba-dropdown.component.scss',
  host: {
    class: 'cba-dropdown',
    '[class.cba-dropdown--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class CbaDropdownComponent {
  /**
   * Preferred menu placement, forwarded to `NgbDropdown#placement`.
   * Follows ng-bootstrap positioning semantics
   * (e.g. `'bottom-start'`, `'top-end'`, or an array of fallbacks).
   * Defaults to ng-bootstrap's own placement order.
   */
  readonly placement = input<CbaDropdownPlacement>(['bottom-start', 'bottom-end', 'top-start', 'top-end']);

  /**
   * Wrapper-level disabled state. When `true`, applies the `cba-dropdown--disabled`
   * host modifier (blocks pointer events, dims the host) and sets `aria-disabled`.
   * The projected toggle (e.g. `cba-button`) **must** mirror this value on its own
   * `[disabled]` binding so the native button is fully disabled.
   */
  readonly disabled = input<boolean>(false);

  /** Passthrough for `NgbDropdown#openChange`. Emits `true` on open, `false` on close. */
  readonly openChange = output<boolean>();

  /** Bridges `NgbDropdown#openChange` to the wrapper output. */
  protected onOpenChange(open: boolean): void {
    this.openChange.emit(open);
  }
}
