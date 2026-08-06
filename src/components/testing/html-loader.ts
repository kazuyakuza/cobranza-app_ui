const TOKEN_ROLES_PATTERN = /const TOKEN_ROLES\s*=\s*(\[[\s\S]*?\]);/;
const TOKEN_ROLE_ROW_PATTERN = /\['([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\]/g;

/** Parses an HTML string into a detached root HTMLElement using the jsdom global `document`. */
export function parseHtmlDocument(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

/** Extracts the `[role, token, hex]` triples declared in the HTML's TOKEN_ROLES script array. */
export function extractTokenRoles(html: string): Array<[string, string, string]> {
  const block = html.match(TOKEN_ROLES_PATTERN)?.[1];
  if (!block) return [];
  const entries: Array<[string, string, string]> = [];
  for (const row of block.matchAll(TOKEN_ROLE_ROW_PATTERN)) {
    entries.push([row[1], row[2], row[3]]);
  }
  return entries;
}
