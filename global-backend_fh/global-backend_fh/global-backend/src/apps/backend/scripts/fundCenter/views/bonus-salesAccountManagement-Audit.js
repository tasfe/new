define(function (require, exports, module) {

  var AbnormalWithdrawAuditView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-salesAccountManagement-Audit.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-fc-sm-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-fc-sm-deal-notice').removeClass('hidden');
        this.$('.js-fc-sm-notDeal-notice').addClass('hidden');
        this.$('.js-fc-sm-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-sm-reason').addClass('hidden');
        this.$('.js-fc-sm-deal-remark').attr('type','hidden');

      }else if(type==='prevent'){
        this.$('.js-fc-sm-deal-notice').addClass('hidden');
        this.$('.js-fc-sm-notDeal-notice').removeClass('hidden');
        this.$('.js-fc-sm-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-sm-reason').removeClass('hidden');
        this.$('.js-fc-sm-deal-remark').attr('type','text');
      }
    }

  });

  module.exports = AbnormalWithdrawAuditView;
});