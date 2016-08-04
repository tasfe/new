Base._.mixin({
  //首字母大写
  ucFirst: function(string) {
    return string.replace(/\b\w+\b/g, function(word) {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
  },

  serializeObject: function(serializeArray) {
    return serializeArray.reduce(function(obj, prop) {
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

      return obj
    }, {});
  },

  fixedConvert2yuan: function(money, options) {
    options = _.extend({}, {
      fixed: 3,
      ratio: 10000,
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

      if (options.fixed || options.fixed === 0) {
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

  //格式化时间
  formatTime: function(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD H:mm:ss') : timestamp;
  },

  formatDate: function(timestamp, format) {
    return timestamp ? moment(timestamp).format(format || 'YYYY-MM-DD') : timestamp;
  },

  add: function(arg1, arg2) {
    var r1;
    var r2;
    var m,n;

    if (_(arg1).isUndefined()) {
      return;
    }

    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m + arg2 * m) / m).toFixed(n);
  },

  //除法   arg1除arg2
  div: function(arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1, r2;

    if (_(arg1).isUndefined()) {
      return;
    }

    try {
      t1 = arg1.toString().split('.')[1].length;
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split('.')[1].length;
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
  },

  //乘法  arg1乘arg2
  mul: function(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();

    if (_(arg1).isUndefined()) {
      return;
    }

    try {
      m += s1.split('.')[1].length;
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length;
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  },

  //减法 arg1减arg2
  sub: function(arg1, arg2) {
    var r1, r2, m, n;

    if (_(arg1).isUndefined()) {
      return;
    }

    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },

  //将小驼峰式转成 user-id 格式
  toDataStyle: function(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
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

  getUrlParam: function(name, href) {
    var params = {};
    var match  = (href || window.location.href).match(/#?.*\?(.*)/);

    if (!match) return match;

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
