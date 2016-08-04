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
            name: '保级奖金',
            width: '10%'
          },
          {
            name: '升级奖金',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        reqData: {
          activityId: 15
        },
        ajaxOps: {
          url: '/intra/activitymanage/upgradelist.json'
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
            _(gridData.curBonusTotal).convert2yuan(),
            _(gridData.upBonusTotalb).convert2yuan()
          ]
        })
        .hideLoading();
    },
    formatRowData: function(rowInfo) {
      var row = [];

      row.push(_(rowInfo.createTime).toTime());
      row.push(rowInfo.userName);
      row.push(_(rowInfo.dailySales).convert2yuan());
      row.push(_(rowInfo.curBonus).convert2yuan());
      row.push(_(rowInfo.upBonus).convert2yuan());

      return row;
    }

  });
  module.exports = BonusDetailView;
});