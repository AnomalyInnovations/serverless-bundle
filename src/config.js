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
    // Exclude aws-sdk since it's available in the Lambda runtime
    forceExclude: ["aws-sdk"],
    // Set non Webpack compatible packages as externals
    externals: ["knex", "sharp"],
    // Set default file extensions to use the raw-loader with
    rawFileExtensions: ["pem", "txt"]
  }
};
