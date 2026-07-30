import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaBadgeComponent } from './cba-badge.component';
import { CbaBadgeVariant } from './badge.types';

describe('CbaBadgeComponent', () => {
  let fixture: ComponentFixture<CbaBadgeComponent>;
  let component: CbaBadgeComponent;

  function hostEl(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function contentEl(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cba-badge__content') as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbaBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CbaBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the projected badge content', () => {
    const host = fixture.nativeElement as HTMLElement;
    const projected = document.createElement('span');
    projected.className = 'badge-txt';
    projected.textContent = 'Active';
    host.appendChild(projected);

    expect(host.querySelector('.badge-txt')?.textContent).toBe('Active');
  });

  it('applies the variant host class for each variant', () => {
    const variants: CbaBadgeVariant[] = ['primary', 'success', 'warning', 'danger', 'info', 'neutral'];
    for (const v of variants) {
      fixture.componentRef.setInput('variant', v);
      fixture.detectChanges();
      expect(hostEl().classList.contains(`cba-badge--${v}`)).toBe(true);
    }
  });

  it('applies the solid and outline appearance classes', () => {
    expect(hostEl().classList.contains('cba-badge--solid')).toBe(true);
    expect(hostEl().classList.contains('cba-badge--outline')).toBe(false);

    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();
    expect(hostEl().classList.contains('cba-badge--outline')).toBe(true);
    expect(hostEl().classList.contains('cba-badge--solid')).toBe(false);
  });

  it('sets role="status" on the content element', () => {
    expect(contentEl()?.getAttribute('role')).toBe('status');
  });
});
