# Task 4 — Regression Tests: Implementation Plan

**TODO Source:** `.agent/todos/20260805/20260805-todo-1.md` (line 19)
**Global Plan:** `.kilo/plans/20260806-theme-tokens-preview-guide.md`
**Branch:** `feat/theme-refinement-tokens-preview-guide`
**Date:** 2026-08-06
**Author:** architector (Step 4.1b)
**Front-end flag:** Yes (tests live in `src/`, run in jsdom/Node via Jest)

---

## 1. Scope & Non-Goals

**In scope** — regression tests for Tasks 1–3 of this TODO:

- **Task 1** (token adjustments): assert every `--cba-*` token value matches the canonical set, and that surface hierarchy (lightness gaps + ordering) holds.
- **Task 1** (contrast): assert WCAG AA for all intended text/background pairs; assert the two documented restricted pairs still fail AA (guards the documented exception).
- **Task 2** (preview HTML): assert `docs/theme-preview.html` contains the required structural sections and that the `TOKEN_ROLES` hex values are consistent with `src/theme/_variables.scss`.
- **Task 2** (compiled CSS drift): assert the committed `docs/theme-preview.css` `:root` tokens match the canonical set — catches "forgot to run `npm run build:preview`" regressions.
- **Task 3** (consumer guide): assert `docs/CONSUMER_GUIDE.md` retains the mandated AI-agent sections.

**Non-goals (explicitly NOT done in this plan):**

- Do NOT change any `--cba-*` token value or rename any token.
- Do NOT change `jest.config.js`, `tsconfig.spec.json`, `setup-jest.ts`, or `package.json` test scripts — the existing config already picks up `src/**/*.spec.ts`.
- Do NOT add Angular component computed-style tests (jsdom custom-property resolution across stylesheets is unreliable; token-value tests via source parsing are deterministic and stricter).
- Do NOT modify `docs/theme-preview.html`, `docs/CONSUMER_GUIDE.md`, `src/theme/_variables.scss`, or any theme SCSS.
- Do NOT create new top-level folders. All new helpers go into the existing `src/components/testing/` folder; all new specs go into the existing `src/theme/` folder.
- Do NOT run `npm run build:preview` — tests assert the already-committed preview CSS.
- This is planning only (Step 4.1b). Implementation, review, docs, verification, and completion are Steps 4.2–4.6 handled by other sub-agents.

---

## 2. Environment Facts (verified)

- `package.json` script: `"test": "jest --passWithNoTests"`. DevDeps: `jest ^30.4.0`, `jest-environment-jsdom ^30.4.1`, `jest-preset-angular ^17.0.0`, `@types/jest ^30.0.0`, `@types/node ^22.0.0`.
- `jest.config.js`: uses `createCjsPreset()`, `testMatch: ['<rootDir>/src/**/*.spec.ts']`, `setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']`, jsdom environment, ignores `<rootDir>/dist/`.
- `tsconfig.spec.json`: `types: ["jest","node"]` (Node `fs`/`path` available), `include: ["src/**/*.spec.ts","src/**/*.d.ts","setup-jest.ts"]`. Non-spec `.ts` files imported by specs are transformed by ts-jest on demand (proven by existing `src/components/testing/test-helpers.ts` imported by every component spec).
- Existing pattern: `src/components/testing/test-helpers.ts` provides `hostEl`/`queryByClass` — new test helpers follow this folder convention.
- jsdom env exposes global `document`, so parsing an HTML string with `document.createElement('div'); div.innerHTML = html` works without extra deps.

---

## 3. Canonical Token Values (source of truth)

Sourced from `src/theme/_variables.scss` (current, post-Task-1) and `.agent/project-info/brief.md` §5. Tests assert these EXACT values — not the brief's prose, the SCSS file is the runtime source of truth.

| Token | Value | Token | Value |
|-------|-------|-------|-------|
| `--cba-bg-primary` | `#C5BFAE` | `--cba-accent-primary` | `#6B5B4F` |
| `--cba-bg-secondary` | `#E6DDC6` | `--cba-accent-success` | `#3E6B4F` |
| `--cba-bg-tertiary` | `#D8C3A5` | `--cba-accent-warning` | `#E98074` |
| `--cba-bg-elevated` | `#FBF7ED` | `--cba-accent-danger` | `#B93E36` |
| `--cba-bg-overlay` | `rgba(43, 38, 32, 0.45)` | `--cba-accent-info` | `#56717E` |
| `--cba-text-primary` | `#2B2620` | `--cba-hover` | `rgba(43, 38, 32, 0.06)` |
| `--cba-text-secondary` | `#4A4640` | `--cba-active` | `rgba(43, 38, 32, 0.10)` |
| `--cba-text-muted` | `#625C55` | `--cba-focus-ring` | `0 0 0 3px rgba(232, 90, 79, 0.45)` |
| `--cba-text-inverse` | `#FDFCF8` | `--cba-header-height` | `56px` |
| `--cba-border-subtle` | `#DAD7CA` | `--cba-footer-height` | `64px` |
| `--cba-border-default` | `#A7A6A2` | `--cba-module-header-min-height` | `40px` |
| `--cba-border-strong` | `#8E8D8A` | `--cba-radius-sm` | `6px` |
| `--cba-radius-md` | `10px` | `--cba-shadow-module` | `0 6px 24px rgba(43, 34, 28, 0.18)` |
| `--cba-radius-lg` | `14px` | `--cba-shadow-elevated` | `0 10px 32px rgba(43, 34, 28, 0.26)` |
| `--cba-space-1..8` | `4,8,12,16,20,24,32 px` | | |

---

## 4. Colorimetric Targets (asserted by tests)

Computed in CIELAB D65 (standard sRGB→XYZ→Lab) — matches the Task 1 front-end spec `.kilo/plans/20260806-task1-token-adjustments-frontend-spec.md` §4–§5.

**Lightness (L\*) ordering** (assert no surface inversions):

```
canvas  #C5BFAE  L*≈77.39  (darkest surface)
inset   #D8C3A5  L*≈79.81
panel   #E6DDC6  L*≈88.26
elevated#FBF7ED  L*≈97.29  (lightest surface)
```

**Lightness gaps** (regression thresholds — chosen with margin below spec values):

| Pair | Spec ΔL* | Assertion threshold |
|------|----------|---------------------|
| canvas → panel | 10.87 | `>= 8` |
| panel → elevated | 9.03 | `>= 8` ← **key Task 1 fix** |
| panel → inset | 8.45 | `>= 6` |
| elevated → inset | 17.48 | `>= 8` |

**WCAG AA contrast pairs — must PASS (>= 4.5:1):**

| Text | Background | Spec ratio |
|------|-----------|-----------|
| `--cba-text-primary` `#2B2620` | `--cba-bg-secondary` `#E6DDC6` (panel) | ≈11.08 |
| `--cba-text-primary` `#2B2620` | `--cba-bg-elevated` `#FBF7ED` | ≈14.01 |
| `--cba-text-primary` `#2B2620` | `--cba-bg-primary` `#C5BFAE` (canvas) | high |
| `--cba-text-primary` `#2B2620` | `--cba-bg-tertiary` `#D8C3A5` (inset) | high |
| `--cba-text-secondary` `#4A4640` | `--cba-bg-secondary` `#E6DDC6` | ≈6.93 |
| `--cba-text-secondary` `#4A4640` | `--cba-bg-elevated` `#FBF7ED` | ≈8.76 |
| `--cba-text-secondary` `#4A4640` | `--cba-bg-primary` `#C5BFAE` | pass |
| `--cba-text-secondary` `#4A4640` | `--cba-bg-tertiary` `#D8C3A5` | pass |
| `--cba-text-muted` `#625C55` | `--cba-bg-secondary` `#E6DDC6` | ≈4.88 |
| `--cba-text-muted` `#625C55` | `--cba-bg-elevated` `#FBF7ED` | ≈6.17 |
| `--cba-text-inverse` `#FDFCF8` | `--cba-accent-primary` `#6B5B4F` | ≈6.32 |

**Restricted pairs — must FAIL (< 4.5:1)** (documented exception — guards the rule):

| Text | Background | Spec ratio |
|------|-----------|-----------|
| `--cba-text-muted` `#625C55` | `--cba-bg-primary` `#C5BFAE` (canvas) | ≈3.60 |
| `--cba-text-muted` `#625C55` | `--cba-bg-tertiary` `#D8C3A5` (inset) | ≈3.86 |

---

## 5. File Inventory

All paths are relative to project root `C:\projects\cobranza-app\front\ui`.

### 5.1 New test helpers — `src/components/testing/`

| File | Purpose | Approx lines |
|------|---------|---------------|
| `src/components/testing/color-math.ts` | Pure WCAG + CIELAB math: `parseHex`, `relativeLuminance`, `contrastRatio`, `srgbToLab`, `lightnessGap`, `deltaE`. All functions ≤2 params. | ~70 |
| `src/components/testing/project-files.ts` | `readProjectText(relativePath: string): string` (Node `fs`/`path`, rooted at `process.cwd()`). Single-responsibility IO. | ~15 |
| `src/components/testing/scss-tokens.ts` | `parseScssVariables(text: string): Map<string,string>` (regex over `--cba-*: value;`), `loadScssVariables(): Map`. Works on both `.scss` and compressed `.css` `:root` blocks. | ~35 |
| `src/components/testing/html-loader.ts` | `parseHtmlDocument(html: string): HTMLElement` (jsdom `document.createElement('div')` + `innerHTML`). | ~12 |
| `src/components/testing/markdown-headings.ts` | `extractMarkdownHeadings(text: string): string[]` (regex `^#{1,6}\s+(.+)$`). | ~15 |
| `src/components/testing/theme-fixtures.ts` | Canonical `EXPECTED_TOKENS` map, file path constants, contrast-pair table, surface table. Test data only. | ~90 |

### 5.2 New spec files — `src/theme/`

| File | What it tests | Approx lines |
|------|---------------|---------------|
| `src/theme/tokens.spec.ts` | Every `--cba-*` in `_variables.scss` equals `EXPECTED_TOKENS`; no missing/extra tokens. | ~70 |
| `src/theme/contrast.spec.ts` | All "pass" contrast pairs >= 4.5:1; both restricted pairs < 4.5:1. | ~70 |
| `src/theme/surfaces.spec.ts` | Four-surface L* ordering (canvas<inset<panel<elevated); lightness-gap thresholds per §4. | ~70 |
| `src/theme/preview-html.spec.ts` | Preview HTML structure (required IDs, linked CSS, TOKEN_ROLES consistency, muted callouts); compiled `docs/theme-preview.css` `:root` matches canonical tokens. | ~110 |
| `src/theme/consumer-guide.spec.ts` | `docs/CONSUMER_GUIDE.md` retains mandated section headings (Task 3). | ~55 |

**Total:** 6 helpers + 5 specs = 11 new files. Each well under the 200-line `src/` cap and the 125-ideal target; every method ≤50 lines; every function ≤2 params.

### 5.3 Files NOT modified

- `jest.config.js`, `tsconfig.spec.json`, `setup-jest.ts`, `package.json` — unchanged.
- All `src/theme/*.scss`, `docs/*`, `.agent/*` — unchanged.
- `.agent/project-structure.md` — no NEW folder is created (files only added to existing `src/components/testing/` and `src/theme/` folders, which are already documented), so no structure-doc update is required. (If the structure rule is read strictly to require folder-content accuracy, the existing `src/components/testing/` entry simply covers the added helpers and the `src/theme/` entry covers the added specs — no edits.)

---

## 6. Detailed Implementation Steps

> Implementer (Step 4.2): create files in the order below. Run `npm test` after each spec to catch regressions early. Commit at the marked commit points. Verify each new file stays within `max-lines-per-file` (200 / ideal 125), `max-lines-per-method` (50), `max-depth` (2), and `max-arguments-per-method` (2).

### Step 6.1 — `src/components/testing/project-files.ts`

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Reads a project file as UTF-8 text. `relativePath` is from project root (process.cwd()). */
export function readProjectText(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}
```

Assertion: file compiles under ts-jest; imported by other helpers.

### Step 6.2 — `src/components/testing/color-math.ts`

Pure, deterministic. `Rgb` = `{ r: number; g: number; b: number }` with channels normalized to 0..1. `Lab` = `{ L: number; a: number; b: number }`.

```ts
export interface Rgb { r: number; g: number; b: number; }
export interface Lab { L: number; a: number; b: number; }

const NAMED: Record<string, string> = {}; // reserved for future named colors; none needed now

export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const value = parseInt(full, 16);
  return {
    r: ((value >> 16) & 0xff) / 255,
    g: ((value >> 8) & 0xff) / 255,
    b: (value & 0xff) / 255,
  };
}

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG 2.1 contrast ratio between two hex colours. Order-independent. */
export function contrastRatio(foreground: string, background: string): number {
  const lFg = relativeLuminance(foreground);
  const lBg = relativeLuminance(background);
  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  return (lighter + 0.05) / (darker + 0.05);
}

function srgbToXyz(hex: string): { x: number; y: number; z: number } {
  const { r, g, b } = parseHex(hex);
  const R = linearize(r), G = linearize(g), B = linearize(b);
  return {
    x: 0.4124 * R + 0.3576 * G + 0.1805 * B,
    y: 0.2126 * R + 0.7152 * G + 0.0722 * B,
    z: 0.0193 * R + 0.1192 * G + 0.9505 * B,
  };
}

/** CIELAB (D65). Used for lightness-gap and ΔE assertions. */
export function srgbToLab(hex: string): Lab {
  const Xn = 0.95047, Yn = 1.0, Zn = 1.08883;
  const { x, y, z } = srgbToXyz(hex);
  const f = (t: number): number =>
    t > Math.cbrt(216 / 24389) ? Math.cbrt(t) : (841 / 108) * t + 16 / 116;
  const fx = f(x / Xn), fy = f(y / Yn), fz = f(z / Zn);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function lightnessGap(hexA: string, hexB: string): number {
  return Math.abs(srgbToLab(hexA).L - srgbToLab(hexB).L);
}

export function deltaE(hexA: string, hexB: string): number {
  const a = srgbToLab(hexA);
  const b = srgbToLab(hexB);
  return Math.sqrt((a.L - b.L) ** 2 + (a.a - b.a) ** 2 + (a.b - b.b) ** 2);
}
```

> Note: `NAMED` placeholder above should be omitted by the implementer (kept out to avoid no-commented-code / unused-symbol lint). Function count: 6 exported + 2 internal = 8. Each ≤2 params, each well under 50 lines. File ~70 lines.

### Step 6.3 — `src/components/testing/scss-tokens.ts`

```ts
import { readProjectText } from './project-files';
import { Map } from 'node:internal'; // do NOT import — Map is global

const TOKEN_PATTERN = /(--cba-[a-z-]+)\s*:\s*([^;]+);/g;

/** Parses `:root{ --cba-*: value; ... }` blocks from SCSS or compiled CSS text. */
export function parseScssVariables(text: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    result.set(match[1], match[2].trim());
  }
  return result;
}

/** Loads and parses src/theme/_variables.scss into a token→value map. */
export function loadScssVariables(): Map<string, string> {
  return parseScssVariables(readProjectText('src/theme/_variables.scss'));
}
```

> Implementer: drop the bogus `import { Map }` line in the final file (it is invalid) — `Map` is a global. Pattern matches both multi-line `.scss` and the compressed single-line `docs/theme-preview.css` `:root` because both use `--name: value;` separators. ~20 lines.

### Step 6.4 — `src/components/testing/html-loader.ts`

```ts
/** Parses an HTML string into a detached root HTMLElement using the jsdom global `document`. */
export function parseHtmlDocument(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}
```

### Step 6.5 — `src/components/testing/markdown-headings.ts`

```ts
const HEADING_PATTERN = /^#{1,6}\s+(.+?)\s*$/;

/** Extracts ATX markdown heading texts (without the leading # markers). */
export function extractMarkdownHeadings(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.match(HEADING_PATTERN))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => match[1]);
}
```

### Step 6.6 — `src/components/testing/theme-fixtures.ts`

Canonical expected token map + derived tables. Implementer must type the object `Record<string, string>`. Keep entries aligned with §3 of this plan (every token in `_variables.scss`).

```ts
export const EXPECTED_TOKENS: Record<string, string> = {
  '--cba-bg-primary': '#C5BFAE',
  '--cba-bg-secondary': '#E6DDC6',
  '--cba-bg-tertiary': '#D8C3A5',
  '--cba-bg-elevated': '#FBF7ED',
  '--cba-bg-overlay': 'rgba(43, 38, 32, 0.45)',
  '--cba-text-primary': '#2B2620',
  '--cba-text-secondary': '#4A4640',
  '--cba-text-muted': '#625C55',
  '--cba-text-inverse': '#FDFCF8',
  '--cba-border-subtle': '#DAD7CA',
  '--cba-border-default': '#A7A6A2',
  '--cba-border-strong': '#8E8D8A',
  '--cba-accent-primary': '#6B5B4F',
  '--cba-accent-success': '#3E6B4F',
  '--cba-accent-warning': '#E98074',
  '--cba-accent-danger': '#B93E36',
  '--cba-accent-info': '#56717E',
  '--cba-hover': 'rgba(43, 38, 32, 0.06)',
  '--cba-active': 'rgba(43, 38, 32, 0.10)',
  '--cba-focus-ring': '0 0 0 3px rgba(232, 90, 79, 0.45)',
  '--cba-header-height': '56px',
  '--cba-footer-height': '64px',
  '--cba-module-header-min-height': '40px',
  '--cba-radius-sm': '6px',
  '--cba-radius-md': '10px',
  '--cba-radius-lg': '14px',
  '--cba-shadow-module': '0 6px 24px rgba(43, 34, 28, 0.18)',
  '--cba-shadow-elevated': '0 10px 32px rgba(43, 34, 28, 0.26)',
  '--cba-space-1': '4px',
  '--cba-space-2': '8px',
  '--cba-space-3': '12px',
  '--cba-space-4': '16px',
  '--cba-space-5': '20px',
  '--cba-space-6': '24px',
  '--cba-space-8': '32px',
};

export const SCSS_VARIABLES_PATH = 'src/theme/_variables.scss';
export const PREVIEW_HTML_PATH = 'docs/theme-preview.html';
export const PREVIEW_CSS_PATH = 'docs/theme-preview.css';
export const CONSUMER_GUIDE_PATH = 'docs/CONSUMER_GUIDE.md';

export interface ContrastPair {
  name: string;
  text: string;
  background: string;
  mustPass: boolean;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { name: 'text-primary on panel',           text: '#2B2620', background: '#E6DDC6', mustPass: true },
  { name: 'text-primary on elevated',         text: '#2B2620', background: '#FBF7ED', mustPass: true },
  { name: 'text-primary on canvas',           text: '#2B2620', background: '#C5BFAE', mustPass: true },
  { name: 'text-primary on inset',            text: '#2B2620', background: '#D8C3A5', mustPass: true },
  { name: 'text-secondary on panel',          text: '#4A4640', background: '#E6DDC6', mustPass: true },
  { name: 'text-secondary on elevated',       text: '#4A4640', background: '#FBF7ED', mustPass: true },
  { name: 'text-secondary on canvas',         text: '#4A4640', background: '#C5BFAE', mustPass: true },
  { name: 'text-secondary on inset',          text: '#4A4640', background: '#D8C3A5', mustPass: true },
  { name: 'text-muted on panel',              text: '#625C55', background: '#E6DDC6', mustPass: true },
  { name: 'text-muted on elevated',           text: '#625C55', background: '#FBF7ED', mustPass: true },
  { name: 'text-inverse on accent-primary',  text: '#FDFCF8', background: '#6B5B4F', mustPass: true },
  { name: 'text-muted on canvas (restricted)', text: '#625C55', background: '#C5BFAE', mustPass: false },
  { name: 'text-muted on inset (restricted)',  text: '#625C55', background: '#D8C3A5', mustPass: false },
];

export interface SurfaceGap {
  name: string;
  lower: string;
  higher: string;
  minGap: number;
}

export const SURFACE_GAPS: SurfaceGap[] = [
  { name: 'canvas to panel',     lower: '#C5BFAE', higher: '#E6DDC6', minGap: 8 },
  { name: 'panel to elevated',   lower: '#E6DDC6', higher: '#FBF7ED', minGap: 8 },
  { name: 'panel to inset',      lower: '#D8C3A5', higher: '#E6DDC6', minGap: 6 },
  { name: 'elevated to inset',   lower: '#D8C3A5', higher: '#FBF7ED', minGap: 8 },
];

export const SURFACE_LIGHTNESS_ORDER = [
  { token: 'canvas',  hex: '#C5BFAE' },
  { token: 'inset',   hex: '#D8C3A5' },
  { token: 'panel',   hex: '#E6DDC6' },
  { token: 'elevated',hex: '#FBF7ED' },
];
```

> ~95 lines total. `ContrastPair`/`SurfaceGap` interfaces placed in the same file (small, cohesive) — acceptable under `max-arguments-per-method` since they are typed param objects, exactly as the rule encourages.

---

### Step 6.7 — `src/theme/tokens.spec.ts`

Asserts the SCSS source of truth equals the canonical fixture map.

```ts
import { loadScssVariables } from '../components/testing/scss-tokens';
import { EXPECTED_TOKENS, SCSS_VARIABLES_PATH } from '../components/testing/theme-fixtures';
import { readProjectText } from '../components/testing/project-files';

describe('theme tokens (src/theme/_variables.scss)', () => {
  const tokens = loadScssVariables();

  it('parses the variables file from ' + SCSS_VARIABLES_PATH, () => {
    expect(tokens.size).toBeGreaterThan(0);
  });

  it('contains every expected token', () => {
    for (const name of Object.keys(EXPECTED_TOKENS)) {
      expect(tokens.has(name)).toBe(true);
    }
  });

  it('matches the canonical value for every expected token', () => {
    for (const [name, value] of Object.entries(EXPECTED_TOKENS)) {
      expect(tokens.get(name)).toBe(value);
    }
  });

  it('introduces no unexpected --cba-* token', () => {
    const expectedNames = new Set(Object.keys(EXPECTED_TOKENS));
    for (const name of tokens.keys()) {
      expect(expectedNames.has(name)).toBe(true);
    }
  });

  it('keeps the file as a :root block (regression guard)', () => {
    const raw = readProjectText(SCSS_VARIABLES_PATH);
    expect(raw).toContain(':root');
  });
});
```

Expected assertions: 5 `it` blocks; the loop-based ones assert all ~30 tokens each. ~40 lines.

### Step 6.8 — `src/theme/contrast.spec.ts`

```ts
import { contrastRatio } from '../components/testing/color-math';
import { CONTRAST_PAIRS } from '../components/testing/theme-fixtures';

const AA_THRESHOLD = 4.5;

describe('WCAG AA contrast regression', () => {
  describe('intended pairs must pass AA (>= 4.5:1)', () => {
    const passing = CONTRAST_PAIRS.filter((pair) => pair.mustPass);
    for (const pair of passing) {
      it(`${pair.name}: ${pair.text} on ${pair.background}`, () => {
        expect(contrastRatio(pair.text, pair.background)).toBeGreaterThanOrEqual(AA_THRESHOLD);
      });
    }
  });

  describe('restricted muted pairs must fail AA (< 4.5:1) — documented exception', () => {
    const restricted = CONTRAST_PAIRS.filter((pair) => !pair.mustPass);
    for (const pair of restricted) {
      it(`${pair.name}: ${pair.text} on ${pair.background}`, () => {
        expect(contrastRatio(pair.text, pair.background)).toBeLessThan(AA_THRESHOLD);
      });
    }
  });
});
```

Assertion count: 11 pass + 2 restricted = 13 `it`. ~30 lines (data in fixtures). Each ≤2 params.

### Step 6.9 — `src/theme/surfaces.spec.ts`

```ts
import { lightnessGap, srgbToLab } from '../components/testing/color-math';
import { SURFACE_GAPS, SURFACE_LIGHTNESS_ORDER } from '../components/testing/theme-fixtures';

describe('surface lightness hierarchy', () => {
  describe('lightness gaps meet thresholds', () => {
    for (const gap of SURFACE_GAPS) {
      it(`${gap.name} ΔL* >= ${gap.minGap}`, () => {
        expect(lightnessGap(gap.lower, gap.higher)).toBeGreaterThanOrEqual(gap.minGap);
      });
    }
  });

  it('four surfaces are ordered canvas < inset < panel < elevated by L*', () => {
    const lightness = SURFACE_LIGHTNESS_ORDER.map((s) => srgbToLab(s.hex).L);
    for (let i = 1; i < lightness.length; i += 1) {
      expect(lightness[i]).toBeGreaterThan(lightness[i - 1]);
    }
  });

  it('elevated is the lightest and canvas is the darkest surface', () => {
    const lightness = SURFACE_LIGHTNESS_ORDER.map((s) => srgbToLab(s.hex).L);
    const first = SURFACE_LIGHTNESS_ORDER[0].token;
    const last = SURFACE_LIGHTNESS_ORDER[SURFACE_LIGHTNESS_ORDER.length - 1].token;
    expect(first).toBe('canvas');
    expect(last).toBe('elevated');
    expect(Math.min(...lightness)).toBe(lightness[0]);
    expect(Math.max(...lightness)).toBe(lightness[lightness.length - 1]);
  });
});
```

Assertion count: 4 gap `it` + 2 ordering `it` = 6. ~40 lines. The `for` loop is single-level (depth ≤2). The `i` loop uses `i += 1` and `length` to keep readable.

### Step 6.10 — `src/theme/preview-html.spec.ts`

Reads `docs/theme-preview.html` (via `readProjectText`) and `docs/theme-preview.css`. Parses both. Structured assertions.

Required element IDs present: `swatchGrid`, `buttonMatrix`, `textGrid`, `accentRow`, `rawStrip`. Required link to compiled CSS. `TOKEN_ROLES` array's hex values must equal canonical token values. The muted-restriction callout must be rendered for `canvas` and `inset` (the `TEXT_SAMPLES` entries with `mutedNote:true`). Compiled `theme-preview.css` `:root` must match canonical token values (drift guard).

```ts
import { readProjectText } from '../components/testing/project-files';
import { parseHtmlDocument } from '../components/testing/html-loader';
import { parseScssVariables } from '../components/testing/scss-tokens';
import {
  EXPECTED_TOKENS,
  PREVIEW_HTML_PATH,
  PREVIEW_CSS_PATH,
} from '../components/testing/theme-fixtures';

const REQUIRED_IDS = ['swatchGrid', 'buttonMatrix', 'textGrid', 'accentRow', 'rawStrip'];

// Maps the preview TOKEN_ROLES swatch label → --cba-* token name (mirrors docs/theme-preview.html).
const SWATCH_ROLE_TOKEN: Record<string, string> = {
  canvas: '--cba-bg-primary',
  panel: '--cba-bg-secondary',
  elevated: '--cba-bg-elevated',
  inset: '--cba-bg-tertiary',
  text: '--cba-text-primary',
  border: '--cba-border-default',
  accent: '--cba-accent-primary',
  warning: '--cba-accent-warning',
  danger: '--cba-accent-danger',
};

describe('docs/theme-preview.html structure', () => {
  const html = readProjectText(PREVIEW_HTML_PATH);
  const root = parseHtmlDocument(html);

  it('links the compiled theme CSS (theme-preview.css)', () => {
    const link = root.querySelector('link[rel="stylesheet"][href="theme-preview.css"]');
    expect(link).not.toBeNull();
  });

  it('has the Cobranza UI title', () => {
    expect(root.querySelector('title')?.textContent).toContain('Cobranza UI');
  });

  describe('required structural sections exist', () => {
    for (const id of REQUIRED_IDS) {
      it(`has #${id}`, () => {
        expect(root.querySelector(`#${id}`)).not.toBeNull();
      });
    }
  });

  it('renders token swatch sections for all 9 roles', () => {
    const htmlLower = html;
    for (const role of Object.keys(SWATCH_ROLE_TOKEN)) {
      expect(htmlLower).toContain(role);
    }
  });

  it('TOKEN_ROLES hex values match canonical token values', () => {
    const css = readProjectText(PREVIEW_CSS_PATH);
    const cssVars = parseScssVariables(css);
    for (const [role, token] of Object.entries(SWATCH_ROLE_TOKEN)) {
      const canonical = EXPECTED_TOKENS[token];
      expect(cssVars.get(token)).toBe(canonical);
      // The preview HTML embeds the role's hex in TOKEN_ROLES; ensure it does not contradict the canonical value.
      expect(html).toContain(canonical);
    }
  });

  it('declares the muted-text restriction for canvas and inset via TEXT_SAMPLES', () => {
    // TEXT_SAMPLES marks canvas and inset with mutedNote:true; the rendered callout text is:
    expect(html).toContain('t-callout');
    expect(html).toContain('restricted') /* English + Spanish fallback */
      .toBe(true); // placeholder; see note
  });

  it('inline preview style uses var(--cba-bg-primary), not a hard-coded canvas hex', () => {
    expect(html).toContain('var(--cba-bg-primary)');
  });
});

describe('docs/theme-preview.css :root matches canonical tokens', () => {
  const cssVars = parseScssVariables(readProjectText(PREVIEW_CSS_PATH));

  it('contains every expected --cba-* token', () => {
    for (const name of Object.keys(EXPECTED_TOKENS)) {
      expect(cssVars.has(name)).toBe(true);
    }
  });

  it('matches canonical values for every expected token', () => {
    for (const [name, value] of Object.entries(EXPECTED_TOKENS)) {
      expect(cssVars.get(name)).toBe(value);
    }
  });
});
```

> Implementer corrections required for the placeholder `muted-callout` `it`:
> - Replace the bogus `.toBe(true)` placeholder. The preview's callout copy is Spanish: `"--cba-text-muted restringido aquí (WCAG AA). Usar --cba-text-secondary."` and the label `mutedNote:true`. Assert the presence of the literal callout substring AND that the `TEXT_SAMPLES` source fragment includes `mutedNote:true` (for canvas and inset) and `muted:false` (for panel/elevated). Final assertion body:
>   ```ts
>   it('declares the muted-text restriction for canvas and inset via TEXT_SAMPLES', () => {
>     expect(html).toContain('mutedNote:true');       // canvas + inset
>     expect(html).toContain('muted:false');           // panel + elevated
>     expect(html).toContain('--cba-text-muted restringido');
>   });
>   ```
> - Remove the unused `htmlLower` alias (rename to `html`) to avoid lint.
> - Drop the `SWATCH_ROLE_TOKEN` `html` membership check is fine; keep file under 125 ideal lines by extracting `SWATCH_ROLE_TOKEN` into `theme-fixtures.ts` if line count creeps up. If extracted, add it to `theme-fixtures.ts` and import here.

Assertion count: ~18 `it` (5 IDs + 8 structure + 5 hex/structure + 2 css). ~85 lines after corrections — still under 125 ideal and well under 200 cap.

### Step 6.11 — `src/theme/consumer-guide.spec.ts`

Guards Task 3's mandated sections. Reads `docs/CONSUMER_GUIDE.md`, extracts headings, asserts the key AI-agent sections exist.

```ts
import { readProjectText } from '../components/testing/project-files';
import { extractMarkdownHeadings } from '../components/testing/markdown-headings';
import { CONSUMER_GUIDE_PATH } from '../components/testing/theme-fixtures';

const REQUIRED_SECTIONS = [
  'Token Compliance Mandate',
  'Theme load (once)',
  'Surface ownership map',
  'Button Color Guide',
  'Surface Decision Tree',
  'Text Color Rules',
  'Bar and Chrome Guide',
  'Shell checklist',
  'MFE checklist',
  'Anti-patterns',
  'Quick verify',
];

describe('docs/CONSUMER_GUIDE.md mandated sections', () => {
  const headings = extractMarkdownHeadings(readProjectText(CONSUMER_GUIDE_PATH));

  it('parses at least one heading', () => {
    expect(headings.length).toBeGreaterThan(0);
  });

  for (const section of REQUIRED_SECTIONS) {
    it(`contains section "${section}"`, () => {
      const found = headings.some((h) => h.includes(section));
      expect(found).toBe(true);
    });
  });
});
```

Assertion count: 1 + 11 = 12 `it`. ~40 lines. `extractMarkdownHeadings` returns heading text without `#` markers; `h.includes(section)` toler trailing label variants. If a section heading contains extra words, `includes` still matches.

---

## 7. Git Commit Plan

Branch `feat/theme-refinement-tokens-preview-guide` already contains Tasks 1–3. Step 4.2 commits on top of it. Suggested logical commits (implementer may combine adjacent groups but each commit must be self-contained and `npm test` must be green before committing):

1. `test(theme): add color-math and project-file test helpers` — files: `project-files.ts`, `color-math.ts`.
2. `test(theme): add scss/html/markdown token loaders and theme fixtures` — files: `scss-tokens.ts`, `html-loader.ts`, `markdown-headings.ts`, `theme-fixtures.ts`.
3. `test(theme): assert canonical token values from _variables.scss` — file: `tokens.spec.ts`.
4. `test(theme): assert WCAG AA contrast and surface lightness hierarchy` — files: `contrast.spec.ts`, `surfaces.spec.ts`.
5. `test(theme): assert preview HTML structure and compiled CSS token consistency` — file: `preview-html.spec.ts`.
6. `test(theme): assert consumer guide mandated sections` — file: `consumer-guide.spec.ts`.

Before every commit, run `git status` and follow `.kilo/rules/gitignore-compliance.md` — never stage `node_modules/`, `dist/`, or any gitignored path. Only stage the new `src/components/testing/*.ts` and `src/theme/*.spec.ts` files.

---

## 8. Verification Steps (must pass before Step 4.3)

1. `npm test` — Jest runs all specs (new + existing 16 component specs). Expected: all green, no failures, no skipped. Pay attention to the new `tokens`, `contrast`, `surfaces`, `preview-html`, `consumer-guide` describe blocks.
2. Optional but recommended: `npm run lint` — ESLint on the new `.ts` files (and confirm no unused imports such as the placeholder ones flagged in §6.10/§6.6 corrections).
3. `git status` — confirm only the 11 new files are staged at the final commit, nothing else.
4. Sanity: token-value tests are the strictest guard; if `npm test` shows a tokens mismatch, the implementer must NOT "fix" it by editing tokens — that means a regression was introduced and must be escalated to the Plan Agent.

If `npm test` fails for a legitimately drifting value (e.g. `docs/theme-preview.css` was never rebuilt after a token change introduced between Steps 4.2 tasks), the implementer must run `npm run build:preview` to regenerate `docs/theme-preview.css`, then re-run `npm test`. This rebuild is allowed ONLY for the preview CSS drift case and is the explicit purpose of the drift-guard test; it does NOT modify tokens.

---

## 9. Plan Adherence to Original Task

Original task (TODO line 19): *"for all previous tasks, where possible, implement regressions tests."*

| Prior task | Regression coverage in this plan | "where possible" note |
|-----------|----------------------------------|----------------------|
| Task 1 — token adjustments | `tokens.spec.ts` (value equality + no rename via name set), `surfaces.spec.ts` (lightness gaps + ordering), `contrast.spec.ts` (WCAG AA + restricted pairs) | Deterministic via SCSS source parse + pure math. |
| Task 2 — preview HTML | `preview-html.spec.ts` (required sections, TOKEN_ROLES consistency, compiled-CSS `:root` drift guard) | HTML is static, parseable in jsdom. |
| Task 3 — consumer guide | `consumer-guide.spec.ts` (mandated section headings exist) | Markdown is static text; structural assertion is the feasible deterministic test. |

No token values are changed, no tokens are renamed, tests are deterministic and run in jsdom/Node (no browser), file/line/param/depth rules are respected, and the plan is stored at `.kilo/plans/20260806-task4-regression-tests.md`.

---

## 10. Summary for the Implementer (Step 4.2)

- Create 6 helper files in `src/components/testing/` and 5 spec files in `src/theme/` exactly as specified in §6.
- Apply the explicit corrections called out in §6.6 (drop bogus `Map` import), §6.10 (fix the muted-callout assertion; drop unused alias), and throughout (do not leave placeholder/unused symbols — `no-commented-code` rule).
- Keep every file ≤200 lines (ideal ≤125), every method ≤50 lines, every function ≤2 params, max nesting depth ≤2.
- Do NOT modify any non-test file, do NOT change token values, do NOT touch Jest/TS config.
- Commit per §7. Run `npm test` (and optionally `npm run lint`) per §8 before each commit and at the end.
- Report exactly: which files were created, total passing test count, and confirm `npm test` is green.