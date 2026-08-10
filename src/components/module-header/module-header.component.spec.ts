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
});

describe('ModuleHeaderComponent — drag handle projection slot', () => {
  function setupHost(inputs: { isFullscreen?: boolean }): ComponentFixture<TestHostComponent> {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    if (inputs.isFullscreen !== undefined) {
      hostFixture.componentInstance.isFullscreen = inputs.isFullscreen;
    }
    hostFixture.detectChanges();
    return hostFixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('renders the four built-in action buttons when no drag handle is projected (empty slot)', () => {
    const directFixture = TestBed.createComponent(ModuleHeaderComponent);
    directFixture.componentRef.setInput('title', 'Direct Module');
    directFixture.detectChanges();

    const navButtons = directFixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(4);
  });

  it('projects the drag handle into the actions nav before the built-in buttons', () => {
    const hostFixture = setupHost({});

    const nav = hostFixture.nativeElement.querySelector('nav');
    const navButtons = nav.querySelectorAll('button');
    const dragHandle = nav.querySelector('button[aria-label="Arrastrar módulo"]');

    expect(nav).not.toBeNull();
    expect(dragHandle).not.toBeNull();
    expect(navButtons).toHaveLength(5);
    expect(navButtons[0]).toBe(dragHandle);
  });

  it('hides the projected drag handle when isFullscreen is true', () => {
    const hostFixture = setupHost({ isFullscreen: true });

    const nav = hostFixture.nativeElement.querySelector('nav');
    const dragHandle = hostFixture.nativeElement.querySelector('button[aria-label="Arrastrar módulo"]');

    expect(nav).toBeNull();
    expect(dragHandle).toBeNull();
  });
});
