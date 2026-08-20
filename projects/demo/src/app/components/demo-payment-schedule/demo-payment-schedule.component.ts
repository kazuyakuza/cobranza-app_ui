import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { CbaBadgeComponent, CbaBadgeVariant } from '@cobranza-apps/ui';

/** One scheduled payment row shown under the calendar. */
interface DemoPayment {
  readonly customer: string;
  readonly amount: string;
  readonly status: 'pending' | 'paid';
  readonly variant: CbaBadgeVariant;
}

/**
 * Demo-only payment schedule view used inside the "Payment schedule" module
 * card in the demo workspace. Renders:
 *
 * - A visual calendar month header (September 2026) with a 7-column CSS grid
 *   of day numbers (1–30). Day 15 is highlighted with the accent-primary
 *   background to indicate the selected date.
 * - A list of hard-coded payment rows for 2026-09-15, each showing customer
 *   name, amount, and a status badge via {@link CbaBadgeComponent}
 *   (warning-outline for pending, success-outline for paid).
 *
 * **All data is static** — no API calls, no dynamic date computation. The
 * calendar layout and payment list are purely visual demonstrations.
 *
 * **NOT part of the published `@cobranza-apps/ui` library.** This component
 * lives in `projects/demo/` and is consumed exclusively by the demo app.
 *
 * @see CbaBadgeComponent — library badge used for payment status indicators
 * @see DemoPayment - interface describing each hard-coded payment row
 */
@Component({
  selector: 'demo-payment-schedule',
  standalone: true,
  imports: [CbaBadgeComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-payment-schedule.component.html',
  styleUrl: './demo-payment-schedule.component.scss',
})
export class DemoPaymentScheduleComponent {
  protected readonly monthYear = 'September 2026';
  protected readonly selectedDate = '2026-09-15';
  protected readonly selectedDay = 15;
  protected readonly days: readonly number[] = Array.from({ length: 30 }, (_, index) => index + 1);
  protected readonly payments: readonly DemoPayment[] = [
    { customer: 'Comercial del Sur S.A.', amount: '$ 625,000', status: 'pending', variant: 'warning' },
    { customer: 'Distribuidora Norte', amount: '$ 480,000', status: 'pending', variant: 'warning' },
    { customer: 'Tecnología Andina', amount: '$ 0', status: 'paid', variant: 'success' },
  ];
}
