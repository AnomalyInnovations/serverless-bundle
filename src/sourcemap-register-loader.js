module.exports.default = function(source) {
  return "import 'source-map-support/register'; " + source;
};
