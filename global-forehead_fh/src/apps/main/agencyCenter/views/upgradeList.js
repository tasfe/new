"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var UpgradeListView = SearchGrid.extend({

  template: require('agencyCenter/templates/upgradeList.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '调整日期',
          width: '20%'
        },
        {
          name: '用户名',
          width: '20%'
        },
        {
          name: '原vip等级',
          width: '20%'
        },
        {
          name: '新vip等级',
          width: '20%'
        },
        {
          name: '调整类型',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/upgradeList.json',
        abort: false
      },
      viewType: 'team',
      reqData: {
        subUser: 1
      },
      listProp: 'root.dataList',
      height: 345
    });
  },

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
    }).render();
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    //加上统计行

    this.grid.addFooterRows({

    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.date);
    row.push(rowInfo.userName);
    row.push(rowInfo.beforeLevel);
    row.push(rowInfo.afterLevel);
    row.push(rowInfo.upgradeType);

    return row;
  }
});

module.exports = UpgradeListView;
