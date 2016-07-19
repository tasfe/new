"use strict";



var ApplyView = Base.ItemView.extend({

  template: require('./apply.html'),

  events: {
    'click .js-submit': 'submitHandler'
  },

  initialize: function () {

  },

  getConfigXhr: function() {
    return Global.sync.ajax({
      url: '/acct/vip/creditFundConifg.json'
    });
  },

  onRender: function() {
    var self = this;
    this.getConfigXhr()
      .done(function(res) {
        if (res && res.result === 0) {
          var proportion = res.root.proportion;
          var loanMoneyLimit = res.root.loanMoneyLimit;
          proportion = proportion.replace(':','元投注流水，可冲抵');
          self.$('.js-amount1').html(proportion);
          self.$('.js-amount2').html(loanMoneyLimit/10000);
        }
      });
  },

  saveLoanXhr: function(money) {
    return Global.sync.ajax({
      url: '/acct/vip/saveLoanAplly.json',
      data: {
        money: money
      }
    });
  },

  submitHandler: function() {
    var self = this;
    var money = this.$('.js-money').val();
    this.saveLoanXhr(money)
      .done(function(res) {
        if (res && res.result == 0) {

            Global.ui.notification.show(res.msg, {
              type: 'success'
            });
            //var $dialog = Global.ui.dialog.show({
            //  title: '温馨提示',
            //  body: '<div class=" fc-re-resultShow text-center">' +
            //  '<div class="text-center font-sm m-bottom-md fc-re-result-desc">'+res.msg+'</div>' +
            //  '</div>',
            //  footer: ''
            //});
        }else {
          Global.ui.notification.show('结算失败，有可能是：<br>' + res.msg);
        }
      });


  }



});

module.exports = ApplyView;
