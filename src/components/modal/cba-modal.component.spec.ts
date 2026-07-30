import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalComponent } from './cba-modal.component';
import { CbaModalService } from './cba-modal.service';
import { CbaModalOptions } from './cba-modal.types';
import { hostEl } from '../testing/test-helpers';

@Component({
  standalone: true,
  imports: [CbaModalComponent],
  template: `<cba-modal title="Confirm">
    <div cbaModalHeader class="hdr"><h3>Custom</h3></div>
    <div cbaModalBody class="bdy">Body text</div>
    <div cbaModalFooter class="ftr"><button>OK</button></div>
  </cba-modal>`,
  providers: [{ provide: NgbActiveModal, useValue: { close: jest.fn(), dismiss: jest.fn(), update: jest.fn() } }],
})
class ModalProjectionHost {}

describe('CbaModalComponent', () => {
  function createFixture(): { fixture: ComponentFixture<CbaModalComponent>; activeModal: NgbActiveModal } {
    TestBed.resetTestingModule();
    const activeModal = { close: jest.fn(), dismiss: jest.fn(), update: jest.fn() } as unknown as NgbActiveModal;
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
    it('renders the title when no custom header is projected', () => {
      const { fixture } = createFixture();
      fixture.componentRef.setInput('title', 'Standalone Title');
      fixture.detectChanges();
      const titleEl: HTMLElement = fixture.nativeElement.querySelector('.cba-modal__title');
      expect(titleEl).not.toBeNull();
      expect(titleEl.textContent).toContain('Standalone Title');
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
  });

  describe('close button', () => {
    it('renders and dismisses when dismissible is true', () => {
      TestBed.resetTestingModule();
      const activeModal = { close: jest.fn(), dismiss: jest.fn(), update: jest.fn() } as unknown as NgbActiveModal;
      TestBed.configureTestingModule({
        imports: [CbaModalComponent],
        providers: [{ provide: NgbActiveModal, useValue: activeModal }],
      });
      const fixture = TestBed.createComponent(CbaModalComponent);
      fixture.detectChanges();
      const closeBtn: HTMLElement = fixture.nativeElement.querySelector('.cba-modal__close');
      expect(closeBtn).not.toBeNull();
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
    const opts: Record<string, unknown> = ngbOpen.mock.calls[0][1];
    expect(opts['backdrop']).toBe('static');
    expect(opts['keyboard']).toBe(false);
  });
  it('maps centered:true and size:lg', () => {
    ngbOpen.mockReturnValue({});
    open({ centered: true, size: 'lg' });
    const opts: Record<string, unknown> = ngbOpen.mock.calls[0][1];
    expect(opts['centered']).toBe(true);
    expect(opts['size']).toBe('lg');
  });
  it('sets default backdropClass and windowClass', () => {
    ngbOpen.mockReturnValue({});
    open();
    const opts: Record<string, unknown> = ngbOpen.mock.calls[0][1];
    expect(opts['backdropClass']).toBe('cba-modal-backdrop');
    expect(opts['windowClass']).toBe('cba-modal-window');
  });
});
