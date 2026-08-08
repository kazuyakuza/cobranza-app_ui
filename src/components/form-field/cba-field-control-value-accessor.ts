import { computed, Directive, input } from '@angular/core';
import { CbaControlValueAccessor } from './cba-control-value-accessor';
import { describedByFieldIds } from './cba-field-ids';

/**
 * Shared base directive for form controls (`CbaInput`, `CbaSelect`, `CbaDatepicker`)
 * that own common field inputs and computed state.
 *
 * Each child must assign a unique `controlId` string during construction.
 * The `isDisabled` and `describedBy` computeds are derived from the common inputs
 * and the parent's `disabledFromCva` signal.
 */
@Directive()
export abstract class CbaFieldControlValueAccessor<T> extends CbaControlValueAccessor<T> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  /** Visual readonly state applied to the field wrapper. Distinct from disabled. */
  readonly readonly = input<boolean>(false);

  /** Visual valid/confirmed state applied to the field wrapper (no validation logic). */
  readonly valid = input<boolean>(false);

  /** Combined disabled state from the `disabled` input and Angular forms. */
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());

  /**
   * Space-separated `aria-describedby` listing hint and/or error element ids,
   * or `null` when neither is present.
   */
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );

  /** Stable id shared by the native control and `<label for>`. Assigned by child. */
  protected controlId: string = '';
}
