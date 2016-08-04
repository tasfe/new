define(function(require, exports, module) {
  require('prefab/views/searchGrid');

  var BonusDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bonus-DailyDividManagement.html'),

    events: {},

    initialize: function() {
      _(this.options).extend({
        columns: [
          {
            name: '日期',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '团队亏损',
            width: '10%'
          },
          {
            name: '亏损分红',
            width: '10%'
          },
          {
            name: '发放状态',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        reqData: {
          activityId: 16
        },
        ajaxOps: {
          url: '/intra/dividmng/dailydividlist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-fc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        startOps: {
          format: 'YYYY-MM-DD'
        },
        endOps: {
          format: 'YYYY-MM-DD'
        },
        endDate: moment().add(1, 'year')
      }).render();

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function(gridData) {
      var rowsData = _(gridData.dataList).map(function(dataInfo, index) {
        return {
          columnEls: this.formatRowData(dataInfo, index),
          dataAttr: dataInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }) .hideLoading();

    },
    formatRowData: function(rowInfo) {
      var row = [];

      row.push(rowInfo.date);
      row.push(rowInfo.userName);
      row.push(_(rowInfo.profit).convert2yuan());
      row.push(_(rowInfo.amount).convert2yuan());
      row.push(rowInfo.status);

      return row;
    }

  });
  module.exports = BonusDetailView;
});