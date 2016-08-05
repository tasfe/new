define(function(require, exports, module) {

  var RouterModule = Base.Module.extend({

    startWithParent: false,

    _history: [],

    initialize: function() {
      var self = this;

      $(document).off('click.router').on('click.router', 'a.router', function(e) {
        var $target = $(e.currentTarget);

        self._history.push(Backbone.history.getHash());

        Global.appRouter.navigate(_($target.attr('href')).addHrefArgs('_t', _.now()), {trigger: true, replace: false});
        //window.location.href = _($target.attr('href'));
        Global.appRouter.navigate($target.attr('href'), {trigger: false, replace: false});

        e.preventDefault();
        return false;
      });

      $(document).off('click.sub-return').on('click.sub-return', 'a.sub-return,button.sub-return', function(e) {
        self.back();
      });
    },

    back: function() {
      var superior = Global.viewPool.getBack();

      if (superior.view) {

        superior.regin.show(superior.view, {
          preventRender: true
        });

        Global.appRouter.navigate(superior.router, {trigger: false, replace: false});
      } else if (superior.parentRouter) {
        Global.appRouter.navigate(superior.parentRouter, {trigger: true, replace: false});
      } else {
        Global.appRouter.navigate('#', {trigger: true, replace: false});
      }
    },

    close: function() {

    }
  });

  module.exports = RouterModule;

});