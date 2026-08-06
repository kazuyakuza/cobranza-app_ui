/**
 * @file contrast.spec.ts — Regression tests for WCAG AA contrast ratios.
 *
 * Verifies that all intended text/background pairs pass WCAG AA (≥ 4.5:1) and that
 * restricted muted pairs intentionally fail AA (documented exception for muted text
 * on canvas and inset surfaces).
 *
 * Run: `npm test -- src/theme/contrast.spec.ts`
 *
 * Authoritative sources:
 * - Contrast pair definitions: {@link file:///src/components/testing/theme-fixtures.ts}
 * - Token values: {@link file:///src/theme/_variables.scss}
 * - Design tokens spec: {@link file:///.agent/project-info/brief.md} §5
 */

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
