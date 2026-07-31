import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CbaPopoverComponent } from './cba-popover.component';

@Component({
  standalone: true,
  imports: [CbaPopoverComponent],
  template: `<cba-popover
    [body]="body"
    [title]="title"
    placement="bottom"
    triggers="click"
    [disabled]="disabled"
    (shown)="onShown()"
    (hidden)="onHidden()">
    <button class="trigger">Trigger</button>
  </cba-popover>`,
})
class PopoverHost {
  body = 'hint';
  title = 'Title';
  disabled = false;
  onShown = jest.fn();
  onHidden = jest.fn();
}

@Component({
  standalone: true,
  imports: [CbaPopoverComponent],
  template: `<ng-template #tpl><span>rich</span></ng-template>
    <cba-popover [body]="tpl"><button class="trigger">Trigger</button></cba-popover>`,
})
class TemplateBodyHost {
  @ViewChild('tpl') tpl!: TemplateRef<unknown>;
}

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [CbaPopoverComponent, PopoverHost, TemplateBodyHost],
  });
}

describe('CbaPopoverComponent', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
  });

  it('applies the cba-popover host class', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('cba-popover')).toBe(true);
  });

  it('forwards body to NgbPopover#ngbPopover', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.ngbPopover).toBe('hint');
  });

  it('forwards a TemplateRef body to NgbPopover#ngbPopover', () => {
    const fixture = TestBed.createComponent(TemplateBodyHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.ngbPopover instanceof TemplateRef).toBe(true);
  });

  it('forwards title to NgbPopover#popoverTitle', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.popoverTitle).toBe('Title');
  });

  it('forwards placement to NgbPopover#placement', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.placement).toBe('bottom');
  });

  it('forwards triggers to NgbPopover#triggers', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.triggers).toBe('click');
  });

  it('defaults triggers to "hover focus"', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    const popover = fixture.debugElement.injector.get(NgbPopover);
    expect(popover.triggers).toBe('hover focus');
  });

  it('forwards disabled to NgbPopover#disablePopover', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
    expect(popover.disablePopover).toBe(true);
  });

  it('sets the default popoverClass window scope on NgbPopover', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    const popover = fixture.debugElement.injector.get(NgbPopover);
    expect(popover.popoverClass).toBe('cba-popover-window');
  });

  it('appends the popover window to body (container default)', () => {
    const fixture = TestBed.createComponent(CbaPopoverComponent);
    fixture.detectChanges();
    const popover = fixture.debugElement.injector.get(NgbPopover);
    expect(popover.container).toBe('body');
  });

  it('re-emits NgbPopover shown and hidden through the wrapper outputs', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);

    popover.shown.emit();
    expect(fixture.componentInstance.onShown).toHaveBeenCalled();

    popover.hidden.emit();
    expect(fixture.componentInstance.onHidden).toHaveBeenCalled();
  });

  it('projects the trigger element inside the host', () => {
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.trigger')).not.toBeNull();
  });
});
