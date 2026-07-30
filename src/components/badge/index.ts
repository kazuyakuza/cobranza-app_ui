/**
 * Barrel file for CbaBadge.
 *
 * Uses the barrel pattern: this file re-exports the public API of the
 * CbaBadge component so consumers and `public-api.ts` can import
 * from a single, stable path (`components/badge`).
 *
 * When implementing CbaBadge, add `export * from './cba-badge.component'`
 * here. Do not export internal types or test helpers.
 */
export * from './badge.types';
export * from './cba-badge.component';
