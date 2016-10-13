"use strict";

var Countdown = require('com/countdown');

var AgreementView = Base.ItemView.extend({

  template: require('./index.html'),

  agreementContentTpl: _(require('./../agreement-content.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-ac-next': 'approveHandler'
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

    this.$countdown = this.$('.js-ac-dm-fg-countdown');
    this.$btnApprove = this.$('.js-as-approve');

    this.$table = this.$('.js-ac-sm-agree-table');
    this.$form = this.$('.js-ac-signed-form');
    this.$username = this.$('.ja-ac-sm-sign-username');
    this.$username.val(this.options.username);
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.getAgreementXhr({username: acctInfo.username}).always(function() {
      self.loadingFinish();
    }).done(function(res){
      if(res.result===0){
        var list = res.root.signList;
        self.countdown = new Countdown({
          el: self.$countdown,
          color: 'red',
          size: 'sm'
        })
          .render(res.root.leftSeconds * 1000)
          .on('finish.countdown', function(e) {
            Global.ui.notification.show('您未在协议有效期内签署，当前协议已失效。', {
              event: function() {
                Global.m.oauth.check();
                Global.router.goTo('');
              }
            });
          });
        self.$table.staticGrid({
          colModel: [
            {label: '分红等级', name: 'level', key: true, width: '30%', formatter: function(val,index) {
              return index+1;
            }},
            {label: '日量要求', name: 'betTotal', width: '40%', formatter: function(val,index,rowInfo) {
              return '≥'+_(val).convert2yuan({fixed:0});
            }},
            {label: '分红比例', name: 'divid', width: '30%', formatter: function(val,index,rowInfo) {
              return _(val).formatDiv(100) + '%';
            }},
          ],
          height: 140,
          row: list||[],
          startOnLoading: false
        });
      }
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
