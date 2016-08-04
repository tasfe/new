define(function(require, exports, module) {

  var SidebarView = require('skeleton/views/sidebar');

  var RouterController = Base.Controller.extend({

    changeMainReginView: function(mainView, config) {
      config = _(config || {}).extend({
        addNav: true
      });
      mainView.title = Global.ui.sidemenu.selectMenuFromCurrentHash();
      this._changeSideMenuMainReginView(mainView, config);
    },

    _changeSideMenuMainReginView: function(mainView, config) {
      config = _(config || {}).defaults({
        preventDestroy: true
      });

      Global.viewPool.setCurrentView(Global);

      this._changeReginView(mainView, config);

    },

    _changeReginView: function(mainView, config, callback) {
      var currentView = Global.viewPool.getCurrentView();
      $('.main-inner').addClass('fade-out');

      _.delay(function() {
        currentView.mainRegin.show(mainView, _(config).pick('preventDestroy'));

        Global.viewPool.push({
          regin: currentView.mainRegin,
          title: mainView.title,
          view: mainView,
          router: Backbone.history.getHash(),
          parentRouter: config.parentRouter
        }, config);

        $('body').scrollTop(0);

        $('.main-inner').removeClass('fade-out');

        callback && callback();
      }, 150);
    },

    //子菜单view切换
    changeSubReginView: function(view, config) {
      config = _(config || {}).defaults({
        preventDestroy: true,
        addNav: false,
        returnBtn: true
      });

      if (!Global.viewPool.getCurrentView()) {
        Global.appRouter.navigate(_(config.parentRouter || '#').addHrefArgs('_t', _.now()), {
          trigger: true,
          replace: false
        });
        return false;
      }

      if (config.returnBtn) {
        var CurrentView = Base.LayoutView.extend({
          template: '<div class="js-gl-sub-bar">' +
          '<button class="btn btn-sm btn-info pull-right sub-return" type="button">返回</button>' +
          '</div>' +
          '<div class="js-gl-main"></div>'
        });

        var currentView = new CurrentView();

        currentView.addRegions({
          sidebar: '.js-gl-sidebar',
          mainRegin: '.js-gl-main'
        });

        this._changeReginView(currentView, config, function() {
          currentView.mainRegin.show(view, {
            forceShow: true
          });
        });
      } else {
        this._changeReginView(view, config);
      }

    }
  });

  module.exports = RouterController;

});