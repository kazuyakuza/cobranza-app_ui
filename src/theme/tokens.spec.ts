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
