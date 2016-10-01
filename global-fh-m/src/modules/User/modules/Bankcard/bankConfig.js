var banks = [
  {
    id: 1,
    zhName: '招商银行',
    //pic: 'images/bank/zhaoshang.png',
    logo: 'images/bank/zhaoshang.png',
    className: 'fc-re-bank-zhaoshang'
  },
  {
    id: 2,
    zhName: '工商银行',
    //pic:  'images/bank/gongshang.png',
    logo: 'images/bank/gongshang.png',
    className: 'fc-re-bank-gongshang'
  },
  {
    id: 3,
    zhName: '建设银行',
    //pic: 'images/bank/jianshe.png',
    logo: 'images/bank/jianshe.png',
    className: 'fc-re-bank-jianshe'
  },
  {
    id: 4,
    zhName: '农业银行',
    //pic: 'images/bank/nongye.png',
    logo: 'images/bank/nongye.png',
    className: 'fc-re-bank-nongye'
  },
  {
    id: 5,
    zhName: '中国银行',
    //pic: 'images/bank/zhongguo.png',
    logo: 'images/bank/zhongguo.png',
    className: 'fc-re-bank-zhongguo'
  },

  {
    id: 6,
    zhName: '交通银行',
    //pic: 'images/bank/jiaotong.png',
    logo: 'images/bank/jiaotong.png',
    className: 'fc-re-bank-jiaotong'
  },
  {
    id: 7,
    zhName: '广发银行',
    //pic: 'images/bank/guangfa.png',
    logo: 'images/bank/guangfa.png',
    className: 'fc-re-bank-guangfa'
  },
  {
    id: 8,
    zhName: '光大银行',
    //pic: 'images/bank/guangda.png',
    logo: 'images/bank/guangda.png',
    className: 'fc-re-bank-guangda'
  },
  {
    id: 9,
    zhName: '浦发银行',
    //pic: 'images/bank/pufa.png',
    logo: 'images/bank/pufa.png',
    className: 'fc-re-bank-pufa'
  },
  {
    id: 10,
    zhName: '民生银行',
    //pic: 'images/bank/minsheng.png',
    logo: 'images/bank/minsheng.png',
    className: 'fc-re-bank-minsheng'
  },
  {
    id: 11,
    zhName: '平安银行',
    //pic: 'images/bank/pingan.png',
    logo: 'images/bank/pingan.png',
    className: 'fc-re-bank-pingan'
  },
  {
    id: 12,
    zhName: '兴业银行',
    //pic: 'images/bank/xingye.png',
    logo: 'images/bank/xingye.png',
    className: 'fc-re-bank-xingye'
  },
  {
    id: 13,
    zhName: '中信银行',
    //pic: 'images/bank/zhongxin.png',
    logo: 'images/bank/zhongxin.png',
    className: 'fc-re-bank-zhongxin'
  },
  {
    id: 14,
    zhName: '邮政银行',
    //pic: 'images/bank/youzheng.png',
    logo: 'images/bank/youzheng.png',
    className: 'fc-re-bank-youzheng'
  },
  {
    id: 15,
    zhName: '华夏银行',
    //pic: 'images/bank/huaxia.png',
    logo: 'images/bank/huaxia.png',
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

