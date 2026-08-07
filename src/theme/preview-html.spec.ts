/**
 * @file preview-html.spec.ts — Regression tests for the theme preview HTML and CSS.
 *
 * Verifies that `docs/theme-preview.html` links the compiled CSS, contains all required
 * structural sections (swatch grid, button matrix, text grid, accent row, raw strip),
 * renders 9 token swatch labels, maps TOKEN_ROLES to canonical hex values, declares the
 * muted-text restriction, and uses `var(--cba-*)` tokens instead of hard-coded hex.
 * Also verifies that `docs/theme-preview.css` `:root` matches canonical token values.
 *
 * Run: `npm test -- src/theme/preview-html.spec.ts`
 *
 * Authoritative sources:
 * - Preview HTML: {@link file:///docs/theme-preview.html}
 * - Preview CSS: {@link file:///docs/theme-preview.css}
 * - Token values: {@link file:///src/theme/_variables.scss}
 * - Expected tokens fixture: {@link file:///src/components/testing/theme-fixtures.ts}
 */

import { readProjectText } from '../components/testing/project-files';
import { extractTokenRoles, parseHtmlDocument } from '../components/testing/html-loader';
import { parseScssVariables } from '../components/testing/scss-tokens';
import {
  EXPECTED_TOKENS,
  PREVIEW_HTML_PATH,
  PREVIEW_CSS_PATH,
} from '../components/testing/theme-fixtures';

function parseAlpha(rgba: string): number {
  const match = rgba.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
  return match ? Number(match[1]) : NaN;
}

const html = readProjectText(PREVIEW_HTML_PATH);
const root = parseHtmlDocument(html);
const css = readProjectText(PREVIEW_CSS_PATH);

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

  it('TOKEN_ROLES array maps every role to the correct token and canonical hex', () => {
    const roles = extractTokenRoles(html);
    expect(roles.length).toBe(Object.keys(SWATCH_ROLE_TOKEN).length);
    for (const [role, token, hex] of roles) {
      expect(SWATCH_ROLE_TOKEN[role]).toBe(token);
      expect(EXPECTED_TOKENS[token]).toBe(hex);
    }
  });

  it('declares the muted-text restriction for canvas and inset via TEXT_SAMPLES', () => {
    expect(html).toContain('mutedNote:true');
    expect(html).toContain('muted:false');
    expect(html).toContain('--cba-text-muted restringido');
  });

  it('inline preview style uses var(--cba-bg-primary), not a hard-coded canvas hex', () => {
    expect(html).toContain('var(--cba-bg-primary)');
  });
});

describe('docs/theme-preview.css :root matches canonical tokens', () => {
  const cssVars = parseScssVariables(css);

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

describe('docs/theme-preview.html readability fixes', () => {
  it('token labels use --cba-text-secondary at 11px', () => {
    expect(html).toContain('.t-row .tok{font-family:ui-monospace,monospace;font-size:11px;color:var(--cba-text-secondary)}');
  });

  it('token rows use 13px and weight 500', () => {
    expect(html).toContain('.t-row{font-size:13px;font-weight:500;margin-bottom:4px}');
  });

  it('warning callout uses solid accent bg with inverse text', () => {
    expect(html).toContain('background:var(--cba-accent-warning)');
    expect(html).toContain('color:var(--cba-text-inverse)');
    expect(html).toContain('.t-callout{');
  });

  it('accent pills use solid accent fills with inverse text (no color-mix)', () => {
    expect(html).toContain('style="background:${color}"');
    expect(html).toContain('.accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent;color:var(--cba-text-inverse)}');
  });

  it('shell footer background differs from workspace background', () => {
    const shellFooterElevated = html.includes('.shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-elevated)}');
    const workspaceUsesCanvas = html.includes('.preview{display:flex;flex-direction:column;min-height:100vh;background:var(--cba-bg-primary)');
    expect(shellFooterElevated).toBe(true);
    expect(workspaceUsesCanvas).toBe(true);
  });
});

describe('docs/theme-preview.css interactive state overlay values', () => {
  it.each([
    ['--cba-hover', '--cba-active'],
    ['--cba-hover-inverse', '--cba-active-inverse'],
  ])('%s and %s alphas differ by at least 0.05', (hoverToken, activeToken) => {
    const hoverAlpha = parseAlpha(EXPECTED_TOKENS[hoverToken]);
    const activeAlpha = parseAlpha(EXPECTED_TOKENS[activeToken]);
    expect(activeAlpha - hoverAlpha).toBeGreaterThanOrEqual(0.05);
  });

  it('button component scss references both interaction tokens', () => {
    const buttonScss = readProjectText('src/components/button/cba-button.component.scss');
    expect(buttonScss).toContain('var(--cba-hover)');
    expect(buttonScss).toContain('var(--cba-active)');
  });

  it('button component scss references inverse tokens for solid variants', () => {
    const buttonScss = readProjectText('src/components/button/cba-button.component.scss');
    expect(buttonScss).toContain('var(--cba-hover-inverse)');
    expect(buttonScss).toContain('var(--cba-active-inverse)');
  });

  it('preview button CSS uses inverse overlay for solid variant hover/active', () => {
    const solidHoverRule =
      '.pv-btn--primary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover-inverse),var(--cba-hover-inverse))}';
    const solidActiveRule =
      '.pv-btn--primary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active-inverse),var(--cba-active-inverse))}';
    expect(html).toContain(solidHoverRule);
    expect(html).toContain(solidActiveRule);
  });

  it('preview button CSS keeps dark overlay for secondary hover/active', () => {
    const secondaryHoverRule =
      '.pv-btn--secondary.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}';
    const secondaryActiveRule =
      '.pv-btn--secondary.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}';
    expect(html).toContain(secondaryHoverRule);
    expect(html).toContain(secondaryActiveRule);
  });

  it('compiled preview CSS declares the inverse tokens', () => {
    expect(css).toContain('--cba-hover-inverse');
    expect(css).toContain('--cba-active-inverse');
  });
});
