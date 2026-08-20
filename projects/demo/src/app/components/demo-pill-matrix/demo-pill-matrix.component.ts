import { ChangeDetectionStrategy, Component } from '@angular/core';

/** One demo pill rendered inside the variant × state matrix. */
interface PillCell {
  readonly name: string;
  readonly modifier: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
}

/** One state row inside a surface block. */
interface PillMatrixRow {
  readonly state: 'normal' | 'disabled' | 'selected';
  readonly pills: readonly PillCell[];
}

/** One surface block holding three state rows. */
interface PillMatrixBlock {
  readonly surfaceTitle: string;
  readonly surfaceClass: string;
  readonly rows: PillMatrixRow[];
}

/** The five demo pill variants reused on every state row. */
const PILL_VARIANTS: readonly PillCell[] = [
  { name: 'Primary', modifier: 'primary' },
  { name: 'Secondary', modifier: 'secondary' },
  { name: 'Ghost', modifier: 'ghost' },
  { name: 'Danger', modifier: 'danger' },
  { name: 'Success', modifier: 'success' },
];

/** State names reused for every surface block. */
const PILL_STATES: readonly ('normal' | 'disabled' | 'selected')[] = ['normal', 'disabled', 'selected'];

/** Builds a state row reusing the five demo pill variants. */
function buildPillRow(state: 'normal' | 'disabled' | 'selected'): PillMatrixRow {
  return { state, pills: PILL_VARIANTS };
}

/** Builds the three-row matrix for one surface block. */
function buildPillBlock(surfaceTitle: string, surfaceClass: string): PillMatrixBlock {
  const rows: PillMatrixRow[] = PILL_STATES.map((state) => buildPillRow(state));
  return { surfaceTitle, surfaceClass, rows };
}

/** Returns the CSS modifier class for a pill in a given state. Pure helper. */
function pillClass(cell: PillCell, state: 'normal' | 'disabled' | 'selected'): string {
  const base = `demo-pill demo-pill--${cell.modifier}`;
  return state === 'normal' ? base : `${base} demo-pill--${state}`;
}

/** Token/style info text shown under each pill variant in the matrix. */
function pillTokenInfo(modifier: PillCell['modifier']): string {
  switch (modifier) {
    case 'primary':
      return '.demo-pill--primary · var(--cba-accent-primary) · inverse text';
    case 'secondary':
      return '.demo-pill--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)';
    case 'ghost':
      return '.demo-pill--ghost · transparent · var(--cba-border-default)';
    case 'danger':
      return '.demo-pill--danger · var(--cba-accent-danger) · inverse text';
    case 'success':
      return '.demo-pill--success · var(--cba-accent-success) · inverse text';
  }
}

/**
 * Demo-only pill matrix: five pill variants × three surfaces × three states
 * (normal / disabled / selected), with a caption under each pill. Pills are
 * demo-only `<span>` elements styled with theme tokens — there is no library
 * pill component.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-pill-matrix',
  standalone: true,
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
                  @for (cell of row.pills; track cell.name) {
                    <td class="demo-matrix-table__cell">
                      <span [class]="pillClassFn(cell, row.state)">{{ cell.name }}</span>
                    </td>
                  }
                </tr>
                <tr class="demo-matrix-table__info-row">
                  <td></td>
                  @for (cell of row.pills; track cell.name) {
                    <td class="demo-matrix-table__info">
                      {{ pillTokenInfo(cell.modifier) }}
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
  styleUrl: './demo-pill-matrix.component.scss',
})
export class DemoPillMatrixComponent {
  protected readonly pillTokenInfo = pillTokenInfo;

  protected readonly blocks: PillMatrixBlock[] = [
    buildPillBlock('bg-secondary', 'demo-surface--secondary'),
    buildPillBlock('bg-elevated', 'demo-surface--elevated'),
    buildPillBlock('bg-primary', 'demo-surface--primary'),
  ];

  protected pillClassFn(cell: PillCell, state: 'normal' | 'disabled' | 'selected'): string {
    return pillClass(cell, state);
  }
}
