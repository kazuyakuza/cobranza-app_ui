import { ComponentFixture } from '@angular/core/testing';

/**
 * Returns the native host element of a component fixture.
 * Shorthand for `fixture.nativeElement as HTMLElement`.
 */
export function hostEl(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

/**
 * Finds the first element matching `className` within the fixture's
 * native element. Equivalent to
 * `fixture.nativeElement.querySelector(`.${className}`)`.
 */
export function queryByClass(
  fixture: ComponentFixture<unknown>,
  className: string,
): HTMLElement | null {
  return fixture.nativeElement.querySelector(`.${className}`);
}
