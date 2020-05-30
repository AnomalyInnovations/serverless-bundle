"use strict";

module.exports = {
  servicePath: "",
  nodeVersion: null,
  options: {
    aliases: [],
    stats: false,
    caching: true,
    linting: true,
    fixPackages: [],
    packager: "npm",
    copyFiles: null,
    sourcemaps: true,
    forceInclude: null,
    ignorePackages: [],
    packagerOptions: {},
    // Exclude "aws-sdk" since it's a built-in package and some other packages
    externals: ["aws-sdk", "knex", "sharp"]
  }
};
