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
  CbaBadgeComponent,
  CbaButtonComponent,
  CbaCardComponent,
  CbaDatepickerComponent,
  CbaInputComponent,
  CbaModuleFooterComponent,
  CbaSelectComponent,
} from '@cobranza-apps/ui';
import { DemoButtonMatrixComponent } from './components/demo-button-matrix/demo-button-matrix.component';
import { DemoIconGridComponent } from './components/demo-icon-grid/demo-icon-grid.component';
import { DemoModuleCardComponent } from './components/demo-module-card/demo-module-card.component';
import { DemoNavItemsComponent } from './components/demo-nav-items/demo-nav-items.component';
import { DemoPillMatrixComponent } from './components/demo-pill-matrix/demo-pill-matrix.component';
import { DemoSectionComponent } from './components/demo-section/demo-section.component';
import { DemoSwatchComponent } from './components/demo-swatch/demo-swatch.component';
import { DemoTableComponent } from './components/demo-table/demo-table.component';
import { DemoTextShowcaseComponent } from './components/demo-text-showcase/demo-text-showcase.component';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CbaBadgeComponent,
    CbaButtonComponent,
    CbaCardComponent,
    CbaDatepickerComponent,
    CbaInputComponent,
    CbaModuleFooterComponent,
    CbaSelectComponent,
    DemoButtonMatrixComponent,
    DemoIconGridComponent,
    DemoModuleCardComponent,
    DemoNavItemsComponent,
    DemoPillMatrixComponent,
    DemoSectionComponent,
    DemoSwatchComponent,
    DemoTableComponent,
    DemoTextShowcaseComponent,
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

  protected sampleText = '';
  protected sampleSelect = '';
  protected readonly formModel: FormFieldModel = {
    customerName: '',
    email: '',
    status: '',
    dueDate: null,
  };

  protected readonly colorTokens: ColorToken[] = [
    { name: 'bg-primary', tag: 'Background', hex: '#BCB5A4', variable: 'var(--cba-bg-primary)' },
    { name: 'bg-secondary', tag: 'Background', hex: '#F2F0E8', variable: 'var(--cba-bg-secondary)' },
    { name: 'bg-tertiary', tag: 'Background', hex: '#D8C3A5', variable: 'var(--cba-bg-tertiary)' },
    { name: 'bg-elevated', tag: 'Background', hex: '#FDFCF8', variable: 'var(--cba-bg-elevated)' },
    { name: 'text-primary', tag: 'Text', hex: '#2B2620', variable: 'var(--cba-text-primary)' },
    { name: 'text-secondary', tag: 'Text', hex: '#4A4640', variable: 'var(--cba-text-secondary)' },
    { name: 'text-muted', tag: 'Text', hex: '#625C55', variable: 'var(--cba-text-muted)' },
    { name: 'text-inverse', tag: 'Text', hex: '#FDFCF8', variable: 'var(--cba-text-inverse)' },
    { name: 'border-subtle', tag: 'Border', hex: '#E8E5DB', variable: 'var(--cba-border-subtle)' },
    { name: 'border-default', tag: 'Border', hex: '#A29D94', variable: 'var(--cba-border-default)' },
    { name: 'border-strong', tag: 'Border', hex: '#6B665E', variable: 'var(--cba-border-strong)' },
    { name: 'accent-primary', tag: 'Accent', hex: '#6B5B4F', variable: 'var(--cba-accent-primary)' },
    { name: 'accent-success', tag: 'Accent', hex: '#3E6B4F', variable: 'var(--cba-accent-success)' },
    { name: 'accent-warning', tag: 'Accent', hex: '#E98074', variable: 'var(--cba-accent-warning)' },
    { name: 'accent-danger', tag: 'Accent', hex: '#B93E36', variable: 'var(--cba-accent-danger)' },
    { name: 'accent-info', tag: 'Accent', hex: '#56717E', variable: 'var(--cba-accent-info)' },
    { name: 'selected-bg', tag: 'Selected', hex: '#E4DDD0', variable: 'var(--cba-selected-bg)' },
    { name: 'selected-text', tag: 'Selected', hex: '#2B2620', variable: 'var(--cba-selected-text)' },
    { name: 'state-valid-border', tag: 'Form state', hex: '#3E6B4F', variable: 'var(--cba-state-valid-border)' },
    { name: 'state-invalid-border', tag: 'Form state', hex: '#B93E36', variable: 'var(--cba-state-invalid-border)' },
  ];

  protected readonly inputSurfaces: InputSurface[] = [
    { title: 'bg-secondary', className: 'demo-surface--secondary' },
    { title: 'bg-elevated', className: 'demo-surface--elevated' },
    { title: 'bg-primary', className: 'demo-surface--primary' },
    { title: 'bg-tertiary', className: 'demo-surface--tertiary' },
  ];

  /** Text color must invert when the swatch fill is a dark text token. */
  protected swatchColor(token: ColorToken): string | undefined {
    const isTextTag = token.tag === 'Text';
    const isInverse = token.name === 'text-inverse';
    return isTextTag && !isInverse ? 'var(--cba-bg-elevated)' : undefined;
  }

  protected noop(): void {}
}
