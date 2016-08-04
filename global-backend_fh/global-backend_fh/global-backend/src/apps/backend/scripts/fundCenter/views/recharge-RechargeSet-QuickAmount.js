define(function (require, exports, module) {

  var RechargeRangeSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-RechargeSet-quickAmount.html'),

    events: {
      'click .js-fc-re-rs-qa-add': 'addQuickAmountInputHandler',
      'click .js-fc-re-rs-qa-del': 'delQuickAmountInputHandler',
      'click .js-fc-rechargeSet-quickAmount-submit': 'rechargeSetquickAmountSubmitHandler',
      'click .js-fc-rechargeSet-quickAmount-cancel': 'cancelHandler'
    },

    initialize: function () {

    },
    findRechargequickAmountXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/amountcfgdetail.json',
        data: data
      });
    },
    saveRechargequickAmountSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/saveamountcfg.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      this.bankContainer = self.$('.js-fc-rechargeSet-quickAmount-cfgCommon-container');
      this.alipayContainer = self.$('.js-fc-rechargeSet-quickAmount-alipay-container');
      this.wxpayContainer = self.$('.js-fc-rechargeSet-quickAmount-wxpay-container');
      this.aliTransferContainer = self.$('.js-fc-rechargeSet-quickAmount-aliTransfer-container');
      this.wxTransferContainer = self.$('.js-fc-rechargeSet-quickAmount-wxTransfer-container');

      self.findRechargequickAmountXhr().fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          self.insertNotice('获取配置信息失败，' + res.msg);
        }
      });

    },
    addQuickAmountInputHandler: function(e){
      var $target = $(e.currentTarget);
      var $btnContainer = $target.closest('.js-fc-re-rs-qa-btnContainer');
      //TODO 添加输入框
      $btnContainer.before(this.generateQuickAmountInput(''));
    },
    delQuickAmountInputHandler: function(e){
      var $target = $(e.currentTarget);
      var $btnContainer = $target.closest('.js-fc-re-rs-qa-btnContainer');
      //TODO 添加输入框
      $btnContainer.prev().remove();
    },
    rechargeSetquickAmountSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);

      //todo 校验添加
      var $currContainer = $('.js-fc-rechargeSet-quickAmount-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        var normalBankCfgList = this.getSetInfoListFromContainer(this.bankContainer);
        var alipayCfgList = this.getSetInfoListFromContainer(this.alipayContainer);
        var wxpayCfgList = this.getSetInfoListFromContainer(this.wxpayContainer);
        var aliTransferCfgList = this.getSetInfoListFromContainer(this.aliTransferContainer);
        var wxTransferCfgList = this.getSetInfoListFromContainer(this.wxTransferContainer);
        if(_(normalBankCfgList).size()===0){
          this.insertNotice('请先为每个支付方式设置快捷金额!');
          return false;
        }else{
          this.insertNotice('');
        }
        var data = {
          wangyin: normalBankCfgList,
          alipay: alipayCfgList,
          wxpay: wxpayCfgList,
          aliTransfer:aliTransferCfgList,
          wxTransfer:wxTransferCfgList,
          type:0
        };
        $target.button('loading');
        this.saveRechargequickAmountSetXhr(data).always(function () {
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
    getSetInfoListFromContainer: function ($container) {
      var configList = $container.find('.js-fc-re-rs-qa-temp');
      var flag = true;

      var setInfoList = _(configList).map(function (config, index, inList) {
        var amount = [];
        _($(config).find('.js-fc-rechargeSet-quickAmount-amount')).each(function(item){
          amount.push($(item).val());
        });
        if(_(amount).size()===0){
          flag =false;
        }
        return {
          platformId: $(config).data('id'),
          amount: amount.join(',')
        }
      });
      return flag?setInfoList:[];
    },

    fillFormInfo: function (root) {
      var self = this;
      this.bankContainer.html(self.getCfgHtml(root.wangyin));
      this.alipayContainer.html(self.getCfgHtml(root.alipay));
      this.wxpayContainer.html(self.getCfgHtml(root.wxpay));
      this.aliTransferContainer.html(self.getCfgHtml(root.aliTransfer));
      this.wxTransferContainer.html(self.getCfgHtml(root.wxTransfer));
    },
    getCfgHtml: function (normalBankCfgList,name) {
      var self = this;
      var html = [];

      _(normalBankCfgList).each(function (cfg, index, cfgList) {
        html.push('<label class="col-sm-2 control-label" >' + cfg.platformName + '</label>');
        html.push('<div class="js-fc-re-rs-qa-temp form-group col-sm-10 form-inline" data-id="' + cfg.platformId + '">');
        _(cfg.amount).each(function(amount){
          html.push(self.generateQuickAmountInput(amount));
        });
        html.push('<div class="js-fc-re-rs-qa-btnContainer col-sm-4 m-bottom-md">');
        html.push('<input type="button" class="js-fc-re-rs-qa-add btn btn-link" value="增加">');
        html.push('<input type="button" class="js-fc-re-rs-qa-del btn btn-link" value="删除">');
        html.push('</div>');
        html.push('</div>');
      });
      return html.join('');
    },
    generateQuickAmountInput: function(amount){
      var html = [];
      html.push('<div class="col-sm-4 m-bottom-md">');
      html.push('<div class=" input-group ">');
      html.push('<input type="text" class="js-fc-rechargeSet-quickAmount-amount form-control input-sm" value="' + amount + '"  data-parsley-range="[0, 1000000]" data-parsley-type="integer" required >');
      html.push('<span class="input-group-addon">元</span>');
      html.push('</div>');
      html.push('</div>');
      return html.join('');
    },

    insertNotice: function (html) {
      this.$('.js-fc-rechargequickAmountSet-notice').html(html===''?html:this._getErrorMsg(html));
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

  module.exports = RechargeRangeSetView;
});