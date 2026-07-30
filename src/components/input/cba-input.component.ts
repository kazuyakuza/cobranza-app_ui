import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CbaControlValueAccessor } from '../form-field/cba-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import { describedByFieldIds } from '../form-field/cba-field-ids';

let cbaInputUid = 0;

/** Native input type supported by `CbaInput`. */
export type CbaInputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';

/**
 * Theme-aligned text input field with `ControlValueAccessor` integration.
 *
 * Wraps a native `<input>` inside the shared `CbaFieldComponent` layout and
 * exposes `ngModel` / `formControlName` compatibility via `NG_VALUE_ACCESSOR`.
 *
 * @usageNotes
 * ```html
 * <cba-input label="Email" type="email" hint="We never share your email." />
 * ```
 *
 * @see [CBA_INPUT.md](/docs/CBA_INPUT.md)
 */
@Component({
  selector: 'cba-input',
  standalone: true,
  imports: [CbaFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-input.component.html',
  styleUrl: './cba-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaInputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-input',
    '[class.cba-input--disabled]': 'isDisabled()',
    '[class.cba-input--error]': 'error()',
  },
})
export class CbaInputComponent extends CbaControlValueAccessor<string> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Native input type. Defaults to `'text'`. */
  readonly type = input<CbaInputType>('text');

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-input-control-${cbaInputUid++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );

  /** Propagates native input events to the Angular forms layer. */
  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateValue(target.value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
