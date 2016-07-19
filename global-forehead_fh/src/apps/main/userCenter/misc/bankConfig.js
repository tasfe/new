
"use strict";

var banks = [
  {
    id: 1,
    zhName: '招商银行',
    pic: require('./zhaoshang.png'),
    logo: require('./zhaoshangL.png'),
    className: 'fc-re-bank-zhaoshang'
  },
  {
    id: 2,
    zhName: '工商银行',
    pic:  require('./gongshang.png'),
    logo: require('./gongshangL.png'),
    className: 'fc-re-bank-gongshang'
  },
  {
    id: 3,
    zhName: '建设银行',
    pic: require('./jianshe.png'),
    logo: require('./jiansheL.png'),
    className: 'fc-re-bank-jianshe'
  },
  {
    id: 4,
    zhName: '农业银行',
    pic: require('./nongye.png'),
    logo: require('./nongyeL.png'),
    className: 'fc-re-bank-nongye'
  },
  {
    id: 5,
    zhName: '中国银行',
    pic: require('./zhongguo.png'),
    logo: require('./zhongguoL.png'),
    className: 'fc-re-bank-zhongguo'
  },

  {
    id: 6,
    zhName: '交通银行',
    pic: require('./jiaotong.png'),
    logo: require('./jiaotongL.png'),
    className: 'fc-re-bank-jiaotong'
  },
  {
    id: 7,
    zhName: '广发银行',
    pic: require('./guangfa.png'),
    logo: require('./guangfaL.png'),
    className: 'fc-re-bank-guangfa'
  },
  {
    id: 8,
    zhName: '光大银行',
    pic: require('./guangda.png'),
    logo: require('./guangdaL.png'),
    className: 'fc-re-bank-guangda'
  },
  {
    id: 9,
    zhName: '浦发银行',
    pic: require('./pufa.png'),
    logo: require('./pufaL.png'),
    className: 'fc-re-bank-pufa'
  },
  {
    id: 10,
    zhName: '民生银行',
    pic: require('./minsheng.png'),
    logo: require('./minshengL.png'),
    className: 'fc-re-bank-minsheng'
  },
  {
    id: 11,
    zhName: '平安银行',
    pic: require('./pingan.png'),
    logo: require('./../../fundCenter/misc/pinganL.png'),
    className: 'fc-re-bank-pingan'
  },
  {
    id: 12,
    zhName: '兴业银行',
    pic: require('./xingye.png'),
    logo: require('./xingyeL.png'),
    className: 'fc-re-bank-xingye'
  },
  {
    id: 13,
    zhName: '中信银行',
    pic: require('./zhongxin.png'),
    logo: require('./zhongxinL.png'),
    className: 'fc-re-bank-zhongxin'
  },
  {
    id: 14,
    zhName: '邮政银行',
    pic: require('./youzheng.png'),
    logo: require('./../../fundCenter/misc/youzhengL.png'),
    className: 'fc-re-bank-youzheng'
  },
  {
    id: 15,
    zhName: '华夏银行',
    pic: require('./huaxia.png'),
    logo: require('./../../fundCenter/misc/huaxiaL.png'),
    className: 'fc-re-bank-huaxia'
  }
];

module.exports = {
  get: function(id) {
    return _(banks).findWhere({
      id: id
    });
  }
};

