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
    packagerOptions: config.options.packagerOptions,
    webpackConfig: getWebpackConfigPath(config.servicePath),
    includeModules: {
      forceExclude: ["aws-sdk"],
      forceInclude: config.options.forceInclude,
      // Generate relative path for the package.json
      // For cases where the services are nested and don't have their own package.json
      // Traverse up the tree to find the path to the nearest package.json
      packagePath: path.relative(config.servicePath, pkgUp.sync())
    }
  };
}

function applyUserConfig(config, userConfig, servicePath, runtime) {
  config.servicePath = servicePath;
  config.options = Object.assign(config.options, userConfig);
  // Default to Node 10 if no runtime found
  config.nodeVersion =
    Number.parseInt((runtime || "").replace("nodejs", ""), 10) || 10;
}

class ServerlessPlugin extends ServerlessWebpack {
  constructor(serverless, options) {
    super(serverless, options);

    this.serverless = serverless;
    this.options = options;

    this.hooks["before:webpack:validate:validate"] = function() {
      const service = this.serverless.service;
      const servicePath = this.serverless.config.servicePath;

      service.custom = service.custom || {};

      applyUserConfig(
        config,
        service.custom.bundle,
        servicePath,
        service.provider.runtime
      );
      applyWebpackOptions(service.custom, config);
    }.bind(this);
  }
}

module.exports = ServerlessPlugin;
