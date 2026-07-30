import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CbaCardComponent } from './cba-card.component';

@Component({
  standalone: true,
  imports: [CbaCardComponent],
  template: '<cba-card><p class="body">Body content</p></cba-card>',
})
class CardBodyOnlyHost {}

@Component({
  standalone: true,
  imports: [CbaCardComponent],
  template: `<cba-card>
    <div cbaCardHeader class="hdr">Header</div>
    <p class="body">Body content</p>
    <div cbaCardFooter class="ftr">Footer</div>
  </cba-card>`,
})
class CardFullLayoutHost {}

describe('CbaCardComponent', () => {
  describe('body only', () => {
    let fixture: ComponentFixture<CardBodyOnlyHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardBodyOnlyHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardBodyOnlyHost);
      fixture.detectChanges();
    });

    it('projects the body via the default slot', () => {
      const body = fixture.nativeElement.querySelector('.cba-card__body .body');
      expect(body).not.toBeNull();
      expect(body.textContent).toContain('Body content');
    });

    it('renders the card surface with the expected class', () => {
      const surface = fixture.nativeElement.querySelector('.cba-card__surface');
      expect(surface).not.toBeNull();
    });

    it('hides header/footer regions when nothing is projected', () => {
      const header = fixture.nativeElement.querySelector('.cba-card__header');
      const footer = fixture.nativeElement.querySelector('.cba-card__footer');
      expect(header.children.length).toBe(0);
      expect(footer.children.length).toBe(0);
    });
  });

  describe('with header and footer', () => {
    let fixture: ComponentFixture<CardFullLayoutHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardFullLayoutHost],
      }).compileComponents();

      fixture = TestBed.createComponent(CardFullLayoutHost);
      fixture.detectChanges();
    });

    it('renders header and footer only when projected', () => {
      const headerContent = fixture.nativeElement.querySelector('.cba-card__header .hdr');
      const footerContent = fixture.nativeElement.querySelector('.cba-card__footer .ftr');
      expect(headerContent).not.toBeNull();
      expect(headerContent.textContent).toBe('Header');
      expect(footerContent).not.toBeNull();
      expect(footerContent.textContent).toBe('Footer');
    });
  });
});
