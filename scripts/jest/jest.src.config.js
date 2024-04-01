const config = {
  transform: {
    // '^.+\\.(t|j)s$': require.resolve('./transformer.js')
    '^.+\\.(t)s$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: './tsconfig.test.json',
    },
  },
  testMatch: [
    // '<rootDir>/packages/**/test/?(*.)+(spec|test).js',
    '<rootDir>/packages/woop-core/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-account/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-network/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-crypto/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-contract/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-transaction/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-staking/test/?(*.)+(spec|test).ts',
    '<rootDir>/packages/woop-utils/test/?(*.)+(spec|test).ts',
  ],
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    'cross-fetch': 'jest-fetch-mock',
  },
  testURL: 'http://localhost',
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  rootDir: process.cwd(),
  roots: ['<rootDir>/packages', '<rootDir>/scripts', '<rootDir>/e2e'],
  collectCoverageFrom: [
    // 'packages/!(woop-core)/src/**/*.ts',
    'packages/woop-core/src/**/*.ts',
    'packages/woop-utils/src/**/*.ts',
    'packages/woop-crypto/src/**/*.ts',
    'packages/woop-transaction/src/**/*.ts',
    'packages/woop-staking/src/**/*.ts',
    'packages/woop-contract/src/**/*.ts',
  ],
  // timers: 'fake',
  setupFiles: ['<rootDir>/scripts/jest/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/scripts/jest/jest.framework-setup.js',
  testEnvironment: process.env.NODE_ENV === 'development' ? 'node' : 'jsdom',
  collectCoverage: true,
  automock: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

module.exports = config;
