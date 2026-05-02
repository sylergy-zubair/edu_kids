import { Platform } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

function playRaw(name: string, ext: string) {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    SoundPlayer.playSoundFile(name, ext);
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
