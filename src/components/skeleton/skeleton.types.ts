/**
 * Variant union consumed by {@link CbaSkeletonComponent}.
 *
 * | Variant | Intent |
 * | --- | --- |
 * | `'text'` | One or more text-line placeholders. |
 * | `'avatar'` | Circular placeholder. |
 * | `'card'` | Block placeholder resembling a card surface. |
 * | `'table-row'` | Multi-cell row placeholder (useful while any table loads). |
 * | `'generic'` | Simple rectangular block (default). |
 *
 * @see [CBA_SKELETON.md](/docs/CBA_SKELETON.md) — full usage docs.
 */

/** Preset skeleton shape. */
export type CbaSkeletonVariant = 'text' | 'avatar' | 'card' | 'table-row' | 'generic';
