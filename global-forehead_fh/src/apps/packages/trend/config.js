"use strict";

var sscPositions = ['万位', '千位', '百位', '十位', '个位'];
var sscOneDay = 120;
var PK10Positions = ['第一名', '第二名', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];

var sscConfig = [
  {
    id: 20,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: -1,
    zhName: "老虎机秒秒彩"
  },
  {
    id: 19,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: -1,
    zhName: "秒秒彩"
  },
  {
    id: 18,
    count: 10,
    num: _.range(1, 11),
    positions: PK10Positions,
    oneDay: -1,
    zhName: "北京PK10"
  },
  {
    id: 10,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 1440,
    zhName: "分分彩"
  },
  {
    id: 13,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 480,
    zhName: "三分彩"
  },
  {
    id: 12,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 288,
    zhName: "五分彩"
  },
  {
    id: 1,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    isSuper:true,
    zhName: "重庆时时彩"
  },
  {
    id: 2,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    isSuper:true,
    zhName: "江西时时彩"
  },
  {
    id: 3,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    isSuper:true,
    zhName: "新疆时时彩"
  },
  {
    id: 8,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    isSuper:true,
    zhName: "天津时时彩"
  },
  {
    id: 9,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    isSuper:true,
    zhName: "黑龙江时时彩"
  }
];

var oneFivePosition = ['第一位', '第二位', '第三位', '第四位', '第五位'];

var oneFiveConfig = [
  {
    id: 14,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 1440,
    zhName: "11选5分分彩"
  },
  {
    id: 15,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 480,
    zhName: "11选5三分彩"
  },
  {
    id: 5,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 78,
    zhName: "山东11选5"
  },
  {
    id: 4,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 84,
    zhName: "广东11选5"
  },
  {
    id: 11,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 84,
    zhName: "江西11选5"
  }
];

var threeDConfig = [
  {
    id: 16,
    count: 3,
    num: _.range(10),
    positions: ['百位', '十位', '个位'],
    oneDay: 1440,
    zhName: "3D分分彩"
  },
  {
    id: 17,
    count: 3,
    num: _.range(10),
    positions: ['百位', '十位', '个位'],
    oneDay: 288,
    zhName: "3D五分彩"
  },
  {
    id: 6,
    count: 3,
    num: _.range(10),
    positions: ['百位', '十位', '个位'],
    zhName: "3D"
  }
];
var p5p3Config = [
  {
    id: 7,
    count: 5,
    num: _.range(10),
    positions: ['万位', '千位', '百位', '十位', '个位'],
    zhName: "P5/P3"
  }
];

var allConfig = sscConfig.concat(oneFiveConfig, threeDConfig, p5p3Config);

module.exports = {
  get: function(id) {
    return _(allConfig).findWhere({
      id: id
    });
  }
};
