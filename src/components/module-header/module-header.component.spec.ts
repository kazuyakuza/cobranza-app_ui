import { Component, OutputEmitterRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleHeaderComponent } from './module-header.component';
import { ModuleHeaderSize } from './module-header.types';

interface ActionCase {
  readonly label: string;
  readonly output: 'collapseToggle' | 'sizeToggle' | 'remove' | 'fullscreenToggle';
  readonly payload?: ModuleHeaderSize;
}

const ACTION_CASES: readonly ActionCase[] = [
  { label: 'Colapsar módulo', output: 'collapseToggle' },
  { label: 'Reducir módulo a 50%', output: 'sizeToggle', payload: '50%' },
  { label: 'Quitar módulo', output: 'remove' },
  { label: 'Pantalla completa', output: 'fullscreenToggle' },
];

@Component({
  standalone: true,
  imports: [ModuleHeaderComponent],
  template: `
    <cba-module-header title="Host Module" [isFullscreen]="isFullscreen">
      <button
        type="button"
        cbaModuleDragHandle
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo">
      </button>
    </cba-module-header>
  `,
})
class TestHostComponent {
  isFullscreen = false;
}

describe('ModuleHeaderComponent', () => {
  let fixture: ComponentFixture<ModuleHeaderComponent>;

  function setup(): ModuleHeaderComponent {
    fixture = TestBed.createComponent(ModuleHeaderComponent);
    fixture.componentRef.setInput('title', 'Test Module');
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function queryButton(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      `button[aria-label="${label}"]`,
    ) as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleHeaderComponent],
    }).compileComponents();
  });

  it.each(ACTION_CASES)('emits $output when the $label button is clicked', ({ label, output, payload }) => {
    const component = setup();
    const emitted: unknown[] = [];
    (component[output] as OutputEmitterRef<unknown>).subscribe((value) => emitted.push(value));

    queryButton(label).click();

    if (payload === undefined) {
      expect(emitted).toHaveLength(1);
    } else {
      expect(emitted).toEqual([payload]);
    }
  });

  it('emits 100% when the expand button is clicked at 50% size', () => {
    const component = setup();
    const sizes: ModuleHeaderSize[] = [];
    component.sizeToggle.subscribe((size) => sizes.push(size));

    fixture.componentRef.setInput('size', '50%');
    fixture.detectChanges();
    queryButton('Expandir módulo a 100%').click();

    expect(sizes).toEqual(['100%']);
  });

  it('renders only the title when isFullscreen is true', () => {
    const component = setup();
    fixture.componentRef.setInput('isFullscreen', true);
    fixture.detectChanges();

    const actionsNav = fixture.nativeElement.querySelector('nav');
    const statusIcon = fixture.nativeElement.querySelector('fa-icon');
    const titleText = fixture.nativeElement.textContent;

    expect(component.title()).toBe('Test Module');
    expect(actionsNav).toBeNull();
    expect(statusIcon).toBeNull();
    expect(titleText).toContain('Test Module');
  });

  it('renders the status icon only when status is non-null', () => {
    setup();
    const statusSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--status',
    ) as HTMLElement;
    expect(statusSection.querySelector('fa-icon')).toBeNull();

    fixture.componentRef.setInput('status', 'loading');
    fixture.detectChanges();
    expect(statusSection.querySelector('fa-icon')).not.toBeNull();
  });

  it('renders the four built-in action buttons when no drag handle is projected (empty slot)', () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(4);
  });

  it('hides the status section when showStatus is false', () => {
    setup();
    fixture.componentRef.setInput('status', 'loading');
    fixture.componentRef.setInput('showStatus', false);
    fixture.detectChanges();

    const statusSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--status',
    ) as HTMLElement;

    expect(statusSection).toBeNull();
  });

  it('shows the status icon when showStatus is true and status is non-null', () => {
    setup();
    fixture.componentRef.setInput('status', 'success');
    fixture.componentRef.setInput('showStatus', true);
    fixture.detectChanges();

    const statusSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--status',
    ) as HTMLElement;

    expect(statusSection).not.toBeNull();
    expect(statusSection.querySelector('fa-icon')).not.toBeNull();
  });

  it('still hides the status icon when status is null even if showStatus defaults to true', () => {
    setup();
    const statusSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--status',
    ) as HTMLElement;

    expect(statusSection.querySelector('fa-icon')).toBeNull();
  });

  it('hides the title section when showTitle is false', () => {
    setup();
    fixture.componentRef.setInput('showTitle', false);
    fixture.detectChanges();

    const titleSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--title',
    ) as HTMLElement;

    expect(titleSection).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Test Module');
  });

  it('shows the title section when showTitle is true', () => {
    setup();
    fixture.componentRef.setInput('showTitle', true);
    fixture.detectChanges();

    const titleSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--title',
    ) as HTMLElement;

    expect(titleSection).not.toBeNull();
    expect(titleSection.textContent).toContain('Test Module');
  });

  it('hides status and actions in fullscreen even when showStatus is explicitly true', () => {
    setup();
    fixture.componentRef.setInput('status', 'loaded');
    fixture.componentRef.setInput('showStatus', true);
    fixture.componentRef.setInput('isFullscreen', true);
    fixture.detectChanges();

    const actionsNav = fixture.nativeElement.querySelector('nav');
    const statusSection = fixture.nativeElement.querySelector(
      '.cba-module-header__section--status',
    );

    expect(actionsNav).toBeNull();
    expect(statusSection).toBeNull();
  });
});

describe('ModuleHeaderComponent — drag handle projection slot', () => {
  function setupHost(isFullscreen = false): ComponentFixture<TestHostComponent> {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.componentInstance.isFullscreen = isFullscreen;
    hostFixture.detectChanges();
    return hostFixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('projects the drag handle into the actions nav before the built-in buttons', () => {
    const hostFixture = setupHost();

    const nav = hostFixture.nativeElement.querySelector('nav');
    const navButtons = nav.querySelectorAll('button');
    const dragHandle = nav.querySelector('button[aria-label="Arrastrar módulo"]');

    expect(nav).not.toBeNull();
    expect(dragHandle).not.toBeNull();
    expect(navButtons).toHaveLength(5);
    expect(navButtons[0]).toBe(dragHandle);
  });

  it('hides the projected drag handle when isFullscreen is true', () => {
    const hostFixture = setupHost(true);

    const nav = hostFixture.nativeElement.querySelector('nav');
    const dragHandle = hostFixture.nativeElement.querySelector('button[aria-label="Arrastrar módulo"]');

    expect(nav).toBeNull();
    expect(dragHandle).toBeNull();
  });
});
