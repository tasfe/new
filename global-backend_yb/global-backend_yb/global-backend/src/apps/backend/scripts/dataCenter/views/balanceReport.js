define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var BalanceReportView = Base.Prefab.SearchGrid.extend({

    template: require('text!dataCenter/templates/balanceReport.html'),

    events: {},

    initialize: function () {

      _(this.options).extend({
        title: '余额报表',
        columns: [
          {
            name: '日期',
            width: '50%'
          },
          {
            name: '余额',
            width: '50%'
          }
        ],
        pagination: true,
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/sysreport/balancereport.json'
        }
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-dc-br-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'day'),
        startFormat: 'YYYY-MM-DD',
        endFormat: 'YYYY-MM-DD',
        strDefaultValue: moment().add(-6,'day').format('YYYY-MM-DD'),
        endDefaultValue: moment().format('YYYY-MM-DD'),
        showToday: true
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.dataList).map(function (amount, index) {
        return {
          columnEls: this.formatRowData(amount, index),
          dataAttr: amount
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      this.$('.js-dc-br-currentBalance').html(_(gridData.currentBalance).convert2yuan({fixed:4, clear: false}));
      //加上统计行
      this.grid
      //  .addRows({
      //  columnEls: [
      //    '<strong>总结</strong>',
      //    {
      //      colspan: 1
      //    },
      //    _(gridData.upTransferTotal).convert2yuan({fixed:2, clear: false}),
      //    _(gridData.downTransferTotal).convert2yuan({fixed:2, clear: false}),
      //    gridData.transferTimesTotal
      //  ]
      //})
        .hideLoading();

    },

    formatRowData: function (rowInfo) {
      var row = [];
      row.push(rowInfo.day);
      row.push(_(rowInfo.balance).convert2yuan({fixed:4, clear: false}));
      return row;
    }
  });

  module.exports = BalanceReportView;
});
//56250