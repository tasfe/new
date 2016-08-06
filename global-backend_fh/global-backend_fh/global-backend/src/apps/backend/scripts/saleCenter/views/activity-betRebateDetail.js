define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var BetRebateDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!saleCenter/templates/activity-betRebateDetail.html'),

    events: {
    },

    initialize: function () {
      _(this.options).extend({
        title: '返水活动查看',
        columns: [
          {
            name: '活动时间',
            width: '10%'
          },
          {
            name: '用户名',
            width: '6%'
          },
          {
            name: '投注彩种',
            width: '6%'
          }
          ,
          {
            name: '投注金额',
            width: '6%'
          },
          {
            name: '返水奖金',
            width: '6%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/betrebate/betrebatelist.json'
        }
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-bri-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year')
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.dataList).map(function (dataInfo, index) {
        return {
          columnEls: this.formatRowData(dataInfo, index),
          dataAttr: dataInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
          pageIndex: this.filterHelper.get('pageIndex'),
          initPagination: true
        })

      this.grid.addRows({
          columnEls: [
            {
              content: '<strong>总计</strong>',
              colspan: 3
            },
            _(gridData.betTotal).convert2yuan(),
            _(gridData.rebateTotal).convert2yuan()
          ]
        })
        .hideLoading();
    },
    formatRowData: function (rowInfo) {
      var row = [];
      row.push(_(rowInfo.createTime).toTime());
      row.push(rowInfo.username);
      row.push(rowInfo.ticketName);
      row.push(_(rowInfo.bet).formatDiv(10000, {fixed: 4}));
      row.push(_(rowInfo.rebate).formatDiv(10000, {fixed: 4}));
      return row;
    }
  });
  module.exports = BetRebateDetailView;
});