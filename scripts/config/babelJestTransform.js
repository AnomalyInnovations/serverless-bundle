'use strict';

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [require.resolve('@babel/preset-env')],
  babelrc: false,
  configFile: false,
});
