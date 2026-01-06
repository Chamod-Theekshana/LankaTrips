const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@': './src',
    },
  },
  watchFolders: [path.resolve(__dirname)],
  watcher: {
    watchman: {
      deferStates: ['hg.update'],
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);