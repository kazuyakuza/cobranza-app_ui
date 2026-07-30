import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  CbaButtonIconPosition,
  CbaButtonSize,
  CbaButtonType,
  CbaButtonVariant,
} from './button.types';

/**
 * Primary action button for the Cobranza App design system.
 *
 * Renders a native `<button>` for full keyboard accessibility and proxies the
 * native click event through the `click` output. Supports five variant styles,
 * two sizes, an optional leading/trailing icon via the `icon` input, and a
 * loading state that shows a spinner and disables interaction.
 *
 * @usageNotes
 * ```html
 * <!-- Primary (default) -->
 * <cba-button (click)="onSave()">Save</cba-button>
 *
 * <!-- Danger -->
 * <cba-button variant="danger" (click)="onDelete()">Delete</cba-button>
 *
 * <!-- With leading icon -->
 * <cba-button [icon]="faPlus" iconPosition="leading">Add</cba-button>
 *
 * <!-- Loading / spinner -->
 * <cba-button [loading]="isSaving" (click)="onSave()">Saving…</cba-button>
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
  readonly icon = input<IconDefinition | null>(null);

  /** Position of the optional icon relative to the label. */
  readonly iconPosition = input<CbaButtonIconPosition>('leading');

  /**
   * Emitted when the user clicks the internal native `<button>`.
   *
   * This is a re-emission of the native click event; use `(click)` on
   * `<cba-button>` directly — no additional wrapper is needed.
   */
  readonly click = output<void>();

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
    this.click.emit();
  }
}
