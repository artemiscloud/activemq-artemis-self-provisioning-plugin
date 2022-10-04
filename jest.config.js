module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/style-mock.js',
    images$: '<rootDir>/__mocks__/images-mock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@patternfly/react-icons|@patternfly/react-tokens|@novnc|@popperjs|lodash|monaco-editor|react-monaco-editor|byte-size)',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-test.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '__mocks__',
    'setup-test.ts',
    // '<rootDir>/src/test-utils.tsx',
    // 'storiesHelpers.ts',
    '.*.stories.tsx'
  ]
};
