/**
 * @file demo-token-compliance.spec.ts — Guards that the demo app consumes only
 *   `@cobranza-apps/ui` tokens and components: no hard-coded hex colors, no px
 *   font-size declarations, no px spacing (padding/margin/gap) declarations, and
 *   no UI component imports from external UI libraries.
 *
 * Allowed px: `1px` borders (and any `border` / `border-bottom` 1px usage),
 * plus demo-specific layout dimensions (width/min-width/max-width/min-height/
 * grid minmax) and border-radius — these have no `--cba-*` token equivalents.
 *
 * Run: `npm test -- projects/demo/src/app/demo-token-compliance.spec.ts`
 *
 * Authoritative sources:
 * - Design tokens: {@link file:///src/theme/_variables.scss}
 * - Brief: {@link file:///.agent/project-info/brief.md} §5
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const DEMO_APP_DIR = resolve(process.cwd(), 'projects/demo/src/app');
const DEMO_SCSS_DIR = join(DEMO_APP_DIR, 'components');

/** Absolute paths of every `*.scss` file under the demo components directory. */
function readDemoScssFiles(): string[] {
  return readdirSync(DEMO_SCSS_DIR, { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string')
    .filter((entry) => entry.endsWith('.scss'))
    .map((entry) => join(DEMO_SCSS_DIR, entry));
}

/** Absolute paths of every `*.ts` file under the demo app directory. */
function readDemoTsFiles(): string[] {
  return readdirSync(DEMO_APP_DIR, { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string')
    .filter((entry) => entry.endsWith('.ts'))
    .map((entry) => join(DEMO_APP_DIR, entry));
}

describe('demo app token compliance', () => {
  const scssFiles = readDemoScssFiles();

  it('discovers at least one demo SCSS file to audit', () => {
    expect(scssFiles.length).toBeGreaterThan(0);
  });

  for (const file of scssFiles) {
    const relPath = relative(process.cwd(), file);
    const source = readFileSync(file, 'utf8');

    it(`${relPath} has no hard-coded hex color literals`, () => {
      const hexColorPattern = /#[0-9a-fA-F]{3,8}\b/;
      expect(hexColorPattern.test(source)).toBe(false);
    });

    it(`${relPath} has no px font-size declarations`, () => {
      const pxFontSizePattern = /font-size\s*:[^;}]*\d+px/i;
      expect(pxFontSizePattern.test(source)).toBe(false);
    });

    it(`${relPath} has no px spacing declarations (padding/margin/gap)`, () => {
      const pxSpacingPattern = /(padding|margin|gap)\s*:[^;}]*\d+px/i;
      expect(pxSpacingPattern.test(source)).toBe(false);
    });
  }

  describe('demo TS imports resolve UI components from @cobranza-apps/ui only', () => {
    const tsFiles = readDemoTsFiles();
    const externalUiLibPattern = /from\s+['"]@(angular\/material|primeng|ngx-bootstrap|ng-zorro|ng2)[^'"]*['"]/;

    for (const file of tsFiles) {
      const relPath = relative(process.cwd(), file);
      const source = readFileSync(file, 'utf8');

      it(`${relPath} imports no external UI library`, () => {
        expect(externalUiLibPattern.test(source)).toBe(false);
      });
    }
  });
});
