"use strict";

var menuConfig = [
  {
    router: '#',
    name: '首页',
    notShow: true,
    noTitle: true
  },
  {
    router: 'uc',
    name: '历史记录',
    first: 'uc/br',
    titleClass: 'bg-pink',
    backStyle: 'text-pink',
    iconType: 'sfa',
    icon: 'history',
    sub: [
      {
        id: 102,
        router: 'uc/br',
        name: '投注记录',
        // iconType: 'fa',
        // backStyle: 'text-hot',
        // icon: 'shopping-basket',
      },
      {
        id: 103,
        router: 'uc/tr',
        name: '追号记录',
        //icon: 'chase',
      },
      {
        id: 104,
        router: 'uc/rr',
        name: '充值记录'
      },
      {
        id: 105,
        router: 'uc/wr',
        name: '提现记录'
      },
      {
        id: 106,
        router: 'uc/ad',
        name: '账户明细'
      },
      {
        id: 107,
        router: 'ac/rm',
        name: '彩票盈亏'
      },
      {
        id: 108,
        router: 'uc/bac',
        name: '百家乐盈亏'
      },
      {
        id: 109,
        router: 'uc/tfr',
        name: '转账记录'
      }
    ]
  },
  {
    router: 'ac',
    name: '代理中心',
    first: 'ac/llm',
    titleClass: 'bg-sunshine',
    backStyle: 'text-sunshine',
    iconType: 'sfa',
    icon: 'agency',
    sub: [
      {
        id: 130,
        router: 'ac/llm',
        name: '下级管理'
      },
      {
        id: 131,
        router: 'ac/oam',
        name: '开户管理'
      },
      {
        id: 132,
        router: 'ac/td',
        name: '团队动态'
      },
      {
        id: 133,
        router: 'ac/cs',
        name: '佣金管理'
      },
      {
        id: 134,
        router: 'ac/salary',
        name: '日工资管理'
      },
     // {
    //    id: 134,
    //    router: 'ac/rm',
  //      name: '报表查询'
    //  },
      {
        id: 135,
        router: 'uc/dm',
        name: '分红管理',
        needAuth: true
      },
      //{
      //  id: 112,
      //  router: 'ac/pl',
      //  name: '盈亏报表'
      //},
      {
        id: 137,
        router: 'ac/rr',
        name: '冲级奖励',
        needAuth: true
      },
      {
        id: 136,
        router: 'ac/rp',
        name: '红包查询',
        needAuth: true
      }
    ]
  },
  //{
  //  router: 'fc',
  //  name: '资金管理',
  //  first: 'fc/re',
  //  icon: 'fund',
  //  titleClass: 'bg-sunshine',
  //  sub: [
      //{
      //  id: 114,
      //  router: 'fc/re',
      //  name: '在线充值',
      //},
      //{
      //  id: 115,
      //  router: 'fc/ow',
      //  name: '在线提现',
      //},
  //    {
  //      id: 116,
  //      router: 'fc/pt',
  //      name: '平台转账',
  //    }
  //  ]
  //},
  {
    router: 'as',
    name: '账户安全',
    titleClass: 'bg-sunshine',
    backStyle: 'text-sunshine',
    //iconType: 'sfa',
    first: 'as/pl',
    //icon: 'safe',
    sub: [
      {
        id: 160,
        router: 'as/pl',
        name: '密码管理'
      },
      {
        id: 161,
        router: 'as/pf',
        name: '密码管理',
        notShow: true
      },
      {
        id: 162,
        router: 'as/pz',
        name: '密码管理',
        notShow: true
      },
      {
        id: 163,
        router: 'as/sq',
        name: '密保问题'
      }
    ]
  },
  //{
  //  router: 'nc/nb',
  //  name: '平台动态',
  //  icon: 'notice'
  //},
  {
    router: 'aa',
    name: '消息中心',
    titleClass: 'bg-blue',
    backStyle: 'text-blue',
    iconType: 'sfa',
    icon: 'activity',
    sub: [
      {
        id: 190,
        router: 'nc/pn',
        name: '系统通知'
      },
      {
        id: 191,
        router: 'nc/nb',
        name: '平台动态'
      },
      {
        id: 192,
        router: 'aa',
        name: '活动'
      }
      //{
      //  id: 193,
      //  router: 'hc',
      //  name: '帮助中心'
      //}
    ]
  },
  {
    router: 'hc',
    titleClass: 'bg-pink',
    //router: 'hc?page=newbie',
    name: '帮助中心'
    //icon: 'help'
  },
  //{
  //  router: 'javascript:void(0)',
  //  name: '客户端下载',
  //  icon: 'download'
  //}
  {
    router: 'pc',
    name: '个人中心',
    titleClass: 'bg-sunshine',
    backStyle: 'text-sunshine',
    iconType: 'sfa',
    //notShow: true,
    sub: [
      {
        id: 200,
        router: 'uc/pm',
        name: '个人资料'
      },
      {
        id: 201,
        router: 'uc/cm',
        name: '银行卡管理'
      },
      {
        id: 202,
        router: 'uc/pd',
        name: '奖金详情',
      },
      {
        id: 204,
        router: 'as/pl',
        name: '密码管理'
      },
      {
        id: 205,
        router: 'as/sq',
        name: '密保问题'
      },
      {
        id: 203,
        router: 'as/ll',
        name: '操作日志'
      },
      {
        id: 206,
        router: 'as/se',
        name: '邮箱设置'
      },
      {
        id: 207,
        router: 'fc/pf',
        name: '转账'
      }
    ]
  },
  {
    router: 'vip',
    name: 'VIP中心',
    titleClass: 'bg-sunshine',
    backStyle: 'text-sunshine',
    iconType: 'sfa',
    sub: [
      {
        id: 206,
        router: 'vip/info',
        name: '<a href="vip.html" target="_blank">VIP福利介绍</a>'
      },{
        id: 207,
        router: 'vip/cash',
        name: 'VIP礼金'
      },{
        id: 208,
        router: 'vip/prize',
        name: 'VIP加奖'
      },{
        id: 209,
        router: 'vip/point',
        name: 'VIP积分'
      },{
        id: 210,
        router: 'vip/level',
        name: 'VIP等级'
      },{
        id: 211,
        router: 'vip/credit',
        name: 'VIP信誉基金'
      }
    ]
  },
];

module.exports = {
  getAll: function() {
    return menuConfig;
  },

  get: function(router) {
    if (_(router).isArray()) {
      return _(router).map(function(router) {
        return _(menuConfig).findWhere({
          router: router
        });
      });
    } else {
      return _(menuConfig).findWhere({
        router: router
      });
    }
  },

  getByRouter: function(router) {
    return this.getCurrent(router || '#');
  },

  getCurrent: function(router) {
    var currentInfo;
    router = router || window.location.hash.replace(/\?.*/, '');
    //router = router || window.location.hash;
    _(menuConfig).each(function(menus) {
      if (menus.sub) {
        _(menus.sub).each(function(menu) {
          var isActive;
          if (menu.router === '#') {
            isActive = router === menu.router;
          } else {
            isActive = router.indexOf(menu.router) !== -1;
          }
          if (isActive) {
            currentInfo = {
              menus: menus,
              menu: menu
            };
          }
        });
      } else {
        var isActive;
        if (menus.router === '#') {
          isActive = router === menus.router;
        } else {
          isActive = router.indexOf(menus.router) !== -1;
        }
        if (isActive) {
          currentInfo = {
            menus: menus,
            menu: menus
          };
        }
      }
    });

    return currentInfo;
  }
};
