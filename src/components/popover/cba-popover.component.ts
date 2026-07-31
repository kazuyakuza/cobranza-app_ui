import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CbaPopoverPlacement } from './cba-popover.types';

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` popover.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns popover open/close, trigger listening, Popper positioning,
 *   animation, auto-close, and the rendered `.popover` window appended to `<body>`.
 * - This component owns the Cobranza gray theme applied to the popover window
 *   (via the `cba-popover-window` `popoverClass`), a stable `cba-popover` element
 *   selector, trigger projection, and a small passthrough API.
 *
 * Project any focusable trigger element (e.g. `<cba-button>`) inside the default
 * slot. The body is provided through the `body` input as plain text or an
 * `ng-template` for rich content.
 *
 * `NgbPopover` is wired as a `hostDirective` so the directive lives on the
 * `<cba-popover>` host; trigger events on the projected element bubble to the
 * host and open/close the popover. **No `ViewChild`/`_menu` linking is needed**
 * (unlike `CbaDropdown`), because `NgbPopover` has no projected-content content
 * queries — the popover body comes from the `ngbPopover` input.
 *
 * Inputs and outputs are wired to the host `NgbPopover` manually (reactive
 * `effect()` forwarding and output subscriptions), because Angular's
 * `hostDirectives` input/output forwarding does not reliably react to later
 * input changes. This mirrors the `CbaDropdown` wiring pattern.
 *
 * @usageNotes
 * ```html
 * <cba-popover body="Opens the selected module." title="Hint">
 *   <cba-button variant="ghost" size="sm">?</cba-button>
 * </cba-popover>
 * ```
 *
 * @remarks
 * Behaviour (open/close, positioning, animation, auto-close) comes from
 * `@ng-bootstrap/ng-bootstrap`; `CbaPopover` only adds theming and a stable API.
 *
 * @see [CBA_POPOVER.md](/docs/CBA_POPOVER.md)
 */
@Component({
  selector: 'cba-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbPopover],
  templateUrl: './cba-popover.component.html',
  styleUrl: './cba-popover.component.scss',
  host: { class: 'cba-popover' },
})
export class CbaPopoverComponent {
  /** Popover body: plain text or an `ng-template` for rich HTML. If both `body` and `title` are falsy, the popover does not open. */
  readonly body = input<string | TemplateRef<unknown> | null | undefined>(undefined);

  /** Optional popover title: plain text or an `ng-template`. */
  readonly title = input<string | TemplateRef<unknown> | null | undefined>(undefined);

  /** Preferred placement, forwarded to `NgbPopover#placement` (e.g. `'top'`, `'bottom'`, `'auto'`, or an array of fallbacks). Defaults to `'auto'`. */
  readonly placement = input<CbaPopoverPlacement>('auto');

  /** Space-separated trigger events. Defaults to `'hover focus'` (opens on mouse hover and keyboard focus). Use `'click'` for click-only. */
  readonly triggers = input<string>('hover focus');

  /** When `true`, the popover does not open (forwards to `NgbPopover#disablePopover`). */
  readonly disabled = input<boolean>(false);

  /** Emitted after the popover opening animation finishes. */
  readonly shown = output<void>();

  /** Emitted after the popover closing animation finishes and the window is removed from the DOM. */
  readonly hidden = output<void>();

  private readonly ngbPopover = inject(NgbPopover);

  constructor() {
    this.reemitPopoverEvents();
    this.applyDefaultPopoverWindowConfig();
    this.forwardInputsToNgbPopover();
  }

  /** Re-emits `NgbPopover#shown` and `#hidden` through the wrapper outputs. */
  private reemitPopoverEvents(): void {
    this.ngbPopover.shown.subscribe(() => this.shown.emit());
    this.ngbPopover.hidden.subscribe(() => this.hidden.emit());
  }

  /** Sets `popoverClass` and `container` defaults on the host `NgbPopover` without widening the public input API. */
  private applyDefaultPopoverWindowConfig(): void {
    this.ngbPopover.popoverClass = 'cba-popover-window';
    this.ngbPopover.container = 'body';
  }

  /** Reactively forwards every wrapper input to the host `NgbPopover`. */
  private forwardInputsToNgbPopover(): void {
    effect(() => {
      this.ngbPopover.ngbPopover = this.body();
      this.ngbPopover.popoverTitle = this.title();
      this.ngbPopover.placement = this.placement();
      this.ngbPopover.triggers = this.triggers();
      this.ngbPopover.disablePopover = this.disabled();
    });
  }
}
