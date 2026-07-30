import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Centered empty-state placeholder with icon, title, description, and action
 * slots.
 *
 * - Icon and action are content-projected via the `[cbaEmptyStateIcon]` and
 *   `[cbaEmptyStateAction]` attributes.
 * - Title is a **required** string input rendered as an `<h3>`.
 * - Description is an optional string input.
 *
 * @usageNotes
 * ```html
 * <cba-empty-state
 *   title="No items found"
 *   description="Try adjusting your filters">
 *   <fa-icon cbaEmptyStateIcon [icon]="['fas','inbox']" aria-hidden="true" />
 *   <cba-button cbaEmptyStateAction (click)="onReset()">
 *     Reset Filters
 *   </cba-button>
 * </cba-empty-state>
 * ```
 *
 * @see [CBA_EMPTY_STATE.md](/docs/CBA_EMPTY_STATE.md) — full API docs.
 */
@Component({
  selector: 'cba-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-empty-state.component.html',
  styleUrl: './cba-empty-state.component.scss',
  host: {
    class: 'cba-empty-state',
  },
})
export class CbaEmptyStateComponent {
  /** Primary message of the empty state. Required for meaningful UX. */
  readonly title = input.required<string>();

  /** Optional secondary explanatory text below the title. */
  readonly description = input<string>('');
}
