/**
 * Barrel file for CbaEmptyState.
 *
 * Uses the barrel pattern: this file re-exports the public API of the
 * CbaEmptyState component so consumers and `public-api.ts` can import
 * from a single, stable path (`components/empty-state`).
 *
 * When implementing CbaEmptyState, add `export * from './cba-empty-state.component'`
 * here. Do not export internal types or test helpers.
 */
export * from './cba-empty-state.component';
