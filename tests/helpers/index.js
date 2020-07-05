const clearNpmCache = require("./clear-npm-cache");
const npmInstall = require("./npm-install");
const removeNodeModules = require("./remove-node-modules");
const runSlsCommand = require("./run-sls-command");

const errorRegex = /(Error|Exception) ---/;

module.exports = {
  clearNpmCache,
  npmInstall,
  removeNodeModules,
  runSlsCommand,
  errorRegex
};
