import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * A simple surface container with optional header, body, and footer slots.
 *
 * Projected content is distributed via three named slots:
 * - `[cbaCardHeader]` — optional header region
 * - default (no attribute) — body content (always rendered)
 * - `[cbaCardFooter]` — optional footer region
 *
 * Empty header and footer regions are hidden via `:empty` in the stylesheet.
 *
 * @usageNotes
 * ```html
 * <!-- Body only -->
 * <cba-card>
 *   <p>Card body content.</p>
 * </cba-card>
 *
 * <!-- Header + body -->
 * <cba-card>
 *   <div cbaCardHeader>Card header</div>
 *   <p>Card body content.</p>
 * </cba-card>
 *
 * <!-- Full layout -->
 * <cba-card>
 *   <div cbaCardHeader>Header</div>
 *   <p>Body</p>
 *   <div cbaCardFooter>Footer</div>
 * </cba-card>
 * ```
 *
 * @see [CBA_CARD.md](/docs/CBA_CARD.md) — full API docs.
 */
@Component({
  selector: 'cba-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-card.component.html',
  styleUrl: './cba-card.component.scss',
  host: {
    class: 'cba-card',
  },
})
export class CbaCardComponent {}
