const path = require("path");
const slsw = require("serverless-webpack");
const TerserPlugin = require("terser-webpack-plugin");

const config = require("./config");
const eslintConfig = require("./eslintrc.json");

const servicePath = config.servicePath;

const ENABLE_MINIMIZE = true;
const ENABLE_LINTING = config.options.linting;
const ENABLE_SOURCE_MAPS = config.options.sourcemaps;

function resolveEntriesPath() {
  const entries = slsw.lib.entries;

  for (let key in entries) {
    entries[key] = path.join(servicePath, entries[key]);
  }

  return entries;
}

function eslintLoader() {
  return {
    enforce: "pre",
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader",
    options: {
      baseConfig: eslintConfig
    }
  };
}

function babelLoader() {
  const plugins = ["@babel/plugin-transform-runtime"];

  if (ENABLE_SOURCE_MAPS) {
    plugins.push("babel-plugin-source-map-support");
  }

  return {
    test: /\.js$/,
    loader: "babel-loader",
    include: servicePath,
    exclude: /node_modules/,
    options: {
      plugins: plugins.map(require.resolve),
      presets: [
        [
          require.resolve("@babel/preset-env"),
          {
            targets: {
              node: "8.10"
            }
          }
        ]
      ]
    }
  };
}

function loaders() {
  const loaders = [];

  if (ENABLE_LINTING) {
    loaders.push(eslintLoader());
  }

  loaders.push(babelLoader());

  return loaders;
}

module.exports = {
  entry: resolveEntriesPath(),
  target: "node",
  context: __dirname,
  devtool: ENABLE_SOURCE_MAPS ? "source-map" : false,
  // Exclude "aws-sdk" since it's a built-in package
  externals: ["aws-sdk"],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: ENABLE_MINIMIZE
    ? {
        minimizer: [
          new TerserPlugin({
            sourceMap: ENABLE_SOURCE_MAPS,
            terserOptions: {
              mangle: !ENABLE_SOURCE_MAPS
            }
          })
        ]
      }
    : {
        minimize: false
      },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  resolve: {
    // First start by looking for modules in the plugin's node_modules
    // before looking inside the project's node_modules.
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
  },
  // Add linting and babel loaders
  module: {
    rules: loaders()
  }
};
