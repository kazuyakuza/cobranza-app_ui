import { readProjectText } from '../components/testing/project-files';
import { extractTokenRoles, parseHtmlDocument } from '../components/testing/html-loader';
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

  it('renders token swatch labels for all 9 roles', () => {
    for (const role of Object.keys(SWATCH_ROLE_TOKEN)) {
      expect(html).toContain(role);
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
