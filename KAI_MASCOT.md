# 👾 Kai — Official Mascot & Design System

> **Character Profile:** Kai is the mascot, coach, and companion for **KaiCode** (formerly Bytewise). He represents the modern Gen-Z coder: sharp, calm, relatable, slightly sleep-deprived, but locked in when tackling algorithms and system design.

---

## 🎨 Visual Identity & Consistency Rules

| Feature | Specification |
| :--- | :--- |
| **Art Style** | Authentic **Apple iOS 3D Memoji** aesthetic. Soft-touch matte skin, realistic specular catchlights, clean 3D studio lighting. Zero 2D anime/manga tropes. |
| **Hair Silhouette** | **Wavy curtain bangs in front with prominent back mane locks** flaring out visibly on both sides behind/below the ears (shaggy wolf-cut / wavy curtain mullet). Jet black with soft highlight ridges. |
| **Eyes & Demeanor** | Cool almond-shaped dark brown eyes with dark pupils and subtle catchlights. Sharp V-jawline, mature young-adult demeanor. |
| **Format** | **Strictly floating head + hands only**. **NO shoulders, NO body, NO clothing, NO neck**. |
| **Transparency** | **32-bit Transparent PNGs (`.png`)**. Seamless blending on Dark Mode, Light Mode, colored cards, modals, and toasts. |
| **Trademarks** | **Strictly unbranded** hardware and apparel. No Apple logos or third-party trademarks. |

---

## 📁 Active Asset Roster (`assets/images/`)

All **13 Kai avatars** are verified with the **consistent back mane**, **authentic Memoji 3D style**, and **100% transparent backgrounds**:

### In-App Learning & Problem Solving

| File | Expression | Emotion / Role | Recommended In-App Triggers |
| :--- | :--- | :--- | :--- |
| **`kai_accepted.png`** | Victory Smile + Thumbs-Up | Success, validation, celebration | • 100% test cases passed (`Accepted`)<br>• Streak milestone saved<br>• Daily challenge completed |
| **`kai_coding.png`** | Peeking over unbranded silver laptop | Deep coder focus, active development | • Problem-solving workspace<br>• Code playground / IDE view<br>• Live test suite running |
| **`kai_thinking.png`** | Hand on chin, eyebrow raised | Analytical contemplation, pondering | • Algorithm analysis & Big-O complexity<br>• Problem description header<br>• Empty / loading state |
| **`kai_eureka.png`** | Glowing 3D lightbulb + pointing finger | "Aha!" insight, discovery, revelation | • User unlocks a hint<br>• Editorial solution revealed<br>• Optimal pattern explained |
| **`kai_frustrated.png`** | Furrowed brow, grimace, temple press | Mental strain, hard bug, grit | • Wrong Answer (WA)<br>• Time Limit Exceeded (TLE)<br>• Hard DP / Graph problem |
| **`kai_facepalm.png`** | Palm over face, eye peeking | Self-cringe, off-by-one error | • Syntax error / Compilation error<br>• Infinite loop / Recursion depth error<br>• Missing edge case |
| **`kai_mindblown.png`** | Matrix green code eyes, jaw dropped | Stunned awe, galaxy brain | • Clever $O(1)$ bitwise trick explained<br>• Advanced system design architectural insight |
| **`kai_speedrun.png`** | Chrome speed shades + smoking finger | Cocky flex, speed demon | • Submission beats > 99% of runtimes<br>• Speedrun challenge won |
| **`kai_sleepy.png`** | Dark eye bags + steaming coffee mug | 3 AM grinder, burnout warning | • Night-owl coding sessions (after 12 AM)<br>• Rest reminder / take a break |
| **`kai_crying.png`** | Teary puppy eyes, quivering lip | Heartbroken plea, streak at risk | • User about to quit lesson / exit app<br>• 2 hours left before streak reset |

### Social Media Marketing & Instagram Slides

| File | Gesture / Hook | Marketing Purpose |
| :--- | :--- | :--- |
| **`kai_stop.png`** | Open palm held up ("STOP / Wait") | **Slide 1 Cover Hook:** Stop scrolling, warning callout. |
| **`kai_point_right.png`** | Pointing index finger to the right | **Carousel Slide Indicator:** "Swipe left to see solution ➡️". |
| **`kai_whisper.png`** | Cupping hand whispering confidential tip | **Insider Tech Drops:** "The cheat code FAANG won't tell you". |

---

## 💻 React Native `<KaiMascot />` Component

```tsx
import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

export type KaiMood =
  | 'accepted'
  | 'coding'
  | 'thinking'
  | 'eureka'
  | 'frustrated'
  | 'facepalm'
  | 'mindblown'
  | 'speedrun'
  | 'sleepy'
  | 'crying'
  | 'stop'
  | 'point_right'
  | 'whisper';

const KAI_ASSETS: Record<KaiMood, any> = {
  accepted: require('@/assets/images/kai_accepted.png'),
  coding: require('@/assets/images/kai_coding.png'),
  thinking: require('@/assets/images/kai_thinking.png'),
  eureka: require('@/assets/images/kai_eureka.png'),
  frustrated: require('@/assets/images/kai_frustrated.png'),
  facepalm: require('@/assets/images/kai_facepalm.png'),
  mindblown: require('@/assets/images/kai_mindblown.png'),
  speedrun: require('@/assets/images/kai_speedrun.png'),
  sleepy: require('@/assets/images/kai_sleepy.png'),
  crying: require('@/assets/images/kai_crying.png'),
  stop: require('@/assets/images/kai_stop.png'),
  point_right: require('@/assets/images/kai_point_right.png'),
  whisper: require('@/assets/images/kai_whisper.png'),
};

interface KaiMascotProps {
  mood: KaiMood;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export const KaiMascot: React.FC<KaiMascotProps> = ({ mood, size = 96, style }) => {
  return (
    <Image
      source={KAI_ASSETS[mood] || KAI_ASSETS.accepted}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};
```
