import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  faBell,
  faDownload,
  faGear,
  faPlus,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import {
  CbaBadgeComponent,
  CbaBadgeVariant,
  CbaButtonComponent,
  CbaInputComponent,
  CbaModuleFooterComponent,
  CbaSelectComponent,
} from '@cobranza-apps/ui';
import { DemoButtonMatrixComponent } from './components/demo-button-matrix/demo-button-matrix.component';
import { DemoModuleCardComponent } from './components/demo-module-card/demo-module-card.component';
import { DemoSectionComponent } from './components/demo-section/demo-section.component';
import { DemoSwatchComponent } from './components/demo-swatch/demo-swatch.component';

interface ColorSwatch {
  label: string;
  background: string;
  color?: string;
}

interface TextSurfaceItem {
  className: string;
  label: string;
}

interface TextSurface {
  background: string;
  items: TextSurfaceItem[];
}

interface AccentPill {
  label: string;
  style: string;
}

interface DemoBadge {
  variant: CbaBadgeVariant;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CbaButtonComponent,
    CbaBadgeComponent,
    CbaInputComponent,
    CbaSelectComponent,
    CbaModuleFooterComponent,
    DemoSectionComponent,
    DemoSwatchComponent,
    DemoButtonMatrixComponent,
    DemoModuleCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly pageTitle = 'Demo app — consumes @cobranza-apps/ui build';

  // Font Awesome icon definitions bound to <cba-button [icon]="...">.
  protected readonly faBell = faBell;
  protected readonly faGear = faGear;
  protected readonly faRefresh = faRefresh;
  protected readonly faPlus = faPlus;
  protected readonly faDownload = faDownload;

  // Interactive form samples (ngModel).
  protected sampleText = '';
  protected sampleSelect = '';

  // No-op handler for module header outputs (event wiring required for type checks).
  protected noop(): void {}

  protected readonly colorSwatches: ColorSwatch[] = [
    { label: 'bg-primary', background: 'var(--cba-bg-primary)' },
    { label: 'bg-secondary', background: 'var(--cba-bg-secondary)' },
    { label: 'bg-tertiary', background: 'var(--cba-bg-tertiary)' },
    { label: 'bg-elevated', background: 'var(--cba-bg-elevated)' },
    { label: 'inset (bg-tertiary)', background: 'var(--cba-bg-tertiary)' },
    { label: 'text-primary', background: 'var(--cba-text-primary)', color: 'var(--cba-bg-elevated)' },
    { label: 'text-secondary', background: 'var(--cba-text-secondary)', color: 'var(--cba-bg-elevated)' },
    { label: 'text-muted', background: 'var(--cba-text-muted)', color: 'var(--cba-bg-elevated)' },
    { label: 'text-inverse', background: 'var(--cba-text-inverse)', color: 'var(--cba-bg-primary)' },
    { label: 'accent-primary', background: 'var(--cba-accent-primary)' },
    { label: 'hover (interactive)', background: 'var(--cba-hover)' },
    { label: 'accent-success', background: 'var(--cba-accent-success)' },
    { label: 'accent-danger', background: 'var(--cba-accent-danger)' },
    { label: 'accent-warning', background: 'var(--cba-accent-warning)' },
    { label: 'accent-info', background: 'var(--cba-accent-info)' },
    { label: 'selected-bg', background: 'var(--cba-selected-bg)', color: 'var(--cba-selected-text)' },
    { label: 'state-valid-border', background: 'var(--cba-state-valid-border)' },
    { label: 'state-error-border', background: 'var(--cba-state-invalid-border)' },
  ];

  protected readonly textSurfaces: TextSurface[] = [
    {
      background: 'var(--cba-bg-primary)',
      items: [
        { className: 'cba-text-primary', label: 'Primary · canvas' },
        { className: 'cba-text-secondary', label: 'Secondary · canvas' },
        { className: 'cba-text-inverse', label: 'Inverse · canvas' },
      ],
    },
    {
      background: 'var(--cba-bg-secondary)',
      items: [
        { className: 'cba-text-primary', label: 'Primary · panel' },
        { className: 'cba-text-secondary', label: 'Secondary · panel' },
        { className: 'cba-text-muted', label: 'Muted · panel' },
      ],
    },
    {
      background: 'var(--cba-bg-elevated)',
      items: [
        { className: 'cba-text-primary', label: 'Primary · elevated' },
        { className: 'cba-text-secondary', label: 'Secondary · elevated' },
        { className: 'cba-text-muted', label: 'Muted · elevated' },
      ],
    },
    {
      background: 'var(--cba-bg-tertiary)',
      items: [
        { className: 'cba-text-primary', label: 'Primary · inset' },
        { className: 'cba-text-secondary', label: 'Secondary · inset' },
        { className: 'cba-text-inverse', label: 'Inverse · inset' },
      ],
    },
  ];

  protected readonly accentPills: AccentPill[] = [
    { label: 'accent-primary', style: 'background: var(--cba-accent-primary); color: var(--cba-text-inverse)' },
    { label: 'accent-success', style: 'background: var(--cba-accent-success); color: var(--cba-text-inverse)' },
    { label: 'accent-danger', style: 'background: var(--cba-accent-danger); color: var(--cba-text-inverse)' },
    { label: 'accent-warning', style: 'border: 1px solid var(--cba-accent-warning); color: var(--cba-text-primary)' },
    { label: 'accent-info', style: 'border: 1px solid var(--cba-accent-info); color: var(--cba-text-primary)' },
  ];

  protected readonly typeScale: TextSurfaceItem[] = [
    { className: 'cba-text-display', label: 'Display · cba-text-display' },
    { className: 'cba-text-heading-lg', label: 'Heading lg · cba-text-heading-lg' },
    { className: 'cba-text-heading-md', label: 'Heading md · cba-text-heading-md' },
    { className: 'cba-text-body', label: 'Body · cba-text-body' },
    { className: 'cba-text-small', label: 'Small · cba-text-small' },
    { className: 'cba-text-caption', label: 'Caption · cba-text-caption' },
  ];

  protected readonly borders: TextSurfaceItem[] = [
    { className: 'var(--cba-border-subtle)', label: 'border-subtle' },
    { className: 'var(--cba-border-default)', label: 'border-default' },
    { className: 'var(--cba-border-strong)', label: 'border-strong' },
  ];

  protected readonly radiusBoxes: TextSurfaceItem[] = [
    { className: 'cba-radius-sm', label: 'radius-sm' },
    { className: 'cba-radius-md', label: 'radius-md' },
    { className: 'cba-radius-lg', label: 'radius-lg' },
  ];

  protected readonly shadowBoxes: TextSurfaceItem[] = [
    { className: 'cba-shadow-module', label: 'shadow-module' },
    { className: 'cba-shadow-elevated', label: 'shadow-elevated' },
  ];

  protected readonly badges: DemoBadge[] = [
    { variant: 'primary', label: 'Primary' },
    { variant: 'success', label: 'Success' },
    { variant: 'warning', label: 'Warning' },
    { variant: 'danger', label: 'Danger' },
    { variant: 'info', label: 'Info' },
    { variant: 'neutral', label: 'Neutral' },
  ];

  protected readonly footerNavItems = ['Resumen', 'Clientes', 'Facturas', 'Reportes'];
}
