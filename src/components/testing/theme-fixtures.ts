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
  '--cba-hover': 'rgba(43, 38, 32, 0.06)',
  '--cba-active': 'rgba(43, 38, 32, 0.10)',
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

export interface ContrastPair {
  name: string;
  text: string;
  background: string;
  mustPass: boolean;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { name: 'text-primary on panel', text: '#2B2620', background: '#E6DDC6', mustPass: true },
  { name: 'text-primary on elevated', text: '#2B2620', background: '#FBF7ED', mustPass: true },
  { name: 'text-primary on canvas', text: '#2B2620', background: '#C5BFAE', mustPass: true },
  { name: 'text-primary on inset', text: '#2B2620', background: '#D8C3A5', mustPass: true },
  { name: 'text-secondary on panel', text: '#4A4640', background: '#E6DDC6', mustPass: true },
  { name: 'text-secondary on elevated', text: '#4A4640', background: '#FBF7ED', mustPass: true },
  { name: 'text-secondary on canvas', text: '#4A4640', background: '#C5BFAE', mustPass: true },
  { name: 'text-secondary on inset', text: '#4A4640', background: '#D8C3A5', mustPass: true },
  { name: 'text-muted on panel', text: '#625C55', background: '#E6DDC6', mustPass: true },
  { name: 'text-muted on elevated', text: '#625C55', background: '#FBF7ED', mustPass: true },
  { name: 'text-inverse on accent-primary', text: '#FDFCF8', background: '#6B5B4F', mustPass: true },
  { name: 'text-muted on canvas (restricted)', text: '#625C55', background: '#C5BFAE', mustPass: false },
  { name: 'text-muted on inset (restricted)', text: '#625C55', background: '#D8C3A5', mustPass: false },
];

export interface SurfaceGap {
  name: string;
  lower: string;
  higher: string;
  minGap: number;
}

export const SURFACE_GAPS: SurfaceGap[] = [
  { name: 'canvas to panel', lower: '#C5BFAE', higher: '#E6DDC6', minGap: 8 },
  { name: 'panel to elevated', lower: '#E6DDC6', higher: '#FBF7ED', minGap: 8 },
  { name: 'panel to inset', lower: '#D8C3A5', higher: '#E6DDC6', minGap: 6 },
  { name: 'elevated to inset', lower: '#D8C3A5', higher: '#FBF7ED', minGap: 8 },
];

export const SURFACE_LIGHTNESS_ORDER = [
  { token: 'canvas', hex: '#C5BFAE' },
  { token: 'inset', hex: '#D8C3A5' },
  { token: 'panel', hex: '#E6DDC6' },
  { token: 'elevated', hex: '#FBF7ED' },
];
