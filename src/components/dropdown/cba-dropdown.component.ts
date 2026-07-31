import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownModule,
  PlacementArray,
} from '@ng-bootstrap/ng-bootstrap';

/** Placement alias used by `CbaDropdown`. Passthrough to ng-bootstrap's `PlacementArray`. */
export type CbaDropdownPlacement = PlacementArray;

/** Shape of `NgbDropdown`'s private menu reference, set after view init. */
type NgbDropdownWithMenu = { _menu?: NgbDropdownMenu };

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
 * `CbaDropdown` only adds theming and a stable projection API. `NgbDropdown` is
 * instantiated on the host element via `hostDirectives` so projected content
 * (toggle and menu items) can inject it and wire keyboard/click handling. Because
 * `NgbDropdown` resolves its menu through a content query on its own host element,
 * and the themed menu surface lives in this component's view, the menu directive
 * is linked to the `NgbDropdown` instance after view init.
 *
 * @see [CBA_DROPDOWN.md](/docs/CBA_DROPDOWN.md)
 */
@Component({
  selector: 'cba-dropdown',
  standalone: true,
  imports: [NgbDropdownModule],
  hostDirectives: [NgbDropdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-dropdown.component.html',
  styleUrl: './cba-dropdown.component.scss',
  host: {
    class: 'cba-dropdown',
    '[class.cba-dropdown--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class CbaDropdownComponent implements AfterViewInit {
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

  private readonly ngbDropdown = inject(NgbDropdown);

  @ViewChild(NgbDropdownMenu) private readonly menu?: NgbDropdownMenu;

  constructor() {
    this.ngbDropdown.openChange.subscribe((open: boolean) => this.openChange.emit(open));
    effect(() => {
      this.ngbDropdown.placement = this.placement();
    });
  }

  ngAfterViewInit(): void {
    this.linkMenuToDropdown();
  }

  /** Exposes the themed menu surface to the `NgbDropdown` host directive. */
  private linkMenuToDropdown(): void {
    (this.ngbDropdown as unknown as NgbDropdownWithMenu)._menu = this.menu;
  }
}
