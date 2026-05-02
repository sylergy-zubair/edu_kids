# Asset and audio rules (PRD Issue 0.2 & 3.3)

## Visuals

- Prefer **SVG-style shapes** (React Native `View` + border radius), **emoji**, and simple illustrations built in code.
- **Kenney** CC0 packs are allowed for UI/audio when bundled with attribution notes below.
- **Pixabay** sounds are allowed only when license is verified non-problematic before import.
- **Forbidden:** famous characters, screenshots, copied brand art, unlicensed cartoon IP.

### In-repo visuals (no external image files for gameplay)

| What | Where | License / note |
|------|--------|----------------|
| Unicode emoji (activities, routines) | Inline in `src/content/*` | System font glyphs; no bundled raster for these |
| Launcher / mipmap PNGs | `android/app/src/main/res/mipmap-*` | Default **React Native** template assets; replace before store release if needed |
| iOS icon set | `ios/.../Images.xcassets` | Default RN template |

When importing **non-generated** images or sprite sheets, add a row here with **path**, **URL**, and **license**.

## Audio shipped in this repo

| File | Source | License |
|------|--------|---------|
| `android/app/src/main/res/raw/tap.wav` | Generated sine blip (`scripts/generate-sfx-wavs.mjs`) | Project-generated, replace freely |
| `android/app/src/main/res/raw/success.wav` | Generated (`scripts/generate-sfx-wavs.mjs`) | Project-generated |
| `android/app/src/main/res/raw/retry.wav` | Generated (`scripts/generate-sfx-wavs.mjs`) | Project-generated |
| `android/app/src/main/res/raw/transition.wav` | Generated (`scripts/generate-sfx-wavs.mjs`) | Project-generated |

**Playback (PRD 3.3):** `src/services/sounds.ts` sets in-app SFX mix to **~40%** via `SoundPlayer.setVolume` so prompts are not drowned out and clips feel gentler on small speakers.

**Recommended upgrade:** swap these for **Kenney “UI Audio”** (CC0) after downloading from [Kenney UI Audio](https://kenney.nl/assets/ui-audio), keeping the same base names (`tap`, `success`, `retry`, `transition`) and formats supported by `react-native-sound-player`.

## Tracking external assets

When adding any non-generated file, append a row to this table with **file path**, **URL**, and **license**.
