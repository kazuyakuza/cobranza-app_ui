# Simplification Plan — Task 4: Set Up Package JSON & Dependencies

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md` → line 4
> **Per-task plan:** `.kilo/plans/20260729-task4-setup-package-json.md`
> **Step:** 4.3 (Code Simplification)

---

## Summary

The newly created configuration files are functional and already lean, but a few settings are redundant or can be delegated to preset defaults. The simplification targets are `package.json`, `tsconfig.json`, `tsconfig.lib.json`, `jest.config.js`, and `eslint.config.js`. No changes are proposed for `ng-package.json`, `tsconfig.spec.json`, `setup-jest.ts`, `.prettierrc.json`, `.prettierignore`, or `.gitignore`.

---

## 1. `package.json` — remove unused ESLint sub-packages

### Observation

The flat ESLint config (`eslint.config.js`) only imports `angular-eslint` and uses `angular.configs.tsRecommended`. The three explicitly listed `@angular-eslint/*` packages are already transitive dependencies of `angular-eslint` and are not directly imported anywhere.

### Suggested edit

Remove these three lines from `devDependencies`:

```json
"@angular-eslint/eslint-plugin": "^22.0.0",
"@angular-eslint/eslint-plugin-template": "^22.0.0",
"@angular-eslint/template-parser": "^22.0.0",
```

### Rationale

Reduces the dependency surface and removes the risk of version drift between the meta-package and its sub-packages. If HTML template linting is added later, `angular-eslint` will bring the required sub-packages back automatically.

---

## 2. `tsconfig.json` — remove default / unnecessary flags

### Observations

- `"noPropertyAccessFromIndexSignature": false` is the default TypeScript behavior; the flag only has effect when set to `true`.
- `"ignoreDeprecations": "6.0"` was added despite the project targeting TypeScript 6.0.3. The flag is intended to suppress deprecation warnings for a specific upcoming version, which is not needed here.

### Suggested edit

Remove the two lines from `compilerOptions`:

```json
"noPropertyAccessFromIndexSignature": false,
"ignoreDeprecations": "6.0",
```

### Rationale

Keeps the base TypeScript configuration minimal and avoids carrying a flag that no longer applies to the chosen TypeScript version.

---

## 3. `tsconfig.lib.json` — remove redundant overrides and unused Storybook exclude

### Observations

- `"types": []` overrides the base `tsconfig.json`, but the base does not define `types`, so the override is a no-op.
- `"**/*.stories.ts"` is listed in `exclude`, but the project brief explicitly states **"No Storybook required for now"** (`brief.md` §4 and §10).

### Suggested edit

Update `tsconfig.lib.json` as follows:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "outDir": "./dist/out-tsc/lib"
  },
  "angularCompilerOptions": {
    "skipTemplateCodegen": true,
    "compilationMode": "partial"
  },
  "include": ["src/lib/**/*.ts"],
  "exclude": ["src/lib/**/*.spec.ts"]
}
```

### Rationale

Removes a redundant override and an unused exclusion pattern. If Storybook is adopted later, the `stories.ts` exclusion can be re-added.

---

## 4. `jest.config.js` — rely on `jest-preset-angular` defaults

### Observations

- `testEnvironment: 'jsdom'` is the default provided by `jest-preset-angular`.
- `moduleFileExtensions: ['ts', 'js', 'json']` is the default provided by `jest-preset-angular`.
- The custom `transform` block overrides the preset's transformer. The current override uses `stringifyContentPathRegex: '\.ts$'`, which is intended for HTML template content and is unnecessary for `.ts` files. The preset already configures the correct Angular transformer with the right `stringifyContentPathRegex` for HTML.

### Suggested edit

Replace `jest.config.js` with:

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
};
```

### Rationale

Eliminates three configuration entries that duplicate the preset defaults and removes a potentially incorrect `transform` override. Keeping `testMatch` and `setupFilesAfterEnv` explicit is reasonable for discoverability, but they are also preset defaults.

---

## 5. `eslint.config.js` — remove unused import and empty override

### Observations

- The file imports `typescript-eslint` but does not use it; the config is built with `tseslint.config(...)`. The original per-task plan specified `angular.config(...)`.
- The second config object only contains an empty `rules` block, which serves no purpose at this stage.

### Suggested edit

Replace `eslint.config.js` with:

```js
// @ts-check
const angular = require('angular-eslint');

module.exports = angular.config(...angular.configs.tsRecommended);
```

### Rationale

Aligns the config with the dependency actually used (`angular-eslint`) and removes the unused `typescript-eslint` import. The empty override can be re-added later when project-specific rules are needed.

---

## 6. Files with no simplification needed

The following files are already minimal and require no changes:

- `ng-package.json`
- `tsconfig.spec.json`
- `setup-jest.ts`
- `.prettierrc.json`
- `.prettierignore`
- `.gitignore`

---

## 7. Verification steps after applying simplifications

1. Run `npm install` to confirm the dependency graph still resolves cleanly after removing the ESLint sub-packages.
2. Run `npm run lint` to confirm the simplified ESLint config still exits 0.
3. Run `npm test` to confirm the simplified Jest config still runs (or passes with no tests).
4. Run `npm run build` to confirm the `tsconfig.json` / `tsconfig.lib.json` changes do not break the ng-packagr build.

---

## 8. Notes / out of scope

- Peer dependency ranges vs. dev dependency pins are intentionally kept as-is (loose peers, tight dev pins). Aligning them would reduce the file but would also change the consumer contract.
- `rxjs` and `tslib` are currently `devDependencies`; promoting them to `peerDependencies` is a dependency policy decision, not a simplification.
- `package-lock.json` is ignored per the task instructions. Committing it is a team policy decision, not a simplification.
