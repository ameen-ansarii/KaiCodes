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
    text: '#4B4B4B',
    tint: '#58CC02',
    background: '#FFFFFF',
    foreground: '#4B4B4B',
    card: '#FFFFFF',
    cardForeground: '#4B4B4B',
    primary: '#58CC02',
    primaryForeground: '#FFFFFF',
    secondary: '#EAF7FF',
    secondaryForeground: '#2B70C9',
    muted: '#F7F7F7',
    mutedForeground: '#777777',
    accent: '#FFC800',
    accentForeground: '#4B4B4B',
    destructive: '#FF4B4B',
    destructiveForeground: '#FFFFFF',
    border: '#E5E5E5',
    input: '#E5E5E5',

    // Product-specific semantic tokens.
    ink: '#4B4B4B',
    sky: '#58CC02',
    skyDark: '#43C000',
    mint: '#D7F8C6',
    mintDark: '#43C000',
    lime: '#89E219',
    navy: '#4B4B4B',
    yellow: '#FFC800',
    yellowDark: '#DDA900',
    orange: '#FF9600',
    coral: '#FF4B4B',
    purple: '#CE82FF',
    purpleDark: '#9A52C7',
    blueWash: '#EAF7FF',
    greenWash: '#F1F9ED',
    orangeWash: '#FFF4E5',
    lavenderWash: '#F7EEFF',
    line: '#E5E5E5',
  },

  radius: 18,
};

export default colors;
