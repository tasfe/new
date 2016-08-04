define(function(require, exports, module) {
  require('prefab/views/searchGrid');

  var deviceTypeConfig = require('skeleton/misc/deviceTypeConfig');

  var BonusDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!saleCenter/loginActivity/detail.html'),

    events: {},

    initialize: function() {
      _(this.options).extend({
        title: '加奖活动查看',
        columns: [
          {
            name: '时间',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '奖励金额',
            width: '10%'
          },
          {
            name: '奖励类型',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        reqData: {
          activityId: 13
        },
        ajaxOps: {
          url: '/intra/activitymanage/iosloginlist.json'
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
      })
        .hideLoading();
    },
    formatRowData: function(rowInfo) {
      var row = [];
      row.push(_(rowInfo.createTime).toTime());
      row.push(rowInfo.userName);
      row.push(_(rowInfo.bonus).formatDiv(10000, {fixed: 4}));

      row.push(deviceTypeConfig.toZh(rowInfo.deviceType));

      return row;
    }

  });
  module.exports = BonusDetailView;
});