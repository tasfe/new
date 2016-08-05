define(function (require, exports, module) {

  var AbnormalWithdrawAuditView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-AuditRescindContract-Audit.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-fc-ac-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-fc-ac-deal-notice').removeClass('hidden');
        this.$('.js-fc-ac-notDeal-notice').addClass('hidden');
        this.$('.js-fc-ac-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-ac-reason').addClass('hidden');
        this.$('.js-fc-ac-deal-remark').attr('type','hidden');

      }else if(type==='prevent'){
        this.$('.js-fc-ac-deal-notice').addClass('hidden');
        this.$('.js-fc-ac-notDeal-notice').removeClass('hidden');
        this.$('.js-fc-ac-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-ac-reason').removeClass('hidden');
        this.$('.js-fc-ac-deal-remark').attr('type','text');
      }
    }

  });

  module.exports = AbnormalWithdrawAuditView;
});