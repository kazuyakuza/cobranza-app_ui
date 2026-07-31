import { ChangeDetectionStrategy, Component, forwardRef, input, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CbaFieldControlValueAccessor } from '../form-field/cba-field-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import {
  CbaTypeaheadFormatter,
  CbaTypeaheadItemSelectedEvent,
  CbaTypeaheadPlacement,
  CbaTypeaheadSearchFn,
  defaultCbaTypeaheadFormatter,
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
   * Required search function forwarded to `NgbTypeahead`. Owns debounce and
   * filtering. Engine is ng-bootstrap; no extra autocomplete dependency.
   */
  readonly search = input.required<CbaTypeaheadSearchFn>();

  /**
   * Placeholder text shown in the native input when it is empty.
   */
  readonly placeholder = input<string | undefined>(undefined);

  /**
   * Formats each popup result for display. Passthrough to
   * `NgbTypeahead#resultFormatter`; defaults to `defaultCbaTypeaheadFormatter`
   * (ng-bootstrap's `toString` fallback) when not provided. Engine is
   * ng-bootstrap; no extra autocomplete dependency.
   */
  readonly resultFormatter = input<CbaTypeaheadFormatter>(defaultCbaTypeaheadFormatter);

  /**
   * Formats a selected item back into the input. Passthrough to
   * `NgbTypeahead#inputFormatter`; defaults to `defaultCbaTypeaheadFormatter`
   * (ng-bootstrap's `toString` fallback) when not provided. Engine is
   * ng-bootstrap; no extra autocomplete dependency.
   */
  readonly inputFormatter = input<CbaTypeaheadFormatter>(defaultCbaTypeaheadFormatter);

  /**
   * When `true`, allows free-text values not selected from the popup.
   * Passthrough to `NgbTypeahead#editable`. Engine is ng-bootstrap; no extra
   * autocomplete dependency.
   */
  readonly editable = input<boolean>(true);

  /**
   * When `true`, keeps the first popup result focused while typing.
   * Passthrough to `NgbTypeahead#focusFirst`. Engine is ng-bootstrap; no extra
   * autocomplete dependency.
   */
  readonly focusFirst = input<boolean>(true);

  /**
   * When `true`, shows the matching result as a hint inside the input.
   * Passthrough to `NgbTypeahead#showHint`. Engine is ng-bootstrap; no extra
   * autocomplete dependency.
   */
  readonly showHint = input<boolean>(false);

  /**
   * When `true`, auto-selects when only one exact match exists.
   * Passthrough to `NgbTypeahead#selectOnExact`. Engine is ng-bootstrap; no
   * extra autocomplete dependency.
   */
  readonly selectOnExact = input<boolean>(false);

  /**
   * Preferred popup placement(s). Passthrough to `NgbTypeahead#placement`.
   * Engine is ng-bootstrap; no extra autocomplete dependency.
   */
  readonly placement = input<CbaTypeaheadPlacement>([
    'bottom-start',
    'bottom-end',
    'top-start',
    'top-end',
  ]);

  /**
   * CSS class added to the popup window for theming. Passthrough to
   * `NgbTypeahead#popupClass`. Defaults to `"cba-typeahead-window"`. Engine is
   * ng-bootstrap; no extra autocomplete dependency.
   */
  readonly popupClass = input<string>('cba-typeahead-window');

  /**
   * Emitted when the user selects a popup item. Mirrors
   * `NgbTypeahead#selectItem`. Engine is ng-bootstrap; no extra autocomplete
   * dependency.
   */
  readonly itemSelected = output<CbaTypeaheadItemSelectedEvent>();

  /** Propagates inner input changes to the Angular forms layer. */
  protected onValueChange(value: string | null): void {
    this.updateValue(value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }

  /** Re-emits `NgbTypeahead#selectItem` through the wrapper output. */
  protected onItemSelected(event: CbaTypeaheadItemSelectedEvent): void {
    this.itemSelected.emit(event);
  }
}
