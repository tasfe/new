'use strict';

var SidebarView = require('com/sidebar');

var menuConfig = require('skeleton/misc/menuConfig');

var SideMenuMainView = Base.LayoutView.extend({
  className: 'clearfix',
  template: '<div>asdsfa</div><div class="js-gl-sidebar sidebar pull-left "></div>' +
  '<div class="js-gl-main pull-right"></div>'
});

var RouterController = Base.Controller.extend({

  changeMainReginView: function(mainView, config) {
    config = config || {};

    config = _.defaults(config || {}, {
      entry: true
    });

    config.main = _.defaults(config.main || {}, {
      subReturn: false
    });


    if (config.sidebar) {
      this._changeSideMenuMainReginView(mainView, config);
    } else {
      this._changeMainReginView(mainView, config);
    }

    //Global.ui.menu.selectMenuFromCurrentHash();
  },

  _changeSideMenuMainReginView: function(mainView, config) {
    var currentView = Global.viewPool.setCurrentView(new SideMenuMainView());

    currentView.addRegions({
      sidebar: '.js-gl-sidebar',
      mainRegin: '.js-gl-main'
    });

    Global.mainRegin.show(currentView, {
      preventDestroy: true,
      forceShow: true
    });

    var sidebarView = new SidebarView({
      sidebar: config.sidebar
    });

    currentView.sidebar.show(sidebarView);

    this.changeSubReginView(mainView, config);
  },

  //侧边栏子菜单view切换
  changeSubReginView: function(view, config) {
    var currentView = Global.viewPool.getCurrentView();

    config = _.defaults(config || {}, {
      //destroyDiff: 'low'
      needParent: true
    });

    config.main = _.defaults(config.main || {}, {
      subReturn: true
    });

    if ((!currentView && !config.needParent) || (currentView && !$(document).find(currentView.$el).length)) {
      this._changeSideMenuMainReginView(view, config);
      return false;
    } else {
      var ops = menuConfig.getCurrent();

      if (ops) {
        config.main.type = 'side-main';
        config.main.title = config.main.title || ops.menu.name;
        config.main.headerClass = ops.menus.titleClass || 'bg-sunshine';
        config.main.noTitle = ops.menu.noTitle;
      } else {
        config.main.type = 'side-main';
        config.main.headerClass = 'bg-sunshine';
      }
    }

    if (currentView) {
      this._changeReginView(currentView, view, config);
    } else {
      Global.appRouter.navigate(_(config.parentRouter).addHrefArgs('_t', _.now()), {trigger: true, replace: false});
    }
  },

  _changeMainReginView: function(view, config) {
    var ops = menuConfig.getCurrent();

    if (ops) {
      config.main.type = 'main';
      config.main.title = config.main.title || ops.menu.name;
      config.main.headerClass = ops.menus.titleClass;
      config.main.noTitle = ops.menu.noTitle;
    }

    this._changeReginView(Global, view, config);
  },

  _changeReginView: function(currentView, view, config) {

    var mainView;
    var pool;

    if (config.main && config.main.title && !config.main.noTitle) {
      var MainView = Base.LayoutView.extend({
        className: 'clearfix',
        template: require('skeleton/templates/main.html'),
        serializeData: function() {
          return config.main;
        }
      });

      mainView = new MainView();

      mainView.addRegions({
        mainRegin: '.js-rt-main'
      });

      currentView.mainRegin.show(mainView, {
        preventDestroy: true,
        forceShow: true
      });

      view.$_parentEl = mainView.$el;

      mainView.mainRegin.show(view);

    } else {
      currentView.mainRegin.show(view, {
        preventDestroy: true,
        forceShow: true
      });
    }

    pool = {
      regin: currentView.mainRegin,
      view: currentView.mainRegin.currentView,
      router: Backbone.history.getHash(),
      parentRouter: config.parentRouter
    };

    if (currentView !== Global) {
      pool.globalRegin = Global.mainRegin;
      pool.globalView = Global.mainRegin.currentView;
    }

    Global.viewPool.push(pool, {
      entry: config.entry
    });
  }
});

module.exports = RouterController;

