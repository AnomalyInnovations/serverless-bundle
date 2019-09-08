# serverless-bundle [![Build Status](https://travis-ci.com/AnomalyInnovations/serverless-bundle.svg?branch=master)](https://travis-ci.com/AnomalyInnovations/serverless-bundle) [![npm](https://img.shields.io/npm/v/serverless-bundle.svg)](https://www.npmjs.com/package/serverless-bundle)

An extension of the [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) plugin. This plugin bundles your Node.js Lambda functions with sensible defaults so you **don't have to maintain your own Webpack configs**.

- Linting via [ESLint](https://eslint.org)
- Caching for faster builds
- Use ES6 `import/export`
- Supports transpiling unit tests with [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest)
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

+    "serverless-bundle": "^1.1.12"
```

You can [read more about this over on Serverless Stack](https://serverless-stack.com/chapters/package-lambdas-with-serverless-bundle.html).

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

To run your tests using the same Babel config used in the plugin add the following to your `package.json`:

``` json
"scripts": {
  "test": "serverless-bundle test"
}
```

### Usage

Once installed and added to your `serverless.yml`, serverless-bundle will automatically package your functions using Webpack when you run the various serverless commands.

### Options

You can configure the following through your `serverless.yml`.

``` yaml
custom:
  bundle:
    sourcemaps: true      # Enable source maps
    caching: true         # Enable Webpack caching
    stats: false          # Don't print out any Webpack output
    linting: true         # Enable linting as a part of the build process
    copyFiles:            # Copy any additional files to the generated package
      - from: 'public/*'    # Where the files are currently
        to: './'            # Where in the package should they go
```

#### Advanced Options

- ESLint

  This plugin uses [eslint-config-strongloop](https://github.com/strongloop/eslint-config-strongloop). You can [override this](https://eslint.org/docs/user-guide/configuring) by placing your own `.eslintrc.json` with the rules you'd like to use. If you'd like to ignore specific files, you can use a `.eslintignore` file.
  
- Customizing Babel and Webpack configs

  This plugin does not support customizing the Babel and Webpack configs, since [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) does a pretty good job with that. However, if you think the default config is missing some key features, feel free to open an issue about it.
  
#### Updating Options

This plugin enables Webpack caching to speed up builds. Meaning that you'll need to clear the cache when you make a config change. So if you add an `.eslintignore` file, or change any other option; you'll need to do the following to see your changes take effect.

``` bash
$ rm -rf node_modules/.cache
```

### Support

- Open a [new issue](https://github.com/AnomalyInnovations/serverless-bundle/issues/new) if you've found a bug or have some suggestions.
- Or submit a pull request!

### Running Locally

To run this project locally, clone the repo and initialize the project.

``` bash
$ git clone https://github.com/AnomalyInnovations/serverless-bundle
$ cd serverless-bundle
$ npm install
```

Run the tests using.

``` bash
$ npm test
```

To test the `serverless-bundle test` command.

``` bash
$ npm run test-scripts
```

To install locally in another project.

``` bash
$ npm install /path/to/serverless-bundle
```

### Thanks

This plugin would not be possible without the amazing [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin and the ideas and code from [Create React App](https://www.github.com/facebook/create-react-app).

---

This plugin is maintained by [Anomaly Innovations](https://anoma.ly); makers of [Seed](https://seed.run) and [Serverless Stack](https://serverless-stack.com).
