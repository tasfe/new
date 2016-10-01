"use strict";

require('math');

function convert2yuan(money, options) {
  options = _.extend({}, {
    fixed: 4,
    ratio: 10000,
    clear: true
  }, options);

  return formatDiv(money, options.ratio, options);
}

function formatDiv(money, ratio, options) {
  var format;

  money = money || 0;

  options = _.extend({}, {
  }, options);

  if (!_.isUndefined(money)) {

    format = divide(money, ratio);

    if (options.fixed ||  options.fixed === 0) {
      format  = format.toFixed(options.fixed);
    }

    if (options.clear) {
      format = _.add(format, 0);
    }

  }

  return format;
}

function divide(arg1, arg2) {
  return _.div(arg1, arg2);
}

module.exports = {
  convert2yuan: convert2yuan
};