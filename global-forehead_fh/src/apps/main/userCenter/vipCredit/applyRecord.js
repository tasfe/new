"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var ApplyRecordView = SearchGrid.extend({

  template: require('./applyRecord.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '申请日期',
          width: '30%'
        },
        {
          name: '申请金额',
          width: '15%'
        },
        {
          name: '批准金额',
          width: '15%'
        },
        {
          name: '审核状态',
          width: '20%'
        },
        {
          name: '审核结果说明',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/creditFundReqList.json',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.dataList',
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


    var d=new Date(rowInfo.applyDate);
    var year=d.getFullYear();
    var day=d.getDate();
    var month=+d.getMonth()+1;
    var hour=d.getHours();
    var minute=d.getMinutes();
    var second=d.getSeconds();
    row.push(year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);

    //row.push(rowInfo.applyDate);
    row.push(rowInfo.loanMoney/10000);
    row.push(rowInfo.finalMoney/10000);
    row.push(rowInfo.checkType);
    row.push(rowInfo.checkResult);
    return row;
  }
});

module.exports = ApplyRecordView;
