import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Demo-only swatch card that displays one theme token value read at runtime
 * via its `background` / `color` CSS variables (no duplicated hex tables).
 *
 * **NOT part of the public library API.** This component exists solely for the
 * `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 *
 * @see DemoSwatchComponent renders a single color token swatch in the demo app's
 *      token showcase section. Token values come from `var(--cba-*)` CSS variables.
 */
@Component({
  selector: 'demo-swatch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-swatch" [style.background]="background" [style.color]="color">
      {{ label }}
    </div>
  `,
  styleUrl: './demo-swatch.component.scss',
})
export class DemoSwatchComponent {
  @Input() label = '';
  @Input() background = '';
  @Input() color?: string;
}
