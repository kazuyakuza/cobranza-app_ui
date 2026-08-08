import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';
import { CbaFieldControlValueAccessor } from '../form-field/cba-field-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';

let cbaDatepickerUid = 0;

/**
 * Thin wrapper around the ng-bootstrap datepicker (`NgbInputDatepicker`).
 *
 * **Responsibility split:**
 * - ng-bootstrap owns the calendar popup, keyboard navigation, date parsing,
 *   focus management, and backdrop.
 * - This component owns the shared field layout (label / hint / error),
 *   theme alignment, a calendar toggle button, and bridges the inner
 *   `ngModel` to an outer `ControlValueAccessor<NgbDateStruct | null>`.
 *
 * The value type is `NgbDateStruct | null` — consumers must import
 * `NgbDateStruct` from `@ng-bootstrap/ng-bootstrap` when typing model bindings.
 *
 * @usageNotes
 * ```html
 * <cba-datepicker label="Due date" hint="YYYY-MM-DD" [(ngModel)]="due" />
 * ```
 *
 * The toggle-button aria-label is Spanish by default ("Abrir selector de fecha",
 * sourced from `CBA_UI_MESSAGES`). There is no i18n framework; the platform is
 * Spanish-only.
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
    '[class.cba-datepicker--readonly]': 'readonly()',
    '[class.cba-datepicker--valid]': 'valid()',
    '[class.cba-datepicker--error]': 'error()',
    '[class.cba-datepicker--invalid]': 'error()',
  },
})
export class CbaDatepickerComponent extends CbaFieldControlValueAccessor<NgbDateStruct | null> {
  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  protected override controlId = `cba-datepicker-control-${cbaDatepickerUid++}`;
  protected readonly faCalendar = faCalendar;

  /** Aria-label for the datepicker toggle button. Spanish-only, sourced from `CBA_UI_MESSAGES`. */
  protected readonly toggleAriaLabel = CBA_UI_MESSAGES.datepicker.aria.open;

  /** Propagates a date selection from ng-bootstrap to the Angular forms layer. */
  protected onDateChange(value: NgbDateStruct | null): void {
    this.updateValue(value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
