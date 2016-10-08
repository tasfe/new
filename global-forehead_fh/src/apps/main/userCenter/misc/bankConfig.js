
"use strict";

var banks = [
  {
    id: 1,
    zhName: '招商银行',
    pic: require('base/images/bank/userCenter/zhaoshang.png'),
    logo: require('base/images/bank/fundCenter/zhaoshang.png'),
    className: 'fc-re-bank-zhaoshang'
  },
  {
    id: 2,
    zhName: '工商银行',
    pic:  require('base/images/bank/userCenter/gongshang.png'),
    logo: require('base/images/bank/fundCenter/gongshang.png'),
    className: 'fc-re-bank-gongshang'
  },
  {
    id: 3,
    zhName: '建设银行',
    pic: require('base/images/bank/userCenter/jianshe.png'),
    logo: require('base/images/bank/fundCenter/jianshe.png'),
    className: 'fc-re-bank-jianshe'
  },
  {
    id: 4,
    zhName: '农业银行',
    pic: require('base/images/bank/userCenter/nongye.png'),
    logo: require('base/images/bank/fundCenter/nongye.png'),
    className: 'fc-re-bank-nongye'
  },
  {
    id: 5,
    zhName: '中国银行',
    pic: require('base/images/bank/userCenter/zhongguo.png'),
    logo: require('base/images/bank/fundCenter/zhongguo.png'),
    className: 'fc-re-bank-zhongguo'
  },

  {
    id: 6,
    zhName: '交通银行',
    pic: require('base/images/bank/userCenter/jiaotong.png'),
    logo: require('base/images/bank/fundCenter/jiaotong.png'),
    className: 'fc-re-bank-jiaotong'
  },
  {
    id: 7,
    zhName: '广发银行',
    pic: require('base/images/bank/userCenter/guangfa.png'),
    logo: require('base/images/bank/fundCenter/guangfa.png'),
    className: 'fc-re-bank-guangfa'
  },
  {
    id: 8,
    zhName: '光大银行',
    pic: require('base/images/bank/userCenter/guangda.png'),
    logo: require('base/images/bank/fundCenter/guangda.png'),
    className: 'fc-re-bank-guangda'
  },
  {
    id: 9,
    zhName: '浦发银行',
    pic: require('base/images/bank/userCenter/pufa.png'),
    logo: require('base/images/bank/fundCenter/pufa.png'),
    className: 'fc-re-bank-pufa'
  },
  {
    id: 10,
    zhName: '民生银行',
    pic: require('base/images/bank/userCenter/minsheng.png'),
    logo: require('base/images/bank/fundCenter/minsheng.png'),
    className: 'fc-re-bank-minsheng'
  },
  // {
  //   id: 11,
  //   zhName: '平安银行',
  //   pic: ,
  //   logo: ,
  //   className: ''// 'fc-re-bank-pingan'
  // },
  // {
  //   id: 12,
  //   zhName: '兴业银行',
  //   pic: ,
  //   logo: ,
  //   className:  ''//'fc-re-bank-xingye'
  // },
  // {
  //   id: 13,
  //   zhName: '中信银行',
  //   pic: ,
  //   logo: ,
  //   className:  ''//'fc-re-bank-zhongxin'
  // },
  // {
  //   id: 14,
  //   zhName: '邮政银行',
  //   pic: ,
  //   logo: ,
  //   className: ''// 'fc-re-bank-youzheng'
  // },
  // {
  //   id: 15,
  //   zhName: '华夏银行',
  //   pic: ,
  //   logo: ,
  //   className:  ''//'fc-re-bank-huaxia'
  // }
];

module.exports = {
  get: function(id) {
    return _(banks).findWhere({
      id: id
    });
  }
};

