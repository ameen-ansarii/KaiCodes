/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#0F172A',
    tint: '#7C3AED',
    background: '#FFFFFF',
    foreground: '#0F172A',
    card: '#FFFFFF',
    cardForeground: '#0F172A',
    primary: '#7C3AED',
    primaryForeground: '#FFFFFF',
    secondary: '#F5F3FF',
    secondaryForeground: '#6D28D9',
    muted: '#F8FAFC',
    mutedForeground: '#64748B',
    accent: '#FFC800',
    accentForeground: '#0F172A',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#E2E8F0',
    input: '#E2E8F0',

    // Product-specific semantic tokens.
    ink: '#0F172A',
    sky: '#0284C7',
    skyDark: '#0369A1',
    mint: '#DDD6FE',
    mintDark: '#7C3AED',
    lime: '#A78BFA',
    navy: '#0F172A',
    yellow: '#FFC800',
    yellowDark: '#DDA900',
    orange: '#7C3AED',
    coral: '#F43F5E',
    purple: '#7C3AED',
    purpleDark: '#5B21B6',
    blueWash: '#F0F9FF',
    greenWash: '#F5F3FF',
    orangeWash: '#F5F3FF',
    lavenderWash: '#F5F3FF',
    line: '#E2E8F0',
  },

  radius: 18,
};

export default colors;
