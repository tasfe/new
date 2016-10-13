"use strict";

var PoolingModule = Base.Module.extend({

  startWithParent: false,

  _pooling: [],

  _currentSubRegion: null,

  _currentViewInfo: null,

  push: function(viewInfo, config) {

    if (!viewInfo.initId) {
      viewInfo.initId = Number(_.uniqueId());
    }

    viewInfo.router = viewInfo.router.replace(/\?.*/, '') || '#';

    //删除前一个相同view
    var samePool = this.getByRouter(viewInfo.router);

    if (samePool && samePool === _(this._pooling).last()) {
      this.destroyView(samePool);
    }

    // 没有sub return时destroy所有非快捷入口view
    if (viewInfo.subReturn) {
      var prevViewInfo = this.getCurrentViewInfo();

      if (prevViewInfo) {
        viewInfo.parentId = prevViewInfo.initId;
      }

      //快捷入口
      // Global.entryRegion.currentView.update({
      //   initId: viewInfo.initId,
      //   router: viewInfo.router
      // });
    } else {
      this.destroyAllNotEntryView();
      Global.entryRegion.currentView.changeActiveInfo(viewInfo.initId, viewInfo.router);
    }

    this._pushView(viewInfo);
  },

  getById: function(initId) {
    return _(this._pooling).findWhere({
      initId: initId
    });
  },

  getByRouter: function(router) {
    return _(this._pooling).findWhere({
      router: router
    });
  },

  _pushView: function(viewInfo) {
    this.setCurrentViewInfo(viewInfo);

    this._pooling.push(viewInfo);

    Base.log(this._pooling);
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

    if (this._pooling.length === 0 || !parentViewInfo) {
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
    var router = window.location.hash.substring(1);
    var last = _(this._pooling).findWhere({
      router: router
    });

    if (last) {
      last.router = viewInfo.router;
      last.regin.attachView(viewInfo.view);
    }
  },

  pop: function() {
    var currentViewInfo = this._pooling.pop();
    var find;

    if (this._pooling.length === 0) {

      find = _(this._pooling).findWhere({
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
      return _(this._pooling).last();
    }
  },

  empty: function() {
    _(this._pooling).each(function(superior) {
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
    var viewInfo = _(this._pooling).findWhere({
      initId: initId
    });

    this.destroyView(viewInfo);
  },

  quickPush: function(viewInfo, config) {
    //viewInfo.view._remain = true;

    this._pooling.push(viewInfo);
  },

  getQuick: function(router) {
    var isFind = false;

    _(this._pooling).each(function(viewInfo) {
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
    this._pooling = _(this._pooling).without(poll);
  },

  destroyAllNotEntryView: function() {
    var entryList = Global.entryRegion.currentView.getEntryList();
    var initIds = _(entryList).pluck('initId');
    var uselessViewList = _(this._pooling).filter(function(viewInfo) {
      return !_(initIds).contains(viewInfo.initId);
    });
    _(uselessViewList).each(function(viewInfo) {
      this.destroyView(viewInfo);
    }, this);
  }
});

module.exports = PoolingModule;
