import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Demo-only section wrapper that renders the repeated `<section class="demo-section">`
 * block (title + optional caption + projected content) used across the demo page.
 *
 * **NOT part of the public library API.** This component exists solely for the
 * `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 *
 * @see DemoSectionComponent is used by the demo app to wrap each showcase section
 *      with a consistent heading and optional caption.
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
  styleUrl: './demo-section.component.scss',
})
export class DemoSectionComponent {
  @Input() title = '';
  @Input() caption = '';
}
