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

## Running the Mobile App

Run the development server:

```bash
pnpm run dev:mobile
```

To run with an Expo tunnel for physical devices:

```bash
pnpm run dev:mobile:tunnel
```

## Typecheck

Run full type verification across all packages:

```bash
pnpm run typecheck
```
