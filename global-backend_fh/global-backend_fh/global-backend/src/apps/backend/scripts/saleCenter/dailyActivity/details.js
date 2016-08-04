define(function(require, exports, module) {
  require('prefab/views/searchGrid');

  var prizeConfig = require('./prizeConfig');

  var BonusDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!./details.html'),

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
            name: '日均销量',
            width: '10%'
          },
          {
            name: '奖金金额',
            width: '10%'
          },
          {
            name: '奖励周期',
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
          url: '/intra/activitymanage/saleslist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-lad-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
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
      });

      this.grid.addRows({
          columnEls: [
            {
              colspan: 3,
              content: '<strong>总计</strong>'
            },
            _(gridData.amountTotal).convert2yuan(),
            ''
          ]
        })
        .hideLoading();
    },
    formatRowData: function(rowInfo) {
      var row = [];

      row.push(_(rowInfo.time).toTime());
      row.push(rowInfo.username);
      row.push(_(rowInfo.sales).convert2yuan());
      row.push(_(rowInfo.amount).convert2yuan());
      row.push(rowInfo.cycle);

      return row;
    }

  });
  module.exports = BonusDetailView;
});