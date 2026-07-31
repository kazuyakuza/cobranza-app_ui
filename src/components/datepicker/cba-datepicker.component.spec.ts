import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CbaDatepickerComponent } from './cba-datepicker.component';

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [CbaDatepickerComponent, NgbDatepickerModule],
  });
}

describe('CbaDatepickerComponent', () => {
  let fixture: ComponentFixture<CbaDatepickerComponent>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
  });

  it('renders the label text', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.componentRef.setInput('label', 'Due date');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Due date');
  });

  it('renders the hint and error text', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.componentRef.setInput('hint', 'Pick a day');
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('Pick a day');
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Required');
  });

  it('applies the ngbDatepicker directive to the input', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.cba-datepicker__toggle')).not.toBeNull();
  });

  it('sets aria-label on the toggle button', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.cba-datepicker__toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Abrir selector de fecha');
  });

  it('sets aria-invalid when error is present', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('sets aria-describedby ids matching the rendered hint and error elements', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.componentRef.setInput('hint', 'Pick a day');
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    const describedBy = input.getAttribute('aria-describedby');
    const hintEl = fixture.nativeElement.querySelector('.cba-field__hint');
    const errorEl = fixture.nativeElement.querySelector('.cba-field__error');
    const describedByParts = describedBy!.split(' ');
    describedByParts.forEach((id: string) => {
      const el = fixture.nativeElement.querySelector(`#${id}`);
      expect(el).toBeTruthy();
    });
    expect(describedByParts).toContain(hintEl.id);
    expect(describedByParts).toContain(errorEl.id);
  });

  it('updates the value signal after writeValue', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.detectChanges();
    const dateStruct: NgbDateStruct = { year: 2026, month: 7, day: 30 };
    fixture.componentInstance.writeValue(dateStruct);
    expect(fixture.componentInstance['value']()).toEqual(dateStruct);
  });

  it('disables input and toggle when disabled', () => {
    fixture = TestBed.createComponent(CbaDatepickerComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const isDisabledVal = fixture.componentInstance['isDisabled']();
    expect(isDisabledVal).toBe(true);
    const inputEl = fixture.nativeElement.querySelector('input');
    expect(inputEl.readOnly).toBe(true);
    expect(fixture.nativeElement.querySelector('.cba-datepicker__toggle').hasAttribute('disabled')).toBe(true);
  });
});
