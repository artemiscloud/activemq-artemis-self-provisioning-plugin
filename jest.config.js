module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!@patternfly/react-icons|@patternfly/react-tokens|@novnc|@popperjs|lodash|monaco-editor|react-monaco-editor|byte-size)',
  ],
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': '<rootDir>/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  coveragePathIgnorePatterns: [
    'node_modules',
    '__mocks__',
    'setupJest.ts',
    '<rootDir>/src/ProofOfConcepts',
    '<rootDir>/src/test-utils.tsx',
    'storiesHelpers.ts',
    '.*.stories.tsx',
  ],
};
