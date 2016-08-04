define(function(require, exports, module) {

  var SidemenuModule = Base.Module.extend({

    startWithParent: false,

    selectMenuFromCurrentHash: function() {
      return this.selectMenu(window.location.hash);
    },

    selectMenu: function(menuLink) {
      //$('[href="\#' + menuId + "]');
      if (!menuLink) {
        menuLink = '#';
        //menuId = 'dashboard';
      } else {
        var match = menuLink.match(/#?(.*)(\?.*)/);

        if (!match || !match[2]) {
          match = menuLink.match(/#?(.*)(\??.*)/);
        }

        menuLink = '#' + match[1];
      }

      var $mainMenu = $('.main-menu');
      var $menu = $mainMenu.find('[data-link="' + menuLink + '"]');
      if ($menu.size() === 0) {
        $menu = $mainMenu.find('[data-link="' + menuLink + '"]');
      }
      //var $menu = $mainMenu.find('#menu-' + menuId);
      //if ($menu.size() === 0) {
      //  $menu = $mainMenu.find('#submenu-' + menuId);
      //}

      if ($menu.size() === 0) {
        return;
      }

      if ($menu.closest('ul').hasClass('submenu')) { // 多级菜单
        var $parentMenu = $menu.parents('.openable');
        if (!$parentMenu.hasClass('open')) {
          this.handleSelect($parentMenu);
        }
      } else { // 一级菜单
        if ($menu.hasClass('openable')) { // 该一级菜单有子菜单
          this.handleSelect($menu);
        }
      }
      this.handleActive($menu);

      return $menu.find('.menu-content-hover').text();
    },

    /**
     * 动态添加菜单
     * @param {String|Number} targetMenuId [description]
     * @param {Object} options      [description]
     */
    addMenu: function(targetMenuId, options) {

      var selector = _.isNumber(targetMenuId) ? ('li[data-func-id=' + targetMenuId + ']') : ('#menu-' + targetMenuId);

      var $targetMenu = $(selector);
      if ($targetMenu.size() === 0) {
        return;
      }

      var id = options.id;
      var link = options.link;
      var name = options.name;
    
      Global.authority.add(id);

      $targetMenu.find('ul.submenu').prepend('<li id="submenu-' + id + '" data-link="' + link + '" data-func-id="' + options.funcId + '"><a href="' + link + '"><span class="submenu-label">' + name + '</span></a>');
    },

    removeMenu: function(menuId) {

      var $mainMenu = $('.main-menu');
      var $menu = $mainMenu.find('#menu-' + menuId);
      if ($menu.size() === 0) {
        $menu = $mainMenu.find('#submenu-' + menuId);
      }

      $menu.remove();
    },

    handleSelect: function($menu) {
      if (!$('aside').hasClass('sidebar-mini') || Modernizr.mq('(max-width: 991px)')) {
        if ($menu.children('.submenu').is(':hidden')) {
          $menu.siblings().removeClass('open').children('.submenu').slideUp(200);
          $menu.addClass('open').children('.submenu').slideDown(200);
        } else {
          $menu.removeClass('open').children('.submenu').slideUp(200);
        }
      }
    },

    handleActive: function($menu) {
      var $mainMenu = $('.main-menu');
      $mainMenu.find('a,li').removeClass('active');
      $menu.addClass('active');
    }

  });

  module.exports = SidemenuModule;

});
