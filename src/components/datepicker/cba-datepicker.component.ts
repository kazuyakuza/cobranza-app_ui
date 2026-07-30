import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CbaControlValueAccessor } from '../form-field/cba-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import { describedByFieldIds } from '../form-field/cba-field-ids';

let cbaDatepickerUid = 0;

/**
 * Thin wrapper around the ng-bootstrap datepicker (`NgbInputDatepicker`).
 *
 * ng-bootstrap owns the calendar popup, keyboard navigation, focus, and
 * backdrop. This component owns the shared field layout, theme alignment, a
 * calendar toggle button, and bridges the inner `ngModel` to an outer
 * `ControlValueAccessor<NgbDateStruct | null>`.
 *
 * @usageNotes
 * ```html
 * <cba-datepicker label="Due date" hint="YYYY-MM-DD" [(ngModel)]="due" />
 * ```
 *
 * @see [CBA_DATEPICKER.md](/docs/CBA_DATEPICKER.md)
 */
@Component({
  selector: 'cba-datepicker',
  standalone: true,
  imports: [CbaFieldComponent, FormsModule, NgbInputDatepicker, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-datepicker.component.html',
  styleUrl: './cba-datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaDatepickerComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-datepicker',
    '[class.cba-datepicker--disabled]': 'isDisabled()',
    '[class.cba-datepicker--error]': 'error()',
  },
})
export class CbaDatepickerComponent extends CbaControlValueAccessor<NgbDateStruct | null> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-datepicker-control-${cbaDatepickerUid++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );
  protected readonly faCalendar = faCalendar;

  /** Propagates a date selection from ng-bootstrap to the Angular forms layer. */
  protected onDateChange(value: NgbDateStruct | null): void {
    this.updateValue(value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
