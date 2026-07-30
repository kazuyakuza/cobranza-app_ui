/**
 * Single public entry point for @cobranza-apps/ui.
 *
 * This file is referenced by ng-packagr as the library's `public-api` and
 * determines which symbols consumers can import from '@cobranza-apps/ui'.
 *
 * ## How to add exports
 *
 * 1. Implement the component, directive, pipe, or service inside `src/`.
 * 2. Re-export it from its folder's barrel (`index.ts`).
 * 3. Add a `export * from './<path>'` line below, keeping
 *    alphabetical order and grouping by category (components, directives, theme).
 *
 * Do NOT export internal helpers or private utilities from this file.
 * Everything exported here becomes part of the library's public semver contract.
 */
/** Components. */
export * from './components/module-header';
export * from './components/module-container';
