define(function (require, exports, module) {

  var RechargeRangeSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-RechargeSet-ReturnFee.html'),

    events: {
      'click .js-fc-rechargeSet-returnFee-submit': 'rechargeSetReturnFeeSubmitHandler',
      'click .js-fc-rechargeSet-returnFee-cancel': 'cancelHandler',
      'blur .js-fc-rechargeSet-returnFee-rate': 'clearInputTextHandler',
      'blur .js-fc-rechargeSet-returnFee-amount': 'clearInputTextHandler',
      'click .js-fc-rechargeSet-radio':'changeReturnFeeMode'

    },

    initialize: function () {

    },
    findRechargeReturnFeeXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/feecfgdetail.json',
        data: data
      });
    },
    saveRechargeReturnFeeSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/savefeecfg.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      this.bankContainer = self.$('.js-fc-rechargeSet-returnFee-cfgCommon-bank-container');
      //this.platformContainer = self.$('.js-fc-rechargeSet-returnFee-cfgCommon-platform-container');
      this.largeContainer = self.$('.js-fc-rechargeSet-returnFee-cfgLarge-container');

      this.normalMoneyLimit = self.$('.js-fc-rechargeSet-returnFee-normalMoneyLimit');
      this.largeMoneyLimit = self.$('.js-fc-rechargeSet-returnFee-largeMoneyLimit');
      self.findRechargeReturnFeeXhr().fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          self.insertNotice('获取配置信息失败，' + res.msg);
        }
      });

    },
    rechargeSetReturnFeeSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);

      //todo 校验添加
      var $currContainer = $('.js-fc-rechargeSet-returnFee-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {


        var normalBankCfgList = this.getSetInfoListFromContainer(this.bankContainer,'normalFeeType');
        //var normalPlatformCfgList = this.getSetInfoListFromContainer(this.platformContainer);
        var largeBankCfgList = this.getSetInfoListFromContainer(this.largeContainer,'largeFeeType');

        var data = {
          normalMoneyLimit: this.normalMoneyLimit.val(),
          largeMoneyLimit: this.largeMoneyLimit.val(),
          normalBankCfgList: normalBankCfgList,
          //  normalPlatformCfgList: normalPlatformCfgList,
          largeBankCfgList: largeBankCfgList
        };
        $target.button('loading');
        this.saveRechargeReturnFeeSetXhr(data).always(function () {
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.onRender();
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }

    },
    getSetInfoListFromContainer: function ($container,name) {
      var idList = $container.find('.js-fc-rechargeSet-id');
      //var feeTypeList = $container.find('input[type=radio].');
      var percentList = $container.find('.js-fc-rechargeSet-returnFee-rate');
      var moneyList = $container.find('.js-fc-rechargeSet-returnFee-amount');

      var setInfoList = _(idList).map(function (id, index, inList) {
        return {
          bankId: $(id).data('type'),
          feeType:$container.find('input[type=radio][name='+name+index+']:checked').val(),
          percent: $(percentList[index]).val(),
          money: $(moneyList[index]).val()
        }
      });
      return setInfoList;
    },

    fillFormInfo: function (root) {
      var self = this;
      this.bankContainer.html(self.getCfgHtml(root.normalBankCfgList,'normalFeeType'));
      this.largeContainer.html(self.getCfgHtml(root.largeBankCfgList,'largeFeeType'));
      this.normalMoneyLimit.val(_(root.normalMoneyLimit).convert2yuan());
      this.largeMoneyLimit.val(_(root.largeMoneyLimit).convert2yuan());
      self.initReturnFeeMode(root.normalBankCfgList,'normalFeeType');
      self.initReturnFeeMode(root.largeBankCfgList,'largeFeeType');
    },
    getCfgHtml: function (normalBankCfgList,name) {
      var self = this;
      var html = [];

      var validate1 = '';
      var validate2 = '';
      if(name === 'normalFeeType'){
        validate1 = 'data-parsley-twoDecimal data-parsley-range="[0, 100]"  required';
        validate2 = 'data-parsley-range="[0, 500000]" data-parsley-type="integer" required ';
      }else if(name === 'largeFeeType'){
        validate1 = 'data-parsley-twoDecimal data-parsley-range="[0, 100]"  required';
        validate2 = 'data-parsley-range="[0, 2500000]" data-parsley-type="integer" required ';
      }
      _(normalBankCfgList).each(function (cfg, index, cfgList) {
        html.push('<label class="js-fc-rechargeSet-id col-sm-2 control-label" data-type="' + cfg.bankId + '">' + cfg.bankName + '</label>');
        html.push('<div class="form-group col-sm-10 form-inline">');
        html.push('<span class="col-sm-2 control-label "><input type="radio" class="js-fc-rechargeSet-radio" name="'+name+index+'" value="0">返还：</span>');
        html.push('<div class="col-sm-4">');
        html.push('<div class=" input-group ">');
        html.push('<input type="text" class="js-fc-rechargeSet-returnFee-rate form-control input-sm" value="' + _(cfg.percent).formatDiv(100) + '" '+validate1+' >');
        html.push('<span class="input-group-addon">%</span>');
        html.push('</div>');
        html.push('</div>');
        html.push('<span class="col-sm-2 control-label"><input type="radio" class="js-fc-rechargeSet-radio"  name="'+name+index+'" value="1">返还：</span>');
        html.push('<div class="col-sm-4">');
        html.push('<div class=" input-group ">');
        html.push('<input type="text" class="js-fc-rechargeSet-returnFee-amount form-control input-sm" value="' + _(cfg.money).convert2yuan() + '"  '+validate2+'>');
        html.push('<span class="input-group-addon">元</span>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
      });
      return html.join('');
    },

    initReturnFeeMode:function(bankCfgList,name){
      _(bankCfgList).each(function (cfg, index, cfgList) {
        if(cfg.feeType === 0){
          self.$("input[name='"+name+index+"']").eq(0).click();
        }else if(cfg.feeType === 1){
          self.$("input[name='"+name+index+"']").eq(1).click();
        }
      });
    },

    changeReturnFeeMode:function(e){
      var self = this;
      var $target = $(e.currentTarget);

      if($target.val() == 0){
        $target.parents('span').nextAll().eq(2).find('input:first').attr('readonly',true);
        $target.parents('span').next('div').find('input:first').removeAttr('readonly');
      }else if($target.val() == 1){
        $target.parents('span').prev('div').find('input:first').attr('readonly',true);
        $target.parents('span').next('div').find('input:first').removeAttr('readonly');
      }

    },

    insertNotice: function (html) {
      this.$('.js-fc-rechargeRangeSet-notice').html(this._getErrorMsg(html));
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
    cancelHandler: function(){
      this.onRender();
    },
    clearInputTextHandler: function(e){
      var $target  = $(e.currentTarget);
      if($target.val()===''){
        $target.val(0);
      }
    }

  });

  module.exports = RechargeRangeSetView;
});