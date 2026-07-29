/**
 * Flat ESLint configuration for @cobranza-apps/ui.
 *
 * AI Agent: run linting via `npm run lint` (wraps `eslint "src/**/*.ts"`).
 * Uses angular-eslint recommended rules for Angular 22 standalone components.
 * Add project-specific rule overrides in the rules object below.
 *
 * @see https://github.com/angular-eslint/angular-eslint
 */
// @ts-check
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  ...angular.configs.tsRecommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      // Project-specific overrides go here.
    },
  },
);
