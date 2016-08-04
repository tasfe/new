define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/fund-ManualOperateCheck-Deal.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-fc-fundCheck-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-fc-fundCheck-pass-notice').removeClass('hidden');
        this.$('.js-fc-fundCheck-notPass-notice').addClass('hidden');
        this.$('.js-fc-fundCheck-dealNum').html(num);

      }else if(type==='prevent'){
        this.$('.js-fc-fundCheck-pass-notice').addClass('hidden');
        this.$('.js-fc-fundCheck-notPass-notice').removeClass('hidden');
        this.$('.js-fc-fundCheck-notDealNum').html(num);
      }
    },


    insertNotice: function ( html) {
      this.$('.js-fc-fundCheck-deal-notice').html(this._getErrorMsg(html));
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

  module.exports = operateCheckView;
});