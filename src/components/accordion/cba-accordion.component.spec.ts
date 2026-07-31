import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbAccordionDirective, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CbaAccordionComponent } from './cba-accordion.component';

@Component({
  standalone: true,
  imports: [CbaAccordionComponent, NgbAccordionModule],
  template: `<cba-accordion
    [closeOthers]="closeOthers()"
    [destroyOnHide]="destroyOnHide()"
    [animation]="animation()"
    (show)="onShow($event)"
    (shown)="onShown($event)"
    (hide)="onHide($event)"
    (hidden)="onHidden($event)">
    <div class="item" ngbAccordionItem>
      <div ngbAccordionHeader>
        <button class="btn" ngbAccordionButton>Detalles del cliente</button>
      </div>
      <div ngbAccordionCollapse>
        <div ngbAccordionBody>
          <ng-template>Contenido 1</ng-template>
        </div>
      </div>
    </div>
    <div class="item" ngbAccordionItem [disabled]="true">
      <div ngbAccordionHeader>
        <button class="btn btn-disabled" ngbAccordionButton>Histórico de pagos</button>
      </div>
      <div ngbAccordionCollapse>
        <div ngbAccordionBody>
          <ng-template>Contenido 2</ng-template>
        </div>
      </div>
    </div>
    <div class="item" ngbAccordionItem>
      <div ngbAccordionHeader>
        <button class="btn" ngbAccordionButton>Documentación</button>
      </div>
      <div ngbAccordionCollapse>
        <div ngbAccordionBody>
          <ng-template>Contenido 3</ng-template>
        </div>
      </div>
    </div>
  </cba-accordion>`,
})
class AccordionHost {
  closeOthers = signal(false);
  destroyOnHide = signal(true);
  animation = signal(true);
  onShow = jest.fn();
  onShown = jest.fn();
  onHide = jest.fn();
  onHidden = jest.fn();
}

function createAccordionHostFixture(): ComponentFixture<AccordionHost> {
  const fixture = TestBed.createComponent(AccordionHost);
  fixture.detectChanges();
  return fixture;
}

function getNgbAccordion(fixture: ComponentFixture<AccordionHost>): NgbAccordionDirective {
  return fixture.debugElement
    .query(By.directive(CbaAccordionComponent))
    .injector.get(NgbAccordionDirective);
}

function configureTestBed(): void {
  TestBed.configureTestingModule({ imports: [CbaAccordionComponent, AccordionHost] });
}

type AccordionInputKey = 'closeOthers' | 'destroyOnHide' | 'animation';

interface InputForwardingCase {
  property: AccordionInputKey;
  initial: boolean;
  updated: boolean;
}

const inputForwardingCases: InputForwardingCase[] = [
  { property: 'closeOthers', initial: false, updated: true },
  { property: 'destroyOnHide', initial: true, updated: false },
  { property: 'animation', initial: true, updated: false },
];

describe('CbaAccordionComponent', () => {
  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
  });

  it('applies the cba-accordion host class', () => {
    const fixture = TestBed.createComponent(CbaAccordionComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('cba-accordion')).toBe(true);
  });

  it('projects the ng-bootstrap item markup inside the host', () => {
    const fixture = createAccordionHostFixture();
    expect(fixture.nativeElement.querySelectorAll('.item').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.btn')).not.toBeNull();
  });

  it('reflects the item disabled state on the accordion button', () => {
    const fixture = createAccordionHostFixture();
    expect(fixture.nativeElement.querySelector('.btn-disabled').hasAttribute('disabled')).toBe(true);
  });

  it.each(inputForwardingCases)(
    'forwards $property to NgbAccordionDirective and re-forwards later changes',
    ({ property, initial, updated }) => {
      const fixture = createAccordionHostFixture();
      const accordion = getNgbAccordion(fixture);
      expect(accordion[property]).toBe(initial);

      fixture.componentInstance[property].set(updated);
      fixture.detectChanges();
      expect(accordion[property]).toBe(updated);
    },
  );

  it('re-emits the NgbAccordionDirective item events through the wrapper outputs', () => {
    const fixture = createAccordionHostFixture();
    const accordion = getNgbAccordion(fixture);

    accordion.show.emit('demo-1');
    accordion.shown.emit('demo-1');
    accordion.hide.emit('demo-1');
    accordion.hidden.emit('demo-1');

    expect(fixture.componentInstance.onShow).toHaveBeenCalledWith('demo-1');
    expect(fixture.componentInstance.onShown).toHaveBeenCalledWith('demo-1');
    expect(fixture.componentInstance.onHide).toHaveBeenCalledWith('demo-1');
    expect(fixture.componentInstance.onHidden).toHaveBeenCalledWith('demo-1');
  });

  it('collapses the previously expanded item when closeOthers is enabled', () => {
    const fixture = createAccordionHostFixture();
    fixture.componentInstance.closeOthers.set(true);
    fixture.detectChanges();
    const accordion = getNgbAccordion(fixture);
    const itemIds = Array.from(
      fixture.nativeElement.querySelectorAll('.accordion-item[id^="ngb-accordion-item-"]') as NodeListOf<Element>,
    ).map((el: Element) => el.getAttribute('id') as string);

    accordion.expand(itemIds[0]);
    accordion.expand(itemIds[1]);

    expect(accordion.isExpanded(itemIds[1])).toBe(true);
    expect(accordion.isExpanded(itemIds[0])).toBe(false);
  });
});
