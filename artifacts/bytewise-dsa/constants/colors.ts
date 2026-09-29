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
    text: '#172B3A',
    tint: '#20A4F3',
    background: '#F8FBFD',
    foreground: '#172B3A',
    card: '#FFFFFF',
    cardForeground: '#172B3A',
    primary: '#20A4F3',
    primaryForeground: '#FFFFFF',
    secondary: '#EAF7FF',
    secondaryForeground: '#1473AD',
    muted: '#EFF4F6',
    mutedForeground: '#77909E',
    accent: '#FFCB42',
    accentForeground: '#172B3A',
    destructive: '#FF6B58',
    destructiveForeground: '#FFFFFF',
    border: '#DCE8EE',
    input: '#DCE8EE',

    // Product-specific semantic tokens.
    ink: '#172B3A',
    sky: '#20A4F3',
    skyDark: '#148AD0',
    mint: '#C9F7DC',
    mintDark: '#16A865',
    lime: '#71D65B',
    navy: '#24516B',
    yellow: '#FFCB42',
    yellowDark: '#E7A900',
    orange: '#FF955C',
    coral: '#FF6B58',
    purple: '#9270F2',
    purpleDark: '#6C52C2',
    blueWash: '#EAF7FF',
    greenWash: '#EEFBEF',
    orangeWash: '#FFF3E8',
    lavenderWash: '#F1EEFF',
    line: '#E7EEF1',
  },

  radius: 18,
};

export default colors;
