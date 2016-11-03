"use strict";

var defaultSelectSSC = '4';
var defaultSelect115 = '4,4';
var defaultSelectDPC = '0';

var specialConfig = {
  id: 'ssc',
  title: '繁华专享',
  icon: 'ssc',
  titleIcon: 'entry-ssc',
  list: [
    {
      id: 10,
      mark: 'ffc',
      zhName: "繁华分分彩",
      quickShowName: "繁华<br/>分分彩",
      optional: true,
      defaultSelectPlay: defaultSelectSSC,
      desc: '全天24小时',
      planCount: '共1440期',
      badge: 'hot',
      img: require('images/fh-ticket-ffc.png')
    },
    {
      id: 12,
      mark: 'wfc',
      zhName: "繁华五分彩",
      quickShowName: "繁华<br/>五分彩",
      optional: true,
      defaultSelectPlay: defaultSelectSSC,
      desc: '全天24小时',
      planCount: '共288期',
      badge: '',
      img: require('images/fh-ticket-5fc.png')
      },
    // {
    //    id: 13,
    //    mark: 'ssc-sfc',
    //    zhName: "繁华三分彩",
    //    quickShowName: "繁华<br/>三分彩",
    //    optional: true,
    //    defaultSelectPlay: defaultSelectSSC,
    //    desc: '全天24小时 共480期',
    //    badge: '',
    //    img: 'images/fh-ticket-3fc.png'*/
      // },
  /* {
        id: 19,
        mark: 'ssc-mmc',
        zhName: "繁华秒秒彩",
        quickShowName: "秒秒彩",
        optional: true,
        defaultSelectPlay: defaultSelectSSC,
        badge: 'hot',
        desc: '全天24小时 即投即开',
        img: require('images/fh-ticket-mmc.png')
    },{
      id: 20,
      mark: 'ssc-mmc',
      zhName: "老虎机秒秒彩",
      quickShowName: "老虎机<br/>秒秒彩",
      optional: true,
      defaultSelectPlay: defaultSelectSSC,
      badge: 'recommend',//recommend
      img: 'images/fh-ticket-lhjmmc.png'
    },{
      id: 16,
      mark: '3d-ffc',
      zhName: "3D分分彩",
      quickShowName: "3D<br/>分分彩",
      optional: false,
      desc: '全天24小时 共1440期',
      defaultSelectPlay: defaultSelectDPC,
      badge: '',
      img: 'images/fh-ticket-3D-ffc.png'
    }*/
  ]
};

var sscConfig = {
  id: 'ssc',
  title: '时时彩',
  icon: 'ssc',
  titleIcon: 'entry-ssc',
  list: [
    {
      id: 1,
      mark: 'cq',
      zhName: "重庆时时彩",
      quickShowName: "重庆<br/>时时彩",
      optional: true,
      defaultSelectPlay: defaultSelectSSC,
      desc: '10:00－01:55',
      planCount: '共120期',
      badge: 'hot',
      img: require('images/fh-ticket-cqssc.png')
    },
    /*{
     id: 2,
     mark: 'jx',
     zhName: "江西时时彩",
     quickShowName: "江西<br/>时时彩",
     defaultSelectPlay: defaultSelectSSC,
     img: 'images/fh-ticket-jxssc.png',
     badge: ''
    },
    {
      id: 3,
      mark: 'xj',
      zhName: "新疆时时彩",
      quickShowName: "新疆<br/>时时彩",
      optional: true,
      desc: '10:10－02:00',
      planCount: '共96期',
      defaultSelectPlay: defaultSelectSSC,
      img: 'images/fh-ticket-xjssc.png',
      badge: ''
    },
    {
      id: 8,
      mark: 'tj',
      zhName: "天津时时彩",
      quickShowName: "天津<br/>时时彩",
      optional: true,
      desc: '09:10－23:00',
      planCount: '共84期',
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
      img: 'images/fh-ticket-tjssc.png'
    },
    {
      id: 9,
      mark: 'hlj',
      zhName: "黑龙江时时彩",
      quickShowName: "黑龙江<br/>时时彩",
      optional: true,
      desc: '08:50－22:40',
      planCount: '共84期',
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
      img: 'images/fh-ticket-hljssc.png'
    },*/
    {
      id: 21,
      mark: 'hg',
      zhName: "韩国1.5分彩",
      quickShowName: "韩国<br/>1.5分彩",
      optional: true,
      badge: '',
      defaultSelectPlay: defaultSelectSSC,
      img: require('images/fh-ticket-hg.png')
    }
  ]
};

var oneFiveConfig = {
  id: 'num',
  title: '11选5',
  icon: 'num',
  titleIcon: 'entry-num',
  list: [
    {
      id: 5,
      mark: 'sd',
      zhName: "山东11选5",
      quickShowName: "山东<br/>11选5",
      optional: false,
      desc: '09:05－21:55',
      planCount: '共78期',
      defaultSelectPlay: defaultSelect115,
      badge: '',
      img: require('images/fh-ticket-sd115.png')
    },
    /*{
      id: 4,
      mark: 'gd',
      zhName: "广东11选5",
      quickShowName: "广东<br/>11选5",
      optional: false,
      desc: '09:10－23:00',
      planCount: '共84期',
      defaultSelectPlay: defaultSelect115,
      badge: '',
      img: 'images/fh-ticket-gd115.png'
    },
    {
      id: 11,
      mark: 'jx',
      zhName: "江西11选5",
      quickShowName: "江西<br/>11选5",
      optional: false,
      desc: '09:10－23:00',
      planCount: '共84期',
      defaultSelectPlay: defaultSelect115,
      badge: '',
      img: 'images/fh-ticket-jx115.png'
    },*/
    {
      id: 14,
      mark: 'ffc',
      zhName: "11选5分分彩",
      optional: false,
      quickShowName: "11选5<br/>分分彩",
      defaultSelectPlay: defaultSelect115,
      badge: '',
      img: require('images/fh-ticket-ffc115.png')
    }
  ]
};
var threeDConfig = {
  id: 6,
  mark: '3d',
  zhName: "3D",
  quickShowName: "3D",
  optional: false,
  desc: '00:00－20:20',
  planCount: '共1期',
  defaultSelectPlay: defaultSelectDPC,
  badge: '',
  img: require('images/fh-ticket-3D.png')
};
var p5p3Config = {
/* id: 7,
  mark: 'p5p3',
  zhName: "P5/P3",
  quickShowName: "P5/P3",
  optional: false,
  desc: '00:00－20:20',
  planCount: '共1期',
  defaultSelectPlay: defaultSelectDPC,
  badge: '',
  img: 'images/fh-ticket-P5.png'*/
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
      zhName: "北京PK10",
      quickShowName: "北京<br/>PK10",
      defaultSelectPlay: defaultSelectDPC,
      optional: false,
      badge: '',
      img: require('images/fh-ticket-pk10.png')
    }
  ]
};

var lowConfig = {
  id: 'low',
  title: '低频彩',
  icon: 'low',
  titleIcon: 'entry-low',
  //list: [threeDConfig,p5p3Config]
  list: [threeDConfig]
};

//var allConfig = specialConfig.list.concat(sscConfig.list, oneFiveConfig.list, threeDConfig.list,[threeDConfig], [p5p3Config],happyConfig.list);
var allConfig = specialConfig.list.concat(sscConfig.list, oneFiveConfig.list, threeDConfig.list,[threeDConfig],happyConfig.list);

var completeAllConfig = [specialConfig, sscConfig, oneFiveConfig, lowConfig,happyConfig];

module.exports = {
  getSccList: function() {
    return sscConfig.list.concat(specialConfig.list);
  },

  getCompleteSccList: function() {
    return sscConfig;
  },

  getChoose5List: function() {
    return oneFiveConfig.list;
  },

  getCompleteChoose5List: function() {
    return oneFiveConfig;
  },

  get3DList: function() {
    return [threeDConfig];
  },

  getP5P3List: function() {
    return [p5p3Config];
  },

  getLowList: function() {
    return lowConfig;
  },

  getHappyList: function() {
    return happyConfig.list;
  },

  getCompleteHappyList: function() {
    return happyConfig;
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
        id: id
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
