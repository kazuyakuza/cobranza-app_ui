# Plan — Task 4: Set Up `package.json` & Install Dependencies

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md` → line 4
> **Global plan:** `.kilo/plans/20260729-ui-library-setup.md`
> **Branch:** `feat/ui-library-setup`
> **Step:** 4.1 (Analysis & Planning) — plan only. No files created, no `npm install` run in this step.

---

## 1. Pre-Analysis

### 1.1 Current state (verified)

- No `package.json` exists at repo root (only `.kilo/package.json`, unrelated Kilo config).
- No `ng-package.json`.
- `src/lib/public-api.ts` exists (containing `export {};`) — this is the ng-packagr entry file.
- `.gitignore` already ignores `dist/` and `build/` but **not** `node_modules/` or lock files.
- `src/lib/components/*` folders + `index.ts` barrels already created (Task 3).
- Working tree has untracked/unstaged `.kilo/plans/*` Task 1–3 files (not in scope for Task 4).

### 1.2 Source-of-truth requirements

From `brief.md` §4 and `tech.md`:

- Angular **22**, standalone only.
- Bootstrap **5.x** (CSS-only, never jQuery) + `@ng-bootstrap/ng-bootstrap` **v21**.
- Icons: FontAwesome Free (solid + regular) via `@fortawesome/angular-fontawesome`.
- Build: `ng-packagr`, single entry point `src/lib/public-api.ts`.
- Testing: Jest (unit) where useful.
- Peer deps: `@angular/core`, `@angular/common`, `@angular/forms`, `bootstrap`, `@ng-bootstrap/ng-bootstrap`, `@fortawesome/angular-fontawesome`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`.

### 1.3 Resolved exact versions (queried from npm registry `/latest`)

| Package | Pin (devDep) | Peer range (for consumers) | Notes |
| --- | --- | --- | --- |
| `@angular/core` | `^22.0.8` | `^22.0.0` | latest = 22.0.8 |
| `@angular/common` | `^22.0.8` | `^22.0.0` | |
| `@angular/forms` | `^22.0.8` | `^22.0.0` | |
| `@angular/compiler` | `^22.0.8` | — | build only |
| `@angular/compiler-cli` | `^22.0.8` | — | build only; peer `typescript >=6.0 <6.1` |
| `@angular/cli` | `^22.0.9` | — | latest = 22.0.9 |
| `@angular/platform-browser` | `^22.0.8` | — | required by `jest-preset-angular` peer |
| `@angular/localize` | `^22.0.8` | — | required by `@ng-bootstrap/ng-bootstrap` peer |
| `@ng-bootstrap/ng-bootstrap` | `^21.0.0` | `^21.0.0` | latest = 21.0.0 |
| `@popperjs/core` | `^2.11.8` | — | peer of bootstrap + ng-bootstrap (dev only) |
| `@fortawesome/angular-fontawesome` | `^5.1.0` | `^5.0.0` | latest = 5.1.0; FA **v7** ecosystem |
| `@fortawesome/fontawesome-svg-core` | `^7.3.0` | — | regular dep of angular-fontawesome; added as devDep for types |
| `@fortawesome/free-solid-svg-icons` | `^7.3.1` | `^7.3.0` | latest = 7.3.1 |
| `@fortawesome/free-regular-svg-icons` | `^7.3.1` | `^7.3.0` | latest = 7.3.1 |
| `bootstrap` | `^5.3.8` | `^5.3.0` | latest = 5.3.8 |
| `ng-packagr` | `^22.1.0` | — | latest = 22.1.0; CLI: `-p ng-package.json -c tsconfig.lib.json` |
| `typescript` | `~6.0.3` | — | **REQUIRED by Angular 22 + ng-packagr 22.1.0 (>=6.0 <6.1)** |
| `tslib` | `^2.3.0` | — | |
| `rxjs` | `^7.8.1` | — | Angular core peer `^7.4.0` |
| `zone.js` | `~0.16.0` | — | Angular core peer `~0.15 || ~0.16`; jest-preset uses ~0.16 |
| `jest` | `^30.4.0` | — | latest = 30.4.2 |
| `jest-preset-angular` | `^17.0.0` | — | peers `jest ^30`, `@angular/platform-browser <23` |
| `@types/jest` | `^30.0.0` | — | |
| `@types/node` | `^22.0.0` | — | Angular 22 min Node = 22.22.3 |
| `angular-eslint` | `^22.0.0` | — | flat config; brings typescript-eslint + eslint peer |
| `eslint` | `^9.0.0` | — | peer of angular-eslint 22 (flat config) |
| `prettier` | `^3.0.0` | — | format script |

### 1.4 Ambiguities & decisions (FLAGGED)

1. **TypeScript version (~6.0.3, not ~5.x).**
   `brief.md`/`tech.md` state `TypeScript ~5.x`. The npm registry shows Angular 22 (`@angular/compiler-cli@22.0.8`) and `ng-packagr@22.1.0` both peer-require `typescript >=6.0 <6.1` (compiler-cli devDeps pin `6.0.3`).
   **Decision:** pin `typescript ~6.0.3`. This supersedes the brief's `~5.x`; `tech.md` already says "exact versions finalized in Task 4", so this is the intended resolution. Recommend updating `tech.md` "Stack Versions" row after implementation (out of scope here; flag for 4.3 review).

2. **ng-bootstrap transitive peers.**
   `@ng-bootstrap/ng-bootstrap@21` peer-requires `@angular/localize ^22.0.0` and `@popperjs/core ^2.11.8` (the latter also peer of `bootstrap`).
   **Decision:** per the task instructions, `peerDependencies` stays exactly to the brief list (core/common/forms/bootstrap/ng-bootstrap/fontawesome+packs). `@angular/localize` + `@popperjs/core` are added to **devDependencies** so the local build/test resolves. Consumers get them transitively through ng-bootstrap. Flag for 4.3 review: consider promoting `@popperjs/core` + `@angular/localize` to `peerDependencies` to give consumers clearer guidance.

3. **FontAwesome v7 ecosystem.**
   `@fortawesome/angular-fontawesome@5.1.0` targets Font Awesome **v7** (`fontawesome-svg-core ^7.3.0`); icon packs are `7.3.1`. Peer ranges use `^7.3.0`. `fontawesome-svg-core` is a regular dep of `angular-fontawesome` (auto-installed for consumers), so it is **not** a peer; we add it as a devDep for local type access only.

4. **`@angular/platform-browser` as devDep.**
   Not in the brief peer list, but `jest-preset-angular@17` peer-requires `@angular/platform-browser <23`. Added to devDependencies only.

5. **Lockfile in `.gitignore`.**
   Task instructions & global plan explicitly say to ignore `node_modules/` + `package-lock.json`. Note: many published libraries **commit** lockfiles for reproducibility. We follow the task instruction (ignore) but flag for 4.3 review — the team may prefer to commit `package-lock.json` instead.

6. **License / repository / publish visibility.**
   No license is declared in the brief. This is an internal company library consumed by Shell + MFEs (likely via npm link/private registry — `architecture.md` mentions `npm link`/`npm pack`).
   **Decision:** `license: "UNLICENSED"` (proprietary SPDX identifier), `private: false` (must be consumable), `publishConfig: { "access": "public" }` (scoped package; on a private registry this still works). `repository`/`homepage` omitted to avoid inventing URLs. **Flag for user confirmation** — adjust if a different license/private-registry config applies.

7. **Additional config files beyond the explicit list.**
   To make the `build`/`test`/`lint`/`format` scripts actually runnable, the plan also creates: a base `tsconfig.json` (extended by lib/spec configs), `tsconfig.lib.json`, `tsconfig.spec.json`, `jest.config.js`, `setup-jest.ts`, `eslint.config.js`, `.prettierrc.json`. These are needed for `tsconfig.lib.json` (`extends ./tsconfig.json`) and for the scripts. Flagged for approval; otherwise `lint`/`format`/`test` would be dead scripts.

8. **Node engine.**
   Angular 22 engines: `node ^22.22.3 || ^24.15.0 || >=26.0.0`. `package.json` `engines.node` mirrors this exactly. Local machine must use Node ≥ 22.22.3.

---

## 2. High-Level Approach

1. Create the root build-tooling config files (TypeScript + Angular compiler configs).
2. Create `ng-package.json` (build descriptor) pointing to `src/lib/public-api.ts`, output `dist/`.
3. Create `package.json` with name/version, peerDependencies (consumer contract), devDependencies (build/test), and the four scripts.
4. Create Jest + ESLint + Prettier configs so scripts are functional.
5. Update `.gitignore` for Node/npm artifacts.
6. Run `npm install` to validate dependency resolution (no peer conflicts) and create `node_modules/`.
7. Verify artifacts, then commit.

This step (4.1) produces **this plan only**. Implementation commands are described for the implementer (step 4.2).

---

## 3. Detailed Implementation Steps (for step 4.2 — implementer)

Each step below is atomic and verifiable. File paths are repo-relative. Exact file contents are provided so the implementer creates them verbatim (adjusting only if `npm install` reports a resolvable conflict).

### Step 3.1 — Create base `tsconfig.json`

Path: `tsconfig.json`

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "module": "ES2022",
    "target": "ES2022",
    "lib": ["ES2022", "dom"],
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

Verification: file exists, valid JSON.

### Step 3.2 — Create `tsconfig.lib.json`

Path: `tsconfig.lib.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "inlineSources": true,
    "outDir": "./dist/out-tsc/lib",
    "types": []
  },
  "angularCompilerOptions": {
    "skipTemplateCodegen": true,
    "compilationMode": "partial"
  },
  "include": ["src/lib/**/*.ts"],
  "exclude": ["src/lib/**/*.spec.ts", "**/*.stories.ts"]
}
```

Verification: `tsc -p tsconfig.lib.json --noEmit` should not crash (after install; optional check at 4.5).

### Step 3.3 — Create `tsconfig.spec.json`

Path: `tsconfig.spec.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist/out-tsc/spec",
    "module": "commonjs",
    "moduleResolution": "node10",
    "types": ["jest", "node"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts", "setup-jest.ts"]
}
```

Verification: file exists, valid JSON.

### Step 3.4 — Create `ng-package.json`

Path: `ng-package.json`

```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "dest": "./dist",
  "lib": {
    "entryFile": "src/lib/public-api.ts"
  }
}
```

Notes:
- `dest` defaults to `dist` (schema confirms); explicit for clarity.
- No `tsConfig` field exists in the ng-packagr schema; the tsconfig is passed via the CLI `-c` flag (see build script, Step 3.5).

Verification: `ng-packagr -p ng-package.json --config tsconfig.lib.json` resolves config (actual build validated at 4.5 after components exist; at this stage `public-api.ts` is `export {}` so build yields empty package — acceptable).

### Step 3.5 — Create `package.json`

Path: `package.json`

```json
{
  "name": "@cobranza-apps/ui",
  "version": "0.1.0",
  "description": "Shared Angular component library and design system for the Cobranza App Company Back-office.",
  "license": "UNLICENSED",
  "private": false,
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  },
  "engines": {
    "node": "^22.22.3 || ^24.15.0 || >=26.0.0"
  },
  "scripts": {
    "build": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
    "test": "jest",
    "lint": "eslint \"src/**/*.ts\"",
    "format": "prettier --write \"src/**/*.{ts,scss,css,json,md}\""
  },
  "peerDependencies": {
    "@angular/core": "^22.0.0",
    "@angular/common": "^22.0.0",
    "@angular/forms": "^22.0.0",
    "bootstrap": "^5.3.0",
    "@ng-bootstrap/ng-bootstrap": "^21.0.0",
    "@fortawesome/angular-fontawesome": "^5.0.0",
    "@fortawesome/free-solid-svg-icons": "^7.3.0",
    "@fortawesome/free-regular-svg-icons": "^7.3.0"
  },
  "devDependencies": {
    "@angular-eslint/eslint-plugin": "^22.0.0",
    "@angular-eslint/eslint-plugin-template": "^22.0.0",
    "@angular-eslint/template-parser": "^22.0.0",
    "@angular/cli": "^22.0.9",
    "@angular/common": "^22.0.8",
    "@angular/compiler": "^22.0.8",
    "@angular/compiler-cli": "^22.0.8",
    "@angular/core": "^22.0.8",
    "@angular/forms": "^22.0.8",
    "@angular/localize": "^22.0.8",
    "@angular/platform-browser": "^22.0.8",
    "@fortawesome/angular-fontawesome": "^5.1.0",
    "@fortawesome/fontawesome-svg-core": "^7.3.0",
    "@fortawesome/free-regular-svg-icons": "^7.3.1",
    "@fortawesome/free-solid-svg-icons": "^7.3.1",
    "@ng-bootstrap/ng-bootstrap": "^21.0.0",
    "@popperjs/core": "^2.11.8",
    "@types/jest": "^30.0.0",
    "@types/node": "^22.0.0",
    "angular-eslint": "^22.0.0",
    "bootstrap": "^5.3.8",
    "eslint": "^9.0.0",
    "jest": "^30.4.0",
    "jest-preset-angular": "^17.0.0",
    "ng-packagr": "^22.1.0",
    "prettier": "^3.0.0",
    "rxjs": "^7.8.1",
    "tslib": "^2.3.0",
    "typescript": "~6.0.3",
    "zone.js": "~0.16.0"
  }
}
```

Notes:
- `sideEffects: false` — safe for a tree-shakeable Angular library.
- The three `@angular-eslint/*` sub-packages are listed for the later HTML-template linting; if `npm install` reports them as unavailable/unresolvable for v22, the implementer may drop them and rely on the `angular-eslint` meta-package only (the flat config in Step 3.8 uses only `angular-eslint`). Flag: implementer should keep only what resolves cleanly.
- `@angular-eslint/*` exact availability for Angular 22 is not 100% confirmed from registry; `angular-eslint` (meta-package) is the supported entry. If the three sub-packages cause resolution errors, **remove them** and keep `angular-eslint` only.

Verification: file is valid JSON; `name`, `version`, `peerDependencies` block present; scripts present.

### Step 3.6 — Create Jest config + setup

Path: `jest.config.js`

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEach: [],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.ts$' },
    ],
  },
};
```

Path: `setup-jest.ts`

```ts
// jest-preset-angular global setup (zone.js, TestBed environment, matchers).
import 'jest-preset-angular/setup-jest';
```

Verification: `npm test` runs and exits 0 with "no tests found" (no spec files yet). Flag: if `jest-preset-angular/setup-jest` export path differs in v17, implementer adjusts to the documented entry (e.g. `import 'jest-preset-angular'`).

### Step 3.7 — Update `.gitignore`

Append a Node/npm section to `tsconfig`… to the existing `.gitignore`. Do not remove existing entries.

Append:

```gitignore

# Node / npm
node_modules/
package-lock.json
yarn.lock
.pnp.*
```

Verification: `git status` shows `node_modules/`, `package-lock.json` ignored after install. Cross-check against `.kilo/rules/gitignore-compliance.md`.

### Step 3.8 — Create ESLint flat config

Path: `eslint.config.js`

```js
// Flat ESLint config for @cobranza-apps/ui (Angular 22 / angular-eslint 22).
// @ts-check
const angular = require('angular-eslint');

module.exports = angular.config(
  ...angular.configs.tsRecommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      // Project-specific overrides go here.
    },
  },
);
```

Verification: `npm run lint` exits 0 (no source files have lintable content yet beyond `export {}`).

### Step 3.9 — Create Prettier config

Path: `.prettierrc.json`

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Path: `.prettierignore`

```gitignore
dist/
node_modules/
package-lock.json
```

Verification: `npx prettier --check "src/**/*.ts"` exits 0.

### Step 3.10 — Run `npm install`

Command (single command, no chaining):

```text
npm install
```

Verification:
- Exit code 0.
- `node_modules/` created.
- No **hard** peer dependency errors (npm may print warnings for optional peers; warnings about `@angular/compiler` optional peer are acceptable).
- `node_modules/.package-lock.json` or `package-lock.json` generated.
- `git status` does **not** show `node_modules/` or `package-lock.json` staged (gitignore working).

### Step 3.11 — Sanity smoke checks (optional, before commit)

Run each as a single command (no chaining). These confirm scripts are wired; full build correctness is verified at 4.5.

```text
npm run lint
npm test
npm run build
```

Expected:
- `lint`: 0 errors.
- `test`: "No tests found", exit 0.
- `build`: `dist/` produced (empty/minimal package since `public-api.ts` is `export {}`). Acceptable at this stage; full build validated in Task 4.5 after components exist. **Note:** if `build` fails purely because there are no exports, that is acceptable — record the error and proceed (the build target is verified later). Do **not** block Task 4 completion on an empty-library build warning.

### Step 3.12 — Commit

- Stage **only** the new config files (`package.json`, `ng-package.json`, `tsconfig.json`, `tsconfig.lib.json`, `tsconfig.spec.json`, `jest.config.js`, `setup-jest.ts`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, updated `.gitignore`).
- Ensure `node_modules/`, `package-lock.json`, `yarn.lock` are NOT staged (gitignore-compliance rule).
- Commit message:

```text
chore: set up package.json, ng-packagr, jest, eslint, and prettier (task 4)
```

---

## 4. Git actions

- Branch: stay on `feat/ui-library-setup` (already created in Step 2).
- No merge/push in this step.
- Single commit at Step 3.12.

---

## 5. Verification (to be performed in step 4.5)

- `package.json` present with `name: "@cobranza-apps/ui"`, `version: "0.1.0"`.
- `peerDependencies` matches the brief list exactly (8 entries).
- `devDependencies` includes Angular 22, ng-packagr 22.1.0, typescript ~6.0.3, jest 30, jest-preset-angular 17, eslint 9, angular-eslint 22, prettier 3.
- `ng-package.json` points to `src/lib/public-api.ts`, dest `./dist`.
- `tsconfig.lib.json` + `tsconfig.spec.json` extend `./tsconfig.json`.
- `.gitignore` contains `node_modules/`, `package-lock.json`.
- `npm install` exit 0; `node_modules/` exists; none of `node_modules/`/`package-lock.json` staged.
- Report any deviations from this plan.

---

## 6. Documentation (step 4.4 — docs-specialist)

- Update README `/docs/USAGE.md` with: prerequisite Node version, `npm install`, peer-dependency note for consumers, and the `build`/`test`/`lint`/`format` commands.
- Add a short note in `tech.md` that exact versions are now pinned to TypeScript ~6.0.3 / Angular 22.0.8 (flagged ambiguity #1).

---

## 7. Open items / flags for reviewer

1. TypeScript pinned to `~6.0.3` (supersedes brief's `~5.x`) — needs confirmation.
2. ng-bootstrap transitive peers (`@popperjs/core`, `@angular/localize`) kept as devDeps only — consider promoting to peers in 4.3.
3. `package-lock.json` ignored per task instruction — team may prefer to commit it.
4. License set to `UNLICENSED` + `private: false` + `publishConfig.access: public` — confirm fit for the company's private registry.
5. Extra config files (`tsconfig.json`, `jest.config.js`, `setup-jest.ts`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`) added beyond the explicit list to make `test`/`lint`/`format` runnable — confirm acceptable.
6. `@fortawesome/angular-fontawesome` peer range `^5.0.0` (v5 targets Angular 22 + FA v7) — confirm range breadth.

---

## 8. Out of scope for this (4.1) step

- Do NOT create any of the files above.
- Do NOT run `npm install`.
- Do NOT run git commands.
- Do NOT edit `tech.md`/`brief.md`.