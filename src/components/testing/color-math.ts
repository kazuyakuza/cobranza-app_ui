export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Lab {
  L: number;
  a: number;
  b: number;
}

/** Parses a hex colour string into sRGB channels normalized to 0..1. */
export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const value = parseInt(full, 16);
  return {
    r: ((value >> 16) & 0xff) / 255,
    g: ((value >> 8) & 0xff) / 255,
    b: (value & 0xff) / 255,
  };
}

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** WCAG 2.1 relative luminance of a hex colour (0..1). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG 2.1 contrast ratio between two hex colours. Order-independent. */
export function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function srgbToXyz(hex: string): { x: number; y: number; z: number } {
  const { r, g, b } = parseHex(hex);
  const linearR = linearize(r);
  const linearG = linearize(g);
  const linearB = linearize(b);
  return {
    x: 0.4124 * linearR + 0.3576 * linearG + 0.1805 * linearB,
    y: 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB,
    z: 0.0193 * linearR + 0.1192 * linearG + 0.9505 * linearB,
  };
}

/** CIELAB (D65) conversion. Used for lightness-gap assertions. */
export function srgbToLab(hex: string): Lab {
  const whitePointX = 0.95047;
  const whitePointY = 1.0;
  const whitePointZ = 1.08883;
  const { x, y, z } = srgbToXyz(hex);
  const pivot = (t: number): number =>
    t > Math.cbrt(216 / 24389) ? Math.cbrt(t) : (841 / 108) * t + 16 / 116;
  const fx = pivot(x / whitePointX);
  const fy = pivot(y / whitePointY);
  const fz = pivot(z / whitePointZ);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** Absolute CIELAB L* difference between two hex colours. */
export function lightnessGap(hexA: string, hexB: string): number {
  return Math.abs(srgbToLab(hexA).L - srgbToLab(hexB).L);
}
