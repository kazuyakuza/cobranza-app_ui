import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faPen,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { CBA_UI_MESSAGES } from '../../i18n/ui-messages';
import { ModuleHeaderStatus } from '../module-header/module-header.types';

/** Visual configuration derived from a non-null status value. */
interface StatusVisual {
  readonly icon: IconDefinition;
  readonly animation?: 'spin';
}

/** Static status → visual mapping. Mirrors `ModuleHeader` icon semantics. `null` renders no icon. */
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin' },
  loaded: { icon: faCheck },
  success: { icon: faCircleCheck },
  warning: { icon: faTriangleExclamation },
  error: { icon: faCircleXmark },
  dirty: { icon: faPen },
};

/**
 * Optional plain footer bar for a module.
 *
 * Renders a finite-height surface with module status text aligned to the same
 * `ModuleHeaderStatus` semantics used by {@link ModuleHeaderComponent}, plus an
 * optional default projection slot for auxiliary plain content. v1 is
 * intentionally plain: background only, no heavy borders/shadows, no toolbar.
 *
 * The footer is never mandatory: modules omit it entirely when not needed.
 *
 * @usageNotes
 * ```html
 * <cba-module-container [size]="'100%'" [isCollapsed]="false">
 *   <cba-module-header title="Invoice Editor" [status]="headerStatus"></cba-module-header>
 *   <div class="module-body"><!-- MFE content --></div>
 *   <cba-module-footer [status]="'dirty'">Changes are not saved automatically.</cba-module-footer>
 * </cba-module-container>
 * ```
 *
 * @remarks
 * Status values and their default text match {@link ModuleHeaderStatus}. Default
 * status text is Spanish (sourced from `CBA_UI_MESSAGES`); override via the
 * `statusText` input. The status region uses `role="status"` /
 * `aria-live="polite"` so screen readers announce status changes; the icon is
 * decorative (`aria-hidden="true"`).
 *
 * **Status alignment**: The host flex row uses `justify-content: flex-end`, so
 * the status region (text + icon) is right-aligned within the bar. Inside the
 * status region, text appears before the icon: `[status text][status icon]`.
 * The status region itself also uses `justify-content: flex-end` to keep the
 * text-icon group flush to the right edge.
 *
 * @see {@link ModuleHeaderStatus}
 * @see {@link ModuleHeaderComponent}
 * @see [CBA_MODULE_FOOTER.md](/docs/CBA_MODULE_FOOTER.md) — full API docs.
 */
@Component({
  selector: 'cba-module-footer',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-footer.component.html',
  styleUrl: './module-footer.component.scss',
  host: {
    class: 'cba-module-footer',
  },
})
export class CbaModuleFooterComponent {
  /** Module status aligned with {@link ModuleHeaderStatus}. `null` renders no status region. */
  readonly status = input<ModuleHeaderStatus>(null);

  /** Explicit status text override. When provided, wins over the default `CBA_UI_MESSAGES.moduleFooter.status` mapping. */
  readonly statusText = input<string | undefined>(undefined);

  /** Default status text per `ModuleHeaderStatus`. Spanish-only, sourced from `CBA_UI_MESSAGES`. */
  private readonly statusTexts = CBA_UI_MESSAGES.moduleFooter.status;

  /** Status visual config or `null` when `status === null` (icon hidden). */
  readonly statusVisual = computed<StatusVisual | null>(() => {
    const current = this.status();
    return current === null ? null : (STATUS_VISUALS[current] ?? null);
  });

  /** BEM modifier class for the status region, or `null` when no status is set. */
  readonly statusClass = computed<string | null>(() => {
    const current = this.status();
    return current === null ? null : `cba-module-footer__status--${current}`;
  });

  /** Resolved status text: explicit override wins, else default mapping, else empty string. */
  readonly displayText = computed<string>(() => {
    const explicit = this.statusText();
    if (this.hasExplicitText(explicit)) {
      return explicit;
    }
    const current = this.status();
    return current === null ? '' : (this.statusTexts[current] ?? '');
  });

  /** Whether the status region (text + icon + live region) should render at all. */
  readonly hasStatusRegion = computed<boolean>(() => {
    return this.status() !== null || this.statusText() !== undefined;
  });

  /** Whether an explicit status text override is present (`null`/`undefined` mean not provided). */
  private hasExplicitText(text: string | null | undefined): text is string {
    return text !== undefined && text !== null;
  }
}
