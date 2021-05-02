import type { InitialOptionsTsJest } from "ts-jest/dist/types";
import { defaults as tsjPreset } from "ts-jest/presets";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageProvider: "v8",
  rootDir: "./src",
  roots: ["<rootDir>"],
  // ts-jest Note: presets use testMatch, like Jest does in its defaults. If you want to use testRegex instead in your configuration, you MUST set testMatch to null or Jest will bail.
  testMatch: ["**/__tests__/**/*.+(ts|js)", "**/?(*.)+(spec|test).+(ts|js)"],
  transform: {
    ...tsjPreset.transform,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  slowTestThreshold: 10,
  // testTimeout: 10000,
};

export default config;
