const path = require("path");
const slsw = require("serverless-webpack");
const TerserPlugin = require("terser-webpack-plugin");

const config = require("./config.js");

const ENABLE_MINIMIZE = true;
const SERVICE_PATH = config.servicePath;
const ENABLE_SOURCE_MAPS = config.options.sourcemaps;

function resolveEntriesPath() {
  const entries = slsw.lib.entries;

  for (let key in entries) {
    entries[key] = path.join(SERVICE_PATH, entries[key]);
  }

  return entries;
}

function babelLoader() {
  const plugins = ["@babel/plugin-transform-runtime"];

  if (ENABLE_SOURCE_MAPS) {
    plugins.push("babel-plugin-source-map-support");
  }

  return {
    test: /\.js$/,
    loader: "babel-loader",
    include: SERVICE_PATH,
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
  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [babelLoader()]
  }
};
