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

/** Token/style info text shown under each button variant in the matrix. */
function buttonTokenInfo(variant: CbaButtonVariant): string {
  switch (variant) {
    case 'primary':
      return '.cba-button--primary · var(--cba-accent-primary) · inverse overlay';
    case 'secondary':
      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)';
    case 'ghost':
      return '.cba-button--ghost · transparent · dark overlay';
    case 'danger':
      return '.cba-button--danger · var(--cba-accent-danger) · inverse overlay';
    case 'success':
      return '.cba-button--success · var(--cba-accent-success) · inverse overlay';
  }
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
          <table class="demo-matrix-table">
            <thead>
              <tr>
                <th scope="col" class="demo-matrix-table__status-head">status</th>
                <th scope="col">primary</th>
                <th scope="col">secondary</th>
                <th scope="col">ghost</th>
                <th scope="col">danger</th>
                <th scope="col">success</th>
              </tr>
            </thead>
            <tbody>
              @for (row of block.rows; track row.state) {
                <tr class="demo-matrix-table__control-row">
                  <th scope="row" class="demo-matrix-table__status">{{ row.state }}</th>
                  @for (cell of row.cells; track cell.variant) {
                    <td class="demo-matrix-table__cell">
                      <cba-button
                        [variant]="cell.variant"
                        [disabled]="cell.state === 'disabled'"
                        [loading]="cell.state === 'loading'">
                        {{ cell.variant | titlecase }}
                      </cba-button>
                    </td>
                  }
                </tr>
                <tr class="demo-matrix-table__info-row">
                  <td></td>
                  @for (cell of row.cells; track cell.variant) {
                    <td class="demo-matrix-table__info">
                      {{ buttonTokenInfo(cell.variant) }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styleUrl: './demo-button-matrix.component.scss',
})
export class DemoButtonMatrixComponent {
  protected readonly buttonTokenInfo = buttonTokenInfo;

  protected readonly blocks: ButtonMatrixBlock[] = [
    buildBlock('bg-secondary', 'demo-surface--secondary'),
    buildBlock('bg-elevated', 'demo-surface--elevated'),
    buildBlock('bg-primary', 'demo-surface--primary'),
  ];
}
