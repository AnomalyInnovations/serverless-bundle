const path = require("path");
const webpack = require("webpack");
const slsw = require("serverless-webpack");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const config = require("./config");
const eslintConfig = require("./eslintrc.json");

const isLocal = slsw.lib.webpack.isLocal;

const servicePath = config.servicePath;

const ENABLE_LOGS = config.options.logs;
const ENABLE_LINTING = config.options.linting;
const ENABLE_SOURCE_MAPS = config.options.sourcemaps;
const ENABLE_CACHING = isLocal ? config.options.caching : false;

function resolveEntriesPath(entries) {
  for (let key in entries) {
    entries[key] = path.join(servicePath, entries[key]);
  }

  return entries;
}

function eslintLoader() {
  return {
    loader: "eslint-loader",
    options: {
      cache: ENABLE_CACHING,
      baseConfig: eslintConfig
    }
  };
}

function loaders() {
  const loaders = [];

  if (ENABLE_LINTING) {
    loaders.push(eslintLoader());
  }

  return loaders;
}

function plugins() {
  const plugins = [];

  if (ENABLE_CACHING) {
    plugins.push(
      new HardSourceWebpackPlugin({
        info: {
          mode: ENABLE_LOGS ? "test" : "none",
          level: ENABLE_LOGS ? "debug" : "error"
        }
      })
    );
  }

  // Ignore all locale files of moment.js
  plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  return plugins;
}

module.exports = {
  entry: resolveEntriesPath(slsw.lib.entries),
  target: "node",
  context: __dirname,
  // Disable verbose logs
  stats: ENABLE_LOGS ? "normal" : "errors-only",
  devtool: ENABLE_SOURCE_MAPS
    ? isLocal
      ? "cheap-module-eval-source-map"
      : "source-map"
    : false,
  // Exclude "aws-sdk" since it's a built-in package
  externals: ["aws-sdk"],
  mode: isLocal ? "development" : "production",
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  resolve: {
    // Performance
    symlinks: false,
    // First start by looking for modules in the plugin's node_modules
    // before looking inside the project's node_modules.
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
  },
  // Add loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: loaders()
      }
    ]
  },
  // PERFORMANCE ONLY FOR DEVELOPMENT
  optimization: isLocal
    ? {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false
      }
    // Don't minimize in production
    // Large builds can run out of memory
    : { minimize: false },
  plugins: plugins()
};
