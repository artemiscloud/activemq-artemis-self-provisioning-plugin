module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!@patternfly/react-icons|@patternfly/react-tokens|@novnc|@popperjs|lodash|monaco-editor|react-monaco-editor|byte-size)',
  ],
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': '<rootDir>/styleMock.js',
    '^@openshift-console/dynamic-plugin-sdk$':
      '<rootDir>/__mocks__/dynamic-plugin-sdk.ts',
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
