/**
 * Barrel file for CbaButton.
 *
 * Uses the barrel pattern: this file re-exports the public API of the
 * CbaButton component so consumers and `public-api.ts` can import
 * from a single, stable path (`components/button`).
 *
 * When implementing CbaButton, add `export * from './cba-button.component'`
 * here. Do not export internal types or test helpers.
 */
export * from './cba-button.component';
