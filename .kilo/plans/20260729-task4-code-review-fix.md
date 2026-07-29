# Code Review Fix Plan — Task 4: Set Up `package.json` & Dependencies

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md` → line 4
> **Per-task plan:** `.kilo/plans/20260729-task4-setup-package-json.md`
> **Branch:** `feat/ui-library-setup`
> **Reviewer:** code-reviewer sub-agent

---

## Summary

The `package.json`, `ng-package.json`, TypeScript configs, Prettier/ESLint configs, and `.gitignore` largely match the per-task plan and the project brief. However, the Jest configuration is using an obsolete v16 setup path and a broken `stringifyContentPathRegex`, and several dependencies required by the chosen tool versions are missing from `devDependencies`. The fixes below must be applied before tests or a full build are verified in step 4.5.

---

## Required Fixes

### 1. `setup-jest.ts` uses the obsolete `jest-preset-angular/setup-jest` entry point

- **File:** `setup-jest.ts`
- **Severity:** High
- **Issue:** `jest-preset-angular` v17 no longer exposes `jest-preset-angular/setup-jest`. The v17 setup API is `jest-preset-angular/setup-env/zone` with `setupZoneTestEnv()`. The current import will fail once `npm test` runs.
- **Evidence:**
  ```ts
  import 'jest-preset-angular/setup-jest';
  ```
- **Recommended correction:**
  ```ts
  import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

  setupZoneTestEnv();
  ```

---

### 2. `jest.config.js` overrides the transformer with an incorrect `stringifyContentPathRegex`

- **File:** `jest.config.js`
- **Severity:** High
- **Issue:** `stringifyContentPathRegex: '\\.ts$'` tells the transformer to load `.ts` files as raw strings instead of compiling them. The transform key also restricts matching to `.ts` files, so external `.html` templates will not be transformed. This breaks any real component test.
- **Evidence:**
  ```js
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.ts$' },
    ],
  },
  ```
- **Recommended correction:** Use the v17 CJS preset helper, which already supplies the correct `moduleFileExtensions`, `transformIgnorePatterns`, `testEnvironment`, and `transform` configuration. Only `setupFilesAfterEnv` and `testMatch` need to be customized.
  ```js
  const { createCjsPreset } = require('jest-preset-angular/presets/index.js');

  /** @type {import('jest').Config} */
  module.exports = {
    ...createCjsPreset(),
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
  };
  ```

---

### 3. Missing `jsdom` dev dependency

- **File:** `package.json`
- **Severity:** High
- **Issue:** `jest-preset-angular@17` peer-requires `jsdom >=26.0.0`. The current `devDependencies` lists `jest-environment-jsdom` but not `jsdom`. `jest-environment-jsdom` itself depends on `jsdom`, but because `jest-preset-angular` has a direct peer on `jsdom`, it must be declared explicitly to avoid resolution surprises.
- **Evidence:** `devDependencies` contains `jest-environment-jsdom` but no `jsdom`.
- **Recommended correction:** Add to `devDependencies`:
  ```json
  "jsdom": "^26.0.0",
  ```

---

### 4. Missing explicit `typescript-eslint` dev dependency for the flat ESLint config

- **File:** `package.json`, `eslint.config.js`
- **Severity:** High
- **Issue:** `eslint.config.js` calls `require('typescript-eslint')`, but `typescript-eslint` is not declared in `devDependencies`. `angular-eslint` has it as a peer dependency, so npm 7+ may auto-install it, but relying on transitive/peer resolution is fragile.
- **Evidence:**
  ```js
  const tseslint = require('typescript-eslint');
  ```
- **Recommended correction:** Add to `devDependencies`:
  ```json
  "typescript-eslint": "^8.0.0",
  ```

---

### 5. `tsconfig.json` contains an unnecessary `ignoreDeprecations` value

- **File:** `tsconfig.json`
- **Severity:** Medium
- **Issue:** The per-task plan did not include `ignoreDeprecations`. The value `"6.0"` is not a documented valid value (TypeScript 5.0 introduced `"5.0"` for suppressing 5.0 deprecation warnings). Because the config does not use any deprecated options, the property should be removed.
- **Evidence:**
  ```json
  "ignoreDeprecations": "6.0"
  ```
- **Recommended correction:** Remove the line from `compilerOptions`.

---

### 6. `tsconfig.spec.json` inherits `target: ES2022`, which conflicts with `jest-preset-angular` guidance

- **File:** `tsconfig.spec.json`
- **Severity:** Medium
- **Issue:** `jest-preset-angular` documents that Angular does not support native `async/await` in tests when `target` is higher than `ES2016`. The base `tsconfig.json` sets `target: ES2022`; `tsconfig.spec.json` should override this for the test program.
- **Evidence:** `tsconfig.spec.json` does not override `target`.
- **Recommended correction:** Add to `compilerOptions`:
  ```json
  "target": "ES2016"
  ```

---

## Optional / Team-Decision Items

### 7. TypeScript version in `tech.md` is out of sync with `package.json`

- **File:** `.agent/project-info/tech.md`
- **Severity:** Medium
- **Issue:** `tech.md` still lists `TypeScript ~5.x`, but Angular 22 / `ng-packagr` 22 / `@angular/compiler-cli` 22.0.8 peer-require `typescript >=6.0 <6.1`, so `package.json` correctly pins `~6.0.3`.
- **Recommended correction:** Update the Stack Versions table in `tech.md`:
  - TypeScript: `~6.0.3` (supersedes brief's `~5.x` because Angular 22 requires TS 6.x)
- **Note:** This is documentation work and should be handled in step 4.4 (docs-specialist).

---

### 8. `@angular-eslint/*` sub-packages are installed but unused

- **File:** `package.json`
- **Severity:** Low
- **Issue:** `devDependencies` includes `@angular-eslint/eslint-plugin`, `@angular-eslint/eslint-plugin-template`, and `@angular-eslint/template-parser`. These are already transitive dependencies of `angular-eslint` and are not referenced in `eslint.config.js`. They do not cause errors, but they bloat the lockfile.
- **Recommended correction:** Either remove them and rely on the `angular-eslint` meta-package, or keep them if HTML-template linting will be added soon. If kept, add a template config block in `eslint.config.js`.

---

### 9. `eslint.config.js` does not lint inline templates or HTML files

- **File:** `eslint.config.js`
- **Severity:** Low
- **Issue:** The current config only applies `angular.configs.tsRecommended` to `.ts` files. Angular components with inline templates will not have their HTML linted, and standalone `.html` files are ignored.
- **Recommended correction:** When components are added, extend the config with the template processor and recommended template rules:
  ```js
  module.exports = tseslint.config(
    ...angular.configs.tsRecommended,
    {
      files: ['src/**/*.ts'],
      processor: angular.processInlineTemplates,
      rules: {},
    },
    ...angular.configs.templateRecommended,
    {
      files: ['src/**/*.html'],
      rules: {},
    },
  );
  ```

---

### 10. `package.json` `sideEffects: false` may tree-shake theme imports

- **File:** `package.json`
- **Severity:** Low
- **Issue:** `sideEffects: false` is correct for the JavaScript API, but SCSS/CSS theme imports are side-effect-only. Some bundlers may drop `import '@cobranza-apps/ui/theme/theme.scss'` if the package declares no side effects.
- **Recommended correction:** Once theme files exist, consider changing to:
  ```json
  "sideEffects": ["*.scss", "*.css", "*.sass"]
  ```

---

### 11. `publishConfig.access: public` for a scoped internal library

- **File:** `package.json`
- **Severity:** Low
- **Issue:** The package is scoped `@cobranza-apps/ui` and is intended for internal company use. `publishConfig.access: public` is fine for a private registry but would publish publicly if accidentally pushed to the public npm registry.
- **Recommended correction:** Confirm with the team. If the registry is private, either remove `publishConfig` or set `"access": "restricted"`.

---

### 12. Transitive `ng-bootstrap` peer dependencies are not declared

- **File:** `package.json`
- **Severity:** Low
- **Issue:** `@ng-bootstrap/ng-bootstrap@21` peer-requires `@angular/localize` and `@popperjs/core`. They are correctly installed as local `devDependencies`, but they are not listed in `peerDependencies`, so consumers get them only transitively.
- **Recommended correction:** Consider adding them as optional peers if the team wants consumers to see explicit guidance:
  ```json
  "peerDependencies": {
    "@popperjs/core": "^2.11.8",
    "@angular/localize": "^22.0.0"
  },
  "peerDependenciesMeta": {
    "@popperjs/core": { "optional": true },
    "@angular/localize": { "optional": true }
  }
  ```

---

## Verification After Fixes

After the implementer applies the required fixes, run:

```text
npm install
npm run lint
npm test
npm run build
```

Expected results:

- `npm install` exits 0 with no hard peer-dependency errors.
- `npm run lint` exits 0.
- `npm test` exits 0 ("No tests found" is acceptable at this stage).
- `npm run build` produces `dist/` (empty package is acceptable until components export symbols).

---

## Files This Plan Touches

- `package.json`
- `jest.config.js`
- `setup-jest.ts`
- `tsconfig.json`
- `tsconfig.spec.json`
- `eslint.config.js` (only if applying optional template linting)
- `.agent/project-info/tech.md` (documentation update in step 4.4)
