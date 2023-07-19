module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$',
  transformIgnorePatterns: ['/node_modules/(?!@patternfly/react-styles)'],
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': '<rootDir>/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'setupJest.ts',
    '<rootDir>/src/test-utils.tsx',
    '.*.stories.tsx',
  ],
};
