"use strict";

module.exports = {
  servicePath: "",
  nodeVersion: null,
  options: {
    aliases: [],
    stats: false,
    caching: true,
    linting: true,
    esbuild: false,
    fixPackages: [],
    packager: "npm",
    copyFiles: null,
    concatText: null,
    sourcemaps: true,
    forceInclude: null,
    excludeFiles: null,
    ignorePackages: [],
    packagerOptions: {},
    generateStatsFiles: false,
    tsConfig: "tsconfig.json",
    forceExclude: [],
    disableForkTsChecker: false,
    // Set non Webpack compatible packages as externals
    // Or if we want to exclude all packages in the node_modules:
    // externals: "all"
    externals: ["knex", "sharp"],
    // Set default file extensions to use the raw-loader with
    rawFileExtensions: ["pem", "txt"],
    minifyOptions: {},
    experiments: {},
  },
};
