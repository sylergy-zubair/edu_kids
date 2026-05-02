const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/private/defaults/exclusionList')
  .default;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    // Native build outputs (e.g. Async Storage KSP under android/build) are not JS;
    // watching them triggers ENOENT on Windows when folders are missing or removed.
    blockList: exclusionList([
      /.*[/\\]node_modules[/\\].*[/\\]android[/\\]build.*/,
      /.*[/\\]node_modules[/\\].*[/\\]ios[/\\]build.*/,
    ]),
  },
});
