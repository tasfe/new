define(function (require, exports, module) {

  var WithdrawRangeSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/withdraw-WithdrawDepositSet-Range.html'),

    events: {
      'click .js-fc-wd-ws-add': 'addQuickAmountInputHandler',
      'click .js-fc-wd-ws-del': 'delQuickAmountInputHandler',
      'change .js-fc-ws-switch': 'feeSwitchHandler',
      'click .js-fc-withdrawSet-range-submit': 'withdrawSetSubmitHandler',
      'click .js-fc-withdrawSet-range-cancel': 'cancelHandler'
    },

    initialize: function () {

    },
    findWithdrawRangeXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/limitcfg.json',
        data: data
      });
    },
    saveWithdrawSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/limitcfgsave.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      var data = {};
      this.bankContainer = self.$('.js-fc-withdrawSet-range-cfgCommon-bank-container');
      this.$FeeSwitch = this.$('.js-fc-ws-switch');
      this.$FeeType = this.$('.js-fc-ws-range-feeType');
      this.$Fee = this.$('.js-fc-ws-range-fee');
      this.$MaxFee = this.$('.js-fc-ws-range-maxFee');
      self.findWithdrawRangeXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          Global.ui.notification.show("操作失败。");
        }
      });

    },
    withdrawSetSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);

      //todo 校验添加
      var $currContainer = $('.js-fc-WithdrawSet-Range-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {

        var bankCfgList = this.getSetInfoListFromContainer(this.bankContainer);
        var keyAmount = [];
        _(this.$('.js-fc-rechargeSet-quickAmount-amount')).each(function(item){
          keyAmount.push($(item).val());
        });

        var data = {
          dailyTimesLimit: this.$('.js-fc-withdrawSet-dailyTimeLimit').val(),
          fullTimeService: this.$('input[type=radio][name=fullTimeService]:checked').val(),
          startTime: this.$('.js-fc-withdrawSet-startTime').val(),
          endTime: this.$('.js-fc-withdrawSet-endTime').val(),
          bankCfgList: bankCfgList,
          apiOpen: this.$('.js-fc-withdrawSet-apiOpen').prop('checked'),
          keyAmount : keyAmount.join(','),
          feeOpen: this.$FeeSwitch.prop('checked'),
          feeType:this.$FeeType.find('option:selected').val(),
          fee: this.$Fee.val(),
          feeLimit: this.$MaxFee.val(),
          apiMinLimit: this.$('input[name=apiMinLimit]').val(),
          apiMaxLimit: this.$('input[name=apiMaxLimit]').val()
        };
        $target.button('loading');
        this.saveWithdrawSetXhr(data).always(function () {
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }

    },
    getSetInfoListFromContainer: function ($container) {
      var idList = $container.find('.js-fc-withdrawSet-id');
      var minMoneyLimitList = $container.find('.js-fc-withdrawSet-minMoneyLimit');
      var maxMoneyLimitList = $container.find('.js-fc-withdrawSet-maxMoneyLimit');
      var setInfoList = _(idList).map(function (id, index, inList) {
        return {
          bankId: $(id).data('type'),
          minMoneyLimit: $(minMoneyLimitList[index]).val(),
          maxMoneyLimit: $(maxMoneyLimitList[index]).val()
        }
      });
      return setInfoList;
    },

    fillFormInfo: function (root) {
      var self = this

      this.$('.js-fc-withdrawSet-dailyTimeLimit').val(root.dailyTimesLimit);
      this.bankContainer.html(self.getCfgHtml(root.bankCfgList));

      if (root.fullTimeService) {
        self.$('input[type="radio"][name="fullTimeService"][value="true"]').prop('checked', true);
      } else {
        self.$('input[type="radio"][name="fullTimeService"][value="false"]').prop('checked', true);
        this.$('.js-fc-withdrawSet-startTime').val(root.startTime);
        this.$('.js-fc-withdrawSet-endTime').val(root.endTime);
      }
      if(root.apiOpen){
        this.$('.js-fc-withdrawSet-apiOpen[value=0]').prop('checked',true);
      }else{
        this.$('.js-fc-withdrawSet-apiOpen[value=0]').prop('checked',false);
      }

      this.$('input[name=apiMinLimit]').val(_(root.apiMinLimit).convert2yuan());
      this.$('input[name=apiMaxLimit]').val(_(root.apiMaxLimit).convert2yuan());

      var html = [];
      _(root.keyAmount).each(function(amount){
        html.push(self.generateQuickAmountInput(amount));
      });
      var $btnContainer = this.$('.js-fc-wd-ws-btnContainer');
      //TODO 添加输入框
      $btnContainer.before(html.join(''));
      this.$FeeSwitch.prop('checked',root.feeOpen);
      this.$FeeType.find('option[value="'+root.feeType+'"]').prop('selected',true);
      var divid = 100;
      if(root.feeType==='fix'){
        divid = 10000;
      }
      this.$Fee.val(_(root.fee).formatDiv(divid,{fixed:0}));
      this.$MaxFee.val(_(root.feeLimit).formatDiv(10000,{fixed:0}));
      if(!this.$FeeSwitch.prop('checked')){
        this.changeFeeSetStatus('disabled');
      }

    },
    getCfgHtml: function (normalBankCfgList) {
      var html = [];
      _(normalBankCfgList).each(function (cfg, index, cfgList) {
        html.push('<label class="js-fc-withdrawSet-id col-sm-2 control-label" data-type="' + cfg.bankId + '">' + cfg.bankName + '</label>');
        html.push('<div class="form-group col-sm-10 form-inline">');
        html.push('<span class="col-sm-2 control-label ">最低：</span>');
        html.push('<div class="col-sm-4">');
        html.push('<div class=" input-group ">');
        html.push('<input type="text" class="js-fc-withdrawSet-minMoneyLimit form-control input-sm" value="' + _(cfg.minMoneyLimit).convert2yuan() + '" data-parsley-range="[0, 10000]" data-parsley-type="integer" required>');
        html.push('<span class="input-group-addon">元</span>');
        html.push('</div>');
        html.push('</div>');
        html.push('<span class="col-sm-2 control-label">最高：</span>');
        html.push('<div class="col-sm-4">');
        html.push('<div class=" input-group ">');
        html.push('<input type="text" class="js-fc-withdrawSet-maxMoneyLimit form-control input-sm" value="' + _(cfg.maxMoneyLimit).convert2yuan() + '" data-parsley-range="[0, 5000000]" data-parsley-type="integer" required>');
        html.push('<span class="input-group-addon">元</span>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
      });
      return html.join('');
    },

    insertNotice: function (html) {
      this.$('.js-fc-withdrawRangeSet-notice').html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    },
    //取消按钮
    cancelHandler: function(){
      this.onRender();
    },
    generateQuickAmountInput: function(amount){
      var html = [];
      html.push('<div class="col-sm-2 m-bottom-md">');
      html.push('<div class=" input-group ">');
      html.push('<input type="text" class="js-fc-rechargeSet-quickAmount-amount form-control input-sm" value="' + amount + '"  data-parsley-range="[0, 1000000]" data-parsley-type="integer" required >');
      html.push('<span class="input-group-addon">元</span>');
      html.push('</div>');
      html.push('</div>');
      return html.join('');
    },
    addQuickAmountInputHandler: function(e){
      var $target = $(e.currentTarget);
      var $btnContainer = $target.closest('.js-fc-wd-ws-btnContainer');
      //TODO 添加输入框
      $btnContainer.before(this.generateQuickAmountInput(''));
    },
    delQuickAmountInputHandler: function(e){
      var $target = $(e.currentTarget);
      var $btnContainer = $target.closest('.js-fc-wd-ws-btnContainer');
      //TODO 添加输入框
      $btnContainer.prev().remove();
    },
    feeSwitchHandler: function(e){
      var $target = $(e.currentTarget);
      if($target.prop('checked')){
        this.changeFeeSetStatus(false);
      }else{
        this.changeFeeSetStatus('disabled');
      }
    },
    changeFeeSetStatus: function(flag){
      this.$FeeType.attr('disabled',flag).val('');
      this.$Fee.attr('disabled',flag).val('');
      this.$MaxFee.attr('disabled',flag).val('');
    }

  });

  module.exports = WithdrawRangeSetView;
});