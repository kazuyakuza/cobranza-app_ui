import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CbaEmptyStateComponent } from './cba-empty-state.component';

@Component({
  standalone: true,
  imports: [CbaEmptyStateComponent],
  template: `<cba-empty-state title="No items">
    <span cbaEmptyStateIcon class="icon-el">icon</span>
    <button cbaEmptyStateAction class="action-el">Reset</button>
  </cba-empty-state>`,
})
class EmptyStateWithProjectionsHost {}

describe('CbaEmptyStateComponent', () => {
  describe('without projections', () => {
    let fixture: ComponentFixture<CbaEmptyStateComponent>;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CbaEmptyStateComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(CbaEmptyStateComponent);
    });

    it('renders the required title as an h3', () => {
      fixture.componentRef.setInput('title', 'No items');
      fixture.detectChanges();
      const titleEl = fixture.nativeElement.querySelector('.cba-empty-state__title');
      expect(titleEl).not.toBeNull();
      expect(titleEl.tagName).toBe('H3');
      expect(titleEl.textContent).toBe('No items');
    });

    it('does not render the description element when description is empty', () => {
      fixture.componentRef.setInput('title', 'Empty');
      fixture.detectChanges();
      const descEl = fixture.nativeElement.querySelector('.cba-empty-state__description');
      expect(descEl).toBeNull();
    });

    it('renders the description element when provided', () => {
      fixture.componentRef.setInput('title', 'No items');
      fixture.componentRef.setInput('description', 'Try adjusting filters');
      fixture.detectChanges();
      const descEl = fixture.nativeElement.querySelector('.cba-empty-state__description');
      expect(descEl).not.toBeNull();
      expect(descEl.textContent).toBe('Try adjusting filters');
    });

    it('hides icon/action regions when not projected', () => {
      fixture.componentRef.setInput('title', 'Empty');
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector('.cba-empty-state__icon');
      const action = fixture.nativeElement.querySelector('.cba-empty-state__action');
      expect(icon.children.length).toBe(0);
      expect(action.children.length).toBe(0);
    });
  });

  describe('with projected content', () => {
    let hostFixture: ComponentFixture<EmptyStateWithProjectionsHost>;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [EmptyStateWithProjectionsHost],
      }).compileComponents();

      hostFixture = TestBed.createComponent(EmptyStateWithProjectionsHost);
      hostFixture.detectChanges();
    });

    it('projects the icon and action slots', () => {
      const iconProj = hostFixture.nativeElement.querySelector('.cba-empty-state__icon .icon-el');
      const actionProj = hostFixture.nativeElement.querySelector('.cba-empty-state__action .action-el');
      expect(iconProj).not.toBeNull();
      expect(actionProj).not.toBeNull();
    });
  });
});
