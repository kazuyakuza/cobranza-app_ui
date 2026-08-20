import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  faBell,
  faDownload,
  faPlus,
  faRefresh,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  CbaButtonComponent,
  CbaCardComponent,
  CbaDatepickerComponent,
  CbaInputComponent,
  CbaSelectComponent,
} from '@cobranza-apps/ui';
import { DemoButtonMatrixComponent } from './components/demo-button-matrix/demo-button-matrix.component';
import { DemoIconGridComponent } from './components/demo-icon-grid/demo-icon-grid.component';
import { DemoNavItemsComponent, NavItem } from './components/demo-nav-items/demo-nav-items.component';
import { DemoPillMatrixComponent } from './components/demo-pill-matrix/demo-pill-matrix.component';
import { DemoSectionComponent } from './components/demo-section/demo-section.component';
import { DemoSwatchComponent } from './components/demo-swatch/demo-swatch.component';
import { DemoTableComponent } from './components/demo-table/demo-table.component';
import { DemoTextShowcaseComponent } from './components/demo-text-showcase/demo-text-showcase.component';
import { DemoWorkspaceComponent } from './components/demo-workspace/demo-workspace.component';

/** One color token shown in the token grid. */
interface ColorToken {
  readonly name: string;
  readonly tag: string;
  readonly hex: string;
  readonly variable: string;
}

/** One form-control surface card in the inputs section. */
interface InputSurface {
  readonly title: string;
  readonly className: string;
}

/** Model for the form example (two-way bound via ngModel). */
interface FormFieldModel {
  readonly customerName: string;
  readonly email: string;
  readonly status: string;
  readonly dueDate: NgbDateStruct | null;
}

/**
 * Root component of the demo mini-app. Assembles the shell chrome
 * (header, workspace, footer) and wires every `demo-*` showcase section
 * to the built `@cobranza-apps/ui` library.
 *
 * **NOT part of the public library API.** This component exists solely
 * for the `projects/demo/` mini-app and is not exported from
 * `@cobranza-apps/ui`.
 *
 * @see DemoWorkspaceComponent — module card grid
 * @see DemoSectionComponent — repeated section wrapper
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CbaButtonComponent,
    CbaCardComponent,
    CbaDatepickerComponent,
    CbaInputComponent,
    CbaSelectComponent,
    DemoButtonMatrixComponent,
    DemoIconGridComponent,
    DemoNavItemsComponent,
    DemoPillMatrixComponent,
    DemoSectionComponent,
    DemoSwatchComponent,
    DemoTableComponent,
    DemoTextShowcaseComponent,
    DemoWorkspaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly pageTitle = 'Demo app — consumes @cobranza-apps/ui build';

  protected readonly faBell = faBell;
  protected readonly faUser = faUser;
  protected readonly faPlus = faPlus;
  protected readonly faRefresh = faRefresh;
  protected readonly faDownload = faDownload;

  protected readonly footerItems: readonly NavItem[] = [
    { label: 'Clientes', selected: true, disabled: false },
    { label: 'Deudas', selected: false, disabled: false },
    { label: 'Pagos', selected: false, disabled: false },
    { label: 'Reportes', selected: false, disabled: false },
  ];

  protected sampleText = '';
  protected sampleSelect = '';
  protected readonly formModel: FormFieldModel = {
    customerName: '',
    email: '',
    status: '',
    dueDate: null,
  };

  private readonly COLOR_TOKEN_SOURCE: readonly { readonly name: string; readonly tag: string; readonly hex: string }[] = [
    { name: 'bg-primary', tag: 'Background', hex: '#BCB5A4' },
    { name: 'bg-secondary', tag: 'Background', hex: '#F2F0E8' },
    { name: 'bg-tertiary', tag: 'Background', hex: '#D8C3A5' },
    { name: 'bg-elevated', tag: 'Background', hex: '#FDFCF8' },
    { name: 'text-primary', tag: 'Text', hex: '#2B2620' },
    { name: 'text-secondary', tag: 'Text', hex: '#4A4640' },
    { name: 'text-muted', tag: 'Text', hex: '#625C55' },
    { name: 'text-inverse', tag: 'Text', hex: '#FDFCF8' },
    { name: 'border-subtle', tag: 'Border', hex: '#E8E5DB' },
    { name: 'border-default', tag: 'Border', hex: '#A29D94' },
    { name: 'border-strong', tag: 'Border', hex: '#6B665E' },
    { name: 'accent-primary', tag: 'Accent', hex: '#6B5B4F' },
    { name: 'accent-success', tag: 'Accent', hex: '#3E6B4F' },
    { name: 'accent-warning', tag: 'Accent', hex: '#E98074' },
    { name: 'accent-danger', tag: 'Accent', hex: '#B93E36' },
    { name: 'accent-info', tag: 'Accent', hex: '#56717E' },
    { name: 'selected-bg', tag: 'Selected', hex: '#E4DDD0' },
    { name: 'selected-text', tag: 'Selected', hex: '#2B2620' },
    { name: 'state-valid-border', tag: 'Form state', hex: '#3E6B4F' },
    { name: 'state-invalid-border', tag: 'Form state', hex: '#B93E36' },
  ];

  protected readonly colorTokens: ColorToken[] = this.COLOR_TOKEN_SOURCE.map((token) => ({
    ...token,
    variable: `var(--cba-${token.name})`,
  }));

  protected readonly inputSurfaces: InputSurface[] = [
    { title: 'bg-secondary', className: 'demo-surface--secondary' },
    { title: 'bg-elevated', className: 'demo-surface--elevated' },
    { title: 'bg-primary', className: 'demo-surface--primary' },
    { title: 'bg-tertiary', className: 'demo-surface--tertiary' },
  ];

  protected readonly statusOptions: readonly { readonly value: string; readonly label: string }[] = [
    { value: '', label: 'Choose…' },
    { value: 'active', label: 'Active' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'settled', label: 'Settled' },
  ];

  /** Text color must invert when the swatch fill is a dark text token. */
  protected swatchColor(token: ColorToken): string | undefined {
    return this.needsSwatchInverseColor(token) ? 'var(--cba-bg-elevated)' : undefined;
  }

  private needsSwatchInverseColor(token: ColorToken): boolean {
    return token.tag === 'Text' && token.name !== 'text-inverse';
  }

  protected noop(): void {}
}
