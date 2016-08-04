define(function (require, exports, module) {
  var NewBlackIpView = require('globalCenter/views/newBlackIp');
  require('prefab/views/searchGrid');
  var OperateLogsView = Base.Prefab.SearchGrid.extend({

    template: require('text!authorityCenter/templates/operateLogs.html'),

    events: {
      'click .js-bl-add-ip': 'newBlackIpHandler'
    },

    initialize: function () {
      _(this.options).extend({
        title: '操作日志',
        columns: [
          {
            name: '用户名',
            width: '6%'
          },
          {
            name: '日志',
            width: '6%'
          },
          {
            name: 'IP',
            width: '6%'
          },
          {
            name: '时间',
            width: '6%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/sysusermng/userlogs.json'
        }
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-ol-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year')
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.logList).map(function (log, index) {
        return {
          columnEls: this.formatRowData(log, index),
          dataAttr: log
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      })
          .hideLoading();
    },

    formatRowData: function (rowInfo) {
      var row = [];

      row.push(rowInfo.username);
      row.push(rowInfo.operation);
      row.push(rowInfo.ip);
      row.push(_(rowInfo.operateTime).toTime());

      return row;
    }
  });

  module.exports = OperateLogsView;
});