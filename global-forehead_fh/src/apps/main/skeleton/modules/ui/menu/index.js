"use strict";

var MenuConfig = require('skeleton/misc/menuConfig');

var dividendConfig = require('agencyCenter/dividendManage/dividendConfig');

var SidemenuModule = Base.Module.extend({

  startWithParent: false,

  menuConfig: MenuConfig.getAll(),

  onStart: function() {
    _.bindAll(this, 'updateMenuAuth');
    
    Global.m.subscribe('acct', 'acct:updating', this.updateMenuAuth);
  },

  updateMenuAuth: function(acctInfo) {
    var dividendAuth = acctInfo.dividendStatus !== dividendConfig.getByName('UN_APPLIED').id;//dividendStatus 分红状态
    var wagesAuth = acctInfo.salaryStatus !== dividendConfig.getByName('UN_APPLIED').id; //工资状态，true,false

    var dividendMenu = _(MenuConfig.get('ac').sub).findWhere({
      id: 136
    });
    var wagesMenu = _(MenuConfig.get('ac').sub).findWhere({
      id: 135
    });

    dividendMenu.auth = dividendAuth;
    wagesMenu.auth = wagesAuth;

    setInterval(function() {
      // Global.navbarRegion.currentView && Global.navbarRegion.currentView.toggleMenu(dividendMenu);
      // Global.navbarRegion.currentView && Global.navbarRegion.currentView.toggleMenu(wagesMenu);
    }, 500);
  },

  getAll: function() {
    return this.menuConfig;
  },

  get: function(router) {
    return MenuConfig.get(router);
  },

  selectMenuFromCurrentHash: function() {
    this.selectMenu(window.location.hash);
    // Global.entryRegion.currentView.updateQuickEntry(window.location.hash);
  },

  selectMenu: function(hash) {
    var $mainMenu = $('.js-gl-main-navbar');
    var $bgFocus = $('.js-gl-main-navbar-focus');

    if (!_(['', 'bc', 'gc', 'at']).contains(_(hash).getRouter().substring(0, 2))) {
      return false;
    }

    if (!hash) {
      hash = '#';
    }

    $mainMenu.find('li').each(function(index, li) {
      var $li = $(li);
      if ($li.data('router') === '') {
        if (hash.indexOf('?') === 1 || hash === '#') {
          $li.addClass('active');
          $bgFocus.animate({left: 500 + $li.index() * 116}, 500);
        } else {
          $li.removeClass('active');
        }

      } else if (hash.indexOf($li.data('router')) === 1) {
        $li.addClass('active');
        $bgFocus.animate({left: 500 + $li.index() * 116}, 500);
      } else {
        $li.removeClass('active');
      }
    });
  }
});

module.exports = SidemenuModule;
