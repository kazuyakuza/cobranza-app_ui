import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleContainerComponent } from './module-container.component';

describe('ModuleContainerComponent', () => {
  let fixture: ComponentFixture<ModuleContainerComponent>;

  function setup(): void {
    fixture = TestBed.createComponent(ModuleContainerComponent);
    fixture.detectChanges();
  }

  function hostHasClass(name: string): boolean {
    return fixture.nativeElement.classList.contains(name);
  }

  function bodyRegion(): Element | null {
    return fixture.nativeElement.querySelector('.cba-module-container__body');
  }

  function bodyIsRendered(): boolean {
    return bodyRegion() !== null;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleContainerComponent],
    }).compileComponents();
  });

  it('applies the size-100 host modifier by default and switches to size-50', () => {
    setup();
    expect(hostHasClass('cba-module-container--size-100')).toBe(true);
    expect(hostHasClass('cba-module-container--size-50')).toBe(false);

    fixture.componentRef.setInput('size', '50%');
    fixture.detectChanges();

    expect(hostHasClass('cba-module-container--size-50')).toBe(true);
    expect(hostHasClass('cba-module-container--size-100')).toBe(false);
  });

  it('renders the body by default and removes it when isCollapsed is true', () => {
    setup();
    expect(bodyIsRendered()).toBe(true);
    expect(hostHasClass('cba-module-container--collapsed')).toBe(false);

    fixture.componentRef.setInput('isCollapsed', true);
    fixture.detectChanges();

    expect(bodyIsRendered()).toBe(false);
    expect(hostHasClass('cba-module-container--collapsed')).toBe(true);
  });

  it('applies the fullscreen host modifier (chrome suppression and background retention are CSS-only)', () => {
    setup();
    expect(hostHasClass('cba-module-container--fullscreen')).toBe(false);

    fixture.componentRef.setInput('isFullscreen', true);
    fixture.detectChanges();

    // CSS chrome suppression and background-color retention are not testable
    // in jsdom; the host modifier is the contract.
    expect(hostHasClass('cba-module-container--fullscreen')).toBe(true);
  });

  it('applies the expected padding modifier for none sm and md', () => {
    setup();
    expect(hostHasClass('cba-module-container--padding-sm')).toBe(true);

    fixture.componentRef.setInput('padding', 'none');
    fixture.detectChanges();
    expect(hostHasClass('cba-module-container--padding-none')).toBe(true);

    fixture.componentRef.setInput('padding', 'md');
    fixture.detectChanges();
    expect(hostHasClass('cba-module-container--padding-md')).toBe(true);
  });

  it('does not apply the scroll-chaining host modifier by default and applies it when scrollChaining is true', () => {
    setup();
    expect(hostHasClass('cba-module-container--scroll-chaining')).toBe(false);

    fixture.componentRef.setInput('scrollChaining', true);
    fixture.detectChanges();

    // CSS overscroll-behavior switch is not computable in jsdom; the host
    // modifier class is the contract (mirrors the fullscreen chrome test).
    expect(hostHasClass('cba-module-container--scroll-chaining')).toBe(true);
  });
});
