"use strict";

var quickPay = [
  {
    type: 1,
    name: 'unionpay',
    zhName: '银联支付一',
    className: 'fc-re-union',
    pic: require('./union.png'),
    sortId:1
  },
  {
    type: 2,
    name: 'alipay',
    zhName: '支付宝扫码支付',
    className: 'fc-re-alipay',
    pic: require('./alipay.png'),
    sortId:6
  },
  {
    type: 3,
    name: 'wechat',
    zhName: '微信小额支付',
    className: 'fc-re-wechat',
    pic: require('./wechat.png'),
    sortId:4
  },
  {
    type: 4,
    name: 'unionpay2',
    zhName: '银联支付二',
    className: 'fc-re-union',
    pic: require('./union.png'),
    sortId:2
  },
  {
    type: 5,
    name: 'unionpay3',
    zhName: '银联支付三',
    className: 'fc-re-union',
    pic: require('./union.png'),
    sortId:3
  },
  {
    type: 6,
    name: 'alipay',
    zhName: '支付宝支付',
    className: 'fc-re-alipay',
    pic: require('./alipay.png'),
    sortId:7
  },
  {
    type: 7,
    name: 'wechat',
    zhName: '微信大额支付',
    className: 'fc-re-wechat',
    pic: require('./wechat.png'),
    sortId:5
  },
  {
    type: 8,
    name: 'creditpay',
    zhName: '信用卡支付',
    className: 'fc-re-union',
    pic: require('./union.png'),
    sortId:8
  }
];

module.exports = {
  get: function(id) {
    return _(quickPay).findWhere({
      type: id
    });
  }
};
