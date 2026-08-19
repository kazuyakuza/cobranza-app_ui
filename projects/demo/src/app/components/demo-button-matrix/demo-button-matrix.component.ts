import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  CbaButtonComponent,
  CbaButtonVariant,
} from '@cobranza-apps/ui';

/** One button rendered inside the variant × state matrix. */
interface ButtonMatrixCell {
  readonly variant: CbaButtonVariant;
  readonly state: 'normal' | 'disabled' | 'loading';
}

/** One state row inside a surface block. */
interface ButtonMatrixRow {
  readonly state: 'normal' | 'disabled' | 'loading';
  readonly cells: ButtonMatrixCell[];
}

/** One surface block holding three state rows. */
interface ButtonMatrixBlock {
  readonly surfaceTitle: string;
  readonly surfaceClass: string;
  readonly rows: ButtonMatrixRow[];
}

/** The five standard variants reused on every state row. */
const VARIANTS: readonly CbaButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'success'];

/** State names reused for every surface block. */
const STATES: readonly ('normal' | 'disabled' | 'loading')[] = ['normal', 'disabled', 'loading'];

/** Builds a single state row containing all five variants in that state. */
function buildRow(state: 'normal' | 'disabled' | 'loading'): ButtonMatrixRow {
  const cells: ButtonMatrixCell[] = VARIANTS.map((variant) => ({ variant, state }));
  return { state, cells };
}

/** Builds the three-row matrix for one surface block. */
function buildBlock(surfaceTitle: string, surfaceClass: string): ButtonMatrixBlock {
  const rows: ButtonMatrixRow[] = STATES.map((state) => buildRow(state));
  return { surfaceTitle, surfaceClass, rows };
}

/**
 * Demo-only button matrix: five variants × three surfaces × three states
 * (normal / disabled / loading), with a caption under each button.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-button-matrix',
  standalone: true,
  imports: [CbaButtonComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-matrix">
      @for (block of blocks; track block.surfaceTitle) {
        <div [class]="'demo-surface ' + block.surfaceClass">
          <h3>{{ block.surfaceTitle }}</h3>
          @for (row of block.rows; track row.state) {
            <div class="demo-matrix-row">
              <span class="demo-matrix-row__status">{{ row.state }}</span>
              @for (cell of row.cells; track cell.variant) {
                <div class="demo-matrix-cell">
                  <cba-button
                    [variant]="cell.variant"
                    [disabled]="cell.state === 'disabled'"
                    [loading]="cell.state === 'loading'">
                    {{ cell.variant | titlecase }}
                  </cba-button>
                  <span class="demo-matrix-cell__caption">
                    {{ cell.variant }} · .cba-button--{{ cell.variant }} · {{ row.state }} · {{ block.surfaceTitle }}
                  </span>
                </div>
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
    .demo-matrix {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-3);
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
    .demo-matrix-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--cba-space-3);
      margin-top: var(--cba-space-2);
    }
    .demo-matrix-row__status {
      width: 80px;
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
      text-transform: capitalize;
    }
    .demo-matrix-cell {
      display: flex;
      flex-direction: column;
      gap: var(--cba-space-1);
      align-items: flex-start;
    }
    .demo-matrix-cell__caption {
      font-size: var(--cba-font-size-caption);
      color: var(--cba-text-secondary);
    }
  `,
})
export class DemoButtonMatrixComponent {
  protected readonly blocks: ButtonMatrixBlock[] = [
    buildBlock('bg-secondary', 'demo-surface--secondary'),
    buildBlock('bg-elevated', 'demo-surface--elevated'),
    buildBlock('bg-primary', 'demo-surface--primary'),
  ];
}
