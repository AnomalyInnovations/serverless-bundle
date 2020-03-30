# serverless-bundle [![Build Status](https://travis-ci.com/AnomalyInnovations/serverless-bundle.svg?branch=master)](https://travis-ci.com/AnomalyInnovations/serverless-bundle) [![npm](https://img.shields.io/npm/v/serverless-bundle.svg)](https://www.npmjs.com/package/serverless-bundle)

An extension of the [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) plugin. This plugin bundles your Node.js Lambda functions with sensible defaults so you **don't have to maintain your own Webpack configs**.

- Linting via [ESLint](https://eslint.org)
- Caching for faster builds
- Use ES6 `import/export`
- Supports transpiling unit tests with [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest)
- Source map support for proper error messages

And all this works without having to install Webpack, Babel, ESLint, etc. or manage any of their configs. Simply add serverless-bundle to your app and you are done!

```diff
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

+    "serverless-bundle"
```

You can [read more about this over on Serverless Stack](https://serverless-stack.com/chapters/package-lambdas-with-serverless-bundle.html).

---

## Getting Started

Install the `serverless-bundle` plugin using:

```bash
$ npm install --save-dev serverless-bundle
```

Then add it to your `serverless.yml`.

```yaml
plugins:
  - serverless-bundle
```

To run your tests using the same Babel config used in the plugin add the following to your `package.json`:

```json
"scripts": {
  "test": "serverless-bundle test"
}
```

## Usage

Once installed and added to your `serverless.yml`, serverless-bundle will automatically package your functions using Webpack when you run the various serverless commands.

## Options

You can configure the following through your `serverless.yml`.

```yaml
custom:
  bundle:
    sourcemaps: true          # Enable source maps
    caching: true             # Enable Webpack caching
    stats: false              # Don't print out any Webpack output
    linting: true             # Enable linting as a part of the build process
    forceInclude:             # Optional list of NPM packages that need to be included
      - mysql                   # Only necessary if packages are included dynamically
    ignorePackages:           # Ignore building any of the following packages
      - hiredis                 # For ex, hiredis needs to be ignored if using redis
    copyFiles:                # Copy any additional files to the generated package
      - from: 'public/*'        # Where the files are currently
        to: './'                # Where in the package should they go
    packager: npm             # Specify a packager, 'npm' or 'yarn'. Defaults to 'npm'.
    packagerOptions:          # Run a custom script in the package process
      scripts:                  # https://github.com/serverless-heaven/serverless-webpack#custom-scripts
        - echo hello > test
```

### Advanced Options

- ESLint

  This plugin uses [eslint-config-strongloop](https://github.com/strongloop/eslint-config-strongloop). You can [override this](https://eslint.org/docs/user-guide/configuring) by placing your own `.eslintrc.json` with the rules you'd like to use. If you'd like to ignore specific files, you can use a `.eslintignore` file.

- Customizing Babel and Webpack configs

  This plugin does not support customizing the Babel and Webpack configs, since [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) does a pretty good job with that. However, if you think the default config is missing some key features, feel free to open an issue about it.

- Packager scripts

  The `packagerOptions.scripts` option allows [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack#custom-scripts) to run a custom script in the packaging process. This is useful for installing any platform specific binaries. See below for the `sharp` package.
  
- Usage with WebStorm

  Here is some info on how to get this plugin to support running tests in WebStorm — https://github.com/AnomalyInnovations/serverless-bundle/issues/5#issuecomment-582237396

- Alternative Jest Result Processor

  For CI services (like Atlassian Bamboo CI) that do not work with Jest test results, start by installing [jest-mocha-reporter](https://www.npmjs.com/package/jest-mocha-reporter).
  
  To set the `testResultsProcessor` option, add `"testResultsProcessor": "jest-mocha-reporter"` to the Jest section in your `package.json`. You should see the default command line output when running `npm run test`, but you should also get a `test-report.json`.
  
  To test the `reporters` option, add `"reporters": ["jest-mocha-reporter"]` instead. This should result in the same file as above but without the command line output.

### Package Specific Config

The packages below need some additional config to make them work.

#### Knex.js

The [knex.js](http://knexjs.org) module is automatically excluded from the bundle since it's not compatible with Webpack. However, you need to force include the specific database provider package since these are dynamically included. Use the `forceInclude` option to pass in a list of packages that you want included. For example, to include `mysql` use the following:

``` yml
custom:
  bundle:
    forceInclude
      - mysql
```

#### sharp

The [sharp](http://sharp.pixelplumbing.com/en/stable/install/#aws-lambda) package needs to include a specific binary before package. Use the `packagerOptions.scripts` for this.

``` yml
custom:
  bundle:
    packagerOptions:
      scripts:
        - rm -rf node_modules/sharp && npm install --arch=x64 --platform=linux --target=10.15.0 sharp
```

#### pg

The [pg](https://github.com/brianc/node-postgres/tree/master/packages/pg) package optionally includes `pg-native` that needs to be ignored from Webpack. Use the `ignorePackages` option to do this.

```yml
custom:
  bundle:
    ignorePackages:
      - pg-native
```

#### redis

The [redis](https://github.com/NodeRedis/node_redis) package optionally includes `hiredis` that needs to be ignored from Webpack. Use the `ignorePackages` option to do this.

```yml
custom:
  bundle:
    ignorePackages:
      - hiredis
```

#### Sequelize

To use the [Sequelize](https://github.com/sequelize/sequelize) package along with [pg](https://github.com/brianc/node-postgres/tree/master/packages/pg), you'll need to ignore it from Webpack and using the `dialectModule` option. [Read more](https://github.com/AnomalyInnovations/serverless-bundle/issues/45#issuecomment-594237314) here.

In your `serverless.yml`:

```yml
custom:
  bundle:
    ignorePackages:
      - pg-native
```

And in your Lambda code:

``` js
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectModule: pg
  }
);
```

### Nested Services

It's common in [Serverless monorepo](https://serverless-stack.com/chapters/organizing-serverless-projects.html) setups that the plugins are installed at the root level and referenced in the individual services. Take the following project setup:

```
package.json          // Here serverless-bundle is installed
/service1 
  |- package.json     // Can run npm test from here, referring to parent `package.json`
  |- handler.js
  |- handler.test.js
  |- serverless.yml   // Uses serverless-bundle plugin
/service2
  |- package.json     // Can run npm test from here, referring to parent `package.json`
  |- handler.js
  |- handler.test.js
  |- serverless.yml   // Uses serverless-bundle plugin
```

Running Serverless commands (`deploy`, `package`, etc.) from the services directories are supported out of the box. To get your tests to run correctly, you need to do the following.

In the root `package.json` use the following `test` script:

```json
"scripts": {
  "test": "serverless-bundle test"
}
```

And in `service1/package.json` use this `test` script:

``` json
"scripts": {
  "test": "npm --prefix ./../ test service1"
},
```

This tells serverless-bundle (in the root) to only run the tests inside the `service1/` directory. As opposed to the entire project.

## Support

- Open a [new issue](https://github.com/AnomalyInnovations/serverless-bundle/issues/new) if you've found a bug or have some suggestions.
- Or submit a pull request!

## Running Locally

To run this project locally, clone the repo and initialize the project.

```bash
$ git clone https://github.com/AnomalyInnovations/serverless-bundle
$ cd serverless-bundle
$ npm install
```

Run the tests using.

```bash
$ npm test
```

To test the `serverless-bundle test` command.

```bash
$ npm run test-scripts
```

To install locally in another project.

```bash
$ npm install /path/to/serverless-bundle
```

## Thanks

This plugin would not be possible without the amazing [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin and the ideas and code from [Create React App](https://www.github.com/facebook/create-react-app).

---

This plugin is maintained by [Anomaly Innovations](https://anoma.ly); makers of [Seed](https://seed.run) and [Serverless Stack](https://serverless-stack.com).
