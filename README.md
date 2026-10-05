# KaiCode

Daily computer science and data structures practice app with Kai the coding mascot.

## Project Structure

```
dsaapp/
├── artifacts/
│   ├── bytewise-dsa/         # Expo React Native mobile application
│   │   ├── app/              # Expo router and screens
│   │   ├── assets/images/    # Kai mascot avatars, app icon, and purple flame
│   │   ├── components/       # Reusable UI components (Mascot, Buttons, Cards)
│   │   ├── constants/        # Design tokens and theme colors (Purple and Lavender)
│   │   ├── content/          # Structured educational content across subjects
│   │   └── types/            # TypeScript type definitions
│   └── api-server/           # Node backend service
├── content/                  # Master content repository for subjects and lessons
├── lib/                      # Shared libraries, database schemas, and API clients
└── package.json              # Workspace root configuration
```

## Running the App

Run the development server for web preview:

```bash
pnpm start --web
```

To run with an Expo tunnel for physical devices:

```bash
pnpm run dev:tunnel
```

## Typecheck

Run full type verification:

```bash
pnpm run typecheck
```

---

## ⚠️ AI Agent Rules & Development Constraints

1. **DO NOT OPEN BROWSERS ON YOUR OWN:** Under no circumstances should any AI assistant or subagent launch, control, or open browser instances (Puppeteer, Playwright, Chrome DevTools, browser_subagent) for `localhost`.
2. **TERMINAL COMMANDS ONLY:** Always provide the exact terminal commands (`pnpm start --web`, etc.) so the user can test in their own browser manually.
3. **DO NOT START PERSISTENT BACKGROUND SERVERS:** Do not spin up daemon servers that hijack ports without user request.
4. **RESPECT DESIGN TOKENS:** Follow existing Nunito/Inter fonts, purple/sky/yellow palettes, and Kai 3D Memojis. No emojis or random symbols in onboarding/core UI.
