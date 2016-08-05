define(function (require, exports, module) {

  var RechargeRangeSetMobileView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-RechargeSet-Range-Mobile.html'),

    events: {
      'click .js-fc-rechargeSet-range-submit': 'rechargeSetSubmitHandler',
      'click .js-fc-rechargeSet-range-cancel': 'cancelHandler',
      'click .js-fc-rechargeSet-fullTimeService':'changeFullTimeService'
      /*,
      'click .js-fc-rechargeSet-largeAutoCheck':'swithLargeAutoCheck'*/

    },

    initialize: function () {

    },
    findRechargeRangeXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/limitcfgdetail.json',
        data: {
          type: 1
        }
      });
    },
    saveRechargeSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/savelimitcfg.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      var data = {};
      /*this.bankContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-bank-container');
      this.platformContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-platform-container');
      this.largeContainer = self.$('.js-fc-rechargeSet-range-cfgLarge-container');*/

      this.bankContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-bank-container');
      this.alipayContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-alipay-container');
      this.wxpayContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-wxpay-container');
      this.aliTransferContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-aliTransfer-container');
      this.wxTransferContainer = self.$('.js-fc-rechargeSet-range-cfgCommon-wxTransfer-container');

      self.findRechargeRangeXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });

    },
    rechargeSetSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-fc-rechargeSet-range-range-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        var normalBankCfgList = this.getSetInfoListFromContainer(this.bankContainer);
        var alipayCfgList = this.getSetInfoListFromContainer(this.alipayContainer);
        var wxpayCfgList = this.getSetInfoListFromContainer(this.wxpayContainer);
        var aliTransferCfgList = this.getSetInfoListFromContainer(this.aliTransferContainer);
        var wxTransferCfgList = this.getSetInfoListFromContainer(this.wxTransferContainer);

        var data = {
          fullTimeService: this.$('input[type=radio][name=fullTimeService]:checked').val(),
          startTime: this.$('.js-fc-rechargeSet-startTime').val(),
          endTime: this.$('.js-fc-rechargeSet-endTime').val(),
          /*expireTime: this.$('.js-fc-rechargeSet-expireTime').val(),
          largeAutoCheck: this.$('.js-fc-rechargeSet-largeAutoCheck').prop('checked') ? true : false,
          weekRechargeTotal: this.$('.js-fc-rechargeSet-weekRechargeTotal').val(),
          threeTimesRechargeTotal: this.$('.js-fc-rechargeSet-threeTimesRechargeTotal').val(),*/
          wangyin: normalBankCfgList,
          alipay: alipayCfgList,
          wxpay: wxpayCfgList,
          aliTransfer:aliTransferCfgList,
          wxTransfer:wxTransferCfgList,
          type:1
        };
        this.saveRechargeSetXhr(data).always(function () {
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }else{
        $target.button('reset');
      }

    },
    getSetInfoListFromContainer: function ($container) {
      var idList = $container.find('.js-fc-rechargeSet-id');
      var minMoneyLimitList = $container.find('.js-fc-rechargeSet-minMoneyLimit');
      var maxMoneyLimitList = $container.find('.js-fc-rechargeSet-maxMoneyLimit');
      return _(idList).map(function (id, index, inList) {
        return {
          bankId: $(id).data('type'),
          minMoneyLimit: $(minMoneyLimitList[index]).val(),
          maxMoneyLimit: $(maxMoneyLimitList[index]).val()
        }
      });
    },

    fillFormInfo: function (root) {
      var self = this;
      /*this.bankContainer.html(self.getCfgHtml(root.normalBankCfgList,'normalFeeType'));
      this.platformContainer.html(self.getCfgHtml(root.normalPlatformCfgList,'normalFeeType'));
      this.largeContainer.html(self.getCfgHtml(root.largeBankCfgList,'normalFeeType'));*/

      this.bankContainer.html(self.getCfgHtml(root.wangyin,'normalFeeType'));
      this.alipayContainer.html(self.getCfgHtml(root.alipay,'normalFeeType'));
      this.wxpayContainer.html(self.getCfgHtml(root.wxpay,'normalFeeType'));
      this.aliTransferContainer.html(self.getCfgHtml(root.aliTransfer,'normalFeeType'));
      this.wxTransferContainer.html(self.getCfgHtml(root.wxTransfer,'normalFeeType'));

      if (root.fullTimeService) {
        self.$('input[type="radio"][name="fullTimeService"][value="true"]').click();
      } else {
        self.$('input[type="radio"][name="fullTimeService"][value="false"]').click();
      }
      this.$('.js-fc-rechargeSet-startTime').val(root.startTime);
      this.$('.js-fc-rechargeSet-endTime').val(root.endTime);
    },
    getCfgHtml: function (normalBankCfgList,name) {
      var html = [];
      var validate1 = '';
      var validate2 = '';
      if(name === 'normalFeeType'){
        validate1 = ' data-parsley-type="integer" data-parsley-range="[0, 500]" required';
        validate2 = ' data-parsley-type="integer" data-parsley-range="[0, 1000000]" required';
      }/*else if(name === 'largeFeeType'){
        validate1 = 'data-parsley-type="integer" data-parsley-range="[0, 100000]" required';
        validate2 = 'data-parsley-type="integer" data-parsley-range="[0, 1000000]" required';
      }*/
      _(normalBankCfgList).each(function (cfg, index, cfgList) {
        html.push('<label class="js-fc-rechargeSet-id col-sm-2 control-label" data-type="' + cfg.bankId + '">' + cfg.bankName + '</label>');
        html.push('<div class="form-group col-sm-10 form-inline">');
        html.push('<span class="col-sm-2 control-label ">最低：</span>');
        html.push('<div class="col-sm-4">');
        html.push('<div class=" input-group ">');
        html.push('<input type="text" class="js-fc-rechargeSet-minMoneyLimit form-control input-sm" value="' + _(cfg.minMoneyLimit).formatDiv(10000) + '" '+ validate1+'>');
        html.push('<span class="input-group-addon">元</span>');
        html.push('</div>');
        html.push('</div>');
        html.push('<span class="col-sm-2 control-label">最高：</span>');
        html.push('<div class="col-sm-4">');
        html.push('<div class=" input-group ">');
        html.push('<input type="text" class="js-fc-rechargeSet-maxMoneyLimit form-control input-sm" value="' + _(cfg.maxMoneyLimit).convert2yuan() + '" '+validate2+' >');
        html.push('<span class="input-group-addon">元</span>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
      });
      return html.join('');
    },

    changeFullTimeService:function(e){
      var self = this;
      var $target = self.$(e.currentTarget);

      if($target.val() == "true"){
        self.$("select[name='startTime']").attr("disabled",true);
        self.$("select[name='endTime']").attr("disabled",true);
      }else if($target.val() == "false"){
        self.$("select[name='startTime']").attr("disabled",false);
        self.$("select[name='endTime']").attr("disabled",false);
      }
    },

    /*swithLargeAutoCheck:function(e){
      var self = this;
      var $target = self.$(e.currentTarget);

      if($target.val() == "true"){
        $target.val("false");
        self.$('.js-fc-rechargeSet-weekRechargeTotal').attr('readonly',false);
        self.$('.js-fc-rechargeSet-threeTimesRechargeTotal').attr('readonly',false);
      }else if($target.val() == "false"){
        $target.val("true");
        self.$('.js-fc-rechargeSet-weekRechargeTotal').attr('readonly',true);
        self.$('.js-fc-rechargeSet-threeTimesRechargeTotal').attr('readonly',true);
      }
    },*/

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
    }

  });

  module.exports = RechargeRangeSetMobileView;
});