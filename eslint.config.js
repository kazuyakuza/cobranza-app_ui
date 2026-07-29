// Flat ESLint config for @cobranza-apps/ui (Angular 22 / angular-eslint 22).
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
