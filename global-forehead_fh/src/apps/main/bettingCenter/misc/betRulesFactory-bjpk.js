"use scrict";

var factory = require('bettingCenter/misc/betRulesFactory');
var algorithm = require('bettingCenter/misc/betRulesAlgorithm');

var ten = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

var seventeen = [ '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

var danshuang = ['大', '小', '单', '双'];

var longhu = ['龙','虎'];

var splitReg = /[\r\n,;:\|]+/;

function _create(ticketId) {
  //==================================================
  //猜前一

  //直选复式
  factory.addRule([ticketId, '010101'], {
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['冠军'], {
      items: ten
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: ten,
      matching: true
    })
  });

  //==============================
  //猜前二

  //直选复式
  factory.addRule([ticketId, '020101'], {
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['冠军', '亚军'], {
      items: ten
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: ten,
      matching: true
    })
  });

  //直选单式
  factory.addRule([ticketId, '020102'], {
    type: 'input',
    splitReg: splitReg,
    validate: algorithm.getValidateFunc(2, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' '
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: ten,
      repeat: true,
      innerSort: false
    })
  });

  //==============================
  //猜前三

  //直选复式
  factory.addRule([ticketId, '030101'], {
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['冠军', '亚军', '季军'], {
      items: ten
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: ten,
      matching: true
    })
  });

  //直选单式
  factory.addRule([ticketId, '030102'], {
    type: 'input',
    splitReg: splitReg,
    validate: algorithm.getValidateFunc(3, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' '
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: ten,
      repeat: true,
      innerSort: false
    })
  });

  //==============================
  //猜前四

  //直选复式
  factory.addRule([ticketId, '040101'], {
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['冠军', '亚军', '季军', '第四名'], {
      items: ten
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(4, {
      range: ten,
      matching: true
    })
  });

  //直选单式
  factory.addRule([ticketId, '040102'], {
    type: 'input',
    splitReg: splitReg,
    validate: algorithm.getValidateFunc(4, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' '
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(4, {
      range: ten,
      repeat: true,
      innerSort: false
    })
  });

  //==============================
  //猜前五

  //直选复式
  factory.addRule([ticketId, '050101'], {
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['冠军', '亚军', '季军', '第四名', '第五名'], {
      items: ten
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(5, {
      range: ten,
      matching: true
    })
  });

  //直选单式
  factory.addRule([ticketId, '050102'], {
    type: 'input',
    splitReg: splitReg,
    validate: algorithm.getValidateFunc(5, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' '
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(5, {
      range: ten,
      repeat: true,
      innerSort: false
    })
  });

  //=============================
  //定位胆

  factory.addRule([ticketId, '060101'], {
    //type: 'multiPage',
    page: 5,
    algorithm: algorithm.addAll,
    list: factory.createList(['冠军', '亚军', '季军', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'], {
      items: ten
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: ten,
      matching: true
    })
  });

  //==========================
  //大小单双

  factory.addRule([ticketId, '070101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['冠军', '亚军', '季军'], {
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

  //==========================
  //龙虎斗
  // factory.addRule([ticketId, '080101'], {
  //   algorithm: algorithm.addAll,
  //   list: factory.createList(['冠军VS第十名', '亚军VS第九名', '季军VS第八名', '第四名VS第七名', '第五名VS第六名'], {
  //     items: longhu,
  //     operate: 'none',
  //     showLogo:false
  //   }),
  //   format: {symbol: ' '},
  //   formatToNum: true,
  //   create: algorithm.getCreateFunc(2, {
  //     range: longhu,
  //     matching: true
  //   })
  // });
  //
  // //==========================
  // //猜冠亚合
  //
  // //和值
  // factory.addRule([ticketId, '090101'], {
  //   algorithm: algorithm.mulAllNotRepeat,
  //   list: factory.createList(['和值'], {
  //     items: seventeen,
  //     operate: 'none'
  //   }),
  //   format: {symbol: ' '},
  //   formatToNum: true,
  //   create: algorithm.getCreateFunc(2, {
  //     range: seventeen,
  //     matching: true
  //   })
  // });
  //
  // //大小单双
  // factory.addRule([ticketId, '090201'], {
  //   algorithm: algorithm.addAll,
  //   list: factory.createList(['大小单双'], {
  //     items: danshuang,
  //     operate: 'none'
  //   }),
  //   format: {symbol: ' '},
  //   formatToNum: true,
  //   create: algorithm.getCreateFunc(2, {
  //     range: danshuang,
  //     matching: true
  //   })
  // });


}

module.exports = {
  install: function(ticketId) {
    _create(ticketId);
  }
};
