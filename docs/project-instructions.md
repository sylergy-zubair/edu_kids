# Project Instructions

## Android Testing Preference

Use a physical Android phone for development testing instead of an Android emulator.

Default testing flow:

1. Build the app as a React Native Android app.
2. Connect the Android phone by USB.
3. Enable Developer Options and USB debugging on the phone.
4. Use `adb devices` to confirm the phone is connected.
5. Use `npm run android` or `npx react-native run-android` to install and run the app.
6. Use `adb logcat` for runtime logs when debugging.

Reason:

This MVP is for a toddler using a real Android phone. Physical-device testing gives better feedback for touch behavior, speaker volume, Android TTS quality, performance, screen size, and real child interaction.

Emulator testing is optional and should not be treated as the default path.

## Product Defaults

This project is a kids/toddler learning app for a 2-3 year old child, with an adult nearby during use.

Default product assumptions:

- Design for toddlers first.
- Use large, forgiving touch targets.
- Avoid reading-heavy UI.
- Use simple English-only prompts.
- Use gentle, encouraging feedback.
- Avoid scary, harsh, or overstimulating effects.
- Do not include ads, external links, payments, social features, or open-ended AI/chat in the MVP.

## Orientation Preference

Design and test the app primarily in landscape mode.

Landscape should be treated as the main experience for:

- Home/playground screen
- Activity screens
- Drag-and-drop interactions
- Counting and matching games
- Routine mini-games

Portrait support can be basic or secondary for the MVP unless explicitly requested later.
