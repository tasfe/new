/**
 * 简介
 *
 * @description
 *
 * @api
 *
 * @example
 *
 * @author
 *   xiami
 */

define(function(require, module, exports) {

  var menuConfig = [];
  //首页
  menuConfig.push({

    "comments": "fa fa-tachometer",
    "funcName": "首页",
    "funcUrllink": "#"
  });

  //彩种
  menuConfig.push({

    "comments": "fa fa-gift",
    "funcName": "彩种",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "彩种管理",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "所有彩种",
            "funcUrllink": "#bc/tl"
          },
          {
            "comments": "",
            "funcName": "奖期监控",
            "funcUrllink": "#bc/lm"
          },
          {
            "comments": "",
            "funcName": "开奖接口",
            "funcUrllink": "#bc/li"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "注单管理",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "投注记录",
            "funcUrllink": "#bc/br"
          },
          {
            "comments": "",
            "funcName": "追号记录",
            "funcUrllink": "#bc/cr"
          },
          {
            "comments": "",
            "funcName": "异常投注审核",
            "funcUrllink": "#bc/ac"
          },
          {
            "comments": "",
            "funcName": "异常投注设置",
            "funcUrllink": "#bc/am"
          }
        ]
      }
    ]
  });

  //资金
  menuConfig.push({
    "comments": "fa fa-gift",
    "funcName": "资金",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "充值管理",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "充值记录",
            "funcUrllink": "#fc/rr"
          },
          {
            "comments": "",
            "funcName": "异常充值处理",
            "funcUrllink": "#fc/ar"
          },
          {
            "comments": "",
            "funcName": "充值相关设置",
            "funcUrllink": "#fc/rs"
          },
          {
            "comments": "",
            "funcName": "大额充值用户",
            "funcUrllink": "#fc/lr"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "提现管理",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "正常提现处理",
            "funcUrllink": "#fc/nw"
          },
          {
            "comments": "",
            "funcName": "异常提现审核",
            "funcUrllink": "#fc/aw"
          },
          {
            "comments": "",
            "funcName": "提现相关设置",
            "funcUrllink": "#fc/wd"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "转账管理",
        "funcUrllink": "",
        "subFuncList":[
          {
            "comments": "",
            "funcName": "转账相关设置",
            "funcUrllink": "#fc/ta"
          }
        ]

      },
      {
        "comments": "",
        "funcName": "资金操作管理",
        "funcUrllink": "",
        "subFuncList":[
          {
            "comments": "",
            "funcName": "人工操作审核",
            "funcUrllink": "#fc/mc"
          },
          {
            "comments": "",
            "funcName": "人工操作申请",
            "funcUrllink": "#fc/ma"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "账户明细",
        "funcUrllink": "",
        "subFuncList":[
          {
            "comments": "",
            "funcName": "账户明细",
            "funcUrllink": "#fc/ad"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "银行和卡相关",
        "funcUrllink": "",
        "subFuncList":[
          {
            "comments": "",
            "funcName": "银行管理",
            "funcUrllink": "#fc/bm"
          },
          {
            "comments": "",
            "funcName": "第三方支付管理",
            "funcUrllink": "#fc/tp"
          },
          {
            "comments": "",
            "funcName": "用户银行卡管理",
            "funcUrllink": "#fc/uc"
          },
          {
            "comments": "",
            "funcName": "银行卡黑名单管理",
            "funcUrllink": "#fc/cb"
          },
          {
            "comments": "",
            "funcName": "公司银行卡管理",
            "funcUrllink": "#fc/cc"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "分红管理",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "总代分红设置",
            "funcUrllink": "#fc/gs"
          },
          {
            "comments": "",
            "funcName": "总代分红管理",
            "funcUrllink": "#fc/gm"
          },
          {
            "comments": "",
            "funcName": "一代分红管理",
            "funcUrllink": "#fc/fm"
          },
          {
            "comments": "",
            "funcName": "签约用户记录",
            "funcUrllink": "#fc/su"
          },
          {
            "comments": "",
            "funcName": "审核解约用户",
            "funcUrllink": "#fc/ac"
          }
        ]
      }
    ]
  });

  menuConfig.push({
    "comments": "fa fa-gift",
    "funcName": "用户",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "用户管理",
        "funcUrllink": "",
        "subFuncList":[
          {
            "comments": "",
            "funcName": "用户列表",
            "funcUrllink": "#uc/ul"
          },
          {
            "comments": "",
            "funcName": "总代管理",
            "funcUrllink": "#uc/gm"
          },
          {
            "comments": "",
            "funcName": "总代开户",
            "funcUrllink": "#uc/go"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "异常用户",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "冻结用户记录",
            "funcUrllink": "#uc/fu"
          },
          {
            "comments": "",
            "funcName": "解冻用户记录",
            "funcUrllink": "#uc/tu"
          },
          {
            "comments": "",
            "funcName": "回收用户记录",
            "funcUrllink": "#uc/ru"
          },
          {
            "comments": "",
            "funcName": "申诉用户记录",
            "funcUrllink": "#uc/cu"
          }
        ]
      }
    ]
  });

  //
  menuConfig.push({
    "comments": "fa fa-gift",
    "funcName": "数据",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "用户相关",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "代理盈亏报表",
            "funcUrllink": "#dc/pl"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "资金相关",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "充提报表",
            "funcUrllink": "#dc/rw"
          },
          {
            "comments": "",
            "funcName": "转账报表",
            "funcUrllink": "#dc/tr"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "彩种相关",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "彩种盈亏报表",
            "funcUrllink": "#dc/lt"
          }
          ]
      }
    ]
  });

  menuConfig.push({
    "comments": "fa fa-gift",
    "funcName": "消息",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "公告",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "公告管理",
            "funcUrllink": "#mc/nm"
          },
          {
            "comments": "",
            "funcName": "新建公告",
            "funcUrllink": "#mc/cn"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "系统通知",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "发送系统通知",
            "funcUrllink": "#mc/sp"
          },
          {
            "comments": "",
            "funcName": "系统通知管理",
            "funcUrllink": "#mc/pm"
          },
          {
            "comments": "",
            "funcName": "通知任务设置",
            "funcUrllink": "#mc/pt"
          },
          {
            "comments": "",
            "funcName": "退订用户名单",
            "funcUrllink": "#mc/pu"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "站内信",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "站内信列表",
            "funcUrllink": "#mc/il"
          }
        ]
      }
    ]
  });

  menuConfig.push({
    "comments": "fa fa-gift",
    "funcName": "营销",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "广告",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "广告管理",
            "funcUrllink": "#sc/am"
          },
          {
            "comments": "",
            "funcName": "新建广告",
            "funcUrllink": "#sc/ca"
          }

        ]
      },
      {
        "comments": "",
        "funcName": "活动",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "活动管理",
            "funcUrllink": "#sc/cm"
          },
          {
            "comments": "",
            "funcName": "新建活动",
            "funcUrllink": "#sc/cc"
          }
        ]
      },
      {
        "comments": "",
        "funcName": "上线任务活动",
        "funcUrllink": "",
        "subFuncList": [
          {
            "comments": "",
            "funcName": "参与用户查看",
            "funcUrllink": "#sc/gv"
          },
          {
            "comments": "",
            "funcName": "问卷调查管理",
            "funcUrllink": "#sc/qm"
          },
          {
            "comments": "",
            "funcName": "问题反馈管理",
            "funcUrllink": "#sc/fm"
          },
          {
            "comments": "",
            "funcName": "增减用户礼金",
            "funcUrllink": "#sc/gm"
          }

        ]
      }
    ]
  });
  //全局
  menuConfig.push({

    "comments": "fa fa-gift",
    "funcName": "全局",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "注册登录设置",
        "funcUrllink": "#gc/rl"
      },
      {
        "comments": "",
        "funcName": "敏感词管理",
        "funcUrllink": "#gc/sw"
      },
      {
        "comments": "",
        "funcName": "IP黑名单",
        "funcUrllink": "#gc/bl"
      }
    ]

  });
  menuConfig.push({
    "comments": "fa fa-gift",
    "funcName": "权限",
    "funcUrllink": "",
    "subFuncList": [
      {
        "comments": "",
        "funcName": "权限组管理",
        "funcUrllink": "#am/gm"
      },
      {
        "comments": "",
        "funcName": "新建权限组",
        "funcUrllink": "#am/cg"
      },
      {
        "comments": "",
        "funcName": "用户管理",
        "funcUrllink": "#am/um"
      },
      {
        "comments": "",
        "funcName": "新建用户",
        "funcUrllink": "#am/cu"
      },
      {
        "comments": "",
        "funcName": "操作日志",
        "funcUrllink": "#am/ol"
      },
      {
        "comments": "",
        "funcName": "修改密码",
        "funcUrllink": "#am/up"
      }
    ]
  });

  return menuConfig;
});
