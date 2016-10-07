"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var SalaryManageLowLeveView2 = SearchGrid.extend({

  template: require('agencyCenter/templates/salaryManageLowLevel2.html'),

  className: 'lowLevelManage-view salary-view',

  clickType: 0,

  events: {
    'click .js-get-salary': 'getSalary',
    'click .js-add-salary-user': 'addSalaryUserHandler',
    'click .js-select-submit': 'selectListHandler'
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
        emptyTip: '没有信息'
      },
      ajaxOps: {
        url: '/info/agentWages/list.json'
      }
    });

    this.on('router:back', function() {
      this._getGridXhr();
    });
  },

  selectListHandler: function () {
    if (this.clickType == 0) {
      this.$('.js-selectDateGetList').removeClass('sd');
    }
  },

  addSalaryUserHandler: function () {
    $(document).addSalaryUser();
  },


  getSalary: function () {
    this.doRebateXhr()
    .done(function(res) {
      if (res && res.result === 0) {
        $('.js-get-salary').html('已领取');
        $('.js-get-salary').removeClass('.js-get-salary').removeClass('.get-red');
        Global.ui.notification.show('领取成功！');
      } else {
        Global.ui.notification.show(res.msg);
      }
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

  doRebateXhr: function() {
    return Global.sync.ajax({
      url: '/info/rebateactivity/doget.json',
      data: {
        activityId: 6
      }
    });
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.itemList).map(function(fundTrace, index, betList) {
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

    this.grid.addFooterRows3({
      trClass: 'julien-table-footer',
      columnEls: [
        '总计',
        _(gridData.betTotal).fixedConvert2yuan(),
        _(gridData.wagesTotal).fixedConvert2yuan()
      ],
      iIs: iIs
    }).hideLoading();
  },

  formatRowData:function(rowInfo) {
    var row = [];
    row.push(_(rowInfo.date).toDate());
    row.push(_(rowInfo.bet).fixedConvert2yuan());
    row.push(_(rowInfo.profit).fixedConvert2yuan());
    row.push(rowInfo.rate + '%');
    row.push(_(rowInfo.wages).fixedConvert2yuan());

    var timestamp = Date.parse(new Date()) - 86400000;
    if (rowInfo.status == 0) {
      if (_(timestamp).toDate() == _(rowInfo.date).toDate()) {
        row.push('<span class="js-get-salary get-red">领取</span>');
      }
      else{
        row.push('<span class="get-no">未领取</span>');
      }
    }
    else{
      row.push('<span class="get-no">已领取</span>');
    }

    return row;
  }
});

module.exports = SalaryManageLowLeveView2;