import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalComponent } from './cba-modal.component';
import { CbaModalService } from './cba-modal.service';
import { CbaModalOptions } from './cba-modal.types';
import { hostEl } from '../testing/test-helpers';

function createActiveModalStub(): NgbActiveModal {
  return { close: jest.fn(), dismiss: jest.fn(), update: jest.fn() } as unknown as NgbActiveModal;
}

@Component({
  standalone: true,
  imports: [CbaModalComponent],
  template: `<cba-modal title="Confirm">
    <div cbaModalHeader class="hdr"><h3>Custom</h3></div>
    <div class="bdy">Body text</div>
    <div cbaModalFooter class="ftr"><button>OK</button></div>
  </cba-modal>`,
  providers: [{ provide: NgbActiveModal, useFactory: createActiveModalStub }],
})
class ModalProjectionHost {}

@Component({
  standalone: true,
  imports: [CbaModalComponent],
  template: `<cba-modal [dismissible]="false">
    <div class="bdy-alone">Body only</div>
  </cba-modal>`,
  providers: [{ provide: NgbActiveModal, useFactory: createActiveModalStub }],
})
class ModalBodyOnlyHost {}

describe('CbaModalComponent', () => {
  function createFixture(): { fixture: ComponentFixture<CbaModalComponent>; activeModal: NgbActiveModal } {
    TestBed.resetTestingModule();
    const activeModal = createActiveModalStub();
    TestBed.configureTestingModule({
      imports: [CbaModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: activeModal }],
    });
    return { fixture: TestBed.createComponent(CbaModalComponent), activeModal };
  }

  describe('projected regions', () => {
    let hostFixture: ComponentFixture<ModalProjectionHost>;
    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ModalProjectionHost] }).compileComponents();
      hostFixture = TestBed.createComponent(ModalProjectionHost);
      hostFixture.detectChanges();
    });
    it('projects cbaModalHeader, default body, and cbaModalFooter slots', () => {
      expect(hostFixture.nativeElement.querySelector('.hdr')).not.toBeNull();
      expect(hostFixture.nativeElement.querySelector('.bdy')).not.toBeNull();
      expect(hostFixture.nativeElement.querySelector('.ftr')).not.toBeNull();
    });
    it('renders the title with correct id and wires aria-labelledby', () => {
      const { fixture, activeModal } = createFixture();
      fixture.componentRef.setInput('title', 'Standalone Title');
      fixture.detectChanges();
      const titleEl: HTMLElement = fixture.nativeElement.querySelector('.cba-modal__title');
      expect(titleEl).not.toBeNull();
      expect(titleEl.textContent).toContain('Standalone Title');
      expect(titleEl.getAttribute('id')).toBeTruthy();
      expect(titleEl.getAttribute('id')).toBe(fixture.componentInstance['titleId']);
      expect(activeModal.update).toHaveBeenCalledTimes(1);
      expect(activeModal.update).toHaveBeenCalledWith({ ariaLabelledBy: fixture.componentInstance['titleId'] });
    });
    it('does not call activeModal.update when title is not set', () => {
      const { fixture, activeModal } = createFixture();
      fixture.detectChanges();
      expect(activeModal.update).not.toHaveBeenCalled();
    });
    it('hides header and footer when only body content is projected', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [ModalBodyOnlyHost] });
      const bodyFixture = TestBed.createComponent(ModalBodyOnlyHost);
      bodyFixture.detectChanges();
      const headerEl = bodyFixture.nativeElement.querySelector('.cba-modal__header');
      const footerEl = bodyFixture.nativeElement.querySelector('.cba-modal__footer');
      expect(headerEl).not.toBeNull();
      expect(footerEl).not.toBeNull();
      expect(headerEl.textContent.trim()).toBe('');
      expect(footerEl.textContent.trim()).toBe('');
    });
  });

  describe('size host classes', () => {
    it('applies cba-modal--md by default', () => {
      const { fixture } = createFixture();
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--md')).toBe(true);
    });
    it('applies cba-modal--sm and cba-modal--lg', () => {
      const { fixture } = createFixture();
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--sm')).toBe(true);
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--lg')).toBe(true);
    });
    it('applies cba-modal--centered when centered is true', () => {
      const { fixture } = createFixture();
      fixture.componentRef.setInput('centered', true);
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-modal--centered')).toBe(true);
    });
  });

  describe('close button', () => {
    it('renders with aria-label and dismisses when clicked', () => {
      const { fixture, activeModal } = createFixture();
      fixture.detectChanges();
      const closeBtn: HTMLElement = fixture.nativeElement.querySelector('.cba-modal__close');
      expect(closeBtn).not.toBeNull();
      expect(closeBtn.getAttribute('aria-label')).toBe('Close');
      closeBtn.click();
      expect(activeModal.dismiss).toHaveBeenCalledWith('close');
    });
    it('is hidden when dismissible is false', () => {
      const { fixture } = createFixture();
      fixture.componentRef.setInput('dismissible', false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.cba-modal__close')).toBeNull();
    });
  });
});

describe('CbaModalService', () => {
  let ngbOpen: jest.Mock;
  let ngbModal: NgbModal;
  beforeEach(() => {
    ngbOpen = jest.fn();
    ngbModal = { open: ngbOpen } as unknown as NgbModal;
    TestBed.configureTestingModule({
      providers: [CbaModalService, { provide: NgbModal, useValue: ngbModal }],
    });
  });
  function open(options?: CbaModalOptions): ReturnType<CbaModalService['open']> {
    return TestBed.inject(CbaModalService).open(CbaModalComponent, options);
  }
  it('delegates to NgbModal.open once and returns the ref', () => {
    const ref = {};
    ngbOpen.mockReturnValue(ref);
    expect(open()).toBe(ref);
    expect(ngbOpen).toHaveBeenCalledTimes(1);
    expect(ngbOpen).toHaveBeenCalledWith(CbaModalComponent, expect.any(Object));
  });
  it('maps dismissible:false to backdrop static + keyboard false', () => {
    ngbOpen.mockReturnValue({});
    open({ dismissible: false });
    const opts = ngbOpen.mock.calls[0][1] as NgbModalOptions;
    expect(opts.backdrop).toBe('static');
    expect(opts.keyboard).toBe(false);
  });
  it('maps centered:true and size:lg', () => {
    ngbOpen.mockReturnValue({});
    open({ centered: true, size: 'lg' });
    const opts = ngbOpen.mock.calls[0][1] as NgbModalOptions;
    expect(opts.centered).toBe(true);
    expect(opts.size).toBe('lg');
  });
  it('sets default backdropClass and windowClass', () => {
    ngbOpen.mockReturnValue({});
    open();
    const opts = ngbOpen.mock.calls[0][1] as NgbModalOptions;
    expect(opts.backdropClass).toBe('cba-modal-backdrop');
    expect(opts.windowClass).toBe('cba-modal-window');
  });
});
