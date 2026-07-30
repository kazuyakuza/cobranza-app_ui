import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CbaControlValueAccessor } from '../form-field/cba-control-value-accessor';
import { describedByFieldIds } from '../form-field/cba-field-ids';
import { CbaFieldComponent } from '../form-field/cba-field.component';

let cbaSelectUid = 0;

/**
 * Theme-aligned native select field with projected `<option>` elements and
 * `ControlValueAccessor` integration. No custom dropdown logic.
 *
 * @usageNotes
 * ```html
 * <cba-select label="Status">
 *   <option value="">Choose…</option>
 *   <option value="active">Active</option>
 * </cba-select>
 * ```
 *
 * @see [CBA_SELECT.md](/docs/CBA_SELECT.md)
 */
@Component({
  selector: 'cba-select',
  standalone: true,
  imports: [CbaFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-select.component.html',
  styleUrl: './cba-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaSelectComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-select',
    '[class.cba-select--disabled]': 'isDisabled()',
    '[class.cba-select--error]': 'error()',
  },
})
export class CbaSelectComponent extends CbaControlValueAccessor<string> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-select-control-${cbaSelectUid++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );

  /** Propagates native change events to the Angular forms layer. */
  protected onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateValue(target.value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
