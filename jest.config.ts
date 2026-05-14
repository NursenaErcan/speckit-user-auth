import type { Config } from "jest";

const base: Partial<Config> = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true
};

const config: Config = {
  projects: [
    {
      ...base,
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/*.test.ts"]
    },
    {
      ...base,
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/*.test.ts"]
    },
    {
      ...base,
      displayName: "contract",
      testMatch: ["<rootDir>/tests/contract/**/*.test.ts"]
    }
  ],
  collectCoverageFrom: [
    "src/domain/services/**/*.ts",
    "src/domain/entities/**/*.ts",
    "src/domain/value-objects/**/*.ts"
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80
    }
  }
};

export default config;
