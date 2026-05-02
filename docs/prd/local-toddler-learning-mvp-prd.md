# Local Toddler Learning App MVP PRD

Date: 2026-05-01  
Working title: Cartoon Learning Playground  
Target user: The creator's own 2-3 year old child, with an adult nearby  
Platform: Android app, Android phone first, landscape-first  
Distribution: Local-only MVP, not published to app stores  

## 1. Product Summary

Cartoon Learning Playground is a local Android-first toddler learning app focused on playful exposure to colors, numbers, shapes, animals, routines, and simple problem-solving. The child experience should feel like a cute cartoon playground with recurring animals/objects, funny animations, and simple guided activities. The educational structure should exist underneath the play experience, but the child should not feel like they are taking lessons or tests.

The MVP succeeds if the child enjoys tapping and playing for a few minutes. Learning outcomes matter, but delight and willingness to engage are the first proof points.

## 2. Goals

- Build a fast React Native Android prototype that can be tried with one child on an Android phone.
- Create a beautiful, toddler-friendly cartoon UI.
- Include many small functional activities, not just static screens.
- Use English-only prompts.
- Use Android/device TTS for spoken prompts and simple local/free sound effects.
- Store progress only on the Android device.
- Avoid AI, accounts, cloud sync, app stores, payments, and parent dashboard features.

## 3. Non-Goals

- No app-store publishing.
- No paid APIs or paid asset packs.
- No subscriptions, login, or payments.
- No cloud backend.
- No AI chat or AI voice.
- No parent dashboard in the MVP.
- No adaptive/recommendation engine in the MVP.
- No licensed characters or copied Lingokids/Disney/YouTube assets.
- No classroom, teacher, or multi-child management.

## 4. Target Experience

The app opens into a colorful cartoon playground. A friendly animal guide invites the child to play a short activity. The child taps, matches, drags, counts, or chooses objects. The app speaks simple English prompts using device TTS, plays cute sound effects, and shows funny success animations. The child can continue through a fixed daily path or stop whenever interest fades.

The adult is expected to sit nearby and help if needed, so the app does not need to solve every confusion independently. It should be forgiving, encouraging, and easy to restart.

The app is designed primarily for landscape mode. Landscape is the main layout for the home/playground screen, activity screens, drag-and-drop games, counting games, matching games, and routine mini-games. Portrait support can be minimal for the MVP.

## 5. MVP Scope

### Included Learning Areas

- Colors
- Numbers
- Shapes
- Animals
- Simple daily routines
- Simple problem-solving

### Included Activity Types

- Tap the correct object
- Match object to object
- Match word/sound to picture
- Count objects
- Find the color or shape
- Simple drag and drop
- Routine mini-game, such as brush teeth, wash hands, or clean up toys

### Included System Features

- Landscape-first Android layout
- Fixed daily lesson path
- Free-play activity access
- TTS prompts
- Sound effects
- Local progress storage
- Basic completion state
- Gentle success and try-again feedback

## 6. Asset Strategy

### Visual Assets

- Use simple free/permissive assets where available.
- Use generated placeholder cartoon animals/objects if needed.
- Use custom CSS/SVG for shapes, numbers, buttons, stars, color blobs, simple icons, and confetti.
- Keep the art style simple, bright, rounded, and consistent.
- Avoid any famous characters or copied brand assets.

### Audio Assets

- Use Android/device TTS for narration in the MVP.
- Use free sound effects from permissive sources such as Kenney CC0 UI Audio and carefully selected Pixabay sound effects.
- Skip background music initially unless a suitable free loop is found.
- Keep all prompts short and toddler-friendly.

Example prompt style:

- "Tap the red circle."
- "Find the cat."
- "Great job!"
- "Try again."
- "Let's count."
- "Put the toy in the box."

## 7. Technical Direction

This MVP is an Android app from day one. The implementation should use React Native rather than a mobile web prototype.

### Required MVP Approach: React Native Android App

Build a React Native Android app that runs locally on an Android emulator and a physical Android phone.

Why:

- Native Android target matches the real MVP device.
- Free.
- React Native is fast enough for iterative UI and activity development.
- Android native TTS can be used through a React Native bridge/library.
- Local device storage is enough for MVP progress.
- The same codebase can later become a distributable APK if needed, without changing the product model.

Likely stack:

- React Native
- TypeScript
- React Native CLI or Expo with a development build
- `react-native-tts` or equivalent Android TTS integration
- AsyncStorage or MMKV for local progress
- React Native Reanimated for simple motion/polish if needed
- Bundled local sound assets for feedback

### Local-Only Runtime Model

- No backend is required.
- No account is required.
- No internet is required after dependencies/assets are installed.
- Progress remains on the device.
- Assets are bundled with the app.
- Testing happens on Android emulator first, then a physical Android phone.

## 8. User Stories

- As a toddler, I want to tap colorful objects so that I can play without reading.
- As a toddler, I want the app to speak instructions so that I know what to do.
- As a toddler, I want funny animations when I succeed so that I feel rewarded.
- As an adult, I want the app to start quickly so that I can test it during a short attention window.
- As an adult, I want the app to be local-only so that I do not need accounts, payments, or setup.
- As an adult, I want many functional mini-activities so that the app feels worth trying more than once.

## 9. Success Criteria

The MVP is successful if:

- The React Native Android app runs locally on an Android phone.
- The child can interact with at least 15 functional activities.
- The app uses spoken prompts.
- The child can play for a few minutes without the adult constantly fixing the app.
- The UI feels cute, colorful, and cartoon-like.
- Activities give immediate feedback.
- Progress or completion state persists locally after app restart.

## 10. Phased Kanban Plan

Each issue below is written as a Kanban card. Suggested columns:

- Backlog
- Ready
- In Progress
- Review
- Done

Suggested labels:

- `phase-0-foundation`
- `phase-1-core-loop`
- `phase-2-activities`
- `phase-3-polish`
- `phase-4-device-test`
- `product`
- `design`
- `frontend`
- `audio`
- `content`
- `qa`

---

# Phase 0: Product Foundation

## Issue 0.1: Define MVP Content Map

Labels: `phase-0-foundation`, `product`, `content`

### Goal

Define the first set of learning concepts and activity prompts.

### Requirements

- Create content groups for colors, numbers, shapes, animals, and routines.
- Keep all prompts English-only.
- Use short toddler-friendly wording.
- Define at least:
  - 5 colors
  - 5 numbers
  - 5 shapes
  - 8 animals/objects
  - 3 routines

### Acceptance Criteria

- A structured content list exists.
- Each concept has a display label, spoken prompt text, and suggested visual representation.
- No prompt requires reading ability.

---

## Issue 0.2: Choose Free Asset Sources and License Rules

Labels: `phase-0-foundation`, `product`, `design`, `content`

### Goal

Set rules for free visual and audio asset usage.

### Requirements

- Prefer custom CSS/SVG for simple shapes and UI.
- Prefer Kenney CC0 for UI sounds.
- Permit Pixabay sound effects only after checking license and avoiding questionable clips.
- Permit generated placeholder art for animals/objects.
- Forbid famous characters, screenshots, copied brand assets, and copyrighted cartoon art.

### Acceptance Criteria

- Asset rules are documented.
- Every external asset has source and license notes.
- No untracked copied assets enter the project.

---

## Issue 0.3: Define Visual Style Direction

Labels: `phase-0-foundation`, `design`

### Goal

Define a simple cartoon style that can be built quickly.

### Requirements

- Landscape-first Android layout.
- Bright, varied color palette.
- Rounded but not overly generic UI.
- Big tap targets.
- Minimal text.
- Cute animal/object illustrations.
- Funny feedback animations.

### Acceptance Criteria

- Style direction includes color palette, button style, character/object style, and animation mood.
- Style is feasible with CSS/SVG and simple generated/free assets.

---

# Phase 1: Core App Loop

## Issue 1.1: Build React Native Android App Shell

Labels: `phase-1-core-loop`, `frontend`

### Goal

Create the base React Native app layout for Android phone landscape use.

### Requirements

- Full-screen landscape mobile layout.
- Home/playground screen.
- Activity screen.
- Completion/reward state.
- Basic navigation between screens.
- No login.
- No parent dashboard.
- Android emulator/dev build runs successfully.

### Acceptance Criteria

- App opens directly into the child experience.
- UI fits Android phone landscape dimensions.
- Main buttons are easy to tap.
- No screen depends on cloud/backend data.
- App can be launched with the React Native Android run command.

---

## Issue 1.2: Implement Fixed Daily Path

Labels: `phase-1-core-loop`, `frontend`, `product`

### Goal

Create a simple fixed sequence of activities.

### Requirements

- App starts with the first activity in the daily path.
- Completing an activity moves to the next.
- Child can stop at any time.
- Path state persists locally.
- Path can reset for testing.

### Acceptance Criteria

- At least 5 activities can be played in sequence.
- Restarting the app keeps the current position.
- Resetting returns to the first activity.

---

## Issue 1.3: Add Local Progress Storage

Labels: `phase-1-core-loop`, `frontend`

### Goal

Store activity completion locally on the Android device.

### Requirements

- Use AsyncStorage or MMKV.
- Store completed activity IDs.
- Store current daily path position.
- Store simple attempt count if useful.
- Do not store personal child data for MVP.

### Acceptance Criteria

- Completion survives app restart.
- Data can be cleared during testing.
- App works with no internet after installation.

---

## Issue 1.4: Add TTS Prompt System

Labels: `phase-1-core-loop`, `audio`, `frontend`

### Goal

Make the app speak activity prompts.

### Requirements

- Use Android/device TTS for MVP prompts through React Native.
- Provide a central prompt function.
- Speak the activity instruction on activity start.
- Speak success and gentle retry messages.
- Keep prompts short.

### Acceptance Criteria

- User hears the prompt when an activity starts.
- User hears feedback after correct or incorrect actions.
- App still works if TTS is unavailable, using visual feedback.

---

# Phase 2: Functional Activities

## Issue 2.1: Tap the Correct Object Activity

Labels: `phase-2-activities`, `frontend`, `content`

### Goal

Create a reusable activity where the child taps the correct object.

### Requirements

- Show 2-4 large objects.
- Speak a prompt such as "Tap the red circle."
- Detect correct object.
- Show success animation.
- Give gentle retry feedback for wrong taps.

### Acceptance Criteria

- Activity works for colors, shapes, and animals.
- At least 4 content variations exist.
- Correct and incorrect taps produce different feedback.

---

## Issue 2.2: Match Object to Object Activity

Labels: `phase-2-activities`, `frontend`, `content`

### Goal

Create a simple matching activity.

### Requirements

- Show a target object.
- Show 2-4 answer objects.
- Child taps or drags the matching object.
- Use visual and audio feedback.

### Acceptance Criteria

- At least 3 content variations exist.
- Matching logic is reusable.
- Interaction is simple enough for a toddler with adult support.

---

## Issue 2.3: Match Sound or Word to Picture Activity

Labels: `phase-2-activities`, `frontend`, `audio`, `content`

### Goal

Create an activity where the app says a word and the child selects the picture.

### Requirements

- Speak one word or short prompt.
- Show 2-4 pictures.
- Child selects the correct picture.
- Include replay prompt button.

### Acceptance Criteria

- At least 4 variations exist.
- Replay prompt works.
- Activity does not require reading.

---

## Issue 2.4: Count Objects Activity

Labels: `phase-2-activities`, `frontend`, `content`

### Goal

Create a counting activity for numbers 1-5.

### Requirements

- Show 1-5 repeated objects.
- Ask "How many?"
- Provide number choices or tap-to-count interaction.
- Speak numbers as feedback.

### Acceptance Criteria

- Numbers 1 through 5 are supported.
- At least 5 variations exist.
- Success animation plays after correct answer.

---

## Issue 2.5: Find Color or Shape Activity

Labels: `phase-2-activities`, `frontend`, `content`

### Goal

Create a focused activity for recognizing colors and shapes.

### Requirements

- Show multiple color/shape options.
- Ask for one target.
- Use oversized tappable options.
- Include varied combinations.

### Acceptance Criteria

- At least 5 color variations exist.
- At least 5 shape variations exist.
- Incorrect answer does not block the child harshly.

---

## Issue 2.6: Simple Drag and Drop Activity

Labels: `phase-2-activities`, `frontend`, `content`

### Goal

Create a simple drag-and-drop interaction for problem-solving.

### Requirements

- Drag an object to a target.
- Use forgiving hit areas.
- Snap object into place on success.
- Play success sound/animation.

### Acceptance Criteria

- Works on Android touch input.
- At least 3 variations exist.
- Dragging feels forgiving, not precise.

---

## Issue 2.7: Routine Mini-Game Activity

Labels: `phase-2-activities`, `frontend`, `content`

### Goal

Create one simple daily routine game.

### Requirements

- Use routines such as brush teeth, wash hands, or clean up toys.
- Child completes 2-3 steps.
- Each step uses tap or drag interaction.
- Use short prompts and visual cues.

### Acceptance Criteria

- At least one routine is fully playable.
- The routine has a clear start, middle, and success state.
- The interaction is simple enough for co-play.

---

# Phase 3: Cartoon Polish and Delight

## Issue 3.1: Add Cute Playground Home Screen

Labels: `phase-3-polish`, `design`, `frontend`

### Goal

Make the app feel like a cartoon playground instead of a menu.

### Requirements

- Show friendly animals/objects.
- Include a large play button.
- Include small access to free-play areas.
- Avoid reading-heavy UI.

### Acceptance Criteria

- Home screen feels child-facing.
- Adult can start play in one tap.
- Visuals feel consistent with activity screens.

---

## Issue 3.2: Add Success, Retry, and Surprise Animations

Labels: `phase-3-polish`, `design`, `frontend`, `audio`

### Goal

Add delight after interactions.

### Requirements

- Success: bounce, sparkle, star, or confetti animation.
- Retry: gentle wiggle or soft hint, not scary.
- Surprise: occasional funny object animation after success.
- Pair animations with sound effects.

### Acceptance Criteria

- Correct answer feels rewarding.
- Wrong answer feels gentle.
- Animations do not slow down the next activity.

---

## Issue 3.3: Add Free Sound Effects

Labels: `phase-3-polish`, `audio`

### Goal

Improve feedback with free local sound effects.

### Requirements

- Add tap/click sound.
- Add success sound.
- Add retry sound.
- Add transition sound.
- Keep volume toddler-friendly.

### Acceptance Criteria

- Sound effects play reliably on Android.
- Sounds are not harsh or startling.
- All external sound files have source/license notes.

---

## Issue 3.4: Add Activity Variety and Rotation

Labels: `phase-3-polish`, `product`, `content`, `frontend`

### Goal

Make the MVP feel like it has many activities.

### Requirements

- Reuse templates with different content.
- Include at least 15 functional activities.
- Target stretch goal of 20-30 activities if time permits.
- Mix activity types in the fixed path.

### Acceptance Criteria

- Child does not see the same interaction repeatedly in the first few minutes.
- Activity path includes colors, numbers, shapes, animals, and routines.
- All activities are functional, not placeholders.

---

# Phase 4: Android Device Testing

## Issue 4.1: Test on Android Emulator

Labels: `phase-4-device-test`, `qa`

### Goal

Verify the MVP works in an Android emulator before testing on a physical device.

### Requirements

- Launch an Android emulator.
- Install/run the React Native app on the emulator.
- Test landscape layout.
- Test touch interactions.
- Test TTS.
- Test sound effects.
- Test local progress persistence.

### Acceptance Criteria

- App is usable on the emulator.
- No important buttons are too small.
- No screen requires desktop layout.
- Core screens are usable in landscape.
- TTS or fallback visual prompts work.

---

## Issue 4.2: Test on Physical Android Phone

Labels: `phase-4-device-test`, `qa`

### Goal

Verify the MVP works on the real target device.

### Requirements

- Enable USB debugging on the Android phone.
- Install/run the React Native app on the phone.
- Test landscape layout.
- Test touch interactions.
- Test TTS.
- Test sound effects.
- Test local progress persistence after app restart.

### Acceptance Criteria

- App is usable on the target Android phone.
- TTS works with the installed Android voice.
- Touch interactions feel comfortable for toddler use.
- Core screens are usable in landscape.
- App can be restarted without losing daily path progress.

---

## Issue 4.3: Toddler Trial Session

Labels: `phase-4-device-test`, `product`, `qa`

### Goal

Observe whether the child enjoys the app for a few minutes.

### Requirements

- Adult sits nearby.
- Child tries the app without heavy instruction.
- Observe confusion, delight, boredom, repeated taps, and favorite activities.
- Do not measure success like a school test.

### Acceptance Criteria

- Child interacts with at least 3 activities.
- Adult can identify what confused the child.
- Adult can identify at least one activity or animation the child enjoyed.
- Notes are captured for next iteration.

---

## Issue 4.4: First Iteration Fix Pass

Labels: `phase-4-device-test`, `product`, `frontend`, `design`, `qa`

### Goal

Improve the MVP based on the first child trial.

### Requirements

- Fix any touch target problems.
- Simplify confusing prompts.
- Remove or change boring activities.
- Increase delight where the child responded positively.
- Keep scope small.

### Acceptance Criteria

- The app is easier for the child to use after the first trial.
- At least 3 observed issues are addressed.
- The app remains local-only and free.

---

## 11. Initial Release Definition

The first MVP release is complete when:

- It runs locally on an Android phone.
- It includes a cartoon home/playground screen.
- It includes a fixed daily path.
- It includes at least 15 functional activities.
- It supports colors, numbers, shapes, animals, and at least one routine.
- It uses TTS prompts.
- It uses simple sound effects.
- It stores progress locally.
- It has been tested once with the child.

## 12. Open Decisions

- Whether to use React Native CLI or Expo development builds for the first Android app.
- Whether generated visual assets are acceptable for the first prototype or whether all visuals should be custom CSS/SVG/free-pack based.
- Whether background music should be included or skipped.
- Whether the first routine should be brush teeth, wash hands, or clean up toys.

## 13. Recommended Next Step

Start with Phase 0 and lock the content map before implementation. Then scaffold a React Native Android app, run it in an Android emulator, and test on the physical Android phone once the first activity loop works.
