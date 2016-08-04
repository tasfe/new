define(function(require, exports, module) {

  var PollingModule = Base.Module.extend({

    startWithParent: false,

    _polling: [],

    _currentView: null,

    initialize: function(options, moduleName, app) {
    },

    push: function(viewInfo, config) {
      config = config || {
          destroyDiff: false
        };

      viewInfo.id = Number(_.uniqueId());

      viewInfo.router = viewInfo.router.replace(/\?.*/, '') || '#';

      if (config.destroyDiff) {
        this._clearDiff(viewInfo.router);
      }

      if (config.addNav) {
        Global.navRegin.currentView.add(viewInfo.id, viewInfo.title, viewInfo.router);
      } else {
        viewInfo.parentId = Global.navRegin.currentView.changeActiveInfo(viewInfo.id, viewInfo.router);
      }

      this._polling.push(viewInfo);

      console.log(this._polling);
    },

    getById: function(id) {
      return _(this._polling).findWhere({
        id: id
      });
    },

    getBack: function() {
      var current = this.getById(Global.navRegin.currentView.getCurrent());
      var parent = this.getById(current.parentId);
      //var current = this._polling.pop();

      console.log(this._polling);

      if (this._polling.length === 0) {
        return {
          parentRouter: parent.parentRouter
        };
      } else {
        Global.navRegin.currentView.changeActiveInfo(parent.id, parent.router);

        this.destroyView(current);

        this._polling = _(this._polling).without(current);

        return parent;
      }
    },

    empty: function() {
      _(this._polling).each(function(superior) {
        superior.regin.empty();
      });
    },

    setCurrentView: function(view) {
      return this._currentView = view;
    },

    getCurrentView: function() {
      return this._currentView;
    },

    _clearDiff: function(router) {
      _(this._polling).each(function(poll) {
        if (poll.router) {
          if(router.indexOf(poll.router) === -1 || router === poll.router) {
            this.destroyView(poll);
          }
        }
      }, this);
    },

    destroyById: function(id) {
      this.destroyView(this.getById(id));
    },

    destroyView: function(poll) {
      poll.view && !poll.view.isDestroyed && poll.view.destroy();
      this._polling = _(this._polling).without(poll);
    }
  });

  module.exports = PollingModule;

});