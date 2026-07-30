import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleHeaderComponent } from './module-header.component';

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

  it('emits collapseToggle when the collapse button is clicked', () => {
    const component = setup();
    let emitted = 0;
    component.collapseToggle.subscribe(() => (emitted += 1));

    queryButton('Collapse module').click();

    expect(emitted).toBe(1);
  });

  it('emits the opposite target size when the size-toggle button is clicked', () => {
    const component = setup();
    const sizes: string[] = [];
    component.sizeToggle.subscribe((size) => sizes.push(size));

    queryButton('Shrink module to 50%').click();
    fixture.componentRef.setInput('size', '50%');
    fixture.detectChanges();
    queryButton('Expand module to 100%').click();

    expect(sizes).toEqual(['50%', '100%']);
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

  it('emits remove when the remove button is clicked', () => {
    const component = setup();
    let emitted = 0;
    component.remove.subscribe(() => (emitted += 1));

    queryButton('Remove module').click();

    expect(emitted).toBe(1);
  });

  it('emits fullscreenToggle when the fullscreen button is clicked', () => {
    const component = setup();
    let emitted = 0;
    component.fullscreenToggle.subscribe(() => (emitted += 1));

    queryButton('Enter fullscreen').click();

    expect(emitted).toBe(1);
  });
});
