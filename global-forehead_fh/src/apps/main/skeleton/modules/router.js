"use strict";

var RouterModule = Base.Module.extend({

  startWithParent: false,

  _history: [],

  initialize: function() {
    var self = this;

    $(document).off('click.router').on('click.router', 'a.router', function(e) {
      var $target = $(e.currentTarget);

      //var hasFind = Global.viewPool.getQuick($target.attr('href'));

      self._history.push(Backbone.history.getHash());


      //if (!hasFind) {
      Global.appRouter.navigate(_($target.attr('href')).addHrefArgs({
        '_t': _.now()
      }), {trigger: true, replace: false});
      //}

      Global.appRouter.navigate($target.attr('href'), {trigger: false, replace: true});

      //if (hasFind) {
      //  Global.ui.menu.selectMenuFromCurrentHash();
      //}

      e.preventDefault();

      return false;
    });

    $(document).off('click.sub-return').on('click.sub-return', 'a.sub-return,button.sub-return', function(e) {
      self.back();
    });
  },

  goTo: function(hash) {
    Global.appRouter.navigate(_(hash).addHrefArgs({
      '_t': _.now()
    }), {trigger: true, replace: false});

    Global.appRouter.navigate(hash, {trigger: false, replace: true});
  },

  back: function() {
    var superior = Global.viewPool.getBack();

    if (!superior.noParent && superior.view) {

      //superior.regin.$el.removeClass('hidden');

      superior.regin.show(superior.view, {
        preventRender: true
      });

      try {
        superior.view.trigger('router:back');
        superior.view.mainRegin.currentView.trigger('router:back');
      } catch(e) {

      }


      Global.appRouter.navigate(superior.router, {trigger: false, replace: false});
      //Global.appRouter.navigate(this._history.pop(), {trigger: false, replace: false});
    } else if (superior.noParent && superior.parentRouter) {

      superior.view.destroy();

      Global.appRouter.navigate(superior.parentRouter, {trigger: true, replace: false});
    } else {
      Global.appRouter.navigate('#', {trigger: true, replace: false});
    }
  },

  close: function() {

  }
});

module.exports = RouterModule;
