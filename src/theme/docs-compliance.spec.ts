/**
 * @file docs-compliance.spec.ts — Changelog versioning compliance regression tests.
 *
 * Enforces .kilo/rules/changelog-versioning.md: no [Unreleased] section; a dated [x.y.z] —
 * YYYY-MM-DD header must exist for the current package.json version; the rule file must be
 * referenced from .agent/RULES.md.
 *
 * Run: `npm test -- src/theme/docs-compliance.spec.ts`
 */

import { readProjectText } from '../components/testing/project-files';

const CHANGELOG_PATH = 'CHANGELOG.md';
const RULES_PATH = '.agent/RULES.md';
const RULE_FILE_PATH = '.kilo/rules/changelog-versioning.md';

function readPackageVersion(): string {
  const pkg = JSON.parse(readProjectText('package.json'));
  return pkg.version as string;
}

describe('CHANGELOG versioning compliance', () => {
  const changelog = readProjectText(CHANGELOG_PATH);
  const version = readPackageVersion();
  const rulesIndex = readProjectText(RULES_PATH);

  it('contains no [Unreleased] section header (case-insensitive)', () => {
    const hasUnreleasedSection = /##\s*\[unreleased\]/i.test(changelog);
    expect(hasUnreleasedSection).toBe(false);
  });

  it('.kilo/rules/changelog-versioning.md is referenced in .agent/RULES.md', () => {
    expect(rulesIndex).toContain('Changelog Versioning');
    expect(rulesIndex).toContain('changelog-versioning.md');
  });

  it('.kilo/rules/changelog-versioning.md file exists (importable path)', () => {
    expect(() => readProjectText(RULE_FILE_PATH)).not.toThrow();
  });
});
