/**
 * Launches the React Native CLI with a valid JAVA_HOME on Windows.
 * Ignores a broken JAVA_HOME (e.g. old Android Studio\jre path).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function tryJavaHome(h) {
  if (!h || typeof h !== 'string') {
    return null;
  }
  const normalized = h.replace(/["']$/, '').replace(/[/\\]$/, '');
  const java = path.join(normalized, 'bin', 'java.exe');
  return fs.existsSync(java) ? normalized : null;
}

function findJavaHome() {
  const fromEnv = tryJavaHome(process.env.JAVA_HOME);
  if (fromEnv) {
    return fromEnv;
  }

  const adoptium = path.join('C:\\Program Files', 'Eclipse Adoptium');
  if (fs.existsSync(adoptium)) {
    const dirs = fs
      .readdirSync(adoptium)
      .filter((n) => n.startsWith('jdk-17') || n.startsWith('jdk-21'))
      .sort()
      .reverse();
    for (const name of dirs) {
      const found = tryJavaHome(path.join(adoptium, name));
      if (found) {
        return found;
      }
    }
  }

  const studioJbr = path.join(
    'C:\\Program Files',
    'Android',
    'Android Studio',
    'jbr',
  );
  const fromJbr = tryJavaHome(studioJbr);
  if (fromJbr) {
    return fromJbr;
  }

  const java8 = path.join('C:\\Program Files', 'Java', 'jdk1.8.0_202');
  if (tryJavaHome(java8)) {
    console.warn(
      'Warning: only Java 8 found. React Native 0.85 needs JDK 17+. Install Temurin 17.',
    );
  }

  return null;
}

const javaHome = findJavaHome();
if (!javaHome) {
  console.error(
    'No usable JDK found. Install Eclipse Temurin 17 (https://adoptium.net/) or set JAVA_HOME to a JDK 17+ install with bin\\java.exe.',
  );
  process.exit(1);
}

process.env.JAVA_HOME = javaHome;

const root = path.join(__dirname, '..');
const cli = path.join(root, 'node_modules', 'react-native', 'cli.js');
const polyfill = path.join(__dirname, 'util-styletext-polyfill.cjs');
const args = process.argv.slice(2);

const result = spawnSync(
  process.execPath,
  ['--require', polyfill, cli, ...args],
  { stdio: 'inherit', cwd: root, env: process.env },
);

process.exit(result.status === null ? 1 : result.status);
