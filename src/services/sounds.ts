import { Platform } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

import thunderMp3 from '../assets/sounds/thunder.mp3';

/** PRD 3.3 — toddler-friendly level (app mix, not device volume). */
const SFX_VOLUME = 0.4;

/** Thunder reads a bit quiet next to visuals; keep under 1.0. */
const THUNDER_VOLUME = 0.62;

/** Animal clips are slightly louder so real recordings read clearly next to TTS. */
const ANIMAL_SFX_VOLUME = 0.52;

function playRaw(name: string, ext: string) {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    SoundPlayer.playSoundFile(name, ext);
    SoundPlayer.setVolume(SFX_VOLUME);
  } catch {
    /* optional */
  }
}

export function playTapSound() {
  playRaw('tap', 'wav');
}

/** Short slap / squash (e.g. mosquito hunt). Same mix level as other UI SFX. */
export function playSlapSound() {
  playRaw('slap', 'wav');
}

/** Thunder / lightning — bundled MP3 (Wikimedia Commons recording; see docs/assets-and-licenses.md). */
export function playThunderSound() {
  try {
    SoundPlayer.stop();
    void SoundPlayer.playAsset(thunderMp3);
    SoundPlayer.setVolume(THUNDER_VOLUME);
  } catch {
    if (Platform.OS === 'android') {
      try {
        SoundPlayer.playSoundFile('thunder', 'mp3');
        SoundPlayer.setVolume(THUNDER_VOLUME);
      } catch {
        /* optional */
      }
    }
  }
}

export function playSuccessSound() {
  playRaw('success', 'wav');
}

export function playRetrySound() {
  playRaw('retry', 'wav');
}

export function playTransitionSound() {
  playRaw('transition', 'wav');
}

/** Bundled `res/raw/{rawBaseName}.mp3` (Android). Stops any prior SoundPlayer clip. */
export function playAnimalSound(rawBaseName: string) {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    SoundPlayer.stop();
    SoundPlayer.playSoundFile(rawBaseName, 'mp3');
    SoundPlayer.setVolume(ANIMAL_SFX_VOLUME);
  } catch {
    /* optional */
  }
}

export function stopBundledSound() {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    SoundPlayer.stop();
  } catch {
    /* optional */
  }
}
