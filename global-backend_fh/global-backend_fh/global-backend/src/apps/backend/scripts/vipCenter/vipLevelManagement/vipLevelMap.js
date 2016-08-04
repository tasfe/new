/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {


  var VipLevelMapView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!vipCenter/vipLevelManagement/vipLevelMap.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-mp-btn-submit': 'formSubmitHandler',
      'click .js-mq-btn-cancel': 'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function () {
    },

    //发送请求
    _getLevelData: function () {
      return Global.sync.ajax({
        url: '/intra/vipmanager/exchangecfgdetail.json'
      });
    },

    onRender: function () {
      var self = this;
      this.$formContainer = this.$('.js-mp-form');
      this._loadPage('js-mp-constGrid');
    },

    _loadPage: function (classValue) {
      var self = this;
      this._getLevelData().done(function (res) {
        if (res.result === 0) {
          self._getTable(self._formatLevelData(res.root.itemList), classValue);
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },

    //获取表格
    _getTable: function (tableInfo, classValue) {
      var self = this;
      this.$('.'+ classValue).staticGrid({
        colModel: [
          {label: '彩种类型', name: 'type', merge: true, width: 150},
          {label: '彩种', name: 'ticket', merge: true, width: 150},
          {label: '投注与积分兑换比（元：分）', name: 'map', width: 150}
        ],
        row: tableInfo
      });
    },

    //格式化数据
    _formatLevelData: function (levels) {
      return _(levels).chain().map(function (level) {
        var type = level.ticketGroup;
        var tickets = level.itemList;
        return _(tickets).map(function (ticket) {
          var ticketName = ticket.ticketName;
          return {
            'type': type,
            'ticket': '<input type="text" hidden name="ticketId" class="js-mp-id" value="'+ticket.ticketId+'">'+ticketName,
            'map': '<div class="input-group"><input type="text" class="form-control js-mp-bet" name="bet" style="width: 100px;" value="'+_(ticket.bet).formatDiv(10000)+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer">：' +
            '<input type="text" style="width: 100px;" class="form-control js-mp-integral" name="integral" value="'+_(ticket.integral).formatDiv(10000)+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer"></div>'
          };
        });
      }).flatten().value();
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        var reqParams = {};
        var length = self.$('.js-mp-bet').length;
        var ticketIdInput;
        var ticketBetInput;
        var ticketValueInput;
        _.map(_.range(length), function(num){
          ticketIdInput = self.$('.js-mp-id').eq(num);
          ticketBetInput = self.$('.js-mp-bet').eq(num);
          ticketValueInput = self.$('.js-mp-integral').eq(num);
         // reqParams['itemCfg['+num+'].ticketId'] =  _(Number(ticketIdInput.attr('id').substr(20,ticketIdInput.attr('id').length))).formatMul(1);
          reqParams['itemCfg['+num+'].ticketId'] = ticketIdInput.val();
          reqParams['itemCfg['+num+'].bet'] = ticketBetInput.val();
          reqParams['itemCfg['+num+'].integral'] = ticketValueInput.val();
        });
        Global.sync.ajax({
          url: '/intra/vipmanager/saveexchangecfg.json',
          data: reqParams
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
              Global.appRouter.navigate(_('#vip/mp').addHrefArgs({_t: _.now()}), {
                trigger: true,
                replace: false
              });
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }
    },

    formCancelHandler: function (e) {
      var self = this;
      Global.appRouter.navigate(_('#vip/mp').addHrefArgs({_t: _.now()}), {
        trigger: true,
        replace: false
      });
    }
  });

  module.exports = VipLevelMapView;
});