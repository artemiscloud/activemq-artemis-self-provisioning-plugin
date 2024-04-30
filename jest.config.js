module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@patternfly|@openshift-console\\S*?|react-tokens|@novnc|@popperjs|lodash|monaco-editor|react-monaco-editor|byte-size|lodash-es)/.*)',
  ],
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': '<rootDir>/styleMock.js',
    '@console/*': '<rootDir>/__mocks__/dynamic-plugin-sdk.ts',
    '@openshift-console/*': '<rootDir>/__mocks__/dynamic-plugin-sdk.ts',
    'react-i18next': '<rootDir>/__mocks__/react-i18next.ts',
  },
  modulePaths: ['<rootDir>'],
  roots: ['<rootDir>/src', '<rootDir>/api-server'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  coveragePathIgnorePatterns: [
    'node_modules',
    '__mocks__',
    'setupJest.ts',
    '<rootDir>/src/test-utils.tsx',
    'storiesHelpers.ts',
    '.*.stories.tsx',
  ],
};
