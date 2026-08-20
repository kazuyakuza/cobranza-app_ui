import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CbaBadgeComponent } from '@cobranza-apps/ui';

/** One scheduled payment row shown under the calendar. */
interface DemoPayment {
  readonly customer: string;
  readonly amount: string;
  readonly status: 'pending' | 'paid';
}

/**
 * Demo-only payment schedule view. Shows a visual September 2026 calendar
 * with the 15th highlighted, plus a list of hard-coded payments for that day.
 *
 * **NOT part of the public library API.**
 */
@Component({
  selector: 'demo-payment-schedule',
  standalone: true,
  imports: [CbaBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-payment-schedule.component.html',
  styleUrl: './demo-payment-schedule.component.scss',
})
export class DemoPaymentScheduleComponent {
  protected readonly monthYear = 'September 2026';
  protected readonly selectedDate = '2026-09-15';
  protected readonly days: readonly number[] = Array.from({ length: 30 }, (_, index) => index + 1);
  protected readonly payments: readonly DemoPayment[] = [
    { customer: 'Comercial del Sur S.A.', amount: '$ 625,000', status: 'pending' },
    { customer: 'Distribuidora Norte', amount: '$ 480,000', status: 'pending' },
    { customer: 'Tecnología Andina', amount: '$ 0', status: 'paid' },
  ];
}
