import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowsLeftRight,
  faArrowsLeftRightToLine,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faWindowMaximize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';
import {
  ModuleHeaderSize,
  ModuleHeaderStatus,
} from './module-header.types';

/** Visual configuration derived from a non-null status value. */
interface StatusVisual {
  readonly icon: IconDefinition;
  readonly animation?: 'spin';
}

/** Static status → visual mapping. `null` renders no icon. */
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin' },
  loaded: { icon: faCheck },
  success: { icon: faCircleCheck },
  warning: { icon: faTriangleExclamation },
  error: { icon: faCircleXmark },
  dirty: { icon: faPen },
};

/**
 * Shell-injected header rendered above each MFE module.
 *
 * Renders a three-section layout — status | title | actions — using only
 * `--cba-*` design tokens. In fullscreen mode only the title is shown. The
 * Shell projects an optional drag handle via the `[cbaModuleDragHandle]`
 * projection slot; drag-and-drop is intentionally NOT implemented here (owned
 * by the Shell + `@cobranza-apps/mfe-events`); the title is never editable
 * from this header.
 *
 * Exported from `@cobranza-apps/ui` via `src/public-api.ts`.
 *
 * @usageNotes
 * Basic (no drag handle):
 * ```html
 * <cba-module-header
 *   title="Customers"
 *   [size]="size"
 *   [isCollapsed]="isCollapsed"
 *   [isFullscreen]="isFullscreen"
 *   [status]="status"
 *   (collapseToggle)="onCollapse()"
 *   (sizeToggle)="onSizeChange($event)"
 *   (remove)="onRemove()"
 *   (fullscreenToggle)="onFullscreen()">
 * </cba-module-header>
 * ```
 *
 * Shell wiring with optional drag-handle projection slot:
 * ```html
 * <div cdkDrag>
 *   <cba-module-container [size]="size">
 *     <cba-module-header
 *       [title]="title"
 *       [status]="status"
 *       [size]="size"
 *       [isCollapsed]="isCollapsed"
 *       [isFullscreen]="false"
 *       (collapseToggle)="onCollapse()"
 *       (sizeToggle)="onSizeChange($event)"
 *       (remove)="onRemove()"
 *       (fullscreenToggle)="onFullscreen()">
 *       <button
 *         type="button"
 *         cbaModuleDragHandle
 *         cdkDragHandle
 *         class="cba-module-header__action cba-module-header__action--drag"
 *         aria-label="Arrastrar módulo">
 *       </button>
 *     </cba-module-header>
 *   </cba-module-container>
 * </div>
 * ```
 * The library does NOT depend on `@angular/cdk`; drag-and-drop is owned by the Shell.
 *
 * Aria-labels and tooltips for action buttons are Spanish by default (sourced
 * from `CBA_UI_MESSAGES`). There is no i18n framework; the platform is
 * Spanish-only.
 *
 * @see {@link ModuleHeaderSize}
 * @see {@link ModuleHeaderStatus}
 * @see [MODULE_HEADER.md](/docs/MODULE_HEADER.md) — full API, status values, fullscreen & drag notes.
 */
@Component({
  selector: 'cba-module-header',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-header.component.html',
  styleUrl: './module-header.component.scss',
  host: {
    class: 'cba-module-header',
    '[class.cba-module-header--fullscreen]': 'isFullscreen()',
  },
})
export class ModuleHeaderComponent {
  /** Module title rendered in the center section. Provided by the MFE / Shell. Required. */
  readonly title = input.required<string>();

  /** Current module width mode. Drives the size-toggle button icon & label. */
  readonly size = input<ModuleHeaderSize>('100%');

  /** Whether the module body is collapsed. Drives the collapse/expand icon. The component never mutates it. */
  readonly isCollapsed = input<boolean>(false);

  /** When `true`, only the title section is rendered (no status, no actions). */
  readonly isFullscreen = input<boolean>(false);

  /** Optional status indicator rendered in the left section. `null` renders nothing. */
  readonly status = input<ModuleHeaderStatus>(null);

  /** Emitted when the user clicks the collapse / expand button. */
  readonly collapseToggle = output<void>();

  /** Emitted when the user clicks the size-toggle button; payload is the requested target size. */
  readonly sizeToggle = output<ModuleHeaderSize>();

  /** Emitted when the user clicks the remove button. */
  readonly remove = output<void>();

  /** Emitted when the user clicks the fullscreen button. */
  readonly fullscreenToggle = output<void>();

  /** Status visual config or `null` when no status is set (icon hidden). */
  readonly statusVisual = computed<StatusVisual | null>(() => {
    const current = this.status();
    return current === null ? null : STATUS_VISUALS[current] ?? null;
  });

  /** CSS modifier class for the status section, derived from the current status. */
  readonly statusClass = computed<string | null>(() => {
    const current = this.status();
    return current === null ? null : `cba-module-header__status--${current}`;
  });

  /** Icon for the collapse button (visible when `isCollapsed === false`). Template-referenced. */
  protected readonly faChevronUp = faChevronUp;

  /** Icon for the expand button (visible when `isCollapsed === true`). Template-referenced. */
  protected readonly faChevronDown = faChevronDown;

  /** Fullscreen button icon. Template-referenced. */
  protected readonly faFullscreen = faWindowMaximize;

  /** Icon for the size-toggle button when current size is `100%` (action: shrink to 50%). Template-referenced. */
  protected readonly faShrink = faArrowsLeftRightToLine;

  /** Icon for the size-toggle button when current size is `50%` (action: expand to 100%). Template-referenced. */
  protected readonly faGrow = faArrowsLeftRight;

  /** Icon for the remove button (`fa-xmark`). Template-referenced. */
  protected readonly faXmark = faXmark;

  /** Aria/title defaults for header action buttons. Spanish-only, sourced from `CBA_UI_MESSAGES`. */
  protected readonly aria = CBA_UI_MESSAGES.moduleHeader.aria;

  /** Label/tooltip for the collapse button, derived from `isCollapsed`. */
  protected readonly collapseLabel = computed<string>(() =>
    this.isCollapsed()
      ? CBA_UI_MESSAGES.moduleHeader.aria.collapse.expand
      : CBA_UI_MESSAGES.moduleHeader.aria.collapse.collapse,
  );

  /** Icon for the collapse button, derived from `isCollapsed`. */
  protected readonly collapseIcon = computed<IconDefinition>(() =>
    this.isCollapsed() ? faChevronDown : faChevronUp,
  );

  /** Label/tooltip for the size-toggle button, derived from the current size. */
  protected readonly sizeToggleLabel = computed<string>(() =>
    this.isFullSize()
      ? CBA_UI_MESSAGES.moduleHeader.aria.size.shrink
      : CBA_UI_MESSAGES.moduleHeader.aria.size.expand,
  );

  /** Icon for the size-toggle button, derived from the current size. */
  protected readonly sizeToggleIcon = computed<IconDefinition>(() =>
    this.isFullSize() ? this.faShrink : this.faGrow,
  );

  /** Target size emitted when the size-toggle button is clicked (the opposite of the current size). */
  protected readonly sizeToggleTarget = computed<ModuleHeaderSize>(() =>
    this.isFullSize() ? '50%' : '100%',
  );

  /** Whether the module is currently at full width (`100%`). */
  private isFullSize(): boolean {
    return this.size() === '100%';
  }
}
