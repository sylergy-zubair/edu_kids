import { Platform } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

/** PRD 3.3 — toddler-friendly level (app mix, not device volume). */
const SFX_VOLUME = 0.4;

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

export function playSuccessSound() {
  playRaw('success', 'wav');
}

export function playRetrySound() {
  playRaw('retry', 'wav');
}

export function playTransitionSound() {
  playRaw('transition', 'wav');
}
