"use strict";

var helpConfig = {
  name: '帮助中心',
  icon: 'help',
  router: 'hc',
  sub: [
    {
      name: '常见问题',
      icon: require('./help-question.png'),
      sub: [
        {
          args: 'page=newbie',
          name: '新手类',
          html: require('helpCenter/faq/newbie.html')
        },
        {
          args: 'page=charge-withdrawal',
          name: '充提类',
          html: require('helpCenter/faq/charge-withdrawal.html')
        },
        {
          args: 'page=game',
          name: '游戏类',
          html: require('helpCenter/faq/game.html')
        },
        {
          args: 'page=safe',
          name: '安全类',
          html: require('helpCenter/faq/safe.html')
        }
      ]
    },
    {
      name: '充值相关',
      icon: require('./help-coins.png'),
      sub: [
        //{
        //  args: 'page=gh-recharge',
        //  name: '工行在线充值流程',
        //  html: require('helpCenter/recharge/gh-recharge.html')
        //},
        //{
        //  args: 'page=gh-receipt',
        //  name: '工行回执单查询',
        //  html: require('helpCenter/recharge/gh-receipt.html')
        //},
        {
          args: 'page=quick-top-up',
          name: '快捷充值流程',
          html: require('helpCenter/recharge/quick-top-up.html')
        },
        {
          args: 'page=quick-top-up-order',
          name: '快捷充值支付订单号',
          html: require('helpCenter/recharge/quick-top-up-order.html')
        },
        {
          args: 'page=charge-notice',
          name: '充值须知',
          html: require('helpCenter/recharge/charge-notice.html')
        }
      ]
    },
    {
      name: '提现相关',
      icon: require('./help-yan.png'),
      sub: [
        {
          args: 'page=withdrawal-flow',
          name: '平台提款流程',
          html: require('helpCenter/withdrawal/flow.html')
        },
        {
          args: 'page=withdrawal-question',
          name: '平台提款到账时间问题',
          html: require('helpCenter/withdrawal/question.html')
        }
      ]
    },
    {
      name: '账号相关',
      icon: require('./account.png'),
      sub: [
        {
          args: 'page=forget-pwd',
          name: '忘记登录密码怎么办？',
          html: require('helpCenter/account/forget-pwd.html')
        },
        {
          args: 'page=forget-fund-pwd',
          name: '忘记资金密码怎么办？',
          html: require('helpCenter/account/forget-fund-pwd.html')
        },
        {
          args: 'page=security-question',
          name: '保密问题基本介绍',
          html: require('helpCenter/account/security-question.html')
        },
        {
          args: 'page=forget-question',
          name: '忘记密保答案怎么办？',
          html: require('helpCenter/account/forget-question.html')
        },
        {
          args: 'page=contact-superior',
          name: '如何联系我的上级？',
          html: require('helpCenter/account/contact-superior.html')
        },
        {
          args: 'page=contact-inferior',
          name: '如何联系我的下级？',
          html: require('helpCenter/account/contact-inferior.html')
        },
        {
          args: 'page=search-ip',
          name: '如何查询当前IP地址？',
          html: require('helpCenter/account/search-ip.html')
        },
        {
          args: 'page=cancel-notice',
          name: '如何取消系统通知？',
          html: require('helpCenter/account/cancel-notice.html')
        }
      ]
    },
    {
      name: '玩法介绍',
      icon: require('./tickets.png'),
      sub: [
        {
          args: 'page=ssc',
          name: '时时彩玩法介绍',
          html: require('helpCenter/tickets/ssc.html')
        },
        {
          args: 'page=num',
          name: '11 选 5 玩法介绍',
          html: require('helpCenter/tickets/num.html')
        },
        {
          args: 'page=low',
          name: '低频彩玩法介绍',
          html: require('helpCenter/tickets/low.html')
        },
        {
          args: 'page=happy',
          name: '快乐彩玩法介绍',
          html: require('helpCenter/tickets/happy.html')
        }
      ]
    }
  ],
  hotProducts: [
    {
      id: 1,
      name: '重庆时时彩',
      iconClass: 'sfa-d-ssc-cq'
    },{
      id: 21,
      name: '韩国1.5分彩',
      iconClass: 'sfa-d-ssc-hg'

    },
    {
      id: 26,
      name: '加拿大3.5分彩',
      iconClass: 'sfa-d-ssc-jnd'

    },{
      id: 10,
      name: '繁华分分彩',
      iconClass: 'sfa-d-sp-ssc-ffc'
    },{
      id: 18,
      name: '北京PK拾',
      iconClass: 'sfa-d-happy-pk10'
    },
  ]
};

module.exports = {
  get: function(args) {
    var find;

    function findHelp(menu) {
      return menu.args === args;
    }

    for(var i = 0; i < helpConfig.sub.length; ++i) {
      if (helpConfig.sub[i].args === args) {
        return helpConfig.sub[i];
      } else {
        find = _(helpConfig.sub[i].sub).find(findHelp);
        if (find) {
          return find;
        }
      }
    }
  },

  getAll: function() {
    return helpConfig;
  }
};
