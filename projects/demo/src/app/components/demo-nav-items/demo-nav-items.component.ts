import { ChangeDetectionStrategy, Component } from '@angular/core';

/** One navigation item shown in the demo nav row. */
interface NavItem {
  readonly label: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

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
      @for (item of items; track item.label) {
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
  styles: `
    :host {
      display: block;
    }
    .demo-nav {
      display: flex;
      gap: var(--cba-space-2);
      flex-wrap: wrap;
    }
    .demo-nav-item {
      padding: var(--cba-space-1) var(--cba-space-3);
      border-radius: var(--cba-radius-sm);
      border: 1px solid var(--cba-border-strong);
      color: var(--cba-text-secondary);
      background: var(--cba-bg-secondary);
      text-decoration: none;
      font-size: var(--cba-font-size-small);
    }
    .demo-nav-item:hover {
      background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
      color: var(--cba-text-primary);
    }
    .demo-nav-item--selected {
      background: var(--cba-selected-bg);
      border-color: var(--cba-selected-border);
      color: var(--cba-selected-text);
      font-weight: 600;
    }
    .demo-nav-item--selected:hover {
      background-image: none;
    }
    .demo-nav-item--disabled {
      background: var(--cba-state-disabled-bg);
      border-color: var(--cba-border-subtle);
      color: var(--cba-state-disabled-text);
      cursor: not-allowed;
    }
    .demo-nav-item--disabled:hover {
      background-image: none;
    }
  `,
})
export class DemoNavItemsComponent {
  protected readonly items: NavItem[] = [
    { label: 'Customers', selected: true, disabled: false },
    { label: 'Invoices', selected: false, disabled: false },
    { label: 'Reports', selected: false, disabled: false },
    { label: 'Settings', selected: false, disabled: true },
  ];
}
