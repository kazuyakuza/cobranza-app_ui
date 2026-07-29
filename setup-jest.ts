/**
 * Jest test environment bootstrap for @cobranza-apps/ui.
 *
 * AI Agent: initialises the Angular Zone.js test environment before each test suite.
 * Referenced by jest.config.js → setupFilesAfterEnv.
 *
 * @see jest.config.js — Jest configuration that loads this file.
 */
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
