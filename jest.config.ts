// import type { Config } from "@jest/types";
import type { InitialOptionsTsJest } from "ts-jest/dist/types";
// import { defaults as tsjPreset } from "ts-jest/presets";
import { jsWithTs as tsjPreset } from "ts-jest/presets";
// import { jsWithBabel as tsjPreset } from 'ts-jest/presets')

const config: InitialOptionsTsJest = {
  preset: "@shelf/jest-mongodb",
  // preset: "ts-jest",
  testEnvironment: "node",
  // coverageProvider: "v8",
  rootDir: "./src",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.+(ts|js)", "**/?(*.)+(spec|test).+(ts|js)"],
  transform: {
    ...tsjPreset.transform,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  slowTestThreshold: 10,
  // testTimeout: 10000,
  watchPathIgnorePatterns: ["globalConfig"],
};

export default config;
