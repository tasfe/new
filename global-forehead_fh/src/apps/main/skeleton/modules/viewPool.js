"use strict";

var PoolingModule = Base.Module.extend({

  startWithParent: false,

  _polling: [],

  _currentSubRegion: null,

  _currentViewInfo: null,

  push: function(viewInfo, config) {
    config = _(config || {}).defaults({
      destroyDiff: false
    });

    if (!viewInfo.initId) {
      viewInfo.initId = Number(_.uniqueId());
    }

    viewInfo.router = viewInfo.router.replace(/\?.*/, '') || '#';

    //删除前一个相同view
    var samePool = this.getByRouter(viewInfo.router);

    if (samePool && samePool === _(this._polling).last()) {
      this.destroyView(samePool);
    } else {
      // if (config.entry) {
      //   //如果新增新非快捷入口，则删除前非快捷入口
      //   var isExceed = Global.entryRegion.currentView.isExceed(viewInfo.router);
      //
      //   if (isExceed) {
      //     var oldInitId = Global.entryRegion.currentView.delNotQuickEntry();
      //     if (oldInitId) {
      //       var exceedPool = this.getById(oldInitId);
      //
      //       this.destroyView(exceedPool);
      //     }
      //   }
      // }
    }

    // if (config.entry) {
    // 没有subreturn时destroy所有非快捷入口view
    if (viewInfo.subReturn) {
      var prevViewInfo = this.getCurrentViewInfo();

      if (prevViewInfo) {
        viewInfo.parentId = prevViewInfo.initId;
      }

      Global.entryRegion.currentView.update({
        initId: viewInfo.initId,
        router: viewInfo.router
      });
    } else {
      this.destroyAllNotEntryView();
      Global.entryRegion.currentView.changeActiveInfo(viewInfo.initId, viewInfo.router);
    }

    this._pushView(viewInfo);
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

  _pushView: function(viewInfo) {
    this.setCurrentViewInfo(viewInfo);

    this._polling.push(viewInfo);

    Base.log(this._polling);
  },

  setCurrentViewInfo: function(viewInfo) {
    this._currentViewInfo = viewInfo;
  },

  getCurrentViewInfo: function() {
    return this._currentViewInfo;
  },

  getBack: function() {
    // var current = this.getById(Global.entryRegion.currentView.getCurrent());
    var currentViewInfo = this.getCurrentViewInfo();
    var parentViewInfo = this.getById(currentViewInfo.parentId);

    if (this._polling.length === 0 || !parentViewInfo) {
      return {
        parentRouter: currentViewInfo.parentRouter
      };
    } else {
      Global.entryRegion.currentView.changeActiveInfo(parentViewInfo.initId, parentViewInfo.router);
      this.setCurrentViewInfo(parentViewInfo);

      this.destroyView(currentViewInfo);

      return parentViewInfo;
    }
  },

  replace: function(viewInfo) {
    var last = this._polling.pop();

    if (last) {
      last.router = viewInfo.router;
      last.view.mainRegion.attachView(viewInfo.view);

      this._polling.push(last);
    }
  },

  pop: function() {
    var currentViewInfo = this._polling.pop();
    var find;

    if (this._polling.length === 0) {

      find = _(this._polling).findWhere({
        router: currentViewInfo.parentRouter
      });
      if (find) {
        return {
          regin: Global.mainRegion,
          router: find.router,
          view: find.view
        };
      } else {
        return currentViewInfo;
      }
    } else {
      return _(this._polling).last();
    }
  },

  empty: function() {
    _(this._polling).each(function(superior) {
      superior.regin.empty();
    });
  },

  setCurrentSubRegion: function(view) {
    this._currentSubRegion = view;
    return this._currentSubRegion;
  },

  getCurrentSubRegion: function() {
    return this._currentSubRegion;
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
  },

  destroyAllNotEntryView: function() {

  }
});

module.exports = PoolingModule;
