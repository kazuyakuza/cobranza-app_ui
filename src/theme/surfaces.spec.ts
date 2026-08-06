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
