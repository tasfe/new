"use strict";

var quickPay = [
  {
    type: 1,
    name: 'unionpay',
    zhName: '银联支付',
    className: 'fc-re-union',
    pic: require('./union.png')
  },
  {
    type: 2,
    name: 'alipay',
    zhName: '支付宝',
    className: 'fc-re-alipay',
    pic: require('./alipay.png')
  },
  {
    type: 3,
    name: 'wechat',
    zhName: '微信支付',
    className: 'fc-re-wechat',
    pic: require('./wechat.png')
  },
  {
    type: 4,
    name: 'tongly_alipay',
    zhName: '支付宝',
    className: 'fc-re-alipay',
    pic: require('./alipay.png')
  },
  {
    type: 5,
    name: 'tongly_wechat',
    zhName: '微信支付',
    className: 'fc-re-wechat',
    pic: require('./wechat.png')
  }

];

module.exports = {
  get: function(id) {
    return _(quickPay).findWhere({
      type: id
    });
  }
};
