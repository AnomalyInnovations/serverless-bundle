const path = require("path");
const webpack = require("webpack");
const slsw = require("serverless-webpack");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = require("./config");
const eslintConfig = require("./eslintrc.json");
const ignoreWarmupPlugin = require("./ignore-warmup-plugin");

const isLocal = slsw.lib.webpack.isLocal;

const servicePath = config.servicePath;
const nodeVersion = config.nodeVersion;
const copyFiles = config.options.copyFiles;
const ignorePackages = config.options.ignorePackages;

const ENABLE_STATS = config.options.stats;
const ENABLE_LINTING = config.options.linting;
const ENABLE_SOURCE_MAPS = config.options.sourcemaps;
const ENABLE_CACHING = isLocal ? config.options.caching : false;

function resolveEntriesPath(entries) {
  for (let key in entries) {
    entries[key] = path.join(servicePath, entries[key]);
  }

  return entries;
}

function babelLoader() {
  const plugins = [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ];

  if (ENABLE_SOURCE_MAPS) {
    plugins.push("babel-plugin-source-map-support");
  }

  return {
    loader: "babel-loader",
    options: {
      // Enable caching
      cacheDirectory: ENABLE_CACHING,
      // Disable compresisng cache files to speed up caching
      cacheCompression: false,
      plugins: plugins.map(require.resolve),
      presets: [
        [
          require.resolve("@babel/preset-env"),
          {
            targets: {
              node: nodeVersion
            }
          }
        ]
      ]
    }
  };
}

function eslintLoader() {
  return {
    loader: "eslint-loader",
    options: {
      baseConfig: eslintConfig
    }
  };
}

function loaders() {
  const loaders = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [babelLoader()]
      }
    ]
  };

  if (ENABLE_LINTING) {
    loaders.rules[0].use.push(eslintLoader());
  }

  return loaders;
}

function plugins() {
  const plugins = [];

  if (ENABLE_CACHING) {
    plugins.push(
      new HardSourceWebpackPlugin({
        info: {
          mode: ENABLE_STATS ? "test" : "none",
          level: ENABLE_STATS ? "debug" : "error"
        }
      })
    );
  }

  if (copyFiles) {
    plugins.push(
      new CopyWebpackPlugin(
        copyFiles.map(function(data) {
          return {
            to: data.to,
            context: servicePath,
            from: path.join(servicePath, data.from)
          };
        })
      )
    );
  }

  // Ignore all locale files of moment.js
  plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  // Ignore any packages specified in the `ignorePackages` option
  for (let i = 0, l = ignorePackages.length; i < l; i++) {
    plugins.push(
      new webpack.IgnorePlugin(new RegExp("^" + ignorePackages[i] + "$"))
    );
  }

  return plugins;
}

module.exports = ignoreWarmupPlugin({
  entry: resolveEntriesPath(slsw.lib.entries),
  target: "node",
  context: __dirname,
  // Disable verbose logs
  stats: ENABLE_STATS ? "normal" : "errors-only",
  devtool: ENABLE_SOURCE_MAPS ? "source-map" : false,
  // Exclude "aws-sdk" since it's a built-in package
  externals: ["aws-sdk", "knex", "sharp"],
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
  module: loaders(),
  // PERFORMANCE ONLY FOR DEVELOPMENT
  optimization: isLocal
    ? {
        splitChunks: false,
        removeEmptyChunks: false,
        removeAvailableModules: false
      }
    : // Don't minimize in production
      // Large builds can run out of memory
      { minimize: false },
  plugins: plugins(),
  node: {
    __dirname: false
  }
});
