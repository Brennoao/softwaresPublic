import '@/global.css';

import { Platform } from 'react-native';

export const BRAND_PALETTES = {
  feminino: {
    primary: '#E91E8C',
    secondary: '#7B2FF7',
    accent: '#FFC800',
  },
  masculino: {
    primary: '#1E6FE9',
    secondary: '#1F2A44',
    accent: '#00D1B2',
  },
} as const;

export const BRAND_CSS_VARS = {
  feminino: {
    '--color-primary': '233 30 140',
    '--color-secondary': '123 47 247',
    '--color-accent': '255 200 0',
  },
  masculino: {
    '--color-primary': '30 111 233',
    '--color-secondary': '31 42 68',
    '--color-accent': '0 209 178',
  },
} as const;

export const BACKGROUND_GRADIENTS = {
  feminino: ['#FFE3F1', '#FFC7E4', '#E9C4FF'],
  masculino: ['#DCEAFF', '#C3DBFF', '#C8F3EA'],
} as const;

export type Gender = keyof typeof BRAND_PALETTES;

export const Brand = BRAND_PALETTES.feminino;

export const Colors = {
  light: {
    ...Brand,
    text: '#2B0A22',
    background: '#FFF5FB',
    backgroundElement: '#FFE3F1',
    backgroundSelected: '#FFC7E4',
    textSecondary: '#8A5A78',
  },
  dark: {
    ...Brand,
    text: '#ffffff',
    background: '#1A0E1F',
    backgroundElement: '#2B1830',
    backgroundSelected: '#3B2140',
    textSecondary: '#C9A8C4',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',

    serif: 'ui-serif',

    rounded: 'ui-rounded',

    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
