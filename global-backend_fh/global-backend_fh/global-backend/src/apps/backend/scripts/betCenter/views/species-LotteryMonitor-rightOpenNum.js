/**
 * Created by David Zhang on 2015/9/14.
 */
define(function (require, exports, module) {

  var RightOpenNumView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-LotteryMonitor-rightOpenNum.html'),

    //所有的事件绑定全部写在这！
    events: {
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    fixOpenNum:function(data){
      return Global.sync.ajax({
        url: '/intra/openmng/open.json',
        data: data
      });
    },

    onRender:function(){
      var self = this;
      self.$('.js-bc-ticketName').text(this.options.ticketName+"：");
      self.$('.js-bc-planId').text(this.options.planId+"期");
      self.$('.js-bc-wrongOpenNum').text(this.options.openNum);
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

  module.exports = RightOpenNumView;
});