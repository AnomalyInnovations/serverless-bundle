"use strict";

const path = require("path");
const ServerlessWebpack = require("serverless-webpack");

const config = require("./src/config");

function getWebpackConfigPath(servicePath) {
  return path.relative(servicePath, __dirname) + "/src/webpack.config.js";
}

function getConfig(custom, servicePath) {
  const webpackConfigPath = getWebpackConfigPath(servicePath);

  if (custom) {
    if (custom.webpack) {
      throw "serverless-webpack config detected in serverless.yml. serverless-bundle is not compatible with serverless-webpack.";
    }

    custom.webpack = {
      webpackConfig: webpackConfigPath
    };

    return custom;
  }

  return {
    webpack: {
      webpackConfig: webpackConfigPath
    }
  };
}

class ServerlessPlugin extends ServerlessWebpack {
  constructor(serverless, options) {
    super(serverless, options);

    this.serverless = serverless;
    this.options = options;

    this.hooks["before:webpack:validate:validate"] = function() {
      const service = this.serverless.service;
      const servicePath = this.serverless.config.servicePath;

      service.custom = getConfig(service.custom, servicePath);

      config.servicePath = servicePath;
      config.options = Object.assign(config.options, service.custom.bundle);
    }.bind(this);
  }
}

module.exports = ServerlessPlugin;
