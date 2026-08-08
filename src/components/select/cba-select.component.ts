import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CbaFieldControlValueAccessor } from '../form-field/cba-field-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';

let cbaSelectUid = 0;

/**
 * Theme-aligned native select field with projected `<option>` elements and
 * `ControlValueAccessor` integration. No custom dropdown logic — the browser's
 * native `<select>` handles the dropdown, keyboard navigation, and option
 * rendering.
 *
 * Project `<option>` elements as content children; they are forwarded into the
 * inner `<select>` via `<ng-content select="option">`.
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
    '[class.cba-select--readonly]': 'readonly()',
    '[class.cba-select--valid]': 'valid()',
    '[class.cba-select--error]': 'error()',
    '[class.cba-select--invalid]': 'error()',
  },
})
export class CbaSelectComponent extends CbaFieldControlValueAccessor<string> {
  protected override controlId = `cba-select-control-${cbaSelectUid++}`;

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
