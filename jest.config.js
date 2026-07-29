/**
 * Jest configuration for @cobranza-apps/ui.
 *
 * AI Agent: run tests via `npm test` (wraps `jest --passWithNoTests`).
 * Uses jest-preset-angular CJS preset for Angular 22 + Zone.js compatibility.
 * Test files: src/**/*.spec.ts. Setup: setup-jest.ts (initialises Angular test env).
 *
 * @see setup-jest.ts — Angular test environment bootstrap.
 * @see tsconfig.spec.json — TypeScript config for test compilation.
 */
const { createCjsPreset } = require('jest-preset-angular/presets/index.js');

/** @type {import('jest').Config} */
module.exports = {
  ...createCjsPreset(),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
};
