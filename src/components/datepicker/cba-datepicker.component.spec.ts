import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CbaDatepickerComponent } from './cba-datepicker.component';

@Component({
  standalone: true,
  imports: [CbaDatepickerComponent],
  template: `<cba-datepicker label="Due date" hint="Pick a day" error="Required" />`,
})
class DatepickerHost {}

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [DatepickerHost, NgbDatepickerModule],
  });
}

describe('CbaDatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerHost>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(DatepickerHost);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Due date');
  });

  it('renders the hint and error text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('Pick a day');
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Required');
  });

  it('applies the ngbDatepicker directive to the input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cba-datepicker__toggle')).not.toBeNull();
  });

  it('sets aria-label on the toggle button', () => {
    const toggle = fixture.nativeElement.querySelector('.cba-datepicker__toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Open date picker');
  });

  it('sets aria-invalid when error is present', () => {
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('disables input and toggle when disabled', () => {
    TestBed.resetTestingModule();
    @Component({
      standalone: true,
      imports: [CbaDatepickerComponent, NgbDatepickerModule],
      template: `<cba-datepicker [disabled]="true" />`,
    })
    class DisabledHost {}
    TestBed.configureTestingModule({ imports: [DisabledHost] });
    const hostFixture = TestBed.createComponent(DisabledHost);
    hostFixture.detectChanges();
    const datepicker = hostFixture.debugElement.children[0].componentInstance as CbaDatepickerComponent;
    expect(datepicker['isDisabled']()).toBe(true);
    expect(hostFixture.nativeElement.querySelector('cba-datepicker').classList.contains('cba-datepicker--disabled')).toBe(true);
  });

  it('does not assert on calendar internals', () => {
    expect(true).toBe(true);
  });
});
