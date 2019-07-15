# serverless-bundle [![Build Status](https://travis-ci.com/AnomalyInnovations/serverless-bundle.svg?branch=master)](https://travis-ci.com/AnomalyInnovations/serverless-bundle) ![npm](https://img.shields.io/npm/v/serverless-bundle.svg)

An extension of the [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) plugin. This plugin bundles your Node.js Lambda functions with sensible defaults so you **don't have to maintain your own Webpack configs**.

- Linting via [ESLint](https://eslint.org)
- Use ES6 `import/export`
- Caching for faster builds
- Source map support for proper error messages

And all this works without having to install Webpack, Babel, ESLint, etc. or manage any of their configs. Simply add serverless-bundle to your app and you are done!

``` diff
-    "eslint"
-    "webpack"
-    "@babel/core"
-    "babel-eslint"
-    "babel-loader"
-    "eslint-loader"
-    "@babel/runtime"
-    "@babel/preset-env"
-    "serverless-webpack"
-    "source-map-support"
-    "webpack-node-externals"
-    "eslint-config-strongloop"
-    "@babel/plugin-transform-runtime"
-    "babel-plugin-source-map-support"

+    "serverless-bundle": "^1.1.12",
```

---

### Getting Started

Install the `serverless-bundle` plugin using:

``` bash
$ npm install --save-dev serverless-bundle
```

Then add it to your `serverless.yml`.

``` yaml
plugins:
  - serverless-bundle
```

### Usage

Once installed and added to your `serverless.yml`, serverless-bundle will automatically package your functions using Webpack when you run the various serverless commands.

### Options

You can configure the following through your `serverless.yml`.

``` yaml
custom:
  bundle:
    sourcemaps: true  # Disable source maps
    caching: true     # Disable Webpack caching
    stats: false      # Don't print out any Webpack output
    linting: true     # Disable linting as a part of the build process
```

#### Advanced Options

- ESLint

  This plugin uses [eslint-config-strongloop](https://github.com/strongloop/eslint-config-strongloop). You can override this by placing your own `.eslintrc.json` with the rules you'd like to use. If you'd like to ignore specific files, you can use a `.eslintignore` file.

---

This plugin is maintained by [Anomaly Innovations](https://anoma.ly).
