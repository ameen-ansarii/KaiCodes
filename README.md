# Project: rooms (Campus Study Hub PWA)

A Progressive Web App designed with iOS Human Interface Guidelines (spring physics, tactile buttons) and dual responsive layouts:
- **Mobile (iPhone)**: Authentic vertical layout matching reference design with tactile spring buttons and custom illustrated avatars.
- **Laptop / Desktop**: Landscape split layout featuring brand showcase, live room indicators, and desktop authentication panel.

---

## ⚠️ AI Assistant Rules & Constraints

> **CRITICAL DEVELOPER DIRECTIVES (DO NOT VIOLATE):**
> 1. **DO NOT OPEN BROWSER / SUBAGENTS**: Never launch browser tools or subagents to view localhost or test button clicks. The user tests manually in their own browser.
> 2. **DO NOT RUN `npm run build`**: Do not run build checks after edits. The user will run builds when needed.
> 3. **USE ONLY UNTITLED UI ICONS**: Exclusively use `@untitledui/icons` across the project. Do not import Lucide or React Icons.
> 4. **DIRECT CODE MODIFICATIONS**: Make code changes directly and promptly without unnecessary background testing steps.

---

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Vanilla CSS / Design Tokens (`src/App.css`, `src/index.css`)
- **Typography**: SF Pro Display (iOS native system font stack + CDN fallback)
- **Icons**: `@untitledui/icons` (Untitled UI official icons)
- **Physics & Motion**: `framer-motion` (Spring physics: `stiffness: 480, damping: 26`)
- **PWA**: `vite-plugin-pwa` (Service Worker + Web App Manifest)

---

## Running Locally

```bash
# Start dev server
npm run dev
```

Visit: `http://localhost:5173/`
