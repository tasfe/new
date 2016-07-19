"use strict";

var factory = require('bettingCenter/misc/betRulesFactory');
var algorithm = require('bettingCenter/misc/betRulesAlgorithm');

function _create(ticketId) {
  //==================================================
  //前三

  //直选复式
  factory.addRule([ticketId, '010101'], {
    algorithm: algorithm.mulAll,
    list: factory.createList(['万位', '千位', '百位']),
    create: algorithm.getCreateFunc(3, {
      repeat: true
    })
  });

  //直选单式
  factory.addRule([ticketId, '010102'], {
    type: 'input',
    validate: algorithm.getValidateFunc(3),
    create: algorithm.getCreateFunc(3, {
      slice: [2],
      repeat: true,
      innerSort: false
    })
  });

  //直选和值
  factory.addRule([ticketId, '010103'], {
    algorithm: algorithm.statistics,
    algorithmProps: {
      selectCount: 3
    },
    list: factory.createList([''], {
      items: _.range(28),
      operate: 'none'
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(28)
    })
  });

  //组三
  factory.addRule([ticketId, '010201'], {
    algorithm: algorithm.factorial,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true
    })
  });

  //组六
  factory.addRule([ticketId, '010202'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(3, {
      outerSort: true
    })
  });

  //组选和值
  factory.addRule([ticketId, '010203'], {
    algorithm: algorithm.fromConfig,
    algorithmProps: {
      config: [null, 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1]
    },
    list: factory.createList([''], {
      items: _.range(1, 27),
      operate: 'none'
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(1, 27)
    })
  });

  //混合组选
  factory.addRule([ticketId, '010204'], {
    type: 'input',
    validate: algorithm.getValidateFunc(3, {
      acceptRepeat: 1,
      maxRepeat: 2,
      minRepeat: 1,
      innerSort: true
    }),
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: [2]
    })
  });

  //==================================================
  //二星

  function addTwoRules(rules) {
    var rule = rules.shift();
    //直选复式
    factory.addRule(rule.ids, {
      algorithm: algorithm.mulAll,
      list: factory.createList(rule.list),
      create: algorithm.getCreateFunc(2, {
        repeat: true,
        matching: true
      })
    });

    rule = rules.shift();
    //直选单式
    factory.addRule(rule.ids, {
      type: 'input',
      validate: algorithm.getValidateFunc(2),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        repeat: true,
        innerSort: false
      })
    });

    rule = rules.shift();
    //组选复式
    factory.addRule(rule.ids, {
      algorithm: algorithm.group,
      algorithmProps: {
        mainRow: 0,
        cTimes: 2
      },
      list: factory.createList(['']),
      create: algorithm.getCreateFunc(2, {
        outerSort: true
      })
    });

    rule = rules.shift();
    //组选单式
    factory.addRule(rule.ids, {
      type: 'input',
      validate: algorithm.getValidateFunc(2, {
        acceptRepeat: 0,
        innerSort: true
      }),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        outerSort: true
      })
    });
  }

  //前二

  addTwoRules([
    {
      ids: [ticketId, '020101'],
      list: ['万位', '千位', null]
    },
    {ids: [ticketId, '020102']},
    {ids: [ticketId, '020201']},
    {ids: [ticketId, '020202']}
  ]);

  //==================================================
  //后二

  addTwoRules([
    {
      ids: [ticketId, '020103'],
      list: [null, '千位', '百位']
    },
    {ids: [ticketId, '020104']},
    {ids: [ticketId, '020203']},
    {ids: [ticketId, '020204']}
  ]);

  //==================================================
  //定位胆

  factory.addRule([ticketId, '030101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['万位', '千位', '百位']),
    create: algorithm.getCreateFunc(1, {
      matching: true
    })
  });

  //=================================================
  //不定位

  //一码不定位
  factory.addRule([ticketId, '040101'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  //二码不定位
  factory.addRule([ticketId, '040102'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true
    })
  });

}

module.exports = {
  install: function(ticketId) {
    _create(ticketId);
  }
};
