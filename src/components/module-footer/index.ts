/**
 * Barrel file for ModuleFooter.
 *
 * Re-exports the public API of the ModuleFooter component so consumers and
 * `public-api.ts` import from a single, stable path
 * (`components/module-footer`). `ModuleHeaderStatus` is re-exported here so
 * consumers importing the footer get the shared status type in the same
 * namespace. Internal helpers are NOT exported.
 */
export { ModuleFooterComponent } from './module-footer.component';
export type { ModuleHeaderStatus } from '../module-header/module-header.types';
