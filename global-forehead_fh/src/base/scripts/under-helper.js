"use strict";

var core = require('mathjs/core');
var math = core.create();

math.import(require('mathjs/lib/function/arithmetic/add'));
math.import(require('mathjs/lib/function/arithmetic/subtract'));
math.import(require('mathjs/lib/function/arithmetic/multiply'));
math.import(require('mathjs/lib/function/arithmetic/divide'));
math.import(require('mathjs/lib/function/arithmetic/floor'));

_.mixin({
  //首字母大写
  ucFirst: function(string) {
    return string.replace(/\b\w+\b/g, function(word) {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
  },

  serializeObject: function(serializeArray) {
    return _(serializeArray).reduce(function(obj, prop) {
      if (prop.name.indexOf('[]') === -1) {
        obj[prop.name] = prop.value;
      } else {
        prop.name = prop.name.replace('[]', '');
        if (_.isArray(obj[prop.name])) {
          obj[prop.name].push(prop.value);
        } else {
          obj[prop.name] = [prop.value];
        }
      }

      return obj;
    }, {});
  },
  unique: function(arr) {
    var unique = [];
    var repeat = [];
    var hash = {};

    if (!_.isEmpty(arr)) {
      var length = arr.length;
      for (var i = 0, elem; i < length; i++) {
        elem = arr[i];
        if (!hash[elem]) {
          unique.push(elem);
          hash[elem] = true;
        } else {
          repeat.push(elem);
        }
      }
    }

    return {
      unique: unique,
      repeat: repeat
    };
  },

  fixedConvert2yuan: function(money, options) {
    options = _.extend({}, {
      fixed: 3,
      clear: false
    }, options);
    return this.convert2yuan(money, options);
  },

  convert2yuan: function(money, options) {
    options = _.extend({}, {
      fixed: 4,
      ratio: 10000,
      clear: true
    }, options);

    return _.formatDiv(money, options.ratio, options);
  },

  formatDiv: function(money, ratio, options) {
    var format;

    money = money || 0;

    options = _.extend({}, {
    }, options);

    if (!_.isUndefined(money)) {

      format = _(money).div(ratio);

      if (options.fixed ||  options.fixed === 0) {
        format  = format.toFixed(options.fixed);
      }

      if (options.clear) {
        format = math.add(format, 0);
      }

    }

    return format;
  },

  formatMul: function(money, ratio, options) {
    var format;

    options = _.extend({}, {
      fixed: 0
    }, options);

    if (!_.isUndefined(money)) {

      format = _(money).mul(ratio);

      if (options.fixed) {
        format  = format.toFixed(options.fixed);
      }
    }

    return format;
  },

  toLink: function(arg) {
    var href = window.location.href;
    var index = href.indexOf('/index.html');
    if (index > -1) {
      return href.substring(0, index) + arg;
    } else {
      return href.substring(0,  href.indexOf('/#')) + arg;
    }
  },

  //格式化时间
  toTime: function(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD H:mm:ss') : timestamp;
  },

  toDate: function(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD') : timestamp;
  },

  compareTime: function(timestamp, relTimestamp) {
    var a = moment(timestamp);
    var b = moment(relTimestamp);
    var diff = a.diff(b, 'seconds');

    diff = a.diff(b, 'minutes');
    if (diff < 59) {
      return {
        data: diff + 1,
        unit: '分'
      };
    }

    diff = a.diff(b, 'hours');
    if (diff < 24) {
      return {
        data: diff,
        unit: '小时'
      };
    }

    diff = a.diff(b, 'days');
    if (diff < 30) {
      return {
        data: diff,
        unit: '天'
      };
    }

    return {
      data: _(a).toTime(),
      unit: ''
    };
  },

  //格式化时间
  formatTime: function(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD H:mm:ss') : timestamp;
  },

  formatDate: function(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD') : timestamp;
  },

  add: function(arg1, arg2) {
    return math.add(arg1, arg2);
  },

  //除法   arg1除arg2
  div: function(arg1, arg2) {
    return math.divide(arg1, arg2);
  },

  //乘法  arg1乘arg2
  mul: function(arg1, arg2) {
    return math.multiply(arg1, arg2);
  },

  //减法 arg1减arg2
  sub: function(arg1, arg2) {
    return math.subtract(arg1, arg2);
  },

  floor: function(arg1, index) {
    var sArg1 = String(arg1);
    var pos = sArg1.indexOf('.');
    if (pos > -1) {
      return Number(sArg1.substring(0, pos + index + 1));
    } else {
      return arg1;
    }
  },


  //将小驼峰式转成 user-id 格式
  toDataStyle: function(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  },

  addHrefArgs: function(href, args, val) {
    var nArgs = this.getUrlParam('', href) || {};

    if (!_(args).isObject()) {
      nArgs[args] = val;
    } else {
      _(nArgs).extend(args);
    }

    href = href.replace(/\?.*/, '');

    _(nArgs).each(function(val, arg) {
      if (!/\?.*=/.test(href)) {
        href += '?' + arg + '=' + encodeURI(val);
      } else {
        href += '&' + arg + '=' + encodeURI(val);
      }
    });

    return href;
  },

  getUrl: function(uri, args, val) {
    var url;

    var match = location.hash.match(/#?(.*)(\?.*)/);

    if (!match || !match[2]) {
      match = location.hash.match(/#?(.*)(\??.*)/);
    }

    if (!match) {
      url = '#' + (uri || '');
    } else {
      url = '#' + match[1] + uri + match[2];
    }

    if (args) {
      url = this.addHrefArgs(url, args, val);
    }

    return url;
  },

  getUrlParamStr: function(name, href) {
    var match = (href || window.location.href).match(/#?.*\?(.*)/);

    if (!match) {
      return '';
    } else {
      return '?' + match[1];
    }
  },


  getUrlParam: function(name, href) {
    var params = {};
    var match  = (href || window.location.href).match(/#?.*\?(.*)/);

    if (!match) {
     return match;
    }

    _(match[1].split('&')).each(function(arg) {
      arg = arg.split('=');
      params[arg[0]] = decodeURI(arg[1]);
    });

    if (name) {
      return params[name];
    } else {
      return params;
    }
  },

  //config文件用方法
  getConfig: function(config, index) {
    if (_(index).isUndefined()) {
      return config;
    } else {
      return (_(config).findWhere({
        index: index
      }) || {});
    }
  },

  getConfigById: function(config, id) {
    return (_(config).findWhere({
        id: id
      }) || {}).zhName || id;
  }
});
