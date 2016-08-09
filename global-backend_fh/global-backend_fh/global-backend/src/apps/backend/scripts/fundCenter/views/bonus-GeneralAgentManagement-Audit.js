define(function (require, exports, module) {

  var AbnormalWithdrawAuditView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-GeneralAgentManagement-Audit.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-fc-gm-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-fc-gm-deal-notice').removeClass('hidden');
        this.$('.js-fc-gm-notDeal-notice').addClass('hidden');
        this.$('.js-fc-gm-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-gm-reason').addClass('hidden');
        this.$('.js-fc-gm-deal-remark').attr('type','hidden');

      }else if(type==='prevent'){
        this.$('.js-fc-gm-deal-notice').addClass('hidden');
        this.$('.js-fc-gm-notDeal-notice').removeClass('hidden');
        this.$('.js-fc-gm-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-gm-reason').removeClass('hidden');
        this.$('.js-fc-gm-deal-remark').attr('type','text');
      }
    }

  });

  module.exports = AbnormalWithdrawAuditView;
});