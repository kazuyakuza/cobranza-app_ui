import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** One navigation item shown in the demo nav row. */
export interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

/** Default English items used when no `[items]` input is bound. */
const DEFAULT_ITEMS: readonly NavItem[] = [
  { label: 'Customers', selected: true, disabled: false },
  { label: 'Invoices', selected: false, disabled: false },
  { label: 'Reports', selected: false, disabled: false },
  { label: 'Settings', selected: false, disabled: true },
];

/**
 * Demo-only horizontal navigation items example showing normal, selected,
 * hover, and disabled states. Renders plain `<a>` elements styled with theme
 * tokens — there is no library nav-item component.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-nav-items',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="demo-nav" aria-label="Demo navigation">
      @for (item of items(); track item.label) {
        <a
          class="demo-nav-item"
          [class.demo-nav-item--selected]="item.selected"
          [class.demo-nav-item--disabled]="item.disabled"
          [attr.aria-current]="item.selected ? 'page' : null"
          [attr.aria-disabled]="item.disabled ? 'true' : null"
          href="#">
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  styleUrl: './demo-nav-items.component.scss',
})
export class DemoNavItemsComponent {
  readonly items = input<readonly NavItem[]>(DEFAULT_ITEMS);
}
