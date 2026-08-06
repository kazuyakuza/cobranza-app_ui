import { readProjectText } from './project-files';

const TOKEN_PATTERN = /(--cba-[a-z0-9-]+)\s*:\s*([^;}]+)[;}]\s*/g;

/** Parses `--cba-*: value;` declarations from SCSS or compiled CSS text. */
export function parseScssVariables(text: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    result.set(match[1], match[2].trim());
  }
  return result;
}

/** Loads and parses src/theme/_variables.scss into a token→value map. */
export function loadScssVariables(): Map<string, string> {
  return parseScssVariables(readProjectText('src/theme/_variables.scss'));
}
