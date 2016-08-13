'use strict';

var LowMultiSelect = require('com/lowMultiSelect');

var MoneyTransferView = Base.ItemView.extend({

  template: require('fundCenter/templates/moneyTransfer.html'),

  className: 'fc-moneyTransfer-view',

  startOnLoading: true,

  events: {
    'click .js-fc-btn-submit': 'submitHandler'
  },

  //获取转账信息
  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/gettradeinfo.json',
      abort: false
    });
  },

  getTransferXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/transfer/transfer.json',
      data: data,
      tradition: true
    });
  },

  initialize: function () {
  },

  onRender: function() {
    var self = this;
    var acctInfo = Global.memoryCache.get('acctInfo');

    if (!acctInfo || acctInfo.userStatus === 100) {
      this.$('.js-fc-btn-submit').prop('disabled', true);

      Global.ui.notification.show('用户已被冻结，无法进行转账操作。');
    }

    this.$form = this.$('.js-fc-transfer-form');
    this.$lowLevelSelect = this.$('.js-fc-lowLevelSelect');
    this.$btnSubmit = this.$('.js-fc-btn-submit');

    this.getInfoXhr()
        .always(function() {
          self.loadingFinish();
        })
        .done(function(res) {
          var data = res.root || {};
          if (res && res.result === 0) {
            if (self.renderBasicInfo(data)) {
              self.lowMultiSelect = new LowMultiSelect();
              self.$lowLevelSelect.html(self.lowMultiSelect.render().el);
              self.initRequestParams();
              self.parsley = self.$form.parsley({
                errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
                errorTemplate: '<div class="tooltip-inner">',
                trigger: 'change'
              });
            }
          } else {
            Global.ui.notification.show('获取转账相关信息失败。');
          }
        });
  },
  initRequestParams: function() {
    var username;
    if(this.options.reqData){
      var userId = this.options.reqData.userId;
      if(!_(userId).isUndefined() && userId!==''){
        username = this.options.reqData.username;
        this.lowMultiSelect.selectUser(Number(userId), username);
      }
    }
  },
  renderBasicInfo: function(data) {
    
    if(data.pStatus === 1 && data.sStatus === 1) {
      this.$('.js-fc-transfer-form').removeClass('hidden');
      this.$('.js-fc-transfer-form').html('<div class="text-center m-top-lg">非常抱歉，平台转账功能目前已经关闭，如有疑问请联系在线客服。</div>');
      return false;
    }

    if (!data.hasMoneyPwd) {
      this.$el.securityTip({
        content: '请补充完您的安全信息后再提现',
        hasMoneyPwd: data.hasMoneyPwd,
        hasBankCard: true,
        showBankCard: false,
        body:this.$el
      });
    }

    this.$('.js-fc-transfer-form').removeClass('hidden');
    this.$('.js-fc-avail-money').html(_(data.balance).convert2yuan());
    this.$('.js-fc-question').html(data.question);
    this.$securityId = data.securityId;
    var valMin = _(data.minMoney).convert2yuan();
    var valMax = _(data.maxMoney).convert2yuan();
    var valTradeNum = data.tradeNum;
    var desMin = '';
    var desMax = '';
    var desTradeNum = '';
    if(valMin === 0) {
      valMin = 1;
      desMin = '（单笔最低转账金额无限制';
    } else {
      desMin = '（最低转账金额<span class="js-fc-tf-minLimit text-pleasant">' + valMin + '</span>元';
    }
    if(valMax === 0){
      valMax = 5000000;
      desMax = ',最高转账金额无限制';
    } else {
      desMax = ',最高转账金额<span class="js-fc-tf-maxLimit text-pleasant">' + valMax + '</span>元';
    }
    if(data.confNum === 0) {
      valTradeNum = -1;
      desTradeNum = ',转账次数无限制）';
    } else {
      desTradeNum = ',今日还可以转账<span class="text-pleasant">'+valTradeNum+'次</span>）';
    }

    this.$('.js-fc-tf-amount').attr('data-parsley-range','['+ valMin +','+ valMax +']');
    this.$('.js-fc-mt-valDesc').html(desMin+desMax+desTradeNum);
    this.$('.js-fc-mt-tradeNum').val(valTradeNum);
    if(valTradeNum === 0) {
      this.$('.js-fc-btn-submit').prop('disabled',true);
    }
    return true;
  },

  //event handlers

  submitHandler: function(e) {
    var self = this;
    var sub = _(this.lowMultiSelect.getAll()).pluck('id');
    
    if(this.$('.js-fc-mt-tradeNum').val()===''||Number(this.$('.js-fc-mt-tradeNum').val())==='0'){
      Global.ui.notification.show('可转账次数不足。');
      return false;
    }

    if(sub === null || _(sub).size() < 1) {
      Global.ui.notification.show('请先选择需要转账的用户。');
      return false;
    }

    var validBalance = Number(this.$('.js-fc-avail-money').html());
    if(_(validBalance).isNumber() && _(validBalance).isFinite()) {
      this.$('.js-fc-tf-amount').attr('data-parsley-max', _(validBalance).formatDiv(_(sub).size(),{
        fixed:false
      }));
    } else {
      Global.ui.notification.show('可转账余额不足。');
      return false;
    }

    if (!this.parsley.validate()) {
      return false;
    }

    this.$btnSubmit.button('loading');

    this.getTransferXhr({
          moneyPwd: this.$('.js-fc-tf-payPwd').val(),
          securityId: this.$securityId,
          answer: this.$('.js-mt-answer').val(),
          tradeMoney: this.$('.js-fc-tf-amount').val(),
          sub: sub
        })
        .always(function() {
          self.$btnSubmit.button('reset');
        })
        .done(function(res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('转账成功。', {
              type: 'success'
            });
            self.render();
          } else {
            if(_(res.root).isNumber()) {
              if (res.root > 0){
                Global.ui.notification.show('验证失败，您还有' + res.root + '次输入机会');
              }
              if(res.root === 0){
                Global.ui.notification.show('验证失败，请一个小时后再尝试！');
              }
            } else {
              Global.ui.notification.show('验证失败，' + res.msg);
            }
          }
        });
  }
});

module.exports = MoneyTransferView;
