"use strict";

const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: ["@babel/preset-env"],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ],
  babelrc: false,
  configFile: false
});
