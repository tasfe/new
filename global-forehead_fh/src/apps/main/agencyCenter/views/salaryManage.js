"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var SalaryManageView = SearchGrid.extend({

  template: require('agencyCenter/templates/salaryManage.html'),

  className: 'lowLevelManage-view',

  events: {
  },

  initialize: function() {
    _(this.options).extend({
      footerClass: 'border-cool-top',
      height: 400,
      title: '日工资管理',
      columns: [
        {
          name: '日期',
          width: '15%'
        },
        {
          name: '销量',
          width: '15%'
        },
        {
          name: '盈亏',
          width: '15%'
        },
        {
          name: '日工资比列',
          width: '15%'
        },
        {
          name: '所得日工资',
          width: '15%'
        },
        {
          name: '操作',
          width: '25%'
        }
      ],
      tip: 'juliencs',
      gridOps: {
        emptyTip: '没有工资'
      },
      ajaxOps: {
        url: '/info/agentWages/list.json'
      }
    });

    this.on('router:back', function() {
      this._getGridXhr();
    });
  },


  onRender: function () {
    //初始化时间选择
    var self = this;
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'fromDate',
      endTime: 'endDate',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      size: 'julien-time',
      prevClass: 'js-pf',
      startOps: {
        format: 'YYYY-MM-DD'
      },
      endOps: {
        format: 'YYYY-MM-DD'
      }
    }).render();

    //初始化彩种
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.detailList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });
    
    var iIs = 0;
    if (rowsData != null && rowsData != '') {
      iIs = 1;
    }

    this.grid.addFooterRows2({
      trClass: 'julien-table-footer',
      columnEls: [
        '所有页面总计',
        _(gridData.commissionAmount).fixedConvert2yuan()
      ],
      iIs: iIs
    }).hideLoading();
  },

  formatRowData:function(rowInfo) {
    var row = [];
console.log(rowInfo);
    row.push('<span class="text-coffee">'+rowInfo.consumeUser+'</span>'+(rowInfo.online?onlineStatus:''));
    row.push(rowInfo.relationship);
    row.push(_(rowInfo.consumeAmount).fixedConvert2yuan());
    row.push(_(rowInfo.commissionAmount).fixedConvert2yuan());

    return row;
  }
});

module.exports = SalaryManageView;