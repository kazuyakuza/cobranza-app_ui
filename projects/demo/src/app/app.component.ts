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
  CbaButtonComponent,
  CbaInputComponent,
  CbaModuleFooterComponent,
  CbaSelectComponent,
  ModuleContainerComponent,
  ModuleHeaderComponent,
} from '@cobranza-apps/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CbaButtonComponent,
    CbaBadgeComponent,
    CbaInputComponent,
    CbaSelectComponent,
    ModuleContainerComponent,
    CbaModuleFooterComponent,
    ModuleHeaderComponent,
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

  // No-op handlers for module header outputs (event wiring required for type checks).
  protected onCollapse(): void {}
  protected onSizeToggle(): void {}
  protected onFullscreen(): void {}
  protected onRemove(): void {}
}
