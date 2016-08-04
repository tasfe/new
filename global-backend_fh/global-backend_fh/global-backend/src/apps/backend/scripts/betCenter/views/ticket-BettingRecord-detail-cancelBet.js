/**
 * Created by David Zhang on 2015/9/16.
 */
define(function (require, exports, module) {

  var CancelBetView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/ticket-BettingRecord-detail-cancelBet.html'),

    //所有的事件绑定全部写在这！
    events: {
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    cancelBet:function(data){
      return Global.sync.ajax({
        url: '/intra/betmng/betcancel.json',
        data: data
      });
    },

    onRender:function(){
      var self = this;
      self.$('.js-bc-tradeNo').text('你确定要撤销订单'+this.options.tradeNo+'吗？')
    },

    insertNotice: function ( html) {
      this.$('.js-bc-rightOpenTime-notice').html(this._getErrorMsg(html));
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

  module.exports = CancelBetView;
});