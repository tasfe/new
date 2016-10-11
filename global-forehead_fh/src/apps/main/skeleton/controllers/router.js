'use strict';

var SidebarView = require('com/sidebar');

var menuConfig = require('skeleton/misc/menuConfig');

var globalViewList = {
  team: {
    viewName: 'teamProfile',
    View: require('agencyCenter/topProfile')
  },
  personal: {
    viewName: 'personalProfile',
    View: require('userCenter/topProfile')
  }
};

var SideMenuMainView = Base.LayoutView.extend({
  className: 'clearfix',
  template: '<div class="portlet">' +
  '<div class="portlet-header no-padding no-border">' +
  '<div class="js-gl-sidebar"></div>' +
  '</div>' +
  '<div class="js-gl-main portlet-body"></div>' +
  '</div>'
});

var RouterController = Base.Controller.extend({

  changeMainReginView: function(mainView, config) {
    config = config || {};

    config = _.defaults(config || {}, {
      entry: true
    });

    config.main = _.defaults(config.main || {}, {
      titleType: 'normal',
      subReturn: false
    });

    if (config.topView) {
      this._changeTopView(config.topView);
    } else {
      this._destroyTopView();
    }

    if (config.sidebar) {
      this._changeSideMenuMainReginView(mainView, config);
    } else {
      this._changeMainReginView(mainView, config);
    }

    Global.ui.menu.selectMenuFromCurrentHash();
  },

  _changeSideMenuMainReginView: function(mainView, config) {
    var currentView = Global.viewPool.setCurrentSubRegion(new SideMenuMainView());

    currentView.addRegions({
      sidebar: '.js-gl-sidebar',
      mainRegin: '.js-gl-main'
    });

    Global.mainRegin.show(currentView, {
      preventDestroy: true,
      forceShow: true
    });

    var sidebarView = new SidebarView({
      sidebar: menuConfig.get(config.sidebar)
    });

    currentView.sidebar.show(sidebarView);

    this.changeSubReginView(mainView, config);
  },

  //侧边栏子菜单view切换
  changeSubReginView: function(view, config) {
    var currentView = Global.viewPool.getCurrentSubRegion();

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
        config.main.type = 'side-main no-shadow';
        if (config.main.showTitle) {
          config.main.title = config.main.title || ops.menu.name;
        }
        config.main.headerClass = ops.menus.titleClass || '';
        config.main.noTitle = ops.menu.noTitle;
      } else {
        config.main.type = 'side-main no-shadow';
        config.main.headerClass = '';
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

  _changeTopView: function(viewName) {
    var currentViewInfo = globalViewList[viewName];

    if (!currentViewInfo.showed) {
      Global.topRegin.show(new currentViewInfo.View());
      currentViewInfo.showed = true;
    }
  },

  _destroyTopView: function() {
    var currentViewInfo = _(globalViewList).findWhere({
      showed: true
    });

    if (currentViewInfo) {
      Global.topRegin.currentView.destroy();
      currentViewInfo.showed = false;
    }
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
      subReturn: config.main.subReturn,
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

