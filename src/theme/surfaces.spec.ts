/**
 * @file surfaces.spec.ts — Regression tests for surface lightness hierarchy.
 *
 * Verifies that the four Minimal Yet Warm surfaces (canvas, inset, panel, elevated)
 * are ordered by CIE L* lightness and that the gaps between adjacent surfaces meet
 * the minimum thresholds defined in the design spec.
 *
 * Run: `npm test -- src/theme/surfaces.spec.ts`
 *
 * Authoritative sources:
 * - Surface gap thresholds: {@link file:///src/components/testing/theme-fixtures.ts}
 * - Token values: {@link file:///src/theme/_variables.scss}
 * - Design tokens spec: {@link file:///.agent/project-info/brief.md} §5
 */

import { lightnessGap, srgbToLab } from '../components/testing/color-math';
import { SURFACE_GAPS, SURFACE_LIGHTNESS_ORDER } from '../components/testing/theme-fixtures';

describe('surface lightness hierarchy', () => {
  const lightness = SURFACE_LIGHTNESS_ORDER.map((surface) => srgbToLab(surface.hex).L);

  describe('lightness gaps meet thresholds', () => {
    for (const gap of SURFACE_GAPS) {
      it(`${gap.name} ΔL* >= ${gap.minGap}`, () => {
        expect(lightnessGap(gap.lower, gap.higher)).toBeGreaterThanOrEqual(gap.minGap);
      });
    }
  });

  it('four surfaces are ordered canvas < inset < panel < elevated by L*', () => {
    for (let i = 1; i < lightness.length; i += 1) {
      expect(lightness[i]).toBeGreaterThan(lightness[i - 1]);
    }
  });

  it('elevated is the lightest and canvas is the darkest surface', () => {
    const first = SURFACE_LIGHTNESS_ORDER[0].token;
    const last = SURFACE_LIGHTNESS_ORDER[SURFACE_LIGHTNESS_ORDER.length - 1].token;
    expect(first).toBe('canvas');
    expect(last).toBe('elevated');
    expect(Math.min(...lightness)).toBe(lightness[0]);
    expect(Math.max(...lightness)).toBe(lightness[lightness.length - 1]);
  });
});
