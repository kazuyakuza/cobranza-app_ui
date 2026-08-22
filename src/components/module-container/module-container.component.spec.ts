import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputSignal } from '@angular/core';
import { ModuleContainerComponent } from './module-container.component';

describe('ModuleContainerComponent', () => {
  let fixture: ComponentFixture<ModuleContainerComponent>;

  function setInput<T extends keyof ModuleContainerComponent>(
    name: T,
    value: ModuleContainerComponent[T] extends InputSignal<infer V> ? V : never,
  ): void {
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
  }

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

  function headerRegion(): Element | null {
    return fixture.nativeElement.querySelector('.cba-module-container__header');
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

    setInput('size', '50%');

    expect(hostHasClass('cba-module-container--size-50')).toBe(true);
    expect(hostHasClass('cba-module-container--size-100')).toBe(false);
  });

  it('renders the body by default and removes it when isCollapsed is true', () => {
    setup();
    expect(bodyIsRendered()).toBe(true);
    expect(hostHasClass('cba-module-container--collapsed')).toBe(false);

    setInput('isCollapsed', true);

    expect(bodyIsRendered()).toBe(false);
    expect(hostHasClass('cba-module-container--collapsed')).toBe(true);
  });

  it('applies the fullscreen host modifier (chrome suppression and background retention are CSS-only)', () => {
    setup();
    expect(hostHasClass('cba-module-container--fullscreen')).toBe(false);

    setInput('isFullscreen', true);

    // CSS chrome suppression and background-color retention are not testable
    // in jsdom; the host modifier is the contract.
    expect(hostHasClass('cba-module-container--fullscreen')).toBe(true);
  });

  it('applies the expected padding modifier for none sm and md', () => {
    setup();
    expect(hostHasClass('cba-module-container--padding-sm')).toBe(true);

    setInput('padding', 'none');
    expect(hostHasClass('cba-module-container--padding-none')).toBe(true);

    setInput('padding', 'md');
    expect(hostHasClass('cba-module-container--padding-md')).toBe(true);
  });

  it('does not apply the scroll-chaining host modifier by default and applies it when scrollChaining is true', () => {
    setup();
    expect(hostHasClass('cba-module-container--scroll-chaining')).toBe(false);

    setInput('scrollChaining', true);

    // CSS overscroll-behavior switch is not computable in jsdom; the host
    // modifier class is the contract (mirrors the fullscreen chrome test).
    expect(hostHasClass('cba-module-container--scroll-chaining')).toBe(true);
  });

  it('renders the header by default and visually hides it when showHeader is false', () => {
    setup();
    expect(headerRegion()).not.toBeNull();
    expect(hostHasClass('cba-module-container--header-hidden')).toBe(false);

    setInput('showHeader', false);

    // The header band must remain in the DOM; visibility is CSS-driven only.
    expect(headerRegion()).not.toBeNull();
    expect(hostHasClass('cba-module-container--header-hidden')).toBe(true);
  });
});
