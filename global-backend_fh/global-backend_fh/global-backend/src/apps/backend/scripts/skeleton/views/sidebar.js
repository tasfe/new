define(function(require, exports, module) {

  var SidebarView = Base.ItemView.extend({

    template: require('text!skeleton/templates/sidebar.html'),

    itemTpl: _.template(require('text!skeleton/templates/sidebar-item.html')),

    className: 'sidebar-menu fixed',

    events: {
      'click .sidebar-inner .openable > a': 'collapsibleMenu',
      'click .js-mu-link': 'menuLinkHandler'
    },

    initialize: function() {
      var self = this;

      this.collection.bind('reset', function(collection) {
        Global.authority.setup(collection.toJSON());
        self.render.apply(self, arguments);
      });

      self.render.apply(self, [this.collection]);
    },
    recordOperateXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/sysusermng/dooperate.json',
        data: data
      });
    },
    menuLinkHandler: function(e){
      var $target = $(e.currentTarget);
      var href = $target.attr('href');
      if(href){
        var data = {
          menuId: $target.data('id')
        };
        this.recordOperateXhr(data);
      }
    },
    serializeData: function() {
      return {
        sidemenu: this.getMenuHtml(this.collection.toJSON(), 1, true)
      };
    },

    getMenuHtml: function(menuList, level, openable) {
      return _(menuList).map(function(menus) {

        var ulClass;
        switch (level) {
          case 1:
            ulClass = 'submenu';
            break;
          case 2:
            ulClass = 'submenu third-level';
            break;
          case 3:
            ulClass = 'submenu fourth-level';
            break;
        }
        if( menus.type===2){
          return '';
        }
        if (menus.subFuncList && menus.subFuncList.length) {
          return this.getMenuItemHtml(menus, level, this.getMenuHtml(menus.subFuncList, 1 + level, openable), ulClass);
        } else {
          return this.getMenuItemHtml(menus, level);
        }
      }, this).join('');
    },

    getMenuItemHtml: function(menus, level, children, ulClass) {
      return this.itemTpl({
        level: level,
        menus: menus,
        children: children,
        ulClass: ulClass
      });
    },

    onRender: function() {
      var self = this;
      var timer = setInterval(function() {
        if (self.$el.height() > 100) {

          self.$('.sidebar-inner').slimScroll({
            height: self.$el.height()
          });

          clearInterval(timer);
        }
      }, 1000);

      Global.ui.sidemenu.selectMenuFromCurrentHash();

      this._bindClosePopoverHandler();
    },

    mixinTemplateHelpers: function(data) {
      return data;
    },

    collapsibleMenu: function(e) {
      var $item = $(e.currentTarget);
      if (!this.$el.hasClass('sidebar-mini')) {
        Global.ui.sidemenu.handleSelect($item.parent());
      }

      return false;
    },
    //xxx 临时处理popover 无法自己关闭的问题
    _bindClosePopoverHandler: function() {
      $(document).off('click.popover').on('click.popover', function(e) {
        var $target = $(e.target);
        var $popover = $target.closest('.popover');
        if (!$popover.length) {
          //只关闭没有非当前点击的popover, 在生成popover的handler中返回false则不会触发此事件
          _($(':data(bs.popover)')).each(function(el) {
            if ($(el).data('bs.popover') !== $target.data('bs.popover')) {
              $(el).popover('hide');
            }
          });
        }
      });
    }

  });

  module.exports = SidebarView;

});