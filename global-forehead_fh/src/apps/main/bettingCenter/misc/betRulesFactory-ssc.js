"use strict";

var factory = require('bettingCenter/misc/betRulesFactory');
var algorithm = require('bettingCenter/misc/betRulesAlgorithm');


var danshuang = ['大', '小', '单', '双'];
var longhu = ['龙', '虎', '和'];

function _create(ticketId) {
  //==================================================
  //五星

  //复式
  factory.addRule([ticketId, '010101'], {
    algorithm: algorithm.mulAll,
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(5, {
      repeat: true
    })
  });

  //单式
  factory.addRule([ticketId, '010102'], {
    type: 'input',
    validate: algorithm.getValidateFunc(5),
    create: algorithm.getCreateFunc(5, {
      slice: [4],
      repeat: true,
      innerSort: false
    })
  });

  //组选120
  factory.addRule([ticketId, '010201'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 5
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(5, {
      outerSort: true
    })
  });

  //组选60
  factory.addRule([ticketId, '010202'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 3
    },
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(4, {
      slice: [0, 3]
    })
  });

  //组选30
  factory.addRule([ticketId, '010203'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [1, 2]
    })
  });

  //组选20
  factory.addRule([ticketId, '010204'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 2
    },
    list: factory.createList(['三重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [0, 2]
    })
  });

  //组选10
  factory.addRule([ticketId, '010205'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['三重号位', '二重号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1]
    })
  });

  //组选5
  factory.addRule([ticketId, '010206'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['四重号位', '单号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1]
    })
  });

  //一码不定位
  factory.addRule([9], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  //二码不定位
  factory.addRule([ticketId, '080301'], {
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

  //三码不定位
  factory.addRule([ticketId, '080302'], {
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

  //==================================================
  //四星

  //复式
  factory.addRule([ticketId, '020101'], {
    algorithm: algorithm.mulAll,
    list: factory.createList([null, '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(4, {
      repeat: true,
      matching: true
    })
  });

  //单式
  factory.addRule([ticketId, '020102'], {
    type: 'input',
    validate: algorithm.getValidateFunc(4),
    create: algorithm.getCreateFunc(4, {
      slice: [3],
      repeat: true,
      innerSort: false
    })
  });

  //组选24
  factory.addRule([ticketId, '020201'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 4
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(4, {
      outerSort: true
    })
  });

  //组选12
  factory.addRule([ticketId, '020202'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 2
    },
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [0, 2]
    })
  });

  //组选6
  factory.addRule([ticketId, '020203'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    list: factory.createList(['二重号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1]
    })
  });

  //组选4
  factory.addRule([ticketId, '020204'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['三重号位', '单号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1]
    })
  });

  //一码不定位
  factory.addRule([ticketId, '080201'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  //二码不定位
  factory.addRule([ticketId, '080202'], {
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

  //==================================================
  //三星
  function addThreeRules(rules) {
    //复式
    factory.addRule(rules[0].ids, {
      algorithm: algorithm.mulAll,
      list: factory.createList(rules[0].list),
      create: algorithm.getCreateFunc(3, {
        repeat: true,
        matching: true
      })
    });

    //单式
    factory.addRule(rules[1].ids, {
      type: 'input',
      validate: algorithm.getValidateFunc(3),
      create: algorithm.getCreateFunc(3, {
        slice: [2],
        repeat: true,
        innerSort: false
      })
    });

    //直选和值
    factory.addRule(rules[2].ids, {
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

    //跨度
    factory.addRule(rules[3].ids, {
      algorithm: algorithm.fromConfig,
      algorithmProps: {
        config: [10, 54, 96, 126, 144, 150, 144, 126, 96, 54]
      },
      list: factory.createList(['']),
      create: algorithm.getCreateFunc(1)
    });

    //组三
    factory.addRule(rules[4].ids, {
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
    factory.addRule(rules[5].ids, {
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
    factory.addRule(rules[6].ids, {
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

    //组选包胆
    factory.addRule(rules[7].ids, {
      algorithm: algorithm.staticVal,
      algorithmProps: {
        val: 54
      },
      list: factory.createList([''], {
        operate: 'none',
        limits: [
          {
            name: 'conflict-x',
            data: {
              num: 1
            }
          }
        ]
      }),
      create: algorithm.getCreateFunc(1)
    });

    //混合组选
    factory.addRule(rules[8].ids, {
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

    ////组三单式
    //factory.addRule(rules[9].ids, {
    //  type: 'input',
    //  validate: getValidateFunc(3, {
    //    acceptRepeat: 1,
    //    maxRepeat: 2,
    //    minRepeat: 2,
    //    innerSort: true
    //  }),
    //  create: getCreateFunc(3, {
    //    acceptRepeat: 1,
    //    minRepeat: 2,
    //    maxRepeat: 2,
    //    slice: [2]
    //  })
    //});
    ////组六单式
    //factory.addRule(rules[10].ids, {
    //  type: 'input',
    //  validate: getValidateFunc(3, {
    //    acceptRepeat: 0,
    //    innerSort: true
    //  }),
    //  create: getCreateFunc(3, {
    //    //outerSort: true,
    //    slice: [2]
    //  })
    //});

    //一码不定位
    factory.addRule(rules[11].ids, {
      algorithm: algorithm.group,
      algorithmProps: {
        mainRow: 0,
        cTimes: 1
      },
      list: factory.createList(['']),
      create: algorithm.getCreateFunc(1)
    });

    //二码不定位
    factory.addRule(rules[12].ids, {
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

  //前三
  addThreeRules([
    {
      ids: [ticketId, '030101'],
      list: ['万位', '千位', '百位', null, null]
    },
    {ids: [ticketId, '030102']},
    {ids: [ticketId, '030103']},
    {ids: [ticketId, '030104']},
    {ids: [ticketId, '030201']},
    {ids: [ticketId, '030202']},
    {ids: [ticketId, '030203']},
    {ids: [ticketId, '030204']},
    {ids: [ticketId, '030205']},
    {ids: [29]},
    {ids: [30]},
    {ids: [ticketId, '080101']},
    {ids: [ticketId, '080102']}
  ]);

  //==================================================
  //中三
  addThreeRules([
    {
      ids: [ticketId, '040101'],
      list: [null, '千位', '百位', '十位', null]
    },
    {ids: [ticketId, '040102']},
    {ids: [ticketId, '040103']},
    {ids: [ticketId, '040104']},
    {ids: [ticketId, '040201']},
    {ids: [ticketId, '040202']},
    {ids: [ticketId, '040203']},
    {ids: [ticketId, '040204']},
    {ids: [ticketId, '040205']},
    {ids: [42]},
    {ids: [43]},
    {ids: [ticketId, '080103']},
    {ids: [ticketId, '080104']}
  ]);

  //==================================================
  //后三

  addThreeRules([
    {
      ids: [ticketId, '050101'],
      list: [null, null, '百位', '十位', '个位']
    },
    {ids: [ticketId, '050102']},
    {ids: [ticketId, '050103']},
    {ids: [ticketId, '050104']},
    {ids: [ticketId, '050201']},
    {ids: [ticketId, '050202']},
    {ids: [ticketId, '050203']},
    {ids: [ticketId, '050204']},
    {ids: [ticketId, '050205']},
    {ids: [55]},
    {ids: [56]},
    {ids: [ticketId, '080105']},
    {ids: [ticketId, '080106']}
  ]);

  //==================================================
  //二星

  function addTwoRules(rules) {
    //直选复式
    factory.addRule(rules[0].ids, {
      algorithm: algorithm.mulAll,
      list: factory.createList(rules[0].list),
      create: algorithm.getCreateFunc(2, {
        repeat: true,
        matching: true
      })
    });
    //直选单式
    factory.addRule(rules[1].ids, {
      type: 'input',
      validate: algorithm.getValidateFunc(2),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        repeat: true,
        innerSort: false
      })
    });

    //直选和值
    factory.addRule(rules[2].ids, {
      algorithm: algorithm.statistics,
      algorithmProps: {
        selectCount: 2
      },
      list: factory.createList([''], {
        items: _.range(19),
        operate: 'none'
      }),
      create: algorithm.getCreateFunc(1, {
        range: _.range(19)
      })
    });
    //跨度
    factory.addRule(rules[3].ids, {
      algorithm: algorithm.fromConfig,
      algorithmProps: {
        config: [10, 18, 16, 14, 12, 10, 8, 6, 4, 2]
      },
      list: factory.createList(['']),
      create: algorithm.getCreateFunc(1)
    });
    //组选复式
    factory.addRule(rules[4].ids, {
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
    //组选单式
    factory.addRule(rules[5].ids, {
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

    //组选和值
    factory.addRule(rules[6].ids, {
      algorithm: algorithm.fromConfig,
      algorithmProps: {
        config: [null, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1]
      },
      list: factory.createList([''], {
        items: _.range(1, 18),
        operate: 'none'
      }),
      create: algorithm.getCreateFunc(1, {
        range: _.range(1, 18)
      })
    });

    //组选包胆
    factory.addRule(rules[7].ids, {
      algorithm: algorithm.staticVal,
      algorithmProps: {
        val: 9
      },
      list: factory.createList([''], {
        operate: 'none',
        limits: [
          {
            name: 'conflict-x',
            data: {
              num: 1
            }
          }
        ]
      }),
      create: algorithm.getCreateFunc(1)
    });
  }

  //前二

  addTwoRules([
    {
      ids: [ticketId, '060101'],
      list: ['万位', '千位', null, null, null]
    },
    {ids: [ticketId, '060102']},
    {ids: [ticketId, '060103']},
    {ids: [ticketId, '060104']},
    {ids: [ticketId, '060201']},
    {ids: [ticketId, '060202']},
    {ids: [ticketId, '060203']},
    {ids: [ticketId, '060204']}
  ]);

  //==================================================
  //后二

  addTwoRules([
    {
      ids: [ticketId, '060105'],
      list: [null, null, null, '十位', '个位']
    },
    {ids: [ticketId, '060106']},
    {ids: [ticketId, '060107']},
    {ids: [ticketId, '060108']},
    {ids: [ticketId, '060205']},
    {ids: [ticketId, '060206']},
    {ids: [ticketId, '060207']},
    {ids: [ticketId, '060208']}
  ]);

  //==================================================
  //一星

  factory.addRule([ticketId, '070101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(1, {
      matching: true
    })
  });

  //==================================================
  //任选二

  //复式
  factory.addRule([ticketId, '090101'], {
    algorithm: algorithm.optionalDouble,
    algorithmProps: {
      coefficient: 2
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(2, {
      repeat: true,
      matching: true
    })
  });

  //单式
  factory.addRule([ticketId, '090102'], {
    type: 'input',
    validate: algorithm.getValidateFunc(2),
    optionals: algorithm.getOptionals(2),
    create: algorithm.getCreateFunc(2, {
      slice: [1],
      repeat: true,
      innerSort: false
    })
  });

  //和值
  factory.addRule([ticketId, '090103'], {
    algorithm: algorithm.statistics,
    algorithmProps: {
      selectCount: 2
    },
    optionals: algorithm.getOptionals(2),
    list: factory.createList([''], {
      items: _.range(19),
      operate: 'none'
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(19)
    })
  });

  //组选复式
  factory.addRule([ticketId, '090201'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    optionals: algorithm.getOptionals(2),
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true
    })
  });

  //组选单式
  factory.addRule([ticketId, '090202'], {
    type: 'input',
    validate: algorithm.getValidateFunc(2, {
      acceptRepeat: 0,
      innerSort: true
    }),
    optionals: algorithm.getOptionals(2),
    create: algorithm.getCreateFunc(2, {
      slice: [1],
      outerSort: true
    })
  });

  //组选和值
  factory.addRule([ticketId, '090203'], {
    algorithm: algorithm.fromConfig,
    algorithmProps: {
      config: [null, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1]
    },
    optionals: algorithm.getOptionals(2),
    list: factory.createList([''], {
      items: _.range(1, 18),
      operate: 'none'
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(1, 18)
    })
  });

  //==================================================
  //任选三

  //复式
  factory.addRule([ticketId, '100101'], {
    algorithm: algorithm.optionalDouble,
    algorithmProps: {
      coefficient: 3
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(3, {
      repeat: true,
      matching: true
    })
  });

  //单式
  factory.addRule([ticketId, '100102'], {
    type: 'input',
    validate: algorithm.getValidateFunc(3),
    optionals: algorithm.getOptionals(3),
    create: algorithm.getCreateFunc(3, {
      slice: [2],
      repeat: true,
      innerSort: false
    })
  });

  //直选和值
  factory.addRule([ticketId, '100103'], {
    algorithm: algorithm.statistics,
    algorithmProps: {
      selectCount: 3
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList([''], {
      items: _.range(28),
      operate: 'none'
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(28)
    })
  });

  //组三
  factory.addRule([ticketId, '100201'], {
    algorithm: algorithm.factorial,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true
    })
  });
  //组六
  factory.addRule([ticketId, '100203'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(3, {
      outerSort: true
    })
  });

  //组选和值
  factory.addRule([ticketId, '100206'], {
    algorithm: algorithm.fromConfig,
    algorithmProps: {
      config: [null, 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1]
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList([''], {
      items: _.range(1, 27),
      operate: 'none'
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(1, 27)
    })
  });

  //混合组选
  factory.addRule([ticketId, '100205'], {
    type: 'input',
    validate: algorithm.getValidateFunc(3, {
      acceptRepeat: 1,
      maxRepeat: 2,
      minRepeat: 1,
      innerSort: true
    }),
    optionals: algorithm.getOptionals(3),
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: [2]
    })
  });

  //==================================================
  //任选四

  //复式
  factory.addRule([ticketId, '110101'], {
    algorithm: algorithm.optionalDouble,
    algorithmProps: {
      coefficient: 4
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(4, {
      repeat: true,
      matching: true
    })
  });

  //单式
  factory.addRule([ticketId, '110102'], {
    type: 'input',
    validate: algorithm.getValidateFunc(4),
    optionals: algorithm.getOptionals(4),
    create: algorithm.getCreateFunc(4, {
      slice: [3],
      repeat: true,
      innerSort: false
    })
  });

  //组选24
  factory.addRule([ticketId, '110201'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 4
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(4, {
      outerSort: true
    })
  });

  //组选12
  factory.addRule([ticketId, '110202'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 2
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [0, 2]
    })
  });

  //组选6
  factory.addRule([ticketId, '110203'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['二重号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1]
    })
  });

  //组选4
  factory.addRule([ticketId, '110204'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['三重号位', '单号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1]
    })
  });

  //==================================================
  //趣味
  // 后二大小单双
  factory.addRule([ticketId, '160201'], {
    algorithm: algorithm.mulAll,
    list: factory.createList(['十位', '个位'], {
      items: danshuang,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(2, {
      range: danshuang,
      matching: true
    })
  });

  // 后三大小单双
  factory.addRule([ticketId, '160202'], {
    algorithm: algorithm.mulAll,
    list: factory.createList(['百位','十位', '个位'], {
      items: danshuang,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(3, {
      range: danshuang,
      matching: true
    })
  });

  // 前二大小单双
  factory.addRule([ticketId, '160203'], {
    algorithm: algorithm.mulAll,
    list: factory.createList(['万位','千位'], {
      items: danshuang,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(2, {
      range: danshuang,
      matching: true
    })
  });
  // 前三大小单双
  factory.addRule([ticketId, '160204'], {
    algorithm: algorithm.mulAll,
    list: factory.createList(['万位','千位','百位'], {
      items: danshuang,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(3, {
      range: danshuang,
      matching: true
    })
  });


  // 一帆风顺
  factory.addRule([ticketId, '160301'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  // 好事成双
  factory.addRule([ticketId, '160302'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  // 三星报喜
  factory.addRule([ticketId, '160303'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  // 四季发财
  factory.addRule([ticketId, '160304'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1
    },
    list: factory.createList(['']),
    create: algorithm.getCreateFunc(1)
  });

  // 龙虎和
  factory.addRule([ticketId, '160101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160102'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160103'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160104'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160105'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160106'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160107'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160108'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160109'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

  factory.addRule([ticketId, '160110'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['龙虎'], {
      items: longhu,
      operate: 'none'
    }),
    format: {symbol: ' '},
    formatToNum: true,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true
    })
  });

}

module.exports = {
  install: function(ticketId) {
    _create(ticketId);
  }
};
