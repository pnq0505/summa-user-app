const expoPreset = require('jest-expo/jest-preset');
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = () => ({
  ...expoPreset,
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  verbose: true,
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    ...tsjPreset.transform,
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native' +
      '|@react-native-community' +
      '|@react-navigation' +
      '|react-native-fs' +
      '|react-native-camera' +
      '|@expo' +
      '|expo-gl' +
      '|expo-modules-core' +
      // '|expo' +
      '|three' +
      '|expo-three' +
      '|expo-2d-context' +
      '|expo-asset' +
      '|expo-constants' +
      // '|expo-three-orbit-controls' +
      '|axios' +
      ')',
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'babel-jest',
  },
  rootDir: './',
  setupFiles: [
    './jest.setup.js',
    // './node_modules/react-native-gesture-handler/jestSetup.js',
    'jest-useragent-mock',
  ],
  globals: {
    __DEV__: true,
  },
});
