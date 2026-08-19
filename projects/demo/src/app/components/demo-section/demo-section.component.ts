import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Demo-only section wrapper that renders the repeated `<section class="demo-section">`
 * block (title + optional caption + projected content) used across the demo page.
 */
@Component({
  selector: 'demo-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="demo-section">
      <h2>{{ title }}</h2>
      @if (caption) {
        <p class="section-caption">{{ caption }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    :host {
      display: block;
      max-width: 960px;
      margin: var(--cba-space-4) auto;
      padding: 0 var(--cba-space-3);
    }
    .section-caption {
      color: var(--cba-text-secondary);
      font-size: var(--cba-font-size-caption);
      font-style: italic;
      margin: 0 0 var(--cba-space-2);
    }
  `,
})
export class DemoSectionComponent {
  @Input() title = '';
  @Input() caption = '';
}
