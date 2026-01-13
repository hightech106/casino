import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#FFFFFF',
  800: '#2B2F3D',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#EBD6FF',
  light: '#A64BFF',
  main: '#24ee89', 
  dark: '#3a4142',
  darker: '#200A69',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#CCF8FF',
  light: '#4FF1FF',
  main: '#00E5FF',
  dark: '#0088A0',
  darker: '#004B5C',
  contrastText: '#232626',
};

const INFO = {
  lighter: '#FEE3FF',
  light: '#FF9CF1',
  main: '#FF00AA',
  dark: '#C0007F',
  darker: '#7D004F',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#E0FFF8',
  light: '#63F2C4',
  main: '#00D69A',
  dark: '#009A6E',
  darker: '#00614A',
  contrastText: '#232626',
};

const WARNING = {
  lighter: '#FFF4D5',
  light: '#FFD58A',
  main: '#FFB02E',
  dark: '#C7790B',
  darker: '#C7790B',
  contrastText: '#232626',
};

const ERROR = {
  lighter: '#FFE4EF',
  light: '#FF99C2',
  main: '#FF4BBA',
  dark: '#C21E7F',
  darker: '#7C0C4F',
  contrastText: '#FFFFFF',
};

const COMMON = {
  common: {
    black: '#050514',
    white: '#FFFFFF',
  },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.2),
  action: {
    hover: alpha(GREY[700], 0.08),
    selected: alpha(GREY[700], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[700], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
  background: {
    paper:   '#101024',   // panels
    default: '#050514',   // page bg
    sidebar: '#191937',
    neutral: alpha(GREY[500], 0.12),
  },
};

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: '#FFFFFF',
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: '#2B2F3D',
      default: '#FFFFFF',
      sidebar: '#2B2F3D',
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[700],
    },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: '#232626',
      sidebar: '#2B2F3D',
      neutral: alpha(GREY[500], 0.12),
    },
    action: {
      ...COMMON.action,
      active: GREY[700],
    },
  };

  return mode === 'light' ? light : dark;
}