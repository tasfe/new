"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');
var BtnGroup = require('com/btnGroup');
var betStatusConfig = require('userCenter/misc/betStatusConfig');

var RechargeRecordsView = SearchGrid.extend({

  template: require('./withdrawRecords.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '交易流水号',
          width: '18%'
        },
        {
          name: '提现时间',
          width: '18%',
          sortable: true,
          id: -1
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
          width: '10%'
        },
        {
          name: '备注',
          width: '20%'
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
        subUser: 1
      },
      listProp: 'root.withdrawList',
      height: 345
    });
  },

  onRender: function() {
    var self = this;
    this.$('.js-pf-search-grid').addClass('bc-report-table');
    this.$btnGroup = this.$('.js-ac-btnGroup');
    this.$timeset = this.$('.js-ac-timeset');

    this.timeset = new Timeset({
      el: this.$timeset,
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      prevClass: 'js-pf'
      // startOps: {
      //   format: 'YYYY-MM-DD'
      // },
      // endOps: {
      //   format: 'YYYY-MM-DD'
      // }
    }).render();

    this.timeset.$startDate.on('dp.change', function() {
      if(self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.timeset.$endDate.on('dp.change', function() {
      if(self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      btnGroup: [
        {
          title: '今日',
          value: 0,
          active: true
        },
        {
          title: '昨天',
          value: -1
        },
        {
          title: '本半月',
          value: -15
        },
        {
          title: '本月',
          value: -30
        }
      ],
      onBtnClick: function(offset) {
        self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        self.search();
        return false;
      }
    }).render();
    
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

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
        '<div class="text-hot">所有页总计</div>', '', '',
        '<div class="text-hot">' + _(gridData.amountTotal).fixedConvert2yuan() + '</div>',
        '', '', ''
      ]
    }).hideLoading();

  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.userName);
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
