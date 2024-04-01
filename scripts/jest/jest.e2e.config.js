const baseConfig = require('./jest.src.config');
module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '^@woop-js/(.*)$': '<rootDir>/packages/woop-$1/src/index.ts',
    'cross-fetch': 'jest-fetch-mock',
  },
  setupTestFrameworkScriptFile: '<rootDir>/scripts/jest/jest.framework-setup.js',
  testMatch: ['<rootDir>/e2e/src/?(*.)+(spec|test|e2e).ts'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  collectCoverageFrom: [
    // 'packages/!(woop-core)/src/**/*.ts',
    'packages/woop-core/src/**/*.ts',
    'packages/woop-utils/src/**/*.ts',
    'packages/woop-crypto/src/**/*.ts',
    'packages/woop-transaction/src/**/*.ts',
  ],
  automock: false,
};
