import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CbaBadgeComponent } from '@cobranza-apps/ui';

/** One row in the demo table. */
export interface TableRow {
  readonly id: string;
  readonly document: string;
  readonly name: string;
  readonly debt: string;
  readonly status: 'overdue' | 'current' | 'settled';
  readonly selected: boolean;
}

/**
 * Demo-only complete table example with header, body, a selected row, and
 * status badges rendered via the library `CbaBadgeComponent`.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-table',
  standalone: true,
  imports: [CbaBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="demo-table">
      <thead>
        <tr>
          <th scope="col">Document</th>
          <th scope="col">Name</th>
          <th scope="col">Debt</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows; track row.id) {
          <tr [class.demo-row--selected]="row.selected">
            <td>{{ row.document }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.debt }}</td>
            <td>
              @switch (row.status) {
                @case ('overdue') {
                  <cba-badge variant="warning" appearance="solid">Overdue</cba-badge>
                }
                @case ('current') {
                  <cba-badge variant="success" appearance="solid">Current</cba-badge>
                }
                @case ('settled') {
                  <cba-badge variant="neutral" appearance="outline">Settled</cba-badge>
                }
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--cba-bg-elevated);
    }
    .demo-table th,
    .demo-table td {
      padding: var(--cba-space-2) var(--cba-space-3);
      border-bottom: 1px solid var(--cba-border-subtle);
      text-align: left;
      font-size: var(--cba-font-size-small);
    }
    .demo-table th {
      font-weight: 600;
      color: var(--cba-text-secondary);
    }
    .demo-row--selected {
      background: var(--cba-selected-bg);
      color: var(--cba-selected-text);
    }
  `,
})
export class DemoTableComponent {
  protected readonly rows: TableRow[] = [
    { id: '20-12345678-9', document: '20-12345678-9', name: 'Comercial del Sur S.A.', debt: '$ 1,250,000', status: 'overdue', selected: true },
    { id: '27-99887766-5', document: '27-99887766-5', name: 'Distribuidora Norte', debt: '$ 480,000', status: 'current', selected: false },
    { id: '30-55443322-1', document: '30-55443322-1', name: 'Tecnología Andina', debt: '$ 0', status: 'settled', selected: false },
  ];
}
