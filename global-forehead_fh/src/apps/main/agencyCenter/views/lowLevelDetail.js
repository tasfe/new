"use strict";

var PriceDetailsView = require('userCenter/views/priceDetails');

var LowLevelDetailView = Base.ItemView.extend({

  template: require('agencyCenter/templates/lowLevelDetail.html'),

  startOnLoading: true,

  events: {},

  className: 'ac-lowLevel-detail-view',

  initialize: function() {
  },

  getSubAcctDetailXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctdetail.json',
      data: {
        subAcctId: this.options.userId
      }
    });
  },

  onRender: function() {
    var userName = _.getUrlParam('name');
    this.$_parentEl.find('.js-ac-detailUserName').html(userName);
    this.$personalBalance = this.$('.js-ac-personalBalance');
    this.$groupBalance = this.$('.js-ac-groupBalance');
    this.$unActiveNum = this.$('.js-ac-unActiveNum');
    this.$registrationDate = this.$('.js-ac-registrationDate');
    this.$loginDate = this.$('.js-ac-nearestLoginDate');

    //综合详情
    this._initCompDetail();
    //奖金详情：创建一个view,并添加在指定位置，传递指定参数
    this.$('.js-ac-priceDetail').html(new PriceDetailsView({
      userId: this.options.userId,
      loadingHeight: 369,
      height: 369
    }).render().$el);

    this.$('.js-ac-uDays').popover({
      trigger: 'hover',
      html: true,
      content: '<strong>不活跃天数定义</strong> <br />连续多少天内无任何账变，即为不活跃的天数',
      placement: 'bottom'
    });

  },

  //获取综合详情
  _initCompDetail: function() {
    var self = this;

    this.getSubAcctDetailXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if(res && res.result === 0) {
          var data = res.root || {};

          self.$personalBalance.html(_(data.balance).convert2yuan());
          self.$groupBalance.html(_(data.teamBalance).convert2yuan());
          self.$unActiveNum.html(data.uDays);
          //self.$('.js-ac-unActiveNum').html(data.unActivitySub + '/' + data.totalSub);
          self.$registrationDate.html(_(res.root.regTime).toTime());
          if (data.loginResult.length) {
            self.$loginDate.html(_(data.loginResult).map(function(loginResult) {
              return '<span class="js-ac-loginDate ac-loginDate">' + _(loginResult.loginTime).toTime() + '</span>';
            }).join('>')).removeClass('hidden');
          } else {
            self.$loginDate.addClass('hidden');
          }
        }
      });
  }
});

module.exports = LowLevelDetailView;
