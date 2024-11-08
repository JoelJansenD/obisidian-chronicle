module.exports = {
  preset: 'ts-jest',                // Use ts-jest to handle TypeScript files
  testEnvironment: 'node',           // Use Node.js environment for testing (you can switch to 'jsdom' if needed)
  roots: ['src/'],  // Directories to look for source and test files
  testMatch: ['**/*.test.ts'],    // Pattern to find test files (adjust as needed)
  moduleDirectories: ['node_modules', 'src'],     // Allow Jest to resolve modules from /src/
  moduleNameMapper: {                 // Map paths (if you're using TypeScript path aliases)
    '^obsidian$': 'src/__mocks__/obsidian.ts',
    '^@src/(.*)$': 'src/$1', // Example alias: import { xyz } from '@src/xyz' maps to /src/xyz.ts
  },
};
