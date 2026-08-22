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

/**
 * Visibility and disabled-state controls for the built-in action buttons
 * rendered by {@link ModuleHeaderComponent}.
 *
 * All properties default to `true` so existing consumers continue to see
 * every action button enabled.
 */
export interface ModuleHeaderActionsConfig {
  /** When `false`, the collapse/expand button is removed from the DOM. */
  showCollapse?: boolean;
  /** When `false`, the size-toggle button is removed from the DOM. */
  showSizeToggle?: boolean;
  /** When `false`, the fullscreen button is removed from the DOM. */
  showFullscreen?: boolean;
  /** When `false`, the remove button is removed from the DOM. */
  showRemove?: boolean;
  /** When `false`, the collapse/expand button is rendered `[disabled]`. */
  enableCollapse?: boolean;
  /** When `false`, the size-toggle button is rendered `[disabled]`. */
  enableSizeToggle?: boolean;
  /** When `false`, the fullscreen button is rendered `[disabled]`. */
  enableFullscreen?: boolean;
  /** When `false`, the remove button is rendered `[disabled]`. */
  enableRemove?: boolean;
}

/** Default action controls: every action is visible and enabled. */
export const DEFAULT_MODULE_HEADER_ACTIONS_CONFIG: Required<ModuleHeaderActionsConfig> = {
  showCollapse: true,
  showSizeToggle: true,
  showFullscreen: true,
  showRemove: true,
  enableCollapse: true,
  enableSizeToggle: true,
  enableFullscreen: true,
  enableRemove: true,
};
