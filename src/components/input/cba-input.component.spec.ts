import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaInputComponent } from './cba-input.component';

@Component({
  standalone: true,
  imports: [CbaInputComponent],
  template: `<cba-input
    label="Email"
    placeholder="you@example.com"
    type="email"
    hint="We never share it."
    error="Invalid" />`,
})
class InputHost { }

@Component({
  standalone: true,
  imports: [CbaInputComponent],
  template: `<cba-input label="No error" />`,
})
class InputNoErrorHost { }

describe('CbaInputComponent', () => {
  let fixture: ComponentFixture<InputHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputHost] }).compileComponents();
    fixture = TestBed.createComponent(InputHost);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Email');
  });

  it('renders the hint text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('We never share it.');
  });

  it('renders the error text only when provided', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Invalid');
  });

  it('sets aria-describedby to hint and error ids when both are present', () => {
    const input = fixture.nativeElement.querySelector('input');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('-hint');
    expect(describedBy).toContain('-error');
  });

  it('sets exact aria-describedby ids matching the rendered hint and error elements', () => {
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

  it('does not render error when error input is not provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [InputNoErrorHost] });
    const noErrFixture = TestBed.createComponent(InputNoErrorHost);
    noErrFixture.detectChanges();
    expect(noErrFixture.nativeElement.querySelector('.cba-field__error')).toBeNull();
  });

  it('sets aria-invalid="true" when error is present', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('forwards type and placeholder to the native input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('you@example.com');
  });

  it('emits the new value through ControlValueAccessor on input', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.detectChanges();
    const onChange = jest.fn();
    f.componentInstance.registerOnChange(onChange);
    const inputEl: HTMLInputElement = f.nativeElement.querySelector('input');
    inputEl.value = 'hello';
    inputEl.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalledWith('hello');
    expect(f.componentInstance['value']()).toBe('hello');
  });

  it('updates the native input value after writeValue', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.detectChanges();
    f.componentInstance.writeValue('written value');
    f.detectChanges();
    const inputEl: HTMLInputElement = f.nativeElement.querySelector('input');
    expect(inputEl.value).toBe('written value');
  });

  it('disables the native input and applies host modifier when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('input').hasAttribute('disabled')).toBe(true);
    expect(f.nativeElement.classList.contains('cba-input--disabled')).toBe(true);
  });

  it('applies the readonly host modifier class when readonly', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.componentRef.setInput('readonly', true);
    f.detectChanges();
    expect(f.nativeElement.classList.contains('cba-input--readonly')).toBe(true);
  });
});
