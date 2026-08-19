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
  /** Token display name (e.g. `bg-primary`). */
  @Input() label = '';
  /** CSS background value — typically `var(--cba-<token>)`. */
  @Input() background = '';
  /** Optional foreground color; falls back to the CSS default when unset. */
  @Input() color?: string;
  /** Category tag shown as a small chip (e.g. `Background`, `Text`). */
  @Input() tag = '';
  /** Raw hex value displayed as text (e.g. `#BCB5A4`). */
  @Input() hex = '';
}
