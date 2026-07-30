import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaSkeletonComponent, CbaSkeletonVariant } from './cba-skeleton.component';
import { hostEl } from '../testing/test-helpers';

describe('CbaSkeletonComponent', () => {
  let fixture: ComponentFixture<CbaSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CbaSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CbaSkeletonComponent);
    fixture.detectChanges();
  });

  it('renders the generic variant by default', () => {
    expect(hostEl(fixture).classList.contains('cba-skeleton--generic')).toBe(true);
    const shape = fixture.nativeElement.querySelector('.cba-skeleton__shape--generic');
    expect(shape).not.toBeNull();
  });

  it('applies the variant host class for each variant', () => {
    const variants: CbaSkeletonVariant[] = ['text', 'avatar', 'card', 'table-row', 'generic'];
    for (const v of variants) {
      fixture.componentRef.setInput('variant', v);
      fixture.detectChanges();
      expect(hostEl(fixture).classList.contains(`cba-skeleton--${v}`)).toBe(true);
    }
  });

  it('renders three lines for the text variant', () => {
    fixture.componentRef.setInput('variant', 'text');
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.cba-skeleton__line');
    expect(lines.length).toBe(3);
  });

  it('renders four cells for the table-row variant', () => {
    fixture.componentRef.setInput('variant', 'table-row');
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('.cba-skeleton__cell');
    expect(cells.length).toBe(4);
  });

  it('marks the content as aria-hidden and role=presentation', () => {
    const content = fixture.nativeElement.querySelector('.cba-skeleton__content');
    expect(content?.getAttribute('aria-hidden')).toBe('true');
    expect(content?.getAttribute('role')).toBe('presentation');
  });

  it('honours width and height overrides via inline styles', () => {
    fixture.componentRef.setInput('variant', 'avatar');
    fixture.componentRef.setInput('width', '12rem');
    fixture.componentRef.setInput('height', '2rem');
    fixture.detectChanges();

    const shape = fixture.nativeElement.querySelector('.cba-skeleton__shape--avatar') as HTMLElement;
    expect(shape.style.width).toBe('12rem');
    expect(shape.style.height).toBe('2rem');
  });
});
