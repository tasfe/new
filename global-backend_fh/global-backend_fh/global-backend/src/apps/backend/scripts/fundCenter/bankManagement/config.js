define(function (require, exports, module) {

  var RechargeBankManagementView = Base.ItemView.extend({

    template: require('text!./config.html'),

    events: {
      'click .js-fc-tbm-submit': 'saveBankInfoHandler',
      'click .js-fc-tbm-cancel': 'cancelHandler'
    },

    initialize: function () {
    },

    //银行列表
    findBankListXhr: function () {
      return Global.sync.ajax({
        url: '/intra/paymanage/paybanklist.json',
        data: {
          platformId: this.options.platformId
        }
      });
    },

    //保存详情
    saveBankInfoXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/paymanage/savepaybank.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      this.$BankContainer = this.$('.js-fc-tbm-container');

      this.findBankListXhr()
        .done(function (res) {
        if (res.result === 0) {
          self.$BankContainer.html('');
          _(_(res.root||[]).sortBy(function(bank){
            return bank.index;
          })||[]).each(function (bank, index) {
            self.generateBankBlockl(bank);
            self.$BankContainer.sortable();
          });

        } else {
          Global.ui.notification.show('数据异常。');
        }
      });

    },
    generateBankBlockl: function (bank) {
      var html = [];
      html.push('<div class="col-sm-2  m-bottom-md" >');
      html.push('<label style=" margin: 3px 3px 3px 0; padding: 1px; width:100px; height: 25px; font-size: 1em; text-align: center; border:1px solid black;" >');
      html.push('<input type="checkbox"  name="bankname" required  class="js-fc-tbm-bank " data-id="'+bank.bankId+'" value="1" '+(bank.status===0?'checked':'')+' > '+bank.bankName+'</label>');
      html.push('</div>');
      this.$BankContainer.append(html.join(''));
    },

    saveBankInfoHandler: function (e) {
      var self = this;
      var $bankList = this.$('.js-fc-tbm-bank');
      var clpValidate = this.$('.js-fc-tbm-form').parsley().validate();
      if (!clpValidate) {
        return false;
      }
      var bankList = _($bankList).map(function(item,index){
        return {
          bankId: $(item).data('id'),
          status: $(item).prop('checked')?'0':'1',
          sort: index
        }
      });
      var data = {
        platformId: this.options.platformId,
        bankList : bankList
      };
      this.saveBankInfoXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('操作成功。');
          self.render();
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
    },
    cancelHandler: function(){
      this.onRender();
    }

  });

  module.exports = RechargeBankManagementView;
});