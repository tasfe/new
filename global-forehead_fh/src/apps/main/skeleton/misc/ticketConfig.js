"use strict";

var defaultSelectSSC = '4';
var defaultSelect115 = '4,4';
var defaultSelectDPC = '0';




//繁华专享
var specialConfig = {
  id: 'sp',
  title: '繁华专享',
  icon: 'sp',
  list: [

    {
      id: 10,
      type: 'ssc',
      mark: 'ssc-ffc',
      zhName: "繁华分分彩",
      quickShowName: "繁华分分彩",
      optional: true,
      defaultSelectPlay: defaultSelectSSC,
      desc: '全天24小时 共1440期',
      board: true,
      isSuper: false,
      badge: 'hot'
    },
    {
      id: 12,
      type: 'ssc',
      mark: 'ssc-wfc',
      zhName: "繁华五分彩",
      quickShowName: "繁华五分彩",
      optional: true,
      isSuper: false,
      defaultSelectPlay: defaultSelectSSC,
      desc: '全天24小时 共288期',
      board: true,
      badge: 'hot'
    },
    {
      id: 13,
      type: 'ssc',
      mark: 'ssc-sfc',
      zhName: "繁华三分彩",
      quickShowName: "繁华三分彩",
      optional: true,
      isSuper: false,
      defaultSelectPlay: defaultSelectSSC,
      desc: '全天24小时 共480期',
      badge: 'hot'
    },
    {
      id: 19,
      type: 'ssc',
      mark: 'ssc-mmc',
      zhName: "繁华秒秒彩",
      optional: true,
      desc: '全天24小时 即投即开',
      defaultSelectPlay: defaultSelectSSC,
      board: true,
      badge: 'hot'
    }/*,
    {
      id: 20,
      type: 'ssc',
      mark: 'ssc-smmc',
      zhName: "老虎机秒秒彩",
      optional: true,
      desc: '全天24小时 即投即开',
      defaultSelectPlay: defaultSelectSSC,
      board: true,
      badge: 'purple',
    }
*/
  ]
};

//时时彩
var sscConfig = {
  id: 'ssc',
  title: '时时彩',
  icon: 'ssc',
  list: [
    {
      id: 1,
      mark: 'cq',
      zhName: "重庆时时彩",
      quickShowName: "重庆<br/>时时彩",
      optional: true,
      isSuper: true,
      defaultSelectPlay: defaultSelectSSC,
      desc: '10:00－01:55  共120期',
      board: true,
      badge: 'hot'
      //badge: 'recommend'
    },
    {
      id: 3,
      mark: 'xj',
      zhName: "新疆时时彩",
      quickShowName: "新疆<br/>时时彩",
      optional: true,
      isSuper: true,
      desc: '10:10－02:00  共96期',
      board: true,
      defaultSelectPlay: defaultSelectSSC
    },
    {
      id: 8,
      mark: 'tj',
      zhName: "天津时时彩",
      quickShowName: "天津<br/>时时彩",
      optional: true,
      isSuper: true,
      desc: '09:10－23:00 共84期',
      board: true,
      defaultSelectPlay: defaultSelectSSC
    },
    {
      id: 9,
      mark: 'hlj',
      zhName: "黑龙江时时彩",
      quickShowName: "黑龙江<br/>时时彩",
      optional: true,
      isSuper: true,
      desc: '08:50－22:40 共84期',
      //board: true,
      defaultSelectPlay: defaultSelectSSC
    },
    {
      id: 21,
      mark: 'hg',
      zhName: "韩国1.5分彩",
      quickShowName: "韩国<br/>1.5分彩",
      optional: true,
      isSuper: true,
      desc: '',
      defaultSelectPlay: defaultSelectSSC
    },
    {
      id: 24,
      mark: 'tw',
      zhName: "台湾5分彩",
      quickShowName: "台湾<br/>5分彩",
      optional: true,
      isSuper: true,
      desc: '',
      defaultSelectPlay: defaultSelectSSC
    },
    {
      id: 25,
      mark: 'xjp',
      zhName: "新加坡2分彩",
      quickShowName: "新加坡<br/>2分彩",
      optional: true,
      isSuper: true,
      desc: '',
      defaultSelectPlay: defaultSelectSSC,

    },
    {
      id: 26,
      mark: 'jnd',
      zhName: "加拿大3.5分彩",
      quickShowName: "加拿大<br/>3.5分彩",
      optional: true,
      isSuper: true,
      desc: '',
      defaultSelectPlay: defaultSelectSSC,

    }
  ]
};

//11选5
var oneFiveConfig = {
  id: 'num',
  title: '11选5',
  icon: 'num',
  list: [
    {
      id: 4,
      mark: 'gd',
      zhName: "广东11选5",
      optional: false,
      isSuper: false,
      desc: '09:10－23:00 共84期',
      board: true,
      defaultSelectPlay: defaultSelect115
    },
    {
      id: 5,
      mark: 'sd',
      zhName: "山东11选5",
      optional: false,
      isSuper: false,
      desc: '09:05－21:55 共78期',
      defaultSelectPlay: defaultSelect115,
      board: true,
      hot: true
    },
    {
      id: 11,
      mark: 'jx',
      zhName: "江西11选5",
      optional: false,
      isSuper: false,
      desc: '09:10－23:00 共84期',
      board: true,
      defaultSelectPlay: defaultSelect115
    },
    {
      id: 14,
      type: 'num',
      mark: 'ffc',
      zhName: "11选5分分彩",
      optional: false,
      desc: '全天24小时 共1440期',
      defaultSelectPlay: defaultSelect115,
      hot: true
    },
  ]
};

//3D
var threeDConfig = [
  {
    id: 6,
    mark: '3d',
    zhName: "3D",
    optional: false,
    isSuper: false,
    desc: '00:00－20:20  共1期',
    board: true,
    defaultSelectPlay: defaultSelectDPC
  },
  {
    id: 16,
    type: '3d',
    mark: '3d-ffc',
    zhName: "繁华3D分分彩",
    optional: false,
    isSuper: false,
    desc: '全天24小时 共1440期',
    defaultSelectPlay: defaultSelectDPC
  },
];

//p5p3
var p5p3Config = [
  {
    id: 7,
    mark: 'p5p3',
    zhName: "P5/P3",
    quickShowName: "P5/P3",
    optional: false,
    isSuper: false,
    desc: '00:00－20:20  共1期',
    board: true,
    defaultSelectPlay: defaultSelectDPC
  }
];

var lowConfig = {
  id: 'low',
  title: '低频彩',
  icon: 'low',
  titleIcon: 'entry-low',
  list: threeDConfig.concat(p5p3Config)
};

var happyConfig = {
  id: 'happy',
  title: '快乐彩',
  icon: 'happy',
  titleIcon: 'entry-happy',
  list: [
    {
      id: 18,
      mark: 'pk10',
      zhName: "北京PK拾",
      quickShowName: "北京<br/>PK拾",
      defaultSelectPlay: defaultSelectDPC,
      hasMargin: true,
      badge: 'new'
    }
  ]
};

var allConfig = specialConfig.list.concat( sscConfig.list, oneFiveConfig.list, threeDConfig.list,threeDConfig, p5p3Config);

var completeAllConfig = [ specialConfig, sscConfig, oneFiveConfig, lowConfig,happyConfig];

module.exports = {
  getSccList: function() {
    return sscConfig.list.concat(_(specialConfig.list).where({
      type: 'ssc'
    }));
  },

  getCompleteSccList: function() {
    return sscConfig;
  },

  getChoose5List: function() {
    return oneFiveConfig.list.concat(_(specialConfig.list).where({
      type: 'num'
    }));
  },

  getCompleteChoose5List: function() {
    return oneFiveConfig;
  },

  get3DList: function() {
    return threeDConfig.concat(_(specialConfig.list).where({
      type: '3d'
    }));
  },

  getP5P3List: function() {
    return p5p3Config;
  },

  getLowList: function() {
    return lowConfig.list.concat(_(specialConfig.list).where({
      type: '3d'
    }));
  },

  getHappyList: function() {
    return happyConfig.list;
  },

  getAll: function() {
    return allConfig;
  },

  getCompleteAll: function() {
    return completeAllConfig;
  },

  get: function(index) {
    return _(allConfig).getConfig(index);
  },

  getComplete: function(id) {
    for(var i = 0; i < completeAllConfig.length; ++i) {
      var find = _(completeAllConfig[i].list).findWhere({
        id: Number(id)
      });
      if (find) {
        return _({
          info: find
        }).extend(_(completeAllConfig[i]).pick('id', 'title', 'titleIcon', 'itemIcon'));
      }
    }
  },

  toZh: function(id) {
    return _(allConfig).getConfigById(id);
  }
};
