import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  CbaModuleFooterComponent,
  ModuleContainerComponent,
  ModuleContainerPadding,
  ModuleContainerSize,
  ModuleHeaderComponent,
  ModuleHeaderStatus,
} from '@cobranza-apps/ui';

/**
 * Demo-only wrapper combining a `cba-module-container` with its
 * `cba-module-header`, projecting extra body content (table, actions, …).
 * Optionally renders a `cba-module-footer` OUTSIDE the container so the
 * footer stays visible even when the module body is collapsed.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 *
 * Emits no-op handlers for the header outputs so the demo stays interactive
 * without side effects.
 */
@Component({
  selector: 'demo-module-card',
  standalone: true,
  imports: [ModuleContainerComponent, ModuleHeaderComponent, CbaModuleFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-module-card" [class.demo-module-card--size-50]="size === '50%'">
      <cba-module-container [size]="size" [padding]="padding" [isCollapsed]="isCollapsed">
        <cba-module-header
          cbaModuleContainerHeader
          [title]="title"
          [size]="size"
          [isCollapsed]="isCollapsed"
          [isFullscreen]="false"
          [status]="status"
          (collapseToggle)="noop()"
          (sizeToggle)="noop()"
          (fullscreenToggle)="noop()"
          (remove)="noop()"
        />
        <ng-content />
      </cba-module-container>
      @if (hasFooter) {
        <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
      }
    </div>
  `,
  styleUrl: './demo-module-card.component.scss',
})
export class DemoModuleCardComponent {
  @Input() title = '';
  @Input() size: ModuleContainerSize = '100%';
  @Input() padding: ModuleContainerPadding = 'md';
  @Input() status: ModuleHeaderStatus = 'loaded';
  @Input() isCollapsed = false;
  @Input() footerStatus: ModuleHeaderStatus | null = null;
  @Input() footerText = '';

  protected get hasFooter(): boolean {
    return this.hasFooterContent();
  }

  private hasFooterContent(): boolean {
    return this.footerStatus !== null || this.footerText.length > 0;
  }

  protected noop(): void {}
}
