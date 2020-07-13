const npmInstall = require("./npm-install");
const clearNpmCache = require("./clear-npm-cache");
const runSlsCommand = require("./run-sls-command");
const runJestCommand = require("./run-jest-command");
const removeNodeModules = require("./remove-node-modules");

const errorRegex = /(Error|Exception) ---/;

module.exports = {
  npmInstall,
  errorRegex,
  clearNpmCache,
  runSlsCommand,
  runJestCommand,
  removeNodeModules
};
