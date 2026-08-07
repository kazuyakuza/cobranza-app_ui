export const EXPECTED_TOKENS: Record<string, string> = {
  '--cba-bg-primary': '#C5BFAE',
  '--cba-bg-secondary': '#E6DDC6',
  '--cba-bg-tertiary': '#D8C3A5',
  '--cba-bg-elevated': '#FBF7ED',
  '--cba-bg-overlay': 'rgba(43, 38, 32, 0.45)',
  '--cba-text-primary': '#2B2620',
  '--cba-text-secondary': '#4A4640',
  '--cba-text-muted': '#625C55',
  '--cba-text-inverse': '#FDFCF8',
  '--cba-border-subtle': '#DAD7CA',
  '--cba-border-default': '#A7A6A2',
  '--cba-border-strong': '#8E8D8A',
  '--cba-accent-primary': '#6B5B4F',
  '--cba-accent-success': '#3E6B4F',
  '--cba-accent-warning': '#E98074',
  '--cba-accent-danger': '#B93E36',
  '--cba-accent-info': '#56717E',
  '--cba-hover': 'rgba(43, 38, 32, 0.10)',
  '--cba-active': 'rgba(43, 38, 32, 0.18)',
  '--cba-hover-inverse': 'rgba(253, 252, 248, 0.12)',
  '--cba-active-inverse': 'rgba(253, 252, 248, 0.22)',
  '--cba-focus-ring': '0 0 0 3px rgba(232, 90, 79, 0.45)',
  '--cba-header-height': '56px',
  '--cba-footer-height': '64px',
  '--cba-module-header-min-height': '40px',
  '--cba-radius-sm': '6px',
  '--cba-radius-md': '10px',
  '--cba-radius-lg': '14px',
  '--cba-shadow-module': '0 6px 24px rgba(43, 34, 28, 0.18)',
  '--cba-shadow-elevated': '0 10px 32px rgba(43, 34, 28, 0.26)',
  '--cba-space-1': '4px',
  '--cba-space-2': '8px',
  '--cba-space-3': '12px',
  '--cba-space-4': '16px',
  '--cba-space-5': '20px',
  '--cba-space-6': '24px',
  '--cba-space-8': '32px',
};

export const SCSS_VARIABLES_PATH = 'src/theme/_variables.scss';
export const PREVIEW_HTML_PATH = 'docs/theme-preview.html';
export const PREVIEW_CSS_PATH = 'docs/theme-preview.css';
export const CONSUMER_GUIDE_PATH = 'docs/CONSUMER_GUIDE.md';

// Derive every duplicated colour from EXPECTED_TOKENS so a token change needs a single edit.
const BG_PRIMARY = EXPECTED_TOKENS['--cba-bg-primary'];
const BG_SECONDARY = EXPECTED_TOKENS['--cba-bg-secondary'];
const BG_TERTIARY = EXPECTED_TOKENS['--cba-bg-tertiary'];
const BG_ELEVATED = EXPECTED_TOKENS['--cba-bg-elevated'];
const TEXT_PRIMARY = EXPECTED_TOKENS['--cba-text-primary'];
const TEXT_SECONDARY = EXPECTED_TOKENS['--cba-text-secondary'];
const TEXT_MUTED = EXPECTED_TOKENS['--cba-text-muted'];
const TEXT_INVERSE = EXPECTED_TOKENS['--cba-text-inverse'];
const ACCENT_PRIMARY = EXPECTED_TOKENS['--cba-accent-primary'];

export interface ContrastPair {
  name: string;
  text: string;
  background: string;
  mustPass: boolean;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { name: 'text-primary on panel', text: TEXT_PRIMARY, background: BG_SECONDARY, mustPass: true },
  { name: 'text-primary on elevated', text: TEXT_PRIMARY, background: BG_ELEVATED, mustPass: true },
  { name: 'text-primary on canvas', text: TEXT_PRIMARY, background: BG_PRIMARY, mustPass: true },
  { name: 'text-primary on inset', text: TEXT_PRIMARY, background: BG_TERTIARY, mustPass: true },
  { name: 'text-secondary on panel', text: TEXT_SECONDARY, background: BG_SECONDARY, mustPass: true },
  { name: 'text-secondary on elevated', text: TEXT_SECONDARY, background: BG_ELEVATED, mustPass: true },
  { name: 'text-secondary on canvas', text: TEXT_SECONDARY, background: BG_PRIMARY, mustPass: true },
  { name: 'text-secondary on inset', text: TEXT_SECONDARY, background: BG_TERTIARY, mustPass: true },
  { name: 'text-muted on panel', text: TEXT_MUTED, background: BG_SECONDARY, mustPass: true },
  { name: 'text-muted on elevated', text: TEXT_MUTED, background: BG_ELEVATED, mustPass: true },
  { name: 'text-inverse on accent-primary', text: TEXT_INVERSE, background: ACCENT_PRIMARY, mustPass: true },
  { name: 'text-muted on canvas (restricted)', text: TEXT_MUTED, background: BG_PRIMARY, mustPass: false },
  { name: 'text-muted on inset (restricted)', text: TEXT_MUTED, background: BG_TERTIARY, mustPass: false },
];

export interface SurfaceGap {
  name: string;
  lower: string;
  higher: string;
  minGap: number;
}

export const SURFACE_GAPS: SurfaceGap[] = [
  { name: 'canvas to panel', lower: BG_PRIMARY, higher: BG_SECONDARY, minGap: 8 },
  { name: 'panel to elevated', lower: BG_SECONDARY, higher: BG_ELEVATED, minGap: 8 },
  { name: 'panel to inset', lower: BG_TERTIARY, higher: BG_SECONDARY, minGap: 6 },
  { name: 'elevated to inset', lower: BG_TERTIARY, higher: BG_ELEVATED, minGap: 8 },
];

export const SURFACE_LIGHTNESS_ORDER = [
  { token: 'canvas', hex: BG_PRIMARY },
  { token: 'inset', hex: BG_TERTIARY },
  { token: 'panel', hex: BG_SECONDARY },
  { token: 'elevated', hex: BG_ELEVATED },
];
