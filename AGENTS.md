# Agent Guidelines & Hard Rules

## 1. Browser Execution Constraints (CRITICAL)
- **STRICT PROHIBITION**: NEVER launch, control, or open automated browser instances (`browser_subagent`, `chrome-devtools-mcp`, Puppeteer, Playwright, or Selenium) for `localhost` or local testing.
- **MANUAL USER TESTING ONLY**: Always output direct terminal commands (`pnpm start --web`, etc.) and let the user open and inspect their own browser manually.
- **PROCESS CLEANUP**: Never leave background servers running as persistent daemon tasks without user instruction. If started temporarily, kill and free ports immediately.

## 2. Design System & Theme Rules
- **Typography**: Strictly use `@expo-google-fonts/nunito` for headings/buttons/badges and `@expo-google-fonts/inter` for body text.
- **Apple iOS Pill Buttons**: Dropped retro 3D depressed/beveled buttons (`borderBottomWidth: 4.5` and `translateY: 3` removed). Strictly use sleek rounded pill buttons (`borderRadius: 99`, height 52-54, brand purple `#7C3AED` with white text, or solid white pill on dark welcome canvases) with smooth press feedback (`opacity: 0.88`, `scale: 0.985`).
- **Mascot Identity**: Strictly use the official transparent 3D Memoji Kai assets (`assets/images/kai_*.png`).
- **No Emojis / Clutter**: No unicode emojis in onboarding or core curriculum text—use clean typographic badges.
