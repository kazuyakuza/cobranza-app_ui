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
