"use strict";

require('./index.scss');

var MultiSidebarView = require('com/sidebar-multi');

var helpConfig;

var HelpCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  catalogTpl: _(require('./catalog.html')).template(),

  events: {
    'click .js-hc-catalog-detail': 'detailSelectHandler',
    'click .js-hc-return-btn': 'returnHandler'
  },

  onRender: function() {
    var self = this;
    require.ensure(['./config'], function(require) {
      helpConfig = require('./config');
      self._onRender();

      self.loadingFinish();
    }, 'help');
  },

  _onRender: function() {
    var self = this;
    this.$catalog = this.$('.js-hc-catalog');

    this.$detail = this.$('.js-hc-detail');
    this.$sidebar = this.$('.js-hc-sidebar');
    this.$main = this.$('.js-hc-main');
    this.$mainTilte = this.$('.js-hc-main-title');
    this.$btnReturn = this.$('.js-hc-return-btn');

    this.$catalog.html(this.catalogTpl({
      menus: _(helpConfig.getAll()).clone()
    }));

    this.multiSidebarView = new MultiSidebarView({
      el: this.$sidebar,
      sidebar: helpConfig.getAll(),
      height: 472
    })
      .on('change:select', function(arg, href, parentId) {
        var selectInfo = helpConfig.get(arg);
        this.toggleVisible(parentId);
        if (selectInfo) {
          self.$mainTilte.text(selectInfo.name);
          self.$main.html(selectInfo.html);

          if (href) {
            Global.appRouter.navigate(href, {trigger: false, replace: false});
          }

          var accordion = _.getUrlParam('accordion');

          if (accordion) {

            self.timer = setInterval(function() {

              if (self.$main.height() > 0 && self.$main.width() > 0) {
                clearInterval(self.timer);
                var $accordion = self.$main.find('#' + accordion);
                self.$main.scrollTop($accordion.closest('.accordion-group').offset().top);
                $accordion.collapse('toggle');
              }
            }, 100);
          } else {
            self.timer = setInterval(function() {
              if (self.$main.height() > 0 && self.$main.width() > 0) {
                clearInterval(self.timer);
                self.$main.find('.collapse').eq(0).collapse('toggle');
                self.$main.scrollTop(0);
              }
            }, 100);
          }
        } else {
          console.log('该帮助页面内容不存在.');
        }

      })
      .render();

    var page = _.getUrlParam('page');
    if (page) {
      this.toggleToDetail();
      this.multiSidebarView.goTo('page=' + page, 'goTo');
    }
  },

  toggleToDetail: function() {
    this.$btnReturn.removeClass('hidden');
    this.$detail.removeClass('hidden');
    this.$catalog.addClass('hidden');
  },

  toggleToCatalog: function() {
    this.$btnReturn.addClass('hidden');
    this.$detail.addClass('hidden');
    this.$catalog.removeClass('hidden');
  },

  //event handlers

  detailSelectHandler: function(e) {
    var $target = $(e.currentTarget);

    this.multiSidebarView.trigger('change:select', $target.data('args'), $target.attr('href'), $target.data('parentId'));
    this.toggleToDetail();
  },

  returnHandler: function(e) {
    Global.appRouter.navigate('hc', {trigger: false, replace: true});
    this.toggleToCatalog();
  }
});

module.exports = HelpCenterView;
