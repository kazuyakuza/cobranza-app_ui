import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Reads a project file as UTF-8 text. `relativePath` is from project root (process.cwd()). */
export function readProjectText(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8');
}
