/** Parses an HTML string into a detached root HTMLElement using the jsdom global `document`. */
export function parseHtmlDocument(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}
