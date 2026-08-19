import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Demo-only swatch card that displays one theme color token: swatch fill,
 * token name, category tag, and hex value. Reads the color at runtime via
 * CSS variables (no duplicated hex tables).
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-swatch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-swatch" [style.background]="background" [style.color]="color">
      <span class="demo-swatch__name">{{ label }}</span>
      <span class="demo-swatch__tag">{{ tag }}</span>
      <span class="demo-swatch__hex">{{ hex }}</span>
    </div>
  `,
  styleUrl: './demo-swatch.component.scss',
})
export class DemoSwatchComponent {
  @Input() label = '';
  @Input() background = '';
  @Input() color?: string;
  @Input() tag = '';
  @Input() hex = '';
}
