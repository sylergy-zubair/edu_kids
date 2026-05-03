# 🎨 Cartoon Learning Playground ✨

A **React Native** app built for young children: bright colors, big touch targets, sound effects 🔊, and short voice prompts 🗣️. The home screen is a grid of small **activities** and **mini-games**—tap an icon and jump straight in. There is also a **daily “Mix n Match” path** with simple tap, match, and counting challenges that save progress on the device 💾.

This repo is meant to run on **real phones and tablets** 📱 (touch and speakers matter more than a mouse). It works on **Android** 🤖 and **iOS** 🍎.

---

## 🎮 What’s inside

| Emoji | Activity | What kids do |
|-------|----------|----------------|
| 🎨 | **Mix n Match** | Daily-style activities: follow the voice, pick the right picture, match sounds, and light counting. |
| 🦁 | **Animal sounds** | Tap an animal to hear a short real-world clip. |
| 🪨 | **Obstacle** | Help a cat 🐈 jump over rocks, trees, and walls. |
| 🦟 | **Mosquito Hunt** | Tap pests before they get away. |
| 📦 | **Clean-up** | Sort toys into the right boxes. |
| 🍕 | **Baking time** | Drag toppings onto a pizza and “bake” it. |
| 🧩 | **Jigsaw** | Drag bright puzzle pieces to swap them until the picture lines up. |
| 🌧️ | **Rain catcher** | Move an umbrella ☂️ to catch rain and keep a cat dry. |
| ⚡ | **Lightning** | Night sky with clouds—tap a cloud for lightning and thunder. |
| 🌙 | **Moonsight** | Clear clouds ☁️ to find the hidden moon 🌕, then tap it. |

**✨ Nice touches (for grown-ups):** many screens include a **Home** 🏠 control to return to the grid, **text-to-speech** for short phrases, and **accessibility labels** on buttons. A long-press on the home **reset** hint (for adults) can clear stored daily progress when testing.

---

## 🧰 Tech stack (short version)

- ⚛️ **React Native** 0.85, **React** 19, **TypeScript**
- 🧭 **React Navigation** (stack navigator, no default header—each screen designs its own top area)
- 🗣️ **Text-to-speech** (`react-native-tts`) and 🔊 **sound effects** (`react-native-sound-player` + bundled Android `raw` audio)
- 💾 **AsyncStorage** for light on-device progress

No heavy game engine: most visuals are **emoji**, simple **Views**, and motion from **React Native’s Animated API** and a few **PanResponder** drags ✋

---

## 📋 What you need on your machine

- 🟢 **Node.js** — see `package.json` → `engines` for supported versions (Node 20+ is a safe bet).
- 🛠️ A working **React Native** environment: JDK / Android Studio for Android, Xcode for iOS. If you are new to this, start with the official [Environment setup](https://reactnative.dev/docs/set-up-your-environment) guide.

---

## 🚀 Run the app

From the project root:

```sh
npm install
```

Start the Metro bundler (keep this terminal open):

```sh
npm start
```

In a **second** terminal, run the app:

```sh
# Android 🤖
npm run android

# iOS 🍎 (after CocoaPods install where applicable)
npm run ios
```

### 📱 Running on a physical Android phone (recommended)

For touch and audio testing, a USB cable works well:

1. Enable **Developer options** on the phone and turn on **USB debugging**.
2. Plug in the phone and confirm it appears as `device` in `adb devices`.
3. With Metro running, run `npm run android` so the debug build installs on the phone.

If the app loads but cannot reach Metro, try port forwarding:

```sh
adb reverse tcp:8081 tcp:8081
```

More Android/setup notes may live under `docs/` in this repo (for example emulator or SDK paths on Windows).

---

## 📜 Useful scripts

| Command | Purpose |
|--------|---------|
| `npm start` | ▶️ Start Metro. |
| `npm run android` / `npm run ios` | 🤖🍎 Build and launch the app. |
| `npm test` | 🧪 Run Jest tests. |
| `npm run lint` | ✔️ ESLint. |
| `npm run gen:sfx` | 🔊 Regenerate small UI beeps in `android/.../raw` (see `scripts/generate-sfx-wavs.mjs`). |
| `npm run fetch:animals` | 🐾 Re-download animal sound clips (see `scripts/fetch-animal-sfx.mjs`). |

---

## 🗂️ Project layout (where to look)

| Path | Role |
|------|------|
| `App.tsx` | 🏗️ App shell, safe areas, TTS init. |
| `src/navigation/AppNavigator.tsx` | 🧭 All screen names and the stack. |
| `src/screens/` | 📱 One file per full-screen activity. |
| `src/components/` | 🧩 Reusable pieces (e.g. drifting clouds, mascots). |
| `src/services/tts.ts` | 🗣️ Text-to-speech helpers. |
| `src/services/sounds.ts` | 🔊 Sound effects and volume. |
| `src/services/storage.ts` | 💾 Daily path / progress in AsyncStorage. |
| `src/content/` | 📚 Activity definitions for “Mix n Match”. |
| `src/theme/playgroundTheme.ts` | 🎨 Shared colors and spacing. |
| `android/app/src/main/res/raw/` | 📂 Short sounds referenced on Android by base name. |
| `docs/` | 📄 Extra notes—**asset sources and licenses** are tracked in `docs/assets-and-licenses.md`. |

---

## 🎵 Adding or swapping sounds / images

Follow the **asset rules** in [`docs/assets-and-licenses.md`](docs/assets-and-licenses.md). In short: prefer simple, license-friendly audio; log new files in that doc; and avoid trademarked characters or unclear rights ⚠️

**🤖 Android gotcha:** files in `res/raw/` are named by the part *before* the extension. Do not place `thunder.mp3` and `thunder.wav` together—they would both try to be the resource `thunder` and the build will fail 💥 Keep one format per base name.

---

## 🩹 Troubleshooting

- **Red error about Metro:** ensure Metro is running, the device can reach the right port, and try `adb reverse` on Android.
- **Build errors after adding raw audio:** check for duplicate base names in `res/raw/`.
- **TTS or sound silent:** test on a real device; check system volume and that the app has not been killed in the background.

For general React Native issues, see the [React Native troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

---

## 🤝 Contributing

Issues and pull requests are welcome 🙌 When you change gameplay or add media, update `docs/assets-and-licenses.md` if you add files from outside the project.

---

## 💜 Acknowledgments

Built with [React Native](https://reactnative.dev) and the open-source packages listed in `package.json`. Sound and asset credits are detailed in [`docs/assets-and-licenses.md`](docs/assets-and-licenses.md).
