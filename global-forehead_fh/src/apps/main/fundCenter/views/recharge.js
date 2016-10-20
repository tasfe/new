"use strict";

var TabView = require('com/tabView');

var quickPayConfig = require('fundCenter/misc/quickPayConfig');
var bankConfig = require('userCenter/misc/bankConfig');

var RechargeView = TabView.extend({

  template: require('fundCenter/templates/recharge.html'),

  events: {
    'click .js-fc-re-payment-type': 'paymentTypeChangeHandler',
    'click .js-fc-re-bank': 'bankSelectHandler',
    'click .js-ac-statistic-type': 'quickAmountHandler',
    'click .js-fc-re-commit': 'confirmHandler',
    'click .js-recharge-again': 'switchRechargePage',
    'click .js-dismiss': 'dismiss',
    'keyup .js-fc-re-amount':'keyOnChangeHandler'
  },
  keyOnChangeHandler:function () {

    if (this.$hasFare){
      var amount = $('.js-fc-re-amount').val();
      var fare = _(amount).chain().formatMul(this.$feeLimit).formatDiv(100, {fixed: 4}).value();
      if (fare>=this.$maxFeeLimit){
        fare = this.$maxFeeLimit;
      }
      amount = _(amount).formatSub(fare,{fixed:4});
      this.$fareResult.html(isNaN(fare)?0:fare);
      this.$amountResult.html(isNaN(amount)?0:amount);
    }
  },

  startOnLoading: true,

  getRechargeBaseInfoXhr: function() {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargetype.json'
    });
  },

  onRender: function() {
    var self = this;


    this.$paymentContainer = this.$('.js-fc-re-tabs');
    this.$bankContainer = this.$('.js-fc-re-bankList');
    this.$quickAmountContainer = this.$('.js-fc-re-quickAmounts');
    this.$fareResult = this.$('.js-fare-result');
    this.$amountResult = this.$('.js-jine-result');
    this.$fareAlert = this.$('.js-fare-alert');

    this.getRechargeBaseInfoXhr()
      .done(function(res) {
        if (res.result === 0) {
          self.generateTab(res.root.paymentList);
          self.paymentList = res.root.paymentList;
          self.$('.js-fc-re-payment-type:first').trigger('click');
        }
      });
  },
  initPaymentPage: function(e) {
    var $target = $(e.currentTarget);
    var paymentId = $target.data('paymentId');
    var paymentType = $target.data('paymentType');

    this.$('input[name="paymentId"]').val(paymentId);
    this.$('input[name="paymentType"]').val(paymentType);

    var payment = _(this.paymentList).findWhere({
      paymentType: paymentType
    });
    this.paymentInfo = {
      paymentId: paymentId,
      paymentType: paymentType
    };

    this.generateQuickAmount(payment.keyAmount);
    this.generateBankTab(payment);
    var maxAmount = _(payment.maxMoneyLimit).convert2yuan({fixed: 0});
    var minAmount = _(payment.minMoneyLimit).convert2yuan({fixed: 0});
    this.$feeLimit = parseFloat(payment.feeLimit)/100;
    this.$maxFeeLimit = _(payment.maxFeeLimit).convert2yuan({fixed: 0});
    this.$hasFare = payment.feeOpen;

    this.$('.js-fc-re-amount').attr('data-parsley-range', '[' + minAmount + ',' + maxAmount + ']');
    if (this.$hasFare){
      this.$fareAlert.removeClass('hidden');
      this.$('.js-fc-re-amountLimit-tip').html('（最低<span class="text-hot">'+ minAmount +'</span>元，最高<span class="text-hot">'+ maxAmount +'</span>元，手续费<span class="text-hot">'+ this.$feeLimit +'</span>%，最高不超过<span class="text-hot">'+ this.$maxFeeLimit +'</span>元）');
    }else {
      this.$fareAlert.addClass('hidden');
      this.$('.js-fc-re-amountLimit-tip').html('（最低<span class="text-hot">'+ minAmount +'</span>元，最高<span class="text-hot">'+ maxAmount +'</span>元，免手续费）');
    }
    this.$('.js-fc-re-amount').removeClass('parsley-error');
    this.$('.tooltip').remove();
    var $form = this.$('.js-fc-re-form');
    $form.parsley().reset();
  },

  generateTab: function(paymentList) {
    var paymentInfoArr = [];
    var html = [];

    _(paymentList).map(function (payment) {
      var paymentInfo = quickPayConfig.get(payment.paymentType);
      paymentInfo.paymentType = payment.paymentType;
      paymentInfo.paymentId = payment.paymentId;
      paymentInfoArr.push(paymentInfo);
    });

    paymentInfoArr = _.sortBy(paymentInfoArr, 'sortId');

    _(paymentInfoArr).each(function(payment, index) {

      html.push('<li class="js-fc-re-payment-type ' + (index === 0 ? 'active' : '') +
        '" data-payment-type="' + payment.paymentType + '" data-payment-id="' + payment.paymentId + '">');
      html.push('<a href="javascript:void(0)" class="fc-re-nav-tab-a" >');
      // html.push('<span class="' + payment.className + '">' +payment.zhName+ '</span>');
      html.push(payment.zhName);
      html.push('</a>');
      html.push('</li>');



    });

    this.$paymentContainer.html(html.join(''));
  },

  generateBankTab: function(payment) {
    if (!_(payment.bankList).isEmpty()) {
      var bankList = payment.bankList;
      var html = [];
      var index = 0;
      _(bankList).each(function(bank, index1) {
        var bankInfo = bankConfig.get(bank.bankId);
        if (!bankInfo || bankInfo.className==='') {
          return false;
        }

        if ((index + 1) % 5 === 1) {
          html.push('<tr>')
        }
        html.push('<td><div class="js-fc-re-bank fc-re-bank ' + (index === 0 ? 'active' : '') + '" data-type="' + bankInfo.id + '" data-code="' + bank.bankCode + '">');
        html.push('<i class="fa fa-check-circle bank-select" aria-hidden="true"></i>');
        html.push('<span class="fc-bank-name ' + bankInfo.className + '"></span>');
        html.push('</div></td>');

        if ((index + 1) % 5 === 0) {
          html.push('</tr>')
        }

        index++;

      });
      var n = _(bankList).size();
      var x = 5 - n % 5;

      if (x !== 0) {
        _(_(x).range()).each(function(item, index) {
          if (index === 0) {
            html.push('<td><div class="js-fc-re-bank fc-re-bank" data-type=""><span class="bank-select sfa sfa-bank-select"></span><span class="fc-bank-name">其他</span></div></td>');
          } else {
            html.push('<td></td>');
          }
        });
        html.push('</tr>')
      }
      this.$bankContainer.html(html.join(''));
      this.$('.js-fc-re-bank').eq(0).trigger('click');
    } else {
      this.$bankContainer.html('');
    }
  },
  generateQuickAmount: function(keyAmount) {
    var self = this;
    var html = [];
    _(keyAmount).each(function(amount, index) {
      html.push('<li class="js-ac-statistic-type " data-type="' + amount + '">');
      html.push(self.formatAmount(amount));
      html.push('</li>');
    });
    this.$quickAmountContainer.html(html.join(''));
  },

  paymentTypeChangeHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');
    this.initPaymentPage(e);
  },

  formatAmount: function(amount) {
    var str = String(amount);
    var l = str.length;
    if (str.slice(l - 4, l) === '0000') {
      str = str.replace(/0000$/, '万');
    } else if (str.slice(l - 3, l) === '000') {
      str = str.replace(/000$/, '仟');
    }
    return str;
  },

  quickAmountHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.toggleClass('active');
    $target.siblings().removeClass('active');
    var amount = $target.data('type');
    this.$('.js-fc-re-amount').val(amount);
    this.keyOnChangeHandler();
  },

  bankSelectHandler: function(e) {
    var $target = $(e.currentTarget);
    this.$('.js-fc-re-bankList').find('.js-fc-re-bank').removeClass('active');
    $target.addClass('active');
    var bankId = $target.data("type");
    var bankCode = $target.data("code");
    this.$('input[name="bankId"]').val(bankId);

    this.$('input[name="bankCode"]').val(bankCode);
  },

  confirmHandler: function() {
    var $form = this.$('.js-fc-re-form');
    var clpValidate = $form.parsley().validate();
    var paymentInfo;

    if (clpValidate) {
      $form.submit();
      var amount = this.$('.js-fc-re-amount').val();
      paymentInfo = quickPayConfig.get(this.paymentInfo.paymentType);

      this.$('.js-fc-re-title-type').html(paymentInfo.zhName);
      this.$('.js-fc-re-title-amount').html(amount);
      this.$('.js-fc-form-area, .js-fc-tip-area').slideToggle();

      // this.$('.js-fc-re-modal').closest('.modal').modal('hide');
      //
      // var $dialog = Global.ui.dialog.show({
      //   title: '温馨提示',
      //   body: '<div class="text-center"><div class="text-center font-sm m-bottom-md text-hot">请在新打开的页面完成支付</div>' +
      //   '<div  class="m-bottom-md"><span>支付方式：</span><input type="text" class="" value="' + paymentInfo.zhName + '" disabled></div>' +
      //   '<div class="m-bottom-md"><span>充值金额：</span><input type="text" class="" value="' + amount + '" disabled></div>' +
      //   '<div class="text-center m-bottom-lg">' +
      //   '<button type="button" class="js-fc-re-succ btn btn-hot btn-lg m-right-md">已完成充值</button>' +
      //   '<button type="button" class="js-fc-re-fail btn btn-lg">充值遇到问题</button>' +
      //   '</div></div>',
      //   footer: ''
      // });
      //
      // $dialog.on('hidden.modal', function() {
      //   $(this).remove();
      // });
      //
      // $dialog.off('click.rechargeSucc')
      //   .on('click.rechargeSucc', '.js-fc-re-succ', function() {
      //     //提交充值完成通知，
      //     $dialog.modal('hide');
      //     Global.router.goTo('#fc/ad?tradeType=100');
      //   });
      //
      // $dialog.off('click.rechargeFail')
      //   .on('click.rechargeFail', '.js-fc-re-fail', function() {
      //     $dialog.modal('hide');
      //     window.open('#hc?page=withdraw-flow');
      //   });
    }

  },

  switchRechargePage: function () {
    this.$('.js-fc-form-area, .js-fc-tip-area').slideToggle()
  },

  dismiss: function () {
    var callback = this.options.callback
    callback && callback('dismiss')
  }
});

module.exports = RechargeView;
