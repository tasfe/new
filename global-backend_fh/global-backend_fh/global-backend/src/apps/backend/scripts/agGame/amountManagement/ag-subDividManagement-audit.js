define(function (require, exports, module) {

  var AbnormalWithdrawAuditView = Base.ItemView.extend({

    template: require('text!agGame/amountManagement/ag-subDividManagement-audit.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-ag-sub-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-ag-sub-deal-notice').removeClass('hidden');
        this.$('.js-ag-sub-notDeal-notice').addClass('hidden');
        this.$('.js-ag-sub-au-username').html(this.options.usernameList.join(','));

        this.$('.js-ag-sub-reason').addClass('hidden');
        this.$('.js-ag-sub-deal-remark').attr('type','hidden');

      }else if(type==='prevent'){
        this.$('.js-ag-sub-deal-notice').addClass('hidden');
        this.$('.js-ag-sub-notDeal-notice').removeClass('hidden');
        this.$('.js-ag-sub-au-username').html(this.options.usernameList.join(','));

        this.$('.js-ag-sub-reason').removeClass('hidden');
        this.$('.js-ag-sub-deal-remark').attr('type','text');
      }
    }

  });

  module.exports = AbnormalWithdrawAuditView;
});