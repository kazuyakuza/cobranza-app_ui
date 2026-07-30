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
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCompress,
  faExpand,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faUpRightAndDownLeftFromCenter,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  ModuleHeaderSize,
  ModuleHeaderStatus,
} from './module-header.types';

/** Visual configuration derived from a non-null status value. */
interface StatusVisual {
  readonly icon: IconDefinition;
  readonly animation: 'spin' | undefined;
  readonly modifierClass: string;
}

/** Static status → visual mapping. `null` renders no icon. */
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin', modifierClass: 'cba-module-header__status--loading' },
  loaded: { icon: faCircleCheck, animation: undefined, modifierClass: 'cba-module-header__status--loaded' },
  success: { icon: faCircleCheck, animation: undefined, modifierClass: 'cba-module-header__status--success' },
  warning: { icon: faTriangleExclamation, animation: undefined, modifierClass: 'cba-module-header__status--warning' },
  error: { icon: faCircleXmark, animation: undefined, modifierClass: 'cba-module-header__status--error' },
  dirty: { icon: faPen, animation: undefined, modifierClass: 'cba-module-header__status--dirty' },
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
  host: { '[class.cba-module-header--fullscreen]': 'isFullscreen()' },
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

  /** Target size opposite to the current `size` (emitted on size-toggle click). */
  readonly targetSize = computed<ModuleHeaderSize>(() =>
    this.size() === '100%' ? '50%' : '100%',
  );

  /** Status visual config or `null` when no status is set (icon hidden). */
  readonly statusVisual = computed<StatusVisual | null>(() => {
    const current = this.status();
    return current === null ? null : STATUS_VISUALS[current] ?? null;
  });

  /** Icon definition for the collapse/expand button (dependant on `isCollapsed`). */
  readonly collapseIcon = computed(() =>
    this.isCollapsed() ? faChevronDown : faChevronUp,
  );

  /** Accessible label for the collapse/expand button. */
  readonly collapseLabel = computed(() =>
    this.isCollapsed() ? 'Expand module' : 'Collapse module',
  );

  /** Icon definition for the size-toggle button (represents the target action). */
  readonly sizeToggleIcon = computed(() =>
    this.size() === '100%' ? faCompress : faExpand,
  );

  /** Accessible label for the size-toggle button, describing the target size. */
  readonly sizeToggleLabel = computed(() =>
    this.size() === '100%' ? 'Shrink module to 50%' : 'Expand module to 100%',
  );

  /** Click handler for the collapse/expand button. */
  onCollapseClick(): void {
    this.collapseToggle.emit();
  }

  /** Click handler for the size-toggle button. Emits the computed target size. */
  onSizeToggleClick(): void {
    this.sizeToggle.emit(this.targetSize());
  }

  /** Click handler for the remove button. */
  onRemoveClick(): void {
    this.remove.emit();
  }

  /** Click handler for the fullscreen button. */
  onFullscreenClick(): void {
    this.fullscreenToggle.emit();
  }

  /** Icon definition bound to the remove button (template-referenced constant). */
  readonly faRemoveIcon = faXmark;

  /** Icon definition bound to the fullscreen button (template-referenced constant). */
  readonly faFullscreenIcon = faUpRightAndDownLeftFromCenter;
}
