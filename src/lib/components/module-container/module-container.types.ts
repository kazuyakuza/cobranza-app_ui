/**
 * Width modes supported by {@link ModuleContainerComponent} `size` input.
 *
 * `'50%'`  — module rendered at half of the workspace row width.
 * `'100%'` — module rendered at the full workspace row width.
 */
export type ModuleContainerSize = '50%' | '100%';

/**
 * Body padding options supported by {@link ModuleContainerComponent} `padding` input.
 *
 * | Value  | Suggested padding            |
 * | ------ | ---------------------------- |
 * | `none` | `0`                          |
 * | `sm`   | Small balanced spacing token |
 * | `md`   | Medium spacing token         |
 */
export type ModuleContainerPadding = 'none' | 'sm' | 'md';
