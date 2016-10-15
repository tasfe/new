"use strict";

var MultiSidebarView = require('com/sidebar-multi-help');

var helpConfig;
require('./index.scss');

var HelpCenterView = Base.ItemView.extend({

  template: require('./index.html'),
  hotProdTemplate: require('../hotProd/index.html'),

  events: {
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
    this.$sidebar = this.$('.js-gl-sidebar');
    this.$main = this.$('.js-hc-main');
    this.$mainTilte = this.$('.js-hc-main-title');
    this.$('.js-hc-hot-products').html(_(this.hotProdTemplate).template()({hotProducts:helpConfig.getAll().hotProducts}));

    this.multiSidebarView = new MultiSidebarView({
      el: this.$sidebar,
      sidebar: helpConfig.getAll(),
      height: 691
    })
      .on('change:select', function(arg, href) {
        var selectInfo = helpConfig.get(arg);
        if (selectInfo) {
          self.$mainTilte.text(selectInfo.name);
          self.$main.html(selectInfo.html);

          if (href) {
            Global.appRouter.navigate(href, {trigger: false, replace: false});
          }

          var accordion = _.getUrlParam('accordion');

          if (accordion) {
            clearInterval(self.timer);
            self.timer = setInterval(function() {

              if (self.$main.height() > 0 && self.$main.width() > 0) {
                clearInterval(self.timer);
                var $accordion = self.$main.find('#' + accordion);
                self.$main.scrollTop($accordion.closest('.accordion-group').offset().top);
                $accordion.collapse('toggle');
              }
            }, 100);
          } else {
            clearInterval(self.timer1);
            self.timer1 = setInterval(function() {
              if (self.$main.height() > 0 && self.$main.width() > 0) {
                clearInterval(self.timer1);
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
      this.multiSidebarView.goTo('page=' + page, 'goTo');
    }
  }
});

module.exports = HelpCenterView;
