"use strict";

var PollingModule = Base.Module.extend({

  startWithParent: false,

  _polling: [],

  _currentView: null,

  push: function(viewInfo, config) {
    config = _(config || {}).defaults({
      destroyDiff: false
    });

    if (!viewInfo.initId) {
      viewInfo.initId = Number(_.uniqueId());
    }

    viewInfo.router = viewInfo.router.replace(/\?.*/, '') || '#';

    //删除前一个相同view
    var prevPool = this.getByRouter(viewInfo.router);

    if (prevPool && prevPool === _(this._polling).last()) {
      this.destroyView(prevPool);
      //Global.entryRegin.currentView.remove(prevPool.initId);
    } else {

      if (config.entry) {
        //如果新增新非快捷入口，则删除前非快捷入口
        var isExceed = Global.entryRegin.currentView.isExceed(viewInfo.router);

        if (isExceed) {
          var oldInitId = Global.entryRegin.currentView.delNotQuickEntry();
          if (oldInitId) {
            var exceedPool = this.getById(oldInitId);

            this.destroyView(exceedPool);
          }
        }
      }
    }


    this._polling.push(viewInfo);

    if (config.entry) {

      Global.entryRegin.currentView.update({
        initId: viewInfo.initId,
        router: viewInfo.router
      });
    } else {
      viewInfo.parentId = Global.entryRegin.currentView.changeActiveInfo(viewInfo.initId, viewInfo.router);
    }

    console.log(this._polling);
  },

  getById: function(initId) {
    return _(this._polling).findWhere({
      initId: initId
    });
  },

  getByRouter: function(router) {
    return _(this._polling).findWhere({
      router: router
    });
  },

  getBack: function() {
    var current = this.getById(Global.entryRegin.currentView.getCurrent());
    var parent = this.getById(current.parentId);
    //var current = this._polling.pop();

    if (this._polling.length === 0 || !parent) {
      return {
        parentRouter: current.parentRouter
      };
    } else {
      Global.entryRegin.currentView.changeActiveInfo(parent.initId, parent.router);

      this.destroyView(current);

      return parent;
    }
  },

  replace: function(viewInfo) {
    var last = this._polling.pop();

    if (last) {
      last.router = viewInfo.router;
      last.view.mainRegin.attachView(viewInfo.view);

      this._polling.push(last);

      console.log(this._polling);
    }
  },

  pop: function() {
    var current = this._polling.pop();
    var find;
    console.log(this._polling);

    if (this._polling.length === 0) {

      find = _(this._polling).findWhere({
        router: current.parentRouter
      });
      if (find) {
        return {
          regin: Global.mainRegin,
          router: find.router,
          view: find.view
        };
      } else {
        return _(current).extend({
          noParent: true
        });
      }
    } else {
      return _(this._polling).last();
    }
  },

  empty: function() {
    _(this._polling).each(function(superior) {
      superior.regin.empty();
    });

    console.log(this._polling);
  },

  setCurrentView: function(view) {
    this._currentView = view;
    return this._currentView;
  },

  getCurrentView: function() {
    return this._currentView;
  },

  _getRootRouter: function(router) {
    var rootRouter = router.match(/^(.*?)\//);
    if (rootRouter) {
      rootRouter = rootRouter[1];
    } else {
      rootRouter = router;
    }

    return rootRouter;
  },

  removeById: function(initId) {
    var viewInfo = _(this._polling).findWhere({
      initId: initId
    });

    this.destroyView(viewInfo);
  },

  quickClear: function() {
    _(this._polling).each(function(viewInfo) {
      if (!viewInfo.display) {
        viewInfo.view.destroy();
      } else {
      }
    });

    this._polling = [];
  },

  quickPush: function(viewInfo, config) {
    //viewInfo.view._remain = true;

    this._polling.push(viewInfo);

    console.log(this._polling);
  },

  getQuick: function(router) {
    var isFind = false;

    _(this._polling).each(function(viewInfo) {
      if (router === '#' + viewInfo.router) {
        viewInfo.display = true;
        viewInfo.regin.show(viewInfo.view, {
          preventRender: true,
          preventDestroy: true,
          forceShow: true
        });

        viewInfo.view.trigger('entry:show');

        isFind = true;
      } else {
        viewInfo.display = false;
      }
    });

    return isFind;
  },

  destroyById: function(id) {
    this.destroyView(this.getById(id));
  },

  destroyView: function(poll) {
    poll && poll.view && !poll.view.isDestroyed && poll.view.destroy();
    this._polling = _(this._polling).without(poll);
    console.log(this._polling);
  }
});

module.exports = PollingModule;
