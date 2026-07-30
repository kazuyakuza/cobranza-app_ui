import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent, CbaButtonVariant } from './cba-button.component';
import { hostEl } from '../testing/test-helpers';

/**
 * Helper: creates a TestHost wrapper that allows testing projected content.
 * Most input/behaviour tests use the component directly with setInput.
 */
@Component({
  standalone: true,
  imports: [CbaButtonComponent],
  template: '<cba-button><span class="label-host">Save</span></cba-button>',
})
class ButtonWithLabelHost {}

describe('CbaButtonComponent', () => {
  describe('direct (no projection)', () => {
    let fixture: ComponentFixture<CbaButtonComponent>;
    let component: CbaButtonComponent;

    function button(): HTMLButtonElement {
      return fixture.nativeElement.querySelector('button.cba-button__control') as HTMLButtonElement;
    }

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CbaButtonComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CbaButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('emits cbaClick when the button is clicked and enabled', () => {
      let emitted = 0;
      component.cbaClick.subscribe(() => (emitted += 1));
      button().click();
      expect(emitted).toBe(1);
    });

    it('does not emit cbaClick when disabled is true', () => {
      let emitted = 0;
      component.cbaClick.subscribe(() => (emitted += 1));
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      button().click();
      expect(emitted).toBe(0);
    });

    it('does not emit cbaClick when loading is true', () => {
      let emitted = 0;
      component.cbaClick.subscribe(() => (emitted += 1));
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      button().click();
      expect(emitted).toBe(0);
    });

    it('applies the cba-button--primary class by default', () => {
      expect(hostEl(fixture).classList.contains('cba-button--primary')).toBe(true);
    });

    it('applies the variant host class for each variant', () => {
      const variants: CbaButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger', 'success'];
      for (const v of variants) {
        fixture.componentRef.setInput('variant', v);
        fixture.detectChanges();
        expect(hostEl(fixture).classList.contains(`cba-button--${v}`)).toBe(true);
      }
    });

    it('applies the size host class for sm and md', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-button--sm')).toBe(true);
      expect(hostEl(fixture).classList.contains('cba-button--md')).toBe(false);

      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains('cba-button--md')).toBe(true);
    });

    it('renders a leading icon when icon is provided', () => {
      fixture.componentRef.setInput('icon', faTrashCan);
      fixture.detectChanges();
      const leadingIcon = fixture.nativeElement.querySelector('.cba-button__icon--leading');
      expect(leadingIcon).not.toBeNull();
    });

    it('replaces the leading icon with a spinner when loading', () => {
      fixture.componentRef.setInput('icon', faTrashCan);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('.cba-button__icon--spinner');
      const leadingIcon = fixture.nativeElement.querySelector('.cba-button__icon--leading');
      expect(spinner).not.toBeNull();
      expect(leadingIcon).toBeNull();
    });

    it('sets aria-busy while loading', () => {
      expect(button().getAttribute('aria-busy')).toBeNull();

      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(button().getAttribute('aria-busy')).toBe('true');
    });

    it('sets the native button type from the type input', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();
      expect(button().getAttribute('type')).toBe('submit');
    });
  });

  describe('with projected content', () => {
    let fixture: ComponentFixture<ButtonWithLabelHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ButtonWithLabelHost],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonWithLabelHost);
      fixture.detectChanges();
    });

    it('renders the projected label inside the native button', () => {
      const buttonEl = fixture.nativeElement.querySelector('button.cba-button__control') as HTMLButtonElement;
      expect(buttonEl.textContent).toContain('Save');
      expect(buttonEl.querySelector('.label-host')).not.toBeNull();
    });
  });
});
