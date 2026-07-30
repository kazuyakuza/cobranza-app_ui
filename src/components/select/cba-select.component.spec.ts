import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaSelectComponent } from './cba-select.component';

@Component({
  standalone: true,
  imports: [CbaSelectComponent],
  template: `<cba-select label="Status" hint="Pick one" error="Required">
    <option value="">Choose…</option>
    <option value="active">Active</option>
    <option value="paused">Paused</option>
  </cba-select>`,
})
class SelectHost {}

describe('CbaSelectComponent', () => {
  let fixture: ComponentFixture<SelectHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectHost] }).compileComponents();
    fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Status');
  });

  it('renders the hint and error text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('Pick one');
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Required');
  });

  it('projects native option elements into the select', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[1].textContent).toContain('Active');
  });

  it('sets aria-invalid when error is present', () => {
    expect(fixture.nativeElement.querySelector('select').getAttribute('aria-invalid')).toBe('true');
  });

  it('emits the selected value through ControlValueAccessor on change', () => {
    TestBed.resetTestingModule();
    @Component({
      standalone: true,
      imports: [CbaSelectComponent],
      template: `<cba-select>
        <option value="active">Active</option>
      </cba-select>`,
    })
    class CvaHost {}
    TestBed.configureTestingModule({ imports: [CvaHost] });
    const hostFixture = TestBed.createComponent(CvaHost);
    hostFixture.detectChanges();
    const selectComponent = hostFixture.debugElement.children[0].componentInstance as CbaSelectComponent;
    const onChange = jest.fn();
    selectComponent.registerOnChange(onChange);
    const selectEl: HTMLSelectElement = hostFixture.nativeElement.querySelector('select');
    selectEl.value = 'active';
    selectEl.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledWith('active');
  });

  it('disables the native select when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaSelectComponent] });
    const f = TestBed.createComponent(CbaSelectComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('select').hasAttribute('disabled')).toBe(true);
  });

  it('applies the disabled host modifier class when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaSelectComponent] });
    const f = TestBed.createComponent(CbaSelectComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.classList.contains('cba-select--disabled')).toBe(true);
  });
});
