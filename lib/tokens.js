// Design Tokens for WatchStore (Shopify Standard)

export const colors = {
  background: '#eeeeee',
  surface: '#ffffff',
  text: '#1a1a1a',
  textMuted: '#767676',
  primary: '#0D3D29',
  primaryHover: '#082619',
  primaryContrast: '#ffffff',
  accent: '#C8472B',
  accentHover: '#a73720',
  border: '#cccccc',
  borderLight: 'rgba(0, 0, 0, 0.1)',
  success: '#2E7D4F',
  warning: '#B7791F',
  error: '#B3261E',
  headerBg: '#222222',
  headerText: '#ffffff',
  navLink: '#b5b5b5',
  navLinkHover: '#ffffff',
  shadowSm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  shadowMd: '0 4px 12px rgba(0, 0, 0, 0.08)',
  shadowLg: '0 8px 24px rgba(0, 0, 0, 0.12)',
};

// Backwards-compatible export for primary
export const primary = colors.primary;

export const spacing = {
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '24px',
  space6: '32px',
  space7: '48px',
  space8: '64px',
  space9: '96px',
};

export const radius = {
  sm: '5px',
  md: '10px',
  full: '9999px',
};

export const breakpoints = {
  sm: '480px',
  md: '750px',
  lg: '990px',
  xl: '1200px',
  xxl: '1440px',
};

export const media = {
  sm: `@media screen and (min-width: ${breakpoints.sm})`,
  md: `@media screen and (min-width: ${breakpoints.md})`,
  lg: `@media screen and (min-width: ${breakpoints.lg})`,
  xl: `@media screen and (min-width: ${breakpoints.xl})`,
  xxl: `@media screen and (min-width: ${breakpoints.xxl})`,
};

export const typography = {
  fontHeading: "'Playfair Display', Georgia, serif",
  fontBody: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.1875rem',  // 19px
    lg: '1.4375rem',  // 23px
    xl: '1.75rem',    // 28px
    xxl: '2.0625rem', // 33px
    xxxl: '2.5rem',   // 40px
    display: '3rem',  // 48px
  },
  lineHeight: {
    body: 1.55,
    heading: 1.2,
  },
};

export const transitions = {
  default: 'all 200ms ease-out',
  fast: 'all 100ms ease-out',
};
