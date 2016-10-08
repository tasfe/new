"use strict";

var menuConfig = require('skeleton/misc/menuConfig');

var dividendConfig = require('agencyCenter/dividendManage/dividendConfig');

var SidemenuModule = Base.Module.extend({

  startWithParent: false,

  menuConfig: menuConfig.getAll(),

  onStart: function() {
    _.bindAll(this, 'updateMenuAuth');
    
    Global.m.subscribe('acct', 'acct:updating', this.updateMenuAuth);
  },

  updateMenuAuth: function(acctInfo) {
    //dividendStatus 分红状态
    var dividendAuth = acctInfo.dividendStatus !== dividendConfig.getByName('UN_APPLIED').id;

    _(menuConfig.get('ac').sub).findWhere({
      id: 135
    }).auth = dividendAuth;

    _(menuConfig.get('ac').sub).findWhere({
      id: 137
    }).auth = acctInfo.upGradeUser;

    setTimeout(function() {
      if (Global.headerRegion.currentView) {
        Global.headerRegion.currentView.toggleDividend(dividendAuth);
        Global.headerRegion.currentView.toggleRush(acctInfo.upGradeUser);
      }
    }, 500);

    //dividendStatus 分红状态
    //_(menuConfig.get('ac').sub).findWhere({
    //  id: 33
    //}).auth = acctInfo.redEnvelope;
  },

  getAll: function() {
    return this.menuConfig;
  },

  get: function(router) {
    return menuConfig.get(router);
  },

  selectMenuFromCurrentHash: function() {
    this.selectMenu(window.location.hash);
    // Global.entryRegion.currentView.updateQuickEntry(window.location.hash);
  },

  selectMenu: function(hash) {
    if (!hash) {
      hash = '#';
    }

    var $mainMenu = $('.js-gl-main-navbar');
    var $bgFocus = $('.js-gl-main-navbar-focus');

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
