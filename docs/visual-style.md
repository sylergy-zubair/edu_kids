# Visual style direction (PRD Issue 0.3)

## Layout

- **Landscape-first** on Android (locked to sensor landscape in the manifest).
- Full-bleed playful backgrounds; safe areas respected for notches.

## Palette

- Sky gradient: `#87CEEB` → `#E0F6FF`
- Grass / ground accent: `#7BC96F`
- Primary action (Play): `#FF9F43` fill, `#F08C00` border
- Secondary highlights: `#FF6B9D`, `#9B7EDE`, `#FFD93D`
- Text on bright panels: `#2D3436` (minimal copy)

## Components

- **Buttons:** large min height ~72pt, heavy rounded corners (pill / squircle), soft shadow.
- **Tap targets:** minimum ~56dp effective hit area even if visuals are smaller.
- **Characters/objects:** rounded, emoji-forward placeholders; avoid sharp scary imagery.

## Typography

- Use the **system UI font** (SF / Roboto) at **large sizes** for short labels (roughly 18–28pt+ on buttons, minimal body copy).
- Prefer **weight 700–900** on primary actions; keep line length very short so toddlers are not asked to read paragraphs.

## Motion mood

- Success: bounce + sparkle/confetti burst (short, <1s).
- Retry: soft horizontal wiggle, warm colors — never harsh red flashes or buzzer vibes.
- Occasional silly idle bob on mascot emoji on home.

## Feasibility

- Achievable with RN `Animated`, layout, and emoji; swap emoji for Kenney sprites later without changing activity logic.
