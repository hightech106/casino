// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
}

const primaryFont = 'Public Sans, sans-serif'; // Google Font
const headingFont = '"Impact", "CircularStd", "Oswald", sans-serif';

// ----------------------------------------------------------------------

export const typography = {
  fontFamily: primaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontFamily: headingFont,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 1,
    fontSize: pxToRem(40),
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontFamily: headingFont,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 1,
    fontSize: pxToRem(32),
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontFamily: headingFont,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 1,
    fontSize: pxToRem(24),
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontFamily: headingFont,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 1,
    fontSize: pxToRem(20),
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontFamily: headingFont,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 1,
    fontSize: pxToRem(18),
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontFamily: headingFont,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 1,
    fontSize: pxToRem(17),
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'unset',
  },
} as const;
