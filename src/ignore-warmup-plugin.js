const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("./config");

module.exports = function(webpackConfig) {
  delete webpackConfig.entry["_warmup/index"];
  webpackConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(config.servicePath, "_warmup"),
        to: "_warmup"
      }
    ])
  );

  return webpackConfig;
};
