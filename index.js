"use strict";

const path = require("path");
const ServerlessWebpack = require("serverless-webpack");

const config = require("./src/config");

function getWebpackConfigPath(servicePath) {
  return path.relative(servicePath, __dirname) + "/src/webpack.config.js";
}

function applyCustomOptions(custom, config) {
  if (custom.webpack) {
    throw "serverless-webpack config detected in serverless.yml. serverless-bundle is not compatible with serverless-webpack.";
  }

  custom.webpack = {
    packagerOptions: config.options.packagerOptions,
    webpackConfig: getWebpackConfigPath(config.servicePath),
    includeModules: {
      forceExclude: ["aws-sdk"],
      forceInclude: config.options.forceInclude
    }
  };
}

function applyConfigOptions(config, options, servicePath) {
  config.servicePath = servicePath;
  config.options = Object.assign(config.options, options);
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

      applyConfigOptions(config, service.custom.bundle, servicePath);
      applyCustomOptions(service.custom, config);
    }.bind(this);
  }
}

module.exports = ServerlessPlugin;
