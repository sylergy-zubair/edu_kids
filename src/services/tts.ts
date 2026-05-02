import Tts from 'react-native-tts';

let ready = false;

export async function initTts(): Promise<void> {
  if (ready) {
    return;
  }
  try {
    await Tts.getInitStatus();
    try {
      await Tts.setDefaultLanguage('en-US');
    } catch {
      try {
        await Tts.setDefaultLanguage('en');
      } catch {
        /* use engine default locale */
      }
    }
    await Tts.setDefaultRate(0.42).catch(() => {});
    await Tts.setDefaultPitch(1.05).catch(() => {});
    ready = true;
  } catch {
    ready = false;
  }
}

export async function speak(text: string): Promise<void> {
  try {
    await initTts();
    if (!ready) {
      return;
    }
    await Tts.stop();
    await Tts.speak(text);
  } catch {
    /* visual-only fallback */
  }
}

export async function stopSpeak(): Promise<void> {
  try {
    await Tts.stop();
  } catch {
    /* ignore */
  }
}
