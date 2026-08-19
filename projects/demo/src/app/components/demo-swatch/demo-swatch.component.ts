import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Demo-only swatch card that displays one theme token value read at runtime
 * via its `background` / `color` CSS variables (no duplicated hex tables).
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
