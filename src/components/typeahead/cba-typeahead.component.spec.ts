import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CbaTypeaheadComponent } from './cba-typeahead.component';
import { CbaTypeaheadSearchFn } from './cba-typeahead.types';

const searchStub: CbaTypeaheadSearchFn = () => of([]);

describe('CbaTypeaheadComponent', () => {
  let fixture: ComponentFixture<CbaTypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbaTypeaheadComponent, NgbTypeaheadModule],
    }).compileComponents();
    fixture = TestBed.createComponent(CbaTypeaheadComponent);
    fixture.componentRef.setInput('search', searchStub);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    fixture.componentRef.setInput('label', 'State');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('State');
  });

  it('renders the hint text', () => {
    fixture.componentRef.setInput('hint', 'Choose a state');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('Choose a state');
  });

  it('renders the error text only when provided', () => {
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Required');
  });

  it('does not render the error when not provided', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__error')).toBeNull();
  });

  it('sets aria-describedby to the rendered hint and error element ids', () => {
    fixture.componentRef.setInput('hint', 'Choose a state');
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

  it('sets aria-invalid="true" when error is present', () => {
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('does not set aria-invalid when error is absent', () => {
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBeNull();
  });

  it('forwards the placeholder to the native input', () => {
    fixture.componentRef.setInput('placeholder', 'Start typing');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('placeholder')).toBe('Start typing');
  });

  it('applies the disabled host class and native disabled attribute', async () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('cba-typeahead--disabled')).toBe(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input').hasAttribute('disabled')).toBe(true);
  });

  it('updates the native input value after writeValue', async () => {
    fixture.componentInstance.writeValue('written');
    fixture.detectChanges();
    await fixture.whenStable();
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputEl.value).toBe('written');
  });

  it('propagates a typed value through the ControlValueAccessor', () => {
    const onChange = jest.fn();
    fixture.componentInstance.registerOnChange(onChange);
    fixture.componentInstance['onValueChange']('hello');
    expect(onChange).toHaveBeenCalledWith('hello');
    expect(fixture.componentInstance['value']()).toBe('hello');
  });

  it('re-emits the selectItem event through the itemSelected output', () => {
    const emitted = jest.fn();
    fixture.componentInstance.itemSelected.subscribe(emitted);
    const event: NgbTypeaheadSelectItemEvent = { item: 'x', preventDefault: jest.fn() };
    fixture.componentInstance['onItemSelected'](event);
    expect(emitted).toHaveBeenCalledWith(event);
  });

  it('renders the native input with the ngbTypeahead directive applied', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).not.toBeNull();
    expect(input.getAttribute('role')).toBe('combobox');
  });
});
