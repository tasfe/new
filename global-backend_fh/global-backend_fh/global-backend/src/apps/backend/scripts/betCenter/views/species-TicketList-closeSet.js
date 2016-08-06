/**
 * Created by David Zhang on 2015/9/12.
 */
define(function (require, exports, module) {

  var closeSetView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-closeSet.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-btn-submit': 'formSubmitHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {
      return Global.sync.ajax({
        url: '/intra/planmng/salestopinfo.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = this.$('.js-bc-form');
      self.$('.js-bc-ticketId').text(this._parentView.options.ticketId);
      var params = {ticketId:this._parentView.options.ticketId};
      this.getXxxXhr(params).always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('.js-bc-stopReason').val(res.root.stopReason);
            self.$('.js-start-time').val(_(res.root.stopStartTime).toTime());
            self.$('.js-end-time').val(_(res.root.stopEndTime).toTime());
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
      new Global.Prefab.Timeset({
        el: this.$('.js-bc-stopTime'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate:moment().add(1, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {

        Global.sync.ajax({
          url: '/intra/planmng/savesalestop.json',
          data:{
            ticketId:self.$('.js-bc-ticketId').text(),
            stopReason:self.$('.js-bc-stopReason').val(),
            stopStartTime:self.$('.js-start-time').val(),
            stopEndTime:self.$('.js-end-time').val()
          }
        })
          .always(function () {
            $target.button('reset');
          })
          .fail(function () {
            // 处理失败
          })
          .done(function (res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。');
              Global.appRouter.navigate(_('#bc/tl/planRules/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
                _t:_.now(),
                ticketName:self.$('.js-bc-ticketName').text()
              }), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }else{
        $target.button('reset');
      }
    },

    formCancelHandler:function(e){
      var self = this;
      Global.appRouter.navigate(_('#bc/tl/planRules/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
        _t:_.now(),
        ticketName:self.$('.js-bc-ticketName').text()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = closeSetView;
});