/**
 * @file tokens.spec.ts — Regression tests for theme token values.
 *
 * Verifies that every `--cba-*` token in `src/theme/_variables.scss` matches the
 * canonical name set and hex values defined in `src/components/testing/theme-fixtures.ts`.
 * Also guards the `:root` block structure of the variables file.
 *
 * Run: `npm test -- src/theme/tokens.spec.ts`
 *
 * Authoritative sources:
 * - Token values: {@link file:///src/theme/_variables.scss}
 * - Expected tokens fixture: {@link file:///src/components/testing/theme-fixtures.ts}
 * - Design tokens spec: {@link file:///.agent/project-info/brief.md} §5
 */

import { loadScssVariables } from '../components/testing/scss-tokens';
import { EXPECTED_TOKENS, SCSS_VARIABLES_PATH } from '../components/testing/theme-fixtures';
import { readProjectText } from '../components/testing/project-files';

describe('theme tokens (src/theme/_variables.scss)', () => {
  const tokens = loadScssVariables();

  it('parses the variables file from ' + SCSS_VARIABLES_PATH, () => {
    expect(tokens.size).toBeGreaterThan(0);
  });

  it('has exactly the expected --cba-* tokens', () => {
    expect(new Set(tokens.keys())).toEqual(new Set(Object.keys(EXPECTED_TOKENS)));
  });

  it('matches the canonical value for every expected token', () => {
    for (const [name, value] of Object.entries(EXPECTED_TOKENS)) {
      expect(tokens.get(name)).toBe(value);
    }
  });

  it('keeps the file as a :root block (regression guard)', () => {
    const raw = readProjectText(SCSS_VARIABLES_PATH);
    expect(raw).toContain(':root');
  });
});
