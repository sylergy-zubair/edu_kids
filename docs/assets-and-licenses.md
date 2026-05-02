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
| `android/app/src/main/res/raw/anim_dog.mp3` | [Freesound 625501](https://freesound.org/s/625501/) — preview MP3 (`cdn.freesound.org/.../625501_13366994-lq.mp3`) | **CC0** (Creative Commons Zero) |
| `android/app/src/main/res/raw/anim_cat.mp3` | [Freesound 110011](https://freesound.org/s/110011/) — preview MP3 | **CC0** |
| `android/app/src/main/res/raw/anim_cow.mp3` | [DJWoodZ/Animal-Sounds `cow-moo.mp3`](https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/cow-moo.mp3) | **CC0** (per repo [LICENSE](https://github.com/DJWoodZ/Animal-Sounds/blob/master/LICENSE)) |
| `android/app/src/main/res/raw/anim_duck.mp3` | [Freesound 719115](https://freesound.org/s/719115/) — preview MP3 | **CC0** |
| `android/app/src/main/res/raw/anim_sheep.mp3` | [DJWoodZ/Animal-Sounds `sheep-baa.mp3`](https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/sheep-baa.mp3) | **CC0** |
| `android/app/src/main/res/raw/anim_horse.mp3` | [DJWoodZ/Animal-Sounds `horse-trot.mp3`](https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/horse-trot.mp3) | **CC0** |
| `android/app/src/main/res/raw/anim_lion.mp3` | [Freesound 611721](https://freesound.org/s/611721/) — preview MP3 | **CC0** |
| `android/app/src/main/res/raw/anim_frog.mp3` | [Freesound 741575](https://freesound.org/s/741575/) — preview MP3 | **CC0** |
| `android/app/src/main/res/raw/anim_bird.mp3` | [DJWoodZ/Animal-Sounds `chicken-cluck.mp3`](https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/chicken-cluck.mp3) (used as a simple “farm bird” cluck) | **CC0** |

**Re-fetch animal clips:** `npm run fetch:animals` (`scripts/fetch-animal-sfx.mjs`).

**Playback (PRD 3.3):** `src/services/sounds.ts` sets in-app SFX mix to **~40%** via `SoundPlayer.setVolume` so prompts are not drowned out and clips feel gentler on small speakers.

**Recommended upgrade:** swap these for **Kenney “UI Audio”** (CC0) after downloading from [Kenney UI Audio](https://kenney.nl/assets/ui-audio), keeping the same base names (`tap`, `success`, `retry`, `transition`) and formats supported by `react-native-sound-player`.

## Tracking external assets

When adding any non-generated file, append a row to this table with **file path**, **URL**, and **license**.
