/**
 * Variant, size, type, and icon-position unions consumed by
 * {@link CbaButtonComponent}.
 *
 * | Type | Values | Default |
 * | --- | --- | --- |
 * | `CbaButtonVariant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` |
 * | `CbaButtonSize` | `'sm' \| 'md'` | `'md'` |
 * | `CbaButtonType` | `'button' \| 'submit' \| 'reset'` | `'button'` |
 * | `CbaButtonIconPosition` | `'leading' \| 'trailing'` | `'leading'` |
 *
 * @see [CBA_BUTTON.md](/docs/CBA_BUTTON.md) — full usage docs.
 */

/** Visual style of a CbaButton. */
export type CbaButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

/** Control size. */
export type CbaButtonSize = 'sm' | 'md';

/** Native button type forwarded to the inner `<button>`. */
export type CbaButtonType = 'button' | 'submit' | 'reset';

/** Position of the optional icon relative to the label. */
export type CbaButtonIconPosition = 'leading' | 'trailing';
