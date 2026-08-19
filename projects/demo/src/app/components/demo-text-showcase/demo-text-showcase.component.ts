import { ChangeDetectionStrategy, Component } from '@angular/core';

/** One typography-scale sample line. */
interface TypeSample {
  readonly className: string;
  readonly label: string;
}

/** One text-color swatch line inside a surface panel. */
interface TextColorItem {
  readonly className: string;
  readonly label: string;
}

/** One surface panel showing the type scale + allowed text colors. */
interface TextShowcasePanel {
  readonly title: string;
  readonly className: string;
  readonly textColors: TextColorItem[];
  readonly showStatusColors: boolean;
}

/** Type scale reused on every surface panel. */
const TYPE_SCALE: readonly TypeSample[] = [
  { className: 'cba-text-display', label: 'Display · cba-text-display' },
  { className: 'cba-text-heading-lg', label: 'Heading lg · cba-text-heading-lg' },
  { className: 'cba-text-heading-md', label: 'Heading md · cba-text-heading-md' },
  { className: 'cba-text-body', label: 'Body · cba-text-body' },
  { className: 'cba-text-small', label: 'Small · cba-text-small' },
  { className: 'cba-text-caption', label: 'Caption · cba-text-caption' },
];

/** Status text colors shown only on light surfaces. */
const STATUS_COLORS: readonly TextColorItem[] = [
  { className: 'cba-state-valid-text', label: 'Valid · cba-state-valid-text' },
  { className: 'cba-state-invalid-text', label: 'Invalid · cba-state-invalid-text' },
];

/**
 * Demo-only typography + text-color showcase. Renders one panel per surface
 * (bg-secondary, bg-elevated, bg-primary, bg-tertiary) with the six-step type
 * scale and the text color variants allowed on that surface. Status text
 * colors appear only on light surfaces (bg-secondary / bg-elevated).
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-text-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-text-panels">
      @for (panel of panels; track panel.className) {
        <div [class]="'demo-text-panel ' + panel.className">
          <h3>{{ panel.title }}</h3>
          <div class="demo-text-scale">
            @for (sample of typeScale; track sample.label) {
              <p [class]="sample.className">{{ sample.label }}</p>
            }
          </div>
          <div class="demo-text-colors">
            @for (color of panel.textColors; track color.label) {
              <span [class]="color.className">{{ color.label }}</span>
            }
            @if (panel.showStatusColors) {
              @for (color of statusColors; track color.label) {
                <span [class]="color.className">{{ color.label }}</span>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './demo-text-showcase.component.scss',
})
export class DemoTextShowcaseComponent {
  protected readonly typeScale: TypeSample[] = [...TYPE_SCALE];
  protected readonly statusColors: TextColorItem[] = [...STATUS_COLORS];
  protected readonly panels: TextShowcasePanel[] = [
    {
      title: 'bg-secondary',
      className: 'demo-text-panel--secondary',
      showStatusColors: true,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-muted', label: 'Muted' },
      ],
    },
    {
      title: 'bg-elevated',
      className: 'demo-text-panel--elevated',
      showStatusColors: true,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-muted', label: 'Muted' },
      ],
    },
    {
      title: 'bg-primary',
      className: 'demo-text-panel--primary',
      showStatusColors: false,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-inverse', label: 'Inverse' },
      ],
    },
    {
      title: 'bg-tertiary',
      className: 'demo-text-panel--tertiary',
      showStatusColors: false,
      textColors: [
        { className: 'cba-text-primary', label: 'Primary' },
        { className: 'cba-text-secondary', label: 'Secondary' },
        { className: 'cba-text-inverse', label: 'Inverse' },
      ],
    },
  ];
}
