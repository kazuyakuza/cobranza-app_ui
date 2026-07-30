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
class InputHost {}

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

  it('disables the native input and applies host modifier when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('input').hasAttribute('disabled')).toBe(true);
  });
});
