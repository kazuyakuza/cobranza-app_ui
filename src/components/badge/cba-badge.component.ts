import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/** Semantic colour of a CbaBadge. */
export type CbaBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Fill style. */
export type CbaBadgeAppearance = 'solid' | 'outline';

/**
 * Compact status indicator that renders a pill-shaped label.
 *
 * Supports six semantic variants and two appearance styles (solid / outline).
 * The component is non-interactive — `role="status"` is set on the inner
 * content element for accessibility.
 *
 * @usageNotes
 * ```html
 * <cba-badge variant="neutral" appearance="solid">Draft</cba-badge>
 * <cba-badge variant="success" appearance="outline">Active</cba-badge>
 * <cba-badge variant="danger">Error</cba-badge>
 * ```
 *
 * @see [CBA_BADGE.md](/docs/CBA_BADGE.md) — full API docs.
 */
@Component({
  selector: 'cba-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-badge.component.html',
  styleUrl: './cba-badge.component.scss',
  host: {
    class: 'cba-badge',
    '[class.cba-badge--primary]': "variant() === 'primary'",
    '[class.cba-badge--success]': "variant() === 'success'",
    '[class.cba-badge--warning]': "variant() === 'warning'",
    '[class.cba-badge--danger]': "variant() === 'danger'",
    '[class.cba-badge--info]': "variant() === 'info'",
    '[class.cba-badge--neutral]': "variant() === 'neutral'",
    '[class.cba-badge--solid]': "appearance() === 'solid'",
    '[class.cba-badge--outline]': "appearance() === 'outline'",
  },
})
export class CbaBadgeComponent {
  /** Semantic colour of the badge. */
  readonly variant = input<CbaBadgeVariant>('neutral');

  /** Fill style — solid background or transparent with border. */
  readonly appearance = input<CbaBadgeAppearance>('solid');
}
