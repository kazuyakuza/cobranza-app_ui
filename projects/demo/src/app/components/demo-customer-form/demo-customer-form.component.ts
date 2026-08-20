import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent, CbaInputComponent } from '@cobranza-apps/ui';

/**
 * Demo-only "New customer" form used inside the "New customer" module card
 * in the demo workspace. Renders three library input fields (Name, Document,
 * Email) via {@link CbaInputComponent} and a primary Add button via
 * {@link CbaButtonComponent} with a `faPlus` icon.
 *
 * **Visual demonstration only** — the form has no validation, no reactive
 * form model, and the Add button is a no-op (`type="button"`, no submit
 * handler). All field values are hard-coded placeholders.
 *
 * **NOT part of the published `@cobranza-apps/ui` library.** This component
 * lives in `projects/demo/` and is consumed exclusively by the demo app.
 *
 * @see CbaInputComponent — library input used for each field
 * @see CbaButtonComponent — library button used for the Add action
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
