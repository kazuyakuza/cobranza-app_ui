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
 * Optionally renders a `cba-module-footer` INSIDE the container so the
 * footer shares the module chrome (rounded border + shadow) and is removed
 * from the DOM when the module body is collapsed.
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
        @if (hasFooter) {
          <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
        }
      </cba-module-container>
    </div>
  `,
  styleUrl: './demo-module-card.component.scss',
})
export class DemoModuleCardComponent {
  /** Header title displayed in the module header. */
  @Input() title = '';
  /** Module width — forwarded to `cba-module-container[size]`. */
  @Input() size: ModuleContainerSize = '100%';
  /** Inner padding — forwarded to `cba-module-container[padding]`. */
  @Input() padding: ModuleContainerPadding = 'md';
  /** Header status indicator (loaded / loading / error). */
  @Input() status: ModuleHeaderStatus = 'loaded';
  /** Whether the module body is collapsed. */
  @Input() isCollapsed = false;
  /** Optional footer status; `null` hides the footer. */
  @Input() footerStatus: ModuleHeaderStatus | null = null;
  /** Optional footer status text shown beside `footerStatus`. */
  @Input() footerText = '';

  /**
   * Whether the optional `cba-module-footer` should render inside the container.
   * Returns `true` when either `footerStatus` is non-null or `footerText` is non-empty.
   */
  protected get hasFooter(): boolean {
    return this.footerStatus !== null || this.footerText.length > 0;
  }

  /** No-op handler bound to header outputs so the demo stays interactive without side effects. */
  protected noop(): void {}
}
