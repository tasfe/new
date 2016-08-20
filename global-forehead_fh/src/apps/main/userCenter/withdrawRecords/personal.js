"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var RechargeRecordsView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '交易流水号',
          width: '18%'
        },
        {
          name: '提现时间',
          width: '18%'
        },
        {
          name: '金额',
          width: '11%',
          sortable: true,
          id: 0
        },
        {
          name: '余额',
          width: '12%',
          sortable: true,
          id: 1
        },
        {
          name: '状态',
          width: '12%'
        },
        {
          name: '备注',
          width: '15%'
        }
      ],
      gridOps: {
        emptyTip: '没有提现记录'
      },
      ajaxOps: {
        url: '/fund/withdraw/withdrawlist.json',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.withdrawList',
      height: 345
    });
  },

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.startTime?this.options.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.endTime?this.options.endTime:_(moment().endOf('day')).toTime()
    }).render();

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.withdrawList).map(function(info, index, list) {
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
      //trClass: 'tr-footer',
      columnEls: [
        '<div class="text-hot">所有页总计</div>', '',
        '<div class="text-hot">' + _(gridData.amountTotal).fixedConvert2yuan() + '</div>',
        '', '', ''
      ]
    }).hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.tradeNo);
    row.push(_(rowInfo.createTime).toTime());
    row.push(_(rowInfo.amount).fixedConvert2yuan());
    row.push(_(rowInfo.balance).fixedConvert2yuan());
    row.push(rowInfo.status);
    row.push(rowInfo.remark);
    return row;
  }
});

module.exports = RechargeRecordsView;
