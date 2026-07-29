# Simplification Plan — Task 1: Library Configuration Alignment

**Scope:** Review only the two files changed in the previous implementation step (`package.json`, `tsconfig.json`).

**Files reviewed:**
- `package.json`
- `tsconfig.json`

---

## 1. `package.json` — Remove redundant entries and fix ordering

### 1.1 Remove default `"private": false`

**Current snippet:**

```json
{
  "name": "@cobranza-apps/ui",
  "version": "0.1.0",
  "description": "Shared Angular component library and design system for the Cobranza App Company Back-office.",
  "license": "UNLICENSED",
  "private": false,
  "sideEffects": false,
  ...
}
```

**Suggested change:** Remove the `"private": false` line. `false` is the default value for `private`, so the entry adds no information while increasing noise.

### 1.2 Consider removing unused `@angular/cli` from `devDependencies`

**Current snippet:**

```json
"devDependencies": {
  "@angular/cli": "^22.0.9",
  ...
}
```

**Suggested change:** Remove `@angular/cli` from `devDependencies`. No npm script invokes the `ng` binary (`build` uses `ng-packagr`, `test` uses `jest`, `lint` uses `eslint`). Removing it reduces install size and dependency surface.

If the team later needs the CLI for schematics or workspace commands, it can be re-added.

### 1.3 Sort `devDependencies` alphabetically

**Current:** `typescript` appears after `typescript-eslint`.

**Suggested order (last entries only):**

```json
"tslib": "^2.3.0",
"typescript": "~6.0.3",
"typescript-eslint": "^8.0.0",
"zone.js": "~0.16.0"
```

**Reason:** Strict alphabetical sorting makes the dependency list predictable and easier to scan.

### 1.4 `peerDependencies` ordering

**Current:** Already grouped logically (Angular → FontAwesome → ng-bootstrap → bootstrap) and sorted within each group. No change recommended.

---

## 2. `tsconfig.json` — Remove redundant defaults and simplify path mapping

### 2.1 Remove default compiler options

**Current snippet:**

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@cobranza-apps/ui": ["src/lib/public-api.ts"]
    },
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "declaration": false,
    ...
  }
}
```

**Suggested changes:**
- Remove `"compileOnSave": false` (default is `false`).
- Remove `"forceConsistentCasingInFileNames": true` (default since TypeScript 5.0; project uses `typescript ~6.0.3`).
- Remove `"declaration": false` from `compilerOptions` (default is `false`).
- Change `"outDir": "./dist/out-tsc"` to `"outDir": "dist/out-tsc"` (leading `./` is redundant and inconsistent with the simplified `outDir` style).

### 2.2 Simplify `paths` mapping

**Current:**

```json
"paths": {
  "@cobranza-apps/ui": ["src/lib/public-api.ts"]
}
```

**Suggested:**

```json
"paths": {
  "@cobranza-apps/ui": "src/lib/public-api.ts"
}
```

**Reason:** A single-entry array can be replaced by the mapped string value, which is the simplest correct form for this mapping.

---

## 3. Summary of expected impact

| File | Change |
|---|---|
| `package.json` | Remove `"private": false`; remove `@angular/cli` (if confirmed unused); move `typescript` before `typescript-eslint`. |
| `tsconfig.json` | Remove `compileOnSave`, `forceConsistentCasingInFileNames`, and `declaration`; simplify `paths` to a string; remove leading `./` from `outDir`. |

No functional behavior changes. The configuration becomes smaller, more consistent, and easier to maintain.

---

## 4. Files to modify

1. `package.json`
2. `tsconfig.json`

**No other files are touched.**