/**
 * Barrel file for ModuleHeader.
 *
 * Re-exports the public API of the ModuleHeader component so consumers and
 * `public-api.ts` import from a single, stable path
 * (`components/module-header`). Internal helpers or test utilities are NOT
 * exported from here.
 */
export * from './module-header.types';
export * from './module-header.component';
