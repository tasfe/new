define(function (require, exports, module) {

  var AddOrEditCompanyCardView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-CompanyCardManagement-AddOrEdit.html'),

    events: {
      'change .js-fc-ccm-ae-bankId': 'changeBankOrTypeHandler',
      'change .js-fc-ccm-ae-cardType': 'changeBankOrTypeHandler'
    },

    initialize: function () {
    },
    //银行列表
    getBankListXhr: function () {
      return Global.sync.ajax({
        url: '/intra/bankmanage/limitebanklist.json'
      });
    },
    onRender: function () {
      var self = this;
      this.getBankListXhr().fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.bankInfo = res.root.bankList;
          var optionData = _(res.root.bankList || []).map(function (bank) {
            return {
              value: bank.bankId,
              text: bank.bankName
            }
          });
          self.renderSelect(optionData, self.$('.js-fc-ccm-ae-bankId'));
          self.$('.js-fc-ccm-ae-bankId').find('option[value='+self.options.bankId+']').prop('selected',true);
          self.changeBankOrTypeHandler();
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });

      this.$('.js-fc-ccm-ae-bankBranchName').val(this.options.bankBranchName);
      this.$('.js-fc-ccm-ae-name').val(this.options.name);
      this.$('.js-fc-ccm-ae-cardNo').val(this.options.cardNo);
      this.$('.js-fc-ccm-ae-cardType').find('option[value='+this.options.cardType+']').prop('selected',true);
      this.$('.js-fc-ccm-ae-cardId').val(this.options.cardId);
      this.changeBankOrTypeHandler();
    },
    changeBankOrTypeHandler: function () {
      var bankId = this.$('.js-fc-ccm-ae-bankId').val();
      var cardType = this.$('.js-fc-ccm-ae-cardType').val();
      if(!this.bankInfo){
        return false;
      }
      var bankInfo = _(this.bankInfo).filter(function (bank) {
        return bank.bankId+'' === bankId;
      });
      var defaultVal = '';
      if(_(bankInfo).size()>0){
        bankInfo = bankInfo[0];
        var minLimit = bankInfo.normalMinLimit || defaultVal;
        var maxLimit = bankInfo.normalMaxLimit || defaultVal;
        if (cardType === '2') {
          minLimit = bankInfo.largeMinLimit || defaultVal;
          maxLimit = bankInfo.largeMaxLimit || defaultVal;
        }
        this.$('.js-fc-ccm-ae-minMoney').html(_(minLimit).convert2yuan());
        this.$('.js-fc-ccm-ae-maxMoney').html(_(maxLimit).convert2yuan());
      }

    },
    renderSelect: function (data, $select) {
      var options = [];
      _(data).each(function (item) {
        var option = '<option value="' + item.value + '">' + item.text + '</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },

    insertNotice: function (html) {
      this.$('.js-fc-arManage-notice').html(this._getErrorMsg(html));
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
    }

  });

  module.exports = AddOrEditCompanyCardView;
});