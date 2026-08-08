import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { fieldErrorId, fieldHintId } from './cba-field-ids';

let cbaFieldUid = 0;

/**
 * Internal shared form-field layout reused by `CbaInput`, `CbaSelect`, and
 * `CbaDatepicker`. Not exported from the public API.
 *
 * Renders a consistent label / projected control / hint / error structure and
 * generates stable ids so the parent control can wire `aria-describedby` and
 * `<label for>` associations.
 */
@Component({
  selector: 'cba-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-field.component.html',
  styleUrl: './cba-field.component.scss',
  host: { class: 'cba-field' },
})
export class CbaFieldComponent {
  /** Visible label text. When set, a `<label for="controlId">` is rendered. */
  readonly label = input<string | undefined>(undefined);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  /** Visual disabled state applied to the field wrapper. */
  readonly disabled = input<boolean>(false);

  /** Visual readonly state applied to the field wrapper. Distinct from disabled. */
  readonly readonly = input<boolean>(false);

  /** Visual valid/confirmed state applied to the field wrapper (no validation logic). */
  readonly valid = input<boolean>(false);

  /** Id shared by the native control and `<label for>`. Defaults to a stable uid. */
  readonly controlId = input<string>(`cba-field-control-${cbaFieldUid++}`);

  /** Id of the hint element, derived from `controlId`. */
  readonly hintId = computed(() => fieldHintId(this.controlId()));

  /** Id of the error element, derived from `controlId`. */
  readonly errorId = computed(() => fieldErrorId(this.controlId()));
}
