import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent, CbaInputComponent } from '@cobranza-apps/ui';

/**
 * Demo-only "New customer" form. Renders three library input fields and a
 * primary Add button. No validation or submit logic — purely visual.
 *
 * **NOT part of the public library API.**
 */
@Component({
  selector: 'demo-customer-form',
  standalone: true,
  imports: [CbaButtonComponent, CbaInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-customer-form.component.html',
  styleUrl: './demo-customer-form.component.scss',
})
export class DemoCustomerFormComponent {
  protected readonly faPlus = faPlus;
}
