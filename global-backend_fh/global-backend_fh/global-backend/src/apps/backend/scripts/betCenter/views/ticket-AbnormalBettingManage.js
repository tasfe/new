/**
 * Created by David Zhang on 2015/9/2.
 */
define(function (require, exports, module) {

  var AbnormalBettingManageView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/ticket-AbnormalBettingManage.html'),

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
        url: '/intra/exceptionmng/cfginfo.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = this.$('.js-bc-form');

      this.getXxxXhr().always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('.js-bc-opMoneyTotalLimit').val(_(res.root.onePlanMoneyLimit).convert2yuan());
            self.$('.js-bc-opMoneyBetRateTotalLimit').val(res.root.onePlanMoneyBetRateLimit);
            self.$('.js-bc-opopMoneyLimit').val(_(res.root.moneyTotalLimit).convert2yuan());
            self.$('.js-bc-opopMoneyBetRateLimit').val(res.root.moneyBetTotalRateLimit);
            self.$('.js-bc-opSingleMoneyLimit').val(_(res.root.singleMoneyLimit).convert2yuan());
            self.$('.js-bc-opSingleMoneyBetRateLimit').val(res.root.singleMoneyBetRateLimit);
            self.$('.js-bc-opSerialWinPlanLimit').val(res.root.serialWinPlanLimit);
            self.$('.js-bc-opSerialWinBetLimit').val(res.root.serialWinBetLimit);
            self.$('.js-bc-opSerialWinBetNumLimit').val(res.root.serialWinBetNumLimit);
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        var reqParams = {};
        reqParams['onePlanMoneyLimit'] = self.$('.js-bc-opMoneyTotalLimit').val();
        reqParams['onePlanMoneyBetRateLimit'] = self.$('.js-bc-opMoneyBetRateTotalLimit').val();
        reqParams['moneyTotalLimit'] = self.$('.js-bc-opopMoneyLimit').val();
        reqParams['moneyBetTotalRateLimit'] = self.$('.js-bc-opopMoneyBetRateLimit').val();
        reqParams['singleMoneyLimit'] = self.$('.js-bc-opSingleMoneyLimit').val();
        reqParams['singleMoneyBetRateLimit'] =self.$('.js-bc-opSingleMoneyBetRateLimit').val();
        reqParams['serialWinPlanLimit'] = self.$('.js-bc-opSerialWinPlanLimit').val();
        reqParams['serialWinBetLimit'] = self.$('.js-bc-opSerialWinBetLimit').val();
        reqParams['serialWinBetNumLimit'] = self.$('.js-bc-opSerialWinBetNumLimit').val();
        Global.sync.ajax({
          url: ' /intra/exceptionmng/savecfg.json',
          data:reqParams
          //{
          //  onePlanMoneyLimit: self.$('.js-bc-opMoneyTotalLimit').val(),
          //  onePlanMoneyBetRateLimit: self.$('.js-bc-opMoneyBetRateTotalLimit').val(),
          //  moneyTotalLimit: self.$('.js-bc-opopMoneyLimit').val(),
          //  moneyBetTotalRateLimit: self.$('.js-bc-opopMoneyBetRateLimit').val(),
          //  singleMoneyLimit: self.$('.js-bc-opSingleMoneyLimit').val(),
          //  singleMoneyBetRateLimit: self.$('.js-bc-opSingleMoneyBetRateLimit').val(),
          //  serialWinPlanLimit: self.$('.js-bc-opSerialWinPlanLimit').val(),
          //  serialWinBetLimit: self.$('.js-bc-opSerialWinBetLimit').val(),
          //  serialWinBetNumLimit: self.$('.js-bc-opSerialWinBetNumLimit').val()
          //}
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
              Global.appRouter.navigate(_('#bc/am').addHrefArgs({
                _t:_.now()
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
      Global.appRouter.navigate(_('#bc/am').addHrefArgs({
        _t:_.now()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = AbnormalBettingManageView;
});