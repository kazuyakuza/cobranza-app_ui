import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CbaButtonComponent,
  CbaButtonSize,
  CbaButtonVariant,
} from '@cobranza-apps/ui';

/** One button rendered inside the variant/size matrix. */
interface ButtonSpec {
  label: string;
  variant: CbaButtonVariant;
  size?: CbaButtonSize;
  disabled?: boolean;
  loading?: boolean;
}

/** One surface (panel / elevated / canvas) holding rows of buttons. */
interface ButtonSurface {
  cssClass: string;
  title: string;
  rows: ButtonSpec[][];
}

/** Standard five-variant row reused on every surface. */
const VARIANTS_ROW: ButtonSpec[] = [
  { label: 'Primary', variant: 'primary' },
  { label: 'Secondary', variant: 'secondary' },
  { label: 'Ghost', variant: 'ghost' },
  { label: 'Danger', variant: 'danger' },
  { label: 'Success', variant: 'success' },
];

/**
 * Demo-only button state matrix: variants × surfaces × normal/disabled/loading, sizes sm/md.
 *
 * **NOT part of the public library API.** This component exists solely for the
 * `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 *
 * @see DemoButtonMatrixComponent renders the complete `CbaButton` variant/state matrix
 *      (primary/secondary/ghost/danger/success × panel/elevated/canvas surfaces ×
 *      normal/disabled/loading states × sm/md sizes) using real library components.
 *      Replaces the static HTML preview's fake `.pv-btn` button matrix.
 */
@Component({
  selector: 'demo-button-matrix',
  standalone: true,
  imports: [CbaButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-surfaces">
      @for (surface of surfaces; track surface.title) {
        <div [class]="'demo-surface ' + surface.cssClass">
          <h3>{{ surface.title }}</h3>
          @for (row of surface.rows; track $index) {
            <div class="demo-btn-row">
              @for (button of row; track button.label) {
                <cba-button
                  [variant]="button.variant"
                  [size]="button.size ?? 'md'"
                  [disabled]="button.disabled ?? false"
                  [loading]="button.loading ?? false"
                >{{ button.label }}</cba-button>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .demo-surfaces {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-2);
    }
    .demo-surface {
      padding: var(--cba-space-3);
      border-radius: var(--cba-radius-md);
    }
    .demo-surface--secondary {
      background: var(--cba-bg-secondary);
    }
    .demo-surface--elevated {
      background: var(--cba-bg-elevated);
    }
    .demo-surface--primary {
      background: var(--cba-bg-primary);
    }
    .demo-btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--cba-space-2);
      margin-top: var(--cba-space-2);
    }
  `,
})
export class DemoButtonMatrixComponent {
  protected readonly surfaces: ButtonSurface[] = [
    {
      cssClass: 'demo-surface--secondary',
      title: 'bg-secondary · panel',
      rows: [
        VARIANTS_ROW,
        [
          { label: 'Disabled', variant: 'primary', disabled: true },
          { label: 'Loading', variant: 'secondary', loading: true },
          { label: 'Ghost sm', variant: 'ghost', size: 'sm' },
          { label: 'Primary sm', variant: 'primary', size: 'sm' },
        ],
      ],
    },
    {
      cssClass: 'demo-surface--elevated',
      title: 'bg-elevated',
      rows: [VARIANTS_ROW],
    },
    {
      cssClass: 'demo-surface--primary',
      title: 'bg-primary · canvas',
      rows: [VARIANTS_ROW],
    },
  ];
}
