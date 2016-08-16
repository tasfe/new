"use strict";

var Countdown = require('com/countdown');

var AgreementView = Base.ItemView.extend({

  template: require('./index.html'),

  agreementContentTpl: _(require('./../agreement-content.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-as-approve': 'approveHandler'
  },

  getAgreementXhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/reqinfo.json'
    });
  },

  approveXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/approve.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;

    this.$rate = this.$('.js-ac-rate');
    this.$countdown = this.$('.js-ac-dm-fg-countdown');
    this.$btnApprove = this.$('.js-as-approve');

    this.getAgreementXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res && res.result === 0) {
          self._render(res.root);
        }
      });
  },

  _render: function(data) {
    this.$('.js-ac-agreement-content').html(this.agreementContentTpl({
      agreement: data.agreement
    }));

    this.$rate.text(_(data.divid).formatDiv(100) + '%');

    this.countdown = new Countdown({
      el: this.$countdown,
      color: 'red',
      size: 'sm'
    })
      .render(data.leftSeconds * 1000)
      .on('finish.countdown', function(e) {
        Global.ui.notification.show('您未在协议有效期内签署，当前协议已失效。', {
          event: function() {
            Global.m.oauth.check();
            Global.router.goTo('');
          }
        });
      });
  },

  approveHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var status = $target.data('status');

    this.$btnApprove.button('loading');

    this.approveXhr({
      status: status
    })
      .always(function() {
        self.$btnApprove.button('reset');
      })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.m.oauth.check()
            .done(function(res) {
              if (res && res.result === 0) {
                if (status === 1) {
                  Global.ui.notification.show('签署分红协议成功。', {
                    event: function() {
                      Global.m.oauth.check();
                      Global.router.goTo('ac/dm');
                    }
                  });
                } else {
                  Global.ui.notification.show('拒绝分红协议成功。', {
                    event: function() {
                      Global.m.oauth.check();
                      Global.router.goTo('');
                    }
                  });
                }
              }
            });
        } else {
          Global.ui.notification.show(res.msg || '');
        }
      });
  }
});

module.exports = AgreementView;
