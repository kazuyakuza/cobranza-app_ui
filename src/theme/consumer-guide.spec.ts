/**
 * @file consumer-guide.spec.ts — Regression tests for the Consumer Guide structure.
 *
 * Verifies that `docs/CONSUMER_GUIDE.md` contains all mandated sections: Token Compliance
 * Mandate, Theme load, Surface ownership map, Button Color Guide, Surface Decision Tree,
 * Text Color Rules, Bar and Chrome Guide, Shell checklist, MFE checklist, Anti-patterns,
 * and Quick verify.
 *
 * Run: `npm test -- src/theme/consumer-guide.spec.ts`
 *
 * Authoritative sources:
 * - Consumer Guide: {@link file:///docs/CONSUMER_GUIDE.md}
 * - Design tokens spec: {@link file:///.agent/project-info/brief.md} §5
 */

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
  }
});
