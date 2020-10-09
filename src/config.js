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
    concatText: null,
    sourcemaps: true,
    forceInclude: null,
    ignorePackages: [],
    packagerOptions: {},
    tsConfig: "tsconfig.json",
    // Exclude aws-sdk since it's available in the Lambda runtime
    forceExclude: ["aws-sdk"],
    // Set non Webpack compatible packages as externals
    // Or if we want to exclude all packages in the node_modules:
    // externals: "all"
    externals: ["knex", "sharp"],
    // Set default file extensions to use the raw-loader with
    rawFileExtensions: ["pem", "txt"]
  }
};
