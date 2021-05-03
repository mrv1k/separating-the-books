import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageProvider: "v8",
  rootDir: "./src",
  roots: ["<rootDir>"],
  // ts-jest Note: presets use testMatch, like Jest does in its defaults. If you want to use testRegex instead in your configuration, you MUST set testMatch to null or Jest will bail.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  slowTestThreshold: 10,
  // testTimeout: 10000,
};

export default config;
