/**
 * Downloads bundled animal SFX into android/app/src/main/res/raw/.
 * Run: node scripts/fetch-animal-sfx.mjs
 *
 * Sources are documented in docs/assets-and-licenses.md (CC0 / public domain).
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.join(__dirname, '../android/app/src/main/res/raw');

/** @type {{ file: string; url: string }[]} */
const FILES = [
  {
    file: 'anim_dog.mp3',
    url: 'https://cdn.freesound.org/previews/625/625501_13366994-lq.mp3',
  },
  {
    file: 'anim_cat.mp3',
    url: 'https://cdn.freesound.org/previews/110/110011_1537422-lq.mp3',
  },
  {
    file: 'anim_cow.mp3',
    url: 'https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/cow-moo.mp3',
  },
  {
    file: 'anim_duck.mp3',
    url: 'https://cdn.freesound.org/previews/719/719115_11244040-lq.mp3',
  },
  {
    file: 'anim_sheep.mp3',
    url: 'https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/sheep-baa.mp3',
  },
  {
    file: 'anim_horse.mp3',
    url: 'https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/horse-trot.mp3',
  },
  {
    file: 'anim_lion.mp3',
    url: 'https://cdn.freesound.org/previews/611/611721_13511310-lq.mp3',
  },
  {
    file: 'anim_frog.mp3',
    url: 'https://cdn.freesound.org/previews/741/741575_9273605-lq.mp3',
  },
  {
    file: 'anim_bird.mp3',
    url: 'https://raw.githubusercontent.com/DJWoodZ/Animal-Sounds/master/src/sounds/chicken-cluck.mp3',
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'mock_lingo-fetch-animal-sfx/1.0 (educational app asset script)',
          },
        },
        (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            const loc = res.headers.location;
            file.close();
            fs.unlink(dest, () => {});
            if (!loc) {
              reject(new Error('Redirect without location'));
              return;
            }
            download(loc, dest).then(resolve).catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            file.close();
            fs.unlink(dest, () => {});
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            return;
          }
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        },
      )
      .on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  for (const { file, url } of FILES) {
    const dest = path.join(RAW_DIR, file);
    process.stdout.write(`${file} ... `);
    await download(url, dest);
    const st = fs.statSync(dest);
    if (st.size < 500) {
      throw new Error(`${file} too small (${st.size} bytes); download may have failed`);
    }
    process.stdout.write(`ok (${st.size} bytes)\n`);
  }
  console.log('Done. See docs/assets-and-licenses.md for license rows.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
