# Phase 4 — Device QA & toddler trial (PRD Issues 4.1–4.4)

Use this checklist while testing. Issues **4.3–4.4** require a real session with the child and notes.

## 4.1 Emulator (optional)

- [ ] Start an Android emulator (or skip if you only use a phone).
- [ ] `npm run android` installs and opens the app.
- [ ] Landscape layout: main buttons usable, no desktop-only layout.
- [ ] Tap, match, count, drag, routine flows complete once each.
- [ ] TTS plays on activity start; if TTS fails, UI still usable.
- [ ] Placeholder WAV SFX play (or note device volume).
- [ ] Kill and reopen app: daily path index persists (`AsyncStorage`).

## 4.2 Physical Android phone

- [ ] USB debugging, `adb devices` shows `device`.
- [ ] `adb reverse tcp:8081 tcp:8081` if Metro does not connect.
- [ ] Repeat layout, touch, TTS, SFX, persistence checks on real hardware.
- [ ] Confirm speaker volume is comfortable for a toddler.

## 4.3 Toddler trial session (observation)

**During**

- Adult nearby; minimal verbal coaching unless stuck.
- Watch for confusion, delight, boredom, repeated tapping, favorites.

**After — capture notes**

- [ ] Child engaged with **≥ 3** activities.
- [ ] List **what confused** the child (prompt, layout, timing, sound).
- [ ] List **≥ 1** thing they enjoyed (animation, sound, character, etc.).
- [ ] Short bullets for next iteration (no formal “test score”).

## 4.4 First iteration fix pass

After notes exist:

- [ ] Address **≥ 3** observed issues (touch targets, copy, pacing, activity order).
- [ ] Re-run a quick device smoke test.
- [ ] Keep scope small; stay local-only and free.
