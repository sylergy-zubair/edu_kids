/**
 * Generates tiny placeholder WAVs for Android res/raw (testing / fallback).
 * PRD prefers replacing with Kenney CC0 UI Audio — see docs/assets-and-licenses.md
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'raw');

function pcmWave(samples, sampleRate = 22050) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), offset);
    offset += 2;
  }
  return buffer;
}

function sineTone(durationSec, freq, vol = 0.25, sampleRate = 22050) {
  const n = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * vol;
  }
  return samples;
}

function write(name, samples) {
  const buf = pcmWave(samples);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${name}.wav`), buf);
}

const sr = 22050;

write(
  'tap',
  sineTone(0.04, 660, 0.18),
);
write(
  'success',
  (() => {
    const n = Math.floor(sr * 0.12);
    const samples = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const bend = 1 + (i / n) * 0.2;
      samples[i] =
        Math.sin(2 * Math.PI * 523 * bend * t) * 0.2 * (1 - i / n);
    }
    return samples;
  })(),
);
write(
  'retry',
  (() => {
    const n = Math.floor(sr * 0.15);
    const samples = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      samples[i] = Math.sin(2 * Math.PI * 220 * t) * 0.12 * Math.exp(-2.5 * t);
    }
    return samples;
  })(),
);
write(
  'transition',
  sineTone(0.06, 440, 0.16),
);

/** Short noise + thump (mosquito squash / slap). Deterministic “noise” for stable builds. */
function slapSamples(sampleRate = 22050) {
  const dur = 0.085;
  const n = Math.floor(sampleRate * dur);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-42 * t);
    const r =
      Math.sin(i * 12.9898) * 43758.5453 -
      Math.floor(Math.sin(i * 12.9898) * 43758.5453);
    const noise = (r * 2 - 1) * 0.42;
    const thump =
      Math.sin(2 * Math.PI * 85 * t) * 0.38 * Math.exp(-22 * t);
    const crack =
      i < 100
        ? Math.sin(2 * Math.PI * 1400 * t) * 0.22 * (1 - i / 100)
        : 0;
    samples[i] = Math.max(-1, Math.min(1, (noise + thump + crack) * env));
  }
  return samples;
}

write('slap', slapSamples(sr));

console.log('Wrote wavs to', outDir);
