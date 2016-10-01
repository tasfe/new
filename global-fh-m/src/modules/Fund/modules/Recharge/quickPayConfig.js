"use strict";

var quickPay = [
  {
    id: 1,
    name: 'unionpay',
    zhName: '银联支付',
    className: 'fc-re-union',
    pic: 'images/union.png'
  },
  {
    id: 2,
    name: 'alipay',
    zhName: '支付宝',
    className: '',
    pic: 'images/zhifubao.png'
  },
  {
    id: 3,
    name: 'weixin',
    zhName: '微信支付',
    className: 'fc-re-weixin',
    pic: 'images/weixin.png'
  },
  //{
  //  id: 4,
  //  name: 'unionpay2',
  //  zhName: '网银支付二',
  //  className: 'fc-re-union',
  //  pic: 'images/union.png'
  //}
];

module.exports = {
  get: function(id) {
    return _(quickPay).findWhere({
      id: id
    });
  }
};
