define(function(require, exports, module) {
  var zero2nine = _.range(10);

  var op = {
    all: {
      all: true,
      big: true,
      small: true,
      odd: true,
      even: true,
      clear: true
    },
    none: {
      all: false,
      big: false,
      small: false,
      odd: false,
      even: false,
      clear: false
    }
  };

  var betRules = [];

  function addRule(ids, rule) {
    rule.optionals = rule.optionals || [];
    rule.type = rule.type || 'select';
    rule.limits = rule.limits || [];
    rule.algorithm = rule.algorithm || _.noop;

    _(rule.list).each(function(item, index) {
      item.id = index;

      if (rule.optionals[index]) {
        rule.optionals[index].id = index;
      }
    });

    betRules.push({
      playId: Number('' + ids[0] + '' + ids[1]),
      rule: rule
    });
  }

  function createList(titles, options) {
    options = _(options || {}).defaults({
      items: zero2nine,
      operate: 'all',
      limits: []
    });

    return _(titles).map(function(title) {
      if (_.isObject(title)) {
        return {
          isShow: title.title !== null,
          title: title.title,
          items: title.items || options.items,
          op: op[title.operate || options.operate],
          limits: title.limits || options.limits
        };
      } else {
        return {
          isShow: title !== null,
          title: title,
          items: options.items,
          op: op[options.operate],
          limits: options.limits
        };
      }
    });
  }

  return {
    betRules: betRules,
    addRule: addRule,
    createList: createList
  };
});
