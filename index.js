"use strict";

const ServerlessWebpack = require("serverless-webpack");

const config = require("./config.js");

function getWebpackConfigPath() {
  const devPath = ".serverless_plugins";
  const isDev =
    __dirname.lastIndexOf(devPath) === __dirname.length - devPath.length;

  return isDev
    ? "./.serverless_plugins/webpack.config.js"
    : "./node_modules/serverless-bundle/webpack.config.js";
}

class ServerlessPlugin extends ServerlessWebpack {
  constructor(serverless, options) {
    serverless.service.custom = serverless.service.custom || {};
    serverless.service.custom.webpack = {
      webpackConfig: getWebpackConfigPath()
    };

    config.servicePath = serverless.config.servicePath;
    config.options = Object.assign(
      config.options,
      serverless.service.custom.bundle
    );

    super(serverless, options);

    this.serverless = serverless;
    this.options = options;
  }
}

module.exports = ServerlessPlugin;
