module.exports = {
  projects: [
    // Backend tests configuration
    {
      displayName: 'backend',
      testEnvironment: 'node',
      roots: ['<rootDir>/apps/backend'],
      testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/*.spec.ts',
      ],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: '<rootDir>/apps/backend/tsconfig.json',
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/backend/src/$1',
      },
      collectCoverageFrom: [
        'apps/backend/src/**/*.ts',
        '!apps/backend/src/**/*.d.ts',
        '!apps/backend/src/**/__tests__/**',
        '!apps/backend/src/index.ts',
      ],
      coverageDirectory: '<rootDir>/coverage/backend',
      coverageThresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
      setupFilesAfterEnv: ['<rootDir>/apps/backend/jest.setup.ts'],
    },

    // Frontend tests configuration
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/apps/frontend'],
      testMatch: [
        '**/__tests__/**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
          tsconfig: '<rootDir>/apps/frontend/tsconfig.json',
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/frontend/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/apps/frontend/__mocks__/fileMock.js',
      },
      collectCoverageFrom: [
        'apps/frontend/src/**/*.{ts,tsx}',
        '!apps/frontend/src/**/*.d.ts',
        '!apps/frontend/src/**/__tests__/**',
        '!apps/frontend/src/**/*.stories.{ts,tsx}',
      ],
      coverageDirectory: '<rootDir>/coverage/frontend',
      coverageThresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
      setupFilesAfterEnv: ['<rootDir>/apps/frontend/jest.setup.ts'],
    },
  ],

  // Global settings
  verbose: true,
  collectCoverage: process.env.CI === 'true',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  maxWorkers: '50%',
  testTimeout: 10000,
};
