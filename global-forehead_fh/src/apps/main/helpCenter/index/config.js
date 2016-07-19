"use strict";

var helpConfig = {
  name: '帮助中心',
  icon: 'help',
  router: 'hc',
  sub: [
    {
      id: 1,
      name: '新手类',
      icon: require('./account.png'),
      sub: [
        {
          args: 'page=about-us',
          name: '关于我们',
          html: require('helpCenter/newbie/about-us.html')
        },
        {
          args: 'page=all-tickets',
          name: '目前有哪些彩种可以投注？',
          html: require('helpCenter/newbie/all-tickets.html')
        },
        {
          args: 'page=buy-tickets',
          name: '购彩流程',
          html: require('helpCenter/newbie/buy-tickets.html')
        },
        {
          args: 'page=search-betting',
          name: '投注记录查询',
          html: require('helpCenter/newbie/search-betting.html')
        },
        {
          args: 'page=service',
          name: '在线客服服务时间',
          html: require('helpCenter/newbie/service.html')
        },
        {
          args: 'page=cant-open-service',
          name: '无法打开在线客服窗口怎么办？',
          html: require('helpCenter/newbie/cant-open-service.html')
        }
      ]
    },
    {
      id: 2,
      name: '充提类',
      icon: require('./rw.png'),
      sub: [
        {
          args: 'page=all-recharge',
          name: '平台支持哪些充值方式？',
          html: require('helpCenter/rw/all-recharge.html')
        },
        {
          args: 'page=all-withdraw',
          name: '平台支持哪些银行提现？',
          html: require('helpCenter/rw/all-withdraw.html')
        },
        {
          args: 'page=recharge-flow',
          name: '平台充值流程',
          html: require('helpCenter/rw/recharge-flow.html')
        },
        {
          args: 'page=withdraw-flow',
          name: '平台提现流程',
          html: require('helpCenter/rw/withdraw-flow.html')
        },
        {
          args: 'page=bank-problem',
          name: '完成银行转账15分钟以上充值仍未到账的原因及解决办法',
          html: require('helpCenter/rw/bank-problem.html')
        },
        {
          args: 'page=withdraw-problem',
          name: '未能成功提现的原因及解决办法',
          html: require('helpCenter/rw/withdraw-problem.html')
        },
        {
          args: 'page=unlock-card',
          name: '如何解锁银行卡',
          html: require('helpCenter/rw/unlock-card.html')
        },
        {
          args: 'page=withdraw-info',
          name: '平台提现限额、手续费及时间？',
          html: require('helpCenter/rw/withdraw-info.html')
        }
      ]
    },
    {
      id: 3,
      name: '游戏类',
      icon: require('./game.png'),
      sub: [
        {
          args: 'page=game-not-open',
          name: '官方未开奖如何处理？',
          html: require('helpCenter/game/game-not-open.html')
        },
        {
          args: 'page=illegal-betting',
          name: '什么是恶意投注？',
          html: require('helpCenter/game/illegal-betting.html')
        },
        {
          args: 'page=ch-number',
          name: '什么是冷热号？',
          html: require('helpCenter/game/ch-number.html')
        },
        {
          args: 'page=what-is-chase',
          name: '什么是追号？',
          html: require('helpCenter/game/what-is-chase.html')
        },
        {
          args: 'page=chase-info',
          name: '平台各个追号玩法含义',
          html: require('helpCenter/game/chase-info.html')
        }
      ]
    },
    {
      id: 4,
      name: '安全类',
      icon: require('./security.png'),
      sub: [
        {
          args: 'page=protect-acc',
          name: '如何避免账户被盗用？',
          html: require('helpCenter/security/protect-acc.html')
        },
        {
          args: 'page=fund-pwd',
          name: '资金密码',
          html: require('helpCenter/security/fund-pwd.html')
        },
        {
          args: 'page=pwd-brief',
          name: '密保问题基本介绍',
          html: require('helpCenter/security/pwd-brief.html')
        },
        {
          args: 'page=forget-pwd-answer',
          name: '忘记密保答案怎么办',
          html: require('helpCenter/security/forget-pwd-answer.html')
        }
      ]
    },
    {
      id: 5,
      name: '充值相关',
      icon: require('./withdrawal.png'),
      sub: [
        //{
        //  args: 'page=quick-top-up',
        //  name: '快捷充值流程',
        //  html: require('helpCenter/recharge/quick-top-up.html')
        //},
        {
          args: 'page=quick-gh',
          name: '如何查找工行快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-gh.html')
        },
        {
          args: 'page=quick-zh',
          name: '如何查找招行快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-zh.html')
        },
        {
          args: 'page=quick-jh',
          name: '如何查找建行快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-jh.html')
        },
        {
          args: 'page=quick-nh',
          name: '如何查找农行快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-nh.html')
        },
        {
          args: 'page=quick-zhh',
          name: '如何查找中行快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-zhh.html')
        },
        {
          args: 'page=quick-jiaoh',
          name: '如何查找交行快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-jiaoh.html')
        },
        {
          args: 'page=quick-mh',
          name: '如何查找民生快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-mh.html')
        },
        {
          args: 'page=quick-zhxh',
          name: '如何查找中信快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-zhxh.html')
        },
        {
          args: 'page=quick-guangh',
          name: '如何查找广发快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-guangh.html')
        },
        {
          args: 'page=quick-yh',
          name: '如何查找邮政快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-yh.html')
        },
        {
          args: 'page=quick-guangdah',
          name: '如何查找光大快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-guangdah.html')
        },
        {
          args: 'page=quick-ph',
          name: '如何查找平安快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-ph.html')
        },
        {
          args: 'page=quick-puh',
          name: '如何查找浦发快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-puh.html')
        },
        {
          args: 'page=quick-xh',
          name: '如何查找兴业快捷充值支付订单号？',
          html: require('helpCenter/recharge/quick-xh.html')
        }
        //{
        //  args: 'page=quick-top-up-order',
        //  name: '快捷充值支付订单号',
        //  html: require('helpCenter/recharge/quick-top-up-order.html')
        //}
        //{
        //  args: 'page=charge-notice',
        //  name: '充值须知',
        //  html: require('helpCenter/recharge/charge-notice.html')
        //}
      ]
    },
    {
      id: 6,
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
          args: 'page=contact',
          name: '上下级如何联系？',
          html: require('helpCenter/account/contact.html')
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
      id: 7,
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
          args: 'page=super3k',
          name: '超级3000玩法介绍',
          html: require('helpCenter/tickets/super3k.html')
        }

      ]
    }
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
