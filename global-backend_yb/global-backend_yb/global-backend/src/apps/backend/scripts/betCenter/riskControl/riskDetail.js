/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {

  var commonRuleSetView = Base.ItemView.extend({

    template: require('text!./riskDetail.html'),

    getInfoXhr: function () {
      return Global.sync.ajax({
        url: '/intra/ticketmng/riskdata.json',
        data: {
          ticketId: this.options.ticketId,
          ticketPlanId: this.options.ticketPlanId
        }
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;

      this.getInfoXhr()
        .done(function (res) {
          var data;
          if (res && res.result === 0) {
            data = res.root || {};
            self.$('.js-bc-ticketName').text(data.ticketName);
            self.$('.js-bc-plan-id').text(data.ticketPlanId);
            self.$('.js-bc-bet-total').text(_(data.betTotal).convert2yuan());
            self.$('.js-bc-sale-time').text(_(data.ticketSaleStartTime).toTime()+'-'+_(data.ticketSaleEndTime).toTime());
            self.$('.js-bc-open-index').text(_(data.openIndex).formatDiv(100));
            self.$('.js-bc-open-nums').text(data.openNums);
            self.$('.js-bc-ticket-open-num').text(data.ticketOpenNum);
            self.$('.js-bc-prize-rate').text(_(data.prizeRate).formatDiv(100));
            self.renderGrid(data.dataList || []);
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    renderGrid: function(dataList) {
      var index = 0;
      this.$('.js-bc-grid').staticGrid({
        colModel: [
          {label: '序号', name: 'ticketOpenNum',  width: 100, formatter: function(val, info) {
            if (info.openNum) {
              info.trClass = 'warning';
            }
            return ++index;
          }},
          {label: '开奖号码', name: 'ticketOpenNum', width: 150},
          {label: '单期奖金', name: 'prizeTotal', width: 100,formatter: _.convert2yuan},
          {label: '单期中/投比', name: 'prizeRate', width: 100, formatter: function(val) {
            return _(val).formatDiv(100);
          }},
          {label: '当前截至投注时间', name: 'openTime', width: 100, formatter: function(val) {
            return _(val).toTime('H:mm:ss');
          }}
        ],
        row: dataList
      });
    }
  });

  module.exports = commonRuleSetView;
});