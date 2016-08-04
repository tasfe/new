require([
  'app',
  'app.routers',
  'skeleton/modules',
  'prefab/prefab',
  'skeleton/widgets'
], function(App, appRouters, modules) {

  window.Global = App;
  window.Global.Prefab = Base.Prefab;
  window.Global.appRouter = new Base.AppRouter();

  /*******************************************************************/
  // 配置初始化路由（按功能模块）
  appRouters.install();
  /*******************************************************************/

  /*******************************************************************/
  // 初始化系统级别 Modules
  modules.install();
  /*******************************************************************/

  /*******************************************************************/
  // 进行系统OAuth校验
  Global.oauth.check().done(function(data) {

    if (data && data.result === 0) {
      var acctInfo = data.root || {};

      Global.memoryCache.set('acctInfo', acctInfo);

      Global.m.publish('acct:updating');

      Global.m.notice.start();

      App.start();
    } else {
      window.location.href = 'login.html';
    }
  });
  /*******************************************************************/

});