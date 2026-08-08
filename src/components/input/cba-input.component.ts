import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CbaFieldControlValueAccessor } from '../form-field/cba-field-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';

let cbaInputUid = 0;

/** Native input type supported by `CbaInput`. */
export type CbaInputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';

/**
 * Theme-aligned text input field with `ControlValueAccessor` integration.
 *
 * Wraps a native `<input>` inside the shared `CbaFieldComponent` layout and
 * exposes `ngModel` / `formControlName` compatibility via `NG_VALUE_ACCESSOR`.
 *
 * The native input is reset to a transparent, borderless state via the
 * `%cba-native-control` SCSS placeholder; the visible border, focus ring, and
 * background come from the parent `CbaFieldComponent` wrapper.
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
    '[class.cba-input--readonly]': 'readonly()',
    '[class.cba-input--valid]': 'valid()',
    '[class.cba-input--error]': 'error()',
    '[class.cba-input--invalid]': 'error()',
  },
})
export class CbaInputComponent extends CbaFieldControlValueAccessor<string> {
  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Native input type. Defaults to `'text'`. */
  readonly type = input<CbaInputType>('text');

  protected override controlId = `cba-input-control-${cbaInputUid++}`;

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
