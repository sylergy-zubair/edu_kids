# Android Device Testing With Codex

Date: 2026-05-01  
Project target: React Native Android app  
Workspace: `E:\mock_lingo`

## Project Preference

Use a physical Android phone for development testing by default. Emulator testing is optional.

For this toddler app, the real phone is the more important test target because it exposes real touch behavior, speaker volume, Android TTS voice quality, performance, screen size, and child interaction patterns.

## Current Tooling Check

From the current Codex shell, these commands did not find Android tooling:

```powershell
Get-Command adb
Get-Command emulator
Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk"
```

That means either Android Studio/SDK Platform Tools are not installed, or they are installed but not visible on `PATH`.

## Required Local Tools For Phone Testing

Install these on Windows:

- Android SDK Platform Tools
- Node.js
- JDK compatible with the chosen React Native version

Android Studio is still the easiest way to install Android SDK Platform Tools, but the emulator itself is not required.

## Physical Android Phone Testing

1. On the Android phone, enable Developer Options.
2. Enable USB Debugging.
3. Connect the phone with USB.
4. Accept the RSA debugging prompt on the phone.
5. Run:

```powershell
adb devices
```

The device should appear as `device`, not `unauthorized`.

Then run:

```powershell
npm run android
```

or:

```powershell
npx react-native run-android
```

React Native should build the debug app, install it on the connected phone, and open it.

If Metro connection fails, run:

```powershell
adb reverse tcp:8081 tcp:8081
```

## Recommended Emulator Setup

1. Open Android Studio.
2. Go to `More Actions > SDK Manager`.
3. Install:
   - Android SDK Platform
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android Emulator
4. Go to `More Actions > Virtual Device Manager`.
5. Create a phone emulator:
   - Device: Pixel 6 or similar
   - System image: a stable Google APIs image
   - Orientation: portrait
6. Start the emulator once from Android Studio to confirm it boots.

## Make Android Tools Visible to Codex

The usual Windows SDK path is:

```powershell
$env:LOCALAPPDATA\Android\Sdk
```

The important tool folders are:

```text
%LOCALAPPDATA%\Android\Sdk\platform-tools
%LOCALAPPDATA%\Android\Sdk\emulator
%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin
```

For the current PowerShell session, Codex can use:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

To persist this outside the session, add those paths to the Windows user environment variables.

## Verify Emulator Access

Run:

```powershell
adb version
emulator -list-avds
adb devices
```

Expected:

- `adb version` prints the installed Android Debug Bridge version.
- `emulator -list-avds` prints at least one emulator name.
- `adb devices` prints a connected emulator after it is running.

## Starting an Emulator

If an AVD exists, start it with:

```powershell
emulator -avd <AVD_NAME>
```

Example:

```powershell
emulator -avd Pixel_6_API_35
```

In Codex Desktop, launching a GUI emulator may require approval because it opens a desktop window. If the emulator is already open from Android Studio, Codex can usually talk to it through `adb` without launching the GUI itself.

## React Native Test Flow

After the React Native app exists, use this flow:

```powershell
npm install
npm run android
```

Or, depending on the scaffold:

```powershell
npx react-native run-android
```

Expected:

- Metro starts.
- Gradle builds the Android app.
- The app installs on the running emulator.
- The app opens automatically.

## Useful Codex Commands During Testing

Check connected devices:

```powershell
adb devices
```

Install a debug APK manually:

```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

Open app logs:

```powershell
adb logcat
```

Filter React Native logs:

```powershell
adb logcat *:S ReactNative:V ReactNativeJS:V
```

Reload the React Native app:

```powershell
adb shell input keyevent 82
```

Clear app data:

```powershell
adb shell pm clear <android.package.name>
```

## Physical Android Phone Testing

1. On the Android phone, enable Developer Options.
2. Enable USB Debugging.
3. Connect the phone with USB.
4. Accept the RSA debugging prompt on the phone.
5. Run:

```powershell
adb devices
```

The device should appear as `device`, not `unauthorized`.

Then run:

```powershell
npm run android
```

or:

```powershell
npx react-native run-android
```

## TTS Testing

For the MVP, TTS should use Android's built-in text-to-speech engine through React Native. Testing should verify:

- Prompt plays when activity starts.
- Success line plays after correct answer.
- Retry line plays after wrong answer.
- App does not crash if TTS is unavailable.
- Volume is comfortable for a toddler.

If the emulator voice sounds poor, test on the physical phone before replacing the approach. Real devices often have better installed voices than emulators.

## Recommended Codex Workflow

1. Keep Android Studio available for emulator/device management.
2. Let Codex run project commands:
   - `npm install`
   - `npm run android`
   - `adb devices`
   - `adb logcat`
3. Use the emulator for quick layout and interaction tests.
4. Use the physical Android phone for toddler-relevant testing:
   - touch target size
   - sound volume
   - TTS quality
   - performance
   - real child interaction

## Practical Note

The emulator is good for engineering feedback, but the real Android phone is the truth for this MVP. The child's hand size, accidental taps, speaker quality, screen brightness, and device TTS voice matter more than emulator perfection.
