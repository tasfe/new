"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var PrizeRecordView = SearchGrid.extend({

  template: require('./prizeRecord.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '领取时间',
          width: '25%'
        },
        {
          name: '累积中奖金额',
          width: '25%'
        },
        {
          name: '加奖比例',
          width: '25%'
        },
        {
          name: '加奖金额',
          width: '25%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/recordList.json',
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
      //trClass: 'tr-footer',
      columnEls: [
        '<div class="text-hot">总计</div>',
        '<div class="text-hot">' + gridData.prizeMoney/10000  + '</div>',
        '',
        '<div class="text-hot">' + gridData.money/10000  + '</div>'
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.currentDate);
    row.push(rowInfo.cumulatePrize/10000);
    row.push(rowInfo.proportion/10000+"%");
    row.push(rowInfo.money/10000);

    return row;
  }
});

module.exports = PrizeRecordView;
