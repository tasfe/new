"use strict";

var menuConfig = [
  {
    router: '#',
    name: '首页',
    notShow: true,
    noTitle: true
  },
  {
    router: 'ac',
    name: '团队中心',
    first: 'ac/llm',
    // titleClass: 'bg-sunshine',
    // backStyle: 'text-sunshine',
    iconType: 'sfa',
    icon: 'agency',
    sub: [
      {
        id: 130,
        router: 'ac/llm',
        name: '下级管理',
        showTitle: false
      },
      {
        id: 131,
        rootRouter: 'tg',
        router: 'tg/br',
        name: '团队游戏'
      },
      {
        id: 132,
        router: 'ac/oam',
        name: '开户管理',
        notShow: true
      },
      {
        id: 133,
        router: 'ac/td',
        name: '团队动态'
      },
      {
        id: 134,
        router: 'ac/ad',
        name: '团队账变'
      },
      {
        id: 135,
        router: 'ac/tpl/lottery',
        name: '团队盈亏'
      },

      //    {
      //       id: 133,
      //      router: 'ac/cs',
      //      name: '佣金管理'
      //    },
      {
        id: 136,
        router: 'ac/salary',
        name: '日薪管理',
        needAuth: true
      },
      {
        id: 137,
        router: 'ac/dm',
        name: '分红管理',
        needAuth: true
      },
      {
        id: 138,
        router: 'ac/rr',
        name: '冲级奖励',
        needAuth: true
      },
      {
        id: 138,
        router: 'ac/rp',
        name: '红包查询',
        needAuth: true
      }
    ]
  },
  {
    router: 'bb',
    name: '投注管家',
    first: 'bb/ps',
    // titleClass: 'bg-sunshine',
    // backStyle: 'text-sunshine',
    iconType: 'sfa',
    icon: 'nes',
    sub: [
      {
        id: 140,
        router: 'bb',
        name: '投注管家'
      }
      // {
      //   id: 141,
      //   router: 'bb/pl',
      //   name: '进行中的计划'
      // },
      // {
      //   id: 142,
      //   router: 'bb/mc',
      //   name: '我的收藏方案'
      // }
    ]
  },
  {
    router: 'nc',
    name: '消息中心',
    first: 'nc/pn',
    // titleClass: 'bg-sunshine',
    // backStyle: 'text-sunshine',
    iconType: 'sfa',
    icon: 'nes',
    sub: [
      {
        id: 150,
        router: 'nc/pn',
        name: '系统通知'
      },
      {
        id: 151,
        router: 'nc/pn/setting',
        name: '系统通知设置'
      }
    ]
  },
  //{
  //  router: 'nc/nb',
  //  name: '平台动态',
  //  icon: 'notice'
  //},

  {
    router: 'at',
    name: '活动中心',
    first: 'at/tb',
    // titleClass: 'bg-sunshine',
    // backStyle: 'text-sunshine',
    iconType: 'sfa',
    icon: 'activity',
    sub: [
      {
        id: 190,
        router: 'at/tb',
        name: '全部活动'
      },
      {
        id: 191,
        router: 'at/ag',
        name: '代理活动'
      },
      {
        id: 192,
        router: 'at/ti',
        name: '彩票活动'
      },
      {
        id: 193,
        router: 'at/ol',
        name: '真人娱乐'
      }]
  },
  {
    router: 'hc',
    titleClass: 'hidden',
    //router: 'hc?page=newbie',
    name: '帮助中心',
    //icon: 'help'
    noTitle: true
  },
  //{
  //  router: 'javascript:void(0)',
  //  name: '客户端下载',
  //  icon: 'download'
  //}
  {
    router: 'pc',
    name: '个人中心',
    // titleClass: 'bg-sunshine',
    // backStyle: 'text-sunshine',
    iconType: 'sfa',
    //notShow: true,
    sub: [
      {
        id: 200,
        router: 'pm',
        name: '账户安全'
      },
      // {
      //   id: 204,
      //   router: 'pm/pl',
      //   name: '登陆密码',
      //   notShow: true
      // },
      // {
      //   id: 205,
      //   router: 'pm/pf',
      //   name: '资金密码',
      //   notShow: true
      // },
      // {
      //   id: 206,
      //   router: 'pm/sq',
      //   name: '密保问题',
      //   notShow: true
      // },
      // {
      //   id: 207,
      //   router: 'pm/se',
      //   name: '邮箱设置',
      //   notShow: true
      // },

      {
        id: 208,
        rootRouter: 'gr',
        router: 'gr/br',
        name: '游戏记录'
      },
      // {
      //   id: 208,
      //   router: 'gr/tr',
      //   name: '追号记录',
      //   notShow: true
      // },
      // {
      //   id: 208,
      //   router: 'uc/abr',
      //   name: 'AG投注记录',
      //   notShow: true
      // },

      {
        id: 209,
        router: 'uc/pal',
        name: '盈亏报表'
      },
      {
        id: 210,
        router: 'uc/md',
        name: '帐变明细'
      },
      {
        id: 201,
        router: 'uc/cm',
        name: '银行卡管理'
      },
      {
        id: 202,
        router: 'uc/pd',
        name: '奖金详情'
      },
      // {
      //   id: 207,
      //   router: 'fc/pf',
      //   name: '上下级转帐'
      // },
      {
        id: 203,
        router: 'as/ll',
        name: '操作日志'
      }
    ]
  },
  {
    router: 'vip',
    name: 'VIP中心',
    // titleClass: 'bg-sunshine',
    // backStyle: 'text-sunshine',
    iconType: 'sfa',
    sub: [
      {
        id: 210,
        router: 'vip/info',
        name: '<a href="vip.html" target="_blank">VIP福利介绍</a>'
      }, {
        id: 211,
        router: 'vip/cash',
        name: 'VIP礼金'
      }, {
        id: 212,
        router: 'vip/prize',
        name: 'VIP加奖'
      }, {
        id: 213,
        router: 'vip/point',
        name: 'VIP积分'
      }, {
        id: 214,
        router: 'vip/level',
        name: 'VIP等级'
      }, {
        id: 215,
        router: 'vip/credit',
        name: 'VIP信誉基金'
      }
    ]
  },
  {
    router: 'gc',
    titleClass: 'hidden',
    name: '真人娱乐'
  }
];

module.exports = {
  getAll: function() {
    return menuConfig;
  },

  get: function(router) {
    if(_(router).isArray()) {
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
      if(menus.sub) {
        _(menus.sub).each(function(menu) {
          var isActive;
          if(menu.router === '#') {
            isActive = router === menu.router;
          } else {
            isActive = router.indexOf(menu.router) !== -1;
          }
          if(isActive) {
            currentInfo = {
              menus: menus,
              menu: menu
            };
          }
        });
      } else {
        var isActive;
        if(menus.router === '#') {
          isActive = router === menus.router;
        } else {
          isActive = router.indexOf(menus.router) !== -1;
        }
        if(isActive) {
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
