"use strict";

var App = require('./app');
var modules = require('skeleton/modules');

require('widgets');

window.Global = App;
window.Global.Prefab = Base.Prefab;
window.Global.appRouter = new Base.AppRouter();

/*******************************************************************/
// 初始化系统级别 Modules
modules.install();
/*******************************************************************/

var appRouters = require('./app.routers');

// 进行系统OAuth校验
Global.m.oauth.check().done(function(res) {

  if (res && res.result === 0) {
    /*******************************************************************/
    // 配置初始化路由（按功能模块）
    appRouters.install();
    /*******************************************************************/

    //开启oauth监听
    Global.m.oauth.start();

    //开启消息监听
    Global.m.message.start();

    //开启系统通知监听
    Global.m.news.start();

    //开启菜单权限监听
    Global.ui.menu.start();

    //开启下雨活动监听
    Global.m.rainActivity.start();

    //开启下雨活动监听
    Global.m.driftActivity.start();

    App.start();
  }
});