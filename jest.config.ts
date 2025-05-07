import nextJest from 'next/jest';
import type { Config } from '@jest/types';

const createJestConfig = nextJest({
  dir: './',
});

/** 2. Ta config Jest personnalisée */
const customJestConfig: Config.InitialOptions = {
  // Laisse Next gérer le preset Babel => plus besoin de 'preset: ts-jest'
  testEnvironment: 'jsdom',

  testMatch: ['<rootDir>/src/**/*.{test,spec}.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coverage
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: { branches: 0, functions: 0, lines: 0, statements: 0 },
  },
};

/** 3. Exporte la config fusionnée */
export default createJestConfig(customJestConfig);
