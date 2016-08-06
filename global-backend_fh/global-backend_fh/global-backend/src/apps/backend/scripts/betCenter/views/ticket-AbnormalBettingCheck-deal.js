/**
 * Created by David Zhang on 2015/9/19.
 */
define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!betCenter/templates/ticket-AbnormalBettingCheck-deal.html'),

    events: {

    },

    initialize: function () {
    },

    //审核异常投注
    dealBettingDepositXhr: function(data){
      return  Global.sync.ajax({
        url: '/intra/exceptionmng/approve.json',
        data: data
      });
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-bc-nwd-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-bc-nwd-deal-notice').removeClass('hidden');
        this.$('.js-bc-nwd-notDeal-notice').addClass('hidden');
        this.$('.js-bc-nwd-dealNum').html(num);

      }else if(type==='prevent'){
        this.$('.js-bc-nwd-deal-notice').addClass('hidden');
        this.$('.js-bc-nwd-notDeal-notice').removeClass('hidden');
        this.$('.js-bc-nwd-notDealNum').html(num);
      }
    },


    insertNotice: function ( html) {
      this.$('.js-bc-arManage-notice').html(this._getErrorMsg(html));
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