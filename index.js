"use strict";

const path = require("path");
const pkgUp = require("pkg-up");
const ServerlessWebpack = require("serverless-webpack");

const config = require("./src/config");

function getWebpackConfigPath(servicePath) {
  return path.relative(servicePath, __dirname) + "/src/webpack.config.js";
}

function applyWebpackOptions(custom, config) {
  if (custom.webpack) {
    throw "serverless-webpack config detected in serverless.yml. serverless-bundle is not compatible with serverless-webpack.";
  }

  custom.webpack = {
    packager: config.options.packager,
    concurrency: config.options.concurrency,
    packagerOptions: config.options.packagerOptions,
    webpackConfig: getWebpackConfigPath(config.servicePath),
    includeModules: {
      forceExclude: config.options.forceExclude,
      forceInclude: config.options.forceInclude,
      nodeModulesRelativeDir:
        config.options.nodeModulesRelativeDir != null
          ? config.options.nodeModulesRelativeDir
          : "./",
      // Generate relative path for the package.json
      // For cases where the services are nested and don't have their own package.json
      // Traverse up the tree to find the path to the nearest package.json
      //
      // Certain plugins like serverless-plugin-typescript change the cwd, so when
      // searching, reset the cwd to the service path
      packagePath: path.relative(
        config.servicePath,
        pkgUp.sync({ cwd: config.servicePath })
      ),
    },
    excludeFiles: config.options.excludeFiles,
    excludeRegex: /bundle_stats\.(html|json)$/,
    keepOutputDirectory: config.options.generateStatsFiles,
  };
}

function applyUserConfig(config, userConfig, servicePath, runtime) {
  config.servicePath = servicePath;

  // Default to Node 12 if no runtime found
  const runtimeVersion =
    Number.parseInt((runtime || "").replace("nodejs", ""), 10) || 12;

  // Force exclude aws-sdk for versions below Node 18
  if (runtimeVersion < 18) {
    config.options.forceExclude.push("aws-sdk");
  }

  // Concat forceExclude if provided
  if (userConfig.forceExclude) {
    userConfig.forceExclude = config.options.forceExclude.concat(
      userConfig.forceExclude
    );
  }

  // Concat externals if a list of packages are provided
  if (userConfig.externals && Array.isArray(userConfig.externals)) {
    userConfig.externals = config.options.externals.concat(
      userConfig.externals
    );
  }

  // Concat rawFileExtensions if provided
  if (userConfig.rawFileExtensions) {
    userConfig.rawFileExtensions = config.options.rawFileExtensions.concat(
      userConfig.rawFileExtensions
    );
  }

  Object.assign(config.options, userConfig);

  config.nodeVersion = runtimeVersion;
}

class ServerlessPlugin extends ServerlessWebpack {
  constructor(serverless, options) {
    super(serverless, options);

    this.serverless = serverless;
    this.options = options;

    this.hooks["before:webpack:validate:validate"] = function () {
      const service = this.serverless.service;
      const servicePath = this.serverless.config.servicePath;

      service.custom = service.custom || {};

      applyUserConfig(
        config,
        service.custom.bundle || {},
        servicePath,
        service.provider.runtime
      );
      applyWebpackOptions(service.custom, config);
    }.bind(this);
  }
}

module.exports = ServerlessPlugin;
