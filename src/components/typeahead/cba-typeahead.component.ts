import { ChangeDetectionStrategy, Component, forwardRef, input, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { CbaFieldControlValueAccessor } from '../form-field/cba-field-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import {
  CbaTypeaheadFormatter,
  CbaTypeaheadPlacement,
  CbaTypeaheadSearchFn,
} from './cba-typeahead.types';

let cbaTypeaheadUid = 0;

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` `NgbTypeahead`.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns the popup list, filtering via the `search` function,
 *   keyboard navigation, selection, highlight rendering, and Popper positioning.
 * - This component owns the shared field layout (label / hint / error), theme
 *   alignment of the input surface (like `CbaInput`) and of the elevated popup
 *   (via the global `src/theme/_typeahead.scss` scoped by `popupClass`), and
 *   bridges the inner `ngModel` to an outer `ControlValueAccessor<string>`.
 *
 * The control value is the **string currently in the input**. To react to a
 * selected object, listen to the `itemSelected` output.
 *
 * `NgbTypeahead` is applied directly to the internal `<input>` via the
 * `[ngbTypeahead]` template binding — no `hostDirectives` and no manual DI
 * forwarding is needed (unlike `CbaDropdown` / `CbaPopover`).
 *
 * @remarks
 * The autocomplete engine is exclusively `@ng-bootstrap/ng-bootstrap`; no
 * additional autocomplete dependency is introduced.
 *
 * @usageNotes
 * ```html
 * <cba-typeahead
 *   label="State"
 *   placeholder="Start typing..."
 *   [search]="searchStates"
 *   [(ngModel)]="selectedState"
 *   (itemSelected)="onState($event)" />
 * ```
 *
 * @see [CBA_TYPEAHEAD.md](/docs/CBA_TYPEAHEAD.md)
 */
@Component({
  selector: 'cba-typeahead',
  standalone: true,
  imports: [CbaFieldComponent, FormsModule, NgbTypeahead],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-typeahead.component.html',
  styleUrl: './cba-typeahead.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaTypeaheadComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-typeahead',
    '[class.cba-typeahead--disabled]': 'isDisabled()',
    '[class.cba-typeahead--error]': 'error()',
  },
})
export class CbaTypeaheadComponent extends CbaFieldControlValueAccessor<string> {
  protected override controlId = `cba-typeahead-control-${cbaTypeaheadUid++}`;

  /**
   * Required search function forwarded to `NgbTypeahead`. Owns debounce/filter.
   * The autocomplete engine is ng-bootstrap; no extra dependency is introduced.
   */
  readonly search = input.required<CbaTypeaheadSearchFn>();

  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /**
   * Formats each popup result. Mirrors `NgbTypeahead#resultFormatter`.
   * The engine is ng-bootstrap; no extra dependency is introduced.
   */
  readonly resultFormatter = input<CbaTypeaheadFormatter | undefined>(undefined);

  /**
   * Formats a selected item back into the input. Mirrors `NgbTypeahead#inputFormatter`.
   * The engine is ng-bootstrap; no extra dependency is introduced.
   */
  readonly inputFormatter = input<CbaTypeaheadFormatter | undefined>(undefined);

  /** When `true`, allows free-text values not selected from the popup. */
  readonly editable = input<boolean>(true);

  /** Auto-focuses the first popup result while typing. */
  readonly focusFirst = input<boolean>(true);

  /** Shows the matching result as a hint inside the input. */
  readonly showHint = input<boolean>(false);

  /** Auto-selects when only one exact match exists. */
  readonly selectOnExact = input<boolean>(false);

  /** Preferred popup placement(s). */
  readonly placement = input<CbaTypeaheadPlacement>([
    'bottom-start',
    'bottom-end',
    'top-start',
    'top-end',
  ]);

  /** CSS class added to the popup window for theming. Defaults to `"cba-typeahead-window"`. */
  readonly popupClass = input<string>('cba-typeahead-window');

  /** Emitted when the user selects a popup item. Mirrors `NgbTypeahead#selectItem`. */
  readonly itemSelected = output<NgbTypeaheadSelectItemEvent>();

  /** Propagates inner input changes to the Angular forms layer. */
  protected onValueChange(value: string | null): void {
    this.updateValue(value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }

  /** Re-emits `NgbTypeahead#selectItem` through the wrapper output. */
  protected onItemSelected(event: NgbTypeaheadSelectItemEvent): void {
    this.itemSelected.emit(event);
  }
}
