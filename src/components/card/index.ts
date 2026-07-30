/**
 * Barrel file for CbaCard.
 *
 * Uses the barrel pattern: this file re-exports the public API of the
 * CbaCard component so consumers and `public-api.ts` can import
 * from a single, stable path (`components/card`).
 *
 * When implementing CbaCard, add `export * from './cba-card.component'`
 * here. Do not export internal types or test helpers.
 */
export * from './cba-card.component';
