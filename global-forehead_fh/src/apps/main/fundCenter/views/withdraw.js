"use strict";

var WithdrawConfirmView = require('fundCenter/views/withdraw-confirm');

var MoneyWithdrawalView = Base.ItemView.extend({

  template: require('fundCenter/templates/withdraw.html'),

  className: '',

  events: {
    'click .js-fc-quickAmount': 'quickAmountHandler',
    'change .js-fc-wd-bankList': 'bankSelectedHandler',
    'click .js-ac-statistic-type': 'quickAmountHandler',
    'click .js-fc-wd-commit': 'confirmHandler'
  },

  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/fund/withdraw/info.json'
    });
  },

  getWithdrawXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/withdraw/withdraw.json',
      data: _(data).extend({
        device: 0
      })
    });
  },
  
  verifyPayPwdXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/moneypd/verify.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;
    // this.$('.js-fc-wd-payPwd').val(this.options.payPwd);
    this.$form = this.$('.js-fc-wd-form');
    this.$QuickAmountContainer = this.$('.js-fc-wd-quickAmounts');
    this.$cardList = this.$('.js-fc-wd-bankList');
    this.parsley = this.$form.parsley({
      errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change'
    });
    this.$TimeLimit = this.$('.js-fc-wd-times-limit');
    this.$TimeUsed = this.$('.js-fc-wd-times-used');
    this.$AmountMin = this.$('.js-fc-wd-amount-limit-min');
    this.$AmountMax = this.$('.js-fc-wd-amount-limit-max');
    this.acctInfo = Global.memoryCache.get('acctInfo');
    this.$('.js-fc-wd-username').html(this.acctInfo.username);
    this.$nextClick = this.$('.js-fc-wd-commit');

    //TODO 待修改
    this.$ConfirmBank = this.$('.js-fc-wd-confirm-bank');
    this.$CustomerName = this.$('.js-fc-wd-confirm-customerName');
    this.$BankNo = this.$('.js-fc-wd-confirm-bankNo');
    this.$Amount = this.$('.js-fc-wd-confirm-amount');

    this.getInfoXhr()
      .always(function() {
      })
      .done(function(res) {
        var data = res && res.root || {};
        if (res && res.result === 0) {
          self.renderBasicInfo(data);
        } else {
          Global.ui.notification.show('服务器异常');
        }
      });
  },

  renderBasicInfo: function(data) {
    var self = this;
    this.$('.js-fc-valid-balance').html(_(data.validBalance).convert2yuan({fixed:4,clear: false}));
    this.$('.js-fc-wd-amount').attr('data-parsley-max', _(data.validBalance).convert2yuan());

    this.renderCardList(data.cardList);
    this.generateQuickAmount(data.keyAmount);

    this.$('.js-fc-wd-tab-body').removeClass('hidden');

    this.$quest = data.question;
    this.$securityId = data.securityId;
    this.$TimeLimit.html(data.confNum);
    this.$TimeUsed.html(data.confNum - data.remainTimes);

  },
  generateQuickAmount: function(keyAmount) {
    var self = this;
    var html = [];
    _(keyAmount).each(function(amount, index) {
      html.push('<li class="js-fc-quickAmount " data-type="' + amount + '">');
      html.push(self.formatAmount(amount));
      html.push('</li>');
    });
    this.$QuickAmountContainer.html(html.join(''));
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
    var amount = $target.data('type');
    this.$('.js-fc-wd-amount').val(amount);
  },

  renderCardList: function(cardList) {
    console.log(JSON.stringify(cardList));
    this.cardList = cardList;
    if (_(cardList).isEmpty()) {
      this.$cardList.html();
    } else {
      this.$cardList.html(_(cardList).map(function(card, index) {
        var valMin = _(card.minMoneyLimit).convert2yuan();
        var valMax = _(card.maxMoneyLimit).convert2yuan();
        return '<option value="' + card.cardId + '" data-min="' + valMin + '" data-max="' + valMax +'" data-bankid="' +card.bankId +'" data-cusname="' + card.name + '" data-cardno="' + card.cardNo +'" data-status='+card.canWithdraw+'>'+card.bankName+ ' '+ card.cardNo + ' ' + (card.canWithdraw ? '' : '(不可用)') + '</option>';
      }, this).join(''));
    }
    console.log(this.$cardList.find('option:first-child').attr('data-status'));
    this.canWithdrawHandler(this.$cardList.find('option:first-child').attr('data-status'));
    this.$('.js-fc-wd-bankList').trigger('change');
  },

  bankSelectedHandler: function() {
    var self = this;
    var $option = this.$('.js-fc-wd-bankList').find('option:selected')
    var valMin = $option.data('min');
    var valMax = $option.data('max');
    var status = $option.data('status');
    console.log(status);
    this.canWithdrawHandler(status);
    if (valMin === 0 || valMin === undefined) {
      valMin = 1;
    }
    if (valMax === 0 || valMax === undefined) {
      valMax = 5000000;
    }
    self.$('.js-fc-wd-amount').attr('data-parsley-range', '[' + valMin + ',' + valMax + ']');
    // this.$btnSubmit.removeAttr('disabled');
    this.$AmountMin.html(valMin);
    this.$AmountMax.html(valMax);
    this.parsley.reset();
  },
  canWithdrawHandler:function (status) {

    this.$nextClick.prop('disabled',!status);

  },

  confirmHandler: function() {

    // var self = this;
    // var $btnConfirm = this.$('.js-fc-confirm');
    //
    // $btnConfirm.button('loading');

    if (!this.parsley.validate()) {
      return false;
    }

    var $bankCard = this.$('.js-fc-wd-bankList').find('option:selected');

    var wcView = new WithdrawConfirmView({
      parentView: this.parentView,
      cardId: $bankCard.val(),
      bankId: $bankCard.data('bankid'),
      cardNo: $bankCard.data('cardno'),
      cusName: $bankCard.data('cusname'),
      amount: this.$('.js-fc-wd-amount').val(),
      question:this.$quest,
      securityId:this.$securityId
    });
    this.$('.js-fc-wd-form').addClass('hidden');

    this.$('.js-fc-wd-container-sub').removeClass('hidden').html(wcView.render().el);
    
    
  }


});

module.exports = MoneyWithdrawalView;
