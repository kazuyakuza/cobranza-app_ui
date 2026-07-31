import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleFooterComponent } from './module-footer.component';
import { ModuleHeaderStatus } from '../module-header/module-header.types';

interface Scenario {
  status: Exclude<ModuleHeaderStatus, null>;
  text: string;
  modifier: string;
}

const STATUS_SCENARIOS: Scenario[] = [
  { status: 'loading', text: 'Cargando…', modifier: 'cba-module-footer__status--loading' },
  { status: 'loaded', text: 'Listo', modifier: 'cba-module-footer__status--loaded' },
  { status: 'success', text: 'Guardado', modifier: 'cba-module-footer__status--success' },
  { status: 'warning', text: 'Requiere atención', modifier: 'cba-module-footer__status--warning' },
  { status: 'error', text: 'Error', modifier: 'cba-module-footer__status--error' },
  { status: 'dirty', text: 'Cambios sin guardar', modifier: 'cba-module-footer__status--dirty' },
];

@Component({
  standalone: true,
  imports: [ModuleFooterComponent],
  template: `<cba-module-footer [status]="status" [statusText]="statusText"><span class="proj">hint</span></cba-module-footer>`,
})
class FooterHost {
  status: ModuleHeaderStatus = null;
  statusText: string | undefined = undefined;
}

describe('ModuleFooterComponent', () => {
  let fixture: ComponentFixture<ModuleFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleFooterComponent],
    }).compileComponents();
  });

  function render(): ComponentFixture<ModuleFooterComponent> {
    fixture = TestBed.createComponent(ModuleFooterComponent);
    fixture.detectChanges();
    return fixture;
  }

  function statusRegion(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cba-module-footer__status');
  }

  function statusText(): string {
    const text = fixture.nativeElement.querySelector('.cba-module-footer__text');
    return text ? (text.textContent ?? '').trim() : '';
  }

  describe('default status text', () => {
    it.each(STATUS_SCENARIOS)('renders the default text for $status', ({ status, text }) => {
      render();
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();

      expect(statusText()).toBe(text);
    });
  });

  it('lets the statusText override win over the default mapping', () => {
    render();
    fixture.componentRef.setInput('status', 'dirty');
    fixture.componentRef.setInput('statusText', 'Borrador activo');
    fixture.detectChanges();

    expect(statusText()).toBe('Borrador activo');
    expect(statusText()).not.toContain('Cambios sin guardar');
  });

  it('renders no status region for null status without projection', () => {
    render();

    expect(statusRegion()).toBeNull();
    expect(fixture.nativeElement.querySelector('fa-icon')).toBeNull();
    expect(fixture.nativeElement.querySelector('.cba-module-footer__text')).toBeNull();
    expect(fixture.nativeElement.querySelector('footer.cba-module-footer')).not.toBeNull();
  });

  it('projects content into the footer without a status region', () => {
    const hostFixture = TestBed.createComponent(FooterHost);
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.querySelector('.proj')).not.toBeNull();
    expect(hostFixture.nativeElement.querySelector('.cba-module-footer__status')).toBeNull();
  });

  it('renders projected content alongside the status region', () => {
    const hostFixture = TestBed.createComponent(FooterHost);
    hostFixture.componentInstance.status = 'dirty';
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.querySelector('.proj')).not.toBeNull();
    expect(hostFixture.nativeElement.querySelector('.cba-module-footer__text')?.textContent).toContain(
      'Cambios sin guardar',
    );
  });

  describe('status icon', () => {
    it.each(STATUS_SCENARIOS)('renders the icon for $status', ({ status }) => {
      render();
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.cba-module-footer__status fa-icon')).not.toBeNull();
    });

    it('marks the icon as decorative', () => {
      render();
      fixture.componentRef.setInput('status', 'success');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('fa-icon')?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('status modifier classes', () => {
    it.each(STATUS_SCENARIOS)('applies the modifier class for $status', ({ status, modifier }) => {
      render();
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();

      expect(statusRegion()?.classList.contains(modifier)).toBe(true);
    });
  });

  it('sets live region attributes on the status wrapper', () => {
    render();
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();

    const region = statusRegion();
    expect(region?.getAttribute('role')).toBe('status');
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('aria-atomic')).toBe('true');
  });

  it('renders a neutral live region when statusText is provided with null status', () => {
    render();
    fixture.componentRef.setInput('statusText', 'Custom note');
    fixture.detectChanges();

    expect(statusText()).toBe('Custom note');
    expect(statusRegion()).not.toBeNull();
    expect(fixture.nativeElement.querySelector('fa-icon')).toBeNull();
    expect(statusRegion()?.className).toBe('cba-module-footer__status');
  });
});
