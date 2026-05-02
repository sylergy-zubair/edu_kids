import Tts from 'react-native-tts';

let ready = false;

export async function initTts(): Promise<void> {
  if (ready) {
    return;
  }
  try {
    await Tts.getInitStatus();
    Tts.setDefaultRate(0.42);
    Tts.setDefaultPitch(1.05);
    ready = true;
  } catch {
    ready = false;
  }
}

export async function speak(text: string): Promise<void> {
  try {
    await initTts();
    Tts.stop();
    Tts.speak(text);
  } catch {
    /* visual-only fallback */
  }
}

export function stopSpeak(): void {
  try {
    Tts.stop();
  } catch {
    /* ignore */
  }
}
