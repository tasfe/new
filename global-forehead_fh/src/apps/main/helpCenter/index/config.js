"use strict";

var helpConfig = {
  name: '帮助中心',
  icon: 'help',
  router: 'hc',
  sub: [
    {
      name: '新手上路',
      icon: require('./help-new.png'),
      sub: [
        {
          args: 'page=gr-aboutUs',
          name: '关于繁华',
          html: require('helpCenter/greenhand/aboutUs.html')
        },
        {
          args: 'page=gr-register',
          name: '平台购彩',
          html: require('helpCenter/greenhand/register.html')
        },
        {
          args: 'page=gr-function',
          name: '平台功能',
          html: require('helpCenter/greenhand/function.html')
        },
        // {
        //   args: 'page=gr-feature',
        //   name: '繁华特色',
        //   html: require('helpCenter/greenhand/feature.html')
        // },
        // {
        //   args: 'page=gr-agency',
        //   name: '代理繁华',
        //   html: require('helpCenter/greenhand/agency.html')
        // }
      ]
    },
    {
      name: '玩法介绍',
      icon: require('./help-introduce.png'),
      sub: [
        {
          args: 'page=tickets-ssc',
          name: '时时彩玩法介绍',
          html: require('helpCenter/tickets/ssc.html')
        },
        {
          args: 'page=tickets-num',
          name: '11 选 5 玩法介绍',
          html: require('helpCenter/tickets/num.html')
        },
        {
          args: 'page=tickets-low',
          name: '低频彩玩法介绍',
          html: require('helpCenter/tickets/low.html')
        },
        {
          args: 'page=tickets-sp',
          name: '繁华专享彩种玩法介绍',
          html: require('helpCenter/tickets/sp.html')
        },
        {
          args: 'page=tickets-happy',
          name: '北京PK10玩法介绍',
          html: require('helpCenter/tickets/happy.html')
        }
      ]
    },
    {
      name: '游戏说明',
      icon: require('./help-description.png'),
      sub: [
        {
          args: 'page=gi-openException',
          name: '开奖异常',
          html: require('helpCenter/gameInstruction/openException.html')
        },
        {
          args: 'page=gi-chaseBet',
          name: '追号投注',
          html: require('helpCenter/gameInstruction/chaseBet.html')
        },
        {
          args: 'page=gi-cancelBet',
          name: '撤单功能',
          html: require('helpCenter/gameInstruction/cancelBet.html')
        },
        {
          args: 'page=gi-malicious',
          name: '恶投和冷热号',
          html: require('helpCenter/gameInstruction/malicious.html')
        }
      ]
    },
    {
      name: '充提类',
      icon: require('./help-yan.png'),
      sub: [
        {
          args: 'page=rw-ways',
          name: '充提方式',
          html: require('helpCenter/rechargeWithdraw/ways.html')
        },
        {
          args: 'page=rw-flows',
          name: '充提流程',
          html: require('helpCenter/rechargeWithdraw/flows.html')
        },
        {
          args: 'page=rw-instructions',
          name: '充提说明',
          html: require('helpCenter/rechargeWithdraw/instructions.html')
        },
        {
          args: 'page=rw-exception',
          name: '充提异常',
          html: require('helpCenter/rechargeWithdraw/exception.html')
        },
        {
          args: 'page=rw-unionReceipt',
          name: '银联回单查询',
          html: require('helpCenter/rechargeWithdraw/unionReceipt.html')
        },
        {
          args: 'page=rw-wechatReceipt',
          name: '微信回单查询',
          html: require('helpCenter/rechargeWithdraw/wechatReceipt.html')
        }
      ]
    },
    {
      name: '安全类',
      icon: require('./help-security.png'),
      sub: [
        {
          args: 'page=se-forget-pwd',
          name: '忘记密码',
          html: require('helpCenter/security/forget-pwd.html')
        },
        {
          args: 'page=se-accountSecurity',
          name: '账户安全',
          html: require('helpCenter/security/accountSecurity.html')
        },
        {
          args: 'page=se-bankCardMana',
          name: '管理银行卡',
          html: require('helpCenter/security/bankCardMana.html')
        }
      ]
    },
    {
      name: '客户端',
      icon: require('./help-client.png'),
      sub: [
        // {
        //   args: 'page=client-pc',
        //   name: ' PC客户端',
        //   html: require('helpCenter/client/client-pc.html')
        // },
        {
          args: 'page=client-mobile',
          name: '手机移动端',
          html: require('helpCenter/client/client-mobile.html')
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
      id: 24,
      name: '台湾5分彩',
      iconClass: 'sfa-d-ssc-tw'

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
