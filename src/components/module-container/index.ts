/**
 * Barrel file for ModuleContainer.
 *
 * Re-exports the public API of the ModuleContainer component so consumers
 * and `public-api.ts` import from a single, stable path
 * (`components/module-container`). Internal helpers or test utilities are
 * NOT exported from here.
 */
export * from './module-container.types';
export * from './module-container.component';
