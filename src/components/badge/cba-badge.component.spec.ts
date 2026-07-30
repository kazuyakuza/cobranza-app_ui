import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaBadgeComponent, CbaBadgeVariant } from './cba-badge.component';
import { hostEl } from '../testing/test-helpers';

describe('CbaBadgeComponent', () => {
  let fixture: ComponentFixture<CbaBadgeComponent>;

  function contentEl(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.cba-badge__content') as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbaBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CbaBadgeComponent);
    fixture.detectChanges();
  });

  it('projects badge content', () => {
    const projected = document.createElement('span');
    projected.className = 'badge-txt';
    projected.textContent = 'Active';
    hostEl(fixture).appendChild(projected);

    expect(hostEl(fixture).querySelector('.badge-txt')?.textContent).toBe('Active');
  });

  it('applies the variant host class for each variant', () => {
    const variants: CbaBadgeVariant[] = ['primary', 'success', 'warning', 'danger', 'info', 'neutral'];
    for (const v of variants) {
      fixture.componentRef.setInput('variant', v);
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains(`cba-badge--${v}`)).toBe(true);
    }
  });

  it('applies the solid and outline appearance classes', () => {
    expect(hostEl(fixture).classList.contains('cba-badge--solid')).toBe(true);
    expect(hostEl(fixture).classList.contains('cba-badge--outline')).toBe(false);

    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();
    expect(hostEl(fixture).classList.contains('cba-badge--outline')).toBe(true);
    expect(hostEl(fixture).classList.contains('cba-badge--solid')).toBe(false);
  });

  it('sets role="status" on the content element', () => {
    expect(contentEl()?.getAttribute('role')).toBe('status');
  });
});
