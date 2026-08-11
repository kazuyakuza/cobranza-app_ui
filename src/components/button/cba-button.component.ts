import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/** Visual style of a CbaButton. */
export type CbaButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

/** Control size. */
export type CbaButtonSize = 'sm' | 'md';

/** Native button type forwarded to the inner `<button>`. */
export type CbaButtonType = 'button' | 'submit' | 'reset';

/** Position of the optional icon relative to the label. */
export type CbaButtonIconPosition = 'leading' | 'trailing';

/**
 * Primary action button for the Cobranza App design system.
 *
 * Renders a native `<button>` for full keyboard accessibility. Supports five
 * variant styles, two sizes, an optional leading/trailing icon via the `icon`
 * input, and a loading state that shows a spinner and disables interaction.
 *
 * Layout modifiers:
 * - `[truncate]="true"` — ellipsis-clamp long labels in constrained containers.
 * - `[iconOnly]="true"` — minimal square icon-only button (provide `aria-label`).
 * - `[block]="true"` — full-width block-level button; ghost variant left-aligns the label.
 *
 * @usageNotes
 * ```html
 * <!-- Primary (default) -->
 * <cba-button (cbaClick)="onSave()">Save</cba-button>
 *
 * <!-- Danger -->
 * <cba-button variant="danger" (cbaClick)="onDelete()">Delete</cba-button>
 *
 * <!-- With leading icon -->
 * <cba-button [icon]="faPlus" iconPosition="leading">Add</cba-button>
 *
 * <!-- Loading / spinner -->
 * <cba-button [loading]="isSaving" (cbaClick)="onSave()">Saving…</cba-button>
 *
 * <!-- Truncated label -->
 * <cba-button [truncate]="true" style="max-width: 120px;">Very long label</cba-button>
 *
 * <!-- Icon-only (aria-label required) -->
 * <cba-button [icon]="faPlus" [iconOnly]="true" aria-label="Add item"></cba-button>
 *
 * <!-- Block-level ghost -->
 * <cba-button variant="ghost" [block]="true" (cbaClick)="onFilter()">Filter</cba-button>
 * ```
 *
 * @see [CBA_BUTTON.md](/docs/CBA_BUTTON.md) — full API docs.
 */
@Component({
  selector: 'cba-button',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-button.component.html',
  styleUrl: './cba-button.component.scss',
  host: {
    class: 'cba-button',
    '[class.cba-button--primary]': "variant() === 'primary'",
    '[class.cba-button--secondary]': "variant() === 'secondary'",
    '[class.cba-button--ghost]': "variant() === 'ghost'",
    '[class.cba-button--danger]': "variant() === 'danger'",
    '[class.cba-button--success]': "variant() === 'success'",
    '[class.cba-button--sm]': "size() === 'sm'",
    '[class.cba-button--md]': "size() === 'md'",
    '[class.cba-button--loading]': 'loading()',
    '[class.cba-button--disabled]': 'isDisabled()',
    '[class.cba-button--truncate]': 'truncate()',
    '[class.cba-button--icon-only]': 'iconOnly()',
    '[class.cba-button--block]': 'block()',
  },
})
export class CbaButtonComponent {
  /** Visual style of the button. */
  readonly variant = input<CbaButtonVariant>('primary');

  /** Control size. */
  readonly size = input<CbaButtonSize>('md');

  /** Shows a spinner and disables interaction while keeping the button layout stable. */
  readonly loading = input<boolean>(false);

  /** Standard disabled state. */
  readonly disabled = input<boolean>(false);

  /** Native button type forwarded to the inner `<button>` element. */
  readonly type = input<CbaButtonType>('button');

  /** Optional leading/trailing icon. */
  readonly icon = input<IconDefinition | undefined>(undefined);

  /** Position of the optional icon relative to the label. */
  readonly iconPosition = input<CbaButtonIconPosition>('leading');

  /**
   * Truncates the button label with an ellipsis when it overflows the
   * available space. Useful for buttons inside constrained flex containers.
   *
   * Drives the host modifier class `cba-button--truncate`.
   *
   * @default false
   */
  readonly truncate = input<boolean>(false);

  /**
   * Renders the button as a minimal square icon-only control.
   *
   * Use when the button has an `icon` but no text content. Removes excessive
   * horizontal padding, applies a square aspect ratio, and keeps the icon
   * centered. Consumers should provide an accessible label via `aria-label`
   * on `<cba-button>` (the icon itself is `aria-hidden`).
   *
   * Drives the host modifier class `cba-button--icon-only`.
   *
   * @default false
   */
  readonly iconOnly = input<boolean>(false);

  /**
   * Makes the button fill the full width of its parent container.
   *
   * The host becomes a block-level element and the internal control spans
   * 100% width. When combined with `variant="ghost"`, the label is
   * left-aligned via `justify-content: flex-start`.
   *
   * Drives the host modifier class `cba-button--block`.
   *
   * @default false
   */
  readonly block = input<boolean>(false);

  /**
   * Emitted when the user clicks the internal native `<button>`.
   *
   * Use the `(cbaClick)` binding on `<cba-button>`:
   * ```html
   * <cba-button (cbaClick)="onSave()">Save</cba-button>
   * ```
   */
  readonly cbaClick = output<void>();

  /** Whether the button is considered non-interactive (disabled or loading). */
  protected readonly isDisabled = (): boolean => this.disabled() || this.loading();

  /** Spinner icon used in the loading state. */
  protected readonly faSpinner = faSpinner;

  /**
   * Handles internal click events, prevents double-firing by stopping
   * propagation of the native DOM event, and emits the component's
   * `click` output once.
   */
  protected onInternalClick(event: MouseEvent): void {
    event.stopPropagation();
    this.cbaClick.emit();
  }
}
