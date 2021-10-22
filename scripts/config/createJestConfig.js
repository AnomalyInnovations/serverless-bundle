/* eslint-disable */
/**
 * Based on https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/utils/createJestConfig.js
 */
"use strict";

const fs = require("fs");
const chalk = require("chalk");
const paths = require("./paths");

module.exports = (resolve, rootDir) => {
  const config = {
    collectCoverageFrom: ["./**/*.{js,jsx,ts,tsx}"],

    preset: "ts-jest",
    globals: {
      "ts-jest": {
        babelConfig: {
          presets: [require.resolve("@babel/preset-env")]
        }
      }
    },

    setupFiles: [
      require.resolve("core-js/stable"),
      require.resolve("regenerator-runtime/runtime")
    ],

    testMatch: [
      "<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    transform: {
      "^.+\\.(js|jsx)$": resolve("scripts/config/babelJestTransform.js")
    },
    transformIgnorePatterns: [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$"
    ],
    testEnvironment: "node"
  };
  if (rootDir) {
    config.rootDir = rootDir;
  }
  const overrides = Object.assign({}, require(paths.appPackageJson).jest);
  const supportedKeys = [
    "clearMocks",
    "collectCoverageFrom",
    "coveragePathIgnorePatterns",
    "coverageReporters",
    "coverageThreshold",
    "displayName",
    "extraGlobals",
    "globalSetup",
    "globalTeardown",
    "reporters",
    "resetMocks",
    "resetModules",
    "restoreMocks",
    "setupFilesAfterEnv",
    "snapshotSerializers",
    "testMatch",
    "testResultsProcessor",
    "transform",
    "transformIgnorePatterns",
    "watchPathIgnorePatterns",
    "moduleNameMapper",
    "testSequencer",
  ];
  if (overrides) {
    supportedKeys.forEach(key => {
      if (overrides.hasOwnProperty(key)) {
        if (Array.isArray(config[key]) || typeof config[key] !== "object") {
          // for arrays or primitive types, directly override the config key
          config[key] = overrides[key];
        } else {
          // for object types, extend gracefully
          config[key] = Object.assign({}, config[key], overrides[key]);
        }

        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      const isOverridingSetupFile =
        unsupportedKeys.indexOf("setupFilesAfterEnv") > -1;

      console.error(
        chalk.red(
          "\nOut of the box, serverless-bundle only supports overriding " +
            "these Jest options:\n\n" +
            supportedKeys.map(key => chalk.bold("  \u2022 " + key)).join("\n") +
            ".\n\n" +
            "These options in your package.json Jest configuration " +
            "are not currently supported by serverless-bundle:\n\n" +
            unsupportedKeys
              .map(key => chalk.bold("  \u2022 " + key))
              .join("\n") +
            "\n\nIf you wish to override other Jest options, " +
            "consider using serverless-webpack directly instead.\n"
        )
      );

      process.exit(1);
    }
  }
  // Include dotenv env variables
  require("dotenv").config({
    path: "./.env"
  });
  return config;
};
