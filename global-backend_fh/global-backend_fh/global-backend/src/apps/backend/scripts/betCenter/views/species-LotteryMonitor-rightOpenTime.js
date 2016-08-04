/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {

  var RightOpenTimeView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-LotteryMonitor-rightOpenTime.html'),

    //所有的事件绑定全部写在这！
    events: {
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    fixOpenTime: function (data) {
      return Global.sync.ajax({
        url: '/intra/openmng/opentimefix.json',
        data: data
      });
    },

    onRender:function(){
      var self = this;
      self.$('.js-bc-rightOpenTimeInput').datetimepicker({
        useCurrent: false,
        format:'YYYY-MM-DD H:mm:ss'
      });
      self.$('.js-bc-rightOpenTimeInput').val(this.options.openTime);
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

  module.exports = RightOpenTimeView;
});