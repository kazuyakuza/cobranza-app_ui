/**
 * Variant and appearance unions consumed by {@link CbaBadgeComponent}.
 *
 * | Type | Values | Default |
 * | --- | --- | --- |
 * | `CbaBadgeVariant` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` |
 * | `CbaBadgeAppearance` | `'solid' \| 'outline'` | `'solid'` |
 *
 * @see [CBA_BADGE.md](/docs/CBA_BADGE.md) — full usage docs.
 */

/** Semantic colour of a CbaBadge. */
export type CbaBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Fill style. */
export type CbaBadgeAppearance = 'solid' | 'outline';
