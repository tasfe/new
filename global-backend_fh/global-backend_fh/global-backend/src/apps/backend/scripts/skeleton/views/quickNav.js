define(function(require, exports, module) {

  var QuickNavView = Base.ItemView.extend({

    template: require('text!skeleton/templates/quickNav.html'),

    itemTpl: _('<li class="js-gl-nav-item js-gl-nav-item-<%=id %>" data-id="<%=id %>">' +
      '<a href="#<%=router %>"><%=title %></a>' +
      '<i class="js-gl-del fa fa-times"></i>' +
      '</li>').template(),

    events: {
      'click .js-gl-prev': 'prevHandler',
      'click .js-gl-next': 'nextHandler',
      'click .js-gl-nav-item': 'selectHandler',
      'click .js-gl-del': 'delHandler'
    },

    onRender: function() {
      this.$main = this.$('.js-quick-main');
      this.$nav = this.$('.js-quick-nav');
      this.$nav.sortable();
      this.$nav.disableSelection();
    },

    //common APIs

    add: function(id, title, router) {
      this.$nav.append(this.itemTpl({
        id: id,
        title: title,
        router: router
      }));

      this.$nav.find('.js-gl-nav-item-' + id).addClass('active').siblings().removeClass('active');

      if (this.$main.height() - 38 > 0) {
        this.$main.css('top', 38 - this.$main.height());
      }
    },

    changeActiveInfo: function(id, router) {
      var $active = this.$nav.find('.active');
      var prevId = $active.data('id');
      $active.removeClass('js-gl-nav-item-' + prevId).addClass('js-gl-nav-item-' + id).data('id', id).find('a').attr('href', '#' + router);

      return prevId;
    },

    getCurrent: function() {
      return this.$nav.find('.active').data('id');
    },

    //event handlers

    prevHandler: function(e) {
      if (this.$main.position().top < 0) {
        this.$main.css('top', this.$main.position().top + 38);
      }
    },

    nextHandler: function(e) {
      var nextTop = this.$main.position().top - 38;
      if (this.$main.height() - 38 >= Math.abs(nextTop)) {
        this.$main.css('top', nextTop);
      }
    },

    selectHandler: function(e) {
      var $target = $(e.currentTarget);
      var pool = Global.viewPool.getById($target.data('id'));
      $target.addClass('active').siblings().removeClass('active');

      pool.regin.show(pool.view, {
        preventRender: true,
        preventDestroy: true
      });

      Global.appRouter.navigate(pool.router, {trigger: false, replace: false});

      return false;
    },

    delHandler: function(e) {
      var $target = $(e.currentTarget);
      var $list = this.$nav.find('.js-gl-nav-item').not('.active');

      if ($list.length) {
        var $current = $target.closest('.js-gl-nav-item');

        Global.viewPool.destroyById($current.data('id'));

        if ($current.hasClass('active')) {
          var $next = $current.next();

          $current.remove();

          if ($next.length) {
            $next.click();
          } else {
            $list.last().click();
          }
        } else {
          $current.remove();
        }
      }

      return false;
    }
  });

  module.exports = QuickNavView;
});