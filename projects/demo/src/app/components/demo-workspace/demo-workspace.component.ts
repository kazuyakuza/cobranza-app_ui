import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent } from '@cobranza-apps/ui';
import { DemoCustomerFormComponent } from '../demo-customer-form/demo-customer-form.component';
import { DemoModuleCardComponent } from '../demo-module-card/demo-module-card.component';
import { DemoPaymentScheduleComponent } from '../demo-payment-schedule/demo-payment-schedule.component';
import { DemoTableComponent } from '../demo-table/demo-table.component';

/**
 * Demo-only workspace section rendering the module examples: six rows of
 * `demo-module-card` in 100% / 50% sizes, expanded / collapsed, with headers
 * and footers as described in the demo TODO.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-workspace',
  standalone: true,
  imports: [
    CbaButtonComponent,
    DemoCustomerFormComponent,
    DemoModuleCardComponent,
    DemoPaymentScheduleComponent,
    DemoTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-workspace.component.html',
  styleUrl: './demo-workspace.component.scss',
})
export class DemoWorkspaceComponent {
  protected readonly faDownload = faDownload;
}
