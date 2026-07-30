/**
 * Width modes supported by {@link ModuleHeaderComponent} `size` input.
 *
 * `'50%'`  — module rendered at half of the workspace width.
 * `'100%'` — module rendered at full workspace width.
 */
export type ModuleHeaderSize = '50%' | '100%';

/**
 * Optional status indicator rendered in the header's status section.
 *
 * | Value     | Visual                      | Typical use                       |
 * | --------- | --------------------------- | --------------------------------- |
 * | `loading` | Spinner (spin animation)    | Data loading / ongoing operation. |
 * | `loaded`  | Check icon                  | Data ready (no explicit save).    |
 * | `success` | Stronger success check icon | Explicit save / submit succeeded. |
 * | `warning` | Warning triangle icon       | Soft validation / incomplete data.|
 * | `error`   | Error icon                  | Load failure / hard validation.   |
 * | `dirty`   | Pencil icon                 | Unsaved changes present.           |
 * | `null`    | Nothing rendered           | Normal state.                     |
 *
 * `null` is the default and the only value that suppresses the status section icon.
 */
export type ModuleHeaderStatus =
  | 'loading'
  | 'loaded'
  | 'success'
  | 'warning'
  | 'error'
  | 'dirty'
  | null;
