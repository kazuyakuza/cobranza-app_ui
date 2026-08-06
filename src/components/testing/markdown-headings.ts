const HEADING_PATTERN = /^#{1,6}\s+(.+?)\s*$/;

/** Extracts ATX markdown heading texts (without the leading # markers). */
export function extractMarkdownHeadings(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.match(HEADING_PATTERN))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => match[1]);
}
