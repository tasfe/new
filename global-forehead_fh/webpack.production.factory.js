var _ = require('underscore');

module.exports = function(config) {
  return require('./webpack-config-factory')(config);
};
