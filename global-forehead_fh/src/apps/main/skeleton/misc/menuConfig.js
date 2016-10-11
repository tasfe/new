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
                id: 104,
                router: 'uc/rr',
                name: '充值记录'
            },
            // {
            //   id: 109,
            //   router: 'uc/tfr',
            //   name: '转账记录'
            // },
            {
                id: 105,
                router: 'uc/wr',
                name: '提现记录'
            },
            {
                id: 106,
                router: 'uc/ad',
                name: '账变明细'
            },
            {
                id: 102,
                router: 'uc/br',
                name: '投注记录'
            },
            {
                id: 103,
                router: 'uc/tr',
                name: '追号记录'
            },
            {
                id: 107,
                router: 'ac/rm',
                name: '彩票盈亏'
            },
            {
                id: 108,
                router: 'uc/bac',
                name: 'AG游戏盈亏'
            }
        ]
    },
    {
        router: 'ac',
        name: '团队中心',
        first: 'ac/llm',
        titleClass: 'bg-sunshine',
        backStyle: 'text-sunshine',
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
                router: 'ac/br',
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
                name: '日工资管理'
            },
            // {
            //    id: 134,
            //    router: 'ac/rm',
            //      name: '报表查询'
            //  },
            {
                id: 137,
                router: 'ac/dm',
                name: '分红管理',
                needAuth: true
            },
            //{
            //  id: 112,
            //  router: 'ac/pl',
            //  name: '盈亏报表'
            //},
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
        first: 'bb/sp',
        titleClass: 'bg-sunshine',
        backStyle: 'text-sunshine',
        iconType: 'sfa',
        icon: 'agency',
        sub: [
            {
                id: 140,
                router: 'bb/sp',
                name: '设置计划'
            },
            {
                id: 141,
                router: 'bb/rp',
                name: '进行中的计划'
            },
            {
                id: 142,
                router: 'bb/cp',
                name: '我的收藏方案'
            }
        ]
    },
    {
        router: 'nc',
        name: '消息中心',
        first: 'nc/pn',
        titleClass: 'bg-sunshine',
        backStyle: 'text-sunshine',
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
        router: 'at',
        name: '活动中心',
        first: 'at/tb',
        titleClass: 'bg-sunshine',
        backStyle: 'text-sunshine',
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
            // {
            //     id: 204,
            //     router: 'as/pl',
            //     name: '密码管理'
            // },
            // {
            //     id: 205,
            //     router: 'as/sq',
            //     name: '密保问题'
            // },
            // {
            //     id: 206,
            //     router: 'as/se',
            //     name: '邮箱设置'
            // },
            {
                id: 208,
                router: 'uc/rc',
                name: '游戏记录'
            },
            {
                id: 209,
                router: 'uc/rp',
                name: '盈亏报表'
            },
            {
                id: 210,
                router: 'uc/ad',
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
            {
                id: 207,
                router: 'fc/pf',
                name: '上下级转帐'
            },
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
        titleClass: 'bg-sunshine',
        backStyle: 'text-sunshine',
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
    getAll: function () {
        return menuConfig;
    },

    get: function (router) {
        if (_(router).isArray()) {
            return _(router).map(function (router) {
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

    getByRouter: function (router) {
        return this.getCurrent(router || '#');
    },

    getCurrent: function (router) {
        var currentInfo;
        router = router || window.location.hash.replace(/\?.*/, '');
        //router = router || window.location.hash;
        _(menuConfig).each(function (menus) {
            if (menus.sub) {
                _(menus.sub).each(function (menu) {
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
