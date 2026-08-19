import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ModuleContainerComponent,
  ModuleContainerPadding,
  ModuleContainerSize,
  ModuleHeaderComponent,
  ModuleHeaderStatus,
} from '@cobranza-apps/ui';

/**
 * Demo-only wrapper combining a `cba-module-container` with its
 * `cba-module-header`, projecting extra body content (table, actions, …).
 *
 * **NOT part of the public library API.** This component exists solely for the
 * `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 *
 * @see DemoModuleCardComponent simplifies demo markup by wrapping the library's
 *      `ModuleContainerComponent` + `ModuleHeaderComponent` pair with sensible
 *      defaults and no-op event handlers. Consumers should use the library
 *      components directly, not this demo wrapper.
 *
 * Emits no-op handlers for the header outputs so the demo stays interactive
 * without side effects.
 */
@Component({
  selector: 'demo-module-card',
  standalone: true,
  imports: [ModuleContainerComponent, ModuleHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `,
})
export class DemoModuleCardComponent {
  @Input() title = '';
  @Input() size: ModuleContainerSize = '100%';
  @Input() padding: ModuleContainerPadding = 'md';
  @Input() status: ModuleHeaderStatus = 'loaded';
  @Input() isCollapsed = false;

  protected noop(): void {}
}
