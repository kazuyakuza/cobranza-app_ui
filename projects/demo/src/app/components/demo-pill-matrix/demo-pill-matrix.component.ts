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
          @for (row of block.rows; track row.state) {
            <div class="demo-matrix-row">
              <span class="demo-matrix-row__status">{{ row.state }}</span>
              @for (cell of row.pills; track cell.name) {
                <div class="demo-matrix-cell">
                  <span [class]="pillClassFn(cell, row.state)">{{ cell.name }}</span>
                  <span class="demo-matrix-cell__caption">
                    {{ cell.name }} · .demo-pill--{{ cell.modifier }} · {{ row.state }} · {{ block.surfaceTitle }}
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
    .demo-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--cba-space-1);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: var(--cba-font-size-small);
      border: 1px solid transparent;
    }
    .demo-pill--primary {
      background: var(--cba-accent-primary);
      color: var(--cba-text-inverse);
    }
    .demo-pill--secondary {
      background: var(--cba-bg-elevated);
      color: var(--cba-text-primary);
      border-color: var(--cba-border-subtle);
    }
    .demo-pill--ghost {
      background: transparent;
      color: var(--cba-text-primary);
      border-color: var(--cba-border-default);
    }
    .demo-pill--danger {
      background: var(--cba-accent-danger);
      color: var(--cba-text-inverse);
    }
    .demo-pill--success {
      background: var(--cba-accent-success);
      color: var(--cba-text-inverse);
    }
    .demo-pill--selected {
      background: var(--cba-selected-bg);
      color: var(--cba-selected-text);
      border-color: var(--cba-selected-border);
    }
    .demo-pill--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
})
export class DemoPillMatrixComponent {
  protected readonly blocks: PillMatrixBlock[] = [
    buildPillBlock('bg-secondary', 'demo-surface--secondary'),
    buildPillBlock('bg-elevated', 'demo-surface--elevated'),
    buildPillBlock('bg-primary', 'demo-surface--primary'),
  ];

  protected pillClassFn(cell: PillCell, state: 'normal' | 'disabled' | 'selected'): string {
    return pillClass(cell, state);
  }
}
