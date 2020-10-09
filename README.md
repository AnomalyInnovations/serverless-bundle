# serverless-bundle [![Build Status](https://travis-ci.com/AnomalyInnovations/serverless-bundle.svg?branch=master)](https://travis-ci.com/AnomalyInnovations/serverless-bundle) [![npm](https://img.shields.io/npm/v/serverless-bundle.svg)](https://www.npmjs.com/package/serverless-bundle)

serverless-bundle is a [Serverless Framework](https://www.serverless.com) plugin that optimally packages your ES6 or TypeScript Node.js Lambda functions with sensible defaults so you **don't have to maintain your own Webpack configs**. It uses the [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) plugin internally.

- Only one dependency
- Supports ES6 and TypeScript
- Generates optimized packages
- Linting Lambda functions using [ESLint](https://eslint.org)
- Supports transpiling unit tests with [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest)
- Source map support for proper error messages

And all this works without having to install Webpack, Babel, ESLint, etc. or manage any of their configs. Simply add serverless-bundle to your app and you are done!

```diff
-    "eslint"
-    "webpack"
-    "ts-loader"
-    "typescript"
-    "css-loader"
-    "graphql-tag"
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
-    "tsconfig-paths-webpack-plugin"
-    "fork-ts-checker-webpack-plugin"
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

You can configure the following through your `serverless.yml`. Note that, these are **all optional**.

```yaml
custom:
  bundle:
    sourcemaps: true                # Enable source maps
    caching: true                   # Enable Webpack caching
    stats: false                    # Don't print out any Webpack output
    linting: true                   # Enable linting as a part of the build process
    tsConfig: "tsconfig.json"       # Path to your 'tsconfig.json', if it's not in the root
    forceInclude:                   # Optional list of NPM packages that need to be included
      - mysql                         # Only necessary if packages are included dynamically
    ignorePackages:                 # Ignore building any of the following packages
      - hiredis                       # For ex, hiredis needs to be ignored if using redis
    externals:                      # Set non Webpack compatible packages as externals
      - isomorphic-webcrypto          # They'll be included in the node_modules/, more below
    forceExclude:                   # Don't include these in the package
      - chrome-aws-lambda             # Because it'll be provided through a Lambda Layer
    fixPackages:                    # Include fixes for specific packages
      - "formidable@1.x"              # For ex, formidable@1.x doesn't work by default with Webpack
    copyFiles:                      # Copy any additional files to the generated package
      - from: 'public/*'              # Where the files are currently
        to: './'                      # Where in the package should they go
    aliases:                        # Create an alias to 'import' modules easily with a custom path
      - Lib: custom-lib/src/lib       # For ex, replace the long 'custom-lib/src/lib' with 'Lib'
    concatText:                     # Concatenate text files into one file on the generated package
      - files: 'schema/*.txt'         # Where the files that need to be concatenated are currently located
        outputPath: './'              # Where the concatenated file should go in the package
        name: 'schema.txt'            # The name the the concatenated file should have
    packager: npm                   # Specify a packager, 'npm' or 'yarn'. Defaults to 'npm'.
    packagerOptions:                # Run a custom script in the package process
      scripts:                        # https://github.com/serverless-heaven/serverless-webpack#custom-scripts
        - echo hello > test
    rawFileExtensions:              # An array of file extensions to import using the Webpack raw-loader.
      - csv                         # Defaults to ['pem', 'txt']

```

### Advanced Options

- ESLint

  This plugin uses [eslint-config-strongloop](https://github.com/strongloop/eslint-config-strongloop). You can [override this](https://eslint.org/docs/user-guide/configuring) by placing your own `.eslintrc.json` with the rules you'd like to use. If you'd like to ignore specific files, you can use a `.eslintignore` file.

- Customizing Babel and Webpack configs

  This plugin does not support customizing the Babel and Webpack configs, since [serverless-webpack](https://www.github.com/serverless-heaven/serverless-webpack) does a pretty good job with that. However, if you think the default config is missing some key features, feel free to open an issue about it.

- Supporting specific packages

  Certain packages like (`formidable@1.x`) do not work with Webpack without customizing the config. To support these packages, we use the `fixPackages` option. This allows us to customize the Webpack config without having folks learn about the internals of Webpack, or maintaining their own complicated configs. If a specific package doesn't work without customizing the Webpack config, add to the `fixPackages` option and submit a PR.

- Packager scripts

  The `packagerOptions.scripts` option allows [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack#custom-scripts) to run a custom script in the packaging process. This is useful for installing any platform specific binaries. See below for the `sharp` package.

- Aliases

  Import paths can get very long when dealing with complicated directory structures in monorepo apps. The `aliases` option allows you to define a shorter version. So if you have an import that looks like:

  ``` js
  import Utility from '../../custom-lib/src/lib/utility';
  ```

  Adding the following. Where `src/utilities` is the path from the project root.

  ``` yml
  custom:
    bundle:
      aliases:
        - "Lib": custom-lib/src/lib
  ```

  This would allow you to instead import using the following, from anywhere in your project.

  ``` js
  import Utility from 'Lib/utility';
  ```

  To use aliases in your tests you'll need to use Jest's [`moduleNameMapper`](https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring). Add the following your `package.json`:

  ``` json
  "jest": {
    "moduleNameMapper": {
      "Lib(.*)$": "<rootDir>/custom-lib/src/lib/$1"
    }
  }
  ```

- Usage with WebStorm

  Here is some info on how to get this plugin to support running tests in WebStorm — https://github.com/AnomalyInnovations/serverless-bundle/issues/5#issuecomment-582237396

- Alternative Jest Result Processor

  For CI services (like Atlassian Bamboo CI) that do not work with Jest test results, start by installing [jest-mocha-reporter](https://www.npmjs.com/package/jest-mocha-reporter).

  To set the `testResultsProcessor` option, add `"testResultsProcessor": "jest-mocha-reporter"` to the Jest section in your `package.json`. You should see the default command line output when running `npm run test`, but you should also get a `test-report.json`.

  To test the `reporters` option, add `"reporters": ["jest-mocha-reporter"]` instead. This should result in the same file as above but without the command line output.

### TypeScript

If serverless-bundle detects a `tsconfig.json` in your service root, it'll enable TypeScript.

You can also change where your _tsconfig_ is.

``` yml
custom:
  bundle:
    tsConfig: 'tsconfig.special.json'
```

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

#### Formidable 1.x

[Formidable 1.x](https://github.com/node-formidable/formidable/issues/337#issuecomment-579610313) doesn't work with Webpack by default. We have a fix that we apply to the Webpack config for it to work. To apply the fix use the following:

``` yml
custom:
  bundle:
    fixPackages:
      - "formidable@1.x"
```

If enabled, Webpack adds the following definition to work with Formidable — `{ "global.GENTLY": false }`.

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

### CSS, SASS, and Image Files

Serverless Bundle automatically supports importing css, scss, and image files.

``` js
import "./assets/style.css";
import "./assets/style.scss";
import "./assets/react.png";
```

### Support for pem, txt, and other raw files

Serverless Bundle automatically supports importing `.pem` and `.txt`, using the [Webpack raw-loader](https://webpack.js.org/loaders/raw-loader/).

``` js
import "./assets/key.pem";
import "./assets/text.txt";
```

If you need load additional files using the raw-loader, you can use the `rawFileExtensions` config option.

``` yml
custom:
  bundle:
    rawFileExtensions:
      - csv
```

### Externals

The `externals` option takes a list of packages or `all`. By default this is set to `["knex", "sharp"]`.

Packages listed in `externals` are ignored by Webpack. They are instead added in the `node_modules/` directory of the Lambda .zip file. These usually include npm packages that are not supported by Webpack.

The `all` option allows you to list all the packages in YOUR `node_modules/` directory as externals. This might be useful in cases where they are just too many to list. Or you are using something like [EJS](https://ejs.co) that implicitly requires a long list of packages that are not supported by Webpack.

Note that, adding a package to the `externals` list might make your Lambda .zip file larger. This is because the entire package directory is zipped. Instead of using Webpack to just include the code that is necessary. So it's advisable to avoid using the `all` option.

If you think we should add to the default list of externals, open a PR.

Example of specifying a list of packages:

``` yml
custom:
  bundle:
    externals:
      - knex
      - sharp
```

Example of using the `all` option:

``` yml
custom:
  bundle:
    externals: all
```

### Externals vs forceExclude

The two options (`externals` and `forceExclude`) look similar but have some subtle differences. Let's look at them in detail:

- `externals`

  These are packages that need to be included in the Lambda package (the .zip file that's sent to AWS). But they are not compatible with Webpack. So they are marked as `externals` to tell Webpack not bundle them.

- `forceExclude`

  These packages are available in the Lambda runtime. Either by default (in the case of `aws-sdk`) or through a Lambda layer that you might be using. So these are not included in the Lambda package. And they are also marked as `externals`. Meaning that packages that are in `forceExclude` are automatically added to the `externals` list as well. By default, `aws-sdk` is listed in the `forceExclude`.

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

Run all the tests.

```bash
$ npm test
```

To test the `serverless-bundle test` command.

```bash
$ npm run test scripts
```

To install locally in another project.

```bash
$ npm install /path/to/serverless-bundle
```

## Thanks

This plugin would not be possible without the amazing [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin and the ideas and code from [Create React App](https://www.github.com/facebook/create-react-app).

---

This plugin is maintained by [Anomaly Innovations](https://anoma.ly); makers of [Seed](https://seed.run) and [Serverless Stack](https://serverless-stack.com).
