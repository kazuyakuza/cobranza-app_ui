import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/** Preset skeleton shape. */
export type CbaSkeletonVariant = 'text' | 'avatar' | 'card' | 'table-row' | 'generic';

/**
 * Skeleton placeholder for content that is still loading.
 *
 * Renders an animated shimmer surface in one of five preset shapes. The
 * component is hidden from assistive technology via `aria-hidden="true"` and
 * `role="presentation"` — the parent container should communicate loading
 * state separately (e.g. `aria-busy="true"`).
 *
 * @usageNotes
 * ```html
 * <cba-skeleton variant="generic"></cba-skeleton>
 * <cba-skeleton variant="text"></cba-skeleton>
 * <cba-skeleton variant="card"></cba-skeleton>
 * <cba-skeleton variant="avatar" [width]="'3rem'" [height]="'3rem'"></cba-skeleton>
 * <cba-skeleton variant="table-row"></cba-skeleton>
 * ```
 *
 * @see [CBA_SKELETON.md](/docs/CBA_SKELETON.md) — full API docs.
 */
@Component({
  selector: 'cba-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-skeleton.component.html',
  styleUrl: './cba-skeleton.component.scss',
  host: {
    class: 'cba-skeleton',
    '[class.cba-skeleton--text]': "variant() === 'text'",
    '[class.cba-skeleton--avatar]': "variant() === 'avatar'",
    '[class.cba-skeleton--card]': "variant() === 'card'",
    '[class.cba-skeleton--table-row]': "variant() === 'table-row'",
    '[class.cba-skeleton--generic]': "variant() === 'generic'",
  },
})
export class CbaSkeletonComponent {
  /** Preset skeleton shape. */
  readonly variant = input<CbaSkeletonVariant>('generic');

  /** Optional width override (e.g. `'100%'`, `'12rem'`). */
  readonly width = input<string | null>(null);

  /** Optional height override (e.g. `'1rem'`, `'4rem'`). */
  readonly height = input<string | null>(null);

  /** Default dimensions keyed by variant. */
  private readonly defaultDimensions: Record<CbaSkeletonVariant, { width: string; height: string }> = {
    text: { width: '100%', height: '0.875rem' },
    avatar: { width: '2.5rem', height: '2.5rem' },
    card: { width: '100%', height: '6rem' },
    'table-row': { width: '100%', height: '1rem' },
    generic: { width: '100%', height: '1rem' },
  };

  /** Resolved width using the provided override or the variant default. */
  protected readonly resolvedWidth = computed(() => this.width() ?? this.defaultDimensions[this.variant()].width);

  /** Resolved height using the provided override or the variant default. */
  protected readonly resolvedHeight = computed(() => this.height() ?? this.defaultDimensions[this.variant()].height);
}
