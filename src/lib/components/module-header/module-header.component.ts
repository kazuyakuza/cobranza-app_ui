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
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCompress,
  faExpand,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
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
 * `--cba-*` design tokens. In fullscreen mode only the title is shown. Drag
 * and drop are intentionally NOT implemented here (owned by the Shell +
 * `@cobranza-apps/mfe-events`); the title is never editable from this header.
 *
 * @see {@link ModuleHeaderSize}
 * @see {@link ModuleHeaderStatus}
 */
@Component({
  selector: 'cba-module-header',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-header.component.html',
  styleUrl: './module-header.component.scss',
  host: {},
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

  protected readonly faChevronDown = faChevronDown;
  protected readonly faChevronUp = faChevronUp;
  protected readonly faCompress = faCompress;
  protected readonly faExpand = faExpand;
  protected readonly faRemoveIcon = faXmark;
  protected readonly faFullscreenIcon = faExpand;
}
