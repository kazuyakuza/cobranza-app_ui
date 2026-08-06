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
