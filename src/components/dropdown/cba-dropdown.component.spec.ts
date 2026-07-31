import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbDropdown, NgbDropdownModule, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { CbaButtonComponent } from '../button/cba-button.component';
import { CbaDropdownComponent } from './cba-dropdown.component';

@Component({
  standalone: true,
  imports: [CbaDropdownComponent, CbaButtonComponent, NgbDropdownModule],
  template: `<cba-dropdown [disabled]="disabled" (openChange)="onOpen($event)">
    <cba-button class="tg" cbaDropdownToggle ngbDropdownToggle>Options</cba-button>
    <button class="item" ngbDropdownItem>Edit</button>
    <button class="item-disabled" ngbDropdownItem [disabled]="true">Delete</button>
  </cba-dropdown>`,
})
class DropdownHost {
  disabled = false;
  onOpen = jest.fn();
}

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [CbaDropdownComponent, CbaButtonComponent, NgbDropdownModule, DropdownHost],
  });
}

describe('CbaDropdownComponent', () => {
  let fixture: ComponentFixture<CbaDropdownComponent>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
  });

  it('applies the host class and default state', () => {
    fixture = TestBed.createComponent(CbaDropdownComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement;
    expect(host.classList.contains('cba-dropdown')).toBe(true);
    expect(fixture.componentInstance.disabled()).toBe(false);
    expect(host.classList.contains('cba-dropdown--disabled')).toBe(false);
    expect(host.getAttribute('aria-disabled')).toBeNull();
  });

  it('toggles the disabled host state and aria-disabled attribute', () => {
    fixture = TestBed.createComponent(CbaDropdownComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const host = fixture.nativeElement;
    expect(host.classList.contains('cba-dropdown--disabled')).toBe(true);
    expect(host.getAttribute('aria-disabled')).toBe('true');

    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(host.classList.contains('cba-dropdown--disabled')).toBe(false);
    expect(host.getAttribute('aria-disabled')).toBeNull();
  });

  it('projects the toggle into the cbaDropdownToggle slot', () => {
    const hostFixture = TestBed.createComponent(DropdownHost);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.querySelector('.tg')).not.toBeNull();
    expect(hostFixture.debugElement.query(By.directive(NgbDropdownToggle))).not.toBeNull();
  });

  it('projects menu items inside the ngbDropdownMenu surface', () => {
    const hostFixture = TestBed.createComponent(DropdownHost);
    hostFixture.detectChanges();
    const menu = hostFixture.nativeElement.querySelector('.cba-dropdown__menu');
    expect(menu).not.toBeNull();
    expect(menu.querySelector('.item')).not.toBeNull();
    expect(menu.querySelector('.item-disabled')).not.toBeNull();
  });

  it('forwards placement to the NgbDropdown instance', () => {
    fixture = TestBed.createComponent(CbaDropdownComponent);
    fixture.componentRef.setInput('placement', 'top-start');
    fixture.detectChanges();
    const ngbDropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
    expect(ngbDropdown.placement).toEqual('top-start');
  });

  it('applies the ng-bootstrap default placement order when unset', () => {
    fixture = TestBed.createComponent(CbaDropdownComponent);
    fixture.detectChanges();
    const ngbDropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
    expect(ngbDropdown.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
  });

  it('re-emits NgbDropdown openChange through the wrapper output', () => {
    const hostFixture = TestBed.createComponent(DropdownHost);
    hostFixture.detectChanges();
    const ngbDropdown = hostFixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);

    ngbDropdown.open();
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.onOpen).toHaveBeenCalledWith(true);

    ngbDropdown.close();
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.onOpen).toHaveBeenCalledWith(false);
  });
});
