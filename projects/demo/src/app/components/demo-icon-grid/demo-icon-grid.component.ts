import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBell,
  faCalendar,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faDownload,
  faInbox,
  faPen,
  faPlus,
  faRefresh,
  faSearch,
  faTrash,
  faTriangleExclamation,
  faUser,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent } from '@cobranza-apps/ui';

/** One predefined icon entry shown in the grid. */
interface IconEntry {
  readonly icon: IconDefinition;
  readonly label: string;
  readonly ariaLabel: string;
}

/**
 * Demo-only grid of predefined Font Awesome icons rendered as icon-only
 * ghost `<cba-button>` elements, each with an English `aria-label` and a
 * text label below.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-icon-grid',
  standalone: true,
  imports: [CbaButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-icon-grid">
      @for (entry of icons; track entry.label) {
        <div class="demo-icon-cell">
          <cba-button
            variant="ghost"
            [iconOnly]="true"
            [icon]="entry.icon"
            [attr.aria-label]="entry.ariaLabel" />
          <span class="demo-icon-cell__label">{{ entry.label }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: var(--cba-space-3);
    }
    .demo-icon-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--cba-space-1);
      padding: var(--cba-space-2);
      border: 1px solid var(--cba-border-subtle);
      border-radius: var(--cba-radius-sm);
      background: var(--cba-bg-elevated);
    }
    .demo-icon-cell__label {
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
    }
  `,
})
export class DemoIconGridComponent {
  protected readonly icons: IconEntry[] = [
    { icon: faBell, label: 'Notifications', ariaLabel: 'Notifications' },
    { icon: faUser, label: 'Profile', ariaLabel: 'Profile' },
    { icon: faGear, label: 'Settings', ariaLabel: 'Settings' },
    { icon: faPlus, label: 'Add', ariaLabel: 'Add' },
    { icon: faRefresh, label: 'Refresh', ariaLabel: 'Refresh' },
    { icon: faDownload, label: 'Download', ariaLabel: 'Download' },
    { icon: faSearch, label: 'Search', ariaLabel: 'Search' },
    { icon: faCalendar, label: 'Calendar', ariaLabel: 'Calendar' },
    { icon: faPen, label: 'Edit', ariaLabel: 'Edit' },
    { icon: faTrash, label: 'Delete', ariaLabel: 'Delete' },
    { icon: faCheck, label: 'Check', ariaLabel: 'Check' },
    { icon: faCircleCheck, label: 'Success', ariaLabel: 'Success' },
    { icon: faTriangleExclamation, label: 'Warning', ariaLabel: 'Warning' },
    { icon: faCircleXmark, label: 'Error', ariaLabel: 'Error' },
    { icon: faInbox, label: 'Empty state', ariaLabel: 'Empty state' },
  ];
}
