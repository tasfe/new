"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var VipCashView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      tableClass:'table vip-table no-margin table-bordered table-no-lr table-center',
      columns: [
        {
          name: '发放时间',
          width: '25%'
        },
        {
          name: '礼金名称',
          width: '25%'
        },
        {
          name: '金额',
          width: '25%'
        },
        {
          name: '备注',
          width: '25%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/queryGiftsList.json',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.dataList',
      height: 400
    });
  },

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.startTime?this.options.startTime:_(moment().startOf('day')).toDate(),
      endDefaultDate: this.options.endTime?this.options.endTime:_(moment().endOf('day')).toDate(),
      //endOps:{
      //  viewMode: 'years',
      //  format: 'YYYY-MM-DD'
      //},
      //startOps:{
      //  viewMode: 'years',
      //  format: 'YYYY-MM-DD'
      //}
    }).render();
    this.$('.js-pf-search-grid').addClass('gauge');
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
      trClass: 'tr-footer',
      columnEls: [
        '<div class="text-hot">总计</div>',
        '<div class="text-hot">' + (gridData.totalMoney/10000) + '</div>',
        ''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.sendTime);
    row.push(rowInfo.giftsType);
    row.push(rowInfo.money/10000);
    row.push(rowInfo.remark);
    return row;
  }
});

module.exports = VipCashView;
