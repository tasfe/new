define(function (require, exports, module) {

  var AbnormalWithdrawAuditView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-FirstGenerationMan-Audit.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-fc-fm-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-fc-fm-deal-notice').removeClass('hidden');
        this.$('.js-fc-fm-notDeal-notice').addClass('hidden');
        this.$('.js-fc-fm-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-fm-reason').addClass('hidden');
        this.$('.js-fc-fm-deal-remark').attr('type','hidden');

      }else if(type==='prevent'){
        this.$('.js-fc-fm-deal-notice').addClass('hidden');
        this.$('.js-fc-fm-notDeal-notice').removeClass('hidden');
        this.$('.js-fc-fm-au-username').html(this.options.usernameList.join(','));

        this.$('.js-fc-fm-reason').removeClass('hidden');
        this.$('.js-fc-fm-deal-remark').attr('type','text');
      }
    }

  });

  module.exports = AbnormalWithdrawAuditView;
});